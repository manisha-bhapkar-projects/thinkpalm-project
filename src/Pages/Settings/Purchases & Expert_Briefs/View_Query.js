import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";

/* Icons */
import shield from "../../../assets/images/shield.svg";

/* Component */
import OpenModal from "../User_and_Accounts/OpenModal";

import CustomeTable from "../../../Components/CustomeTable/CustomeTable";

/* Action */

import { getQueryDetails } from "../../../Store/reducers/Purchase_ExpertBriefs";
import { getUserProfile } from "../../../utils/storage";
import constants from "../../../utils/constants";
import { permissionMapping } from "../../../utils/utils";
import SearchHeaderText from "../../../Components/SearchHeaderText/SearchHeaderText";
import Header from "../User_and_Accounts/header";
import { useParams } from "react-router";

const ViewQuery = (props) => {
  document.title = "Settings";
  const [userData, setUserData] = useState();
  const param=useParams()
  const dispatch = useDispatch()
  var totalEmployee=0
  const queryDetails=useSelector(
    (state) => state?.purchaseExpertReducer?.queryDetails
  );
  useEffect(() => {
    window?.scrollTo(0, 0);
    var user_data = getUserProfile();
    setUserData(user_data);
    let requestBody={
      queryId:param?.id
    }
    dispatch(getQueryDetails(requestBody))
  }, []);

  return (
    <div data-test="viewQuery">
      <SearchHeaderText
        filter={true}
        breadcrumb={true}
        user={userData}
        clientViewQuery={true}
        pageTitle="View Query"
      />
      <div className="container-fluid">
        <div className="view_query_container doc-modal">
          <h6 className="query_serial">Reference #{param?.refNo}</h6>
          <div className="view_query_header">
            <h3>Ask a Question</h3>
          </div>

          <div className="doc-modal-body ask-body-container">
            <div className="expert-form">
              <h5>
                Which country do you need legal information on?
                <span style={{ color: "#ffa366" }}>*</span> Specify Industry.
              </h5>

              <div className="row">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control view_forn_field"
                    value={queryDetails?.queryDetails?.country?.country_Name}
                    disabled={true}
                  ></input>
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control view_forn_field"
                    value={queryDetails?.queryDetails?.industry?.industryName}
                    disabled={true}
                  ></input>
                </div>
              </div>
              <h3>
                Are you bound by the provisions of{" "}
                <span style={{color:"black"}}>Collective Bargaining Agreement</span> or any other
                agreement in your workplace or with a works council that bind
                your workplace and vary legal obligations? If YES, please upload
                agreement.<span style={{ color: "#ffa366" }}>*</span>
              </h3>
              <div className="agreement_status_container">
                <div>{queryDetails?.queryDetails?.hasAgreement?"YES":"NO"}</div>
                {
                  queryDetails?.queryDetails?.hasAgreement && queryDetails?.queryDetails?.agreementUploadFileName?
                  <div>{queryDetails?.queryDetails?.agreementUploadFileName}</div>:""
                }
              </div>
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
             { 
               queryDetails?.queryDetails?.employeesDetails?.map((item,index)=>{
                 totalEmployee=totalEmployee+item?.salaried+item?.hourly
                
                 return(
                  <div className="inline-form-container" key={index} data-test="employee">
                  <div className="col-md-6 pl-0">
                   {item?.employeeType}
                  </div>
                  { item?.employeeType==="Consultant"||item?.employeeType==="Temporary/Interns"||item?.employeeType==="Contractor"?
                  (<div className="col-md-3">
                   
                  </div>)
                  :(<div className="number-container">
                  <div className="number-container">
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    name="permanent-full-time-local"
                    id="Salaried"
                    value={item?.salaried}
                    disabled={true}
                  />
                </div>
                  
                  </div>)}
                  <div className="col-md-3">
                    <div className="number-container">
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        name="permanent-full-time-local"
                        id="Hourly"
                        value={item?.hourly}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
                 )
               })
              
              }
              <div className="count-footer">
                <span>Total employee count</span>
                <span>{totalEmployee}</span>
              </div>
              <h3>
                Our legal team can provide explanations and interpretations on
                the law. Please specify the area you need clarification on.
                <span style={{ color: "#ffa366" }}>*</span>
              </h3>
              <h6>
                Please do not disclose information that could be used to
                identify an individual under your employ.
              </h6>
              <div className="description-modal">
                <span>Characters left : {800-(queryDetails?.queryDetails?.areaToClarify?queryDetails?.queryDetails?.areaToClarify?.length:0)}</span>
                <textarea className="form-control" name="areaToClarify" value={queryDetails?.queryDetails?.areaToClarify} disabled={true}/>
              </div>
              <h3>
                Would you like a kick off call to receive a direct response to
                your research?<span style={{ color: "#ffa366" }}>*</span>
              </h3>
              <div className="agreement_status_container yes-view" style={{marginBottom:"30px"}}>
                <div>{queryDetails?.queryDetails?.needKickOffCall?"YES":"NO"}</div>
              </div>

              <div className="agree-container">
                <div className="checkbox-wrapper">
                  <label className="tab-checkbox ">
                    I understand that the expert pictured on the country page
                    may not necessarily be the individual who will conduct this
                    research.<span style={{ color: "#ffa366" }}>*</span>
                    <input name="picture" type="checkbox" checked value="" disabled={true}/>
                    <span className="checkmark" />
                  </label>
                </div>
                <div className="checkbox-wrapper">
                  <label className="tab-checkbox ">
                    I accept this query may exceed my available hours and I
                    agree to pay for the overages.
                    <span style={{ color: "#ffa366" }}>*</span>
                    <input type="checkbox" name="hours" checked value="" disabled={true}/>
                    <span className="checkmark" />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuery;
