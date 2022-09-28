import React, { useState, useEffect, useReducer, Fragment } from "react";
import { connect, useDispatch } from "react-redux";
import { shallowEqual, useSelector } from 'react-redux';
import SearchBar from "../../Components/SearchBar";
import SupportButton from "../../Components/SupportButton";
import { limitNumber } from '../../utils/utils'
import { useHistory } from "react-router-dom";
import { getSearchResult, getFeatResult, postSubscriptionData } from "../../Store/reducers/subscription";
import ListFeatures from './ListFeatures';
import './style.scss';
import CustomeDropDown from "../../Components/CustomeDropDown/CustomeDropDown";
import { Duration_List, price, Price_List } from '../../Components/StaticData'
import { permissionMapping } from "../../utils/utils";

import constants from "../../utils/constants";

const SubscriptionList = (props) => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [subFormData, setSubFormData] = useState({});
  const [userGroupFSelected, setUserGroupFSelected] = useState([]);
  const [featData, setFeatData] = useState(null);
  const history = useHistory();
  const [featSubData, setfeatSubData] = useState();
  const [featInputData, setFeatInputData] = useState();
  const [promoChecked, setPromoChecked] = useState(false);
  const [priceId, setpriceID] = useState("1");
  const [promoId, setpromoID] = useState("1");
  const [durationId, setdurationID] = useState("1");
  const [radioButtonData, setRadioButtonData] = useState([]);
  const [countryCount, setCountryCount] = useState();
  const [specificCountriesSelected, setSpecificCountriesSelected] = useState(false);

  const permissionArray = permissionMapping();


  const mockData = [
    {
      "id": 26,
      "name": "Access to data for all countries",
      "controlType": "optionbutton",
      "optionGroup": "country_access_group",
      "groupOrder": 1,
      "order": 1,
      "attributes": []
    },
    {
      "id": 29,
      "name": "Access to data for fixed number of countries",
      "controlType": "optionbutton",
      "optionGroup": "country_access_group",
      "groupOrder": 1,
      "order": 2,
      "attributes": [
        {
          "id": 4,
          "name": "Specify number of countries",
          "value": "10",
          "fieldType": "number",
          "fieldFormat": "00"
        }
      ]
    },
    {
      "id": 14,
      "name": "Labor & Employment Content",
      "controlType": "checkbox",
      "optionGroup": null,
      "groupOrder": 1,
      "order": 4,
      "attributes": []
    },
    {
      "id": 15,
      "name": "Employee Lifecycle Management",
      "controlType": "checkbox",
      "optionGroup": null,
      "groupOrder": 1,
      "order": 5,
      "attributes": []
    },
    {
      "id": 16,
      "name": "Compliance",
      "controlType": "checkbox",
      "optionGroup": null,
      "groupOrder": 1,
      "order": 6,
      "attributes": []
    },
    {
      "id": 17,
      "name": "Analytics - Labor market analysis, trends, predictions",
      "controlType": "checkbox",
      "optionGroup": null,
      "groupOrder": 1,
      "order": 7,
      "attributes": []
    },
    {
      "id": 18,
      "name": "Country compare",
      "controlType": "checkbox",
      "optionGroup": null,
      "groupOrder": 1,
      "order": 8,
      "attributes": []
    },
    {
      "id": 19,
      "name": "Expert insights and analysis (Articles library)",
      "controlType": "checkbox",
      "optionGroup": null,
      "groupOrder": 1,
      "order": 9,
      "attributes": []
    },
    {
      "id": 20,
      "name": "Personalized notifications",
      "controlType": "checkbox",
      "optionGroup": null,
      "groupOrder": 1,
      "order": 10,
      "attributes": []
    },
    {
      "id": 21,
      "name": "Access & contribute to HR professional community membership (forum)",
      "controlType": "checkbox",
      "optionGroup": null,
      "groupOrder": 1,
      "order": 11,
      "attributes": []
    },
    {
      "id": 22,
      "name": "HR Templates",
      "controlType": "checkbox",
      "optionGroup": null,
      "groupOrder": 1,
      "order": 12,
      "attributes": [
        {
          "id": 1,
          "name": "% discount",
          "value": "2",
          "fieldType": "percentage",
          "fieldFormat": "00"
        },
        {
          "id": 2,
          "name": "free countries",
          "value": "8",
          "fieldType": "number",
          "fieldFormat": "00"
        }
      ]
    },
    {
      "id": 23,
      "name": "Ask an Expert",
      "controlType": "checkbox",
      "optionGroup": null,
      "groupOrder": 1,
      "order": 13,
      "attributes": [
        {
          "id": 1,
          "name": "% discount",
          "value": "3",
          "fieldType": "percentage",
          "fieldFormat": "00"
        }
      ]
    },
    {
      "id": 24,
      "name": "Dedicated customer success manager",
      "controlType": "checkbox",
      "optionGroup": null,
      "groupOrder": 1,
      "order": 14,
      "attributes": []
    }
  ]

  useEffect(() => {
    if (!permissionArray?.includes(constants.PERMISSION_MAPPING.CREATE_SUBSCRIPTION_PACKAGES))
      history.push("/home")
    getFeatData_details();
  }, [])

  useEffect(() => {
    // setUserGroupFSelected(featData)
    console.log("featData", featData)

    if (featData?.length > 0) {
      let radioBtnId = [];
      featData.map((item, id) => {
        if (item.controlType === "optionbutton") {
          radioBtnId.push(item.id)
        }
      });
      setRadioButtonData([...radioBtnId]);
      radioBtnId.pop()
      setUserGroupFSelected(radioBtnId)
    }
  }, [featData])



  let getDataFrm = (e) => {
    let pre_obj = featSubData;
    if (e.target.value != null && e.target.value != undefined) {
      let new_obj = {
        [e.target.dataset.value]: e.target.value
      }

      setfeatSubData({ ...pre_obj, ...new_obj })
    }

  }

  let getDataFrmRadio = (e, attributeId) => {
    let pre_obj = featSubData;
    if (attributeId != null && attributeId != undefined) {
      let new_obj = {
        [1]: attributeId
      }

      setfeatSubData({ ...pre_obj, ...new_obj })
    }

  }

  let onFeatDataChange = (e) => {
    let pre_obj = featInputData;
    let new_obj = {
      [e.target.dataset.value]: e.target.value
    }
    setFeatInputData({ ...pre_obj, ...new_obj })
  }

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

    } else if (specificCountriesSelected && (countryCount === undefined || countryCount === '')) {
      props.notify("Please enter country count", 5000);

    }

    else {
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
      sendSubscriptionData(final_obj);
    }

  }

  let sendSubscriptionData = async (a) => {

    // const response = await postSubscriptionData(a, props);
    // if (response.message != undefined && response.message != null) {
    //   props.notify(response.message, 5000);
    // }
    // history.push('/subscription-list');
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
  const getFeatData_details = async () => {
    setFeatData(mockData);
    // const response = await getFeatResult({});
    // if (response && response.data) {
    //   // setFeatData(response.data);
    // }
  }

  const setCountryCountData = (e, attributeId) => {
    setCountryCount(e.target.value);
    const ft_data = featData;

    // const attributeId = ft_data[2].attributes[0].id;
    onFeatDataChange(e)
    getDataFrmRadio(e, attributeId)


  }

  const eventtoggleChange = (e, type, id) => {
    let sec_Fval = [];
    let new_val = Number(e.target.value)

    sec_Fval = [...userGroupFSelected];
    if (type === "radio" && sec_Fval.length > 0) {

      if (new_val === id[1]) {
        setSpecificCountriesSelected(true);
      } else {
        setSpecificCountriesSelected(false);

      }
      if (!id.some(item => sec_Fval.includes(item))) {
        sec_Fval.push(new_val)
      } else {
        const value = sec_Fval.filter(val => !id.includes(val));
        sec_Fval = value;
        sec_Fval.push(new_val)

      }
    } else {
      if (e.target.checked == false) {
        sec_Fval = [...userGroupFSelected];
        sec_Fval = sec_Fval.filter(function (value, index, arr) {
          return value != new_val;
        });
      } else {
        sec_Fval = [...userGroupFSelected];
        sec_Fval.push(new_val);
      }

    }
    console.log("sec_Fval", sec_Fval)
    setUserGroupFSelected(sec_Fval);
  }
  console.log("price", price)
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
                    <li className="breadcrumb-item active" aria-current="page">Create Subscription</li>
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
                    <h3 className="subsciption-main-header">Create Subscription
                      <a href onClick={() => { history.push('/subscription-list'); }}><i className="ph-arrow-left pointer" /></a>
                    </h3>
                  </div>
                  <div className="col-sm-6 d-flex justify-content-end pr-0">
                    <button type="button" className="secondary-gray-button" onClick={() => history.push("/subscription-list")}>Cancel</button>
                    <button type="button" onClick={() => sendData()} className="primary-button">Create</button>
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
                      <input id="input__username" className="floating__input" maxlength="20" name="Name" onChange={(e) => onInputChangeHandler(e)} type="text" placeholder="Subscription title" />
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
                      <div className="tab-pane fade show active" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                        <ListFeatures
                          data_event={eventtoggleChange}
                          countryCount={countryCount}
                          setCountryCount={setCountryCountData}
                          radioButtonData={radioButtonData}
                          onInputChange={onFeatDataChange}
                          sub_event={getDataFrm}
                          feat_data={featData}
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
                          <input id="input__username" onChange={(e) => onInputChangeHandler(e)} name="Price" type="number" pattern="\d*" min="1" maxLength={5} onKeyPress={e => limitNumber(e, 4) && e.preventDefault()}
                          />
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

                            noDisable={true}

                          />
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="price-container">
                          <label>Promotion Pricing</label>
                          <input id="input__username" maxLength={5} onChange={(e) => onInputChangeHandler(e)} name="PromotionPrice" type="number" onKeyPress={e => limitNumber(e, 4) && e.preventDefault()} />
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

                            noDisable={true}

                          />
                        </div>
                        <div className="vertical-tab-group promo">
                          <label className="tab-checkbox">Apply Promo price
                            <input type="checkbox" onChange={e => setPromoChecked(e.target.checked)} />
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
                          <input id="input__username" onChange={(e) => onInputChangeHandler(e)} name="Duration" type="number" />

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