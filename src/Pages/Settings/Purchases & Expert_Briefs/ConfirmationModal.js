import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useHistory } from "react-router-dom";
import { Spinner } from 'react-bootstrap';
import { updateStatusRequest } from "../../../Store/reducers/Purchase_ExpertBriefs";
import constants from "../../../utils/constants";
import mixpanel from 'mixpanel-browser';
import {userDetailsMixpnel} from '../../../utils/utils'
mixpanel.init(constants.MIXPANEL_TOKEN);
function ConfirmationModal({
  isOpen,
  onCancelClickListner,
  param,
  cancelNote,
  estimateId,
  history
}) {

  const [cancelLoading,setCancelLoading]=useState(false)
const cancelRequest=async ()=>{
  setCancelLoading(true)
  let requestBody={
    "Id" : estimateId,
    "StatusId":3, 
    "UserCancellationNote":cancelNote
  }
  let response=await updateStatusRequest(requestBody)
  if(response?.data){
    mixpanel.track('Click on Cancel Request', {
      'User Details':userDetailsMixpnel()
    })
    history.push(constants.ROUTE.SIDEBAR.SETTINGS.PURCHASE_EXPERT_BRIEFS + '/Expert-Briefs')
  }
  setCancelLoading(false)
}
  return (
      
        <Modal
          show={isOpen}
          onHide={onCancelClickListner}
          backdrop="static"
          keyboard={false}
          centered={true}
          contentClassName="custome-modal"
          data-test="confirmModal"
        >
          <Modal.Header className="role_header_model" closeButton>
            <Modal.Title >Confirm the Cancel Request</Modal.Title>
          </Modal.Header>
          <Modal.Body className="role_body_model">
            Would you like to Cancel the Estimate?
          </Modal.Body>
          <Modal.Footer className="role_footer_model">
            <Button variant="secondary" onClick={onCancelClickListner} >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={cancelRequest}
              data-test="cancelRequest"
            >{
              cancelLoading?
              <Spinner animation="border" size="sm"/>:""
            }
              Continue 
            </Button>
          </Modal.Footer>
        </Modal>
      
      
    
  );
}

export default ConfirmationModal;
