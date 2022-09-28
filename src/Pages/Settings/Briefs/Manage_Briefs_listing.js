import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import moment from 'moment';

/* Component */
import SearchHeaderText from '../../../Components/SearchHeaderText/SearchHeaderText';
import CustomeTable from '../../../Components/CustomeTable/CustomeTable';
import { downloadFile, permissionMapping } from '../../../utils/utils';
import { getUserProfile } from '../../../utils/storage';
import constants from '../../../utils/constants';
import Header from './Header';

/* Action */
import {
  downloadSingleFile,
  getManageBriefsList,
} from '../../../Store/reducers/Purchase_ExpertBriefs';

const ManageBriefs = (props) => {
  document.title = 'Settings';
  const [pageNumber, setPageNumber] = useState(props.pageNumber);
  const [sortField, setSortField] = useState(props.sortField);
  const [sortOrder, setSortOrder] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const [userData, setUserData] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [downloadLoading, setDownloadLoading] = useState(false);
  const permissionArray = permissionMapping();

  const history = useHistory();
  const dispatch = useDispatch();
  const manageBriefList = useSelector(
    (state) => state?.purchaseExpertReducer?.manageBriefList
  );
  const pageSize = manageBriefList?.pageSize || 10;
  const totalCount = manageBriefList?.totalCount;
  const loading = useSelector(
    (state) => state?.purchaseExpertReducer?.manageBriefListLoading
  );
  const [briefsListRequestObject, setBirefsListRequestObject] = useState({
    pageNumber: pageNumber,
    pageSize: pageSize,
    sortField,
    sortOrder,
  });

  useEffect(() => {
    const requestObject = {
      ...briefsListRequestObject,
      pageNumber: 1,
      pageSize: pageSize,
      sortField,
      sortOrder,
    };
    setPageNumber(1);
    setBirefsListRequestObject(requestObject);
    dispatch(getManageBriefsList(requestObject));
  }, []);

  useEffect(() => {
    var user_data = getUserProfile();
    setUserData(user_data);
    const requestObject = {
      ...briefsListRequestObject,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    dispatch(getManageBriefsList(requestObject));
  }, []);

  useEffect(() => {
    setPageNumber(1);
    const requestObject = {
      ...briefsListRequestObject,
      searchText: searchValue,
      pageNumber: 1,
      pageSize: pageSize,
      sortField,
      sortOrder,
    };
    setBirefsListRequestObject(requestObject);
    dispatch(getManageBriefsList(requestObject));
  }, [sortField, sortOrder, searchValue]);

  const FilterAPIRequest = (req) => {
    const requestObject = {
      ...briefsListRequestObject,
      ...req,
      pageNumber: 1,
      pageSize: pageSize,
      sortField,
      sortOrder,
    };
    setBirefsListRequestObject(requestObject);
    dispatch(getManageBriefsList(requestObject));
  };

  const handleSort = (field, order) => {
    setIsSorting(true);
    setSortField(field?.sortName);
    setSortOrder(order === 'asc' ? false : true);
  };

  const handlePageChange = (perPage) => {
    setPageNumber(perPage);
    const requestObject = {
      ...briefsListRequestObject,
      pageNumber: perPage,
      pageSize: pageSize,
    };
    setBirefsListRequestObject(requestObject);
    dispatch(getManageBriefsList(requestObject));
  };
  const handleDropdownChange = (e) => {
    const requestObject = {
      ...briefsListRequestObject,
      pageNumber: 1,
      pageSize: e.target.value,
    };
    setBirefsListRequestObject(requestObject);
    dispatch(getManageBriefsList(requestObject));
  };

  const onTextChange = (e) => {
    setSearchValue(e.target.value);
  };
  const handleClickDownload = async (id) => {
    setDownloadLoading(true);
    const downloadResponse = await dispatch(downloadSingleFile(id));
    if (downloadResponse) {
      setDownloadLoading(false);
      const url = window.URL.createObjectURL(
        new Blob([downloadResponse.payload.data])
      );
      downloadFile(url, downloadResponse.payload.headers.originalfilename);
    }
  };

  const BriefsColumns = [
    {
      name: 'Ref #',
      selector: 'referenceNo',
      width: '10%',
      sortable: false,
    },
    {
      name: 'Request Date',
      selector: 'requestDate',
      sortable: true,
      sortName: 'requestDate',
      width: '13%',
      cell: (row) => {
        return <>{moment(row?.requestDate).format('MMM DD, YYYY')}</>;
      },
    },
    {
      name: 'Requestor',
      selector: 'requestedUser.fullName',
      width: '10%',
      sortable: true,
      sortName: 'Requestor',
      cell: (row) => {
        return (
          <>
            <div className="company-name-container">
              <div className="company-name-section">
                <div className="company-name">{row?.reqUserCompany?.name}</div>
                <div className="industry-name">
                  {row?.requestedUser?.fullName}
                </div>
              </div>
            </div>
          </>
        );
      },
    },
    {
      name: 'Country',
      selector: 'countryName',
      left: false,
      sortable: false,
      width: '8%',
    },
    {
      name: 'Assignee',
      selector: 'assignee?.fullName',
      left: false,
      sortable: true,
      width: '10%',
      cell: (row) => {
        return (
          <>
            <div>{row?.assignee?.fullName}</div>
          </>
        );
      },
    },
    {
      name: 'Hours Used',
      selector: '',
      left: false,
      sortable: false,
      width: '10%',
      cell: (row) => {
        return (
          <>
            <div>
              {row.timeUsed?.usedHour
                ? row.timeUsed?.usedHour +
                  ':' +
                  row.timeUsed?.usedminutes +
                  ' hrs'
                : '--'}
            </div>
          </>
        );
      },
    },
    {
      name: 'Status',
      selector: '',
      left: false,
      sortable: true,
      width: '11%',
      cell: (row) => {
        return (
          <>
            <div
              className={`${
                row.status === 'In Progress'
                  ? 'query-status-progress'
                  : row.status === 'Submitted'
                  ? 'query-status-submit'
                  : row.status === 'Action Pending'
                  ? 'query-status-action'
                  : row.status === 'Cancelled'
                  ? 'query-status-action'
                  : 'query-status-completed'
              }`}
            >
              {row.status}
            </div>
          </>
        );
      },
    },
    {
      name: 'Query',
      selector: '',
      left: false,
      sortable: false,
      width: '8%',
      cell: (row) => {
        return (
          <>
            <div
              className={
                permissionArray?.includes(
                  constants.PERMISSION_MAPPING.VIEW_QUERY_MANAGEMENT_PAGE
                )
                  ? 'download-btn'
                  : 'download-btn a-disabled'
              }
              onClick={() =>
                history.push({
                  pathname: `${constants.ROUTE.SIDEBAR.SETTINGS.VIEW_QUERY}${row.id}`,
                })
              }
            >
              View
            </div>
          </>
        );
      },
    },
    {
      name: '',
      selector: '',
      left: false,
      sortable: false,
      width: '10%',
      cell: (row) => {
        return (
          <>
            <div
              className="download-btn"
              onClick={() => handleClickDownload(row.id)}
            >
              Download
            </div>
          </>
        );
      },
    },
    {
      name: 'Responses',
      selector: '',
      left: false,
      sortable: false,
      width: '5%',
      cell: (row) => {
        return (
          <>
            <button
              className={
                permissionArray?.includes(
                  constants.PERMISSION_MAPPING.ASSIGN_TO_EXPERT
                ) ||
                permissionArray?.includes(
                  constants.PERMISSION_MAPPING.MANAGE_QUERY
                ) ||
                !permissionArray?.includes(
                  constants.PERMISSION_MAPPING.VIEW_QUERY_MANAGEMENT_PAGE
                )
                  ? 'manage-btn'
                  : 'manage-btn a-disabled'
              }
              onClick={() => {
                history.push({
                  pathname: `${constants.ROUTE.SIDEBAR.SETTINGS.MANAGE_QUERY}${row.id}`,
                });
              }}
            >
              Manage
            </button>
          </>
        );
      },
    },
  ];

  return (
    <div className="accounts_userList-page" data-test="search-results-wrap">
      <SearchHeaderText
        filter={true}
        breadcrumb={true}
        user={userData}
        manageBriefsListing={true}
      />
      <Header
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        onTextChange={onTextChange}
        FilterAPIRequest={FilterAPIRequest}
        placeholder="Search Briefs"
      />

      <div className="container-fluid" data-test="manage-brief-listing">
        <div
          className="table-custom custom-tabe-tooltip"
          data-test="custome-table"
        >
          <CustomeTable
            {...props}
            columns={BriefsColumns}
            data={manageBriefList?.data}
            pending={loading}
            pagination={false}
            disabledJumpTo={false}
            customStyle="accounts"
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
    </div>
  );
};

export default ManageBriefs;
