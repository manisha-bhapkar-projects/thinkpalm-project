import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import UserRegistrationSidebar from "../UserRegistrationLayout/UserRegistrationSidebar";

const Layout = ({ children, settings = {} }) => {
  const url = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
  const { isUserRegistration, sidebarSettings } = settings;
  return (
    <div className={`main_wrapper position-relative ${url === "forum" && "forum-class"}`} data-test="layout">
      {isUserRegistration
        ? <UserRegistrationSidebar settings={sidebarSettings} />
        : <Sidebar settings={sidebarSettings} />
      }
      <div className="common-wrapper" data-test='children'>
        {children}
      </div>
    </div>
  );
};


export default Layout;

