import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { bindActionCreators } from "redux";

import {
	callAddCountryAPI,
	callgetCountryListAPI,
	callgetFavouriteCountryAPI,
	callgetRegionListAPI,
	callgetSpecificRegionListAPI,
	callgetUserCountryDetails,
} from "../../Actions/CountryAction";

import {
	getCompanyInfo,
} from "../../Store/reducers/superAdminUser";
import {
	callSubscriptionDataById,
} from "../../Store/reducers/subscription";

import { CustomeNotification } from "../../Components/CustomeNotification/CustomeNotification";
import constants from "../../utils/constants";
import { getUserProfile, storeCountryData } from "../../utils/storage";
import MySelect from "../../Components/MultiselectDropDown/MySelect";
import { setCountrySelection } from "../../Store/reducers/user";
import ImageRender from "../Settings/imageRender";
import Checkbox from "../../Components/Inputs/Checkbox";
import Loader from "../../Components/Loader";
import { permissionMapping } from "../../utils/utils";


/* Icons */
import Pin_active from "../../assets/images/Vector-active.svg";
import Pin from "../../assets/images/Vector.svg";
import watermarkImg from "../../assets/images/placeholder-img.svg";

const Country = (props) => {
	const [countryList, setCountryList] = useState([]);
	const [updateCountryList, setUpdateCountryList] = useState([]);
	const [_countryList, set_CountryList] = useState([]);
	const [search_Data, searchData] = useState([]);
	const [loading, Loading] = useState(false);
	const [loadingFav, setLoadingFav] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const [regionList, setRegionList] = useState([]);
	const [favouriteList, setFavourite] = useState([]);
	const [companyFavToMine, setCompanyFavToMine] = useState(false);
	const [companyLicenceLimit, setCompanyLicenceLimit] = useState(false);
	const [allCountrySubscription, setAllCountrySubscription] = useState(false);
	const [isUserLimited, setIsUserLimited] = useState(false);
	const [countryId, setCountryId] = useState("");
	const [userData, setUserData] = useState(JSON.parse(localStorage.getItem(constants.STORAGE.AUTH.USER_PORFILE)));
	const [companiesCountry, setCompaniesCountry] = useState([]);
	const [searchItem, setSearchItem] = useState("");
	const [userID, setUserId] = useState("");
	const [companyInfo, setCompanyInfo] = useState({
		selectedCompanies: [],
		selectLimit: null
	});
	const [mapData, setMapData] = useState([]);
	const history = useHistory();
	const [selectedRegion, setSelectedRegion] = useState(localStorage.getItem("regionId") ? JSON.parse(localStorage.getItem("regionId")) : []);
	const permissionArray = permissionMapping();

	const { companyInfoById, companyInfoLoading } = useSelector((state) => state.superAdminUserReducer);

	const dispatch = useDispatch();
	useEffect(async () => {
		var user_data = getUserProfile();
		if (user_data?.userId && user_data?.userId != '') setUserId(user_data?.userId);
		if (user_data?.userId && user_data?.userId != '') {
			getUserCountryDetails(user_data?.userId);
			if (user_data?.company?.id) dispatch(getCompanyInfo({ id: user_data?.company?.id }));
			setUserData(user_data);
		}
		if (selectedRegion.length > 0) {
			getRegionCountryList()
		} else {
			getCountryList();

		}
		getRegionList();
		getFavouriteCountryList(user_data?.userId);
	}, []);

	const getRegionCountryList = () => {
		const regionListArray = JSON.parse(localStorage.getItem("regionId"));
		if (regionListArray?.length > 0) {
			let regionID = [];
			regionID = regionListArray.map((contryItem) => contryItem.id);
			callRegionListAPI(regionID)
		}

	}

	useEffect(async () => {
		if (companyInfoById?.subscription != null && companyInfoById?.subscription?.length > 0 &&
			companyInfoById?.subscription[0].isAllCountrySubscription === false) {
			let res = await callSubscriptionDataById(companyInfoById.subscription[0].subscriptionId);
			if (res && res.data?.length > 0) {
				const _features = res.data[0].features || [];
				// '13', 'Access to data for all countries'
				// '26', 'Access to data for fixed number of countries
				const isLimited = _features.find((_f) => _f.id === 26);
				if (isLimited && isLimited?.attributes.length > 0) {
					if (isLimited?.attributes[0].isSelected) {
						if (userData?.isAccountOwner && Number(isLimited?.attributes[0].value) > 0) {
							setCompanyLicenceLimit(Number(isLimited?.attributes[0].value));
							setIsUserLimited(true);
						} else if (!userData?.isAccountOwner) {
							setIsUserLimited(true);
						}
					}
				}
			}
		} else {
			if (companyInfoById?.subscription != null && companyInfoById?.subscription?.length > 0 &&
				companyInfoById?.subscription[0].isAllCountrySubscription) {
				setAllCountrySubscription(true);
			}
		}
	}, [companyInfoById, companyInfoLoading]);

	useEffect(() => {
		if (updateCountryList.length > 0) {
			const favList = [];
			const unFavList = [];
			updateCountryList.forEach((item) => {
				if (mapData.length > 0) {
					if (mapData.includes(item.id)) {
						favList.push(item);
					} else {
						unFavList.push(item);
					}
				} else {
					unFavList.push(item);
				}
			});

			set_CountryList([...favList, ...unFavList])
		}
	}, [mapData, updateCountryList])

	const getCountryList = () => {
		Loading(true);
		props
			.callgetCountryListAPIAction()
			.then((response) => {
				searchData(response.data.data);
				setCountryList(response.data.data);
				setUpdateCountryList(response.data.data);
				setCountryId(response.data.data[0].id);
				let FlagData = [];
				response.data.data.forEach((item, index) => {
					FlagData[item.id] = item;
				});
				Loading(false);
			})
			.catch((errors) => { Loading(false); });
	};

	const getRegionList = () => {
		props
			.callgetRegionListAPIAction()
			.then((response) => {
				setRegionList(response.data.data);
			})
			.catch((errors) => { });
	};

	const handleClick = (id) => {
		setSelectedRegion(id);
		Loading(true);

		let regionID = [];
		if (id && id.length) {
			regionID = id.map((contryItem) => contryItem.id);
		}
		callRegionListAPI(regionID)

	};
	const callRegionListAPI = (regionID) => {
		props
			.callgetCountryListAPIAction(regionID)
			.then((response) => {
				searchData(response.data.data);
				setCountryList(response.data.data);
				setUpdateCountryList(response.data.data);
				setCountryId(response.data.data[0].id);
				Loading(false);
			})
			.catch((error) => {
				if (error?.response?.data?.errors) {
					let result = error.response.data
						? error.response.data.errors
							? error.response.data.errors
							: ""
						: "";
					if (result != "") {
						props.notify(error.response.data.errors);
					}
				}
				Loading(false);
			});
	}


	const getUserCountryDetails = (userID) => {
		setLoadingFav(true);
		props
			.callgetUserCountryDetailsAction(userID)
			.then((response) => {
				let ids = [], companyFavIds = [];
				response?.data?.data.forEach((item) => {
					if (item.isUserFavourite && !ids.includes(item.id)) {
						ids.push(item.id)
					}
					if (item.isCompanyFavourite) {
						companyFavIds.push(item.id);
					}
				});
				setMapData(ids);
				if (!userData?.isAccountOwner && !userData?.isAdUser) {
					setMapData(companyFavIds);
					setCompaniesCountry(companyFavIds);
				}

				setLoadingFav(false);
			})
			.catch((errors) => { setLoadingFav(false); });
	};

	const handleSubmit = () => {
		localStorage.setItem("regionId", JSON.stringify(selectedRegion))
		const mappedData = [];
		for (let index = 0; index < mapData.length; index++) {
			if (!mappedData.includes(mapData[index])) {
				mappedData.push(mapData[index])
			}
		}

		if (mappedData.length === 0) {
			props.notify('Company favorites are empty, So Please choose at least one country!', 3000);
			return;
		}

		if (companyLicenceLimit != false && mappedData.length !== companyLicenceLimit) {
			if (companyLicenceLimit - mappedData.length < 0) {
				props.notify(`You have ${companyLicenceLimit} Country limit, So please remove ${mappedData.length - companyLicenceLimit} countries!`, 5000);
			} else {
				props.notify(`You have ${companyLicenceLimit} Country limit, So please choose rest of ${companyLicenceLimit - mappedData.length} countries!`, 5000);
			}

			Loading(false);
			return;
		}

		setSubmitLoading(true);
		let countryId = mappedData.toString();
		// if (mappedData && mappedData.length) {
		props
			.callAddCountryAPIAction({ userid: userID, countryId })
			.then((response) => {
				props.notify("Country Added to Favourite List");
				dispatch(setCountrySelection(true));
				storeCountryData(
					userID,
					countryList.filter((x) => x.isMap)
				);

				if (permissionArray?.includes(constants.PERMISSION_MAPPING.ADDING_EMPLOYEE_COUNTS)) {
					history.push(constants.ROUTE.REGISTRATION_FLOW.EMPLOYEE_INFORMATION);
				} else if (permissionArray?.includes(constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER)) {
					history.push(constants.ROUTE.USER.ADD_USER);
				} else {
					sessionStorage.setItem("showTutorial", true);
					history.push(constants.ROUTE.HOME_PAGE.HOME);
				}

				setSubmitLoading(false);
			})
			.catch((error) => {
				if (error?.response?.data?.errors) {
					let result = error.response.data
						? error.response.data.errors
						: "";
					if (result != "") {
						props.notify(error.response.data.errors);
					}
				}
				setSubmitLoading(false);
			});
	};

	const getFavouriteCountryList = (UserID) => {
		props
			.callgetFavouriteCountryAPIAction(UserID)
			.then((response) => {
				let favouriteData = {};
				response.data.data.employeeCountryCount.forEach((item) => {
					favouriteData[item.countryID] = item;
				});

				setFavourite(favouriteData);
			})
			.catch((errors) => { });
	};

	const handleSearch = (e) => {
		const searchValue1 = e.target.value;
		const searchValueTrim = searchValue1.trim();
		const searchValue = searchValueTrim.toLowerCase();
		const updateValue = countryList.filter((item) => item.country_Name.toLowerCase().indexOf(searchValue) > -1);

		setSearchItem(e.target.value);
		setUpdateCountryList(updateValue);
	};

	const handleChangeMap = (id) => {
		if (!userData?.isAccountOwner && !allCountrySubscription) {
			return;
		}
		let tempData = [...mapData];
		Loading(true);

		if (tempData.includes(id)) {
			tempData = tempData.filter(x => x !== id);
		} else {
			tempData.push(id);
		}

		if (companyLicenceLimit != false && companyLicenceLimit < tempData.length) {
			props.notify('Company Subscription limit reached!');
			Loading(false);
			return;
		}

		setMapData(tempData);
		let tempData1 = [...updateCountryList];
		let tempData1Contry = [...countryList];
		let index = tempData1.findIndex((item) => item.id === id);
		let indexContry = tempData1.findIndex((item) => item.id === id);
		tempData1Contry[indexContry] = {
			...tempData1Contry[indexContry],
			isMap: tempData1[indexContry].isMap ? false : true,
		};
		tempData1[index] = {
			...tempData1[index],
			isMap: tempData1[index].isMap ? false : true,
		};
		setUpdateCountryList(tempData1);
		setCountryList(tempData1Contry);
		Loading(false);
	};

	const updateCountries = (type) => {
		const mappedData = type ? [...mapData] : [];
		if (type) {
			for (let index = 0; index < companiesCountry.length; index++) {
				const element = companiesCountry[index];
				if (!mapData.includes(element)) {
					if (!mappedData.includes(element)) mappedData.push(element);
				}
			}
		} else {
			for (let index = 0; index < mapData.length; index++) {
				const element = mapData[index];
				if (!companiesCountry.includes(element)) {
					mappedData.push(...mapData);
				}
			}
		}

		setCompanyFavToMine(type);
		setMapData(mappedData);
	};
			
	console.log("user_data",userData);
	console.log("khaleel",getUserProfile());
	return (
		<div className="container loader-enable" data-test="Country">
			{
				submitLoading &&
				(<div className="custom-loader">
					<Loader />
				</div>)
			}
			<div className="row justify-content-center mt-3">
				<div className="col-8">
					<div className="row">
						<div className="col-6">
							<Link
								to={constants.ROUTE.USER.USER_PROFILE}
								className="back-btn"
							>
								Previous Step
							</Link>
						</div>
					</div>
					<div className="col-12">
						<div className="row">
							<div className="header-section">
								<h2>
									Select countries your company has operations
									in or is interested in.
								</h2>
								<h4>
									You will see these countries/states on your
									Home Page every time you log in.
								</h4>
							</div>
						</div>
						<div className="row mb-4 mt-4">
							<div className="col-6 p-0">
								<div className="search-wrap">
									<input
										type="text"
										className="form-control"
										placeholder="Search By Country or US state"
										value={searchItem}
										disabled={userData?.loggedInUserIs === "AccountHolder"}
										onChange={handleSearch}
										disabled={!userData?.isAccountOwner && !allCountrySubscription}
									/>
									<a href="#">
										<i className="ph-magnifying-glass" />
									</a>
								</div>
							</div>

							<div className="col-6 p-0">
								<div className="country_dropdown">
									<MySelect
										data={regionList}
										labelKey="region_Name"
										placeholder="Find countries by region"
										valueKey="id"
										disabled={userData?.loggedInUserIs === "AccountHolder"}
										value={selectedRegion}
										updateDropdown={handleClick}
										disabled={!userData?.isAccountOwner && !allCountrySubscription}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="col-12">
						<>
							{
								!userData?.isAccountOwner && allCountrySubscription && !userData?.isAdUser &&
								<div className="company-fav-tu-user-fav">
									<Checkbox
										checked={companyFavToMine}
										className="check-label"
										checkboxClass="check-box"
										onChange={(event) => {
											updateCountries(event.target.checked);
										}}
										data-test="check"
									>
									</Checkbox>
									<span className="company-fav-lbl">Add all company favorites to my favorites.</span>
								</div>
							}
							<div className="row">
								<div className="country-wrapper col-12 custom-scroll">
									{
										(loading || loadingFav) ?
											(<div className="custom-loader-no-bg">
												<Loader />
											</div>) : (<>

												<>{_countryList.map((item, index) => {
													const favouriteCountry =
														favouriteList[item.id];

													// We have to show only company fav
													if (isUserLimited && (!userData?.isAccountOwner && !allCountrySubscription) && !companiesCountry.includes(item.id) && !item.isUserFavourite) {
														return null;
													}

													return (
														<div className="row" key={index}>
															<div className="country-list country-list-registration">
																<a
																	className="cursor-pointer"
																	onClick={() => handleChangeMap(item.id)}
																>
																	<span className="country-list-active">
																		{item.country_Name}
																	</span>
																</a>
																<div
																	className={`flag cursor-pointer ${(item.flag_Upload_Id === "" || item.flag_Upload_Id === null) && "no-flag-country"}`}
																	onClick={() => handleChangeMap(item.id)}
																>
																	<img
																		src={item.flag_Upload_Id != "" && item.flag_Upload_Id != null ?
																			constants.API.COUNTRY.GET_FLAG_DOWNLOAD + item.flag_Upload_Id : watermarkImg}
																	/>
																</div>

																<div className="navigation">
																	<div
																		onClick={() => handleChangeMap(item.id)}
																		className="cursor-pointer"
																	>
																		{mapData.includes(
																			item.id
																		) ? (
																			<img src={Pin_active} />
																		) : (
																			<img src={Pin} />
																		)}
																		{/* {favouriteCountry &&
																			favouriteCountry.employeeCount >
																				0 ? (
																				<i className="ph-push-pin" />
																			) : (
																				<i className="ph-push-pin" />
																			)} */}
																	</div>
																	<div className="company-favourite">
																		{
																			companiesCountry.includes(item.id) && (
																				<span>Company Favorite!</span>
																			)
																		}
																	</div>
																</div>
															</div>
														</div>
													)
												})}</>
											</>
											)
									}
								</div>
							</div>
						</>
					</div>
					<div className="col-12">
						<div className="action-wrap">
							<div className="row align-items-center justify-content-between">
								<div>
									{
										(userData?.isAccountOwner || userData?.isAdUser) &&
										<Link
											to={constants.ROUTE.LOCATION.LOCATION}
											className={`skipbtn ${(userData?.isAccountOwner || userData?.isAdUser) && "disabled"} `}
										>
											Skip for now
										</Link>
									}
								</div>
								<div>
									<button
										type="button"
										disabled={companyFavToMine === true ? false : mapData.length < 1}
										className="btn btn-primary mt-0 skip-btn"
										onClick={handleSubmit}
									>
										{(permissionArray?.includes(constants.PERMISSION_MAPPING.ADDING_EMPLOYEE_COUNTS) ||
											permissionArray?.includes(constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER)) ? "Next" : "Finish"}
										<i className="ph-arrow-right" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

const mapStateToProps = (state) => {
	return {
		timeline: state.timeline,
	};
};
const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			callgetCountryListAPIAction: callgetCountryListAPI,
			callgetRegionListAPIAction: callgetRegionListAPI,
			callgetSpecificRegionListAPIAction: callgetSpecificRegionListAPI,
			callgetFavouriteCountryAPIAction: callgetFavouriteCountryAPI,
			callAddCountryAPIAction: callAddCountryAPI,
			callgetUserCountryDetailsAction: callgetUserCountryDetails,
		},
		dispatch
	);

export default connect(mapStateToProps, mapDispatchToProps)(Country);
