import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { Spinner } from "react-bootstrap";
import Tooltip from '@material-ui/core/Tooltip';
import { permissionMapping } from '../../../utils/utils';

/* Icons */
import download from "../../../assets/images/download.png";

/* Component */
import { ExportCSV } from "../../CountryCompare/ExportCSV";
import CustomeTable from "../../../Components/CustomeTable/CustomeTable";
import { getUserProfile } from "../../../utils/storage";
import constants from "../../../utils/constants";
import { downloadFile } from "../../../utils/utils"

/* Action */
import { getExpertList, getHoursDetails, downloadExpertBriefs } from "../../../Store/reducers/Purchase_ExpertBriefs";
import mixpanel from 'mixpanel-browser';
import {userDetailsMixpnel} from '../../../utils/utils'
mixpanel.init(constants.MIXPANEL_TOKEN);
const Expert_Briefs = (props) => {
  document.title = "Settings";
  const [userData, setUserData] = useState();
  const [isFiltering, setIsFiltering] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [sortField, setSortField] = useState();
  const [sortOrder, setSortOrder] = useState(true);
  const [isSorting, setIsSorting] = useState(false);
  const [loader, setLoader] = useState(false);
  const [downloadId, setDownloadId] = useState();


  const [progressBar, setProgressBar] = useState(30);
  const history = useHistory();
  const dispatch = useDispatch();
  const permissionArray = permissionMapping();
  const expertList = useSelector(
    (state) => state.purchaseExpertReducer?.expertList
  );
  const hoursDetails = useSelector(
    (state) => state?.purchaseExpertReducer?.hoursDetails
  );
  const loading = useSelector(
    (state) => state?.purchaseExpertReducer?.expertListLoading
  );
  const pageSize = expertList?.pageSize || 10;
  const totalCount = expertList?.totalCount;
  const [expertListRequestObject, setExpertListRequestObject] = useState({
    pageNumber: pageNumber,
    pageSize: pageSize,
    sortField,
    sortOrder,
    subscriptions: [],
    showUsersStatusBy: [],
  });
  const [exportUserData, setExportUserData] = useState({
    userExportData: [],
    fileName: "Users",
  });

  useEffect(() => {
    const requestObjectAll = {
      skipPagination: true,
      sortby: "RequestedDate",
      sortbydesc: false,
    };
    //dispatch(getExpertList(requestObjectAll));
    setPageNumber(1);
    setSortField("RequestedDate");
    // props.setSortField("RequestedDate");
    // setSortOrder(true);
    // props.setSortOrder(true);
  }, []);

  useEffect(() => {
    setPageNumber(1);
    const requestObject = {
      ...expertListRequestObject,
      searchText: props.searchValue,
      pageNumber: 1,
      pageSize: pageSize,
      sortField,
      sortOrder,
    };
    setExpertListRequestObject(requestObject);
    dispatch(getExpertList(requestObject));
  }, [sortField, sortOrder]);

  useEffect(() => {
    var user_data = getUserProfile();
    setUserData(user_data);
    const requestObject = {
      ...expertListRequestObject,
      pageNumber: pageNumber,
      pageSize: pageSize,
    };
    dispatch(getExpertList(requestObject));
    dispatch(getHoursDetails())
  }, []);

  const handlePageChange = (perPage) => {
    setPageNumber(perPage);
    const requestObject = {
      ...expertListRequestObject,
      pageNumber: perPage,
      pageSize: pageSize,
    };
    setExpertListRequestObject(requestObject);
    dispatch(getExpertList(requestObject));
  };

  const handleDropdownChange = (e) => {
    const requestObject = {
      ...expertListRequestObject,
      pageNumber: 1,
      pageSize: e.target.value,
    };
    setExpertListRequestObject(requestObject);
    dispatch(getExpertList(requestObject));
  };

  const handleSort = (field, order) => {
    setIsSorting(true);
    setSortField(field?.sortName);
    props.setSortField(field?.sortName);
    setSortOrder(order === "asc" ? false : true);
    props.setSortOrder(order === "asc" ? false : true);
  };
  const navigateTo = (refNo, id) => {
    props.history.push(`${constants.ROUTE.SIDEBAR.SETTINGS.CLIENT_VIEW_QUERY}/${refNo}/${id}`);
    mixpanel.track('View', {
      'Ref':refNo,
      'User Details':userDetailsMixpnel()
    })
  };
  const allDataforExport = (userData) => {
    let data = [];
    expertList?.data &&
      expertList?.data.forEach((user) => {
        if (expertList?.data) {
          data.push({
            "Request Date": user.createdAt,
            Requestor: user.fullName,
            Country: user.Country,
            expertName: user.expertName,
            industryName: user.industryName,
            firstName: user.firstName,
            fullName: user.fullName,
            lastName: user.lastName,
          });
        }
      });

    setExportUserData({
      ...exportUserData,
      userExportData: data,
      fileName: "Users",
    });
  };
  const downloadExpertBrief = async (id,refNo) => {
    setLoader(true);
    setDownloadId(id);
    const fileData = await downloadExpertBriefs(id);
    if (fileData) {
      setLoader(false);
      // setLoading(false);
      const url = window.URL.createObjectURL(new Blob([fileData.data]));
      downloadFile(url, fileData.headers.originalfilename);
      mixpanel.track('Download', {
        'Ref':refNo,
        'User Details':userDetailsMixpnel()
      })
    }
   

  }
  const customStyles = {
    headCells: {
      style: {
        paddingLeft: "5px", // override the cell padding for head cells
        paddingRight: "5px",
      },
    },
    cells: {
      style: {
        paddingLeft: "5px", // override the cell padding for data cells
        paddingRight: "5px",
      },
    },
  };
  const ExpertsColumns = [
    {
      name: "Ref #",
      width: "9%",
      sortable: true,
      sortName: "ReferenceNo",
      selector: "referenceNo",
    },
    {
      name: "Request Date",
      selector: "requestDate",
      width: "14%",
      sortable: true,
      sortName: "RequestedDate",
      cell: (row) => {
        return <>{moment(row?.requestDate).format("MMM DD, YYYY")}</>;
      },
    },

    {
      name: "Requestor",
      selector: "requestedUser.fullName",
      sortable: true,
      sortName: "Requester",
      width: "12%",
      cell: (row) => {
        return <>{row?.requestedUser?.fullName}</>;
      },
    },
    {
      name: "Country",
      selector: "countryName",
      width: "11%",
      sortable: true,
      sortName: "Country",
    },
    // {
    //   name: '',
    //   selector: '',
    //   width: '10%',
    //   cell: (row) => {
    //     return (
    //       <>
    //         {/* {!loading ? (
    //           <ExportCSV
    //             csvData={exportUserData.userExportData}
    //             fileName={exportUserData.fileName}
    //           />
    //         ) : (
    //           <Spinner animation="border" size="sm" />
    //         )} */}
    //         <img src={download} />
    //       </>
    //     );
    //   },
    // },
    {
      name: "Hours Used",
      width: "13%",
      cell: (row) => {
        return <span className={row?.hoursUsed ? "" : "no-hoursused"}>
          {row?.timeUsed?.usedHour ? row?.timeUsed?.usedHour : row?.timeUsed?.usedminutes ? "00" : ""}{row?.timeUsed?.usedminutes ? ":" : ""}{row?.timeUsed?.usedminutes ? row?.timeUsed?.usedminutes.toString().length === 1 ? "0" + row?.timeUsed?.usedminutes : row?.timeUsed?.usedminutes : ""} {row?.timeUsed?.usedminutes || row?.timeUsed?.usedHour ? "hrs" : "--"}
        </span>;
      },
    },
    {
      name: "Last Updated",
      selector: "updatedAt",
      width: "14%",
      sortable: true,
      sortName: "LastUpdated",
      cell: (row) => {
        return <>{moment(row?.updatedAt).format("MMM DD, YYYY")}</>;
      },
    },
    {
      name: "Status",
      width: "10%",
      sortable: true,
      sortName: "QueryStatus",
      selector: "status",
      cell: (row) => {
        return (
          <>
            <Tooltip title={row?.status}>
              <span className={
                row?.statusId === 3 ? "status-cell pending"
                  : row?.statusId === 1 ? "status-cell submitted"
                    : row?.statusId === 2 ? "status-cell Inprogress"
                      : row?.statusId === 5 ? "status-cell Completed" : ""}>
                {row?.status?.length > 11 ? (row?.status.substring(0, 9) + "...") : row?.status}
              </span>
            </Tooltip>
          </>
        );
      },
    },


    {
      name: "Query",
      width: "6%",
      cell: (row) => {
        return (
          <>
            <span className={(!permissionArray?.includes(
              constants.PERMISSION_MAPPING.VIEW_MY_ACCOUNT_QUERIES) || permissionArray?.includes(
                constants.PERMISSION_MAPPING.SUBMIT_QUERY)) ? "view-estimate" : "view-estimate disabled"}
              onClick={(!permissionArray?.includes(
                constants.PERMISSION_MAPPING.VIEW_MY_ACCOUNT_QUERIES) || permissionArray?.includes(
                  constants.PERMISSION_MAPPING.SUBMIT_QUERY)) ? () => navigateTo(row?.referenceNo, row?.id) : ""}>
              View
            </span>
          </>
        );
      },
    },
    {
      name: "Responses",
      width: "10%",
      sortName: "RequestedDate",
      cell: (row) => {
        return (
          <>

            <span data-test="Responses" className={(!permissionArray?.includes(
              constants.PERMISSION_MAPPING.VIEW_MY_ACCOUNT_QUERIES) || permissionArray?.includes(
                constants.PERMISSION_MAPPING.SUBMIT_QUERY)) ? "view-estimate" : "view-estimate disabled"}
              onClick={
                row?.statusId === 3 ? ((!permissionArray?.includes(
                  constants.PERMISSION_MAPPING.VIEW_MY_ACCOUNT_QUERIES) || permissionArray?.includes(
                    constants.PERMISSION_MAPPING.SUBMIT_QUERY)) ? () => {
                      props.history.push(`${constants.ROUTE.SIDEBAR.SETTINGS.CLIENT_VIEW_ESTIMATE}/${row?.referenceNo}/${row?.id}`);
                      mixpanel.track('Click on View Estimate', {
                        'User Details':userDetailsMixpnel()
                      })
                    } : "") : (
                  row?.statusId === 5 ? () => downloadExpertBrief(row?.id,row?.referenceNo) : ""
                )
              } >
              {
                row?.statusId === 3 ? "View Estimate" : row?.statusId === 5 ? loader && row?.id === downloadId ?
                  <Spinner
                    className="specifics-loading-spinner"
                    animation="border"
                    size="sm"
                  />
                  :
                  "Download"
                  : ""
              }
            </span>

          </>
        );
      },
    },
  ];

  return (
    <div
      className="accounts_userList-page container-fluid"
      data-test="ExpertBriefs"
    >
      <div className="table-custom custom-tabe-tooltip container-fluid expert_briefs-table px-0">
        <CustomeTable
          {...props}
          columns={ExpertsColumns}
          // testCase={(props.testCase || pageNumber != 1) || false}
          data={expertList?.data}
          pending={loading}
          pagination={false}
          disabledJumpTo={false}
          // customStyle="accounts"
          custompagination
          paginationServer={false}
          noDataString={"No data found"}
          totalListCount={totalCount}
          paginationTotalRows={totalCount}
          paginationPerPage={pageSize}
          onPageChangedCalled={handlePageChange}
          pageNumber={pageNumber}
          handleDropdownChange={handleDropdownChange}
          limit={pageSize}
          onSort={handleSort}
          shadowText={true}
          expertHour={true}
          customStyles={customStyles}
          shadowTitle="EXPERT HOURS LOG"
          progressBar={progressBar}
          hoursDetails={hoursDetails}
        />
      </div>
    </div>
  );
};
export default Expert_Briefs;
