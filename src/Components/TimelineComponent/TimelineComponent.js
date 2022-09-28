import React, { useEffect, useState } from "react";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import constants from "../../utils/constants";
import "./Timeline.css?.payload";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { permissionMapping } from "../../utils/utils";

function BasicTimeline() {
  const location = useLocation();
  const [path, setPath] = useState("");
  const userData = JSON.parse(localStorage.getItem("user-profile"));
  const permissionArray = permissionMapping();

  useEffect(() => {
    setPath(window.location.hash);
  }, []);

  const timeline = useSelector(state => state.user.timeline)
  return (
    <Timeline className="custom-Timeline_main" data-test='TimeLine'>
      <TimelineItem
        className={`${timeline && timeline.about_you?.payload ? "Custom-lineItem timeline-active" : "Custom-lineItem"}
        ${!(permissionArray?.includes(constants.PERMISSION_MAPPING.FAVORITE_COUNTRIES) ||
          permissionArray?.includes(constants.PERMISSION_MAPPING.ADDING_EMPLOYEE_COUNTS)) && 'hide-line'}`}
      >
        <TimelineContent className="Custom-timeline">About You</TimelineContent>
        <TimelineSeparator className="Separator-custom">
          <TimelineDot
            className={`Custom_Dot ${(location.pathname == "#/userProfile" || location.pathname == "/") && !timeline.about_you?.payload?.payload
              ? "dotted-style-active"
              : "dotted-style-next"
              }`}
          />
          <TimelineConnector />
        </TimelineSeparator>
      </TimelineItem>
      {
        permissionArray?.includes(constants.PERMISSION_MAPPING.FAVORITE_COUNTRIES) && (
          <TimelineItem
            className={
              timeline && timeline.country_selection?.payload
                ? "Custom-lineItem timeline-active"
                : "Custom-lineItem"
            }
            data-test='country'>
            <TimelineContent className="Custom-timeline">
              Country Selection
            </TimelineContent>
            <TimelineSeparator className="Separator-custom">
              <TimelineDot
                className={`Custom_Dot  ${location.pathname == "#/country" &&
                  !timeline.country_selection?.payload
                  ? "dotted-style-active"
                  : "dotted-style-next"
                  }`}
              />
              <TimelineConnector />
            </TimelineSeparator>
          </TimelineItem>
        )
      }

      {
        permissionArray?.includes(constants.PERMISSION_MAPPING.ADDING_EMPLOYEE_COUNTS) && (
          <TimelineItem
            // 
            className={`${timeline && timeline.employee_info?.payload ? "Custom-lineItem timeline-active" : "Custom-lineItem"}
            ${!permissionArray?.includes(constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER) && 'hide-line'}`}
          >
            <TimelineContent className="Custom-timeline">
              Employee Info
            </TimelineContent>
            <TimelineSeparator className="Separator-custom">
              <TimelineDot
                className={`Custom_Dot ${(location.pathname == "#/employee-information") && !timeline.employee_info?.payload
                  ? "dotted-style-active"
                  : "dotted-style-next"
                  }`}
              />
              <TimelineConnector className="Custom_Connector" />
            </TimelineSeparator>
          </TimelineItem>
        )
      }
      {
        permissionArray?.includes(constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER) && (
          <TimelineItem
            className={
              timeline && timeline.add_user?.payload
                ? "Custom-lineItem timeline-active"
                : "Custom-lineItem"
            }
          >
            <TimelineContent className="Custom-timeline">Add Users</TimelineContent>
            <TimelineSeparator className="Separator-custom">
              <TimelineDot
                className={`Custom_Dot ${location.pathname == "/add-user" && !timeline.add_user?.payload
                  ? "dotted-style-active"
                  : "dotted-style-next"
                  }`}
              />
            </TimelineSeparator>
          </TimelineItem>
        )
      }
    </Timeline>
  );
}

export default BasicTimeline
