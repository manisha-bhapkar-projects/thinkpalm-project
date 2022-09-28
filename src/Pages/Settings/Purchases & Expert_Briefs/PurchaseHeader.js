import React, { useEffect, useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
/* Icons */
import close from "../../../assets/images/search-close.svg";

/* Component */
import FilterDropDwon from "../../../Components/MultiselectDropDown/FilterDropdown";
import AccountsFilterDropdown from "../../../Components/MultiselectDropDown/AccountsFilterDropdown";
import { ExportCSV } from "../../CountryCompare/ExportCSV"

import { permissionMapping } from "../../../utils/utils";

import constants from "../../../utils/constants";
import { Spinner } from "react-bootstrap";
import mixpanel from 'mixpanel-browser';
import {userDetailsMixpnel} from '../../../utils/utils'
mixpanel.init(constants.MIXPANEL_TOKEN);
const PurchaseHeader = ({ history, userListAll, accountsList, subscriptionList, accountsAPIRequest, setSearchValue, userRoles, handleClickSelect, selectedRole, searchValue, onTextChange, userTabs, setUserTabs, setIsFiltering }) => {
	const [exportUserData, setExportUserData] = useState({
		userExportData: [],
		fileName: "Users",
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
		(state) => state.superAdminUserReducer.allAccountListLoading
	);
	const userAllListLoading = useSelector(
		(state) => state.superAdminUserReducer.userAllListLoading
	);
	const handleClick = () => {
		if (userTabs === 'Purchases') {
			history.push(constants.ROUTE.SIDEBAR.SETTINGS.ADD_ACCOUNT);
		} else {
			history.push(constants.ROUTE.SIDEBAR.SETTINGS.ADD_USER);
		}
	};


	useEffect(() => {
		if (userTabs === "Purchases") {
			allDataforExport(accountsList.data);
		} else {
			allDataforExport(userListAll.data);
		}
	}, [userListAll, accountsList]);

	useEffect(() => {
		if (userTabs === "Purchases") {
			accountsAPIRequest(accountFilter);
		} else {
			setIsFiltering(true)
			accountsAPIRequest(userFilter);
		}
	}, [accountFilter, userFilter]);


	const allDataforExport = (userData) => {

		let data = [];
		userData && userData.forEach((user) => {
			if (userTabs === "Purchases") {
				data.push({
					"Account": user.companyName,
					"Company code": user.companyCode,
					"Industry": user.industryName,
					"No. of licenses": user.noOfLicenses + " purchased",
					"No. of available licenses": user.availableLicenses + " available",
					"Subscription": (user.subscription && user.subscription != null && user.subscription.length > 0) ? user.subscription[0].subscriptionName : "No data",
					"Renewal date": (user.subscription && user.subscription != null && user.subscription.length > 0) ? moment(user?.subscription[0]?.renewalDate).format('MMM DD, YYYY') : "No data",
					"Registration date": (user.subscription && user.subscription != null && user.subscription.length > 0) ? moment(user?.subscription[0]?.registrationDate).format('MMM DD, YYYY') : "No data",
					"Additional HRTemplate": (user.subscription && user.subscription != null && user.subscription.length > 0) ? user?.subscription[0]?.additionalHRTemplate : "No data",
					"HRTemplate discount": (user.subscription && user.subscription != null && user.subscription.length > 0) ? user?.subscription[0]?.hrTemplateDiscount : "No data",
					"Additional expert hour": (user.subscription && user.subscription != null && user.subscription.length > 0) ? user?.subscription[0]?.additionalExpertHour : "No data",
				});
			} else {
				data.push({
					Status: !user?.keyCloakUserId ? "Pending" : user.userProfile?.activationStatus ? user.userProfile?.activationStatus : "No Data",
					"First Name": user.userProfile?.firstName ? user.userProfile?.firstName : "No Data",
					"Last Name": user.userProfile?.lastName ? user.userProfile?.lastName : "no-data",
					"Preferred Name": user.userProfile?.preferredName ? user.userProfile?.preferredName : "No Data",
					Company: user.company?.companyName ? user.company?.companyName : "No Data",
					Industry: user.company?.industryName ? user.company?.industryName : "No Data",
					"Job Title": user.userProfile?.jobTitle ? user.userProfile?.jobTitle : "No Data",
					Role: user.roleName ? user.roleName : "No Data",
					Subscription: user.userProfile?.subscription?.subscriptionName ? user.userProfile?.subscription?.subscriptionName : "No Data",
					"Count of Licenses": user.userProfile?.subscription?.countOfLicenses ? user.userProfile?.subscription?.countOfLicenses : "No Count of Liscense",
					"First Login Date": user.createdAt ? moment(user.createdAt).format("MMM DD, YYYY") : "No Data",
					"Last Login Date": user.lastLogin ? moment(user.lastLogin).format("MMM DD, YYYY") : "No Data",
					"Expiration Date": user.userProfile?.subscription?.expirationDate ? moment(user.userProfile?.subscription?.expirationDate).format("MMM DD, YYYY") : "No Data",
					"Expert Hours Available": user.userProfile?.subscription?.expertHoursAvailable ? user.userProfile?.subscription?.expertHoursAvailable : "No Hours Availabe",
					"Expert Hours Used": user.userProfile?.subscription?.expertHoursUsed ? user.userProfile?.subscription?.expertHoursUsed : "No Hours Used",
					"Number of Countries Favorited": user.userProfile?.subscription?.numberOfCountriesFavorited ? user.userProfile?.subscription?.numberOfCountriesFavorited : "No Favorite Country",
					" ": " "
				});
			}
		});


		setExportUserData({ ...exportUserData, userExportData: data, fileName: userTabs });
	}
	return (

		<div className="container-fluid">
			<div className="col-12">
				<div className="title-action-wrap purchase-main">
					<div className="row">
						<div className="col-md-4 pl-0 header-label-section">
							<h3
								className="gutter-manag-user"
								data-tip="Manage user"
							>
								<div className="segment">
									<div className={!permissionArray?.includes(constants.PERMISSION_MAPPING.ACCESS_AND_DOWNLOAD_PAST_PURCHASE) ? "accounts disable-purchase" : userTabs === 'Purchases' ? "accounts active" : "accounts"} onClick={permissionArray?.includes(constants.PERMISSION_MAPPING.ACCESS_AND_DOWNLOAD_PAST_PURCHASE) ?
										() => {
											setUserFilter({
												roles: [],
												showUsersStatusBy: [],
											})
											setUserTabs('Purchases')

										} : ""

									}>Purchases</div>
									<div className={(!permissionArray?.includes(constants.PERMISSION_MAPPING.SUBMIT_QUERY) &&
										!permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_MY_ACCOUNT_QUERIES)) ? "users disable-brief" : userTabs === 'Expert-Briefs' ? "users active" : "users"} data-testid="tab-button1" onClick={
											(permissionArray?.includes(constants.PERMISSION_MAPPING.SUBMIT_QUERY) ||
												permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_MY_ACCOUNT_QUERIES)) ? () => {
													setUserFilter({
														roles: [],
														showUsersStatusBy: [],
													})
													setUserTabs('Expert-Briefs')

												} : ""}>Expert Briefs</div>
								</div>
							</h3>
						</div>{userTabs === 'Expert-Briefs' && (permissionArray?.includes(constants.PERMISSION_MAPPING.SUBMIT_QUERY) ||
							permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_MY_ACCOUNT_QUERIES)) ?
							<button className="primary-button"
								onClick={() => {history.push(constants.ROUTE.BUY_MORE_HOURS.REVIEW_PAYMENT)
									mixpanel.track('Buy More Hours', {
										'User Details':userDetailsMixpnel()
									  })
								}}
							>Buy More Hours</button> : ""}
					</div>
				</div>
			</div>
		</div >
	);
};

export default PurchaseHeader;
