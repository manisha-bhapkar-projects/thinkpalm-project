import React, { useState, useEffect, useReducer, Fragment } from "react";
import { connect, useDispatch } from "react-redux";
import { shallowEqual, useSelector } from 'react-redux';
import SearchBar from "../../Components/SearchBar";
import SupportButton from "../../Components/SupportButton";
import { useHistory, useParams } from "react-router-dom";
import { callSubscriptionDataById } from "../../Store/reducers/subscription";
import ListSelectedFeatures from "./ListSelectedFeatures";
import OpenModal from "./OpenModal";
import './style.scss';
import { permissionMapping } from "../../utils/utils";
import constants from "../../utils/constants";
import CustomeDropDown from "../../Components/CustomeDropDown/CustomeDropDown";

const ViewSubscription = (props) => {
  const userProfile = useSelector((state) => state.user.userProfile);
  const [subData, setSubData] = useState();
  const [subFormData, setSubFormData] = useState({});
  const [userGroupFSelected, setUserGroupFSelected] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState();
  const [editFlag, setEditFlag] = useState(false);
  const [statusFlag, setStatusFlag] = useState();
  const history = useHistory();
  let { id } = useParams();
  const permissionArray = permissionMapping();
  const priceDurationTypes = [
    { id: 1, value: "per year" },
    { id: 2, value: "per month" },
    { id: 3, value: "per week" }]

  const durationTypes = [
    { id: 1, value: "Years" },
    { id: 2, value: "Months" },
    { id: 3, value: "Weeks" },
    { id: 4, value: "Days" }]


  // const [userFeat, setuserFeat] = useState();
  // const [userRoles, setuserRoles] = useState();
  // const [showModal, setShowModal] = useState(false);
  // const [userId, setUserId] = useState();
  // const [userStatus, setUserStatus] = useState();
  // const [editFlag, setEditFlag] = useState(false);
  // const [userName, setUserName] = useState();
  // var user_data = getUserProfile();
  // const [userData, setUserData] = useState();

  const getTypeById = (data, type) => {
    const it = type.filter(item => {
      if (item.id == data) return item
    })
    return it[0].value

  }
  useEffect(() => {
    if (!permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_SUBSCIPTION_DETAIL_PAGE))
      history.push("/home")
    callSubscriptionDataById_details(id);
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
                  <li className="breadcrumb-item active" aria-current="page">View Subscription</li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="title-action-wrap">
                <div className="row">
                  <div className="col-sm-6 pl-0">
                    <h3>View Subscription
                      <a href onClick={() => { history.push('/subscription-list'); }}><i className="ph-arrow-left pointer" /></a>
                    </h3>
                  </div>
                  <div className="col-sm-6 d-flex justify-content-end pr-0">
                    <button type="button" className="secondary-gray-button" onClick={() => history.push("/subscription-list")}>Cancel</button>

                    <button type="button" onClick={() => openEditModal()} className={permissionArray?.includes(constants.PERMISSION_MAPPING.CREATE_SUBSCRIPTION_PACKAGES) ? "primary-button pointer" : "a-disabled primary-button"}>Edit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-wrapper">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <h4>Subscription Details</h4>
                  </div>
                  <div className="col-lg-4">
                    <div className="floating">
                      <input id="input__username" readOnly className="floating__input" name="Name" value={subData ? subData.name : ""} type="text" placeholder="Subscription title" />
                      <label htmlFor="input__username" className="floating__label" data-content="Subscription title">
                        <span className="hidden--visually">Subscription title</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {subData?.features?.length > 0 ? (
                    <div className="col-12">
                      <h4>Feature Access</h4>
                    </div>
                  ) : ""}
                  <div className="col-lg-10">
                    <div className="vertical-tab-group subscription-item-wrapper">
                      <div className="tab-pane fade show" id="v-pills-home" role="tabpanel" aria-labelledby="v-pills-home-tab">
                        <ListSelectedFeatures feat_data={subData ? subData.features : null}></ListSelectedFeatures>
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
                            className="pt-1"
                            name="Price"
                            type="number"
                            pattern="\d*"
                            min="1"
                            maxLength={5}
                            value={subData ? subData.price : ""}
                          />
                          <span className="currency-type">$</span>
                          <span className="currency-seperator"></span>
                          <CustomeDropDown
                            data={priceDurationTypes}
                            value={
                              subData?.priceDurationType &&
                              getTypeById(subData.priceDurationType, priceDurationTypes)
                            }
                            noDisable={false}
                          // noDisable={permissionArray?.includes(constants.PERMISSION_MAPPING.SET_SUBSCRIPTION_PRICES) ? true : false}
                          />

                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="price-container">
                          <label>Promotion Pricing</label>
                          <input id="input__username"
                            className="pt-1"
                            maxLength={5}
                            name="PromotionPrice"
                            type="number" value={subData ? subData.promotionPrice : ""}
                          />
                          <span className="currency-type">$</span>
                          <span className="currency-seperator"></span>
                          <CustomeDropDown
                            data={priceDurationTypes}
                            value={subData?.promotionPriceDurationType &&
                              getTypeById(subData.promotionPriceDurationType, priceDurationTypes)
                            }
                            noDisable={false}
                          />

                        </div>
                        <div className="vertical-tab-group promo">
                          {subData ? subData.isPromotionApplied ? "Promo Price Applied" : "" : ""}
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
                            className="pt-1"
                            name="Duration"
                            type="number"
                            value={subData ? subData.duration : ""}
                          />
                          <span className="currency-seperator"></span>
                          <CustomeDropDown
                            data={durationTypes}
                            value={subData?.subscriptionPeriodDurationType &&
                              getTypeById(subData.subscriptionPeriodDurationType, durationTypes)
                            }
                            noDisable={false}

                          />

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <SupportButton />
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



    </React.Fragment>



  )
}
export default ViewSubscription;