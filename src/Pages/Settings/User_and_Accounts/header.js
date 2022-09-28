import React, { useEffect, useState } from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
/* Icons */
import close from '../../../assets/images/search-close.svg';

/* Component */
import FilterDropDwon from '../../../Components/MultiselectDropDown/FilterDropdown';
import AccountsFilterDropdown from '../../../Components/MultiselectDropDown/AccountsFilterDropdown';
import { ExportCSV } from '../../CountryCompare/ExportCSV';

import { permissionMapping } from '../../../utils/utils';

import constants from '../../../utils/constants';
import { Spinner } from 'react-bootstrap';
import { getAccUserCounts } from '../../../Store/reducers/myAccount';

const Header = ({
  history,
  userListAll,
  accountsList,
  subscriptionList,
  accountsAPIRequest,
  setSearchValue,
  userRoles,
  handleClickSelect,
  selectedRole,
  searchValue,
  onTextChange,
  userTabs,
  setUserTabs,
  setIsFiltering,
}) => {
  const dispatch = useDispatch();
  const [exportUserData, setExportUserData] = useState({
    userExportData: [],
    fileName: 'Users',
  });
  const [accountUserCount, setAccUserCount] = useState({
    totalAccountCount: 0,
    totalUserCount: 0,
  });
  const [accountFilter, setAccountFilter] = useState({
    subscriptions: [],
    showUsersStatusBy: [],
  });
  const permissionArray = permissionMapping();

  const [userFilter, setUserFilter] = useState({
    roles: [],
    showUsersStatusBy: [],
  });
  const allAccountListLoading = useSelector(
    (state) => state.superAdminUserReducer?.allAccountListLoading
  );
  const userAllListLoading = useSelector(
    (state) => state.superAdminUserReducer?.userAllListLoading
  );
  const accUserCount = useSelector(
    (state) => state.myAccountReducer?.accUserCount
  );

  useEffect(() => {
    dispatch(getAccUserCounts());
  }, [])
  useEffect(() => {
    setAccUserCount(accUserCount)
  }, [accUserCount])

  const handleClick = () => {
    if (userTabs === 'Accounts') {
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.ADD_ACCOUNT);
    } else {
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.ADD_USER);
    }
  };

  useEffect(() => {
    if (userTabs === 'Accounts') {
      allDataforExport(accountsList?.data);
    } else {
      allDataforExport(userListAll?.data);
    }
  }, [userListAll, accountsList]);


  useEffect(() => {
    if (userTabs === 'Accounts') {
      accountsAPIRequest(accountFilter);
    } else {
      setIsFiltering(true);
      accountsAPIRequest(userFilter);
    }
  }, [accountFilter, userFilter]);

  const allDataforExport = (userData) => {
    let data = [];
    userData &&
      userData.forEach((user) => {
        if (userTabs === 'Accounts') {
          data.push({
            Account: user.companyName,
            'Company code': user.companyCode,
            Industry: user.industryName,
            'No. of licenses': user.noOfLicenses + ' purchased',
            'No. of available licenses': user.availableLicenses + ' available',
            Subscription:
              user.subscription &&
                user.subscription != null &&
                user.subscription.length > 0
                ? user.subscription[0].subscriptionName
                : 'No data',
            'Renewal date':
              user.subscription &&
                user.subscription != null &&
                user.subscription.length > 0
                ? moment(user?.subscription[0]?.renewalDate).format(
                  'MMM DD, YYYY'
                )
                : 'No data',
            'Registration date':
              user.subscription &&
                user.subscription != null &&
                user.subscription.length > 0
                ? moment(user?.subscription[0]?.registrationDate).format(
                  'MMM DD, YYYY'
                )
                : 'No data',
            'Additional HRTemplate':
              user.subscription &&
                user.subscription != null &&
                user.subscription.length > 0
                ? user?.subscription[0]?.additionalHRTemplate
                : 'No data',
            'HRTemplate discount':
              user.subscription &&
                user.subscription != null &&
                user.subscription.length > 0
                ? user?.subscription[0]?.hrTemplateDiscount
                : 'No data',
            'Additional expert hour':
              user.subscription &&
                user.subscription != null &&
                user.subscription.length > 0
                ? user?.subscription[0]?.additionalExpertHour
                : 'No data',
          });
        } else {
          data.push({
            Status: !user?.keyCloakUserId
              ? 'Pending'
              : user.userProfile?.activationStatus
                ? user.userProfile?.activationStatus
                : 'No Data',
            'First Name': user.userProfile?.firstName
              ? user.userProfile?.firstName
              : 'No Data',
            'Last Name': user.userProfile?.lastName
              ? user.userProfile?.lastName
              : 'no-data',
            'Preferred Name': user.userProfile?.preferredName
              ? user.userProfile?.preferredName
              : 'No Data',
            Company: user.company?.companyName
              ? user.company?.companyName
              : 'No Data',
            Industry: user.company?.industryName
              ? user.company?.industryName
              : 'No Data',
            'Job Title': user.userProfile?.jobTitle
              ? user.userProfile?.jobTitle
              : 'No Data',
            Role: user.roleName ? user.roleName : 'No Data',
            Subscription: user.userProfile?.subscription?.subscriptionName
              ? user.userProfile?.subscription?.subscriptionName
              : 'No Data',
            'Count of Licenses': user.userProfile?.subscription?.countOfLicenses
              ? user.userProfile?.subscription?.countOfLicenses
              : 'No Count of Liscense',
            'First Login Date': user.createdAt
              ? moment(user.createdAt).format('MMM DD, YYYY')
              : 'No Data',
            'Last Login Date': user.lastLogin
              ? moment(user.lastLogin).format('MMM DD, YYYY')
              : 'No Data',
            'Expiration Date': user.userProfile?.subscription?.expirationDate
              ? moment(user.userProfile?.subscription?.expirationDate).format(
                'MMM DD, YYYY'
              )
              : 'No Data',
            'Expert Hours Available': user.userProfile?.subscription
              ?.expertHoursAvailable
              ? user.userProfile?.subscription?.expertHoursAvailable
              : 'No Hours Availabe',
            'Expert Hours Used': user.userProfile?.subscription?.expertHoursUsed
              ? user.userProfile?.subscription?.expertHoursUsed
              : 'No Hours Used',
            'Number of Countries Favorited': user.userProfile?.subscription
              ?.numberOfCountriesFavorited
              ? user.userProfile?.subscription?.numberOfCountriesFavorited
              : 'No Favorite Country',
            ' ': ' ',
          });
        }
      });


    setExportUserData({
      ...exportUserData,
      userExportData: data,
      fileName: userTabs,
    });
  };
  return (
    <div className="container-fluid" data-test="userHeader">
      <div className="col-12">
        <div className="title-action-wrap">
          <div className="row">
            <div className="col-md-4 pl-0 header-label-section">
              <h3 className="gutter-manag-user" data-tip="Manage user">
                <div className="segment">
                  <div
                    className={
                      userTabs === 'Accounts' ? 'accounts active' : 'accounts'
                    }
                    onClick={() => {
                      setUserFilter({
                        roles: [],
                        showUsersStatusBy: [],
                      });
                      setUserTabs('Accounts');
                    }}
                    data-test="click"
                  >
                    Accounts
                  </div>
                  <div
                    className={userTabs === 'Users' ? 'users active' : 'users'}
                    data-testid="tab-button1"
                    onClick={() => {
                      if (
                        permissionArray?.includes(
                          constants.PERMISSION_MAPPING.VIEW_USER
                        )
                      )
                        setUserFilter({
                          roles: [],
                          showUsersStatusBy: [],
                        });
                      setUserTabs('Users');
                    }}
                    data-test="user"
                  >
                    Users
                  </div>
                </div>
              </h3>
            </div>
            <div className="col-md-8  pl-0 row search-section">
              <div className="d-flex align-items-center header-user-details stat-hide">
                <div className="header-user-details-account">
                  <span>{accountUserCount?.totalAccountCount || 0}</span> Accounts
                </div>
                <div className="header-user-details-user mr-3">
                  <span>{accountUserCount?.totalUserCount || 0}</span> Users
                </div>
              </div>
              <div className="acc-account-container">
                <div className="download_btn">
                  {!userAllListLoading || !allAccountListLoading ? (
                    <ExportCSV
                      csvData={exportUserData.userExportData}
                      fileName={exportUserData.fileName}
                      userTabs={userTabs}
                    />
                  ) : (
                    <Spinner animation="border" size="sm" />
                  )}
                </div>
                <div className="tbl-search">
                  <input
                    type="text"
                    className="form-control"
                    value={searchValue}
                    onChange={onTextChange}
                    placeholder={'Search ' + userTabs}
                    data-test="search"
                  />
                  {searchValue ? (
                    <div
                      onClick={() => {
                        setSearchValue('');
                      }}
                      data-test="searchCancel"
                    >
                      <img
                        alt=""
                        src={close}
                        height={11}
                        name="search-outline"
                        className="cursor-pointer close-icon-search-users"
                      />
                    </div>
                  ) : null}
                </div>


                <Tooltip
                  title={userTabs === 'Accounts' ? 'Add Account' : 'Add User'}
                >
                  <button
                    type="button"
                    className={
                      userTabs !== 'Accounts' ?
                        (!permissionArray?.includes(
                          constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER
                        )
                          ? 'a-disabled primary-button ml-0 ml-md-3 mr-3'
                          : 'primary-button ml-0 ml-md-3 mr-3')
                        :
                        (
                          !permissionArray?.includes(
                            constants.PERMISSION_MAPPING.CREATE_EDIT_ACCOUNTS
                          )
                            ? 'a-disabled primary-button ml-0 ml-md-3 mr-3'
                            : 'primary-button ml-0 ml-md-3 mr-3'
                        )
                    }
                    onClick={handleClick}
                    data-test="handle"
                  >
                    {userTabs === 'Accounts' ? 'Add Account' : 'Add User'}
                  </button>
                </Tooltip>


                <div className="filter-wrap">
                  {userTabs === 'Accounts' ? (
                    <AccountsFilterDropdown
                      data={userRoles}
                      accountFilter={accountFilter}
                      subscriptionList={subscriptionList}
                      setAccountFilter={setAccountFilter}
                    />
                  ) : (
                    <FilterDropDwon
                      data={userRoles}
                      subscriptionList={subscriptionList}
                      userFilter={userFilter}
                      setUserFilter={setUserFilter}
                      selectedRole={selectedRole}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 stat-show">
              <div className="d-flex align-items-center header-user-details">
                <div className="header-user-details-account">
                  <span>{accountUserCount?.totalAccountCount || 0}</span> Accounts
                </div>
                <div className="header-user-details-user mr-3">
                  <span>{accountUserCount?.totalUserCount || 0}</span> Users
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
