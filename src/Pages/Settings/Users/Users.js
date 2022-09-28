import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';
import { permissionMapping } from '../../../utils/utils';

/* Icons */
import userEditIcon from '../../../assets/images/blue-user-edit.svg';
import emailIcon from '../../../assets/images/blue-mail.svg';
import deleteIcon from '../../../assets/images/user_delete_btn.svg';
import deleteDisabledIcon from '../../../assets/images/user_delete_btn_disabled.svg';
import dotIcon from '../../../assets/images/dotIcon.svg';
import { useHistory } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';

/* Component */
import { CustomeNotification } from '../../../Components/CustomeNotification/CustomeNotification';
import OpenModal from '../User_and_Accounts/OpenModal';
import CustomeTable from '../../../Components/CustomeTable/CustomeTable';
import { ExportCSV } from '../../CountryCompare/ExportCSV';
import Loader from '../../../Components/Loader';

/* Action */
import {
  getCompanyInfo,
  deleteAccountUsers,
  callgetUserList,
  callgetAllUserList,
  sendEmailToActivateUser,
  getAccountUsers,
  getAccountAllUsers,
} from '../../../Store/reducers/superAdminUser';
import { getUserProfile } from '../../../utils/storage';
import constants from '../../../utils/constants';
import SearchHeaderText from '../../../Components/SearchHeaderText/SearchHeaderText';

const UsersList = (props) => {
  document.title = 'Settings - Manage Users';
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState();
  const [userId, setUserId] = useState(undefined);
  const [companyLicence, setCompanyLicence] = useState(0);
  const [loading, setLoading] = useState();
  const [userStatus, setUserStatus] = useState();
  const [userData, setUserData] = useState();

  const [pageNumber, setPageNumber] = useState(1);
  const [sortField, setSortField] = useState('updateddate');
  const [sortOrder, setSortOrder] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const [exportUserData, setExportUserData] = useState({
    userExportData: [],
    fileName: 'Users',
  });

  const [id, setId] = useState('');
  const dispatch = useDispatch();
  const permissionArray = permissionMapping();

  const {
    userListAll,
    userList,
    companyInfoById,
    companyInfoLoading,
    userListLoading,
    userAllListLoading,
    accountUsersList,
    accountUsersListLoading,
    accountAllUsersList,
    accountAllUsersListLoading,
  } = useSelector((state) => state.superAdminUserReducer);

  const pageSize = accountUsersList.pageSize || 10;
  const totalCount = accountUsersList.totalCount;
  const userProfile = useSelector((state) => state?.user?.userProfile);

  const [userLIstRequestObject, setUserLIstRequestObject] = useState({
    pageNumber: pageNumber,
    pageSize: pageSize,
    sortField,
    sortOrder,
    roles: [],
    showUsersStatusBy: [],
  });

  useEffect(() => {
    var user_data = getUserProfile();
    if (user_data) {
      setUserData(user_data);
      if (user_data?.company?.id) {
        setLoading(true);
        dispatch(getCompanyInfo({ id: user_data?.company?.id }));
      }
    }
  }, []);

  useEffect(() => {
    if (!permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_USER))
      history.push('/home');
  }, [userLIstRequestObject]);

  useEffect(() => {
    if (
      companyInfoLoading &&
      companyInfoLoading != true &&
      !companyInfoById?.id
    ) {
      if (companyInfoLoading.error) {
        props.notify(companyInfoLoading.errorMessage);
        setLoading(false);
      } else if (
        companyInfoLoading.error &&
        !companyInfoLoading?.errorMessage?.length > 0
      ) {
        props.notify('Failed to load the company licence info!', 30000);
        setLoading(false);
      }
    } else if (companyInfoById?.id) {
      setCompanyLicence(companyInfoById?.availableLicenses || 0);
      setLoading(false);
    }
  }, [companyInfoById, companyInfoLoading]);

  useEffect(() => {
    loadUsersList();
  }, []);

  useEffect(() => {
    allDataforExport(accountAllUsersList.data);
  }, [accountAllUsersList]);

  const loadUsersList = () => {
    var user_data = getUserProfile();
    if (user_data?.company) {
      const requestObjectAll = {
        skipPagination: true,
        sortby: 'name',
        sortbydesc: false,
        company: user_data?.company?.id,
      };
      const requestObject = {
        ...userLIstRequestObject,
        pageNumber: 1,
        pageSize: pageSize,
        sortField,
        sortOrder,
        company: user_data?.company?.id,
      };

      if (!props.testCase) dispatch(getAccountAllUsers(requestObjectAll));
      setPageNumber(1);
      setUserLIstRequestObject(requestObject);
      if (!props.testCase) dispatch(getAccountUsers(requestObject));
    }
  };

  useEffect(() => {
    var user_data = getUserProfile();
    if (user_data?.company) {
      setPageNumber(1);
      const requestObject = {
        ...userLIstRequestObject,
        pageNumber: 1,
        pageSize: pageSize,
        sortField,
        sortOrder,
        company: user_data?.company?.id,
      };

      setUserLIstRequestObject(requestObject);
      if (!props.testCase) dispatch(getAccountUsers(requestObject));
    }
  }, [sortField, sortOrder, isSorting]);

  const handleSort = (field, order) => {
    setIsSorting(true);
    setSortField(field?.sortName);
    setSortOrder(order === 'asc' ? false : true);
  };

  const handleCloseModal = () => {
    setId(undefined);
    setUserName(undefined);
    setUserId(undefined);
    setShowModal(false);
  };

  const handleDotClick = (statusId) => {
    if (id && id == statusId) {
      setId(undefined);
    } else {
      setId(statusId);
    }
  };

  const handlePageChange = (perPage) => {
    var user_data = getUserProfile();
    if (user_data?.company) {
      setPageNumber(perPage);
      const requestObject = {
        ...userLIstRequestObject,
        pageNumber: perPage,
        pageSize: pageSize,
        sortField,
        sortOrder,
        company: user_data?.company?.id,
      };
      setUserLIstRequestObject(requestObject);
      // dispatch(getAccountUsers(requestObject));
      if (!props.testCase) dispatch(getAccountUsers(requestObject));
    }
  };

  const handleDropdownChange = (e) => {
    var user_data = getUserProfile();
    if (user_data?.company) {
      const requestObject = {
        ...userLIstRequestObject,
        pageNumber: 1,
        company: user_data?.company?.id,
        pageSize: e.target.value,
      };

      setPageNumber(1);
      if (!props.testCase) setUserLIstRequestObject(requestObject);
      if (!props.testCase) dispatch(getAccountUsers(requestObject));
    }
  };
  const handleStatusChanged = async (id, item) => {
    setShowModal(true);
    let user = item?.userProfile
      ? item.userProfile.firstName
        ? item.userProfile.lastName
          ? item.userProfile.firstName + ' ' + item.userProfile.lastName
          : ''
        : ''
      : '';
    setUserName(user);
    setUserId(id);
    setUserStatus(item?.userProfile.isActive);
  };

  const deactivateUser = async (id) => {
    setShowModal(false);

    if (!id) {
      handleCloseModal();
    } else {
      setLoading(true);
      const response = await deleteAccountUsers(id);
      setLoading(false);
      if (response && response.error) {
        props.notify(response.statusText);
      } else if (response) {
        props.notify('User Removed Successfully');
        loadUsersList();
      }
      setShowModal(false);
    }
  };

  const goToEditPage = (id) => {
    history.push(
      constants.ROUTE.SIDEBAR.SETTINGS.USER_ADD_EDIT.replace(':id', id)
    );
  };

  const sendEmailActivation = async (id) => {
    setLoading(true);
    const response = await sendEmailToActivateUser(id);
    setLoading(false);
    if (response && response.error) {
      props.notify(response.statusText);
    } else if (response) {
      props.notify('Activation Email Send Successfully');
    }
  };

  const UserColumns = [
    {
      name: 'Name',
      selector: 'name',
      sortable: true,
      sortName: 'name',
      width: '30%',
      cell: (row) => {
        var user_info = getUserProfile();
        return (
          <div data-tag="allowRowEvents">
            <div>
              <p className="font-family-for-list mb-2">
                {row.userProfile &&
                row.userProfile.firstName &&
                row.userProfile.lastName
                  ? row.userProfile.firstName + ' ' + row.userProfile.lastName
                  : ''}
                {row?.userProfile?.id === user_info.id ? ' (You)' : ''}
              </p>
            </div>
            <span className="font-family-list-sub">{row.emailId}</span>
          </div>
        );
      },
    },
    {
      name: 'Role',
      selector: 'roleName',
      right: false,
      sortable: true,
      width: '30%',
      sortName: 'role',
      cell: (row) => {
        return <p className="font-family-for-list mb-2">{row.roleName}</p>;
      },
    },

    {
      name: 'Last Login',
      selector: 'lastLogin',
      width: '30%',
      sortable: true,
      right: false,
      sortName: 'lastlogin',
      cell: (row) => {
        let title =
          row.userProfile && row.userProfile.isActive
            ? !row?.keyCloakUserId
              ? 'Pending'
              : 'Active'
            : 'Inactive';
        if (row.lastLogin)
          return (
            <>
              {title === 'Pending' || title === 'Inactive' ? null : (
                <div data-tag="allowRowEvents">
                  <div className="font-family-for-list mb-2">
                    {moment(row.lastLogin).format('MMM DD, YYYY')}
                  </div>
                  <span
                    style={{
                      color: 'slategray',
                      fontSize: '14px',
                      fontFamily: 'webfontregular',
                      margin: '0px',
                    }}
                  >
                    {moment(row.lastLogin).format('HH:mm a')}
                  </span>
                </div>
              )}
            </>
          );
      },
    },
    {
      name: '',
      selector: '',
      right: false,
      width: '10%',
      grow: '1',
      cell: (row) => {
        var user_info = getUserProfile();

        return (
          <>
            {userProfile.isAccountOwner && (
              <div className=" text-end">
                <div
                  className="position-relative"
                  onClick={() => handleDotClick(row.id, row)}
                >
                  <span className="btn-round">
                    <img src={dotIcon} />
                  </span>

                  {id == row.id ? (
                    <div className="quick-action-btn">
                      <Tooltip title={'Edit User'}>
                        <div
                          className={
                            permissionArray?.includes(
                              constants.PERMISSION_MAPPING
                                .CREATING_EDITING_ANY_USER
                            )
                              ? ''
                              : 'a-disabled'
                          }
                          onClick={() => goToEditPage(row.id)}
                        >
                          <img src={userEditIcon} />
                        </div>
                      </Tooltip>

                      <div>
                        <Tooltip title={'Send Email'}>
                          <img
                            src={emailIcon}
                            onClick={() => sendEmailActivation(row.id)}
                          />
                        </Tooltip>
                      </div>
                      {row?.userProfile?.id === user_info.id ? (
                        <div>
                          <img src={deleteDisabledIcon} />
                        </div>
                      ) : (
                        <div>
                          <Tooltip title={'Remove user'}>
                            <img
                              src={deleteIcon}
                              onClick={() => handleStatusChanged(row.id, row)}
                            />
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            )}
          </>
        );
      },
    },
  ];

  const closePopup = ({ target }) => {
    // console.log(target) // Enable this to check the classNames
    const closeActionClickClassName = [
      'accounts_userList-page',
      'container-fluid',
    ];
    if (
      (id && target && closeActionClickClassName.includes(target.className)) ||
      target.className.includes('rdt_TableCell') ||
      target.className.includes('rdt_TableCol')
    ) {
      setId(undefined);
    }
  };

  const allDataforExport = (userData) => {
    let data = [];
    userData &&
      userData.forEach((user) => {
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
      });

    console.log('excel', data);
    setExportUserData({ ...exportUserData, userExportData: data });
  };

  return (
    <div
      className="accounts_userList-page loader-enable"
      data-testid="TemplateList-result-page"
      onClick={closePopup}
    >
      {loading && (
        <div className="custom-loader">
          <Loader />
        </div>
      )}
      <SearchHeaderText
        filter={true}
        breadcrumb={true}
        user={userData}
        handleClickBack={() =>
          history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERS)
        }
        UsersBreadcrumb={true}
      />
      <div className="container-fluid">
        <div className="col-12">
          <div className="title-action-wrap">
            <div className="row">
              <div className="col-sm-8 pl-0">
                <h3 className="gutter-manag-user" data-tip="Manage user">
                  Manage Users
                </h3>
                {userProfile.isAccountOwner && (
                  <div className="un-used-licence">
                    You have {companyLicence} unused licenses available to you.
                    That’s {companyLicence} users you can add through your
                    account.
                  </div>
                )}
              </div>
              {userProfile.isAccountOwner && (
                <div className="col-sm-4 pl-0 right-btn">
                  {!accountAllUsersListLoading ? (
                    <ExportCSV
                      csvData={exportUserData.userExportData}
                      fileName={exportUserData.fileName}
                    />
                  ) : (
                    <Spinner animation="border" size="sm" />
                  )}
                  <button
                    type="button"
                    className={
                      permissionArray?.includes(
                        constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER
                      )
                        ? 'primary-button'
                        : 'primary-button a-disabled'
                    }
                    disabled={companyLicence === 0}
                    data-testid="save-Template"
                    onClick={() =>
                      history.push(
                        constants.ROUTE.SIDEBAR.SETTINGS.USER_ADD_EDIT.replace(
                          ':id',
                          'add'
                        )
                      )
                    }
                  >
                    Add User
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div
          className="table-custom custom-tabe-tooltip"
          data-test="custome-table"
        >
          <CustomeTable
            {...props}
            columns={UserColumns}
            testCase={props.testCase || pageNumber != 1 || false}
            data={accountUsersList.data}
            pending={accountUsersListLoading}
            pagination={false}
            disabledJumpTo={false}
            customStyle="users"
            custompagination
            paginationServer={false}
            noDataString={'No data found'}
            totalListCount={totalCount}
            paginationTotalRows={totalCount}
            paginationPerPage={pageSize}
            onPageChangedCalled={handlePageChange}
            pageNumber={pageNumber}
            handleDropdownChange={handleDropdownChange}
            limit={pageSize}
            onSort={handleSort}
          />
        </div>
      </div>

      <OpenModal
        isOpen={showModal}
        onCancelClickListner={handleCloseModal}
        userName={userName}
        deactivateUser={deactivateUser}
        userId={userId}
        userStatus={userStatus}
        deleteModal={true}
        deleteFlag={true}
      />
    </div>
  );
};

export default UsersList;
