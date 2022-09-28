import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { bindActionCreators } from "redux";

/* Actions */
import {
    callgetEmployeeType,
    callgetUserCountry,
    callgetUserCountryDetails,
    callUpdateEmployeeCountListAPI,
} from "../../Actions/CountryAction";
import { callgetUserByKeyClockId } from "../../Actions/AddUserAction";

/* External imports */
import Loader from "../../Components/Loader";
import constants from "../../utils/constants";
import { getUserProfile } from "../../utils/storage";
import { setEmployeeInfo, updateEmployeesInfo } from "../../Store/reducers/user";
import MySelect from "../../Components/MultiselectDropDown/MySelect";
import { CustomeNotification } from "../../Components/CustomeNotification/CustomeNotification";
import EmployeeInfoModal from "./employeeInfoModal";

/* Icons */
import ImageRender from "../Settings/imageRender";
import ImageLoader from "../../Components/ImageLoader/ImageLoader";
import watermarkImg from "../../assets/images/placeholder-img.svg";
import { permissionMapping } from "../../utils/utils";
import mixpanel from 'mixpanel-browser';
import {userDetailsMixpnel} from '../../utils/utils'
mixpanel.init(constants.MIXPANEL_TOKEN);
const EmployeeRegistration = (props) => {
    const history = useHistory();

    const [userid, setUserId] = useState("");
    const [count, setCount] = useState({});
    const [countryList, setCountryList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [employeeType, setEmployeeType] = useState([]);
    const [countryData, storeCountryData] = useState([]);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [employeeInfoDetails, setEmployeeInfoDetails] = useState({});
    const [employeeInfoModal, setEmployeeInfoModal] = useState(false);
    const [userData, setUserData] = useState(JSON.parse(localStorage.getItem(constants.STORAGE.AUTH.USER_PORFILE)));

    const [data, setData] = useState([]);
    const [empData, setEmpData] = useState([]);
    const permissionArray = permissionMapping();

    const dispatch = useDispatch();

    useEffect(() => {
        getEmployeeType();
        let user_data = getUserProfile();
        if (user_data) setUserId(user_data.userId);
    }, []);

    useEffect(() => {
        let user_data = getUserProfile();
        if (user_data) getCountryList(user_data.userId, countryData);
        setUserData(user_data);
    }, [countryData]);
    useEffect(() => {
        if (countryList.length > 0) {
            let count = 0;
            countryList.forEach((item) => {
                if (item.employeeCount > 0) {
                    count = count + Number(item.employeeCount);
                }
            });
            setEmployeeCount(count)
        }
    }, [countryList]);

    useEffect(() => {
        if (userid && userid != null && userid != "") {
            getUserCountryDetails(userid);
        }
    }, [userid]);

    const getUserCountryDetails = (userid) => {
        props
            .callgetUserCountryDetailsAction(userid)
            .then((response) => {
                storeCountryData(response.data.data);
            })
            .catch((errors) => { });
    };

    const getCountryList = (userid, countryData) => {
        setLoading(true)
        props
            .callgetUserCountryAction(userid)
            .then((response) => {
                let temp = {};
                countryData.forEach((element) => {
                    temp[element.id] = element;
                });

                let data = response.data.data.employeeCountryCount.map((item) => {
                    if (temp[item.countryID]) {
                        const newData = temp[item.countryID];
                        let employeeTypes = [];
                        
                        if (item.employeeTypes.length > 0) {
                            for (let index = 0; index < item.employeeTypes.length; index++) {
                                const element = item.employeeTypes[index];
                                let data = employeeType.find((x) => x.EmployeeTypeId === element.employeeTypeId);
                                if (data) {

                                    employeeTypes.push({ ...element, isCheck: !!element.isCheck, name: data?.name })
                                } else {
                                    employeeTypes.push({ ...employeeType[index] })
                                }
                            }
                        } else {
                            employeeTypes = JSON.parse(JSON.stringify(employeeType));
                        }
                        return { ...newData, ...item, employeeTypes: employeeTypes };
                    }

                    return item;
                });


                setCountryList(data);
                setLoading(false)
            })
            .catch((errors) => { setLoading(false) });
    };

    const getEmployeeType = () => {
        props
            .callgetEmployeeTypeAction()
            .then((response) => {
                if (response?.data?.data) {
                    setEmployeeType(response.data.data.map((item) => {
                        return { ...item, UserId: userid, CountryId: '', EmployeeTypeId: item.id, isCheck: false, salariedCount: 0, hourlyCount: 0 }
                    }));
                }
            })
            .catch((errors) => { });
    };

    const handleSubmit = () => {
        const employeesInfoList = JSON.parse(JSON.stringify(countryList));
        let valid = false;
        for (let _itemIn = 0; _itemIn < employeesInfoList.length; _itemIn++) {
            if (employeesInfoList[_itemIn].employeeCount > 0) {
                valid = true;
            }
        }

        if (valid) {
            if (!permissionArray?.includes(constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER)) {
                sessionStorage.setItem("showTutorial", true);
                dispatch(setEmployeeInfo(true));
                history.push(constants.ROUTE.HOME_PAGE.HOME);
            } else {
                history.push(constants.ROUTE.USER.ADD_USER);
                dispatch(setEmployeeInfo(true));
            }
        } else {
            props.notify("Please update the employee Info!");
        }
    };

    const handleEmployeeTypes = (item, index) => {
        setEmployeeInfoDetails({ ...item, _index: index });
        setEmployeeInfoModal(true)
    };

    const saveUserInfo = async (item) => {
        const _countries = [...countryList];
        setEmployeeInfoDetails({});
        setEmployeeInfoModal(false)

        _countries[item._index] = item;
        setCountryList([..._countries]);
        const _conItem = [item];

        let request = {
            userId: userid,
            employeeCountryCount: []
        };

        for (let countryIndex = 0; countryIndex < _conItem.length; countryIndex++) {
            const country = _conItem[countryIndex];
            if (country.employeeCount > 0) {
                let EmpTypes = [];
                if (country.employeeTypes?.length > 0) {
                    EmpTypes = country.employeeTypes.map((types) => {
                        return {
                            UserId: userid,
                            CountryId: country.countryID,
                            EmployeeTypeId: types.id,
                            isCheck: types.isCheck,
                            SalariedCount: types.salariedCount,
                            HourlyCount: types.hourlyCount
                        }
                    })
                }
                request.employeeCountryCount.push({
                    id: country.id,
                    countryID: country.countryID,
                    employeeCount: country.employeeCount,
                    EmployeeTypes: EmpTypes
                });
            }
        }

        setLoading(true);
        const updateUserInfo = await updateEmployeesInfo(request);
        if (updateUserInfo?.error) {
            if (updateUserInfo.data != "") {
                props.notify(updateUserInfo.data, 5000);
            } else {
                props.notify('Failed to Add Employee Info!');
            }
            setLoading(false);
        } else if (updateUserInfo?.data) {
           const mixData=updateUserInfo?.data?.employeeCountryCount.length?updateUserInfo?.data?.employeeCountryCount[0].employeeTypes:[]
           if(mixData?.length===7){
            mixpanel.track('Employee information', {
                'Permanent (full time) Local': mixData[0],
                 'Permanent (full time) expat':mixData[1], 
                 'Permanent (part time) Local': mixData[2], 
                 'Permanent (part time) expat': mixData[3], 
                 'Temporary/Interns': mixData[4],
                  'Consultants':mixData[5], 
                  'Contractors':mixData[6],
                'User Details':userDetailsMixpnel()})
           }
           
            props.notify('Employee Info Added Successfully!');
            getUserCountryDetails(userid);
        } else {
            props.notify('Failed to Add Employee Info!');
            setLoading(false);
        }
    };

    return (
        <div className="container loader-enable" data-test="employeeInformation">
            {
                loading &&
                (<div className="custom-loader">
                    <Loader />
                </div>)
            }
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
                                    Enter employee information for your Favorite Countries.
                                </h2>
                                <h4>
                                    This information will help us provide you with legal and compliance updates in a timely manner.
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
                                                        <span>
                                                            <span className="country-list-active ml-3">
                                                                {
                                                                    item.country_Name
                                                                }
                                                            </span>
                                                        </span>
                                                        <div
                                                            className={`flag ${(item.flag_Upload_Id === "" || item.flag_Upload_Id === null) && "no-flag"}`}
                                                        >
                                                            <img
                                                                src={item.flag_Upload_Id != "" && item.flag_Upload_Id != null ?
                                                                    constants.API.COUNTRY.GET_FLAG_DOWNLOAD + item.flag_Upload_Id : watermarkImg}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">

                                                </div>
                                                {/* <div className="col-md-4">
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
                                                </div> */}
                                                {
                                                    item.employeeCount > 0 ? (
                                                        <div className="employee-view-btn" onClick={() => handleEmployeeTypes(item, index)}>
                                                            View Employee Info
                                                        </div>
                                                    ) : (
                                                        <div className="employee-info-btn" onClick={() => handleEmployeeTypes(item, index)}>
                                                            Add Employee Info
                                                        </div>
                                                    )}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="action-wrap">
                            <div className="row align-items-center justify-content-between ">
                                <div className="skipbtn">
                                    {
                                        userData?.isAccountOwner &&
                                        (
                                            <Link
                                                to={constants.ROUTE.USER.ADD_USER}
                                                className={`skipbtn ${(!permissionArray?.includes(constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER) || employeeCount > 1) && "disabled"}`}
                                            >
                                                Skip for now
                                            </Link>
                                        )
                                    }
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={employeeCount < 1}
                                        className="btn btn-primary mt-0 skip-btn"
                                    >
                                        {(!permissionArray?.includes(constants.PERMISSION_MAPPING.CREATING_EDITING_ANY_USER)) ? 'Finish' : 'Next'}
                                        <i className="ph-arrow-right" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {employeeInfoModal && <EmployeeInfoModal
                isOpen={employeeInfoModal}
                onCancelClickListener={(e) => { setEmployeeInfoDetails({}); setEmployeeInfoModal(false) }}
                onSaveUserInfo={(info) => saveUserInfo(info)}
                dialogClassName="doc-modal employee-modal"
                notify={props.notify}
                employeesInfoList={{ ...employeeInfoDetails }}
                setEmployeeInfoDetails={(_info) => setEmployeeInfoDetails({ ..._info })}
            // expertDetails={props?.card_data[0]}
            />}

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

export default connect(null, mapDispatchToProps)(EmployeeRegistration);
