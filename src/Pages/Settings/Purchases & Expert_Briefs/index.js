import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import SearchHeaderText from '../../../Components/SearchHeaderText/SearchHeaderText';
import { getUserProfile } from '../../../utils/storage';
import Expert_Briefs from './Expert_Briefs';
import PurchaseHeader from './PurchaseHeader';
import Purchases from './Purchases';
import { getKeyClockToken_Data } from "../../../utils/storage"

import constants from "../../../utils/constants";
import jwt_decode from "jwt-decode";
const Purchase_ExpertBrief = (props) => {
    // const dispatch = useDispatch();
    document.title = "Purchase & Expert Briefs";

    const [userData, setUserData] = useState();
    const [searchValue, setSearchValue] = useState("");
    const [selectedRole, setSelectedRole] = useState([]);
    const [isFiltering, setIsFiltering] = useState(false);
    const [userTabs, setUserTabs] = useState('Purchases');
    const [sortField, setSortField] = useState("updatedAt");
    const [sortOrder, setSortOrder] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [permission, setPermission] = useState(false)
    const [permissionArray, setPermissioinArray] = useState()
    const { pageName } = useParams();
    const pageSize = 15;

    const [userLIstRequestObject, setUserLIstRequestObject] = useState({
        pageNumber: pageNumber,
        pageSize: pageSize,
        sortField,
        sortOrder,
        subscriptions: [],
        roles: [],
        showUsersStatusBy: [],
    });

    const userRoles = useSelector(
        (state) => state?.superAdminUserReducer?.administratorRole
    );
    const { subscriptionList } = useSelector((state) => state?.superAdminUserReducer);

    const userList = useSelector(
        (state) => state?.superAdminUserReducer?.userList
    );

    const userListAll = useSelector(
        (state) => state?.superAdminUserReducer?.userListAll
    );


    const allAccountList = useSelector(
        (state) => state?.superAdminUserReducer?.allAccountList
    );

    useEffect(() => {
        var user_data = getUserProfile();
        setUserData(user_data);
        const token_data = getKeyClockToken_Data();
        const user = token_data ? jwt_decode(token_data) : undefined;
        const scopeArray = user?.scope?.split(" ");
        setPermissioinArray(scopeArray && scopeArray.length > 0 ? scopeArray : []);
    }, []);
    useEffect(() => {
        setPermission(true)
        if ((permissionArray?.includes(constants.PERMISSION_MAPPING.SUBMIT_QUERY) ||
            permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_MY_ACCOUNT_QUERIES)) &&
            !permissionArray?.includes(constants.PERMISSION_MAPPING.ACCESS_AND_DOWNLOAD_PAST_PURCHASE)) {
            setUserTabs("Expert-Briefs")
        }
    }, [permissionArray]);
    useEffect(() => {
        setSearchValue("")
    }, [userTabs]);

    useEffect(() => {
        if (pageName) setUserTabs(pageName)
        if (pageName === "Purchases") {
            setSortField("updatedAt");
            setSortOrder(true);
        } else if (pageName === "Expert-Briefs") {
            setSortField("RequestedDate");
        }
    }, [pageName]);

    const onTextChange = (e) => {
        setSearchValue(e.target.value)
    }
    const accountsAPIRequest = (req) => {
        const requestObject = {
            ...userLIstRequestObject,
            ...req,
            pageNumber: 1,
            pageSize: pageSize,
            sortField,
            sortOrder,
        };

        setUserLIstRequestObject(requestObject);
    }

    return (
        <div className="accounts_userList-page mt-0" data-testid="user-accounts-page">
            <SearchHeaderText
                filter={true}
                breadcrumb={true}
                user={userData}
                purchaseBreadcrumb={true}
            />
            <PurchaseHeader
                history={props.history}
                isView="user"
                userListAll={userListAll}
                accountsList={allAccountList}
                setSearchValue={setSearchValue}
                userRoles={userRoles}
                selectedRole={selectedRole}
                searchValue={searchValue}
                userTabs={userTabs}
                subscriptionList={subscriptionList}
                accountsAPIRequest={accountsAPIRequest}
                setIsFiltering={setIsFiltering}
                isFiltering={isFiltering}
                setUserTabs={setUserTabs}
                onTextChange={onTextChange}
                purchaseFlag={true}

            />
            {
                userTabs === "Purchases" && permission && permissionArray?.includes(constants.PERMISSION_MAPPING.ACCESS_AND_DOWNLOAD_PAST_PURCHASE) ?
                    <Purchases
                        {...props}
                        history={props.history}
                        userLIstRequestObject={userLIstRequestObject}
                        setPageNumber={setPageNumber}
                        pageNumber={pageNumber}
                        searchValue={searchValue}
                        setSortField={setSortField}
                        sortField={sortField}
                        setSortOrder={setSortOrder}
                        sortOrder={sortOrder}
                    /> : userTabs === "Expert-Briefs" && (permissionArray?.includes(constants.PERMISSION_MAPPING.SUBMIT_QUERY) || permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_MY_ACCOUNT_QUERIES)) && permission ?
                        <Expert_Briefs
                            {...props}
                            history={props.history}
                            userLIstRequestObject={userLIstRequestObject}
                            setPageNumber={setPageNumber}
                            pageNumber={pageNumber}
                            searchValue={searchValue}
                            setSortField={setSortField}
                            sortField={sortField}
                            isFiltering={isFiltering}
                            setSortOrder={setSortOrder}
                            sortOrder={sortOrder}
                        /> : ""
            }

        </div>
    );
}

export default Purchase_ExpertBrief;
