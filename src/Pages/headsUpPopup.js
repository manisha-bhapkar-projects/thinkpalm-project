import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useHistory } from "react-router-dom";
import constants from "../utils/constants";

function HeadsUpPopup({ isOpen, closeModal, fromCards }) {
    const history = useHistory();

    const onClickLearnMore = () => {
        history.push(`${constants.ROUTE.KNOWLEDGE_BASE.FAQ}`);
    };

    const onClickAddMoreHours = () => {
        // history.push(`${constants.ROUTE.SIDEBAR.SETTINGS.PURCHASE_EXPERT_BRIEFS}/Expert-Briefs`);
        history.push(`${constants.ROUTE.BUY_MORE_HOURS.REVIEW_PAYMENT}/${fromCards}`)
    };

    return (
        <div data-test="openModal-page">
            <Modal
                show={isOpen}
                onHide={closeModal}
                backdrop="static"
                keyboard={false}
                centered={true}
                contentClassName="custome-modal"
            >
                <Modal.Header className="role_header_model" closeButton>
                    <Modal.Title>Heads Up!</Modal.Title>
                </Modal.Header>
                <Modal.Body className="role_body_model">
                    Your Account is running low on available Expert Hours. To
                    ensure a seamless experience while availing this service, you
                    need minimum of 10 hours in your account.
                    <div className="breaker-padding-heads-up"></div>
                    Please note, unused hours added as a credit for
                    future use.
                </Modal.Body>
                <Modal.Footer className="role_footer_model">
                    <Button variant="secondary" className="learn-more-btn" onClick={onClickLearnMore}>
                        Learn More
                    </Button>
                    <Button
                        variant="primary"
                        className="add-more-btn"
                        onClick={onClickAddMoreHours}
                    >
                        Add More Hours
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default HeadsUpPopup;
