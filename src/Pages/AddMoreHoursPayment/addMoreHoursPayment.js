import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import SupportButton from "../../Components/SupportButton";
import { useDispatch, useSelector } from "react-redux";
import constants from "../../utils/constants";
import SearchBar from "../../Components/SearchBar/index"
import Loader from "../../Components/Loader";
import AddMoreHoursLeftWrapper from "./addMoreHoursLeftWrapper";
import back_arrow from "../../assets/images/back-btn.svg";
import PaymentSummaryWrap from "../HRTemplates/paymentSummaryWrap";

import {
    checkoutCart,
    paymentAPI,
    deleteCartItem,
    getCartDetails,
    ReviewOrder,
    paymentFailedAPI,
    callSaveCardForFutureUse,
    getSavedCards,
    callDeleteSavedCard,
    getAllStates,
    savedCardPayementApi,
    sendEmailToUserAfterPaymentAPI,
} from "../../Store/reducers/HRTemplate";
import { getRemainingHours }
    from "../../Store/reducers/Purchase_ExpertBriefs";

import { getHoursApiList, addHoursToCart, addHoursToEstimate } from "../../Store/reducers/AddMoreHours";
import { callgetCountryListAPI } from "../../Store/reducers/favoriteCountries";
import { generateOptions } from "../../utils/utils"
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const AddMoreHoursPayment = (props) => {
    document.title = "Review and Payment";
    //window.location.reload()
    const param = useParams()

    const dispatch = useDispatch();
    const allStates = useSelector((state) => state?.HRTemplate?.states);
    const stateLoading = useSelector((state) => state?.HRTemplate?.stateLoading);
    const savedCardDetails = useSelector((state) => state?.HRTemplate?.savedCard);
    const hourList = useSelector((state) => state?.AddMoreHours?.hourList);
    const savedCardLoading = useSelector(
        (state) => state?.HRTemplate?.savedCardLoading
    );
    const userId = useSelector((state) => state?.user?.userProfile?.userId);
    const countries = useSelector(
        (state) => state?.favoriteCountriesReducer?.countryList
    );
    const balanceHour = useSelector(
        (state) => state?.purchaseExpertReducer?.balanceHours?.availableHours
    );
    // const balanceHour = 0;

    const deleteCartSuccessful = useSelector(
        (state) => state?.HRTemplate?.deleteCartSuccess
    );
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        expDate: "",
        cardNumber: "",
        cvv: "",
        address: "",
        aptSuite: "",
        country: "",
        state: "",
        zipCode: "",
    });
    const [nameError, setNameError] = useState("");
    const [cardError, setCarderror] = useState("");
    const [cvvError, setCvvError] = useState("");
    const [expDateerror, setExpDateerror] = useState("");
    const [addressError, setAddressError] = useState("");
    const [countryError, setCountryError] = useState("");
    const [stateError, setStateError] = useState("");
    const [home, setHome] = useState(true);
    const [zipError, setZipsError] = useState("");
    const [orderPreviewDataWithTax, setOrderPreviewDataWithTax] = useState();
    const [slicedCardNumber, setSlicedCardNumber] = useState();
    const [orderReviewed, setOrderReviewed] = useState(false);
    const [card, setCard] = useState(false);
    const [cardType, setCardType] = useState();
    const [canPaymentWithAvailableCredit, setCanPaymentWithAvailableCredit] =
        useState(false);
    const [openCardDetailsBox, setOpenCardDetailsBox] = useState(false);
    const [savedCardSelected, setSavedCardSelected] = useState(false);
    const [selectedcardInfo, setSelectedCardInfo] = useState(false);
    const [savedCardsDetailsList, setSavedCardsDetailsList] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [deleteProfile, setDeleteProfile] = useState();
    const [deleteCardDetail, setDeleteCardDetail] = useState({});
    const [isSearchText, setSearchTextClear] = useState(false);
    const [selectedHours, setSelectedHours] = useState();
    const [expertHour, setExpertHour] = useState();
    const [selectedHourError, setSelectedHourError] = useState("");
    const [cartResponseForBuyHours, setcartResponseForBuyHour] = useState("");


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

    // const cartDetails = useSelector((state) => state?.HRTemplate?.cartDetails);
    const history = useHistory();

    const getHoursApi = () => {
        setLoading(true);
        dispatch(getHoursApiList({ userId: userId }));
    };
    useEffect(() => {
        dispatch(callgetCountryListAPI());
        getSavedCardDetails();
        getHoursApi()
        // console.log("param", param)
        // let requestBody = {
        //     queryId: param?.id,
        //     statusId: 2
        // }
        // dispatch(getEstimateDetails(requestBody))
        // dispatch(getHoursDetails())
        dispatch(getRemainingHours())

        // getAllCartDetails();
    }, []);

    const getSavedCardDetails = async () => {
        setLoading(true);
        await dispatch(getSavedCards({ userId }));
    };

    useEffect(() => {
        if (savedCardLoading && Object.keys(savedCardDetails).length === 0) {
            setLoading(true);
        }
        if (
            !savedCardLoading &&
            savedCardDetails
        ) {

            if (savedCardDetails && !selectedcardInfo) {
                setSavedCardsDetailsList(savedCardDetails);
            }
            setLoading(false);
        }
    }, [savedCardDetails]);

    // useEffect(async () => {
    //     if (deleteCartSuccessful) {
    //         props.notify("Item removed from cart");
    //         setLoading(false);
    //         // await dispatch(deleteCartItem({ success: true }));
    //         orderReviewed ? handleSave("delete") : getAllCartDetails();
    //     }
    // }, [deleteCartSuccessful]);

    const numberFormat = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "USD",
            // maximumSignificantDigits: 3,
            maximumFractionDigits: 2,
        }).format(value);

    const handleCardForFutureUse = (e) => {
        setUserData({ ...userData, futureUse: e.target.checked });
    };
    useEffect(() => {
        if (!stateLoading) {
            setLoading(false);
        }
    }, [stateLoading, allStates]);

    const initializeCallErrors = () => {
        setCarderror("");
        setNameError("");
        setCvvError("");
        setExpDateerror("");
        setAddressError("");
        setCountryError("");
        setZipsError("");
        setStateError("");
    };

    const handleCountryCardDetails = (type, value) => {
        if (type === "country") {
            let temp = value.country_Name;
            setCountryError("");
            setStateError("");
            setUserData({
                ...userData,
                country: temp,
                state_id: "",
                state: "",
                country_id: value.id,
            });
            setLoading(true);
            dispatch(getAllStates({ countryId: value.id }));
        } else if (type === "state") {
            setStateError("");
            let temp = value.state_Name;
            setUserData({ ...userData, state: temp, state_id: value.id });
        }
    };
    const handleCardDetails = (text) => {
        if (text.target.name === "card number") {
            let temp = text.target.value;
            let type;
            if (temp.length <= 16) {
                setCarderror("");
                setUserData({ ...userData, cardNumber: temp });
                type = cardTypeFun(temp);
                setCardType(type);
            }
        }
        if (text.target.name === "Name") {
            let temp = text.target.value;
            setNameError("");
            setUserData({ ...userData, name: temp });
        }
        if (text.target.name === "cvv") {
            let temp = text.target.value;
            setCvvError("");
            if (temp.length <= 4) {
                if (temp[0] === "-") {
                    setUserData({ ...userData, cvv: "" });
                } else {
                    setUserData({ ...userData, cvv: temp });
                }
            }
        }
        if (text.target.name === "Street Address") {
            let temp = text.target.value;
            setAddressError("");
            setUserData({ ...userData, address: temp });
        }
        if (text.target.name === "Apt/Suite") {
            let temp = text.target.value;
            setUserData({ ...userData, aptSuite: temp });
        }

        if (text.target.name === "Zip code") {
            let temp = text.target.value;
            setZipsError("");
            if (temp[0] === "-") {
                setUserData({ ...userData, zipCode: "" });
            } else {
                setUserData({ ...userData, zipCode: temp });
            }
        }
    };
    const cardTypeFun = (number) => {
        // visa
        var re = new RegExp("^4");
        if (number.match(re) != null) return "Visa";

        // Mastercard
        // Updated for Mastercard 2017 BINs expansion
        if (
            /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
                number
            )
        )
            return "Mastercard";

        // AMEX
        re = new RegExp("^3[47]");
        if (number.match(re) != null) return "AMEX";

        // Discover
        re = new RegExp(
            "^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)"
        );
        if (number.match(re) != null) return "Discover";

        // Diners
        re = new RegExp("^36");
        if (number.match(re) != null) return "Diners";

        // Diners - Carte Blanche
        re = new RegExp("^30[0-5]");
        if (number.match(re) != null) return "Diners - Carte Blanche";

        // JCB
        re = new RegExp("^35(2[89]|[3-8][0-9])");
        if (number.match(re) != null) return "JCB";

        // Visa Electron
        re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
        if (number.match(re) != null) return "Visa Electron";

        return "";
    };
    const handleChange = (text) => {
        let textTemp = text.target.value;
        setExpDateerror("");
        if (textTemp[0] !== "1" && textTemp[0] !== "0") {
            textTemp = "";
        }

        if (textTemp.length === 2 && userData.expDate.length === 1) {
            if (textTemp[0] === "1") {
                if (textTemp[1] == "1" || textTemp[1] === "0" || textTemp[1] === "2") {
                    textTemp = textTemp[0] + textTemp[1];
                } else {
                    textTemp = textTemp[0];
                }
            }
            if (textTemp[0] === "0") {
                if (
                    textTemp[1] == "1" ||
                    textTemp[1] === "2" ||
                    textTemp[1] === "3" ||
                    textTemp[1] === "4" ||
                    textTemp[1] === "5" ||
                    textTemp[1] === "6" ||
                    textTemp[1] === "7" ||
                    textTemp[1] === "8" ||
                    textTemp[1] === "9"
                ) {
                    textTemp = textTemp[0] + textTemp[1];
                } else {
                    textTemp = textTemp[0];
                }
            }
        }
        if (textTemp?.length === 3 && userData.expDate.length === 4) {
            textTemp = textTemp[0] + textTemp[1];
        }
        if (textTemp?.length === 3 && userData.expDate.length === 2) {
            if (
                textTemp[2] === "2" ||
                textTemp[2] === "3" ||
                textTemp[2] === "4" ||
                textTemp[2] === "5" ||
                textTemp[2] === "6" ||
                textTemp[2] === "7" ||
                textTemp[2] === "8" ||
                textTemp[2] === "9"
            ) {
                textTemp = textTemp[0] + textTemp[1] + "/" + textTemp[2];
            } else {
                textTemp = textTemp[0] + textTemp[1];
            }
        }
        if (textTemp?.length === 5 && userData.expDate.length === 4) {
            if (
                textTemp[4] == "1" ||
                textTemp[4] === "0" ||
                textTemp[4] === "2" ||
                textTemp[4] === "3" ||
                textTemp[4] === "4" ||
                textTemp[4] === "5" ||
                textTemp[4] === "6" ||
                textTemp[4] === "7" ||
                textTemp[4] === "8" ||
                textTemp[4] === "9"
            ) {
                textTemp =
                    textTemp[0] + textTemp[1] + textTemp[2] + textTemp[3] + textTemp[4];
            } else {
                textTemp = textTemp[0] + textTemp[1] + textTemp[2] + textTemp[3];
            }
        }
        setUserData({ ...userData, expDate: textTemp });
    };

    const callCheckoutAndPaymentFunction = async () => {
        setLoading(true);
        const checkOutPayload = {
            CartId: cartResponseForBuyHours?.data?.cartID,
            PaymentType: "CREDIT_CARD",
            ShippingAddress: {
                Name: userData.name,
                Country: userData.country || selectedcardInfo.billTo.country,
                ZipCode: userData.zipCode || selectedcardInfo.billTo.zip,
            },
            BillingAddress: {
                Name: userData.name,
                Country: userData.country || selectedcardInfo.billTo.country,
                ZipCode: userData.zipCode || selectedcardInfo.billTo.zip,
                StreetAddress: userData.address || selectedcardInfo.billTo.address,
                AptOrSuite: userData.aptSuite,
            },
        }
        const response = await checkoutCart(checkOutPayload);
        /** if checkout API successful and if payment is via new card then call
         **payment API for new card else call payment APi for saved card.*/
        if (response?.data?.orderId) {
            setLoading(true);
            let cartPayment;
            /** payment API for saved card */
            if (selectedcardInfo) {
                const savedCardPayload = {
                    Order_ID: response?.data?.id,
                    CustomerProfileId:
                        savedCardsDetailsList?.value?.profile?.customerProfileId,
                    CustomerPaymentProfileId: selectedcardInfo.customerPaymentProfileId,
                    Amount: cartResponseForBuyHours?.data?.grossTotal,
                }
                cartPayment = await savedCardPayementApi(savedCardPayload);
            } else {
                /** payment API for new card */

                const paymentPayload = {
                    ...paymentRequest,
                    Order_ID: response?.data?.id,
                    TransactionRequest: {
                        ...paymentRequest.TransactionRequest,
                        CreditCard: {
                            CardNumber: userData.cardNumber,
                            ExpirationDate: `20${userData.expDate[3] + userData.expDate[4]}-${userData.expDate[0] + userData.expDate[1]
                                }`,
                            CardCode: userData.cvv,
                        },
                        // Amount: cartDetails?.grossTotal,
                        Tax: {
                            ...paymentRequest.TransactionRequest.Tax,
                            // Amount: cartDetails?.tax,
                        },
                        BillTo: {
                            ...paymentRequest.TransactionRequest.BillTo,
                            FirstName: userData.name,
                            Address: userData.address,
                            City: userData.aptSuite,
                            State: userData.state,
                            Zip: userData.zipCode,
                            Country: userData.country,
                        },
                        ShipTo: {
                            ...paymentRequest.TransactionRequest.ShipTo,
                            FirstName: userData.name,
                            Address: userData.address,
                            City: userData.aptSuite,
                            State: userData.state,
                            Zip: userData.zipCode,
                            Country: userData.country,
                        },
                    },
                }
                cartPayment = await paymentAPI(paymentPayload);
            }
            if (cartPayment?.responseCode === 200) {
                props.notify("Transaction is Successful");
                if (!selectedcardInfo) {
                    SaveCardForFutureUse();
                }
                const emailResponse = await sendEmailToUserAfterPaymentAPI(
                    response?.data
                );
                const addHourResponse = await addHoursToEstimate(
                    {
                        "ProducId": selectedHours.id,
                        "Amount": cartResponseForBuyHours?.data?.grossTotal,
                        "Hours": selectedHours?.quantity,
                        "ProductDescription": selectedHours?.description
                    }

                );
                if (addHourResponse && emailResponse) {
                    setLoading(false);
                    history.push({
                        pathname: `${constants.ROUTE.HR_TEMPLATE_PAGE.PAYMENT_SUCCESS}/${cartPayment?.message}`,
                        state: {
                            refNo: param?.refNo,
                            id: param?.id,
                            fromCards: param?.fromCards,
                            paidItems: response?.data?.orderSummary?.items,
                            slicedCardNumber:
                                slicedCardNumber === ""
                                    ? selectedcardInfo.payment.item.cardNumber.slice(-4)
                                    : slicedCardNumber,
                            cardType: cardType || selectedcardInfo.payment.item.cardType,
                            expertHour: true,
                            balanceHours: addHourResponse?.data?.[0]?.totalPurchasedHours,
                            checkoutResponse: response,
                            emailResponse: emailResponse?.responseCode
                        },
                    });
                }
            } else {
                setLoading(false);
                const payload = {
                    // cartId: cartDetails.cartID,
                    reason: "payment failed",
                };
                history.push({
                    pathname: `${constants.ROUTE.HR_TEMPLATE_PAGE.PAYMENT_FAILED}`,
                    state: {
                        refNo: param?.refNo,
                        id: param?.id,
                        paidItems: response?.data?.orderSummary?.items,
                        slicedCardNumber:
                            slicedCardNumber === ""
                                ? selectedcardInfo.payment.item.cardNumber.slice(-4)
                                : slicedCardNumber,
                        cardType: cardType,
                        failure: true,
                        errors: cartPayment?.errors,
                    },
                });
                const paymentFailed = await paymentFailedAPI(payload);
                props.notify("Transaction is Failed");
                // history.push(constants.ROUTE.HR_TEMPLATE_PAGE.IN_YOUR_CART);
            }
        }


    };

    const callReviewOrderFunction = async () => {
        setPaymentLoading(true);
        setLoading(true);
        window.scrollTo(0, 0);
        let payload;
        if (selectedcardInfo) {
            payload = {
                Address: {
                    country: selectedcardInfo.billTo.country,
                    zipCode: selectedcardInfo.billTo.zip,
                },

                // AdditionalProductInfo: {
                //     "ProductId": selectedHours?.id,
                //     "ProductType": "expert-hour"
                // }
            };
        } else {
            payload = {
                Address: {
                    country: userData.country,
                    zipCode: userData.zipCode
                },
                // AdditionalProductInfo: {
                //     "ProductId": selectedHours.id,
                //     "ProductType": "expert-hour"
                // }
            };
        }
        console.log("payload", payload);
        const addToCartPayload = {
            "ProductId": selectedHours.id,
            "ProductType": "expert-hour"
        }
        const cartResponseForBuyHour = await addHoursToCart(addToCartPayload);
        setcartResponseForBuyHour(cartResponseForBuyHour);
        if (cartResponseForBuyHour?.data) {
            const response = await ReviewOrder(payload);
            if (response?.data) {
                if (response.data.items?.length <= 0) {
                    history.push(constants.ROUTE.HR_TEMPLATE_PAGE.DOC_SHOP);
                } else {
                    dispatch(getCartDetails({ userId }));
                    setOrderReviewed(true);
                    setSlicedCardNumber(userData.cardNumber.slice(-4));
                    setPaymentLoading(false);
                    setCard(true);
                    setOpenCardDetailsBox(false);
                    setLoading(false);
                    setOrderPreviewDataWithTax(response?.data);
                }
            }
        }
    };
    const datefn = () => {
        var today, someday;
        var months = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
        var exMonth = months[userData.expDate.split("/")[0] - 1];
        var exYear = "20" + userData.expDate.split("/")[1];
        today = new Date();
        someday = new Date();
        someday.setFullYear(exYear, exMonth, new Date().getDate());

        if (someday < today) {
            return true;
        }
    };

    const callValidationForPaymentFields = () => {
        if (!selectedHours) {
            setSelectedHourError("Please select an hour")
        }
        if (
            !userData.cardNumber.length ||
            userData.cardNumber.length < 8 ||
            userData.cardNumber.length > 16
        ) {
            setCarderror("Invalid Card Number");
        } else {
            setCarderror("");
        }
        if (!userData.name.length) {
            setNameError("Name must not be Empty");
        } else {
            setNameError("");
        }
        if (userData.cvv.length < 3) {
            setCvvError("Minimum 3 digits needed");
        } else {
            setCvvError("");
        }
        if (userData.expDate.length < 5) {
            setExpDateerror("Invalid Date");
        } else {
            if (datefn()) {
                setExpDateerror("card expired");
            } else {
                setExpDateerror("");
            }
        }

        if (!userData.address.length) {
            setAddressError("Field cannot be empty");
        } else {
            setAddressError("");
        }
        if (!userData.country.length) {
            setCountryError("Field cannot be empty");
        } else {
            setCountryError("");
        }
        if (userData?.country?.toLowerCase() === "usa") {
            /** making state mandatory only if user selects country USA
             * otherwise state selection is not mandatory */
            if (!userData.state.length) {
                setStateError("Field cannot be empty");
            } else {
                setStateError("");
            }
        }
        if (!userData.zipCode.length) {
            setZipsError("Field cannot be empty");
        } else {
            setZipsError("");
        }
        if (
            userData.cardNumber.length &&
            userData.cardNumber.length >= 8 &&
            userData.cardNumber.length <= 16 &&
            (userData.cvv.length === 3 || userData.cvv.length === 4) &&
            userData.expDate.length === 5 &&
            !datefn() &&
            userData.name.length &&
            userData.address.length &&
            userData.country.length &&
            (userData?.country?.toLowerCase() === "usa"
                ? userData.state.length
                : true) &&
            userData.zipCode.length &&
            selectedHours
        ) {
            return true;
        }
        return false;
    };

    const SaveCardForFutureUse = async () => {
        if (userData.futureUse) {
            const payload = {
                UserId: userId,
                BillingAddress: {
                    Address: userData.address,
                    City: userData.aptSuite,
                    State: userData.state,
                    Zip: userData.zipCode,
                    Country: userData.country,
                },
                PaymentProfile: {
                    CreditCard: {
                        CardNumber: userData.cardNumber,
                        ExpirationDate: `20${userData.expDate[3] + userData.expDate[4]}-${userData.expDate[0] + userData.expDate[1]
                            }`,
                        CardCode: userData.cvv,
                    },
                },
            };
            const res = await callSaveCardForFutureUse(payload);
            if (res.responseCode !== 200) {
                props.notify("cards saving failed");
            }
        }
    };

    const handleSave = async (type) => {
        const isValid = selectedcardInfo && selectedHours ? true : callValidationForPaymentFields();
        if (isValid) {
            setHome(false);
            if (orderReviewed) {
                callCheckoutAndPaymentFunction();
            } else {
                // if (cartDetails.cartID) {
                callReviewOrderFunction();
                // }
            }
        }
    };
    const deleteCart = async (id) => {
        setLoading(true);
        await dispatch(deleteCartItem({ id }));
    };
    const handlePreviousPage = () => {
        if (orderReviewed) {
            setOrderPreviewDataWithTax();
            setOrderReviewed(false);
            setSlicedCardNumber();
            // getAllCartDetails();
            if (userData.futureUse) {
                getSavedCardDetails();
            }
            selectedcardInfo
                ? setOpenCardDetailsBox(false)
                : setOpenCardDetailsBox(true);
        } else {
            history.goBack()
        }
    };
    const handleHours = (value) => {
        let selectedValue = value;
        const requiredHours = Math.ceil(10 - balanceHour);
        if (value.quantity === 10 && requiredHours > 0) {
            selectedValue = hourList.filter(item => {
                return item.quantity === requiredHours;
            })[0]
        }
        console.log("selectedValue", selectedValue)
        setSelectedHours(selectedValue);
        setExpertHour(value)
        setSelectedHourError("")
    }
    const cardPayment = () => {
        setCard(!card);
    };
    const savedCardPayment = (selectedcardInfo, e) => {
        setUserData({
            name: "",
            expDate: "",
            cardNumber: "",
            cvv: "",
            address: "",
            aptSuite: "",
            country: "",
            state: "",
            zipCode: "",
        });

        setSavedCardSelected(!savedCardSelected);
        setCardType();
        setSlicedCardNumber();
        setOpenCardDetailsBox(false);
        const processedSavedCards =
            savedCardDetails?.value?.profile?.paymentProfiles.map((cards) => {
                if (
                    cards.customerPaymentProfileId ===
                    selectedcardInfo.customerPaymentProfileId
                ) {
                    return {
                        ...cards,
                        selected: true,
                    };
                } else {
                    return {
                        ...cards,
                    };
                }
            });
        setSavedCardsDetailsList({
            ...savedCardDetails,
            value: {
                ...savedCardDetails.value,
                profile: {
                    ...savedCardDetails.value.profile,
                    paymentProfiles: processedSavedCards,
                },
            },
        });
        setSelectedCardInfo(
            processedSavedCards.filter((cards) => {
                return (
                    cards.customerPaymentProfileId ===
                    selectedcardInfo.customerPaymentProfileId
                );
            })[0]
        );
    };
    console.log("selectedcardInfo", selectedcardInfo);

    const onCancelClickListner = () => {
        setOpenModal(false);
        setDeleteProfile();
        setDeleteCardDetail();
    };

    const deleteApi = async () => {
        setSelectedCardInfo();
        const payload = {
            customerProfileId: deleteProfile.customerProfileId,
            customerPaymentProfileId: deleteCardDetail.customerPaymentProfileId,
        };
        const response = await callDeleteSavedCard(payload);
        setLoading(true);
        setOpenModal(false);
        if (response.responseCode === 200) {
            setDeleteProfile();
            setDeleteCardDetail();
            getSavedCardDetails();
        }
    };
    const deleteSavedCard = async (profile, card) => {
        setOpenModal(true);
        setSavedCardsDetailsList(savedCardDetails);
        setDeleteProfile(profile);
        setDeleteCardDetail(card);
    };
    const callDocumentList = async (searchText) => {
        // // clearFilters()
        // const res = await dispatch(
        //   getAllDocumentList({
        //     searchterm: searchText,
        //   })
        // );
        // console.log("res", res.payload.data.data);
        // return res.payload.responseCode;
    };

    useEffect(() => {
        if (openCardDetailsBox && selectedcardInfo) {
            setUserData({
                name: "",
                expDate: "",
                cardNumber: "",
                cvv: "",
                address: "",
                aptSuite: "",
                country: "",
                state: "",
                zipCode: "",
            });

            // setSavedCardSelected(false);
            setSavedCardsDetailsList(savedCardDetails);
            setSelectedCardInfo();
        } else {
        }
    }, [openCardDetailsBox]);
    /**end */
    return (
        <div className="loader-enable">
            {loading && (
                <div className="custom-loader h-full-loader">
                    <Loader />
                </div>
            )}
            <SearchBar
                placeholder="Ask a question"
            />
            <div className="sub-container">

                <div className="breadcrumb-wrapper">
                    <div className="breadcrump-admin mt-3 mb-3">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb pl-0">
                                {
                                    param?.fromCards ?
                                        <li className="breadcrumb-item  pointer link"><span onClick={() => history.push("/")}>Home</span></li>
                                        :
                                        <>
                                            <li className="breadcrumb-item"><span>Settings</span></li>
                                            <li className="breadcrumb-item pointer link"><span onClick={() => history.push(constants.ROUTE.SIDEBAR.SETTINGS.PURCHASE_EXPERT_BRIEFS)}>Purchases & Expert Briefs</span></li>
                                        </>
                                }
                                {
                                    param?.refNo && param?.id &&
                                    <li className="breadcrumb-item pointer link" aria-current="page"
                                        onClick={() => history.push(
                                            `${constants.ROUTE.SIDEBAR.SETTINGS.CLIENT_VIEW_ESTIMATE}/${param?.refNo}/${param?.id}`
                                        )}
                                    >Approve Estimate</li>
                                }
                                <li className="breadcrumb-item active" aria-current="page">Buy More Hours</li>
                            </ol>
                        </nav>
                    </div>
                </div>
                <div className="add-more-hours-container">
                    <div className="add-more-hours-wrap">
                        <h4 className="prev-page">Buy More Hours</h4>
                        <div
                            className="back-btn-arrow"
                            onClick={() =>
                                handlePreviousPage()
                            }
                        >
                            <img src={back_arrow} />
                        </div>
                    </div>
                    <div className="buy-hours-review-payment mb-5">
                        <AddMoreHoursLeftWrapper
                            orderPreview={orderPreviewDataWithTax}
                            orderReviewed={orderReviewed}
                            selectedHours={expertHour}
                            handleHours={handleHours}
                            numberFormat={numberFormat}
                            requiredHours={parseFloat((10 - balanceHour)?.toFixed(2))}
                            balanceHour={parseFloat((balanceHour)?.toFixed(2))}
                            selectedHourError={selectedHourError}
                            hourList={hourList?.length > 0 ?
                                generateOptions(hourList.filter(it => {
                                    return it.visibility
                                }), "id", "productName") :
                                []}
                        />
                        <PaymentSummaryWrap
                            handleCardDetails={handleCardDetails}
                            userData={userData}
                            nameError={nameError}
                            cardError={cardError}
                            handleChange={handleChange}
                            expDateerror={expDateerror}
                            cvvError={cvvError}
                            addressError={addressError}
                            countryError={countryError}
                            stateError={stateError}
                            zipError={zipError}
                            handleCardForFutureUse={handleCardForFutureUse}
                            handleSave={handleSave}
                            paymentLoading={paymentLoading}
                            home={home}
                            canPaymentWithAvailableCredit={canPaymentWithAvailableCredit}
                            slicedCardNumber={slicedCardNumber}
                            orderReviewed={orderReviewed}
                            cardPayment={cardPayment}
                            card={card}
                            setOpenCardDetailsBox={setOpenCardDetailsBox}
                            openCardDetailsBox={openCardDetailsBox}
                            cardType={cardType}
                            savedCardDetails={savedCardsDetailsList}
                            savedCardPayment={savedCardPayment}
                            savedCardSelected={savedCardSelected}
                            selectedcardInfo={selectedcardInfo}
                            deleteSavedCard={deleteSavedCard}
                            countries={countries}
                            allStates={allStates}
                            handleCountryCardDetails={handleCountryCardDetails}
                            initializeCallErrors={initializeCallErrors}
                            expertHour={true}
                        />

                    </div>
                </div>
            </div>
            {openModal && (
                <Modal
                    show={openModal}
                    onHide={onCancelClickListner}
                    backdrop="static"
                    keyboard={false}
                    centered={true}
                    contentClassName="remove-saved-card"
                >
                    <Modal.Header className="role_header_model" closeButton>
                        <Modal.Title>
                            <div className="d-flex modal-country align-items-center">
                                <div className="">
                                    Remove{" "}
                                    {deleteCardDetail?.payment?.item?.cardType?.toLowerCase() ===
                                        "visa"
                                        ? "Visa card"
                                        : deleteCardDetail?.payment?.item?.cardType?.toLowerCase() ===
                                            "mastercard"
                                            ? "Mastercard"
                                            : deleteCardDetail?.payment?.item?.cardType?.toLowerCase() ===
                                                "amex" ||
                                                deleteCardDetail?.payment?.item?.cardType?.toLowerCase() ===
                                                "americanexpress"
                                                ? "AMEX Card "
                                                : ""}{" "}
                                    ending in {deleteCardDetail.payment.item.cardNumber.slice(-4)}
                                    ?
                                </div>
                            </div>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="role_body_model">
                        You will no longer see this payment method listed in your saved
                        payment methods.
                    </Modal.Body>
                    <Modal.Footer className="role_footer_model">
                        <Button variant="secondary" onClick={onCancelClickListner}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={deleteApi}>
                            Remove
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div >

    )
}

export default AddMoreHoursPayment;