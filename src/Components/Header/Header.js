import React, { useState } from "react";

const Header = (props) => {
  return ( 
    <div className="row" data-test="header">
      <div className="search-wrapper">
        <input
          type="text"
          className="form-control"
          placeholder="Ask a question"
        />
        <ion-icon name="search-outline" className="search-icon" />
        <div className="profile-wrap">
          <img src="images/dp.jpeg" />
        </div>
      </div>
    </div>
  );
};

export default Header;
