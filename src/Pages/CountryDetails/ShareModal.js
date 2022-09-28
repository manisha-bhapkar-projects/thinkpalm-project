import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Accordion, Card, Spinner } from "react-bootstrap";
import upArrow from "../../assets/images/modal-cb-down-arrow.svg"
import Checkbox from "../../Components/Inputs/Checkbox";
import styles from "./shareModal.module.scss"
import { connect } from "react-redux";
import { createCountryPDF } from "../../Store/reducers/country";

const { Toggle, Collapse } = Accordion;
const { Header, Title } = Modal;

class ShareModal extends React.Component {
    constructor(props) {
        super(props)
        this.onSuperTopicSelect = this.onSuperTopicSelect.bind(this)
        this.onTopicSelected = this.onTopicSelected.bind(this)
        this.onSubTopicSelected = this.onSubTopicSelected.bind(this)

        this.state = {
            selectedSuperTopics: [],
            selectedTopics: [],
            selectedSubTopics: [],
            selectedTerTopics: [],
            onButtonClick: false,
            downloadCheck: false
        }

    }

    toggleView = (e) => {
        this.setState({ defaultActiveKey: e })
    }

    async addAllToSelected(items = [], trackers) {
        let { selectedSuperTopics, selectedTopics, selectedSubTopics, selectedTerTopics } = trackers
        for (let item of items) {
            if (item.supertopicId) {
                selectedSuperTopics.push({ id: item.supertopicId, checked: true, contentId: item.supertopicContentId })
            }
            else if (item.topicId) {
                selectedTopics.push({ id: item.topicId, checked: true, contentId: item.topicContentId })
            }
            else if (item.subTopicId) {
                selectedSubTopics.push({ id: item.subTopicId, checked: true, contentId: item.subTopicContentId })
            }
            else if (item.tertiaryTopicId) {
                selectedTerTopics.push({ id: item.tertiaryTopicId, checked: true, contentId: item.tertiaryTopicContentId })
            }
            let child = item.topics || item.subTopics || item.tertiaryTopics
            if (child && child.length) {
                this.addAllToSelected(child, trackers)
            }
        }
    }

    componentDidMount() {
        const { specifics } = this.props
        const superTopics = (specifics && specifics.length && specifics[0]?.superTopicMetadatas) || []
        let selectedSuperTopics = [], selectedTopics = [], selectedSubTopics = [], selectedTerTopics = []
        this.addAllToSelected(superTopics, { selectedSuperTopics, selectedTopics, selectedSubTopics, selectedTerTopics })
        this.setState({ selectedSuperTopics, selectedTopics, selectedSubTopics, selectedTerTopics })
    }

    componentDidUpdate(prevProps) {
        if (this.props.isOpen === true && prevProps.isOpen === false) {
            const { specifics } = this.props
            const superTopics = (specifics && specifics.length && specifics[0]?.superTopicMetadatas) || []
            let selectedSuperTopics = [], selectedTopics = [], selectedSubTopics = [], selectedTerTopics = []
            this.addAllToSelected(superTopics, { selectedSuperTopics, selectedTopics, selectedSubTopics, selectedTerTopics })
            this.setState({
                selectedSuperTopics, selectedTopics, selectedSubTopics, selectedTerTopics,
                defaultActiveKey: null, activeTopic: null, activeSubtopic: null,
                onButtonClick: false
            })
        }
    }

    proceedPDFCreation = async () => {
        this.setState({
            onButtonClick: false,
        })
        await this.props.dispatch(createCountryPDF({
            country_id: this.props.country_id,
            data: {
                supertopics: this.state.selectedSuperTopics
                    .filter(item => item.checked)
                    .map(item => item.contentId),
                topics: this.state.selectedTopics
                    .filter(item => item.checked)
                    .map(item => item.contentId),
                subtopics: this.state.selectedSubTopics
                    .filter(item => item.checked)
                    .map(item => item.contentId),
                tertiarytopics: this.state.selectedTerTopics
                    .filter(item => item.checked)
                    .map(item => item.contentId),
            }

        }))
        this.setState({
            onButtonClick: true,

        })
        // this.props.onCloseClickListener();
    }

    onSuperTopicSelect = async (checked, superTopic) => {
        let { selectedSuperTopics } = this.state
        let array = [...selectedSuperTopics]
        if (checked) {
            if (!array.find(item => item.id === superTopic.supertopicId))
                array = [
                    ...array,
                    { id: superTopic.supertopicId, checked, contentId: superTopic.supertopicContentId }
                ]
            this.setState({ selectedSuperTopics: array })
        }
        else {
            let selectedIndex = array.findIndex(item => item.id === superTopic.supertopicId)
            array = [...selectedSuperTopics]
            array.splice(selectedIndex, 1)
            this.setState({ selectedSuperTopics: array })
        }
        if (superTopic?.topics?.length) {
            for (let topic of superTopic.topics) {
                await this.onTopicSelected(checked, topic, superTopic)
            }
        }
    }

    onTopicSelected = async (checked, topic, superTopic) => {
        let { selectedTopics } = this.state
        if (checked) {
            if (!selectedTopics.find(item => item.id === topic.topicId))
                await this.setState({
                    selectedTopics: [
                        ...selectedTopics,
                        { id: topic.topicId, checked, contentId: topic.topicContentId }
                    ]
                })
        }
        else {
            let selectedIndex = selectedTopics.findIndex(item => item.id === topic.topicId)
            let array = [...selectedTopics]
            array.splice(selectedIndex, 1)
            await this.setState({ selectedTopics: array })
        }
        if (topic?.subTopics?.length) {
            for (let subTopic of topic.subTopics) {
                await this.onSubTopicSelected(checked, subTopic, topic)
            }
        }
    }

    onSubTopicSelected = async (checked, subTopic, topic) => {
        let { selectedSubTopics } = this.state
        if (checked) {
            if (!selectedSubTopics.find(item => item.id === subTopic.subTopicId))
                await this.setState({
                    selectedSubTopics: [
                        ...selectedSubTopics,
                        { id: subTopic.subTopicId, checked, contentId: subTopic.subTopicContentId }
                    ]
                })
        }
        else {
            let selectedIndex = selectedSubTopics.findIndex(item => item.id === subTopic.subTopicId)
            let array = [...selectedSubTopics]
            array.splice(selectedIndex, 1)
            await this.setState({ selectedSubTopics: array })
        }
        if (subTopic?.tertiaryTopics?.length) {
            for (let terTopic of subTopic.tertiaryTopics) {
                await this.onTerTopicSelected(checked, terTopic, subTopic)
            }
        }
    }

    onTerTopicSelected = async (checked, terTopic, subTopic) => {
        let { selectedTerTopics } = this.state
        if (checked) {
            if (!selectedTerTopics.find(item => item.id === terTopic.tertiaryTopicId))
                await this.setState({
                    selectedTerTopics: [
                        ...selectedTerTopics,
                        { id: terTopic.tertiaryTopicId, checked, contentId: terTopic.tertiaryTopicContentId }
                    ]
                })
        }
        else {
            let selectedIndex = selectedTerTopics.findIndex(item => item.id === terTopic.tertiaryTopicId)
            let array = [...selectedTerTopics]
            array.splice(selectedIndex, 1)
            await this.setState({ selectedTerTopics: array })
        }
    }

    isSuperTopicChecked(superTopic, topics) {
        let checked = this.state.selectedSuperTopics.find(item => item.id === superTopic.supertopicId)?.checked || false
        if (checked && topics?.length) {
            let refs = topics.map(item => item.topicId)
            let selected = this.state.selectedTopics.filter(item => refs.includes(item.id))
            if (selected.length === 0) {
                return false
            }
            else if (selected.length === topics.length) {
                return true
            }
            else return -1
        }
        return checked
    }

    isTopicChecked(topic, subTopics) {
        let checked = this.state.selectedTopics.find(item => item.id === topic.topicId)?.checked || false
        if (checked && subTopics?.length) {
            let refs = subTopics.map(item => item.subTopicId)
            let selected = this.state.selectedSubTopics.filter(item => refs.includes(item.id))
            if (selected.length === 0) {
                return false
            }
            else if (selected.length === subTopics.length) {
                return true
            }
            else return -1
        }
        return checked
    }

    isSubTopicChecked(subTopic, terTopics) {
        let checked = this.state.selectedSubTopics.find(item => item.id === subTopic.subTopicId)?.checked || false
        if (checked && terTopics?.length) {
            let refs = terTopics.map(item => item.tertiaryTopicId)
            let selected = this.state.selectedTerTopics.filter(item => refs.includes(item.id))
            if (selected.length === 0) {
                return false
            }
            else if (selected.length === terTopics.length) {
                return true
            }
            else return -1
        }
        return checked
    }

    async onDetailsChecked(event) {
        let checked = event.target.checked
        const { specifics } = this.props
        const superTopics = (specifics && specifics.length && specifics[0]?.superTopicMetadatas) || []
        for (let superTopic of superTopics) {
            await this.onSuperTopicSelect(checked, superTopic)
        }
    }

    onDownloadCheck = () => {
        this.setState((prevState) => ({ ...prevState, downloadCheck: !prevState.downloadCheck }))
    }
    
    handlecCloseDone = () =>{
       this.props.onCloseClickListener();
        this.setState((prevState) => ({ ...prevState, downloadCheck: false }))
        
    }
    render() {
        const { isOpen, onCloseClickListener, specifics } = this.props
        const superTopics = (specifics && specifics.length && specifics[0]?.superTopicMetadatas) || []
        const {
            detailsCheck, countryCheck, defaultActiveKey,
            selectedSuperTopics, selectedTopics, selectedSubTopics, selectedTerTopics, downloadCheck, handlecCloseDone
        } = this.state
        return (
            <>
                <Modal
                    show={isOpen}
                    onHide={onCloseClickListener}
                    backdrop="static"
                    keyboard={false}
                    centered={true}
                    size="lg"
                    contentClassName="share-popup-custom-modal"
                    data-test="shareModal"
                >
                    <Header closeButton>
                        <Title>
                            Create PDF
                        </Title>
                    </Header>
                    <Modal.Body>
                        <div className={styles.modal_body}>
                            {!this.state.onButtonClick ? (

                                <div>
                                    <div className={styles.checkbox_1}>
                                        <Checkbox
                                            checked={true}
                                            onChange={(event) => this.setState({ countryCheck: event.target.checked })}
                                        >
                                        </Checkbox>
                                        <span className={styles.lbl_span}>Country Overview</span>
                                    </div>
                                    <div className={styles.checkbox_1}>
                                        <Checkbox
                                            checked={
                                                selectedSuperTopics.length === 0
                                                    ? false
                                                    : selectedSuperTopics.length === superTopics.length
                                                        ? true
                                                        : -1
                                            }
                                            onChange={this.onDetailsChecked.bind(this)}
                                        >
                                        </Checkbox>
                                        <span className={`${styles.lbl_span} ${selectedSuperTopics.length === 0
                                            ? ""
                                            : selectedSuperTopics.length === superTopics.length
                                                ? styles.lbl_selected
                                                : styles.lbl_selected}`}>Details</span>
                                    </div>
                                    <div className="child-align-left">
                                        {superTopics && superTopics.length ?
                                            <Accordion className={styles.accordions} activeKey={defaultActiveKey} onSelect={this.toggleView.bind(this)}>
                                                <Card className={styles.card}>
                                                    {superTopics.map(superTopic => {
                                                        let topics = superTopic.topics
                                                        return (
                                                            <>
                                                                <Toggle className={`${styles.card_header} ${styles.content_head}`} as={Card.Header} eventKey={superTopic.supertopicId} key={superTopic.supertopicId}>
                                                                    <Checkbox
                                                                        checked={this.isSuperTopicChecked(superTopic, topics)}
                                                                        onChange={event => this.onSuperTopicSelect(event.target.checked, superTopic)}
                                                                        className={styles.foobar}
                                                                    >
                                                                        {superTopic.supertopicName}
                                                                    </Checkbox>
                                                                    {topics.length ?
                                                                        <img src={upArrow} className={defaultActiveKey !== superTopic.supertopicId ? "" : styles.down} alt="image" />
                                                                        : null}
                                                                </Toggle>
                                                                {topics?.length ?
                                                                    <Collapse eventKey={superTopic.supertopicId}>
                                                                        <Accordion className={styles.sub_content_wrapper}
                                                                            activeKey={this.state.activeTopic}
                                                                            onSelect={(e) => this.setState({ activeTopic: e })}
                                                                        >
                                                                            {topics.map(topic => {
                                                                                let subTopics = topic.subTopics
                                                                                return (
                                                                                    <>
                                                                                        <Toggle as={(props) => <div {...props} className={`${styles.sub_content} ${styles.content_head}`}></div>} eventKey={topic.topicId} key={topic.topicId}>
                                                                                            <Checkbox type="secondary"
                                                                                                checked={this.isTopicChecked(topic, subTopics)}
                                                                                                onChange={(event) => this.onTopicSelected(event.target.checked, topic, superTopic)}
                                                                                            >
                                                                                                {topic.topicName}
                                                                                            </Checkbox>
                                                                                            {subTopics?.length ?
                                                                                                <img src={upArrow} className={this.state.activeTopic !== topic.topicId ? "" : styles.down} alt="image" />
                                                                                                : null}
                                                                                        </Toggle>
                                                                                        {subTopics?.length ?
                                                                                            <Collapse eventKey={topic.topicId}>
                                                                                                <Accordion className={styles.sub_content_wrapper}
                                                                                                    activeKey={this.state.activeSubtopic}
                                                                                                    onSelect={(e) => this.setState({ activeSubtopic: e })}
                                                                                                >
                                                                                                    {subTopics.map(subTopic => {
                                                                                                        let terTopics = subTopic.tertiaryTopics
                                                                                                        return (
                                                                                                            <>
                                                                                                                <Toggle as={(props) => <div {...props} className={`${styles.sub_content} ${styles.content_head}`}></div>} eventKey={subTopic.subTopicId} key={subTopic.subTopicId}>
                                                                                                                    <Checkbox type="tertiary"
                                                                                                                        checked={this.isSubTopicChecked(subTopic, terTopics)}
                                                                                                                        onChange={(event) => this.onSubTopicSelected(event.target.checked, subTopic, topic)}
                                                                                                                    >
                                                                                                                        {subTopic.subTopicName}
                                                                                                                    </Checkbox>
                                                                                                                    {terTopics?.length ?
                                                                                                                        <img src={upArrow} className={this.state.activeSubtopic !== subTopic.subTopicId ? "" : styles.down} alt="image" />
                                                                                                                        : null}
                                                                                                                </Toggle>
                                                                                                                {terTopics?.length ?
                                                                                                                    <Collapse eventKey={subTopic.subTopicId}>
                                                                                                                        <Accordion className={styles.sub_content_wrapper}>
                                                                                                                            {terTopics.map(terTopic => (
                                                                                                                                <Toggle as={(props) => <div {...props} className={`${styles.sub_content} ${styles.content_head}`}></div>} eventKey={terTopic.tertiaryTopicId} key={terTopic.tertiaryTopicId}>
                                                                                                                                    <div className="checkbox-wrapper">
                                                                                                                                        <Checkbox type="tertiary"
                                                                                                                                            checked={selectedTerTopics.find(item => item.id === terTopic.tertiaryTopicId)?.checked || false}
                                                                                                                                            onChange={(event) => this.onTerTopicSelected(event.target.checked, terTopic, subTopic)}
                                                                                                                                        >
                                                                                                                                            {terTopic.tertiaryTopicName}
                                                                                                                                        </Checkbox>
                                                                                                                                    </div>
                                                                                                                                </Toggle>
                                                                                                                            ))}
                                                                                                                        </Accordion>
                                                                                                                    </Collapse>
                                                                                                                    : null}
                                                                                                            </>
                                                                                                        )
                                                                                                    })}
                                                                                                </Accordion>
                                                                                            </Collapse>
                                                                                            : null}
                                                                                    </>
                                                                                )
                                                                            })}
                                                                        </Accordion>
                                                                    </Collapse>
                                                                    : null}
                                                            </>
                                                        )
                                                    })}
                                                </Card>
                                            </Accordion>
                                            : null}
                                    </div>
                                </div>


                            ) : (
                                <div className="create-pdf-div-style">Country Overview PDF for {this.props.countryName?.country_Name} was downloaded successfully</div>)}
                        </div>


                    </Modal.Body>

                    <Modal.Footer className="footer-text">
                        <div className="d-flex align-items-center px-3">
                            {!this.state.onButtonClick ?
                                <div>
                                    <div>
                                        <Checkbox
                                            className="checkbox"
                                            checked={downloadCheck}
                                            onChange={this.onDownloadCheck}
                                        >
                                        </Checkbox>
                                    </div>
                                    <div className="ml-4 share-modal-text">
                                        I acknowledge the information presented here changes quickly. The document being created is static and will not reflect future updates.
                                    </div>
                                </div> : ""}
                            <div className="footer-button">
                                <Button variant="primary" 
                                onClick={
                                    this.state.onButtonClick ? this.handlecCloseDone: this.proceedPDFCreation.bind(this)
                                }
                                    disabled={!downloadCheck || this.props.country?.pdfLoading}
                                    className={!downloadCheck ? "download-btn-inactive" : ""}
                                >

                                    <span>
                                        {this.props.country?.pdfLoading? <Spinner animation="border" size="sm" /> : this.state.onButtonClick ? "Done" : "Download"}
                                    </span>
                                </Button>
                            </div>
                        </div>


                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

const mapStateToProps = ({ country }) => (
    {
        country
    }
)

const mapDispatchToProps = (dispatch) => (
    {
        dispatch
    }
)

export default connect(mapStateToProps, mapDispatchToProps)(ShareModal);
