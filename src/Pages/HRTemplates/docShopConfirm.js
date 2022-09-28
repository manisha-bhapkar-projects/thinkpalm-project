import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import constants from "../../utils/constants";
import KnowledgeBaseHeader from "../KnowledgeBase/KnowledgeBaseHeader";
import Loader from "../../Components/Loader";

import SupportButton from "../../Components/SupportButton";
import {
    getOrderPreview,
    checkoutCart,
    paymentAPI,
    deleteCartItem,
} from "../../Store/reducers/HRTemplate";
import DocSummaryWrap from "./docSummaryWrap";
import PaymentSummaryWrap from "./paymentSummaryWrap";

const DocShopConfirm = (props) => {
    document.title = "Review and Payment";
    //window.location.reload()
    const dispatch = useDispatch();
    // const orderPreview = useSelector((state) => state?.HRTemplate?.orderPreview);
    const cartDetails = localStorage.getItem("cartData") ? JSON.parse(localStorage.getItem("cartData")) : {}
    const cartCheckout = useSelector((state) => state?.HRTemplate?.checkoutCart);
    const paymentSuccessfull = useSelector(
        (state) => state?.HRTemplate?.paymentSuccessfull
    );
    const userId = useSelector((state) => state?.user?.userProfile?.userId);
    const deleteCartSuccessful = useSelector(
        (state) => state?.HRTemplate?.deleteCartSuccess
    );
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const scroll = useRef(null);
    const [credit, setCredit] = useState(false);
    const [card, setCard] = useState(false);
    const [addPayment, setAddPayment] = useState(false);
    const [purchaseButton, setPurchaseButton] = useState(false);
    // const [userData, setUserData] = useState({
    //     name: "",
    //     expDate: "",
    //     cardNumber: "",
    //     cvv: "",
    //     address: "",
    //     aptSuite: "",
    //     country: "",
    //     state: "",
    //     zipCode: "",
    // });
    const [nameError, setNameError] = useState("");
    const [cardError, setCarderror] = useState("");
    const [cvvError, setCvvError] = useState("");
    const [expDateerror, setExpDateerror] = useState("");
    const [addressError, setAddressError] = useState("");
    const [countryError, setCountryError] = useState("");
    const [stateError, setStateError] = useState("");
    const [home, setHome] = useState(true);

    const [zipError, setZipsError] = useState("");
    const [paymentRequest, setPaymentRequest] = useState({
        Order_ID: "",
        Error: "",
        RefId: "",
        SessionToken: "",
        TransactionRequest: {
            TransactionType: "authCaptureTransaction",
            Amount: 800,
            CreditCard: {
                CardNumber: "4007000000027",
                ExpirationDate: "2021-12",
                CardCode: "900",
            },
            Tax: {
                Amount: "62.00",
                Name: "level2 tax name",
                Description: "level2 tax",
            },
            Duty: {
                Amount: "0",
                Name: "duty name",
                Description: "duty description",
            },
            Shipping: {
                Amount: "0",
                Name: "level2 tax name",
                Description: "level2 tax",
            },
            PoNumber: "456654",
            Customer: {
                Id: "99999456654",
            },
            BillTo: {
                FirstName: "",
                LastName: "",
                Company: "",
                Address: "",
                City: "",
                State: "",
                Zip: "",
                Country: "",
            },
            ShipTo: {
                FirstName: "",
                LastName: "",
                Company: "",
                Address: "",
                City: "",
                State: "",
                Zip: "",
                Country: "",
            },
            CustomerIP: "192.168.1.1",
            ProcessingOptions: {
                IsSubsequentAuth: true,
            },
            SubsequentAuthInformation: {
                OriginalNetworkTransId: "123456789NNNH",
                originalAuthAmount: "45.00",
            },
        },
    });
    const [checkoutRequest, setCheckoutRequest] = useState({
        CartId: "",

        PaymentType: "user_credit",
        IsAutoProcessAllowed: true,
        ShippingAddress: {
            Name: "Joseph Xaviour",
            Country: "US",
            ZipCode: "92614",
        },
        BillingAddress: {
            Name: "Joseph Xaviour",
            Country: "US",
            ZipCode: "92614",
        },
    });
    const [canPaymentWithAvailableCredit, setCanPaymentWithAvailableCredit] =
        useState(false);

    // const userId = "00000000-0000-0000-0000-000000000000";

    useEffect(() => {
        // dispatch(getOrderPreview({ userId }));
    }, []);
    useEffect(async () => {
        if (deleteCartSuccessful) {
            props.notify("Item removed from cart");
            await dispatch(deleteCartItem({ success: true }));
        }
    }, [deleteCartSuccessful]);

    const history = useHistory();

    const callAvailableCreditAPI = () => {
        console.log("Hi callAvailableCreditAPI called ");
        /** this state is set if templates purchase can be completed
         * using this available credit */
        setCanPaymentWithAvailableCredit(true);
    };

    const creditPayment = () => {
        setCredit(!credit);
        /** Need to call an API to know whether this templates purchase can be completed
         * using this available credit
         */
        callAvailableCreditAPI();
        // setCard(false);
        // setPurchaseButton(false);
    };
    const numberFormat = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "USD",
            maximumSignificantDigits: 3,
        }).format(value);

    const cardPayment = () => {
        setCard(!card)
        // setCredit(false)
        // if (!card) {
        // 	setPurchaseButton(true)
        // } else {
        // 	setPurchaseButton(false)
        // }
        // setCheckoutRequest({ ...checkoutRequest, CartId: orderPreview.cartID })

    }

    // const handleCardDetails = (text) => {
    //     if (text.target.name === "card number") {
    //         let temp = text.target.value;
    //         if (temp.length <= 15) {
    //             setUserData({ ...userData, cardNumber: temp });
    //         }
    //     }
    //     if (text.target.name === "Name") {
    //         let temp = text.target.value;
    //         setUserData({ ...userData, name: temp });
    //     }
    //     if (text.target.name === "cvv") {
    //         let temp = text.target.value;
    //         if (temp.length <= 3) {
    //             if (temp[0] === "-") {
    //                 setUserData({ ...userData, cvv: "" });
    //             } else {
    //                 setUserData({ ...userData, cvv: temp });
    //             }
    //         }
    //     }
    //     if (text.target.name === "Street Address") {
    //         let temp = text.target.value;
    //         setUserData({ ...userData, address: temp });
    //     }
    //     if (text.target.name === "Apt/Suite") {
    //         let temp = text.target.value;
    //         setUserData({ ...userData, aptSuite: temp });
    //     }
    //     if (text.target.name === "Country") {
    //         let temp = text.target.value;
    //         setUserData({ ...userData, country: temp });
    //     }
    //     if (text.target.name === "State") {
    //         let temp = text.target.value;
    //         setUserData({ ...userData, state: temp });
    //     }
    //     if (text.target.name === "Zip code") {
    //         let temp = text.target.value;
    //         if (temp[0] === "-") {
    //             setUserData({ ...userData, zipCode: "" });
    //         } else {
    //             setUserData({ ...userData, zipCode: temp });
    //         }
    //     }
    // };

    // const handleChange = (text) => {
    //     let textTemp = text.target.value;
    //     if (textTemp[0] !== "1" && textTemp[0] !== "0") {
    //         textTemp = "";
    //     }

    //     if (textTemp.length === 2 && userData.expDate.length === 1) {
    //         if (textTemp[0] === "1") {
    //             if (textTemp[1] == "1" || textTemp[1] === "0" || textTemp[1] === "2") {
    //                 textTemp = textTemp[0] + textTemp[1];
    //             } else {
    //                 textTemp = textTemp[0];
    //             }
    //         }
    //         if (textTemp[0] === "0") {
    //             if (
    //                 textTemp[1] == "1" ||
    //                 textTemp[1] === "2" ||
    //                 textTemp[1] === "3" ||
    //                 textTemp[1] === "4" ||
    //                 textTemp[1] === "5" ||
    //                 textTemp[1] === "6" ||
    //                 textTemp[1] === "7" ||
    //                 textTemp[1] === "8" ||
    //                 textTemp[1] === "9"
    //             ) {
    //                 textTemp = textTemp[0] + textTemp[1];
    //             } else {
    //                 textTemp = textTemp[0];
    //             }
    //         }
    //     }
    //     if (textTemp?.length === 3 && userData.expDate.length === 4) {
    //         textTemp = textTemp[0] + textTemp[1];
    //     }
    //     if (textTemp?.length === 3 && userData.expDate.length === 2) {
    //         if (
    //             textTemp[2] === "2" ||
    //             textTemp[2] === "3" ||
    //             textTemp[2] === "4" ||
    //             textTemp[2] === "5" ||
    //             textTemp[2] === "6" ||
    //             textTemp[2] === "7" ||
    //             textTemp[2] === "8" ||
    //             textTemp[2] === "9"
    //         ) {
    //             textTemp = textTemp[0] + textTemp[1] + "/" + textTemp[2];
    //         } else {
    //             textTemp = textTemp[0] + textTemp[1];
    //         }
    //     }
    //     if (textTemp?.length === 5 && userData.expDate.length === 4) {
    //         if (
    //             textTemp[4] == "1" ||
    //             textTemp[4] === "0" ||
    //             textTemp[4] === "2" ||
    //             textTemp[4] === "3" ||
    //             textTemp[4] === "4" ||
    //             textTemp[4] === "5" ||
    //             textTemp[4] === "6" ||
    //             textTemp[4] === "7" ||
    //             textTemp[4] === "8" ||
    //             textTemp[4] === "9"
    //         ) {
    //             textTemp =
    //                 textTemp[0] + textTemp[1] + textTemp[2] + textTemp[3] + textTemp[4];
    //         } else {
    //             textTemp = textTemp[0] + textTemp[1] + textTemp[2] + textTemp[3];
    //         }
    //     }
    //     setUserData({ ...userData, expDate: textTemp });
    // };
    const handleSave = async () => {
        setHome(false);
        if (cartDetails.cartID) {
            setPaymentLoading(true);
            const { cartDetails, userData } = checkoutDetails;
            console.log("checkoutDetails", checkoutDetails)
            // const response = await checkoutCart({
            //     CartId: cartDetails.cartID,
            //     ShippingAddress: {
            //         Name: userData.name,
            //         Country: userData.country,
            //         ZipCode: userData.zipCode,
            //     },
            //     BillingAddress: {
            //         Name: userData.name,
            //         Country: userData.country,
            //         ZipCode: userData.zipCode,
            //     },
            // });
            // if (response?.data?.orderId) {
            //     const cartPayment = await paymentAPI({
            //         ...paymentRequest,
            //         Order_ID: response?.data?.id,
            //         TransactionRequest: {
            //             ...paymentRequest.TransactionRequest,
            //             CreditCard: {
            //                 CardNumber: userData.cardNumber,
            //                 ExpirationDate: `20${userData.expDate[3] + userData.expDate[4]
            //                     }-${userData.expDate[0] + userData.expDate[1]}`,
            //                 CardCode: userData.cvv,
            //             },
            //             Amount: cartDetails?.grossTotal,
            //             Tax: {
            //                 ...paymentRequest.TransactionRequest.Tax,
            //                 Amount: cartDetails?.tax,
            //             },
            //             BillTo: {
            //                 ...paymentRequest.TransactionRequest.BillTo,
            //                 FirstName: userData.name,
            //                 Address: userData.address,
            //                 City: userData.aptSuite,
            //                 State: userData.state,
            //                 Zip: userData.zipCode,
            //                 Country: userData.country,
            //             },
            //             ShipTo: {
            //                 ...paymentRequest.TransactionRequest.ShipTo,
            //                 FirstName: userData.name,
            //                 Address: userData.address,
            //                 City: userData.aptSuite,
            //                 State: userData.state,
            //                 Zip: userData.zipCode,
            //                 Country: userData.country,
            //             },
            //         },
            //     });
            //     if (cartPayment?.message === "Transaction is Successful") {
            //         props.notify("Transaction is Successfull");
            //         history.push({
            //             pathname: `${constants.ROUTE.HR_TEMPLATE_PAGE.PAYMENT_SUCCESS}/${cartPayment?.message}`,
            //             state: {
            //                 paidItems: response?.data?.orderSummary?.items,
            //             },
            //         });
            //     } else {
            //         props.notify("Transaction is Failed");
            //         history.push(constants.ROUTE.HR_TEMPLATE_PAGE.IN_YOUR_CART);
            //     }
            // }
        }
    };
    const deleteCart = async (id) => {
        await dispatch(deleteCartItem({ id }));
        await dispatch(getOrderPreview({ userId }));
    };

    const handlePreviousPage = () => {
        history.push(`${constants.ROUTE.HR_TEMPLATE_PAGE.REVIEW_PAYMENT}`);
    }
    const userData = localStorage.getItem("userData") ? JSON.parse(localStorage.getItem("userData")) : {}

    const checkoutDetails = {
        "cartDetails": cartDetails,
        "userData": userData
    }
    // useEffect(()=>{


    // },[checkoutDetails])

    return (
        <div>
            {props?.history?.location?.fromCart && (
                <div className="custom-loader">
                    <Loader />
                </div>
            )}
            <div data-test="review">
                <SupportButton/>

                <KnowledgeBaseHeader
                    {...props}
                    title="Doc Shop"
                    doc_shop={true}
                    className="knowledge-header-container doc-shop-header"
                />
                <div className="knowledge-content-container doc-cart-container">
                    <div class="doc-cart-wrap">
                        <h4>Review and Payment</h4>
                    </div>
                    <div className="doc-review-payment">
                        <DocSummaryWrap
                            orderPreview={cartDetails}
                            numberFormat={numberFormat}
                            deleteCart={deleteCart}
                            handlePreviousPage={handlePreviousPage}
                        />
                        {/* {callDocSummaryWrap()} */}
                        <PaymentSummaryWrap
                            credit={credit}
                            creditPayment={creditPayment}
                            // handleCardDetails={handleCardDetails}
                            userData={userData}
                            nameError={nameError}
                            cardError={cardError}
                            // handleChange={handleChange}
                            expDateerror={expDateerror}
                            cvvError={cvvError}
                            addressError={addressError}
                            countryError={countryError}
                            stateError={stateError}
                            zipError={zipError}
                            // handleCardForFutureUse={handleCardForFutureUse}
                            orderPreview={cartDetails}
                            handleSave={handleSave}
                            paymentLoading={paymentLoading}
                            home={home}
                            canPaymentWithAvailableCredit={canPaymentWithAvailableCredit}
                            pathName={history?.location?.pathname}
                            checkoutDetails={checkoutDetails}
                            cardPayment={cardPayment}
                            card={card}

                        // handleReviewOrder={handleReviewOrder}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default DocShopConfirm;
