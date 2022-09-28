import React from "react";
import newspaperIcon from "../../assets/images/newspaper-sm-icon.svg";
import bellIcon from "../../assets/images/bell-sm-icon.svg";
import ContentLoader from "react-content-loader";
import { useHistory, useParams } from "react-router-dom";
import constants from "../../utils/constants";
import { alertAddtoUser } from "../../Store/reducers/country";
import { permissionMapping } from "../../utils/utils";
import mixpanel from 'mixpanel-browser';
import { getUserProfile } from "../../utils/storage";
import {userDetailsMixpnel} from '../../utils/utils'
mixpanel.init(constants.MIXPANEL_TOKEN);
const AlertCard = (props) => {
  const history = useHistory();
  const userProfile=getUserProfile()
  const is_notification_mark = props.notification_color;
  const permissionArray = permissionMapping();
  const show_notification_mark = () => {
    if (is_notification_mark) {
      return <div className="round blue_bg" />;
    }
  };
  const severityTypes = {
    CRITICAL: {
      name: "Critical",
      color: "border-maroon",
      bullet: "maroon_bg"
    },
    MAJOR: {
      name: "Major",
      color: "border-yellow",
      bullet: "yellow_bg"
    },
    MINOR: {
      name: "Minor",
      color: "border_green",
      bullet: "green_bg"
    },
    OTHER: {
      name: "other",
      color: "border_blue",
      bullet: "blue_bg"
    }
  }
  const stripHtml_fun = (a) => {
    let stripedHtml = a.replace(/<[^>]+>/g, "");
    return stripedHtml;
  };
  const getSeverity = (type) => {
    let severity
    for (let key in severityTypes) {
      if (severityTypes[key].name === type) severity = severityTypes[key]
    }
    if (severity) return severity
    else return severityTypes.OTHER
  }
  
  const changeDateFormate = (a) => {
    if (a) {
      var Arr = [
        "",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "July",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      var date_val = a.slice(5, 7);
      if (date_val.slice(0, 1) == "0") {
        date_val = date_val.slice(1, 2);
      }
      let m_data = a.slice(8, 10);
      let m_year = a.slice(0, 4);
      let month = Arr[date_val];
      return month + " " + m_data + " " + m_year;
    }
  };
  const scrollSpecifcs = async(e,id,alertId,count_id,title) => {
    
    const response=await alertAddtoUser({
      "userId":id,
      "alertId":alertId
  });
  props.callGetAlertsListAction_details(count_id)
    const violation = document?.getElementById(e);
    // let topicId = document?.getElementById(e)?.getAttribute("data-key");
    // topicId = document?.getElementById(topicId);
    // violation?.classList?.add("selected");
    violation?.scrollIntoView(true);
    // topicId?.scrollIntoView(true);
    mixpanel.track('Alerts', {'Alert headline': title,
      'User Details':{
      'User Name':`${userProfile?.firstName} ${userProfile?.lastName}`,
      'User Id':userProfile?.userId},})

  }
  let test_data = "";
  if (props.card_data != null) {
    if (props.card_id == "alerts") {
      const ListData = props.card_data.map((e, index) =>
     
        index < 4 ? (
          <div className={!e.isViewed?"details-wrap":"details-wrap alert-viewed"} data-test="alerts" key={index}>

            <span >{e.changeCategory}
              <div className={`round ${getSeverity(e.severityType).bullet}`} />
              <div className="date-ctrl">{changeDateFormate(e.alertDate)}</div>
            </span>
            <span data-test="alertClick" className={ permissionArray?.includes(constants.PERMISSION_MAPPING.LABOR_EMPLOYMENT_CONTENT)?"maintitle mt-1 mb-1 pr-0 cursor-pointer link":"maintitle mt-1 mb-1 pr-0"} onClick={() =>
              permissionArray?.includes(constants.PERMISSION_MAPPING.LABOR_EMPLOYMENT_CONTENT)?scrollSpecifcs(e.contentLevelId,props.id,e.alertId,props.count_id,e.alertTitle):""}
              
            >{e.alertTitle}</span>
          </div>
        ) : ""
              );
      if (ListData.length)
        test_data = ListData;
      else
        test_data = "No new alerts to show";
    } else {
      let insightData = []
      props?.card_data?.data?.forEach((e, index) => {
        if (index < 3) {
          insightData.push(e)
        }
      })
      const ListData = insightData?.map((e,index) =>
      (
        <div data-test="insight" key={index} className="details-wrap pointer " onClick={() => {
          history.push({
            pathname: `${constants.ROUTE.KNOWLEDGE_BASE.ARTICLE_PAGE}/${props?.countryName?.id}/${props?.countryName?.country_Name}/${e?.supertopicName}`,
            state: {
              supertopicName:
                e?.supertopicName,
            }
          })
          mixpanel.track('Insight and Analysis', {'Article headline':e?.supertopicName,
            'User Details':userDetailsMixpnel()})
        }} >
          <span>{e?.templateType}
            {show_notification_mark()} {changeDateFormate(e.publishedDate)}
            
          </span>
          <span className="maintitle mt-1 mb-1 pr-0 trim_three_lines decoration"
            dangerouslySetInnerHTML={{ __html: `${stripHtml_fun(e?.supertopicName.substring(0, 130))}${e?.supertopicName.length > 130 ? "..." : ""}` }}
          />
        </div>
      ));
      if (ListData.length)
        test_data = ListData;
      else
        test_data = "No new publications to show";
    }
  }
  const Loader = (props) => (
    <ContentLoader
      speed={2}
      width="100%"
      height={88}
      viewBox="0 0 100% 38"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="0" y="0" rx="2" ry="2" width="100%" height="88" />
    </ContentLoader>
  );
  return (
    <div className="col-lg-4 gutter-card" data-test="alertPage">
      <div className="header-container">
        <h3>
          {props?.title || "Alerts"}
          <img src={props?.title === "Alerts" ? bellIcon : newspaperIcon} alt="" />
        </h3>
        <span  onClick={ () =>props.card_id !== "alerts"&&props?.countryName?.country_Name ? 
          history.push({
            pathname: `${constants.ROUTE.KNOWLEDGE_BASE.INSIGHTS_ANALYSIS}/${props?.countryName?.id}/${props?.countryName?.country_Name}/${props?.countryName?.region_Id?.split(",")[1]?props?.countryName?.region_Id?.split(",")[1]:props?.countryName?.region_Id?.split(",")[0]}`,
            state: {
              tags: props?.countryName?.country_Name
            },
          })
         : ""} data-test="show-more">Show More</span>
      </div>
      {props.alertsDataLoading ? (
        <div
          className={
            props.noClass ? "details-wrap home-loader" : "details-wrap"
          }
        >
          <Loader />
        </div>
      ) :
        <div className="country-card">
          {/* <div className="card-header-wrap">
          <i className={props.icon} name={props.icon_name} />
          {props.title}
          <a href>Show more</a>
        </div> */}
         <span style={{marginLeft:"100px"}}> {test_data}</span>
        </div>
      }
    </div>
  );
};

export default AlertCard;
