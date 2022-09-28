import React from 'react';
import profile_img from "../../assets/images/dp.jpeg";
import constants from '../../utils/constants';
import { Dropdown } from "react-bootstrap"
import { logOutUser } from '../../utils/storage';
import { useHistory } from 'react-router';
import searchIcon from "../../assets/images/search_icon_1.svg";
import shoppingIcon from "../../assets/images/shopingCartBlack.svg";
import UserDropdown from '../../Components/UserDropdown';
import layoutTextWindow from "../../assets/images/layout-text-window.svg";
import gridColoured from "../../assets/images/grid-coloured.svg";
import gridOutLine from "../../assets/images/grid-outline.svg";
import tableColoured from "../../assets/images/table-coloured.svg";
import SearchBar from "../../Components/SearchBar";
import { Link } from 'react-router-dom';

const HeaderText = (props) => {
  const { setViewType, viewType } = props;
  const history = useHistory()
  const showTutorial = sessionStorage.getItem("showTutorial");
  return (
    <>
      <SearchBar user={props.userData} />
      <div className="row" data-test='headerText'>
        <div className="header_wrapper col-12">
          {props.hideTitle ? null : (<h2 className="header-28" data-test="my-country">{props.peopleAnalytics?"People Analytics": "My Countries"}</h2>)}
          {props.peopleAnalytics?"":<div className="layout_ctrl ">
            <a
              className={`${(viewType === "table") &&
                !showTutorial ?
                "active" :
                ""} 
           `
              }
              onClick={() => setViewType("table")}
            >
              <img
                alt=''
                src={
                  `${(viewType === "table") && !showTutorial ?
                    tableColoured :
                    layoutTextWindow}`
                }
                name="tabel-view"
                className="card-table-view  table-view" />
            </a>
            {/* <a href="#" style={{display: "none"}}></a> */}
            <a
              className={`${(viewType === "card") && !showTutorial ? "active" : ""}`}
              onClick={() => setViewType("card")}
            >
              {/* <ion-icon name="document-text-outline" /> */}
              <img
                alt=''
                src={
                  `${(viewType === "card") && !showTutorial ?
                    gridColoured :
                    gridOutLine}`
                }
                name="layout-window" />
            </a>
            {/* <a href="#" className="active">
              <img alt='' src={gridOutLine} name="grid-outline" className="" />
            </a> */}
          </div>}
        </div>
      </div>
    </>
  );
};

export default HeaderText;