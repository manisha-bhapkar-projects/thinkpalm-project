import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import constants from "../../utils/constants";
import ReactDropdown from './../../Components/CustomeSelectDropDown/reactDropdown';

const AddMoreHoursLeftWrapper = (props) => {
    const history = useHistory();

    const {
        orderPreview,
        numberFormat,
        deleteCart,
        handleHours,
        context,
        hourList,
        selectedHours,
        orderReviewed,
        requiredHours,
        balanceHour,
        selectedHourError
    } = props;
    return (
        <div className="buy-more-hours-wrap" data-test="addhour-summary">
            <span>purchase summary</span>
            <div className="select-hours-wrapper">
                <div className="select-hours mb-5">Select Number of Hours</div>
                <div className="w-75">
                    <div className="form-group">
                        <ReactDropdown
                            id="hours"
                            name="hours"
                            htmlFor="hours*"
                            testid="hours-input"
                            data_content="No. of Hours" // this is responsible for header text
                            title="hours"
                            showArrow={true}
                            inputClassName={selectedHourError && "border-red-error"}
                            isDisabled={orderReviewed ? true : false}
                            Prefilled={
                                // getSelectedOption(orderPreview.)|| 
                                selectedHours
                            }
                            data={hourList}
                            onChange={(value) => handleHours(value)}
                            data-test="dropdown"
                        />
                        {/* </div> */}
                    </div>
                    {
                        balanceHour < 10 &&
                        <p>You’re <span>{requiredHours} </span> hours away from the minimum 10 hours</p>
                    }
                    {
                        orderReviewed &&
                        <div className="payment-bill-wrap">
                            <div className="payment-bill-item">
                                <div>Tax</div>
                                <span>
                                    {orderPreview?.tax ? numberFormat(orderPreview?.tax) : 0}
                                </span>
                            </div>

                            <div className="payment-bill-item">
                                <div>Discount</div>
                                <span>{orderPreview?.totalDiscount}%</span>
                            </div>

                            <div className="payment-bill-item">
                                <div>Total</div>
                                <h6>
                                    {/* {orderPreview?.grossTotal || 0} */}
                                    {orderPreview?.grossTotal
                                        ? numberFormat(orderPreview?.grossTotal)
                                        : 0}
                                </h6>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )

}
export default AddMoreHoursLeftWrapper;