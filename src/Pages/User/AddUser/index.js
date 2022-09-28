import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import constants from "../../../utils/constants";
import { connect, useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import {
	callAddCoworkers,
	callDeleteUserAPI,
	callgetCoworkersList,
	callgetUserByKeyClockId,
} from "../../../Actions/AddUserAction";
import {
	getCompanyInfo,
} from "../../../Store/reducers/superAdminUser";

import { CustomeNotification } from "../../../Components/CustomeNotification/CustomeNotification";
import {
	getKeyClockToken_Data,
	storeKeyClockUserId,
	getUserProfile
} from "../../../utils/storage/index";
import jwt_decode from "jwt-decode";
import TextFieldComponent from "../../../Components/TextFieldComponent/TextFieldComponent";
import { callgetPrimaryUser } from "../../../Actions/UserProfileAction";
import { setAddUser } from "../../../Store/reducers/user";
import ComingSoon from "../../../Components/ComingSoon";
import { permissionMapping } from "../../../utils/utils";

const AddUser = (props) => {
	const history = useHistory();
	const permissionArray = permissionMapping();
	const [loggedInUserId, setloggedInUserId] = useState("");
	const [companyID, setCompanyID] = useState("");
	const [id, setID] = useState("");
	const [userData, setUserData] = useState(JSON.parse(localStorage.getItem(constants.STORAGE.AUTH.USER_PORFILE)));
	const [coWorkerEmail, setcoWorkerEmail] = useState([]);
	const [coWorkerLength, setcoWorkerLength] = useState();
	const [licenceCount, setLicenceCount] = useState(0);
	const [isChecked, setIsChecked] = useState(false);
	const [isCheckedDoc, setIsCheckedDoc] = useState(false);
	const [isDisabledFlag, setIsDisabledFlag] = useState(false);
	const [isError, setIsError] = useState({});
	const [isFocus, setIsFocus] = useState({});
	const [initialValues, setInitialValues] = useState({
		FirstName: "",
		emailid: "",
		LastName: "",
	});

	const dispatch = useDispatch();
	const { companyInfoById, companyInfoLoading } = useSelector((state) => state.superAdminUserReducer);

	useEffect(() => {
		var token_data = getKeyClockToken_Data();
		var newData = token_data ? jwt_decode(token_data) : "";
		var id = newData ? (newData.sub ? newData.sub : "") : "";
		setID(id);
		getUserByKeyClock(id);
		loadCompany();

	}, []);

	const loadCompany = () => {
		var user_data = getUserProfile();
		if (user_data?.userId && user_data?.userId != '') {
			if (user_data?.company?.id) dispatch(getCompanyInfo({ id: user_data?.company?.id }));
			setUserData(user_data);
		}
	}

	useEffect(() => {
		if (loggedInUserId) {
			getCoworkers(loggedInUserId);
		}
	}, []);

	useEffect(async () => {
		setLicenceCount(companyInfoById?.availableLicenses || 0)
	}, [companyInfoById, companyInfoLoading]);

	const request = {
		createdby: loggedInUserId,
		FirstName: initialValues.FirstName,
		LastName: initialValues.LastName,
		emailid: initialValues.emailid,
		AdminPrivilege: isChecked ? true : false,
		AccessPermission: isCheckedDoc ? true : false,
	};

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

	const getUserByKeyClock = (id) => {
		props
			.callgetUserByKeyClockIdAPIAction(id)
			.then((res) => {
				setloggedInUserId(res.data.data.id);
				storeKeyClockUserId(res.data.data.id);
				getCoworkers(res.data.data.id);
				setCompanyID(res.data.data.companyId);
			})
			.catch((error) => { });
	};

	const getCoworkers = (loggedInUserId) => {
		props
			.callgetCoworkersListAPIActon(loggedInUserId)
			.then((res) => {
				setcoWorkerEmail(res.data.data);
				setcoWorkerLength(res.data.data.length);
			})
			.catch((error) => { });
	};

	const handleSubmit = () => {
		getPrimaryUser(companyID);
		sessionStorage.setItem("showTutorial", true);
		history.push(constants.ROUTE.HOME_PAGE.HOME);
		dispatch(setAddUser(true));
	};

	const handleAdd = (e) => {
		e.preventDefault();
		props
			.callPostAddCoworkerAPIAction(request)
			.then((res) => {
				console.log(res);
				props.notify("User Added Successfully", 5000);
				getCoworkers(loggedInUserId);
				initialValues.FirstName = "";
				initialValues.LastName = "";
				initialValues.emailid = "";
				loadCompany();
				setIsCheckedDoc(false);
				setIsChecked(false);
			})
			.catch((error) => {
				if (error.response.data.errors) {
					const m = error.response.data.errors;
					const message = m.join(",");
					props.notify(message, 5000);
					loadCompany();
				}
			});
	};

	const handleOnChange = (e) => {
		setIsChecked(!isChecked);
	};

	const deleteUser = (e, item, index) => {
		props
			.callDeleteUserAPIAction(item.id)
			.then((res) => {
				props.notify("User Deleted Successfully", 5000);
				getCoworkers(loggedInUserId);
			})
			.catch((error) => {
				props.notify(error.response.data.errors, 5000);
			});
	};

	const getPrimaryUser = (companyID) => {
		props
			.callgetPrimaryUserAction(companyID)
			.then((res) => { })
			.catch((error) => {
				console.log(error);
			});
	};
	const handleClickSkip = () => {
		sessionStorage.setItem("showTutorial", true);
		history.push(constants.ROUTE.HOME_PAGE.HOME);
	};

	const handleClickPrevStep = () => {
		if (permissionArray?.includes(constants.PERMISSION_MAPPING.ADDING_EMPLOYEE_COUNTS)) {
			history.push(constants.ROUTE.REGISTRATION_FLOW.EMPLOYEE_INFORMATION);
		} else if (permissionArray?.includes(constants.PERMISSION_MAPPING.FAVORITE_COUNTRIES)) {
			history.push(constants.ROUTE.COUNTRY.COUNTRY);
		} else {
			history.push(constants.ROUTE.USER.USER_PROFILE);
		}
	}

	return (
		<div className="container">
			<div className="row justify-content-center mt-3">
				<div className="col-8">
					<div className="row">
						<div className="col-6">
							<Link
								to={!isDisabledFlag ? null : null}
								onClick={handleClickPrevStep}
								className="back-btn"
							>
								Previous Step
							</Link>
						</div>
					</div>
					<div className="col-12">
						<div className="row mb-5">
							<div className="header-section">
								<h2>Add users.</h2>
								<h4>
									{/* Your account has {licenceCount} licenses. Invite upto {licenceCount} coworkers to explore Expandopedia with you! */}
									All licenses associated with your account are being used.<br />
									Please contact <a href="mailto:expandopedia@elementsgs.com?subject=Support Request" style={{ color: "#40659E" }}> <u>expandopedia@elementsgs.com</u></a> to upgrade your account.
								</h4>
							</div>
						</div>
						<div className="row">
							<div className="col-12 px-0">
								<form>
									<div className="col-7 px-0">
										<div className="row">
											<div className="col-6" style={{ paddingRight: "6px" }}>
												<div className="form-group">
													<TextFieldComponent
														type="text"
														id="FirstName"
														name="FirstName"
														value={
															initialValues.FirstName
														}
														onChange={
															handleChangeValue
														}
														placeholder="First Name*"
														label="First Name*"
														dataContent="First Name*"
														disabled
													/>
												</div>
											</div>
											<div className="col-6" style={{ paddingLeft: "6px" }}>
												<div className="form-group">
													<TextFieldComponent
														type="text"
														id="LastName"
														name="LastName"
														value={
															initialValues.LastName
														}
														onChange={
															handleChangeValue
														}
														placeholder="Last Name*"
														label="Last Name*"
														dataContent="Last Name*"
														disabled
													/>
												</div>
											</div>
										</div>
										<div className="form-group mt-4">
											<TextFieldComponent
												type="email"
												id="emailid"
												name="emailid"
												value={initialValues.emailid}
												onChange={handleChangeValue}
												placeholder="Email Id*"
												label="Email Id*"
												dataContent="Email Id*"
												onBlur={handleFocus}
												disabled
											// error={isError.emailid && isFocus.emailid ? true : false}
											// helperText={isError.emailid}
											/>
										</div>
										<div className="form-check d-flex">
											<input
												className="form-check-input"
												type="checkbox"
												id="admin"
												name="admin"
												value="1"
												style={{ marginTop: "4px" }}
												checked={isChecked}
												onChange={handleOnChange}
												disabled
											/>
											<label
												className="form-check-label mr-3"
												htmlFor="defaultCheck1"
											>
												User has admin privileges
											</label>
											<a
												href
												className="info-wrap-tooltip"

											>
												<i className="ph-question"></i>
												{/* <div className="info-content">
													<h4>What’s this?</h4>
													<p>
														Admin users can add and
														manage other users.
													</p>
												</div> */}
											</a>
										</div>
										{/* <div className="form-check">
											<input
												className="form-check-input"
												type="checkbox"
												id="Document"
												name="Document"
												checked={isCheckedDoc}
												onChange={handleOnChangeDoc}
											/>
											<label
												className="form-check-label mr-3"
												htmlFor="defaultCheck1"
											>
												User has access to purchased and
												downloaded documents.
											</label>
										</div> */}
									</div>
								</form>
								<div className="action-wrap">
									<div className="row">
										<div className="col d-flex justify-content-end ">
											<div className="display_comingsoon add-user-tooltip">

												<button
													type="button"
													className={`btn btn-secondary add-btn user-add-btn`}
													onClick={handleAdd}
													disabled={`${coWorkerLength >= licenceCount || isDisabledFlag
														? "disabled"
														: ""
														}`}
												>
													Add
												</button>

												{/* <ComingSoon direction="left"></ComingSoon> */}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="row d-block">
							<h3 className="user-header">Users added</h3>
							<div className="user-list">
								{coWorkerEmail == "" ? (
									<span>
										Add users to see their email address
										listed here.
									</span>
								) : (
									""
								)}

								{coWorkerEmail
									? coWorkerEmail.map((item, index) => {
										return (
											<a
												key={index}
												href
												className="odd"
											>
												{item.emailId}
												<i
													className="ph-x cursor-pointer"
													onClick={(e) =>
														deleteUser(
															e,
															item,
															index
														)
													}
												/>
											</a>
										);
									})
									: ""}
								{coWorkerLength >= licenceCount ? (
									<div className="error-text">
										<h5>
											We were unable to invite some more
											users.
										</h5>
										<h6>
											Try changing the email address or
											remove user to proceed.{" "}
										</h6>
									</div>
								) : (
									""
								)}
							</div>
						</div>
						<div className="action-wrap">
							<div className="row">
								<div className="col pl-0">
									{/* <a
										href={null}
										// to={constants.ROUTE.SUCCESS.SUCCESS}
										// onClick={handleClickSkip}
										className="skipbtn"
										
									>
										Skip for now
									</a> */}
								</div>
								<div className="col d-flex justify-content-end pr-0">
									<button
										type="button"
										className="btn btn-primary"
										onClick={handleSubmit}
									>
										Finish
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
const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			callPostAddCoworkerAPIAction: callAddCoworkers,
			callgetCoworkersListAPIActon: callgetCoworkersList,
			callgetUserByKeyClockIdAPIAction: callgetUserByKeyClockId,
			callDeleteUserAPIAction: callDeleteUserAPI,
			callgetPrimaryUserAction: callgetPrimaryUser,
		},
		dispatch
	);
export default connect(null, mapDispatchToProps)(AddUser);
