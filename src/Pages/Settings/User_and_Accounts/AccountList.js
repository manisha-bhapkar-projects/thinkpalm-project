import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import moment from 'moment';

/* Icons */
import shield from '../../../assets/images/shield.svg';

/* Component */
import OpenModal from './OpenModal';

import CustomeTable from '../../../Components/CustomeTable/CustomeTable';

/* Action */
import {
  updateAccountStatus,
  getAllAccounts,
  getAllAccountsForDownload,
  getAllSubscriptions,
} from '../../../Store/reducers/superAdminUser';
import { getUserProfile } from '../../../utils/storage';
import constants from '../../../utils/constants';
import { permissionMapping } from '../../../utils/utils';

const AccountList = (props) => {
  document.title = 'Settings';
  const [showModal, setShowModal] = useState(false);
  const [accountId, setAccountId] = useState();
  const [editFlag, setEditFlag] = useState(false);
  const permissionArray = permissionMapping();

  const [pageNumber, setPageNumber] = useState(props.pageNumber);
  const [sortField, setSortField] = useState(props.sortField);
  const [sortOrder, setSortOrder] = useState(props.sortOrder);

  const dispatch = useDispatch();
  const accountsList = useSelector(
    (state) => state.superAdminUserReducer.accountsList
  );
  const pageSize = accountsList.pageSize || 10;
  const totalCount = accountsList.totalCount;

  const loading = useSelector(
    (state) => state.superAdminUserReducer.accountsListLoading
  );

  const [accountListRequestObject, setAccountListRequestObject] = useState({
    pageNumber: pageNumber,
    pageSize: pageSize,
    sortField,
    sortOrder,
    subscriptions: [],
    showUsersStatusBy: [],
  });

  useEffect(() => {
    setAccountListRequestObject({
      ...accountListRequestObject,
      ...props.userLIstRequestObject,
    });
  }, [props.userLIstRequestObject]);

  useEffect(() => {
    const requestObjectAll = {
      skipPagination: true,
      sortby: 'updatedAt',
      sortbydesc: true,
    };
    if (!props.testCase) dispatch(getAllAccountsForDownload(requestObjectAll));
    setPageNumber(1);
    props.setPageNumber(1);
    setSortField('updatedAt');
    props.setSortField('updatedAt');
    setSortOrder(true);
    props.setSortOrder(true);
  }, []);

  useEffect(() => {
    setPageNumber(1);
    props.setPageNumber(1);
    const requestObject = {
      ...accountListRequestObject,
      searchText: props.searchValue,
      pageNumber: 1,
      pageSize: pageSize,
      sortField,
      sortOrder,
    };
    
    setAccountListRequestObject(requestObject);
    if (!props.testCase) dispatch(getAllAccounts(requestObject));
  }, [
    sortField,
    sortOrder,
    accountListRequestObject.subscriptions.length,
    accountListRequestObject.showUsersStatusBy,
    props.searchValue,
  ]);

  const handleSort = (field, order) => {
    setSortField(field?.sortName);
    props.setSortField(field?.sortName);
    setSortOrder(order === 'asc' ? false : true);
    props.setSortOrder(order === 'asc' ? false : true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePageChange = (perPage) => {
    setPageNumber(perPage);
    props.setPageNumber(perPage);
    const requestObject = {
      ...accountListRequestObject,
      pageNumber: perPage,
      pageSize: pageSize,
    };
    setAccountListRequestObject(requestObject);
    if (!props.testCase) dispatch(getAllAccounts(requestObject));
  };
  const handleDropdownChange = (e) => {
    const requestObject = {
      ...accountListRequestObject,
      pageNumber: 1,
      pageSize: e.target.value,
    };
    if (!props.testCase) setAccountListRequestObject(requestObject);
    if (!props.testCase) dispatch(getAllAccounts(requestObject));
  };

  const openEditModal = (id, item) => {
    setShowModal(true);
    setAccountId(id);
    setEditFlag(true);
  };

  const reActivateUser = async (id) => {
    navigateTo('reactivate', id);
  };

  const navigateTo = (type, id) => {
    if (type === 'reactivate') {
      props.history.push(
        `${constants.ROUTE.SIDEBAR.SETTINGS.REACTIVATE_ACCOUNT.replace(
          ':id',
          id
        )}`
      );
    } else if (type === 'addUser') {
      props.history.push(
        `${constants.ROUTE.SIDEBAR.SETTINGS.ADD_USER_ACCOUNTS.replace(
          ':company',
          id
        )}`
      );
    } else {
      props.history.push(
        `${constants.ROUTE.SIDEBAR.SETTINGS.VIEW_ACCOUNT.replace(':id', id)}`
      );
    }
  };

  const AccountsColumns = [
    {
      name: 'Account',
      selector: 'companyName',
      width: '30%',
      sortable: true,
      sortName: 'AccountName',
      cell: (row) => {
        return (
          <>
            <div className="company-name-container">
              {row.isActive === false && (
                <img alt="" src={shield} className="shield" />
              )}
              <div className="company-name-section">
                <div className="company-name">{row?.companyName}</div>
                <div className="industry-name">{row?.industryName}</div>
              </div>
            </div>
          </>
        );
      },
    },
    {
      name: 'No. of Licenses',
      selector: 'noOfLicenses',
      sortable: true,
      sortName: 'NoofLicense',
      width: '20%',
      cell: (row) => (
        <div data-tag="allowRowEvents" className="company-licence">
          {row.isUnlimitedLisense ? (
            <div className="company-name">Unlimited License</div>
          ) : (
            <>
              <div className="company-name">{row?.noOfLicenses} purchased</div>
              <div className="industry-name">
                {row?.availableLicenses} available
              </div>
            </>
          )}
        </div>
      ),
    },
    {
      name: 'Subscription',
      selector: 'subscriptionName',
      width: '30%',
      sortable: true,
      sortName: 'Subscription',
      cell: (row) => (
        <>
          <div className="company-subscription" data-tag="allowRowEvents">
            <div className="subscription-name">
              {(row?.subscription.length > 0 &&
                row?.subscription[0]?.subscriptionName) ||
                'No data'}
            </div>
            <div className="subscription-date">
              {(row?.subscription.length > 0 &&
                moment(row?.subscription[0]?.renewalDate).format(
                  'MMM DD, YYYY'
                ) + ' renewal') ||
                'No data'}
            </div>
          </div>
        </>
      ),
    },
    {
      name: 'Actions',
      selector: 'Subscription',
      left: false,
      sortable: false,
      width: '20%',
      cell: (row) => {
        return (
          <>
            <div className="company-action-item">
              {row.isActive ? (
                <div className="table-view-button">
                  <Tooltip title={'View Account'}>
                    <div
                      onClick={() => navigateTo('view', row.id)}
                      className="table-view-btn"
                    >
                      View
                    </div>
                  </Tooltip>
                  <Tooltip title={'Add User'}>
                    <div
                      onClick={() => navigateTo('addUser', row.id)}
                      className={
                        permissionArray?.includes(
                          constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER
                        )
                          ? 'table-users-btn'
                          : 'list-disabled table-users-btn'
                      }
                    >
                      Add Users
                    </div>
                  </Tooltip>
                </div>
              ) : (
                <>
                  <Tooltip title={'Reactivate User'}>
                    <div
                      onClick={() => openEditModal(row.id, row)}
                      className="table-reactive-button"
                    >
                      Reactivate{' '}
                    </div>
                  </Tooltip>
                </>
              )}
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div className="container-fluid">
      <div
        className="table-custom custom-tabe-tooltip"
        data-test="custome-table"
      >
        <CustomeTable
          {...props}
          columns={AccountsColumns}
          testCase={props.testCase || pageNumber != 1 || false}
          data={accountsList.data}
          pending={loading}
          pagination={false}
          disabledJumpTo={false}
          customStyle="accounts"
          custompagination
          paginationServer={false}
          noDataString={'No account found'}
          totalListCount={totalCount}
          paginationTotalRows={totalCount}
          paginationPerPage={accountListRequestObject.pageSize}
          onPageChangedCalled={handlePageChange}
          pageNumber={pageNumber}
          handleDropdownChange={handleDropdownChange}
          limit={pageSize}
          onSort={handleSort}
        />
      </div>
      <OpenModal
        isOpen={showModal}
        onCancelClickListner={handleCloseModal}
        deactivateUser={reActivateUser}
        userId={accountId}
        reActivateAccounts={true}
      />
    </div>
  );
};

export default AccountList;
