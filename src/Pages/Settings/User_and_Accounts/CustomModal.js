import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function CustomModal({ status, onModalClose, headerTitle, bodyText, cancelBtnTitle, saveBtnTitle, disableCancel, confirmAction }) {
    return (
        <div data-test="openModal-page">
            <Modal
                show={status}
                onHide={onModalClose}
                backdrop="static"
                keyboard={false}
                centered={true}
                contentClassName="custome-modal"
            >
                <Modal.Header className="role_header_model" closeButton>
                    <Modal.Title>{headerTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="role_body_model">{bodyText}</Modal.Body>
                <Modal.Footer className="role_footer_model">
                    {
                        !(disableCancel) &&
                        <Button variant="secondary" onClick={onModalClose}>
                            {cancelBtnTitle || "Cancel"}
                        </Button>
                    }
                    {
                        saveBtnTitle !== "hide" &&
                        <Button variant="primary" onClick={confirmAction}>
                            {saveBtnTitle}
                        </Button>
                    }
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CustomModal;
