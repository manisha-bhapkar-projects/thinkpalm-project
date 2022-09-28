import React, { useState, useEffect, useReducer, Fragment } from "react";
import { useSelector } from "react-redux";
import SearchBar from "../../Components/SearchBar";
import SupportButton from "../../Components/SupportButton";

import { useHistory } from "react-router-dom";
import { getSubscriptionList } from "../../Store/reducers/subscription";
import { permissionMapping } from "../../utils/utils";
import constants from "../../utils/constants";

const Subscriptions = () => {
    const userProfile = useSelector((state) => state.user.userProfile);
    const history = useHistory();
    const permissionArray = permissionMapping();
    const [subData, setSubData] = useState();

    const priceDurationTypes = [
        { id: 1, value: "per year" },
        { id: 2, value: "per month" },
        { id: 3, value: "per week" }]

    useEffect(() => {
        if (!permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_SUBSCRIPTION_PAGE) && !permissionArray?.includes(constants.PERMISSION_MAPPING.PURCHASE_ADDITIONAL_CONSULTING_HOURS))
            history.push("/home")
        getSubscriptionlist_details();
    }, [])



    const getSubscriptionlist_details = async () => {
        const response = await getSubscriptionList({});
        if (response && response.data) {
            setSubData(response.data);
        }
    }
    const getTypeById = (data, type) => {
        const it = type.filter(item => {
            if (item.id == data) return item
        })
        return it?.[0]?.value

    }
    let listTemp = "";
    if (subData != null) {
        listTemp = subData.map((e) => {
            let prom_temp = "";
            if (e.isPromotionApplied) {
                prom_temp = <div className='promo'> Promo </div>;
            }
            return (
                <div className="subscription-pack">
                    <h5>{e.name}</h5>
                    <div className="subscription-price">
                        {prom_temp} ${e.promotionPrice} <span>{e.promotionPriceDurationType != null && getTypeById(e.promotionPriceDurationType, priceDurationTypes)}</span>
                    </div>
                    <div className="subscription-price" style={{ fontSize: '14px', color: '#708090' }}>
                        ${e.price} <span>{e.priceDurationType != null && getTypeById(e.priceDurationType, priceDurationTypes)}</span>
                    </div>
                    <button className={permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_SUBSCIPTION_DETAIL_PAGE) ? "btn-primary-outline text-uppercase" : "btn-primary-outline text-uppercase list-disabled"} onClick={() => history.push(`/view-subscription/${e.id}`)}>
                        View Subscription
                    </button>
                </div>
            )
        })
    }



    return (
        <div className="container-fluid">
            <SearchBar user={userProfile} />

            <div className="breadcrump-admin">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb pl-0">
                        <li className="breadcrumb-item"><span>Settings</span></li>
                        <li className="breadcrumb-item " aria-current="page">Subscriptions</li>

                    </ol>
                </nav>
            </div>

            <div className="subscription-container">
                <div className="subscription-header">
                    <h3>Subscriptions</h3>

                    <span className={permissionArray?.includes(constants.PERMISSION_MAPPING.CREATE_SUBSCRIPTION_PACKAGES) ? "primary-button pointer" : "primary-button a-disabled"} onClick={() => history.push('/create-subscription')}>Create Subscription</span>
                </div>

                <div className="subscription-grid">
                    {subData ? listTemp : "Loading Data..."}
                </div>
            </div>
            <SupportButton />
        </div>
    );
};

export default Subscriptions;
