import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/* Icons */
import calender from "../../../assets/images/calendar-ico.svg";

/* Component */
import SearchHeaderText from "../../../Components/SearchHeaderText/SearchHeaderText";
import CustomeSelectDropdown from "../../../Components/CustomeSelectDropDown/CustomeSelectDropdown";
import TextFieldComponent from "../../../Components/TextFieldComponent/TextFieldComponent";
import ReactDropdown from "../../../Components/CustomeSelectDropDown/reactDropdown";
import { getUserProfile } from "../../../utils/storage";
import constants from "../../../utils/constants";
import SupportButton from "../../../Components/SupportButton"
import { permissionMapping } from "../../../utils/utils";
import CustomModal from './CustomModal';
import Loader from "../../../Components/Loader";

/* Action */
import {
  callgetAdministratorRole,
  callgetCompanyList,
  callgetSpecificUserDetails,
  callUpdateSuperAdminUser,
  updateUserStatus,
  callChangeUserStatusAPI,
} from "../../../Store/reducers/superAdminUser";

const SuperEditAddUser = (props) => {
  document.title = "Settings";
  const history = useHistory();
  const id = props?.match?.params?.id;
  const [RoleId, setRoleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [userLimitModal, setUserLimitModal] = useState(false);
  const EditFlag =
    props.location && props.location.state && props.location.state.editFlag
      ? props.location.state.editFlag
      : "";
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    CompanyId: "",
    industryName: "",
    roleId: "",
    companyName: "",
    availableLicence: "",
  });
  const [stateValue, setStateValue] = useState({});
  const permissionArray = permissionMapping();

  const dispatch = useDispatch();
  const roleData = useSelector(
    (state) => state.superAdminUserReducer.administratorRole
  );
  const userDetails = useSelector(
    (state) => state.superAdminUserReducer.userDetails
  );
  const { updateUser } = useSelector((state) => state.superAdminUserReducer);

  const userRoles =
    roleData &&
    roleData.map((x) => {
      return {
        ...x,
        value: x.id,
        label: x.roleName,
      };
    });

  const companyData = useSelector(
    (state) => state.superAdminUserReducer.companyList
  );
  const companyList =
    companyData &&
    companyData.map((x) => {
      return {
        ...x,
        value: x.id,
        label: x.companyName,
      };
    });
  useEffect(async () => {
    if (!permissionArray?.includes(constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER)) {
      history.push("/home")
    }
    setLoading(true);
    var user_data = getUserProfile();
    if (!props.testCase) await dispatch(callgetSpecificUserDetails({ id: id }));
    if (!props.testCase) await dispatch(callgetCompanyList());
    if (!props.testCase) await dispatch(callgetAdministratorRole());
    setLoading(false);
    setUserData(user_data);
  }, []);

  useEffect(() => {
    setInitialValues({
      ...initialValues,
      companyName: userDetails?.company?.companyName,
      CompanyId: { ...userDetails?.company, value: userDetails?.company?.id, label: userDetails?.company?.companyName },
      industryName: userDetails?.company?.industryName,
      firstName: userDetails?.userProfile?.firstName,
      lastName: userDetails?.userProfile?.lastName,
      roleId: { id: userDetails?.roleId, value: userDetails?.roleId, label: userDetails?.roleName },
      emailId: userDetails?.emailId,
      availableLicence: userDetails?.company?.availableLicenses || 0
    });

    setStateValue({ ...userDetails });
  }, [userDetails]);

  useEffect(() => {
    if (updateUser) {
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Users');
    }
  }, [updateUser]);

  useEffect(() => {
    if (roleData && roleData.length) {
      const temp =
        roleData &&
        roleData.filter((role) => role.description == "Administrator");
      setRoleId(temp && temp.length ? temp[0].id : "");
    }
  }, [roleData]);

  const handleChangeValue = (e) => {
    setInitialValues({
      ...initialValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeRole = (value) => {
    // let value = roleData.find((x) => x.roleName == e.target.value);
    setInitialValues({
      ...initialValues,
      roleId: value || {}
    });
  };

  const handleChangeCompany = (value) => {
    // let value = companyData.filter((x) => x.companyName == e.target.value);

    setInitialValues({
      ...initialValues,
      CompanyId: value,
      companyName: value.companyName,
      industryName: value.industryName,
      availableLicence: value.availableLicenses
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (initialValues.CompanyId === "" || (initialValues.CompanyId === null && initialValues.CompanyId.id === "")) {
      props.notify('Please choose company!');
    } else if (initialValues.firstName === "") {
      props.notify('Please fill first name!');
    } else if (initialValues.lastName === "") {
      props.notify('Please fill last name!');
    } else if (initialValues.emailId === "") {
      props.notify('Please fill email address!');
    } else if (initialValues.roleId === "" || (initialValues.roleId === null && initialValues.roleId.id === 0)) {
      props.notify('Please choose user role!');
    } else {

      const request = {
        firstName: initialValues.firstName,
        lastName: initialValues.lastName,
        emailId: initialValues.emailId,
        CompanyId: initialValues.CompanyId.id,
        roleId: initialValues.roleId.id,
        industryName: initialValues.industryName,
      };

      setLoading(true);
      if (stateValue?.userProfile?.isActive === false) {
        let status = await updateUserStatus({
          id: id,
          statusFlag: true,
          history: history,
          notify: props.notify,
        });

        if (status && status.error) {
          props.notify(status.data || 'Failed to update user!');
        } else {
          if (!props.testCase) dispatch(callUpdateSuperAdminUser({
            id,
            request,
            history: history,
            notify: props.notify,
          }));
        }
      } else {
        if (!props.testCase) dispatch(callUpdateSuperAdminUser({
          id,
          request,
          history: history,
          notify: props.notify,
        }));
      }

      setLoading(false);
    };
  };

  return (
    <div data-testid="SuperAdminEditUser" data-test="SuperAdminEditUser" className="loader-enable">
      {
        loading &&
        (<div className="custom-loader">
          <Loader />
        </div>)
      }
      <SearchHeaderText
        breadcrumb={true}
        isEdit={true}
        titleHeader={true}
        pageTitle="Edit User"
        onClick={handleSubmit}
        user={userData}
        activeUser={EditFlag}
      />
      <div className="container-fluid">
        <div className="form-wrapper">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <h4>Account Info</h4>
              </div>

              <div className="col-lg-4">
                <div className="floating">
                  <ReactDropdown
                    id="companyName"
                    name="companyName"
                    placeholder=""
                    htmlFor="companyName"
                    data_content="Company*"
                    title="Company"
                    Prefilled={initialValues.CompanyId}
                    data={companyList ? companyList : ""}
                    onChange={handleChangeCompany}
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <TextFieldComponent
                  id="availableLicence"
                  label="Available Licenses"
                  isDisabled={true}
                  data-test="availableLicence"
                  dataContent="Available Licenses"
                  type="number"
                  placeholder=""
                  name="availableLicence"
                  value={initialValues.availableLicence}
                  onChange={handleChangeValue}
                />
              </div>
            </div>
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
                    keyPress="account"
                    placeholder=""
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
                  testid="lastName"
                  dataContent="Last Name*"
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
              <div className="col-lg-5">
                <div className="floating">
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
              </div>
              <div className="col-lg-5">
                <div className="floating">
                  <ReactDropdown
                    id="role"
                    name="role"
                    htmlFor="role"
                    testid="role"
                    data_content="Role*"
                    title="Role*"
                    data={userRoles || []}
                    onChange={handleChangeRole}
                    value={initialValues.roleId}
                    Prefilled={initialValues.roleId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CustomModal
        status={userLimitModal}
        onModalClose={() => setUserLimitModal(false)}
        headerTitle={`Additional Users Limit`}
        bodyText={`This account includes ${initialValues.availableLicence} user licenses. More users can be added to this account if additional user licenses are purchased.`}
        saveBtnTitle="Got it, thanks!"
        disableCancel={true}
        confirmAction={() => {
          setUserLimitModal(false)
        }}
      />
      <SupportButton />
    </div>
  );
};

export default SuperEditAddUser;
