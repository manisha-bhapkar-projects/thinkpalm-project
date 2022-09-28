import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import logo from "../../assets/images/expando-logo.svg";
import constants from "../../utils/constants";
import { Dropdown } from "react-bootstrap";

import favourite from "../../assets/images/favorite.svg";
import countries from "../../assets/images/countries.svg";
import user from "../../assets/images/user.svg";
import user2 from "../../assets/images/user2.svg";

import usercopy from "../../assets/images/usercopy.svg";
import subscription from "../../assets/images/subscription.svg";
import purchase from "../../assets/images/purchase.svg";
import homeIcon from "../../assets/images/home.svg";
import settingsIcon from "../../assets/images/settings.svg";
import hamburgerIcon from "../../assets/images/hamburger-menu.svg";
import book from "../../assets/images/book.svg";
import chartIcon from "../../assets/images/bar-chart.svg";
import documentIcon from "../../assets/images/document-stack.svg";
import globIcon from "../../assets/images/globe.svg"
import { useSelector } from "react-redux";
import ComingSoon from "../ComingSoon";
import { getKeyClockToken_Data } from "../../utils/storage"
import jwt_decode from "jwt-decode";
import mixpanel from 'mixpanel-browser';
import {userDetailsMixpnel} from '../../utils/utils'
mixpanel.init(constants.MIXPANEL_TOKEN);


const menuOptions = [
  {
    path: constants.ROUTE.SIDEBAR.HOME,
    icon: homeIcon,
    cName: "",
    name: "home",
  },
  {
    path: constants.ROUTE.COUNTRY.ALL_COUNTRY,
    icon: globIcon,
    cName: "",
    name: "globe", // please provide meaningful name here once page details are available

  },
  {
    path: constants.ROUTE.SIDEBAR.HOME,
    icon: chartIcon,
    cName: "stats-chart",
    name: "charts",
    comingSoon: "true"
  },
  {
    path: constants.ROUTE.KNOWLEDGE_BASE.HOME,
    icon: book,
    cName: "book-outline",
    name: "book",
  },
  {
    path: constants.ROUTE.HR_TEMPLATE_PAGE.DOC_SHOP,
    icon: documentIcon,
    cName: "cart-outline",
    name: "cart",
  },
  {
    path: constants.ROUTE.SIDEBAR.HOME,
    icon: hamburgerIcon,
    cName: "",
    name: "dots-menu",
    comingSoon: "true"
  },
];

const Sidebar = ({ settings = {} }) => {
  const history = useHistory();
  const token_data = getKeyClockToken_Data();
  const userData = token_data ? jwt_decode(token_data) : undefined;
  const scopeArray = userData?.scope?.split(" ");
  const permissionArray = scopeArray && scopeArray.length > 0 ? scopeArray : []
  const { active } = settings;
  const userProfile = useSelector(state => state.user?.userProfile)
  const showTutorial = sessionStorage.getItem("showTutorial");
  return (
    <div className="left_menu_wrapper" data-test="sidebar">
      <div className="logo_placer mt-4" data-test="image">
        <img src={logo} />
      </div>
      <div className="menu py-4">
        <ul className="sidebar">
          {menuOptions.map((item, index) => (
            <li key={index}
              className={` ${(active === item.name) && !showTutorial ? "active-selected display_comingsoon relative" : "display_comingsoon relative"
                }`} onClick={()=>item.name==='cart'?mixpanel.track('Click on Doc Shop', {
                'User Details':userDetailsMixpnel()}):""} >
              <NavLink key={index} to={item?.path} className={`${item?.cName} ${item.name}`}>
                <img
                  alt=""
                  src={item?.icon}

                />
              </NavLink>
              {item.comingSoon ? <ComingSoon direction="left"></ComingSoon> : ""}
            </li>
          ))}
          {/* {userProfile?.roleName === "expandopedia_admin" || userProfile?.roleName === "CompanyAdmin" || userProfile?.roleName === "EGS General" ? ( */}
          <li key={7} className="">
            <Dropdown drop="right">
              <Dropdown.Toggle
                as={React.forwardRef(({ children, onClick }, ref) => (
                  <div style={{
                    display: "flex",
                    height: "100%",
                    width: "100%",
                    alignItems: "center"
                  }} onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                  }}
                    ref={ref} >
                    <span style={{
                      display: "inline-block",
                      width: "100%",
                      textAlign: "center"
                    }}>
                      <img
                        alt=''
                        src={settingsIcon}
                        className={`ph-gear ${active === "settings" ? "ph-house-selected" : ""
                          }`}
                      />
                    </span>
                  </div>
                ))}
                id="dropdown-custom-components"
              ></Dropdown.Toggle>

              <Dropdown.Menu className="super-colors submenu">
                <Dropdown.Item eventKey="1"
                  onClick={() =>
                    history.push({
                      pathname: `${constants.ROUTE.SIDEBAR.SETTINGS.MY_ACCOUNT}`,
                      state: {
                        showSettings: true,
                      },
                    })
                  }>
                  <img src={user2} />
                  My Account
                </Dropdown.Item>
                {/* {userProfile?.roleName !== "EGS General" && ( */}
                <div>
                  {
                    permissionArray?.includes(constants.PERMISSION_MAPPING.ACCOUNT_LISTING_PAGE) &&
                    <Dropdown.Item
                      eventKey="2"
                      // className={permissionArray?.includes(constants.PERMISSION_MAPPING.ACCOUNT_LISTING_PAGE) ? "" : "list-disabled"}
                      onClick={() =>
                        history.push(`${constants.ROUTE.SIDEBAR.SETTINGS.USERLIST}`)
                      }
                    >
                      <img src={usercopy} />
                      Accounts & Users
                    </Dropdown.Item>
                  }
                  {
                    permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_USER) &&
                    <Dropdown.Item
                      eventKey="7"
                      // className={permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_USER) ? "" : "list-disabled"}
                      onClick={() =>
                        history.push(`${constants.ROUTE.SIDEBAR.SETTINGS.USERS}`)
                      }
                    >
                      <img src={usercopy} />
                      Users
                    </Dropdown.Item>
                  }
                  {
                    permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_ROLES) &&
                    <Dropdown.Item eventKey="3"
                      // className={permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_ROLES) ? "" : "list-disabled"} 
                      onClick={() =>
                        history.push(`${constants.ROUTE.ROLES_PAGE.ROLES}`)
                      }>
                      <img src={user} />
                      Roles &amp; Permissions
                    </Dropdown.Item>
                  }
                  {
                    permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_SUBSCRIPTION_PAGE) &&
                    <Dropdown.Item eventKey="4"
                      // className={permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_SUBSCRIPTION_PAGE) ? "" : "list-disabled"} 
                      onClick={() =>
                        history.push(`${constants.ROUTE.SUBSCRIPTION_PAGE.ALL}`)
                      }>
                      <img src={subscription} />
                      Subscription
                    </Dropdown.Item>
                  }

                </div>
                {/* )} */}
                {
                  permissionArray?.includes(constants.PERMISSION_MAPPING.FAVORITE_COUNTRIES) &&
                  <Dropdown.Item eventKey="5"
                    // className={permissionArray?.includes(constants.PERMISSION_MAPPING.FAVORITE_COUNTRIES) ? "" : "list-disabled"}
                    onClick={() =>
                      history.push(`${constants.ROUTE.SIDEBAR.SETTINGS.FAVORITE_COUNTRIES}`)
                    }>
                    <img src={favourite} />
                    Favorite Countries
                  </Dropdown.Item>

                }
                {/* {userProfile?.roleName !== "EGS General" && ( */}
                <div>
                  
                  { permissionArray?.includes(constants.PERMISSION_MAPPING.ASSIGN_TO_EXPERT) && 
                  <Dropdown.Item eventKey="7" href={'#' + constants.ROUTE.SIDEBAR.SETTINGS.MANAGE_BRIEFS} className="display_comingsoon">
                    <img src={purchase} />
                    Briefs
                  </Dropdown.Item>
                  }
                  {( permissionArray?.includes(constants.PERMISSION_MAPPING.SUBMIT_QUERY)||
                    permissionArray?.includes(constants.PERMISSION_MAPPING.ACCESS_AND_DOWNLOAD_PAST_PURCHASE)||
                    permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_MY_ACCOUNT_QUERIES)) &&
                      <Dropdown.Item eventKey="6" href={'#' + constants.ROUTE.SIDEBAR.SETTINGS.PURCHASE_EXPERT_BRIEFS} className="display_comingsoon" 
                      onClick={()=>{mixpanel.track('Click on Purchase and Expert Brief', {
                        'User Details':userDetailsMixpnel()})}}> 
                 
                     {/* <ComingSoon direction="left"></ComingSoon> */}
                     <img src={purchase} />
                       Purchases & Expert Briefs
                     </Dropdown.Item> }
                  {
                    permissionArray?.includes(constants.PERMISSION_MAPPING.ADD_REPLACE_HR_TEMPLATE) &&
                    <Dropdown.Item eventKey="6"
                      // className={permissionArray?.includes(constants.PERMISSION_MAPPING.PURCHASE_NEW_HR_TEMPLATES) ? "" : "list-disabled"}
                      href={'#' + constants.ROUTE.HR_TEMPLATE.LIST}>
                      <img src={purchase} />
                      HR Template
                    </Dropdown.Item>
                  }
                  
                     
                  
                  {
                    permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_COUNTRIES_LISTING_PAGE) &&
                    <Dropdown.Item eventKey="6"
                      href={'#' + constants.ROUTE.SIDEBAR.SETTINGS.COUNTRY_CONFIGURATION}
                    // className={permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_COUNTRIES_LISTING_PAGE) ? "" : "list-disabled"}
                    >
                      <img src={countries} />
                      Countries
                    </Dropdown.Item>

                  }
                </div>
                {/* )} */}

              </Dropdown.Menu>
            </Dropdown>
          </li>
          {/* ) : null} */}
        </ul>
      </div>
    </div >
  );
};

export default Sidebar;
