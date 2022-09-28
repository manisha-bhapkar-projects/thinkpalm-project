import React, { useEffect, useState } from "react";
import profile_img from "../../assets/images/dp.jpeg";
import { bindActionCreators } from "redux";
import { getKeyClockToken_Data } from "../../utils/storage/index";
import jwt_decode from "jwt-decode";
import { connect } from "react-redux";
//import SearchIcon from '@material-ui/icons/Search';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip } from "react-bootstrap";
import "../Home/slickcustom.css";
import Slider from "react-slick";
import constants from "../../utils/constants";
import { getUserProfile } from "../../utils/storage";
import {
  callGetCompareCountrySolutionIdAPI,
  callGetSnapShotAPI,
} from "../../Actions/CompareCountryAction";
import { ExportCSV } from "./ExportCSV";
import { Link, useHistory } from "react-router-dom";
import UserDropdown from "../../Components/UserDropdown";
import ComparisonTable from "./ComparisonTable";
import SearchBar from "../../Components/SearchBar"
/*  Mixpanel starts here  */
import mixpanel from 'mixpanel-browser';
import { userDetailsMixpnel } from '../../utils/utils';
mixpanel.init(constants.MIXPANEL_TOKEN);
/*  Mixpanel ends here  */

const CountryCompare = (props) => {
  document.title = "Compare";
  const countryData = JSON.parse(localStorage.getItem("CountryData"));
  const hasCountryId = localStorage.getItem("hasCountryId");
  
  const countryIds =
    countryData &&
    countryData.map((item) => {
      return item.id.toString();
    });
  const [selected_countryname, setSelecet_countryname] = useState();
  const [solutionName, setSolutioname] = useState([
    "Employee Management - Labor and Employment - Snapshot",
  ]);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [solutionIds, setsolutionIds] = useState([]);
  const [countryDetails, setCountryDetails] = useState([]);
  const [compareCountryDetails, setCompareDetails] = useState([]);
  const [firstCountryDetails, setFirstCountryDetails] = useState([]);
  const [exp, setexp] = useState([])
  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(true)
  const history = useHistory()
  const [exportData, setExportData] = useState({
    countryExportData: [],
    fileName: "Country",
  });
  var attributeLabels = [
    "Public Holidays",
    "Vacation Leave",
    "Sick Leave",
    "Maternity Leave",
    "Working Hours",
    "Bonus Payments",
    "Taxes", 
    "Employee Termination & Severance",
    "Advantages",
    "Risk Factors"
  ];
  
  var attributes = [
    "Public Holidays",
    "Annual Leave",
    "Sick & Carer’s Leave",
    "Maternity, Paternity & Family Leave",
    "Working Hours",
    "Wages, Bonuses & Other Remuneration",
    "Taxes",
    "Termination & Severance",
    "Advantages",
    "Risk Factors",
  ];
  useEffect(() => {
    var token_data = getKeyClockToken_Data();
    var newData = token_data ? jwt_decode(token_data) : "";

    var id = newData ? (newData.sub ? newData.sub : "") : "";
    var user_data = getUserProfile();
    setUserData(user_data);
    let request = {
      countryIds: countryIds,
      solutionName: solutionName,
    };
    getCountrySolutionId(request);
  }, []);

  useEffect(() => {
    callingSolutionData_details(solutionIds);
  }, [solutionIds]);
  useEffect(() => {
    callingCountryData_details(countryDetails);
  }, [countryDetails]);
  

  const getCountrySolutionId = (data) => {
   
    props
      .callGetCompareCountrySolutionIdAPIAction(data)
      .then((response) => {
       
        
        let selected_country_id = [];
        let selected_country_name = [];
        let selected_country=[]
        response.data.data.forEach((e) => {
          if (!selected_country_id.includes(e.solutionId)) {
            if(!selected_country.includes(e.countryName)){
              selected_country.push(e.countryName);
              selected_country_id.push(e.solutionId);
            }
           
          }
          selected_country_name.push(e.countryName);
        });
        setSelecet_countryname(selected_country_name);
        
        getSnaphot(selected_country_id);
        setsolutionIds(selected_country_id);
        if(solutionIds === null)
        setLoading(false);

      })
      .catch((errors) => { 
        setLoading(false);

      });
  };

  const callingSolutionData_details = (id) => {
    // getSnaphot(id)
  };
  const callingCountryData_details = (countryDetails) => {

    allDataforExport(countryData, countryDetails);
    let firstCountry = countryDetails?.length
      ? countryDetails.filter((e) =>
        countryData[0].country_Name.includes(e.countryName)
      )
      : [];
    let metadat = firstCountry.map((item) => {
      return item.superTopicMetadatas;
    });
    setCompareDetails(
      countryDetails?.length
        ? countryDetails.filter(
          (item) => item.countryName !== countryData[0].country_Name
        )
        : []
    );
    setFirstCountryDetails(metadat);
  };
  const stripHtml_fun = (a) => {
    let stripedHtml = a ? a.replace(/&nbsp;/g, " ").replace(/&#39;/g,"") : a;
    return stripedHtml;
  };
  const allDataforExport = (countryData, countryDetails) => {
    let data = [];
    let country=[]
    let publicHoliday = []
    let vacationLeave = []
    let sickLeave = []
    let maternityLeave=[]
    let workingHours=[]
    let bonusPayment=[]
    let taxes=[]
    let empSev=[]
    let advantages=[]
    let riskFactors=[]
   
        countryData && countryData.map((item) => {
      countryDetails && countryDetails.map((data) => {
        if (!country.includes(item.country_Name)) {
          if(item?.id === data?.countryId){
            country.push(item.country_Name);
          }
          
        }
        if (data?.supertopicName === "Public Holidays" && item?.id === data?.countryId) {
          data?.superTopicSnapshotContent?.join(";") ? publicHoliday.push(stripHtml_fun(data.superTopicSnapshotContent.join(";"))) : publicHoliday.push("No Data")
        }
        if (data?.supertopicName === "Annual Leave" && item?.id === data?.countryId) {
          data?.superTopicSnapshotContent?.join(";") ? vacationLeave.push(stripHtml_fun(data.superTopicSnapshotContent.join(";"))) : vacationLeave.push("No Data")
        }
        if (data?.supertopicName === "Sick & Carer’s Leave" && item?.id === data?.countryId) {
          data?.superTopicSnapshotContent?.join(";") ? sickLeave.push(stripHtml_fun(data.superTopicSnapshotContent.join(";"))) : sickLeave.push("No Data")
        }
        if (data?.supertopicName === "Maternity, Paternity & Family Leave" && item?.id === data?.countryId) {
          data?.superTopicSnapshotContent?.join(";") ? maternityLeave.push(stripHtml_fun(data.superTopicSnapshotContent.join(";"))) : maternityLeave.push("No Data")
        }
        if (data?.supertopicName === "Working Hours" && item?.id === data?.countryId) {
          data?.superTopicSnapshotContent?.join(";") ? workingHours.push(stripHtml_fun(data.superTopicSnapshotContent.join(";"))) : workingHours.push("No Data")
        }
        if (data?.supertopicName === "Wages, Bonuses & Other Remuneration" && item?.id === data?.countryId) {
          data?.superTopicSnapshotContent?.join(";") ? bonusPayment.push(stripHtml_fun(data.superTopicSnapshotContent.join(";"))) : bonusPayment.push("No Data")
        }
        if (data?.supertopicName === "Taxes" && item?.id === data?.countryId) {
          data?.topics?.map((topic)=>{
            if(topic.topicName=== "Social Security & Payroll Taxes"){
              topic?.topicSnapshotContent?.join(";") ? taxes.push(stripHtml_fun(topic.topicSnapshotContent.join(";"))) : taxes.push("No Data")

            }
          })
        }
        if (data?.supertopicName === "Termination & Severance" && item?.id === data?.countryId) {
          data?.superTopicSnapshotContent?.join(";")? empSev.push(stripHtml_fun(data.superTopicSnapshotContent.join(";"))) : empSev.push("No Data")
        }
        if (data?.supertopicName === "Advantages" && item?.id === data?.countryId) {
          data?.superTopicSnapshotContent?.join(";") ? advantages.push(stripHtml_fun(data.superTopicSnapshotContent.join(";"))) : advantages.push("No Data")
        }
        if (data?.supertopicName === "Risk Factors" && item?.id === data?.countryId) {
          data?.superTopicSnapshotContent?.join(";")? riskFactors.push(stripHtml_fun(data.superTopicSnapshotContent.join(";"))) : riskFactors.push("No Data")
        }
      })
    })
 
    country &&
      country.forEach((item, index) => {

        data.push({
          Snapshot: item,
          Public_Holidays: publicHoliday[index],
          Vacation_Leave: vacationLeave[index],
           Sick_Leave: sickLeave[index],
           Maternity_Leave:maternityLeave[index],
          Working_Hours:workingHours[index],
          Bonus_Payments:bonusPayment[index],
           Taxes: taxes[index],
          Employee_Termination_Severance:empSev[index],
          The_Advantages: advantages[index],
           Risk_Factors: riskFactors[index]
        });
      });
    setExportData({ ...exportData, countryExportData: data });
  };
  const getSnaphot = (data) => {
    let request = {
      SolutionIds: data,
      SuperTopicNames: [
        "Public Holidays",
        "Annual Leave",
        "Sick & Carer's Leave",
        "Maternity, Paternity & Family Leave",
        "Working Hours",
        "Wages, Bonuses & Other Remuneration",
        "Social Security & Payroll Taxes",
        "Termination & Severance",
        "Advantages",
        "Risk Factors",
      ],
    };
    props
      .callGetSnapShotAPIAction(request)
      .then((response) => {
        setLoading(false);
        setCountryDetails(response.data.data);
        setexp(response.data.data)
      })
      .catch((errors) => {
        setLoading(false);

       });
  };  
 
  return (
    <div className="container-fluid" data-test="compare">
      <SearchBar userData={userData} />
      <div className="">
        <div className="breadcrumb-wrap">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/home">Home</Link>
              </li>
              {hasCountryId && (
                <li className="breadcrumb-item"  data-test="country">
                  <Link
                    to={`/details/${countryData &&
                        countryData.length &&
                        countryData[0]?.country_Name
                        ? countryData[0].id
                        : ""
                      }`}
                     
                  >
                    {countryData &&
                      countryData.length &&
                      countryData[0]?.country_Name
                      ? countryData[0].country_Name
                      : "Country"}
                  </Link>
                </li>
              )}
              <li className="breadcrumb-item active" aria-current="page">
                <span>Country Compare</span>
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <div className="row">
        <div className="compare-container col-12">
          <h2 className="header-txt">Country Comparison</h2>
          <span className='pointer' ><i onClick={() =>hasCountryId? history.push(`/details/${countryData &&
              countryData.length &&
              countryData[0]?.country_Name
              ? countryData[0].id
              : ""
            }`):history.push('/home')} className="ph-arrow-left" data-test="countryPush" /></span>

          <ExportCSV
            csvData={exportData.countryExportData}
            fileName={exportData.fileName}
            compareCountry={true}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <ComparisonTable
            attributes={attributes}
            attributeLabels={attributeLabels}
            countries={countryData}
            loading={loading}
            countryDetails={countryDetails}
          />
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      callGetCompareCountrySolutionIdAPIAction:
        callGetCompareCountrySolutionIdAPI,
      callGetSnapShotAPIAction: callGetSnapShotAPI,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(CountryCompare);
