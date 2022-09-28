import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";

/* Icons */
import userActiveIcon from "../../../assets/images/user-active.svg";
import userDeActiveIcon from "../../../assets/images/user-inactive.svg";
import userEditIcon from "../../../assets/images/user-edit.svg";
import userPendingIcon from "../../../assets/images/user-pending.svg";
import emailIcon from "../../../assets/images/email-line.svg";
import deleteIcon from "../../../assets/images/delete-outlined.svg";
import downloadIcon from "../../../assets/images/download.png";
import dotIcon from "../../../assets/images/dotIcon.svg";
import close from "../../../assets/images/search-close.svg";

/* Component */
import { CustomeNotification } from "../../../Components/CustomeNotification/CustomeNotification";
import FilterDropDwon from "../../../Components/MultiselectDropDown/FilterDropdown";

import UserList from "./UserList";
import AccountList from "./AccountList";
import SearchHeaderText from "../../../Components/SearchHeaderText/SearchHeaderText";
import CustomeTable from "../../../Components/CustomeTable/CustomeTable";
import SupportButton from "../../../Components/SupportButton"
import { ExportCSV } from "../../CountryCompare/ExportCSV"
import Header from "./header";
import Loader from "../../../Components/Loader";

/* Action */
import {
	callChangeUserStatusAPI,
	callgetAdministratorRole,
	callgetUserList,
	callgetAllUserList,
	getAllSubscriptions,
} from "../../../Store/reducers/superAdminUser";
import { getUserProfile } from "../../../utils/storage";
import constants from "../../../utils/constants";

const AccountsUsersList = (props) => {
	document.title = "Accounts & Users";
	const [selectedRole, setSelectedRole] = useState([]);
	const [userData, setUserData] = useState();
	const [userTabs, setUserTabs] = useState('Accounts');
	const [loading, setLoading] = useState(false);

	const [pageNumber, setPageNumber] = useState(1);
	const [sortField, setSortField] = useState("updatedAt");
	const [sortOrder, setSortOrder] = useState(true);
	const [searchValue, setSearchValue] = useState("");
	const [isFiltering, setIsFiltering] = useState(false);

	const history = useHistory();
	const { pageName } = useParams();

	const dispatch = useDispatch();
	const userList = useSelector(
		(state) => state.superAdminUserReducer?.userList
	);

	const userListAll = useSelector(
		(state) => state.superAdminUserReducer?.userListAll
	);


	const allAccountList = useSelector(
		(state) => state.superAdminUserReducer?.allAccountList
	);

	const { subscriptionList } = useSelector((state) => state.superAdminUserReducer);

	const pageSize = userList.pageSize || 15;
	const userRoles = useSelector(
		(state) => state.superAdminUserReducer.administratorRole
	);

	const [userLIstRequestObject, setUserLIstRequestObject] = useState({
		pageNumber: pageNumber,
		pageSize: pageSize,
		sortField,
		sortOrder,
		subscriptions: [],
		roles: [],
		showUsersStatusBy: [],
	});

	useEffect(() => {
		var user_data = getUserProfile();
		setUserData(user_data);
		if (!props.testCase) dispatch(callgetAdministratorRole());
		if (!props.testCase) dispatch(getAllSubscriptions());
	}, []);

	useEffect(() => {
		setSearchValue("")
	}, [userTabs]);

	useEffect(() => {
		if (pageName) setUserTabs(pageName)
		if (pageName === "Accounts") {
			setSortField("updatedAt");
			setSortOrder(true);
		} else if (pageName === "Users") {
			setSortField("updateddate");
		}
	}, [pageName]);

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

	// const handleClickSelect = async (userRole, e) => {
	// 	let array = selectedRole.slice(0);
	// 	if (e.target.checked) {
	// 		setSelectedRole([...array, userRole.id]);
	// 		array = [...array, userRole.id];
	// 	} else {
	// 		let index = array.findIndex((item) => item === userRole.id);
	// 		setSelectedRole(array.splice(index, 1));
	// 	}

	// 	const requestObject = {
	// 		...userLIstRequestObject,
	// 		pageNumber: pageNumber,
	// 		pageSize: pageSize,
	// 		roleId: array.join(","),
	// 	};
	// 	setUserLIstRequestObject(requestObject);
	// 	dispatch(callgetUserList(requestObject));
	// };

	const onTextChange = (e) => {
		setSearchValue(e.target.value)
	}

	return (
		<div className="accounts_userList-page loader-enable" data-testid="user-accounts-page">
			{
				loading &&
				(<div className="custom-loader">
					<Loader />
				</div>)
			}
			<SearchHeaderText
				filter={true}
				breadcrumb={true}
				user={userData}
				userlistBreadcrumb={true}
			/>
			<Header
				history={history}
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
			/>
			{
				userTabs === "Accounts" ?
					<AccountList
						{...props}
						history={history}
						userLIstRequestObject={userLIstRequestObject}
						setPageNumber={setPageNumber}
						pageNumber={pageNumber}
						searchValue={searchValue}
						setSortField={setSortField}
						sortField={sortField}
						setLoading={setLoading}
						setSortOrder={setSortOrder}
						sortOrder={sortOrder}
					/> :
					<UserList
						{...props}
						history={history}
						userLIstRequestObject={userLIstRequestObject}
						setPageNumber={setPageNumber}
						pageNumber={pageNumber}
						searchValue={searchValue}
						setSortField={setSortField}
						sortField={sortField}
						isFiltering={isFiltering}
						setLoading={setLoading}
						setSortOrder={setSortOrder}
						sortOrder={sortOrder}
					/>
			}
			<SupportButton />
		</div>
	);
};

export default AccountsUsersList;
