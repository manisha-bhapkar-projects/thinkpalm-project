import React, { useState, useEffect, useReducer, Fragment } from "react";
import { connect, useDispatch } from "react-redux";
import { shallowEqual, useSelector } from 'react-redux';
import SearchBar from "../../Components/SearchBar";
import { limitNumber } from '../../utils/utils'
import SupportButton from "../../Components/SupportButton";
import { useHistory, useParams } from "react-router-dom";
import { callSubscriptionDataById, getFeatResult, EditSubscriptionData } from "../../Store/reducers/subscription";
import EditFeatures from "./EditFeatures";
import OpenModal from "./OpenModal";
import './style.scss';
import CustomeDropDown from "../../Components/CustomeDropDown/CustomeDropDown";
import { Duration_List, Price_List } from "../../Components/StaticData";
import { permissionMapping } from "../../utils/utils";
import constants from "../../utils/constants";

const ViewSubscription = (props) => {
    const userProfile = useSelector((state) => state.user.userProfile);
    const [subData, setSubData] = useState();
    const [subFormData, setSubFormData] = useState({});
    const [featData, setFeatData] = useState(null);
    const [userGroupFSelected, setUserGroupFSelected] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState();
    const [editFlag, setEditFlag] = useState(false);
    const [statusFlag, setStatusFlag] = useState();
    const [featSubData, setfeatSubData] = useState();
    const [featInputData, setFeatInputData] = useState();
    let [promoChecked, setPromoChecked] = useState();
    const history = useHistory();
    const permissionArray = permissionMapping();

    let { id } = useParams();
    const [priceId, setpriceID] = useState("1");
    const [promoId, setpromoID] = useState("1");
    const [durationId, setdurationID] = useState("1");

    useEffect(() => {
        if (!permissionArray?.includes(constants.PERMISSION_MAPPING.CREATE_SUBSCRIPTION_PACKAGES))
            history.push("/home")
        callSubscriptionDataById_details(id);
        getFeatData_details();
    }, [])

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const deactivateUser = async (id) => {
        let userStatus = await props.callChangeUserStatusAPIAction(id, statusFlag);
        setShowModal(false);
    };

    const openEditModal = (id) => {
        setShowModal(true);
        setUserId(id);
        setEditFlag(true);
    };

    let callSubscriptionDataById_details = async (id) => {
        const response = await callSubscriptionDataById(id);
        if (response && response.data) {
            setSubData(response.data[0]);
            setSubFormData({
                Name: response.data[0].name,
                Description: "",
                Price: response.data[0].price,
                PromotionPrice: response.data[0].promotionPrice,
                IsPromotionApplied: response.data[0].isPromotionApplied,
                Duration: response.data[0].duration
            });
            if (response.data[0].features != null && response.data[0].features != undefined) {
                let selected_features_array = [];
                let selected_sub_obj = {};
                response.data[0].features.forEach(e => {
                    selected_features_array.push(e.id);
                    if (e.attributes.length > 0) {
                        e.attributes.forEach((d) => {
                            let obj = {
                                [d.id]: d.value
                            }
                            selected_sub_obj = { ...selected_sub_obj, ...obj };
                            setFeatInputData(selected_sub_obj);

                        })
                    }
                });
                setUserGroupFSelected(selected_features_array)
            }
        }
        if (response.data[0].isPromotionApplied == true) {
            setPromoChecked(true)
        }
    }

    const getFeatData_details = async () => {
        const response = await getFeatResult({});
        if (response && response.data) {
            setFeatData(response.data);
        }
    }

    const eventtoggleChange = (e) => {
        let sec_Fval = [];
        let new_val = Number(e.target.value)
        if (e.target.checked == false) {
            sec_Fval = [...userGroupFSelected];
            sec_Fval = sec_Fval.filter(function (value, index, arr) {
                return value != new_val;
            });
        } else {
            sec_Fval = [...userGroupFSelected];
            sec_Fval.push(new_val);
        }
        setUserGroupFSelected(sec_Fval);
    }

    let onFeatDataChange = (e) => {
        let pre_obj = featInputData;
        let new_obj = {
            [e.target.dataset.value]: e.target.value
        }
        setFeatInputData({ ...pre_obj, ...new_obj });
    }

    let getDataFrm = (e) => {
        let pre_obj = featSubData;
        if (e.target.value != null && e.target.value != undefined) {
            let new_obj = {
                [e.target.dataset.value]: e.target.value
            }
            setfeatSubData({ ...pre_obj, ...new_obj })
        }
    }

    let onInputChangeHandler = (e) => {
        let pre_obj = subFormData;
        let new_obj = {
            [e.target.name]: e.target.value
        }
        setSubFormData({ ...pre_obj, ...new_obj });
    }
    const updateDropdown = (id) => {

        setpriceID(id);

    }
    const updatePromoDropdown = (id) => {

        setpromoID(id);

    }
    const updateDurationDropdown = (id) => {

        setdurationID(id);

    }
    const handleChange = (e) => {
        e.target.checked ? setPromoChecked(true) : setPromoChecked(false)

    }


    let sendData = () => {
        let sub_data = [];
        let attribute_data = [];
        let rest_data = [];
        for (const property in featSubData) {
            let obj = [{
                "Id": featSubData[property], "Value": featInputData[featSubData[property]]
            }]
            if (userGroupFSelected.includes(Number(property))) {
                attribute_data.push(Number(property));
                let main_obj = {
                    Id: property,
                    Attributes: obj
                }
                sub_data.push(main_obj);
            }
        }
        userGroupFSelected.forEach(function (val) {
            if (attribute_data.indexOf(val) <= -1) {
                let obj = {
                    "Id": val
                }
                rest_data.push(obj)
            }
        });
        let feature_data = [...rest_data, ...sub_data];
        let final_obj = {
            Name: subFormData.Name,
            Description: "",
            Price: subFormData.Price,
            PromotionPrice: subFormData.PromotionPrice,
            IsPromotionApplied: promoChecked,
            Duration: subFormData.Duration,
            Features: feature_data
        }
        sendSubscriptionData(final_obj, id);
    }

    let sendSubscriptionData = async (a, id) => {
        const response = await EditSubscriptionData(a, id, props);
        if (response) {
            props.notify(response?.message, 5000);
            history.push('/subscription-list')
        }
    }
    let promoCheckbox_html = () => {
        console.log("promo", promoChecked)
        if (promoChecked !== true) {
            return <label className="tab-checkbox">Apply Promo price<input disabled={permissionArray?.includes(constants.PERMISSION_MAPPING.SET_SUBSCRIPTION_PRICES) ? false : true} type="checkbox" onChange={(e) => {
                handleChange(e);
            }} value="" /><span className="checkmark" ></span></label>;
        } else {
            return <label className="tab-checkbox">Apply Promo price<input disabled={permissionArray?.includes(constants.PERMISSION_MAPPING.SET_SUBSCRIPTION_PRICES) ? false : true} type="checkbox" onChange={(e) => {
                handleChange(e);
            }} value="" checked='true' /><span className="checkmark" ></span></label>;
        }
    }

    return (
        <React.Fragment>
            <div className="position-relative">
                <div className="container-fluid">
                    <SearchBar user={userProfile} />
                    <div className="row">
                        <div className="breadcrump-admin mt-3 mb-3">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb pl-0">
                                    <li className="breadcrumb-item"><span>Settings</span></li>
                                    <li className="breadcrumb-item pointer link"><span onClick={() => history.push("/subscription-list")}>Subscriptions</span></li>
                                    <li className="breadcrumb-item active" aria-current="page">Edit Subscription</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="title-action-wrap">
                                <div className="row">
                                    <div className="col-sm-6 pl-0">
                                        <h3>Edit Subscription
                                            <a href onClick={() => { history.push(`/view-subscription/${id}`); }}><i className="ph-arrow-left pointer" /></a>
                                        </h3>
                                    </div>
                                    <div className="col-sm-6 d-flex justify-content-end pr-0">
                                        <button type="button" className="secondary-gray-button" onClick={() => { history.push(`/view-subscription/${id}`); }}>Cancel</button>
                                        <button type="button" onClick={() => sendData()} className="btn btn-primary ml-3">Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="form-wrapper subscription">
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-12">
                                        <h4>Subscription Details</h4>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="floating">
                                            <input id="input__username" className="floating__input" name="Name" onChange={(e) => onInputChangeHandler(e)} defaultValue={subData ? subData.name : ""} type="text" maxLength="20" placeholder="Subscription title" />
                                            <label htmlFor="input__username" className="floating__label" data-content="Subscription title">
                                                <span className="hidden--visually">Subscription title</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <h4>Feature Access</h4>
                                    </div>
                                    <div className="col-lg-10">
                                        <div className="vertical-tab-group subscription-item-wrapper">
                                            <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                                                <EditFeatures data_event={eventtoggleChange} selected_feature_data={subData ? subData.features : null} onInputChange={onFeatDataChange} sub_event={getDataFrm} feat_data={featData}></EditFeatures>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <span className="header-price">Pricing</span>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="price-container">
                                                    <label>Price</label>


                                                    <input id="input__username" disabled={permissionArray?.includes(constants.PERMISSION_MAPPING.SET_SUBSCRIPTION_PRICES) ? false : true} onChange={(e) => onInputChangeHandler(e)} name="Price" type="number" pattern="\d*" min="1" onKeyPress={e => limitNumber(e, 4) && e.preventDefault()} maxLength={5} defaultValue={subData ? subData.price : ""} />

                                                    <span className="currency-type">$</span>
                                                    <span className="currency-seperator"></span>
                                                    <CustomeDropDown

                                                        data={
                                                            [{ id: 1, value: "per year" }, { id: 2, value: "per month" }, { id: 3, value: "per week" }]
                                                        }
                                                        value={Price_List(priceId)}

                                                        onSelect={(e) => {
                                                            updateDropdown(e);
                                                        }}

                                                        noDisable={permissionArray?.includes(constants.PERMISSION_MAPPING.SET_SUBSCRIPTION_PRICES) ? true : false}

                                                    />
                                                </div>
                                            </div>

                                            <div className="col-sm-6">
                                                <div className="price-container">
                                                    <label>Promotion Pricing</label>

                                                    <input id="input__username" maxLength={5} disabled={permissionArray?.includes(constants.PERMISSION_MAPPING.SET_SUBSCRIPTION_PRICES) ? false : true} onKeyPress={e => limitNumber(e, 4) && e.preventDefault()} onChange={(e) => onInputChangeHandler(e)} name="PromotionPrice" type="number" defaultValue={subData ? subData.promotionPrice : ""} />


                                                    <span className="currency-type">$</span>
                                                    <span className="currency-seperator"></span>
                                                    <CustomeDropDown

                                                        data={
                                                            [{ id: 1, value: "per year" }, { id: 2, value: "per month" }, { id: 3, value: "per week" }]
                                                        }
                                                        value={Price_List(promoId)}

                                                        onSelect={(e) => {
                                                            updatePromoDropdown(e);
                                                        }}

                                                        noDisable={permissionArray?.includes(constants.PERMISSION_MAPPING.SET_SUBSCRIPTION_PRICES) ? true : false}

                                                    />
                                                </div>
                                                <div className="vertical-tab-group promo">
                                                    {promoCheckbox_html()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <span className="header-price">Duration</span>
                                            </div>
                                            <div className="col-6">
                                                <div className="price-container">
                                                    <label>Period</label>
                                                    <input id="input__username" onChange={(e) => onInputChangeHandler(e)} name="Duration" type="number" defaultValue={subData ? subData.duration : ""} />

                                                    <span className="currency-seperator"></span>
                                                    <CustomeDropDown

                                                        data={
                                                            [{ id: 1, value: "Years" }, { id: 2, value: "Months" }, { id: 3, value: "Weeks" }, { id: 4, value: "Days" }]
                                                        }
                                                        value={Duration_List(durationId)}

                                                        onSelect={(e) => {
                                                            updateDurationDropdown(e);
                                                        }}

                                                        noDisable={true}

                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="row mt-4">
                                    <div className="col-12">
                                        <h4 className="mb-4">Pricing</h4>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="floating">
                                            <input id="input__username" className="floating__input" onChange={(e) => onInputChangeHandler(e)} defaultValue={subData ? subData.price : ""} name="Price" type="number" placeholder="Price" />
                                            <label htmlFor="input__username" className="floating__label" data-content="Price">
                                                <span className="hidden--visually">Price</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="floating mb-0">
                                            <input id="input__username" className="floating__input" onChange={(e) => onInputChangeHandler(e)} defaultValue={subData ? subData.promotionPrice : ""} name="PromotionPrice" type="number" placeholder="Promotion Pricing" />
                                            <label htmlFor="input__username" className="floating__label" data-content="Promotion Pricing">
                                                <span className="hidden--visually">Promotion Pricing</span>
                                            </label>
                                        </div>
                                        <div className="vertical-tab-group">
                                            {promoCheckbox_html()}
\

                                        </div>
                                    </div>
                                </div> */}
                                <div className="row mt-4 mb-4">
                                    {/* <div className="col-12">
                                        <h4 className="mb-4">Duration</h4>
                                    </div> */}
                                    {/* <div className="col-lg-4">
                                        <div className="floating select-dropdown">
                                            <input id="input__username" className="floating__input" defaultValue={subData ? subData.duration : ""} onChange={(e) => onInputChangeHandler(e)} name="Duration" type="text" placeholder="Duration" />
                                            <label htmlFor="input__username" className="floating__label" data-content="Duration">
                                                <span className="hidden--visually">Duration</span>
                                            </label>
                                        </div>
                                    </div> */}
                                    <SupportButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </div></div>
            <OpenModal
                isOpen={showModal}
                onCancelClickListner={handleCloseModal}
                userName={subData ? subData.name : ""}
                deactivateUser={deactivateUser}
                userId={subData ? subData.id : ""}
                editFlag={editFlag}
            />

        </React.Fragment >
    )
}
export default ViewSubscription;