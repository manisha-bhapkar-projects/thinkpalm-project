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
import ReactDropdown from "../../../Components/CustomeSelectDropDown/reactDropdown";
import CustomModal from './CustomModal';
import Loader from "../../../Components/Loader";

/* Action */
import {
  callAddSuperAdminUser,
  addSuperAdminUser,
  callgetAdministratorRole,
  callgetCompanyList,
} from "../../../Store/reducers/superAdminUser";

const SuperAdminAddUser = (props) => {
  document.title = "Settings";
  const history = useHistory();
  const { company } = useParams();
  const permissionArray = permissionMapping();
  const emptyUserDetails = {
    firstName: "",
    lastName: "",
    emailId: "",
    CompanyId: "",
    roleId: "",
    industryName: "",
    availableLicence: "",
  };

  const [userData, setUserData] = useState();
  const [loading, setLoading] = useState(false);
  const [userLimitModal, setUserLimitModal] = useState(false);
  const [isUnlimitedLisense, setIsUnlimitedLisense] = useState(false);
  const [initialValues, setInitialValues] = useState({ ...emptyUserDetails });

  const dispatch = useDispatch();
  const roleData = useSelector(
    (state) => state.superAdminUserReducer.administratorRole
  );
  const addUser = useSelector((state) => state.superAdminUserReducer.addUser);

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
  const { companyListLoading } = useSelector((state) => state.superAdminUserReducer);
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
    if (!props.testCase) await dispatch(callgetCompanyList());
    if (!props.testCase) await dispatch(callgetAdministratorRole());
    setUserData(user_data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (companyList?.length > 0 && company && initialValues.CompanyId === '') {
      const companyInfo = companyList.find(x => x.id == company);
      if (companyInfo) {
        setInitialValues({
          ...initialValues,
          companyName: companyInfo.companyName,
          CompanyId: companyInfo,
          availableLicence: companyInfo.availableLicenses
        });
      }
    }
  }, [company, companyList?.length]);

  const handleChangeValue = (e) => {
    setInitialValues({
      ...initialValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeCompany = (e) => {
    // let value = companyData.filter((x) => x.companyName == e.target.value);

    setIsUnlimitedLisense(e?.isUnlimitedLisense || false);
    setInitialValues({
      ...initialValues,
      CompanyId: e,
      industryName: e.industryName,
      availableLicence: e.availableLicenses
    });
  };

  const handleSubmit = async (e, save_stay) => {
    e.preventDefault();

    if (initialValues.CompanyId === "" || (initialValues.CompanyId === null && initialValues.CompanyId.id === "")) {
      props.notify('Please choose company!');
    } else if (initialValues.firstName === "") {
      props.notify('Please fill first name!');
    } else if (initialValues.lastName === "") {
      props.notify('Please fill last name!');
    } else if (initialValues.emailId === "") {
      props.notify('Please fill email address!');
    } else if (!props.testCase && (initialValues.roleId === "" || (initialValues.roleId === null && initialValues.roleId.id === 0))) {
      props.notify('Please choose user role!');
    } else {
      // 
      setLoading(true);
      const response = await addSuperAdminUser({
        initialValues: { ...initialValues, CompanyId: initialValues.CompanyId.id, roleId: initialValues.roleId.id },
        backToAccounts: company,
        history: history,
        notify: props.notify,
      });

      const isError = response && response.error && !isUnlimitedLisense;

      if (isError) {
        if (response?.data?.indexOf('Licence limit exceeded') > -1) {
          setUserLimitModal(true);
        } else if (response.data) {
          props.notify(response.data, 3000)
        }
      } else if (isUnlimitedLisense || (response && response.data)) {
        props.notify("User Added Successfully");
        if (company && !save_stay) {
          history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Accounts');
        } else if (!save_stay) {
          history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Users');
        } else {
          if (company) {
            setInitialValues({
              ...initialValues,
              firstName: '',
              lastName: '',
              emailId: '',
              roleId: '',
              industryName: '',
            });
          } else {
            setInitialValues({
              ...initialValues,
              firstName: '',
              lastName: '',
              emailId: '',
              roleId: '',
              industryName: '',
              CompanyId: '',
              availableLicence: '',
            });
          }

          if (!props.testCase) await dispatch(callgetCompanyList());
          setLoading(false);
        }
      }
      setLoading(false);
    };
  };

  const handleChangeRole = (value) => {
    // let value = roleData.find((x) => x.roleName == e.target.value);
    setInitialValues({
      ...initialValues,
      roleId: value || {}
    });
  };

  return (
    <div data-testid="superAdminAddUser" data-test="superAdminAddUser" className="super-admin-add-user loader-enable">
      {
        (loading || companyListLoading) &&
        (<div className="custom-loader">
          <Loader />
        </div>)
      }
      <SearchHeaderText
        breadcrumb={true}
        titleHeader={true}
        onSave_Add={(e) => handleSubmit(e, true)}
        backToAccounts={company}
        pageTitle="Add User"
        onClick={handleSubmit}
        user={userData}
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

export default SuperAdminAddUser;
