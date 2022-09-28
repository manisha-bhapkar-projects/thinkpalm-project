import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function DeleteConfirmModal({
  isOpen,
  onCancelClick,
  filename,
  onDelete
}) {
  return (
    <div data-test="openModal-page">
      <Modal
        show={isOpen}
        onHide={onCancelClick}
        backdrop="static"
        keyboard={false}
        centered={true}
        contentClassName="custome-modal"
      >
        <Modal.Header className="role_header_model" closeButton>
          <Modal.Title>Confirm Delete?</Modal.Title>
        </Modal.Header>
        <Modal.Body className="role_body_model">
          Are you sure want to delete {filename || "this file"}?
        </Modal.Body>
        <Modal.Footer className="role_footer_model">
          <Button variant="secondary" onClick={onCancelClick}>
            Cancel
          </Button>
          <Button
            variant="primary"
            data-testid="onDeleteBtn"
            onClick={onDelete}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DeleteConfirmModal;
