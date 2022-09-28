import React, { useEffect, useState } from "react";
import profile_img from "../../assets/images/dp.jpeg";
import country_img from "../../assets/images/Hero-Image-askan.jpg";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import { Tooltip } from "react-bootstrap"
import "./_home.scss"
import ContentLoader from "react-content-loader"
import constants from "../../utils/constants";
import { useHistory } from "react-router";
import { getCountryAlerts, getCountryBlogs, getCountryExpert } from "../../Store/reducers/country";
import { getExpertHours } from "../../Store/reducers/country";
import AskanExpertModal from "../CountryDetails/AskanExpertModal"
import { permissionMapping } from '../../utils/utils';
import HeadsUpPopup from '../headsUpPopup';


const severityTypes = {
  CRITICAL: {
    name: "Critical",
    color: "border-maroon",
    bullet: "maroon_bg"
  },
  MAJOR: {
    name: "Major",
    color: "border-yellow",
    bullet: "yellow_bg"
  },
  MINOR: {
    name: "Minor",
    color: "border_green",
    bullet: "green_bg"
  },
  OTHER: {
    name: "other",
    color: "border_green",
    bullet: "green_bg"
  }
}

const Card = (props) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const blogData = useSelector(state => state.country.blogData)
  const blogLoading = useSelector(state => state.country.blogLoading)
  const expertData = useSelector(state => state.country.expertData)
  const expertLoading = useSelector(state => state.country.expertLoading)
  const alertData = useSelector(state => state.country.alertData)
  const alertLoading = useSelector(state => state.country.alertLoading)
  const [showModal, setShowModal] = useState(false);
  const [showHelp, setShowHelp] = useState(false)
  const permissionArray = permissionMapping();
  const [expertHoursModal, setExpertHoursModal] = useState(false);
  const [countryForAskExpert, setCountryForAskExpertntry] = useState({

  })
  useEffect(async () => {
    // console.log("countryId", props.country.id)

    dispatch(getCountryAlerts({
      count: props.blogCount,
      id: props.country.id,
      countryName: props.name
    }))
  }, [props.country.id])

  useEffect(async () => {
    if (props.expertSolutions?.length) {
      getExperts()
    }
  }, [props.expertSolutions])

  useEffect(async () => {
    if (props.blogSolutions?.length) {
      getBlogs()
    }
  }, [props.blogSolutions])

  const getBlogs = async () => {
    let data = props.blogSolutions
    if (data.length) {
      let solutionId = data[0].solutionId
      dispatch(getCountryBlogs({
        countryName: props.name,
        data: {
          solutionName: ["Knowledge Base - Insights and Analysis - Articles", "Knowledge Base - Insights and Analysis - Whitepapers", "Knowledge Base - Insights and Analysis - Blogs"],
          Tag: [props.name]
        }
      }))
    }
  }
  const handleCloseModal = () => {
    setShowModal(false);
    setShowHelp(false)
  };
  const openModal = async (id) => {
    const exportCount = await getExpertHours(dispatch);
    if (exportCount && exportCount?.availableHours !== "") {
      if (Math.round(exportCount.availableHours) >= 10) {
        setExpertHoursModal(false);
        setShowModal(true);
        setCountryForAskExpertntry({ countryId: id?.id, countryName: id?.country_Name })
      } else if (!exportCount?.error) {
        setExpertHoursModal(true);
      } else {
        props.notify('Failed to validate your availability!')
      }
    }
  };

  const handleOpenAskExpertPopup = (id) => {
    setShowModal(true);

  };

  const getExperts = async () => {
    try {
      let data = props.expertSolutions
      if (data.length) {
        let solutionId = data[0].solutionId
        dispatch(getCountryExpert({
          countryName: props.name,
          data: {
            SolutionIds: [solutionId],
            Tags: [props.name],
            ShowTopicHierarchy: true,
          }
        }))
      }
    }
    catch (err) {
      return
    }
  }
  const getClassNameBySeverity = () => {
    if (!alertData || !alertData[props.name]) {
      return severityTypes.OTHER.color
    }
    if (alertData[props.name].find(item => item.severityType === severityTypes.CRITICAL.name)) {
      return severityTypes.CRITICAL.color
    }
    if (alertData[props.name].find(item => item.severityType === severityTypes.MAJOR.name)) {
      return severityTypes.MAJOR.color
    }
    if (alertData[props.name].find(item => item.severityType === severityTypes.MINOR.name)) {
      return severityTypes.MINOR.color
    }
    return severityTypes.OTHER.color
  }

  const getSeverity = (type) => {
    let severity
    for (let key in severityTypes) {
      if (severityTypes[key].name === type) severity = severityTypes[key]
    }
    if (severity) return severity
    else return severityTypes.OTHER
  }

  const getExpertImage = (expertData) => {
    //     let imageContent = expertData?.[0]?.topics?.length ?
    //     expertData[0].topics.find(item => item.topicName === "Expert Pic-" + expertData[0].supertopicName)
    //     : null

    // return imageContent?.topicContent


    if (expertData[props.name] && expertData[props.name].length && expertData[props.name][0]) {
      let imageContent = expertData[props.name][0]?.topics?.length ?
        expertData[props.name][0].topics.find(item => item.topicName === "Expert Pic-" + expertData[props.name][0].supertopicName)
        : null
      return imageContent?.topicContent
    }
    else return
  }

  const onCardClick = (event) => {
    history.push(`/details/${props.country.id}`)
  }
  const getAlertComponent = () => {
    return (
      alertLoading && alertLoading[props.name] ?
        <Loader />
        : alertData && alertData[props.name] && alertData[props.name].length ?
          <>
            <div className="category-name">
              {
                props.viewType === "card" &&
                <h6>ALERTS</h6>
              }
              <div className="h-line"></div>
            </div>

            <div className="alert-container" data-test='alert'>
              {alertData[props.name].map((alert, index) => (
                <div key={index} className={`details-wrap ${index !== 0 ? "mt-4" : ""}`}>
                  <span>
                    {alert.changeCategory}
                    <OverlayTrigger
                      overlay={(props) => (
                        <Tooltip id={`alert-icon-${alert.alertId}`} {...props}>
                          {alert.severityType || ""}
                        </Tooltip>
                      )}
                    >
                      <div
                        className={`round ${getSeverity(alert.severityType).bullet}`}
                      />
                    </OverlayTrigger>
                    <div className="date-ctrl">
                      {moment(alert.alertDate).format("MMM DD, YYYY")}
                    </div>
                  </span>
                  <span className="maintitle ellipsis main-title-wrap">
                    {alert.alertTitle}
                  </span>
                </div>
              ))}
            </div>
          </>
          :
          <>
            <div className="category-name">
              {
                props.viewType === "card" &&
                <h6>Alerts</h6>
              }
              <div className="h-line"></div>
            </div>
            <div className="details-wrap status-information nodata">
              <div>
                <span className="maintitle">No new alerts to show</span>
                <span className="date-ctrl word-white-space-nowrap">Last updated {moment().format("MMM DD, YYYY")}</span>
              </div>
            </div>
          </>

    )
  }
  const getBlogComponent = () => {
    return (
      blogLoading && blogLoading[props.name] ?
        <>
          <Loader />
        </>
        : blogData && blogData[props.name] && blogData[props.name].data && blogData[props.name].data.length ?
          <>
            <div className="category-name">
              {
                props.viewType === "card" &&
                <h6>INSIGHTS & ANALYSIS</h6>
              }
              <div className="h-line"></div>
            </div>
            <div className="blog-container" data-test='blogs'>
              {blogData[props.name].data.slice(0, 2).map((blog, index) => (
                <div key={blog.supertopicId} className={`details-wrap ${index !== 0 ? "mt-4" : ""}`}>
                  <span className="d-flex">
                    Article
                    <div className="article_date">
                      {moment(blog.createdAt).format("MMM DD, YYYY")}
                    </div>
                  </span>
                  <OverlayTrigger
                    overlay={(props) => (
                      <Tooltip id={`button-tooltip-${index}`} {...props}>
                        {blog.supertopicName}
                      </Tooltip>
                    )}
                  >
                    <span className="maintitle mt-1 mb-1 ellipsis">
                      {blog.supertopicName}
                    </span>
                  </OverlayTrigger>
                </div>
              ))}
            </div>
          </>
          :
          <>
            <div className="category-name">
              {
                props.viewType === "card" &&
                <h6>INSIGHTS & ANALYSIS</h6>
              }
              <div className="h-line"></div>
            </div>
            <div className="details-wrap status-information nodata nodata-big">
              <div>
                <span className="maintitle">No new publications to show</span>
                <span className="date-ctrl">Last updated {moment().format("MMM DD, YYYY")}</span>
              </div>

            </div>
          </>

    )
  }
  const getExpertComponent = (country) => {
    return (
      expertLoading && expertLoading[props.name] ?
        <div className="details-wrap">
          <Loader />
        </div>
        :
        <div className="author-details">
          {
            props.viewType === "card" &&
            <h3 >Ask Our Team of Experts</h3>
          }
          <h4>
            {
              expertData[props.name] && expertData[props.name].length && expertData[props.name][0] ?
                expertData[props.name][0]?.supertopicName ? expertData[props.name][0]?.supertopicName : <></>
                : <></>}
          </h4>
          <span className={expertData[props.name] && permissionArray?.includes(

            constants.PERMISSION_MAPPING.SUBMIT_QUERY

          ) ? "ask-a-question" : "ask-a-question-disabled"} onClick={() => expertData[props.name] && permissionArray?.includes(
            constants.PERMISSION_MAPPING.SUBMIT_QUERY
          ) ? openModal(country) : ""}>Ask a Question</span>
          <div className={`${props.viewType === "card" ? "profile-pic" : "profile-pic experts-pic"}`}>
            <img src={getExpertImage(expertData) ? `${constants.IMAGE.DOWNLOAD}${getExpertImage(expertData)}` : profile_img} />
          </div>
          {showModal && countryForAskExpert?.countryId ? <AskanExpertModal
            isOpen={showModal}
            onCancelClickListner={handleCloseModal}
            askAnExpert={true}
            dialogClassName="doc-modal"
            notify={props.notify}
            expertDetails={expertData[props.name] ? expertData[props.name][0] : ""}
            showHelp={showHelp}
            setShowHelp={setShowHelp}
            countryId={countryForAskExpert?.countryId}
            countryName={countryForAskExpert?.countryName}
          /> : ""}

          <HeadsUpPopup
            isOpen={expertHoursModal}
            closeModal={() => setExpertHoursModal(false)}
            fromCards={true}
          />
        </div>

    )
  }


  return (
    <>
      {/* <div className="col-xl-3 col-lg-4 mb-4 primary-card-gap" data-test='card'> */}
      {
        props.viewType === "card" ?
          <div className="country-cards" data-test='card'>
            <div style={{ cursor: "pointer" }} className={`country-card border-top ${getClassNameBySeverity()}`}
            >
              <div onClick={onCardClick} data-test='cardclick'>
                <div className="country-image-wrapper">
                  <h3>{props.name}</h3>
                </div>
                <div className="country-image">
                  {props.country.header_Image_Id && <img alt="pro-pic" src={
                    props.country.header_Image_Id
                      ? `${constants.API.COUNTRY.GET_FLAG_DOWNLOAD}${props.country.header_Image_Id} `
                      : ""} />}
                </div>
                {getAlertComponent()}
                {getBlogComponent()}
                <hr className="mt-4 mb-4" />
              </div>

              {getExpertComponent(props.country)}
            </div>

          </div>
          :
          <div className="table-content-container" data-test="table" style={{ cursor: "pointer" }}>
            <div className="row">
              <div className="col-md-3" onClick={onCardClick}>
                <div className="flag_name">
                  {props.name}
                  {props.country.flag_Upload_Id && <img alt="pro-pic" src={
                    props.country.flag_Upload_Id
                      ? `${constants.API.COUNTRY.GET_FLAG_DOWNLOAD}${props.country.flag_Upload_Id} `
                      : ""} />}
                </div>
              </div>
              <div className="col-md-3" onClick={onCardClick}>
                {getAlertComponent()}
              </div>
              <div className="col-md-3" onClick={onCardClick}>
                {getBlogComponent()}
              </div>
              <div className="col-md-3">
                <div className="expert-wrapper">
                  {getExpertComponent(props.country)}
                </div>
              </div>
            </div>
          </div>
      }
    </>
  );
};

const Loader = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height={88}
    viewBox="0 0 100% 38"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="2" ry="2" width="100%" height="88" />
  </ContentLoader>
)

export const CardLoader = (props) => (
  <div className={props.noClass ? "country-cards" : "col-xl-4 col-lg-6 mt-4 primary-card-gap"} data-test='loader'>
    <div className={`country-card border-top ${severityTypes.OTHER.color}`}>
      <div className="country-image-wrapper">
        <h3>{props.name}</h3>
      </div>
      <div className="country-image">
        <img src={country_img} />
      </div>
      <div className={props.noClass ? "details-wrap home-loader" : "details-wrap"}>
        <Loader />
      </div>
      <hr className="mt-4 mb-4" />
      <div className={props.noClass ? "details-wrap home-loader" : "details-wrap"}>
        <Loader />
      </div>
      <hr className="mt-4 mb-4" />
      <div className={props.noClass ? "details-wrap home-loader" : "details-wrap"}>
        <Loader />
      </div>
    </div>

  </div>

)

export default (Card);
