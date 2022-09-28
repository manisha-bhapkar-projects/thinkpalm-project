import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

/* Icons */
import calender from '../../../assets/images/calendar-ico.svg';
import helpIcon from '../../../assets/images/help-icon.svg';

/* Component */
import SearchHeaderText from '../../../Components/SearchHeaderText/SearchHeaderText';
import CustomeSelectDropdown from '../../../Components/CustomeSelectDropDown/CustomeSelectDropdown';
import ReactDropdown from '../../../Components/CustomeSelectDropDown/reactDropdown';
import TextFieldComponent from '../../../Components/TextFieldComponent/TextFieldComponent';
import { CustomeNotification } from '../../../Components/CustomeNotification/CustomeNotification';
import { getUserProfile } from '../../../utils/storage';
import constants from '../../../utils/constants';
import SupportButton from '../../../Components/SupportButton';
import Loader from '../../../Components/Loader';

/* Action */
import {
  addNewAccount,
  getIndustryList,
  getAllCountryList,
  callgetCompanyList,
  getAllSubscriptions,
} from '../../../Store/reducers/superAdminUser';
import Checkbox from '../../../Components/Inputs/Checkbox';

const AddAccount = (props) => {
  document.title = 'Settings';
  const history = useHistory();
  const currentState = window.location.href.split('/');
  const [userData, setUserData] = useState();
  const [helpText, setHelpText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUnlimitedLisense, setIsUnlimitedLisense] = useState(false);
  const [disableCountryDropdown, setDisableCountryDropdown] = useState(true);

  const [initialValues, setInitialValues] = useState({
    companyName: '',
    companyCode: '',
    industry: '',
    noOfLicense: '',
    subscription: '',
    country: '',
    registrationDate: moment().format('YYYY-MM-DD'),
    renewalDate: '',
    additionalHRTemplate: '',
    hrTemplateDiscount: '',
    additionalExpertHrs: '',
  });

  const dispatch = useDispatch();
  const roleData = useSelector(
    (state) => state.superAdminUserReducer.administratorRole
  );
  const { allCountryList, subscriptionList, industryList, companyList } =
    useSelector((state) => state.superAdminUserReducer);

  const userRoles =
    roleData &&
    roleData.map((x) => {
      return {
        ...x,
        id: x.id,
        value: x.roleName,
      };
    });

  const _companyList =
    companyList &&
    companyList.map((x) => {
      return {
        ...x,
        value: x.id,
        label: x.companyName,
      };
    });

  const _allCountryList =
    allCountryList &&
    allCountryList.map((x) => {
      return {
        ...x,
        value: x.id,
        label: x.country_Name,
      };
    });

  const _industryList =
    industryList &&
    industryList.map((x) => {
      return {
        ...x,
        value: x.id,
        label: x.industryName,
      };
    });

  const _subscriptionList =
    subscriptionList &&
    subscriptionList.map((x) => {
      return {
        ...x,
        value: x.id,
        label: x.name,
      };
    });

  useEffect(async () => {
    var user_data = getUserProfile();
    setUserData(user_data);
    setLoading(true);
    if (!props.testCase) dispatch(callgetCompanyList());
    if (!props.testCase) dispatch(getAllSubscriptions());
    if (!props.testCase) await dispatch(getIndustryList());
    if (!props.testCase)
      await dispatch(getAllCountryList({ id: user_data.id }));
    setLoading(false);
  }, []);

  const handleChangeValue = (e) => {
    if (e.target.name === 'additionalExpertHrs') {
      if (e.target.value > 0 || e.target.value === '') {
        setInitialValues({
          ...initialValues,
          [e.target.name]: e.target.value,
        });
      }
    } else if (e.target.name === 'hrTemplateDiscount') {
      if (
        (e.target.value >= 0 && e.target.value <= 100) ||
        e.target.value === ''
      ) {
        setInitialValues({
          ...initialValues,
          [e.target.name]: e.target.value,
        });
      }
    } else {
      setInitialValues({
        ...initialValues,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleChangeDate = (e) => {
    console.log();
    if (
      new Date(moment(initialValues.registrationDate).format('YYYY-MM-DD')) <=
      new Date(moment(e.target.value).format('YYYY-MM-DD'))
    ) {
      setInitialValues({
        ...initialValues,
        [e.target.name]: e.target.value,
      });
    } else {
      props.notify('Renewal date must be greater than the registration date!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let postReqParam = {};
    setLoading(true);
    const validateField = (value, field, ReturnObject) => {
      if (value && value != null && value != null) {
        ReturnObject[field] = value;
      }

      return ReturnObject;
    };

    if (initialValues.companyName === '' && initialValues.companyName != null) {
      props.notify('Company name is required!');
    } else if (initialValues.industry === '') {
      props.notify('Industry is required!');
    } else if (initialValues.subscription === '') {
      props.notify('Subscription is required!');
    } else if (initialValues.registrationDate === '') {
      props.notify('Registration date is required!');
    } else {
      postReqParam = validateField(
        initialValues.companyName,
        'CompanyName',
        postReqParam
      );
      postReqParam = validateField(
        initialValues.companyCode,
        'companyCode',
        postReqParam
      );
      postReqParam = validateField(
        initialValues.industry?.value,
        'industryid',
        postReqParam
      );
      if(isUnlimitedLisense === true){
        postReqParam['nooflicenses'] = 100000;
      }else{
        postReqParam = validateField(
          initialValues.noOfLicense,
          'nooflicenses',
          postReqParam
        );
      }
      postReqParam = validateField(
        isUnlimitedLisense,
        'isUnlimitedLisense',
        postReqParam
      );
      postReqParam['subscription'] = [];
      let subscriptionData = {};
      subscriptionData = validateField(
        initialValues.subscription?.value,
        'subscriptionid',
        subscriptionData
      );
      subscriptionData = validateField(
        initialValues.country?.value,
        'countryid',
        subscriptionData
      );
      subscriptionData = validateField(
        initialValues.registrationDate,
        'registrationdate',
        subscriptionData
      );
      subscriptionData = validateField(
        initialValues.renewalDate,
        'renewaldate',
        subscriptionData
      );
      subscriptionData = validateField(
        initialValues.additionalHRTemplate,
        'additionalhrtemplate',
        subscriptionData
      );
      subscriptionData = validateField(
        initialValues.hrTemplateDiscount,
        'hrtemplatediscount',
        subscriptionData
      );
      subscriptionData = validateField(
        initialValues.additionalExpertHrs,
        'additionalexperthour',
        subscriptionData
      );
  
      postReqParam.subscription.push(subscriptionData);

      const addAccountStatus = await addNewAccount(postReqParam);
      if (addAccountStatus?.error) {
        if (
          addAccountStatus?.error?.errorMessage &&
          addAccountStatus?.error?.errorMessage?.length > 0
        ) {
          props.notify(addAccountStatus.error.errorMessage[0], 5000);
        } else {
          props.notify('Failed to add new Account!');
        }
      } else if (addAccountStatus?.data) {
        props.notify('Account Added Successfully!');
        setLoading(true);
        history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Accounts');
      } else {
        props.notify('Failed to add new account!');
      }
    }

    setLoading(false);
  };

  const onClickBreadCrumb = () => {
    history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Accounts');
  };

  const onCheckboxChange = (isUnlimitedLisense) => {
    setIsUnlimitedLisense(!isUnlimitedLisense);
  };

  const setSubscriptionDetails = (value) => {
    setInitialValues({ ...initialValues, subscription: value });
    if (value.features.length <= 0) {
      setDisableCountryDropdown(true);
      setInitialValues({ ...initialValues, subscription: value, country: '' });
    }
    value?.features.map((item, i) => {
      i === 0 &&
        (item?.attributes?.[0]?.value === '1'
          ? setDisableCountryDropdown(false)
          : setDisableCountryDropdown(true));
    });
  };

  return (
    <div
      data-test="superAdminAddUser"
      className="super-admin-add-account loader-enable"
      data-testid="user-accounts-edit-page"
    >
      {loading && (
        <div className="custom-loader">
          <Loader />
        </div>
      )}
      <SearchHeaderText
        breadcrumb={true}
        addEditAccount={true}
        accountPage={true}
        title="Add"
        pageTitle="Add Account"
        onClick={handleSubmit}
        onBreadCrumbsClick={onClickBreadCrumb}
        user={userData}
      />
      <div className="container-fluid">
        <div className="form-wrapper">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <h4>Account Info</h4>
              </div>
              <div className="col-lg-5">
                <div className="floating">
                  <TextFieldComponent
                    id="companyName"
                    label="Company Name"
                    data-test="companyName"
                    dataContent="Company Name*"
                    testid="company-input"
                    maxLength={50}
                    keyPress="account"
                    type="text"
                    placeholder=""
                    name="companyName"
                    value={initialValues.companyName}
                    onChange={handleChangeValue}
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <TextFieldComponent
                  id="companyCode"
                  label="company Code"
                  data-test="companyCode"
                  dataContent="company Code"
                  testid="company-code"
                  type="text"
                  placeholder=""
                  name="companyCode"
                  value={initialValues.companyCode}
                  onChange={handleChangeValue}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-5">
                <div className="floating">
                  <ReactDropdown
                    id="industry"
                    name="industry"
                    placeholder="industry"
                    htmlFor="industry"
                    testid="industry"
                    data_content="industry*"
                    title="Industry"
                    value={initialValues.industry}
                    data={_industryList ? _industryList : []}
                    isDisabled={false}
                    isSearchable={true}
                    Prefilled={initialValues.industry}
                    onChange={(value) =>
                      setInitialValues({ ...initialValues, industry: value })
                    }
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="floating">
                  <TextFieldComponent
                    id="noOfLicense"
                    label="No. of Licenses"
                    data-test="noOfLicense"
                    dataContent="No. of Licenses"
                    testid="noOfLicense"
                    type="number"
                    min={0}
                    name="noOfLicense"
                    placeholder=""
                    isDisable={isUnlimitedLisense === true}
                    value={initialValues.noOfLicense}
                    onChange={handleChangeValue}
                  />
                  <div className="unlimited-licenses-account">
                    <Checkbox
                      checked={isUnlimitedLisense}
                      onChange={() => onCheckboxChange(isUnlimitedLisense)}
                    />
                    <div className="ml-4 mt-1">Unlimited licenses</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="row">
              <div className="col-12 mt-3">
                <h4>Subscription Info</h4>
              </div>
              <div className="col-lg-5">
                <div className="floating">
                  <ReactDropdown
                    id="subscription"
                    name="subscription"
                    testid="subscription"
                    placeholder="subscription"
                    htmlFor="subscription"
                    data_content="subscription*"
                    title="Subscription"
                    value={initialValues.subscription}
                    data={_subscriptionList ? _subscriptionList : []}
                    isDisabled={false}
                    isSearchable={true}
                    Prefilled={initialValues.subscription}
                    onChange={(value) => setSubscriptionDetails(value)}
                  />
                </div>
              </div>
              <div className="col-lg-5">
                <div className="floating">
                  <ReactDropdown
                    id="country"
                    name="country"
                    placeholder="country"
                    testid="country"
                    htmlFor="country"
                    data_content="Select Country"
                    title="country"
                    value={initialValues.country}
                    data={_allCountryList ? _allCountryList : []}
                    isDisabled={disableCountryDropdown}
                    isSearchable={true}
                    Prefilled={initialValues.country}
                    onChange={(value) =>
                      setInitialValues({ ...initialValues, country: value })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <div className="floating date-picker">
                  <input
                    id="input__registrationDate"
                    className="floating__input"
                    name="registrationDate"
                    onChange={handleChangeValue}
                    value={initialValues.registrationDate}
                    type="date"
                    placeholder="Select Registration Date"
                  />
                  <label
                    htmlFor="input__registrationDate"
                    className="floating__label"
                    data-content="Registration Date*"
                  >
                    <span className="hidden--visually">Registration Date*</span>
                  </label>
                  <span>
                    <img className="calender-icon" src={calender} />
                  </span>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="floating date-picker">
                  <input
                    id="input__renewalDate"
                    className="floating__input"
                    name="renewalDate"
                    value={initialValues.renewalDate}
                    onChange={handleChangeDate}
                    type="date"
                    placeholder="Select Renewal Date"
                  />
                  <label
                    htmlFor="input__renewalDate"
                    className="floating__label"
                    data-content="Renewal Date"
                  >
                    <span className="hidden--visually">Renewal Date</span>
                  </label>
                  <span>
                    <img className="calender-icon" src={calender} />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="row">
              <div className="col-12 mt-3 help-icon-container">
                <h4>Customizations & Add-Ons</h4>
                <img
                  className="help-icon"
                  onMouseEnter={() => setHelpText(true)}
                  onMouseLeave={() => setHelpText(false)}
                  src={helpIcon}
                />
                {helpText && (
                  <div className="popup-container">
                    <div className="popup-title">What’s this?</div>
                    <div className="popup-body">
                      Any additions made to an already existing subscription
                      will be indicated here. Additions can include templates,
                      discounts and expert hours.
                    </div>
                  </div>
                )}
              </div>
              <div className="col-lg-3">
                <div className="floating">
                  <TextFieldComponent
                    id="additionalHRTemplate"
                    label="Additional HR Templates"
                    data-test="additionalHRTemplate"
                    testid="additionalHRTemplate"
                    dataContent="Additional HR Templates"
                    type="text"
                    name="additionalHRTemplate"
                    placeholder=""
                    value={initialValues.additionalHRTemplate}
                    onChange={handleChangeValue}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="floating">
                  <TextFieldComponent
                    id="hrTemplateDiscount"
                    label="HR Template Discount"
                    data-test="hrTemplateDiscount"
                    testid="hrTemplateDiscount"
                    dataContent="HR Template Discount"
                    type="number"
                    name="hrTemplateDiscount"
                    placeholder=""
                    value={initialValues.hrTemplateDiscount}
                    onChange={handleChangeValue}
                  />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="floating">
                  <TextFieldComponent
                    id="additionalExpertHrs"
                    label="Additional Expert Hrs"
                    data-test="additionalExpertHrs"
                    testid="additionalExpertHrs"
                    dataContent="Additional Expert Hrs"
                    type="number"
                    name="additionalExpertHrs"
                    placeholder=""
                    value={initialValues.additionalExpertHrs}
                    onChange={handleChangeValue}
                  />
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

export default AddAccount;
