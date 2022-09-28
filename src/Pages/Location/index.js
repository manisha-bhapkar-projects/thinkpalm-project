import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
	callgetEmployeeType,
	callgetUserCountry,
	callgetUserCountryDetails,
	callUpdateEmployeeCountListAPI,
} from "../../Actions/CountryAction";
import constants from "../../utils/constants";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { getUserProfile } from "../../utils/storage";
import { callgetUserByKeyClockId } from "../../Actions/AddUserAction";
import { CustomeNotification } from "../../Components/CustomeNotification/CustomeNotification";
import MySelect from "../../Components/MultiselectDropDown/MySelect";
import ImageLoader from "../../Components/ImageLoader/ImageLoader";
import ImageRender from "../Settings/imageRender";
import { setEmployeeInfo } from "../../Store/reducers/user";
const Location = (props) => {
	const history = useHistory();
	const [userid, setUserId] = useState("");
	const [count, setCount] = useState({});
	const [countryList, setCountryList] = useState([]);
	const [employeeType, setEmployeeType] = useState([]);
	const [countryData, storeCountryData] = useState([]);
	const [data, setData] = useState([]);
	const [empData, setEmpData] = useState([]);

	const dispatch = useDispatch();

	useEffect(() => {
		let user_data = getUserProfile();
		setUserId(user_data?.userId);
	}, []);

	useEffect(() => {
		let user_data = getUserProfile();
		if (user_data) {
			getCountryList(user_data.userId, countryData);
		}
		getEmployeeType();
	}, [countryData]);

	useEffect(() => {
		getUserCountryDetails(userid);
	}, [userid]);

	const getUserCountryDetails = (userid) => {
		props
			.callgetUserCountryDetailsAction(userid)
			.then((response) => {
				storeCountryData(response.data.data);
			})
			.catch((errors) => {});
	};

	const getCountryList = (userid, countryData) => {
		
		props
			.callgetUserCountryAction(userid)
			.then((response) => {
				
				let _contryList = response.data.data.employeeCountryCount;
				let employeeTypeIds = _contryList.map((country) => {
					let list = country.employeeTypes.map((employeType) => {
						let arr = employeeType.filter(
							(item) => item.id == employeType.employeeTypeId
						);
						return {
							name: arr ? arr[0].name : "",
							id: employeType.employeeTypeId,
						};
					});
					return { list };
				});

				setEmpData(employeeTypeIds);
				let temp = {};
				countryData.forEach((element) => {
					temp[element.id] = element;
				});
				let data = response.data.data.employeeCountryCount.map(
					(item) => {
						if (temp[item.countryID]) {
							const newData = temp[item.countryID];
							return { ...newData, ...item };
						}
						return item;
					}
				);
				setCountryList(data);
			})
			.catch((errors) => {});
	};

	const getEmployeeType = () => {
		props
			.callgetEmployeeTypeAction()
			.then((response) => {
				setEmployeeType(response.data.data);
			})
			.catch((errors) => {});
	};

	const handleSubmit = () => {
		let employeeCountryCount = countryList.map((item) => {
			return {
				id: item.id,
				countryID: item.countryID,
				employeeCount: item.employeeCount,
				EmployeeTypes:
					item.value && item.value.length
						? item.value.map((x) => ({
								UserId: userid,
								CountryId: item.countryID,
								EmployeeTypeId: x.id,
						  }))
						: [],
			};
		});
		props
			.callUpdateEmployeeCountListAPIAction({
				userid,
				employeeCountryCount,
			})
			.then((response) => {
				history.push(constants.ROUTE.USER.ADD_USER);
				dispatch(setEmployeeInfo(true));
				props.notify("Country List Updated Successfully");
			})
			.catch((errors) => {});
	};

	const handleChange = (e, item, index) => {
		let _list = [...countryList];
		_list[index].employeeCount = e.target.value;
		setCountryList(_list);
	};

	const updateDropdown = (selected, item) => {
		let tempData = [...countryList];
		const index = tempData.findIndex((x) => x.id === item.id);
		tempData[index].value = selected;
		setCountryList(tempData);
	};

	return (
		<div className="container" data-test="Location">
			<div className="row justify-content-center mt-3">
				<div className="col-12">
					<div className="row">
						<div className="col-6">
							<Link
								to={constants.ROUTE.COUNTRY.COUNTRY}
								className="back-btn"
							>
								Previous Step
							</Link>
						</div>
					</div>
					<div className="col-12">
						<div className="row">
							<div className="header-section mb-5">
								<h2>
									How many employees do you currently have in
									each location?
								</h2>
								<h4>
									This information will help us give you
									compliance updates and other useful
									insights.
								</h4>
							</div>
						</div>

						<div className="row">
							<div className="country-wrapper custom-scroll">
								{countryList &&
									countryList.map((item, index) => {
										return (
											<div
												className="row mb-3  "
												key={index}
											>
												<div className="col-md-6">
													<div className="country-list ld_country-list">
														<a href="#">
															<span className="country-list-active ml-3">
																{
																	item.country_Name
																}
															</span>
														</a>
														<div className="flag">
															<ImageRender
																url={item.flag_Upload_Id}
															/>
														</div>
													</div>
												</div>
												<div className="col-md-2">
													<div
														key={`${item}-${index}`}
													>
														<input
															className="form-control ld_form-ctrl "
															name={item.id}
															type="number"
															min="0"
															id={item.id}
															value={
																item.employeeCount
															}
															placeholder="Count"
															onChange={(e) =>
																handleChange(
																	e,
																	item,
																	index
																)
															}
														/>
													</div>
												</div>
												<div className="col-md-4">
													
													<MySelect
														data={employeeType}
														labelKey="name"
														placeholder="Employee Type"
														valueKey="id"
														value={
															item.value ||
															empData[index].list
														}
														updateDropdown={(
															selected
														) =>
															updateDropdown(
																selected,
																item
															)
														}
													/>
												</div>
											</div>
										);
									})}
							</div>
						</div>
					</div>
					<div className="col-12">
						<div className="action-wrap">
							<div className="row align-items-center justify-content-between ">
								<div className="skipbtn"
>
									<Link to={constants.ROUTE.USER.ADD_USER}>
										Skip for now
									</Link>
								</div>
								<div>
									<button
										type="button"
										onClick={handleSubmit}
										className="btn btn-primary mt-0"
									>
										Next
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

const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			callUpdateEmployeeCountListAPIAction:
				callUpdateEmployeeCountListAPI,
			callgetUserByKeyClockIdAPIAction: callgetUserByKeyClockId,
			callgetUserCountryAction: callgetUserCountry,
			callgetEmployeeTypeAction: callgetEmployeeType,
			callgetUserCountryDetailsAction: callgetUserCountryDetails,
		},
		dispatch
	);

export default connect(null, mapDispatchToProps)(Location);
