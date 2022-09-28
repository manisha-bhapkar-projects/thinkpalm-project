import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

/* Icons */
import calender from '../../../assets/images/calendar-ico.svg';
import helpIcon from '../../../assets/images/help-icon.svg';
import shield from '../../../assets/images/shield-blue.svg';

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
import OpenModal from './OpenModal';

/* Action */
import {
  updateAccountInfo,
  getIndustryList,
  getAccountInfoById,
  updateAccountStatus,
  getAllCountryList,
  callgetCompanyList,
  getAllSubscriptions,
} from '../../../Store/reducers/superAdminUser';
import Checkbox from '../../../Components/Inputs/Checkbox';

const EditAccount = (props) => {
  document.title = 'Settings';
  const history = useHistory();
  const { id } = useParams();
  const reactivatePage = window.location.href
    .split('/')
    .includes('reactivate-account');
  const isEditPage = window.location.href.split('/').includes('edit-account');
  const [userData, setUserData] = useState();
  const [helpText, setHelpText] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(props.testCase ? false : true);
  const [disableCountryDropdown, setDisableCountryDropdown] = useState(true);
  const [isUnlimitedLisense, setIsUnlimitedLisense] = useState(false);
  const [initialValues, setInitialValues] = useState({
    companyName: '',
    isActive: true,
    companyCode: '',
    industry: '',
    noOfLicense: '',
    subscription: '',
    country: '',
    registrationDate: '',
    renewalDate: '',
    additionalHRTemplate: '',
    hrTemplateDiscount: '',
    additionalExpertHrs: '',
  });

  const dispatch = useDispatch();
  const roleData = useSelector(
    (state) => state.superAdminUserReducer.administratorRole
  );

  const {
    allCountryList,
    subscriptionList,
    industryList,
    companyList,
    accountInfoLoading,
    accountInfo,
  } = useSelector((state) => state.superAdminUserReducer);

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
  const setSubscriptionDetails = (value) => {
    setInitialValues({ ...initialValues, subscription: value });
    if (value.features.length <= 0) {
      setDisableCountryDropdown(true);
      setInitialValues({ ...initialValues, subscription: value, country: '' });
    }
    value?.features.map((item, i) => {
      i === 0 &&
        (item?.attributes?.[0].value === '1'
          ? setDisableCountryDropdown(false)
          : setDisableCountryDropdown(true));
    });
  };
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
    setLoading(true);
    var user_data = getUserProfile();
    setUserData(user_data);
    if (!props.testCase) dispatch(getAllCountryList({ id: user_data.id }));
    if (!props.testCase) dispatch(callgetCompanyList());
    if (!props.testCase) dispatch(getAllSubscriptions());
    if (!props.testCase) await dispatch(getIndustryList());
    if (!props.testCase) await dispatch(getAccountInfoById({ id }));
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!accountInfoLoading) {
      let country = {};

      if (accountInfo?.subscription?.length > 0) {
        const _itemFind = _allCountryList.find(
          (item) => item.value === accountInfo?.subscription[0].countryId
        );
        if (_itemFind) country = _itemFind;
      }
      setInitialValues({
        companyName: accountInfo.companyName,
        companyCode: accountInfo.companyCode,
        industry: {
          label: accountInfo.industryName,
          value: accountInfo.industryId,
        },
        noOfLicense: accountInfo.isUnlimitedLisense
          ? ''
          : accountInfo.noOfLicenses,
        isActive: accountInfo.isActive,
        subscription:
          accountInfo?.subscription?.length > 0
            ? {
                label: accountInfo.subscription[0].subscriptionName,
                value: accountInfo.subscription[0].subscriptionId,
              }
            : {},
        country: country,
        registrationDate:
          accountInfo?.subscription?.length > 0
            ? moment(accountInfo.subscription[0].registrationDate).format(
                'YYYY-MM-DD'
              )
            : '',
        renewalDate:
          accountInfo?.subscription?.length > 0
            ? moment(accountInfo.subscription[0].renewalDate).format(
                'YYYY-MM-DD'
              )
            : '',
        additionalHRTemplate:
          accountInfo?.subscription?.length > 0
            ? accountInfo.subscription[0].additionalHRTemplate
            : '',
        hrTemplateDiscount:
          accountInfo?.subscription?.length > 0
            ? accountInfo.subscription[0].hrTemplateDiscount
            : '',
        additionalExpertHrs:
          accountInfo?.subscription?.length > 0
            ? accountInfo.subscription[0].additionalExpertHour
            : '',
      });
      setIsUnlimitedLisense(accountInfo?.isUnlimitedLisense);
      setLoading(false);
    } else if (accountInfoLoading) {
      setLoading(true);
    }
  }, [accountInfoLoading]);

  const handleChangeDate = (e) => {
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

  const handleChangeValue = (e) => {
    setInitialValues({
      ...initialValues,
      [e.target.name]: e.target.value,
    });
  };

  const editUser = async (e) => {
    history.push(
      constants.ROUTE.SIDEBAR.SETTINGS.EDIT_ACCOUNT.replace(':id', id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let postReqParam = {};

    const validateField = (value, field, ReturnObject) => {
      if (value && value != null && value != null) {
        ReturnObject[field] = value;
      }

      return ReturnObject;
    };

    setLoading(true);
    if (initialValues.companyName === '' && initialValues.companyName != null) {
      props.notify('Company name is required!');
    } else if (
      initialValues.industry === '' &&
      initialValues.industry != null
    ) {
      props.notify('Industry is required!');
    } else if (
      initialValues.subscription === '' &&
      initialValues.subscription != null
    ) {
      props.notify('Subscription is required!');
    } else if (
      initialValues.registrationDate === '' &&
      initialValues.registrationDate != null
    ) {
      props.notify('Registration date is required!');
    } else {
      postReqParam = validateField(
        initialValues.companyName,
        'CompanyName',
        postReqParam
      );
      postReqParam = validateField(
        initialValues.companyCode,
        'companycode',
        postReqParam
      );
      postReqParam = validateField(
        initialValues.industry.value,
        'industryid',
        postReqParam
      );
      postReqParam = validateField(
        initialValues.noOfLicense,
        'nooflicenses',
        postReqParam
      );

      postReqParam = validateField(
        isUnlimitedLisense,
        'isUnlimitedLisense',
        postReqParam
      );
      postReqParam['subscription'] = [];
      let subscriptionData = {};
      subscriptionData = validateField(
        initialValues.subscription.value,
        'subscriptionid',
        subscriptionData
      );
      subscriptionData = validateField(
        initialValues.country.value,
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

      if (reactivatePage) {
        await deactivateAccount(true);
      }

      setLoading(true);
      const updateStatus = await updateAccountInfo(postReqParam, id);
      if (updateStatus.error) {
        if (
          updateStatus.error.errorMessage &&
          updateStatus.error.errorMessage.length > 0
        ) {
          props.notify(updateStatus.error.errorMessage[0], 5000);
        }
        //  else {
        //   props.notify('Failed to update account information!');
        // }
      } else if (updateStatus.data) {
        if (reactivatePage) {
          props.notify('Account Reactivated Successfully!');
        } else {
          props.notify('Account Updated Successfully!');
        }
        setLoading(false);
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

  const deactivateAccount = async (_status) => {
    const updateStatus = await updateAccountStatus(id, _status);
    console.log('updateStatus', updateStatus);
    if (updateStatus.error) {
      props.notify('Account deactivate failed!');
    } else if (updateStatus.data) {
      setInitialValues({
        ...initialValues,
        isActive: false,
      });

      if (_status) {
        props.notify('Account Activated Successfully!');
        history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST);
      } else {
        props.notify('Account Deactivated Successfully!');
        history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST);
      }
      setLoading(false);
    } else {
      props.notify('Failed to update the account status!');
    }

    setShowModal(false);
  };

  const navigateTo = () => {
    props.history.push(
      `${constants.ROUTE.SIDEBAR.SETTINGS.VIEW_ACCOUNT.replace(':id', id)}`
    );
  };

  const onCheckboxChange = (isUnlimitedLisense) => {
    setIsUnlimitedLisense(!isUnlimitedLisense);
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
        isEdit={true}
        activeUser={reactivatePage}
        title={reactivatePage ? 'Reactivate' : isEditPage ? 'Edit' : 'View'}
        pageTitle={
          reactivatePage
            ? 'Edit Account'
            : isEditPage
            ? 'Edit Account'
            : 'View Account'
        }
        onClick={handleSubmit}
        onEdit={editUser}
        gotoView={navigateTo}
        onBreadCrumbsClick={onClickBreadCrumb}
        user={userData}
      />
      <div
        className={
          reactivatePage || isEditPage
            ? 'container-fluid'
            : 'container-fluid pointer-none'
        }
      >
        <div className="form-wrapper">
          <div className="col-12">
            <div className="row">
              <div className="col-12">
                <h4>Account Info</h4>
                {!reactivatePage && isEditPage && initialValues.isActive && (
                  <div
                    className="deactivate-account"
                    onClick={() => setShowModal(true)}
                  >
                    <img alt="" src={shield} className="shield" />
                    Deactivate Account
                  </div>
                )}
              </div>
              <div className="col-lg-5">
                <div className="floating">
                  <TextFieldComponent
                    id="companyName"
                    label="Company Name"
                    data-test="companyName"
                    dataContent="Company Name*"
                    testid="company-input"
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
                    testid="industry"
                    htmlFor="industry"
                    data_content="industry"
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
                    testid="noOfLicense"
                    dataContent="No. of Licenses"
                    type="number"
                    min={isUnlimitedLisense ? '' : 0}
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
                    placeholder="subscription"
                    testid="subscription"
                    htmlFor="subscription"
                    data_content="subscription*"
                    title="Subscription"
                    value={initialValues.subscription}
                    data={_subscriptionList ? _subscriptionList : []}
                    isDisabled={false}
                    isSearchable={true}
                    Prefilled={initialValues.subscription}
                    onChange={(value) => {
                      setInitialValues({
                        ...initialValues,
                        subscription: value,
                      });
                      setSubscriptionDetails(value);
                    }}
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
                    testid="additionalHRTemplate"
                    data-test="additionalHRTemplate"
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

      <OpenModal
        isOpen={showModal}
        onCancelClickListner={() => setShowModal(false)}
        deactivateUser={deactivateAccount}
        userId={id}
        deactivate={true}
        reActivateAccounts={true}
      />

      <SupportButton />
    </div>
  );
};

export default EditAccount;
