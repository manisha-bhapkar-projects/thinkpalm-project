import React, { useState, useEffect, useReducer, Fragment, } from "react";
import { connect, useDispatch } from "react-redux";
import { shallowEqual, useSelector } from 'react-redux';
import SearchBar from "../../Components/SearchBar";
import SupportButton from "../../Components/SupportButton";
import { limitNumber } from '../../utils/utils'
import { useHistory, useParams } from "react-router-dom";
import { getSearchResult, getFeatResult, postSubscriptionData, callSubscriptionDataById, EditSubscriptionData } from "../../Store/reducers/subscription";
// import { callSubscriptionDataById, getFeatResult, EditSubscriptionData } from "../../Store/reducers/subscription";

import ListFeatures from './ListFeatures';
import './style.scss';
import CustomeDropDown from "../../Components/CustomeDropDown/CustomeDropDown";
import { Duration_List, price, Price_List } from '../../Components/StaticData'
import { permissionMapping } from "../../utils/utils";
import { cloneDeep } from "lodash";
import { RestrictNumber } from '../../utils/utils';


import constants from "../../utils/constants";

const SubscriptionList = (props) => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [subFormData, setSubFormData] = useState({});
  const [featData, setFeatData] = useState(null);
  const history = useHistory();
  const [promoChecked, setPromoChecked] = useState(false);
  const [priceId, setpriceID] = useState("1");
  const [promoId, setpromoID] = useState("1");
  const [durationId, setdurationID] = useState("1");
  const [countryCount, setCountryCount] = useState();
  const [specificCountriesSelected, setSpecificCountriesSelected] = useState(false);
  const [featurePayload, setFeaturePayload] = useState([]);
  const permissionArray = permissionMapping();
  let { id } = useParams();
  const [subData, setSubData] = useState({});


  const editFlag = history?.location?.state?.editFlag;

  const priceDurationTypes = [
    { id: 1, value: "per year" },
    { id: 2, value: "per month" },
    { id: 3, value: "per week" }]

  const durationTypes = [
    { id: 1, value: "Years" },
    { id: 2, value: "Months" },
    { id: 3, value: "Weeks" },
    { id: 4, value: "Days" }]

  useEffect(() => {
    if (!permissionArray?.includes(constants.PERMISSION_MAPPING.CREATE_SUBSCRIPTION_PACKAGES))
      history.push("/home")


    getFeatData_details();
  }, [])
  const getFeatData_details = async () => {
    const response = await getFeatResult({});
    if (response && response.data) {
      setFeatData(response.data);
      setFeaturePayload(response.data)
    }
  }

  const setFirstRadioButtonEnabledByDefault = () => {
    const featDataCopy = featData;
    featDataCopy.map((item, i) => {
      if (item.controlType === "optionbutton" && i == 0) {
        item.isSelected = true;
      }
      return item;
    })
    setFeaturePayload(featDataCopy);
  }

  const callEditFleatData = async () => {
    const response = await callSubscriptionDataById(id);
    const featCopy = cloneDeep(featData);
    if (response && response.data) {
      setSubData(response.data[0]);
      if (response.data[0].isPromotionApplied == true) {
        setPromoChecked(true)
      }
      setSubFormData({
        Name: response.data[0].name,
        Description: "",
        Price: response.data[0].price,
        PromotionPrice: response.data[0].promotionPrice,
        IsPromotionApplied: promoChecked,
        Duration: response.data[0].duration
      });

      const data1 = featCopy.map(obj => response.data[0].features.find(o => {
        if (o.id == obj.id) {
          o.attributes = obj.attributes.map(obj1 => o.attributes.find(o1 => o1.id === obj1.id) || obj1);
          return o
        }
      }) || obj);

      // setFeatData(data);
      setSpecificCountriesSelected(data1[1].isSelected)
      setCountryCount(data1[1].attributes[0].value)
      setFeaturePayload(data1)
    }
  }

  useEffect(() => {

    if (featData?.length > 0) {
      if (history?.location?.state?.editFlag) {
        callEditFleatData()
      } else
        setFirstRadioButtonEnabledByDefault();
    }
  }, [featData])

  let onInputChangeHandler = (e) => {

    let pre_obj = subFormData;
    let new_obj = {
      [e.target.name]: e.target.value
    }
    setSubFormData({ ...pre_obj, ...new_obj })
  }

  let sendData = () => {
    if (subFormData.Name == null || subFormData.Name === undefined || subFormData.Name.length < 1) {
      props.notify("Subscription title required", 5000);

    }
    else if (subFormData.Price == null || subFormData.Price === undefined || subFormData.Price.length < 1) {
      props.notify("Subscription price required", 5000);

    }
    else if (specificCountriesSelected && (countryCount === undefined || countryCount === '')) {
      props.notify("Please enter country count", 5000);

    }

    else {
      let final_obj = {
        Name: subFormData.Name,
        Description: "",
        Price: subFormData.Price,
        PromotionPrice: subFormData.PromotionPrice,
        IsPromotionApplied: promoChecked,
        Duration: subFormData.Duration,
        Features: featurePayload,
        priceDurationType: subData.priceDurationType,
        promotionPriceDurationType: subData.promotionPriceDurationType,
        subscriptionPeriodDurationType: subData.subscriptionPeriodDurationType
      }
      sendSubscriptionData(final_obj);
    }

  }

  let sendSubscriptionData = async (a) => {
    console.log("payload>>", a)
    if (editFlag) {
      const response = await EditSubscriptionData(a, id, props);
      if (response.message != undefined && response.message != null) {
        props.notify(response.message, 5000);
      }
      history.push('/subscription-list');
    } else {
      const response = await postSubscriptionData(a, props);
      if (response.message != undefined && response.message != null) {
        props.notify(response.message, 5000);
      }
      history.push('/subscription-list');
    }
  }

  const updateDropdown = (id) => {
    const subDataCopy = cloneDeep(subData);
    subDataCopy.priceDurationType = id;
    setSubData(subDataCopy);
    setpriceID(id);


  }
  const updatePromoDropdown = (id) => {
    const subDataCopy = cloneDeep(subData);
    subDataCopy.promotionPriceDurationType = id;
    setSubData(subDataCopy);
    setpromoID(id);

  }
  const updateDurationDropdown = (id) => {
    const subDataCopy = cloneDeep(subData);
    subDataCopy.subscriptionPeriodDurationType = id;
    setSubData(subDataCopy);

    setdurationID(id);

  }


  //This function if for checking/unchecking main-checkboxes
  const changeMainCheckBox = (e) => {
    const featDataCopy = cloneDeep(featurePayload);
    console.log("changeMainCheckBox", featDataCopy)
    featDataCopy.map(item => {
      if (item.id == e.currentTarget.value) {
        item.isSelected = e.target.checked
      }
      return item;
    })

    setFeaturePayload(featDataCopy);

  }

  //This function if for checking/unchecking sub-checkboxes
  const changeSubCheckBox = (e) => {
    const featDataCopy = cloneDeep(featurePayload);
    featDataCopy.map(item => {
      if (item.id == e.currentTarget.getAttribute("data-value")) {
        console.log("item>>", item);
        return item.attributes.map((subItem) => {
          if (subItem.id == e.currentTarget.value) {
            subItem.isSelected = e.target.checked
          }
          return subItem
        })
      }
      return item;
    })

    setFeaturePayload(featDataCopy);

  }
  const assignForRadioBtn = (subItem) => {
    setCountryCount(subItem.value);
    if (subItem.value === "") {
      subItem.isSelected = false;
    } else {
      subItem.isSelected = true;
    }
  }

  //This function is for changing value in input box
  const changeInput = (e, type) => {
    const { value } = e.target;
    const featDataCopy = cloneDeep(featurePayload);
    featDataCopy.map(item => {
      if (item.id == e.currentTarget.getAttribute("data-value")) {
        return item.attributes.map((subItem) => {
          if (subItem.id == e.currentTarget.id) {
            // if (type === "optionbutton" && !RestrictNumber(value)) {
            //   props.notify("Please enter a value between 1 and 5")
            //   subItem.value = "";
            // } else {
            subItem.value = value;
            // }
            //if radio button then make isSelected key true/false on inputting the value 
            if (type === "optionbutton") {
              assignForRadioBtn(subItem)

            }
          }
          return subItem
        })
      }
      return item;
    })

    setFeaturePayload(featDataCopy);
  }

  //This function if for checking/unchecking radio-buttons

  const changeRadioButton = (e, index) => {
    const featDataCopy = cloneDeep(featurePayload);
    featDataCopy.map((item, i) => {
      if (item.controlType === "optionbutton") {
        /** This is to know that which radio btn has been selected, to set countrycount error message */
        index === 1 ? setSpecificCountriesSelected(true) : setSpecificCountriesSelected(false);
        /**This is to clear the country count when 1st option is selected */
        if (index === 0 && i === 1) item.attributes[0].value = "";
        /**end */
        /**end */
        if (item.id == e.currentTarget.value) {
          item.isSelected = e.target.checked
        }
        if (item.id != e.currentTarget.value) {
          item.isSelected = !e.target.checked
        }
      }
      return item;
    })
    console.log("featurePayloadinside>>", featDataCopy)
    setFeaturePayload(featDataCopy);
  }
  const getTypeById = (data, type) => {
    const it = type.filter(item => {
      if (item.id == data) return item
    })
    return it[0].value

  }
  const handleChange = (e) => {
    e.target.checked ? setPromoChecked(true) : setPromoChecked(false)

  }

  console.log("featurePayload>>", featurePayload)
  return (
    <React.Fragment>
      <div className="position-relative">
        <div className="container-fluid">
          <SearchBar user={userProfile} />
          <div className="col-12">
            <div className="row">
              <div className="breadcrump-admin">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item"><span>Settings</span></li>
                    <li className="breadcrumb-item pointer link"><span onClick={() => history.push("/subscription-list")}>Subscriptions</span></li>
                    <li className="breadcrumb-item active" aria-current="page">
                      {
                        editFlag ?
                          "Edit Subscription"
                          :
                          " Create Subscription"

                      }
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
          <div className="">
            <div className="col-12">
              <div className="title-action-wrap subscription-mt">
                <div className="row">
                  <div className="col-sm-6 pl-0 d-flex align-items-center">
                    <h3 className="subsciption-main-header">
                      {
                        editFlag ?
                          "Edit Subscription"
                          :
                          " Create Subscription"

                      }
                      <a href onClick={() => { history.push('/subscription-list'); }}><i className="ph-arrow-left pointer" /></a>
                    </h3>
                  </div>
                  <div className="col-sm-6 d-flex justify-content-end pr-0">
                    <button type="button" className="secondary-gray-button" onClick={() => history.push("/subscription-list")}>Cancel</button>
                    <button type="button" onClick={() => sendData()} className="primary-button">
                      {
                        editFlag ? "Save" :
                          "Create"
                      }
                    </button>
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
                  <div className="col-lg-5">
                    <div className="floating">
                      <input id="input__username"
                        className="floating__input"
                        maxlength="20" name="Name"
                        defaultValue={subData ? subData.name : ""}
                        onChange={(e) => onInputChangeHandler(e)}
                        type="text"
                        placeholder="Subscription title" />
                      <label htmlFor="input__username" className="floating__label" data-content="Subscription title *">
                        <span className="hidden--visually" >Subscription title *</span>
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
                      <div className="tab-pane fade show " id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                        <ListFeatures
                          countryCount={countryCount}
                          feat_data={featurePayload}
                          changeRadioButton={changeRadioButton}

                          // trials
                          changeMainCheckBox={changeMainCheckBox}
                          changeSubCheckBox={changeSubCheckBox}
                          changeInput={changeInput}
                          editFlag={editFlag}

                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <span className="header-price">Pricing</span>
                      </div>
                      <div className="col-sm-6">
                        <div className="price-container">
                          <label>Price</label>
                          <input id="input__username"
                            onChange={(e) => onInputChangeHandler(e)}
                            name="Price"
                            className="pt-1"
                            type="number"
                            pattern="\d*"
                            min="1"
                            maxLength={5}
                            disabled={permissionArray?.includes(constants.PERMISSION_MAPPING.SET_SUBSCRIPTION_PRICES) ? false : true}
                            onKeyPress={e => limitNumber(e, 4) && e.preventDefault()}
                            defaultValue={subData ? subData.price : ""}
                          />
                          <span className="currency-type">$</span>
                          <span className="currency-seperator"></span>
                          <CustomeDropDown

                            data={priceDurationTypes}
                            value={
                              editFlag && subData?.priceDurationType ?
                                getTypeById(subData.priceDurationType, priceDurationTypes)
                                :
                                Price_List(priceId)}

                            onSelect={(e) => {
                              updateDropdown(e);
                            }}
                            // noDisable={true}

                            noDisable={permissionArray?.includes(constants.PERMISSION_MAPPING.SET_SUBSCRIPTION_PRICES) ? true : false}


                          />
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="price-container">
                          <label>Promotion Pricing</label>
                          <input id="input__username"
                            maxLength={5} onChange={(e) => onInputChangeHandler(e)}
                            name="PromotionPrice"
                            className="pt-1"
                            type="number"
                            disabled={
                              permissionArray?.includes(constants.PERMISSION_MAPPING.SET_SUBSCRIPTION_PRICES)
                                ? false
                                : true}
                            onKeyPress={e => limitNumber(e, 4) && e.preventDefault()}
                            defaultValue={subData ? subData.promotionPrice : ""}
                          />
                          <span className="currency-type">$</span>
                          <span className="currency-seperator"></span>
                          <CustomeDropDown
                            data={priceDurationTypes}
                            value={editFlag && subData?.promotionPriceDurationType ?
                              getTypeById(subData.promotionPriceDurationType, priceDurationTypes)
                              : Price_List(promoId)}
                            onSelect={(e) => {
                              updatePromoDropdown(e);
                            }}
                            // noDisable={true}
                            noDisable={
                              permissionArray?.includes(constants.PERMISSION_MAPPING.SET_SUBSCRIPTION_PRICES)
                                ? true
                                : false}


                          />
                        </div>
                        <div className="vertical-tab-group promo">
                          <label className="tab-checkbox">Apply Promo price
                            <input type="checkbox"
                              onChange={e => setPromoChecked(e.target.checked)}
                              checked={promoChecked}
                              disabled={
                                permissionArray?.includes(constants.PERMISSION_MAPPING.SET_SUBSCRIPTION_PRICES)
                                  ? false
                                  : true}
                              onChange={(e) => handleChange(e)}
                            />
                            <span className="checkmark" />
                          </label>
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
                          <input id="input__username"
                            onChange={(e) => onInputChangeHandler(e)}
                            name="Duration"
                            className="pt-1"
                            type="number"
                            defaultValue={subData ? subData.duration : ""}
                          />

                          <span className="currency-seperator"></span>
                          <CustomeDropDown
                            data={durationTypes}
                            value={editFlag && subData?.subscriptionPeriodDurationType ?
                              getTypeById(subData.subscriptionPeriodDurationType, durationTypes)
                              : Duration_List(durationId)}

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
                { /*<div className="row mt-4">
                  <div className="col-12">
                    <h4 className="mb-4">Pricing</h4>
                  </div>
                  <div className="col-lg-4">
                    <div className="floating">
                      <input id="input__username" className="floating__input" onChange={(e) => onInputChangeHandler(e)} name="Price" type="number" maxlength="5" placeholder="Price" />
                      <label htmlFor="input__username" className="floating__label" data-content="Price">
                        <span className="hidden--visually">Price</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="floating mb-0">
                      <input id="input__username" className="floating__input" maxlength="5" onChange={(e) => onInputChangeHandler(e)} name="PromotionPrice" type="number" placeholder="Promotion Pricing" />
                      <label htmlFor="input__username" className="floating__label" data-content="Promotion Pricing">
                        <span className="hidden--visually">Promotion Pricing</span>
                      </label>
                    </div>
                    <div className="vertical-tab-group promo">
                      <label className="tab-checkbox">Apply Promo price
                        <input type="checkbox" onChange={e => setPromoChecked(e.target.checked)} />
                        <span className="checkmark" />
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row mt-4 mb-4">
                  <div className="col-12">
                    <h4 className="mb-4">duration</h4>

                  </div>
                  <div className="col-lg-4">
                    <div className="floating select-dropdown">
                      <select id="input__username" onChange={(e) => onInputChangeHandler(e)} className="floating__input" name="Duration" type="text" placeholder="Duration">
                        <option value="1">1 Year</option>
                        <option value="1">2 Year</option>
                        <option value="1">3 Year</option>
                      </select>
                      <label htmlFor="input__username" className="floating__label" data-content="Duration">
                        <span className="hidden--visually">Duration</span>
                      </label>
                    </div>
                  </div>
  </div>*/}
              </div>
            </div>
            <SupportButton />
          </div>
        </div></div>



    </React.Fragment>



  )
}
export default SubscriptionList