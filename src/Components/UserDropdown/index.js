import React from "react";
import { Dropdown } from "react-bootstrap";
import constants from "../../utils/constants";
import profile_img from "../../assets/images/dp.jpeg";
import { useHistory } from "react-router-dom";
import { useKeycloak } from '@react-keycloak/web'


export default function UserDropdown(props) {
  const history = useHistory();
  const { keycloak } = useKeycloak();

  const onDropdownSelect = (eventKey) => {
    if (eventKey === "logout") {
      keycloak?.logout({ redirectUri: window.location.origin + '/login' });


    }
  };

  return (
    <Dropdown onSelect={onDropdownSelect} data-test="userDropDown">
      <Dropdown.Toggle
        as={React.forwardRef(({ onClick }, ref) => (
          <img
            id="dropdown-custom-components"
            ref={ref}
            onClick={(e) => {
              e.preventDefault();
              onClick(e);
            }}
            src={
              props?.user?.imageUrl
                ? `${constants.IMAGE.DOWNLOAD}${props?.user?.imageUrl}`
                : profile_img
            }
            data-test="img"
          />
        ))}
      />
      <Dropdown.Menu className="dropDown-container">
        <Dropdown.Item
          className="dropDown-child"
          eventKey="1"
          onClick={() =>
            history.push({
              pathname: `${constants.ROUTE.SIDEBAR.SETTINGS.MY_ACCOUNT}`,
              state: {
                showSettings: false,
              },
            })
          }
          data-test="item"
        >
          My Account
        </Dropdown.Item>
        <Dropdown.Item className="dropDown-child"
          eventKey="2"
          onClick={() =>
            history.push({
              pathname: `${constants.ROUTE.SIDEBAR.SETTINGS.PURCHASE_EXPERT_BRIEFS}`,
              state: {
                showSettings: false,
              },
            })
          } data-test="item2">
          My Documents
        </Dropdown.Item>
        {/* <Dropdown.Item className="dropDown-child" eventKey="">
          Change Password
        </Dropdown.Item> */}
        <Dropdown.Item className="dropDown-child" eventKey="logout">
          Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
