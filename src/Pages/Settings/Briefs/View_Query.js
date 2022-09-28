import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Spinner } from 'react-bootstrap';

/* Icons */
import down_arrow from '../../../assets/images/solid_down_arrow.svg';
/* Component */
import SearchHeaderText from '../../../Components/SearchHeaderText/SearchHeaderText';
import { getUserProfile } from '../../../utils/storage';

/* Action */
import {
  assignToExpert,
  getExpertEmailList,
  viewQueryDetails,
} from '../../../Store/reducers/Purchase_ExpertBriefs';

const ViewQuery = (props) => {
  document.title = 'Settings';
  const [userData, setUserData] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const [emailId, setEmailId] = useState('');
  const param = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const id = param?.id;

  const viewQueryData = useSelector(
    (state) => state.purchaseExpertReducer.viewQueryData
  );

  const emailAssigned = useSelector(
    (state) => state?.purchaseExpertReducer?.emailAssigned
  );
  const expertEmailList = useSelector(
    (state) => state?.purchaseExpertReducer?.expertEmailList
  );

  const assignExpertPending = useSelector(
    (state) => state?.purchaseExpertReducer?.assignExpertPending
  );

  useEffect(() => {
    var user_data = getUserProfile();
    setUserData(user_data);
    dispatch(viewQueryDetails({ id }));
    dispatch(getExpertEmailList());
  }, []);

  useEffect(() => {
    let count = viewQueryData?.queryDetails?.employeesDetails?.map((count) => {
      return count.salaried + count.hourly;
    });
    if (count && count.length) {
      const sum = count?.reduce((result, number) => result + number);
      setTotalCount(sum);
    }
  }, [viewQueryData]);

  useEffect(() => {
    dispatch(viewQueryDetails({ id }));
  }, [emailAssigned]);

  useEffect(() => {
    let emailId = expertEmailList?.filter(
      (email) => email?.userId == viewQueryData?.queryDetails?.expertUserId
    );
    setEmailId(emailId?.[0]?.emailId ? emailId?.[0]?.emailId : '');
  }, [viewQueryData]);

  useEffect(async () => {
    if (emailAssigned === 200) {
      props.notify('Email Assigned Successfully');
      await dispatch(assignToExpert({ success: true }));
    }
  }, [emailAssigned]);

  const onSelectChange = (e) => {
    setEmailId(e.target.value);
  };
  const handleChangeAssign = async () => {
    if (emailId === '') {
      props.notify('Please Select Email Id');
    } else {
      await dispatch(assignToExpert({ id, emailId }));
    }
  };

  return (
    <div>
      <SearchHeaderText
        filter={true}
        breadcrumb={true}
        user={userData}
        viewQuery={true}
        pageTitle="View Query"
      />
      <div className="container-fluid" data-test="view-query">
        <div className="view_query_container doc-modal">
          <h6 className="query_serial">
            Reference #{viewQueryData?.queryDetails?.referenceNo}
          </h6>
          <div className="view_query_header">
            <h3>Ask a Question</h3>
          </div>

          <div className="doc-modal-body ask-body-container">
            <div className="expert-form">
              <h5>
                Which country do you need legal information on?
                <span style={{ color: '#ffa366' }}>*</span> Specify Industry.
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control view_forn_field"
                    value={viewQueryData?.queryDetails?.country?.country_Name}
                    disabled="disabled"
                  ></input>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control view_forn_field"
                    value={viewQueryData?.queryDetails?.industry?.industryName}
                    disabled="disabled"
                  ></input>
                </div>
              </div>
              <h3>
                Are you bound by the provisions of{' '}
                <span>Collective Bargaining Agreement</span> or any other
                agreement in your workplace or with a works council that bind
                your workplace and vary legal obligations? If YES, please upload
                agreement.<span style={{ color: '#ffa366' }}>*</span>
              </h3>
              {viewQueryData?.queryDetails?.hasAgreement ? (
                <div className="agreement_status_container">
                  <div>YES</div>
                  <div>
                    {viewQueryData?.queryDetails?.agreementUploadFileName}
                  </div>
                </div>
              ) : (
                <div className="agreement_status_container">
                  <span>NO</span>
                </div>
              )}

              <h3>
                Based on the employee type listed below, how many employees do
                you currently employ here?
              </h3>
              <div className="col-12 table-header">
                <div className="row">
                  <div className="col-md-6 pl-0">
                    <h3>Employee Type</h3>
                  </div>
                  <div className="col-md-3 text-center">
                    <h3>Salaried</h3>
                  </div>
                  <div className="col-md-3 text-center">
                    <h3>Hourly</h3>
                  </div>
                </div>
              </div>
              {viewQueryData?.queryDetails?.employeesDetails?.map(
                (count, index) => {
                  return (
                    <div className="inline-form-container" data-test="empCount">
                      <div className="col-md-6 pl-0">{count?.employeeType}</div>
                      <div className="col-md-3">
                        <div className="number-container">
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            name="permanent-full-time-local"
                            id="Salaried"
                            value={count?.salaried}
                            disabled="disabled"
                          />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="number-container">
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            name="permanent-full-time-local"
                            id="Hourly"
                            value={count?.hourly}
                            disabled="disabled"
                          />
                        </div>
                      </div>
                    </div>
                  );
                }
              )}

              <div className="count-footer">
                <span>Total employee count</span>
                <span>{totalCount}</span>
              </div>
              <h3>
                Our legal team can provide explanations and interpretations on
                the law. Please specify the area you need clarification on.
                <span style={{ color: '#ffa366' }}>*</span>
              </h3>
              <h6>
                Please do not disclose information that could be used to
                identify an individual under your employ.
              </h6>
              <div className="description-modal">
                <span>Characters left : 800</span>
                <textarea
                  className="form-control"
                  name="areaToClarify"
                  value={viewQueryData?.queryDetails?.areaToClarify}
                  disabled="disabled"
                />
              </div>
              <h3>
                Would you like a kick off call to receive a direct response to
                your research?<span style={{ color: '#ffa366' }}>*</span>
              </h3>
              <div className="agreement_status_container yes-view">
                {viewQueryData?.queryDetails?.needKickOffCall ? (
                  <div>YES</div>
                ) : (
                  <div>NO</div>
                )}
              </div>

              <div className="agree-container">
                <div className="checkbox-wrapper">
                  <label className="tab-checkbox ">
                    I understand that the expert pictured on the country page
                    may not necessarily be the individual who will conduct this
                    research.<span style={{ color: '#ffa366' }}>*</span>
                    <input name="picture" type="checkbox" checked value="" />
                    <span className="checkmark" />
                  </label>
                </div>
                <div className="checkbox-wrapper">
                  <label className="tab-checkbox ">
                    I accept this query may exceed my available hours and I
                    agree to pay for the overages.
                    <span style={{ color: '#ffa366' }}>*</span>
                    <input type="checkbox" name="hours" checked value="" />
                    <span className="checkmark" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="view_query_common">
          <div className="main_header">
            <h3>Manage Query</h3>
          </div>
          <div className="holder_container">
            <div className="submit-form">
              <h3>Assign to Expert</h3>
              <div className="view-query-drop" data-test="assignDiv">
                <select
                  className="form-control mr-0"
                  onChange={onSelectChange}
                  value={emailId}
                >
                  <option value="Enter email address">
                    Enter email address
                  </option>
                  {expertEmailList?.map((emails) => (
                    <option value={emails?.emailId}>{emails?.emailId}</option>
                  ))}
                </select>

                <img src={down_arrow} className="view-query-drop-icon" />
              </div>
              {assignExpertPending ? (
                <button className="primary-button">
                  <Spinner animation="border" size="sm" data-test="spinner" />
                </button>
              ) : (
                <button
                  className="primary-button"
                  onClick={handleChangeAssign}
                  data-test="assignBtn"
                >
                  {viewQueryData?.queryDetails?.expertUserId === null ? "Assign" : "Change"}
                </button>
              )}
            </div>
          </div>

          {/* <div className="holder_container">
            <div className="schedule_meeting">
              <h3>Schedule kick off meeting with requestor</h3>
              <button className="btn-schedule">Schedule Meeting</button>
              <h3>Add a note for the user</h3>
              <textarea className="text-area form-control"></textarea>

              <div className="btn-container">
                <button className="secondary-gray-button">Cancel</button>
                <button className="primary-button">Send</button>
              </div> 
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ViewQuery;
