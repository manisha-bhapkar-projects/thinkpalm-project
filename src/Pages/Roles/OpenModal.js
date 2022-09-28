import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import constants from "../../utils/constants";
import { useHistory } from "react-router-dom";

function OpenModal({
  isOpen,
  onCancelClickListner,
  userName,
  deactivateUser,
  userId,
  userStatus,
  editFlag,
}) {
  const [show, setShow] = useState(false);
  const history = useHistory();

  

  return (
    <>
      {editFlag ? (
        <Modal
          show={isOpen}
          onHide={onCancelClickListner}
          backdrop="static"
          keyboard={false}
          centered={true}
          contentClassName="custome-modal"
          data-test="roleModal"
        >
          <Modal.Header className="role_header_model" closeButton>
            <Modal.Title >Edit Role "{userName}" ?</Modal.Title>
          </Modal.Header>
          <Modal.Body className="role_body_model">
            Editing Roles will affect the experience of all users mapped to this role. 
          </Modal.Body>
          <Modal.Footer className="role_footer_model">
            <Button variant="secondary" onClick={onCancelClickListner}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                history.push({
                  pathname: `/edit-role/${userId}`,
                  state: { editFlag: "true" },
                })
              }
              data-test="editClick"
            >
              Continue to Edit
            </Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal
          show={isOpen}
          onHide={onCancelClickListner}
          backdrop="static"
          keyboard={false}
          centered={true}
          contentClassName="custome-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {userStatus
                ? `Deactivate User ${userName} ?`
                : `Activate User ${userName} ?`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {userStatus
              ? "  This does not delete the user's account."
              : "This will activate the user."}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onCancelClickListner} data-test="cancel">
              Cancel
            </Button>
            <Button variant="primary" onClick={() => deactivateUser(userId)} data-test="deactivate">
              {userStatus ? "Deactivate" : "Activate"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

export default OpenModal;
