import React, { useState } from "react";
import logo from "../../assets/images/expando-logo.svg";
import TimelineComponent from "../TimelineComponent/TimelineComponent";

const Sidebar = () => {
  return (
   <div className="left_menu_wrapper">
  <div className="logo_placer mt-4">
    <img src={logo} />
  </div>
  <div className="menu d-flex justify-content-center">
    <ul>
      <li><a href><ion-icon name="home-outline" className="menu-ico active" /></a></li>
      <li><a href><i className="ph-globe-hemisphere-east" /></a></li>
      <li><a href><ion-icon name="stats-chart" className="menu-ico" /></a></li>
      <li><a href><ion-icon name="book-outline" className="menu-ico" /></a></li>
      <li><a href><ion-icon name="cart-outline" className="menu-ico" /></a></li>
      <li><a href><i className="ph-dots-three" /></a></li>
      <li><a href><ion-icon name="settings-outline" className="menu-ico" /></a></li>
    </ul>
  </div>
</div>

  );
};

export default Sidebar;
