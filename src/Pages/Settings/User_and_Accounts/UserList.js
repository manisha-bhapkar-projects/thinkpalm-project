import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";
import { permissionMapping } from "../../../utils/utils";

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
import { useHistory } from "react-router-dom";

/* Component */
import { CustomeNotification } from "../../../Components/CustomeNotification/CustomeNotification";
import OpenModal from "./OpenModal";
import CustomeTable from "../../../Components/CustomeTable/CustomeTable";


/* Action */
import {
	callChangeUserStatusAPI,
	activate_deactivateUser,
	callgetAdministratorRole,
	callgetUserList,
	callgetAllUserList,
	callsendEmailToActiateUser,
} from "../../../Store/reducers/superAdminUser";
import { getUserProfile } from "../../../utils/storage";
import constants from "../../../utils/constants";
import debounce from 'lodash.debounce';
import { getAccUserCounts } from "../../../Store/reducers/myAccount";



const UserList = (props) => {
	document.title = "Settings";
	const history = useHistory();
	const [showModal, setShowModal] = useState(false);
	const [userName, setUserName] = useState();
	const [userId, setUserId] = useState();
	const [editFlag, setEditFlag] = useState(false);
	const [statusFlag, setStatusFlag] = useState();
	const [userStatus, setUserStatus] = useState();


	const [pageNumber, setPageNumber] = useState(props.pageNumber);
	const [sortField, setSortField] = useState(props.sortField);
	const [sortOrder, setSortOrder] = useState(props.sortOrder);
	const [isSorting, setIsSorting] = useState(false);


	const [id, setId] = useState("");


	const dispatch = useDispatch();
	const permissionArray = permissionMapping();

	const userList = useSelector(
		(state) => state.superAdminUserReducer.userList
	);

	const pageSize = userList.pageSize || 10;
	const totalCount = userList.totalCount;

	const loading = useSelector(
		(state) => state.superAdminUserReducer.userListLoading
	);

	const [userLIstRequestObject, setUserLIstRequestObject] = useState({
		pageNumber: pageNumber,
		pageSize: pageSize,
		sortField,
		sortOrder,
		roles: [],
		showUsersStatusBy: [],
	});

	useEffect(() => {
		if (!permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_USER))
			history.push("/home")
		setUserLIstRequestObject({ ...userLIstRequestObject, ...props.userLIstRequestObject });
	}, [props.userLIstRequestObject]);

	useEffect(() => {
		const requestObjectAll = {
			skipPagination: true,
			sortby: "name",
			sortbydesc: false
		};
		if (!props.testCase) dispatch(callgetAllUserList(requestObjectAll));
		// dispatch(callgetAllUserList(requestObjectAll));
		setPageNumber(1);
		props.setPageNumber(1);
		setSortField("updateddate");
		props.setSortField("updateddate");
		setSortOrder(true);
		props.setSortOrder(true);
	}, []);

	useEffect(() => {
		setPageNumber(1);
		props.setPageNumber(1);
		const requestObject = {
			...userLIstRequestObject,
			searchText: props.searchValue,
			pageNumber: 1,
			pageSize: pageSize,
			sortField,
			sortOrder,
		};
		const requestObjectForAllList = {
			...userLIstRequestObject,
			searchText: props.searchValue,
			pageNumber: 1,
			sortField,
			sortbydesc: sortOrder,
			skipPagination: true,
		};

		setUserLIstRequestObject(requestObject);
		if (!props.testCase) dispatch(callgetUserList(requestObject));
		if (isSorting && props.isFiltering) {
			requestObjectForAllList.sortby = "role"
			dispatch(callgetAllUserList(requestObjectForAllList));
		} else if (isSorting) {
			requestObjectForAllList.sortby = "role"
			dispatch(callgetAllUserList(requestObjectForAllList));
		} else if (props.isFiltering) {
			dispatch(callgetAllUserList(requestObjectForAllList));
		}

	}, [sortField, sortOrder, userLIstRequestObject.roles.length,
		userLIstRequestObject.showUsersStatusBy, isSorting]);

	useEffect(() => {
		searchRequest();
	}, [props.searchValue]);

	const searchRequest = debounce(() => {
		if (props.searchValue.length > 2 || props.searchValue.length === 0) {
			setPageNumber(1);
			props.setPageNumber(1);
			const requestObject = {
				...userLIstRequestObject,
				searchText: props.searchValue,
				pageNumber: 1,
				pageSize: pageSize,
				sortField,
				sortOrder,
			};
			const requestObjectForAllList = {
				...userLIstRequestObject,
				searchText: props.searchValue,
				pageNumber: 1,
				sortField,
				sortbydesc: sortOrder,
				skipPagination: true,
			};

			setUserLIstRequestObject(requestObject);
			if (!props.testCase) dispatch(callgetUserList(requestObject));
			if (isSorting && props.isFiltering) {
				requestObjectForAllList.sortby = "role"
				dispatch(callgetAllUserList(requestObjectForAllList));
			} else if (isSorting) {
				requestObjectForAllList.sortby = "role"
				dispatch(callgetAllUserList(requestObjectForAllList));
			} else if (props.isFiltering) {
				dispatch(callgetAllUserList(requestObjectForAllList));
			}
		}
	}, 1000);

	const handleSort = (field, order) => {
		setIsSorting(true);
		setSortField(field?.sortName);
		props.setSortField(field?.sortName);
		setSortOrder(order === "asc" ? false : true);
		props.setSortOrder(order === "asc" ? false : true);
	};

	const handleCloseModal = () => {
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
		setPageNumber(perPage);
		props.setPageNumber(perPage);
		const requestObject = {
			...userLIstRequestObject,
			pageNumber: perPage,
			pageSize: pageSize,
			sortField,
			sortOrder,
		};
		setUserLIstRequestObject(requestObject);
		// dispatch(callgetUserList(requestObject));
		if (!props.testCase) dispatch(callgetUserList(requestObject));

	};
	const handleDropdownChange = (e) => {
		const requestObject = {
			...userLIstRequestObject,
			pageNumber: 1,
			pageSize: e.target.value,
		};
		// setUserLIstRequestObject(requestObject);
		// dispatch(callgetUserList(requestObject));
		setPageNumber(1)
		if (!props.testCase) setUserLIstRequestObject(requestObject);
		if (!props.testCase) dispatch(callgetUserList(requestObject));
	};
	const handleStatusChanged = async (id, item) => {
		setShowModal(true);
		let user = item?.userProfile
			? item.userProfile.firstName
				? item.userProfile.lastName
					? item.userProfile.firstName +
					" " +
					item.userProfile.lastName
					: ""
				: ""
			: "";
		setUserName(user);
		setUserId(id);
		setUserStatus(item?.userProfile.isActive);
		setStatusFlag(false);
	};

	const openEditModal = (id, item) => {
		setShowModal(true);
		setUserId(id);
		let user = item?.userProfile
			? item.userProfile.firstName
				? item.userProfile.lastName
					? item.userProfile.firstName +
					"" +
					item.userProfile.lastName
					: ""
				: ""
			: "";
		setUserName(user);
		setEditFlag(true);
	};

	const deactivateUser = async (id) => {
		props.setLoading(true);
		setShowModal(false);
		let updateStatus = await activate_deactivateUser({
			id: id,
			statusFlag: statusFlag,
			userLIstRequestObject,
			notify: props.notify
		});
		if (updateStatus && updateStatus.error) {
			props.notify("Failed to update User");
		} else if (updateStatus && updateStatus.data) {
			const requestObject = {
				...userLIstRequestObject,
				searchText: props.searchValue,
				pageNumber: 1,
				pageSize: pageSize,
				sortField,
				sortOrder,
			};

			if (!props.testCase) dispatch(callgetUserList(requestObject));
		}

		props.setLoading(false);
    dispatch(getAccUserCounts());

	};

	const goToEditPage = (id) => {
		props.history.push(`${constants.ROUTE.SIDEBAR.SETTINGS.EDIT_USER}${id}`);
	};

	const sendEmailActivation = async (id) => {
		dispatch(
			callsendEmailToActiateUser({
				Id: id,

			}),
			props.notify("Activation Email Send Successfully")
		);
	};

	const UserColumns = [
		{
			name: "Status",
			selector: "userProfile.isActive",
			width: "10%",
			sortable: false,
			cell: (row) => {
				return (
					<>
						<Tooltip
							title={
								row.userProfile && row.userProfile.isActive
									? !row?.keyCloakUserId
										? "Pending"
										: "Active"
									: "Inactive"
							}
						>
							{row?.userProfile && row?.userProfile.isActive ? (
								!row?.keyCloakUserId ? (
									<img src={userPendingIcon} />
								) : (
									<img src={userActiveIcon} />
								)
							) : (
								<img src={userDeActiveIcon} />
							)}
						</Tooltip>
					</>
				);
			},
		},
		{
			name: "Account",
			selector: "company.companyName",
			width: "20%",
			sortable: true,
			sortName: "company",
			cell: (row) => (
				<>
					<div data-tag="allowRowEvents">
						<div>
							<p className="font-family-for-list mb-2">
								{row.company
									? row.company.companyName
										? row.company.companyName
										: ""
									: ""}
							</p>
						</div>
						<span
							style={{
								color: "slategray",
								fontSize: "14px",
								fontFamily: "webfontregular",
								margin: "0px",
							}}
						>
							{row.company
								? row.company.industryName
									? row.company.industryName
									: ""
								: ""}
						</span>
					</div>
				</>
			),
		},
		{
			name: "User",
			selector: "name",
			sortable: true,
			sortName: "name",
			width: "20%",
			cell: (row) => (
				<div data-tag="allowRowEvents">
					<div>
						<p className="font-family-for-list mb-2">
							{row.userProfile &&
								row.userProfile.firstName &&
								row.userProfile.lastName
								? row.userProfile.firstName +
								" " +
								row.userProfile.lastName
								: ""}
						</p>
					</div>
					<span className="font-family-list-sub">{row.emailId}</span>
				</div>
			),
		},
		{
			name: "Role",
			selector: "roleName",
			right: false,
			sortable: true,
			width: "20%",
			sortName: "role",
			cell: (row) => {
				return (
					<p className="font-family-for-list mb-2">{row.roleName}</p>
				);
			},
		},

		{
			name: "Last Login",
			selector: "lastLogin",
			width: "20%",
			sortable: true,
			right: false,
			sortName: "lastlogin",
			cell: (row) => {
				let title =
					row.userProfile && row.userProfile.isActive
						? !row?.keyCloakUserId
							? "Pending"
							: "Active"
						: "Inactive";
				if (row.lastLogin)
					return (
						<>
							{title === "Pending" ||
								title === "Inactive" ? null : (
								<div data-tag="allowRowEvents">
									<div className="font-family-for-list mb-2">
										{moment(row.lastLogin).format(
											"MMM DD, YYYY"
										)}
									</div>
									<span
										style={{
											color: "slategray",
											fontSize: "14px",
											fontFamily: "webfontregular",
											margin: "0px",
										}}
									>
										{moment(row.lastLogin).format(
											"HH:mm a"
										)}
									</span>
								</div>
							)}
						</>
					);
			},
		},
		{
			name: "",
			selector: "",
			right: false,
			width: "10%",
			grow: "1",
			cell: (row) => {
				return (
					<>
						<div className="text-end">
							<div
								className="position-relative"
								onClick={() => handleDotClick(row.id, row)}
							>
								<span className="btn-round">
									<img src={dotIcon} />
								</span>

								{id == row.id ? (
									<div className="quick-action-btn"

									>
										<Tooltip title={"Edit User"}>
											{row.userProfile.isActive ==
												false ? (
												<div
													className={
														permissionArray?.includes(constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER) ? "" : "a-disabled"}
													onClick={() =>
														openEditModal(
															row.id,
															row
														)
													}
												>
													<img src={userEditIcon} />
												</div>
											) : (
												<div
													className={
														permissionArray?.includes(constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER) ? "" : "a-disabled"}

													onClick={() =>
														goToEditPage(row.id)
													}
												>
													<img src={userEditIcon} />
												</div>
											)}
										</Tooltip>

										<div>
											<Tooltip title={"Send Email"}>
												<img
													src={emailIcon}
													onClick={() =>
														sendEmailActivation(
															row.id
														)
													}
												/>
											</Tooltip>
										</div>
										<div>
											<Tooltip
												title={
													row.userProfile.isActive ==
														false
														? "Not Allowed"
														: "Deactivate User"
												}
											>
												{row.userProfile.isActive ==
													false ? (
													<img
														src={deleteIcon}
														style={{
															cursor: "not-allowed",
															color: "red",
														}}
													/>
												) : (
													<img
														src={deleteIcon}
														onClick={() =>
															handleStatusChanged(
																row.id,
																row
															)
														}
													/>
												)}
											</Tooltip>
										</div>
									</div>
								) : (
									""
								)}
							</div>
						</div>
					</>
				);
			},
		},
	];

	return (
		<div className="container-fluid" data-test="userList-page">
			<div
				className="table-custom custom-tabe-tooltip"
				data-test="custome-table"
			>
				<CustomeTable
					{...props}
					columns={UserColumns}
					testCase={(props.testCase || pageNumber != 1) || false}
					data={userList.data}
					pending={loading}
					pagination={false}
					disabledJumpTo={false}
					customStyle="users"
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
				/>
			</div>
			<OpenModal
				isOpen={showModal}
				onCancelClickListner={handleCloseModal}
				userName={userName}
				deactivateUser={deactivateUser}
				userId={userId}
				userStatus={userStatus}
				editFlag={editFlag}
			/>
		</div>
	);
};

export default UserList;
