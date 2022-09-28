import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { getUserProfile, isLastLoginAttempted } from "../../../utils/storage";
import HeaderText from "../../Home/HeaderText";

import constants from "../../../utils/constants";

const PeopleAnalytics = (props) => {
    document.title = "People Analytics";
  const [userData, setUserData] = useState();

  useEffect(() => {
    var user_data = getUserProfile();
    localStorage.removeItem("regionId");
    setUserData(user_data);
  }, []);

  return (
    <div data-test="indexDiv">
      <div className="container-fluid loader-enable analytics">
        <HeaderText user={userData} peopleAnalytics={true} />
      </div>
      <div className="container-fluid">
        <div className="analytics_grid">
          <div className="analytics-main">
            <div className="analytics_header">
            <div className="filter_left">
              <h4>Datalake</h4>
              <div className="filter-seperator"></div>
              <div className="select-alanytic">
                <span>Datalake</span>
                <div className="dd_img"></div>
              </div>
              <div className="time_wrapper">
                <span>Oct 21, 2021 1:41 PM</span>
              </div>
            </div>
            <div className="filter_right d-flex ml-auto">
              <div className="add-widget">
                <span>Widget</span>
                <div className="add-widget-icon"></div>
              </div>
              <div className="widget-holder"></div>
              <div className="widget-holder"></div>
              <div className="dropDown_widget"></div>
            </div>
            </div>
            <div className="analytics-container">
              <div className="chart-area">
                
              </div>
              <div className="piechart-area">
                
              </div>
            </div>
          </div>
          <div className="filter-grid-right">
            <div className="top-filter">
              <h3>Filter</h3>
              <div className="add-filter-widget ml-auto"></div>
              <div className="dropDown_widget"></div>
            </div>
            <div className="widget-filter-container">
              <span>
                <div className="placeholder-sm"></div>
                <div className="placeholder-100"></div>
              </span>
              <span>
                <div className="placeholder-sm"></div>
                <div className="placeholder-100"></div>
              </span>
              <span>
                <div className="placeholder-sm"></div>
                <div className="placeholder-100"></div>
              </span>
              <span>
                <div className="placeholder-sm"></div>
                <div className="placeholder-100"></div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleAnalytics;
