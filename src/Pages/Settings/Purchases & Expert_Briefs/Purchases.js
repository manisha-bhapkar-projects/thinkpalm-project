import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import moment from 'moment';


/* Icons */
import close from "../../../assets/images/search-close.svg";
import download from '../../../assets/images/download.png';


/* Component */
import CustomeTable from "../../../Components/CustomeTable/CustomeTable";
import SearchHeaderText from "../../../Components/SearchHeaderText/SearchHeaderText";
import { getUserProfile } from "../../../utils/storage";
import PurchaseData from "../../../Components/StaticData"

/* Action */
import { getPurchaseList } from "../../../Store/reducers/Purchase_ExpertBriefs";

const Purchases = (props) => {
    document.title = "Settings";
	const [userData, setUserData] = useState();
	const [isFiltering, setIsFiltering] = useState(false);
	const [searchValue, setSearchValue] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [sortField, setSortField] = useState();
    const [sortOrder, setSortOrder] = useState(true);
    const [isSorting, setIsSorting] = useState(false);
	const history = useHistory();
    const dispatch = useDispatch();

    const purchaseList = useSelector(
        (state) => state.purchaseExpertReducer?.purchaseList
      );
      const loading = useSelector(
        (state) => state.purchaseExpertReducer?.purchasetListLoading
      );
      const pageSize = purchaseList?.pageSize || 10;
      const totalCount = purchaseList?.totalCount;

      const [purchaseListRequestObject, setPurchaseListRequestObject] = useState({
        pageNumber: pageNumber,
        pageSize: pageSize,
        sortField,
        sortOrder,
      });

      useEffect(() => {
        const requestObjectAll = {
          skipPagination: true,
          sortby: 'transactionDate',
          sortbydesc: false,
        };
        dispatch(getPurchaseList(requestObjectAll));
        setPageNumber(1);
        setSortField('transactionDate');
      }, []);

      useEffect(() => {
        setPageNumber(1);
        const requestObject = {
          ...purchaseListRequestObject,
          searchText: props.searchValue,
          pageNumber: 1,
          pageSize: pageSize,
          sortField,
          sortOrder,
        };
        setPurchaseListRequestObject(requestObject);
        dispatch(getPurchaseList(requestObject));
      }, [sortField, sortOrder]);
    
      useEffect(() => {
        var user_data = getUserProfile();
        setUserData(user_data);
        const requestObject = {
          ...purchaseListRequestObject,
          pageNumber: pageNumber,
          pageSize: pageSize,
        };
        dispatch(getPurchaseList(requestObject));
      }, []);
    
      const handlePageChange = (perPage) => {
        setPageNumber(perPage);
        const requestObject = {
          ...purchaseListRequestObject,
          pageNumber: perPage,
          pageSize: pageSize,
        };
        setPurchaseListRequestObject(requestObject);
        dispatch(getPurchaseList(requestObject));
      };
    
      const handleDropdownChange = (e) => {
        const requestObject = {
          ...purchaseListRequestObject,
          pageNumber: 1,
          pageSize: e.target.value,
        };
        setPurchaseListRequestObject(requestObject);
        dispatch(getPurchaseList(requestObject));
      };
    
      const handleSort = (field, order) => {
        setIsSorting(true);
        setSortField(field?.sortName);
        props.setSortField(field?.sortName);
        setSortOrder(order === 'asc' ? false : true);
        props.setSortOrder(order === 'asc' ? false : true);
      };
  //   useEffect(() => {
	// 	var user_data = getUserProfile();
	// 	setUserData(user_data);
  //   dispatch(getPurchaseList());
	// }, []);


    const onTextChange = (e) => {
		setSearchValue(e.target.value)
	}
    const PurchaseColumns = [
        {
            name: 'Date',
            selector: 'transactionDate',
            width: '15%',
            sortable: true,
            sortName: 'transactionDate',
            cell: (row) => {
              return <>{moment(row?.transactionDate).format('MMM DD, YYYY')}</>;
            },
          },
        {
            name: "Title",
            selector: "documentProduct.document.document.title",
            sortable: true,
            sortName: "title",
            width: "25%",
        },
        {
            name: "Country",
            selector: "documentProduct.document.countryName",
            width: "25%",
            sortable: true,
            sortName: "country",
        },
        {
            name: "Language",
            selector: "documentProduct.document.document.language",
            left: false,
            sortable: false,
            width: "25%",
        },
        {
            name: '',
            selector: '',
            width: '10%',
            cell: (row) => {
              return (
                <>
                  <img src={download} />
                </>
              );
            },
          },
    ];


    return (
        <div className="accounts_userList-page">
            <div className="table-custom custom-tabe-tooltip container-fluid expert_briefs-table px-0">
                <CustomeTable
                    {...props}
                    columns={PurchaseColumns}
                    data={purchaseList?.data}
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
                    shadowTitle="TEMPLATE PURCHASE HISTORY"
                    
                />
            </div>
        {/* <div className="invoices_container">
          <div className="invoices_header">
            <h3>Available Invoices</h3>
            <span>Download All</span>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="invoices_list">
                <ul>
                  <li>
                    Employment_Agreement_Italy
                    <img src={download}/>
                    </li>
                    <li>
                    Compliance_Checklist
                    <img src={download}/>
                    </li>
                    <li>
                    Employee_Handbook
                    <img src={download}/>
                    </li>
                    <li>
                    Employee_Handbook
                    <img src={download}/>
                    </li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="invoices_list">
                <ul>
                  <li>
                  Employement_Guide
                    <img src={download}/>
                    </li>
                    <li>
                    Compliance_Checklist_Japan
                    <img src={download}/>
                    </li>
                    <li>
                    An_Invoice_With_A_Very_Long_Title
                    <img src={download}/>
                    </li>
                    <li>
                    Dismissal_Template
                    <img src={download}/>
                    </li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}
        </div>
    );
};

export default Purchases;
