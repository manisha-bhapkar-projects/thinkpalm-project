import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { permissionMapping } from "../../../utils/utils";

/* Icons */
import calender from "../../../assets/images/calendar-ico.svg";

/* Component */
import SearchHeaderText from "../../../Components/SearchHeaderText/SearchHeaderText";
import CustomeSelectDropdown from "../../../Components/CustomeSelectDropDown/CustomeSelectDropdown";
import TextFieldComponent from "../../../Components/TextFieldComponent/TextFieldComponent";
import { CustomeNotification } from "../../../Components/CustomeNotification/CustomeNotification";
import { getUserProfile } from "../../../utils/storage";
import constants from "../../../utils/constants";
import SupportButton from "../../../Components/SupportButton";
import Loader from "../../../Components/Loader";

/* Action */
import {
  getUserInfo,
  addEditUserInfo,
  addSuperAdminUser,
} from "../../../Store/reducers/superAdminUser";
import mixpanel from 'mixpanel-browser';
import {userDetailsMixpnel} from '../../../utils/utils'
mixpanel.init(constants.MIXPANEL_TOKEN);
const UserAddEdit = (props) => {
  document.title = "Settings - Manage Users";
  const history = useHistory();
  const { id } = useParams();
  const isEdit = id !== 'add';
  const permissionArray = permissionMapping();
  const emptyUserDetails = {
    firstName: "",
    lastName: "",
    emailId: "",
    isAdmin: false
  };

  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({ ...emptyUserDetails });
  const [isChecked, setIsChecked] = useState(false);

  const dispatch = useDispatch();

  useEffect(async () => {
    if (!permissionArray?.includes(constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER)) {
      history.push("/home")
    }
    var user_data = getUserProfile();
    setUserData(user_data);
  }, []);

  useEffect(async () => {
    if (id) {
      if (id !== "add") {
        setLoading(true);
        let userInfo = await getUserInfo(id);
        setLoading(false);
        if (userInfo.error) {
          props.notify('Failed to get the user info!', 3000);
          history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERS);
        } else if (userInfo) {
          const { data } = userInfo;
          setInitialValues({
            firstName: data?.userProfile?.firstName,
            lastName: data?.userProfile?.lastName,
            emailId: data?.emailId,
            isAdmin: data?.isAdmin
          });
        }
      }
    } else {
      props.notify('Failed to get access!', 3000);
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERS);
    }
  }, [id]);

  const handleChangeValue = (e) => {
    if (e.target.name === 'isAdmin') {
      setInitialValues({
        ...initialValues,
        [e.target.name]: e.target.checked,
      });
    } else {
      setInitialValues({
        ...initialValues,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e, save_stay) => {
    e.preventDefault();

    if (initialValues.firstName === "") {
      props.notify('Please fill first name!', 3000);
    } else if (initialValues.lastName === "") {
      props.notify('Please fill last name!', 3000);
    } else if (initialValues.emailId === "") {
      props.notify('Please fill email address!', 3000);
    } else {

      setLoading(true);
      const response = await addEditUserInfo({
        initialValues,
        id: id != 'add' ? id : undefined,
      });
      setLoading(false);

      if (response && response.error) {
        if (response.statusText && response.statusText != "") {
          props.notify(response.statusText);
        } else {
          props.notify("Failed to update User");
        }
        history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERS);

      } else if (response && response.data) {
        if (id) {
          props.notify("User Updated Successfully");
        } else {
          props.notify("User Added Successfully");
         
        }
        mixpanel.track('Add Users', {
          'First Name':initialValues.firstName, 
          'Last Name': initialValues.lastName,
          'Email': initialValues.emailId,
          'User Details':userDetailsMixpnel()})
        history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERS);
      }
    };
  };

  const handleOnChange = (e) => {
    setIsChecked(!isChecked);
  };
  return (
    <div data-testid="superAdminAddUser" className="super-admin-add-user loader-enable">
      {
        loading &&
        (<div className="custom-loader">
          <Loader />
        </div>)
      }
      <SearchHeaderText
        breadcrumb={true}
        manageUsersAddEdit={true}
        isEdit={isEdit}
        pageTitle={isEdit ? "Edit User" : "Add User"}
        onClick={handleSubmit}
        user={userData}
      />
      <div className="container-fluid">
        <div className="form-wrapper">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <h4>User Info</h4>
              </div>
              <div className="col-lg-5">
                <div className="floating">
                  <TextFieldComponent
                    id="firstName"
                    label="First name*"
                    data-test="firstName"
                    testid="firstName"
                    dataContent="First name*"
                    type="text"
                    placeholder=""
                    keyPress="account"
                    name="firstName"
                    value={initialValues.firstName}
                    onChange={handleChangeValue}
                  />
                </div>
              </div>
              <div className="col-lg-5">
                <TextFieldComponent
                  id="lastName"
                  label="Last Name*"
                  data-test="lastName"
                  dataContent="Last Name*"
                  testid="lastName"
                  type="text"
                  keyPress="account"
                  placeholder=""
                  name="lastName"
                  value={initialValues.lastName}
                  onChange={handleChangeValue}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-5 popup-text-box-user-add">
                <div className="floating mb-3">
                  <TextFieldComponent
                    id="email"
                    label="Email Address*"
                    data-test="email"
                    testid="email"
                    dataContent="Email Address*"
                    type="email"
                    name="emailId"
                    placeholder=""
                    value={initialValues.emailId}
                    onChange={handleChangeValue}
                  />
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="isAdmin"
                    name="isAdmin"
                    value="1"
                    checked={initialValues.isAdmin}
                    onChange={handleChangeValue}
                  />
                  <label
                    className="form-check-label mr-2"
                    htmlFor="isAdmin"
                  >
                    User has admin privileges
                  </label>
                  <a
                    href
                    className="info-wrap-tooltip"
                  >
                    <i className="ph-question"></i>
                    <div className="info-content">
                      <h4>What’s this?</h4>
                      <p>
                        Admin users can add and
                        manage other users.
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SupportButton />
    </div>
  );
};

export default UserAddEdit;
