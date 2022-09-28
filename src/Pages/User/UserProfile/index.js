import React, { useState, useEffect } from "react";

import { connect, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { useHistory } from "react-router-dom";
import jwt_decode from "jwt-decode";

import constants from "../../../utils/constants";
import { storeUserProfile } from "../../../utils/storage/index";
import { getKeyClockToken_Data } from "../../../utils/storage/index";
import { setAboutYou } from "../../../Store/reducers/user";
import {
	callUpdateUserProfileAPI,
	callUploadProfilePicAPI,
	callgetIndustryList,
	callgetCompanyList,
	callgetPrimaryUser,
} from "../../../Actions/UserProfileAction";
import {
	callDeleteProfilePic,
} from "../../../Store/reducers/myAccount";
import CustomeDropDown from "../../../Components/CustomeDropDown/CustomeDropDown";
import TextFieldComponent from "../../../Components/TextFieldComponent/TextFieldComponent";

import Loader from "../../../Components/Loader";
import { permissionMapping } from "../../../utils/utils";
import mixpanel from 'mixpanel-browser';
import {userDetailsMixpnel} from '../../../utils/utils'
mixpanel.init(constants.MIXPANEL_TOKEN);
const UserProfile = (props) => {
	const history = useHistory();
	const dispatch = useDispatch();
	const profilePicError = useSelector((state) => state.myAccountReducer.profilePicError);
	const profilePicDeleted = useSelector((state) => state.myAccountReducer.profilePicDeleted);
	const hiddenFileInput = React.useRef(null);
	const [showErr, setError] = useState("");
	const [isError, setIsError] = useState({});
	const [loading, setLoading] = useState(false);
	const [isFocus, setIsFocus] = useState({});
	const [termAgree, setTermsAgree] = useState([]);
	// const [isPrimaryUser, setPrimaryUserKey] = useState("");
	const [industryList, setIndustryName] = useState([]);
	const [companyList, setCompanyName] = useState([]);
	// const [roleName, setRoleName] = useState()
	const [initialValues, setInitialValues] = useState(JSON.parse(localStorage.getItem("userProfileDetails")));
	const [requestParams, setRequestParams] = useState(initialValues?.requestParams);
	const [ImageUrl, setImageURL] = useState(JSON.parse(localStorage.getItem("user-profile"))?.imageUrl);
	const permissionArray = permissionMapping();
	const keyclockData = getKeyClockToken_Data();
    const token_data = keyclockData ? jwt_decode(keyclockData) : undefined;

	useEffect(() => {
		getIndustryList();
		getCountryList();
	}, []);

	useEffect(() => {
		const user_Info = JSON.parse(localStorage.getItem("userProfileDetails"));
		if (user_Info) {
			user_Info.emailId = initialValues.emailId;
			user_Info.companyName = initialValues.companyName;
			user_Info.jobTitle = initialValues.jobTitle;
			user_Info.ImageUrl = ImageUrl;
			user_Info.firstName = initialValues.firstName;
			user_Info.lastName = initialValues.lastName;
			user_Info.preferredName = initialValues.preferredName;

			localStorage.setItem("userProfileDetails", JSON.stringify(user_Info));
		}
	}, [initialValues]);


	useEffect(() => {
		if (profilePicError && profilePicError.length) {
			props.notify(profilePicError);
		} else if (profilePicDeleted && profilePicDeleted === 200) {
			props.notify("Profile Image Deleted");
			setInitialValues({
				...initialValues,
			});
			setImageURL("");
			dispatch(callDeleteProfilePic({ success: true }));
		}
	}, [profilePicError, profilePicDeleted]);


	const handleChangeValue = (e) => {
		setInitialValues({
			...initialValues,
			[e.target.name]: e.target.value,
		});
		setIsError({ ...isError, [e.target.name]: "" });
	};

	const validate = (values) => {
		let errors = {};
		return errors;
	};

	const handleFocus = (e) => {
		const validation = validate(initialValues);
		setIsError(validation);
		setIsFocus({ ...isFocus, [e.target.name]: true });
	};
	const getPrimaryUser = (companyID) => {
		props
			.callgetPrimaryUserAction(companyID)
			.then((res) => { })
			.catch((error) => {
				console.log(error);
			});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const validation = validate(initialValues);
		setIsError(validation);
		setRequestParams({
			...requestParams,
			emailId: initialValues.emailId,
			companyName: initialValues.companyName,
			jobTitle: initialValues.jobTitle,
			ImageUrl: ImageUrl,
			firstName: initialValues.firstName,
			lastName: initialValues.lastName,
			preferredName: initialValues.preferredName,
		});
		handleUpdateProfile(initialValues.isPrimaryUser);
	};
	const handleUpdateProfile = (isPrimaryUser) => {
		setLoading(true);
		props
			.callUpdateUserProfileAPIAction(initialValues?.id, {
				...requestParams,
				...initialValues,
			})
			.then((res) => {
				const { data: { data: { company, isAccountOwner, isPrimaryUser, isAdmin, roleName } } } = res;
				
				let newDataProfile = res.data.data.userProfile;
				newDataProfile.roleName = res.data.data.roleName;

				newDataProfile.imageUrl = ImageUrl;
				newDataProfile.company = company;
				newDataProfile.isAccountOwner = isAccountOwner;
				newDataProfile.isAdmin = isAdmin;
				newDataProfile.isPrimaryUser = isPrimaryUser;
				newDataProfile.isAdUser = token_data?.aud?.includes("broker") || false;
				storeUserProfile(res.data.data.userProfile ? newDataProfile : {});

				// Giving access to AD user for the country selection (EGS General)
				if (permissionArray?.includes(constants.PERMISSION_MAPPING.FAVORITE_COUNTRIES)) {
					history.push(constants.ROUTE.COUNTRY.COUNTRY);
					props.notify("Profile Updated Successfully", 5000);
				} else if (permissionArray?.includes(constants.PERMISSION_MAPPING.ADDING_EMPLOYEE_COUNTS)) {
					history.push(constants.ROUTE.REGISTRATION_FLOW.EMPLOYEE_INFORMATION);
					props.notify("Profile Updated Successfully", 5000);
				} else {
					getPrimaryUser(res?.data?.data?.companyId);
					sessionStorage.setItem("showTutorial", true);
					history.push(constants.ROUTE.HOME_PAGE.HOME);
					dispatch(setAboutYou(true));
				}

				setLoading(false);
				dispatch(setAboutYou(true));
				mixpanel.track('Registered', {
					'First Name':res.data.data.userProfile.firstName, 
					'Last Name': res.data.data.userProfile.lastName,
					'Email': res.data.data.emailId,
					'Prefered Name':res.data.data.userProfile.preferredName,
					'Company Name':res.data.data.userProfile.company.companyName,
					'Job Title':res.data.data.userProfile.jobTitle,
					'Industry':res.data.data.userProfile.company.industryName,
					'User Details':userDetailsMixpnel()})
			})
			.catch((error) => {
				if (error?.response?.data?.errors) {
					const m = error.response.data.errors;
					const message = m.join(",");
					props.notify(message, 5000);
				}
				setLoading(false);
			});
	};

	const handleChange = (event) => {
		const data = new FormData();
		data.append("file", event.target.files[0]);
		props
			.callUploadProfilePicAPIAction(data)
			.then((response) => {
				setImageURL(response.data.data.id);
				setInitialValues({
					...initialValues,
					imageUrl: response.data.data.id,
				});
				props.notify(response.data.message, 5000);
			})
			.catch((errors) => {
				props.notify("Error! Failed to upload", 4000);
			});
	};
	const handleClick = (event) => {
		hiddenFileInput.current.click();
	};

	const getIndustryList = () => {
		props
			.callgetIndustryListAction()
			.then((res) => {
				setIndustryName(
					res.data.data && res.data.data.length
						? res.data.data.map((x) => {
							return {
								...x,
								id: x.id,
								value: x.industryName,
							};
						})
						: []
				);
			})
			.catch((error) => { });
	};
	const getCountryList = () => {
		props
			.callgetCompanyListAction()
			.then((res) => {
				setCompanyName(
					res.data.data.data && res.data.data.data.length
						? res.data.data.data.map((x) => {
							return {
								...x,
								id: x.id,
								value: x.companyName,
							};
						})
						: []
				);
			})
			.catch((error) => { setLoading(false); });
	};

	const updateIndustryDropdown = (id) => {
		let value = industryList.filter((x) => x.id == id);
		setInitialValues({
			...initialValues,
			industryName: value[0].value,
		});
	};

	const updateCompanyDropdown = (id) => {
		let value = companyList.filter((x) => x.id == id);
		setInitialValues({
			...initialValues,
			companyName: value[0].value,
		});
	};

	const deleteProfilePic = async () => {
		let image = ImageUrl;
		await dispatch(callDeleteProfilePic({ image }));
	};

	const navigateTo = (type) => {
		if (type) {
			window.open('https://expandopedia.com/terms-and-conditions/', '_blank');
		} else {
			window.open('https://expandopedia.com/privacy-policy/', '_blank');
		}
	}

	const checkAgree = (e, name) => {
		let _agreeItems = [...termAgree];
		if (e.target.checked) {
			_agreeItems.push(name)
		} else {
			_agreeItems = _agreeItems.filter((x) => x !== name);
		}
		setTermsAgree(_agreeItems);
	}

	// if (loading)
	// 	return (
	// 		<div className="white-overlay">
	// 			<div className="msg-wrapper-loader">
	// 				<Loader />
	// 			</div>
	// 		</div>
	// 	);
	// else
	
	return (
		<div data-test="userProfile-page" className="userProfile-page loader-enable">
			{
				loading &&
				(<div className="custom-loader">
					<Loader />
				</div>)
			}
			<div className="container">
				<div className="row justify-content-center mt-3">
					<div className="col-8">
						<div className="col-12">
							<div className="row">
								<div className="header-section">
									<h2 className="welcome-name">
										Welcome,{" "}
										{initialValues?.firstName
											? initialValues?.firstName
											: "Guest"}
										!{" "}
									</h2>
									<h2>
										You’re steps away from getting
										started. Let’s begin!
									</h2>
								</div>
							</div>
							<div className="row">
								<div className="form">
									<div className="row">
										<div className="col-4">
											<div className="floating">
												<TextFieldComponent
													id="firstName"
													label="First name*"
													data-test="firstName"
													dataContent="First name*"
													type="text"
													placeholder="First name*"
													name="firstName"
													value={
														initialValues?.firstName
													}
													onBlur={handleFocus}
													onChange={
														handleChangeValue
													}
												/>
											</div>
										</div>
										<div className="col-4">
											<div className="floating">
												<TextFieldComponent
													id="lastName"
													label="Last Name*"
													data-test="lastName"
													dataContent="Last Name*"
													type="text"
													placeholder="Last Name*"
													name="lastName"
													value={
														initialValues?.lastName
													}
													onBlur={handleFocus}
													onChange={
														handleChangeValue
													}
												/>
											</div>
										</div>
										<div className="col-4">
											<div className="floating">
												<TextFieldComponent
													id="preferredName"
													label="Preferred Name*"
													data-test="preferredName*"
													dataContent="Preferred Name*"
													type="text"
													placeholder="Preferred Name*"
													name="preferredName"
													value={
														initialValues?.preferredName
													}
													onBlur={handleFocus}
													onChange={
														handleChangeValue
													}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-12 px-0">
									<div className="row">
										<div className="col-6">
											<div className="floating">
												<TextFieldComponent
													id="input__password"
													label="Email Address*"
													data-test="input__password"
													dataContent="Email Address*"
													type="email"
													name="emailId"
													placeholder="Email Address*"
													value={
														initialValues?.emailId
													}
													onBlur={handleFocus}
													onChange={
														handleChangeValue
													}
												/>
											</div>
										</div>
										<div className="col-6">
											<div className="floating">
												<TextFieldComponent
													id="Job_Title"
													label="Job Title"
													data-test="Job_Title"
													dataContent="Job Title"
													type="text"
													name="jobTitle"
													placeholder="Job Title"
													value={
														initialValues?.jobTitle
													}
													onBlur={handleFocus}
													onChange={
														handleChangeValue
													}
												/>
											</div>
										</div>
									</div>
									<div className="col-12 px-0">
										<div className="row">
											<div className="col-6">
												<div className="floating position-relative">
													<CustomeDropDown
														className="form-control ld_form-ctrl custome-dropdown"
														data={
															companyList
														}
														placeholder="Company Name*"
														value={
															initialValues?.companyName
														}
														onSelect={
															updateCompanyDropdown
														}
													/>
													<span className="dropdown_btn_label">
														Company Name*
													</span>
												</div>
											</div>
											<div className="col-6">
												<div className="floating">
													<CustomeDropDown
														className="form-control ld_form-ctrl custome-dropdown"
														data={
															industryList
														}
														placeholder="Industry*"
														value={
															initialValues?.industryName
														}
														onSelect={
															updateIndustryDropdown
														}
													/>
													<span className="dropdown_btn_label">
														Industry*
													</span>
												</div>
											</div>
										</div>
									</div>

									<div className="role-assigned">
										You are assigned the role of{" "}
										<div className="role-text-color">{initialValues?.roleName}.</div>{" "}
									</div>

									<div>
										<div className="floating">
											<div className="profile-info">
												<div className="profile-picture">
													{ImageUrl ? (
														<img
															src={
																ImageUrl
																	? `${constants.API.COUNTRY.GET_FLAG_DOWNLOAD}${ImageUrl} `
																	: ""
															}
															className="profile-picture"
														/>
													) : (
														""
													)}
													<input
														type="file"
														style={{
															display:
																"none",
														}}
														ref={hiddenFileInput}
														accept=".png, .jpg, .jpeg, .gif, .svg"
														onChange={handleChange}

													/>
													<a
														onClick={ImageUrl ? deleteProfilePic : handleClick}
														className="registration-img-txt">
														{ImageUrl ? "Remove" : "Upload Image"}
													</a>
												</div>
												<a
													
													type="button"
													className={ImageUrl ? "btn btn-secondary btn-upload ml-5" : "disabled btn btn-secondary btn-upload-grey ml-5"}
													onClick={handleClick}
												>
													Change
												</a>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="col-8 footer-section">
						<div className="action-wrap col-12">
							<div className="row">
								<div className="col-8">
									<div className="link-section">
										<input type="checkbox" onClick={(e) => checkAgree(e, 'term')} />
										<span>I agree to the <span className="terms-link" onClick={() => navigateTo(true)}>Terms and Conditions</span></span>
									</div>
									<div className="link-section">
										<input type="checkbox" onClick={(e) => checkAgree(e, 'policy')} />
										<span>I agree to <span className="terms-link" onClick={() => navigateTo()}>Elements Global Services’ Privacy Policy</span></span>
									</div>
								</div>
								<div className="col-4">
									<div className="row align-items-center justify-content-end">
										{(permissionArray?.includes(constants.PERMISSION_MAPPING.FAVORITE_COUNTRIES) ||
											permissionArray?.includes(constants.PERMISSION_MAPPING.ADDING_EMPLOYEE_COUNTS)) ? (
											<div>
												<button
													disabled={!(termAgree.length === 2)}
													type="button"
													onClick={handleSubmit}
													className="btn btn-primary mt-0 skip-btn "
												>
													Next
													<i className="ph-arrow-right" />
												</button>
											</div>
										) : (
											<div>
												<button
													disabled={!(termAgree.length === 2)}
													type="button"
													onClick={handleSubmit}
													className="btn btn-primary mt-0 skip-btn"
												>
													Finish
													<i className="ph-arrow-right" />
												</button>
											</div>
										)}
									</div>
								</div>
							</div>

						</div>
					</div>
				</div>
			</div>
		</div>
	)
};

const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			callUpdateUserProfileAPIAction: callUpdateUserProfileAPI,
			callUploadProfilePicAPIAction: callUploadProfilePicAPI,
			callgetIndustryListAction: callgetIndustryList,
			callgetCompanyListAction: callgetCompanyList,
			callgetPrimaryUserAction: callgetPrimaryUser,
		},
		dispatch
	);

export default connect(null, mapDispatchToProps)(UserProfile);
