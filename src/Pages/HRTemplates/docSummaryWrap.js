import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import constants from "../../utils/constants";


const DocSummaryWrap = (props) => {
    const history = useHistory();

    const {
        orderPreview,
        numberFormat,
        deleteCart,
        handlePreviousPage,
        context

    } = props;
    return (
        <div className="doc-summary-wrap" data-test="doc-summary">
            <span>Order Summary</span>
            <div className="order-summary">
                {orderPreview && orderPreview?.items?.length && orderPreview?.items
                    ? orderPreview.items.map((item) => {
                        return (
                            <div
                                className="doc-order-flex"
                                key={item?.cartItemId}
                                data-test="order"
                            >
                                <div className="doc-order-details">
                                    <h4 className="doc-item-name">
                                        {item?.docProduct?.document?.title}
                                    </h4>
                                    <h5>{item?.docProduct?.document?.countryName}</h5>
                                    <span style={{ color: "#44546A" }}>
                                        {item?.docProduct?.languageName}
                                    </span>
                                </div>
                                <span className="doc-order-price">
                                    {numberFormat(item?.addedRate)}
                                </span>
                                <button
                                    className="doc-order-cancel"
                                    data-test="carttbut"
                                    onClick={() => {
                                        deleteCart(item?.cartItemId);
                                    }}
                                ></button>
                            </div>
                        );
                    })
                    : "No Items to Purchase"}
                <div className="payment-bill-wrap">
                    <div className="payment-bill-item">
                        <div>Tax</div>
                        <span>
                            {context === "withoutTax" ? "TBD" : orderPreview?.tax ? numberFormat(orderPreview?.tax) : 0}
                        </span>
                    </div>

                    <div className="payment-bill-item">
                        <div>Discount</div>
                        <span>{orderPreview?.totalDiscount}%</span>
                    </div>

                    <div className="payment-bill-item">
                        <div>Total</div>
                        <h6>
                            {orderPreview?.grossTotal
                                ? numberFormat(orderPreview?.grossTotal)
                                : 0}
                        </h6>
                    </div>
                </div>
            </div>
            <div className="review-btn-group position-absolute">
                <button
                    className="light-btn"
                    onClick={handlePreviousPage}
                >
                    Previous Page
                </button>
            </div>
        </div>
    )

}
export default DocSummaryWrap;