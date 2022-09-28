import React from "react";
import logo from "../../assets/images/expando-logo.svg";
import TimelineComponent from "../TimelineComponent/TimelineComponent";

const UserRegistrationSidebar = () => {
  return (
    <>
      <div className="left_menu_wrapper custom_left_menu" data-test='userreg-sidebar'>
        <div className="logo_placer mt-4">
          <img src={logo} />
        </div>
        <TimelineComponent />
      </div>
    </>
  );
};

export default UserRegistrationSidebar;
