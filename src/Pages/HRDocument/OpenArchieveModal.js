import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import constants from "../../utils/constants";
import { useHistory } from "react-router-dom";

function OpenArchieveModal({
    isOpen,
    onCancelClickListner,
    addTemplateToArchive
}) {
    const [show, setShow] = useState(false);
    const history = useHistory();

    return (
        <>

            <Modal
                show={isOpen}
                onHide={onCancelClickListner}
                backdrop="static"
                keyboard={false}
                centered={true}
                contentClassName="hr-template-modal"
            >
                <Modal.Header className="role_header_model" closeButton>
                    <Modal.Title >Archive Template “Employee Agreement”?</Modal.Title>
                </Modal.Header>
                <Modal.Body className="role_body_model">
                    All versions of this document will be removed from Doc Shop and the list of uploaded templates. Users who own this template will continue to have access to it.
                </Modal.Body>
                <Modal.Footer className="role_footer_model">
                    <Button variant="secondary" onClick={onCancelClickListner}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={addTemplateToArchive}>
                        Archive
                    </Button>
                    {/* <button
                        className="btn btn-primary btn-primary-10"
                        onClick={() => addTemplateToArchive}

                    >
                        Archieve
                    </button> */}
                </Modal.Footer>
            </Modal>

        </>
    );
}

export default OpenArchieveModal;
