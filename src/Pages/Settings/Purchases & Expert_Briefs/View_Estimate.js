import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";

/* Icons */
import shield from "../../../assets/images/shield.svg";

/* Component */
import ConfirmationModal from './ConfirmationModal';


import CustomeTable from "../../../Components/CustomeTable/CustomeTable";

/* Action */

import { getUserProfile } from "../../../utils/storage";
import constants from "../../../utils/constants";
import { permissionMapping } from "../../../utils/utils";
import { getEstimateDetails, updateStatusRequest, getStatusQuery, getHoursDetails, getRemainingHours } from "../../../Store/reducers/Purchase_ExpertBriefs";
import SearchHeaderText from "../../../Components/SearchHeaderText/SearchHeaderText";
import Header from "../User_and_Accounts/header";
import { useHistory, useParams } from "react-router";
import { Spinner } from 'react-bootstrap';
import mixpanel from 'mixpanel-browser';
import {userDetailsMixpnel} from '../../../utils/utils'
mixpanel.init(constants.MIXPANEL_TOKEN);
const ViewEstimate = (props) => {
  document.title = "Settings";
  const [userData, setUserData] = useState();
  const [cancelEstimateRequest, setCancelEstimateRequest] = useState(false);
  const [approveEstimateRequest, setApproveEstimateRequest] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false)
  const [cancelNote, setCancelNote] = useState("")
  const [cancelMessage, setCancelMessage] = useState()
  const [showModal, setShowModal] = useState(false);
  const [cancelValidation, setCancelValidation] = useState("")
  const param = useParams()
  const history = useHistory();
  const dispatch = useDispatch();

  const hoursDetails = useSelector(
    (state) => state?.purchaseExpertReducer?.hoursDetails
  );
  const estimateDetails = useSelector(
    (state) => state?.purchaseExpertReducer?.estimateDetails
  );

  const balanceHour = useSelector(
    (state) => state?.purchaseExpertReducer?.balanceHours?.availableHours
  );

  useEffect(async () => {
    window?.scrollTo(0, 0);
    var user_data = getUserProfile();
    setUserData(user_data);
    let requestBody = {
      queryId: param?.id,
      statusId: 2
    }
    dispatch(getEstimateDetails(requestBody))
    dispatch(getHoursDetails())
    dispatch(getRemainingHours())

    let request = await getStatusQuery({ id: param?.id })
    if (request?.data?.queryStatusId === 3) {
      setApproveEstimateRequest(false)
    } else {
      setApproveEstimateRequest(true)
    }

  }, []);

  const cancelRequest = () => {
    setCancelEstimateRequest(true)
  };
  const approveRequest = async () => {
    setApproveLoading(true)
    let requestBody = {
      "Id": estimateDetails?.estimateId,
      "StatusId": 1,
      "UserCancellationNote": ""
    }
    let response = await updateStatusRequest(requestBody)
    if (response?.data) {
      setApproveEstimateRequest(true);
      mixpanel.track('Click on Approve Estimate', {
        'User Details':userDetailsMixpnel()
      })
    }
    setApproveLoading(false)
  };

  const buyMoreHours = () => {
    // history.push(`${constants.ROUTE.BUY_MORE_HOURS.REVIEW_PAYMENT}${param?.id}`)
    history.push(`/buy-more-hours-review-and-pay/${param?.refNo}/${param?.id}`)

  }
  const openConfirmationModal = (id) => {
    setShowModal(true);
  };
  const handleSave = () => {
    if (cancelNote.length) {
      setCancelMessage(cancelNote)
      setCancelValidation("")
      setCancelNote("")
      openConfirmationModal()
    } else {
      setCancelValidation("Please Enter the Cancel Note")
    }

  }
  const handleCloseModal = () => {
    setShowModal(false);
    setCancelEstimateRequest(false)
  };
  const handleCancelText = (e) => {
    setCancelNote(e.target.value)
  };
  const doneRequest = () => {
    history.push(constants.ROUTE.SIDEBAR.SETTINGS.PURCHASE_EXPERT_BRIEFS + '/Expert-Briefs');
  }

  return (
    <div data-test="viewEstimate">
      <SearchHeaderText
        filter={true}
        breadcrumb={true}
        user={userData}
        clientViewEstimate={true}
        pageTitle="View Estimate"
      />
      <div className="container-fluid">
        <div className="view-estimate-container">
          {!approveEstimateRequest ? (
            <div>
              <div className="reference-id">
                <h3>Reference #{param?.refNo}</h3>
                <p>
                  Your query was viewed by our team of experts and an estimate
                  has been provided.<br></br> Once approved, our experts will
                  begin working on it. <br></br>
                </p>
                <p>The estimated time needed for your query is:</p>
              </div>
              <div className="estimate-hours">
                <h2>{estimateDetails?.hours ? estimateDetails?.hours : "00"}{estimateDetails?.minutes ? ":" : ""}{estimateDetails?.minutes ? estimateDetails?.minutes.toString().length === 1 ? "0" + estimateDetails?.minutes : estimateDetails?.minutes : ""} Hours</h2>
                {/* <h5>Estimate submitted by <span className="estimate-user">{estimateDetails?.estimatedUser?.firstName} {estimateDetails?.estimatedUser?.lastName}</span></h5> */}
              </div>


              <div className="buy-more-balance mb-5">
                Your Account Balance is <span className="balance-hour-value">{balanceHour?.toFixed(2)}</span> <span className="balance-hour-label"> Hours</span>
              </div>
              {
                (estimateDetails?.hours + ((1 / 60) * estimateDetails?.minutes)) >
                balanceHour &&
                <div className="estimate-headsup mb-4">
                  The estimate provided by the expert exceeds the number of hours available to you. Please purchase additional hours to approve this estimate.
                </div>

              }
              <div className="btn-container">
                <button className={!cancelEstimateRequest ? "cancel-btn" : "cancel-btn disabled"} onClick={cancelRequest} data-test="cancel">
                  Cancel Request
                </button>
                <button className={!cancelEstimateRequest ? "approve-btn" : "approve-btn disabled"} disabled={cancelEstimateRequest ? true : false}
                  onClick={
                    (estimateDetails?.hours + ((1 / 60) * estimateDetails?.minutes)) >
                      balanceHour
                      ? buyMoreHours :
                      approveRequest
                  }
                  data-test="approved"
                >
                  {
                    approveLoading ?
                      <Spinner animation="border" size="sm" /> : ""

                  }{(estimateDetails?.hours + ((1 / 60) * estimateDetails?.minutes)) >
                    balanceHour ? "Buy More" : "Approve Estimate"}
                </button>
              </div>
              {cancelEstimateRequest ? (
                <div className="note_container" data-test="canceledDiv">
                  <div className="note_header">
                    <h3>
                      You may include a cancellation note for our experts.
                    </h3>
                    <button className="btn-note-save" onClick={handleSave}>Save</button>
                  </div>
                  <textarea
                    className="form-control"
                    placeholder="Start typing here"
                    onChange={handleCancelText}
                    value={cancelNote}
                  ></textarea>
                  <span className="validation-message">{cancelValidation}</span>
                  <ConfirmationModal
                    isOpen={showModal}
                    onCancelClickListner={handleCloseModal}
                    param={param}
                    cancelNote={cancelMessage}
                    estimateId={estimateDetails?.estimateId}
                    history={history}
                  />
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div data-test="approvedDiv">
              <div className="reference-id">
                <h3>Reference #{param?.refNo}</h3>

                <p className="approved-style">Thank you for your approval! Our experts will keep you posted.</p>
              </div>
              <div className="btn-container">
                <button className="doneApproved-btn" onClick={doneRequest}>
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ViewEstimate;
