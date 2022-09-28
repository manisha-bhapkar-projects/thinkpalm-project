import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import constants from "../../utils/constants";
import dollarIcon from "../../assets/images/payment-dollar.svg";
import masterCardIcon from "../../assets/images/master-card.svg";
import visaCard from "../../assets/images/logos_visaelectron.svg";
import masterCard from "../../assets/images/grommet-icons_mastercard.svg";
import americanExpress from "../../assets/images/fontisto_american-express.svg";
import TextFieldComponent from "../../Components/TextFieldComponent/TextFieldComponent";
import { Spinner } from "react-bootstrap";
import AddNewPayment from "../../assets/images/add-new-payment.svg";
import closeCard from "../../assets/images/closeCard.svg";
import ReactDropdown from './../../Components/CustomeSelectDropDown/reactDropdown';
import { generateOptions, getSelectedOption } from "../../utils/utils"

const PaymentSummaryWrap = (props) => {
  const history = useHistory();

  const {
    handleCardDetails,
    userData,
    nameError,
    cardError,
    handleChange,
    expDateerror,
    cvvError,
    addressError,
    countryError,
    stateError,
    zipError,
    handleCardForFutureUse,
    handleSave,
    paymentLoading,
    savedCardPayment,
    card,
    slicedCardNumber,
    orderReviewed,
    openCardDetailsBox,
    setOpenCardDetailsBox,
    cardType,
    savedCardDetails,
    selectedcardInfo,
    deleteSavedCard,
    countries,
    handleCountryCardDetails,
    allStates,
    initializeCallErrors,
    savedCardSelected,
    expertHour
  } = props;
  const addNewPaymentMethod = () => {
    return (
      <div className="payment-method border-0 p-0 align-items-center add-new-payment-method" >
        <div className="new-payment" data-test="addFields">
          {!openCardDetailsBox && (
            <div
              data-test="add-new-payment-wrapper"
              className="add-new-payment "
              onClick={() => {
                setOpenCardDetailsBox(true);
                initializeCallErrors()
              }}
            >
              <img src={AddNewPayment} alt="add" />
              <span className="m-2">Add New Payment Method</span>
            </div>
          )}
          {openCardDetailsBox && (
            <>
              <div className="new-payment-container" data-test="new-payment-wrapper">
                <h3>Pay Using Credit Card</h3>
                <span className="ml-auto my-2">
                  <img
                    className={cardType === "Visa" ? "card-type" : ""}
                    src={visaCard}
                    alt=""
                  />
                  <img
                    className={cardType === "Mastercard" ? "card-type" : ""}
                    src={masterCard}
                    alt=""
                  />
                  <img
                    className={cardType === "AMEX" || cardType === "americanexpress" ? "card-type" : ""}
                    src={americanExpress}
                    alt=""
                  />
                </span>
                <div className="form-payment">
                  <TextFieldComponent
                    type="text"
                    id="Name"
                    name="Name"
                    onChange={handleCardDetails}
                    placeholder="Card Holder Name"
                    label="Card Holder Name*"
                    dataContent="Card Holder Name*"
                    value={userData.name}
                    data-test="name"
                    inputClassName={nameError && "border-red-validation"}
                  />
                  {/* <span className="validation-message">{nameError}</span> */}
                </div>
                <div className="form-payment">
                  <TextFieldComponent
                    type="number"
                    id="Name"
                    name="card number"
                    className="number-input"
                    min={1}
                    pattern="[0-9]"
                    maxLength={16}
                    placeholder="Card Number"
                    onChange={handleCardDetails}
                    value={userData.cardNumber}
                    label="Card Number*"
                    dataContent="Card Number*"
                    data-test="number"
                    inputClassName={cardError && "border-red-validation"}
                  />
                  {/* <span className="validation-message">{cardError}</span> */}
                </div>
                <div className="form-payment cvv-container">
                  <TextFieldComponent
                    type="text"
                    id="Name"
                    name="expDate"
                    keyboardType="numeric"
                    maxLength={5}
                    onChange={handleChange}
                    placeholder="Expiration"
                    label="Expiration(MM/YY)*"
                    dataContent="Expiration(MM/YY)*"
                    value={userData.expDate}
                    data-test="expHandleChange"
                    inputClassName={expDateerror && "border-red-validation"}

                  />
                  {/* <span className="validation-message">{expDateerror}</span> */}

                  <div className="cvv">
                    <TextFieldComponent
                      type="number"
                      id="Name"
                      name="cvv"
                      className="number-input"
                      onChange={handleCardDetails}
                      placeholder="CVV"
                      label="CVV*"
                      dataContent="CVV*"
                      value={userData.cvv}
                      data-test="cvv"
                      inputClassName={cvvError && "border-red-validation"}

                    />
                    {/* <span className="validation-message">{cvvError}</span> */}
                  </div>
                </div>
              </div>
              <div className="new-payment-container">
                <h3 className="billing-margin">Billing Address</h3>

                <div className="form-payment">
                  <TextFieldComponent
                    type="text"
                    id="Street Address"
                    name="Street Address"
                    onChange={handleCardDetails}
                    placeholder="Street Address"
                    label="Street Address*"
                    dataContent="Street Address"
                    value={userData.address}
                    inputClassName={addressError && "border-red-validation"}

                  />
                  {/* <span className="validation-message">{addressError}</span> */}
                </div>
                <div className="form-payment">
                  <TextFieldComponent
                    type="text"
                    id="Apt/Suite"
                    name="Apt/Suite"
                    placeholder="Apt/Suite (Optional)"
                    onChange={handleCardDetails}
                    value={userData.aptSuite}
                    label="Apt/Suite (Optional)"
                    dataContent="Apt/Suite (Optional)"
                  />
                </div>
                <div className="cvv-container">
                  <div className="width-form-payment">
                    <div className="form-group">
                      <ReactDropdown
                        id="Country"
                        name="Country"
                        htmlFor="Country*"
                        testid="country-input"
                        data_content="Country*"
                        title="Country"
                        showArrow={true}
                        isDisabled={countries?.length > 0 ? false : true}
                        Prefilled={
                          getSelectedOption(userData?.country_id
                            && JSON.parse(userData.country_id),
                            countries &&
                            generateOptions(countries, "id", "country_Name")) || ""
                        }
                        data-test="handleCountryDetails"
                        data={countries?.length > 0 && generateOptions(countries, "id", "country_Name")}
                        onChange={(value) => handleCountryCardDetails("country", value)}
                      />
                      {/* </div> */}
                      {/* {editEmail && <span onClick={() => onEditFromData(true)}>Edit</span>} */}
                    </div>
                    {/* <TextFieldComponent
                      type="text"
                      id="Country"
                      keyPress="user"
                      name="Country"
                      onChange={(e) => handleCardDetails(e)}
                      placeholder="Country*"
                      label="Country*"
                      dataContent="Country*"
                      value={userData.country}
                    /> */}
                    <span className="validation-message">
                      {countryError}
                    </span>
                  </div>

                  <div className="cvv">
                    <div className="form-group">
                      <ReactDropdown
                        id="State"
                        name="State"
                        htmlFor="State"
                        testid="state-input"
                        data_content="State"
                        title="State"
                        showArrow={true}
                        inputClassName={stateError && "border-red-error"}
                        enableSearch={allStates?.length > 0 ? true : false}
                        Prefilled={
                          getSelectedOption(userData?.state_id
                            && JSON.parse(userData.state_id),
                            allStates &&
                            generateOptions(allStates, "id", "state_Name")) || ""
                        }
                        data={allStates?.length > 0 ? generateOptions(allStates, "id", "state_Name") : []}
                        onChange={(value) => handleCountryCardDetails("state", value)}
                      />
                      {/* </div> */}
                      {/* {editEmail && <span onClick={() => onEditFromData(true)}>Edit</span>} */}
                    </div>
                    {/* <TextFieldComponent
                      type="text"
                      id="State"
                      keyPress="user"
                      name="State"
                      onChange={handleCardDetails}
                      placeholder="State"
                      label="State"
                      dataContent="State"
                      value={userData.state}
                    /> */}
                    {/* <span className="validation-message">{stateError}</span> */}
                  </div>
                </div>
              </div>
              <div className="agree-container mt-5">
                <div className="d-flex flex-row form-payment">
                  <div className="width-form-payment">
                    <TextFieldComponent
                      type="text"
                      id="Zip code"
                      name="Zip code"
                      keyPress="zipCode"
                      placeholder="Zip code*"
                      className="number-input"
                      onChange={handleCardDetails}
                      min="0"
                      value={userData.zipCode}
                      label="Zip code*"
                      dataContent="Zip code*"
                    />
                    <span className="validation-message">{zipError}</span>
                  </div>
                  <div className="align-items-end d-flex ml-2 pb-2 taxcalc">
                    Tax is calculated based on location.
                  </div>
                </div>
                <div className="checkbox-wrapper p-0">
                  <label className="tab-checkbox check-box-text">
                    Save payment details for future use
                    <input
                      type="checkbox"
                      onChange={(e) => handleCardForFutureUse(e)}
                      checked={
                        userData?.futureUse ? userData.futureUse : false
                      }
                      value=""
                      data-test="employeeCheck"
                    />
                    <span className="checkmark" />
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }
  const getBtnStatus = () => {
    if (openCardDetailsBox || (card && !selectedcardInfo)) {
      if (userData.zipCode != "" && userData.country != "") {
        return false;
      } else {
        return true;
      }
    } else if (selectedcardInfo?.selected) {
      return false
    }
    else {
      return true;
    }
  };

  return (
    <div className="doc-payment-wrap position-relative" data-test="payment-summary-wrap">
      <div>
        <span>PAYMENT METHOD</span>
        {/* <a
          style={{
            color: "#40659E",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Manage Payment Methods
        </a> */}
      </div>
      <div className="payment-methods py-4">
        {(slicedCardNumber && orderReviewed) || (selectedcardInfo && orderReviewed) ? (
          <div
            data-test="payment-card"
            className={
              card
                ? "payment-method selected  align-items-center"
                : "payment-method pointer align-items-center"
            }
          >
            <div className="payment-method-desc col-11">
              <span>
                {(cardType === "Visa") || (selectedcardInfo?.payment?.item?.cardType?.toLowerCase() === "visa")
                  ? <span data-test="visa"><img
                    src={visaCard}
                    className="cardlogo"
                    alt=""
                  /> Visa card </span>
                  : (cardType === "Mastercard") || (selectedcardInfo?.payment?.item?.cardType?.toLowerCase() === "mastercard")
                    ? <span><img
                      src={masterCard}
                      alt=""
                      className="cardlogo"
                    /> Mastercard </span>
                    : (cardType === "AMEX") || (cardType === "americanexpress") || (selectedcardInfo?.payment?.item?.cardType?.toLowerCase() === "amex") || (selectedcardInfo?.payment?.item?.cardType?.toLowerCase() === "americanexpress")
                      ? <span><img
                        src={americanExpress}
                        alt=""
                        className="cardlogo"
                      /><span> AMEX Card </span></span>
                      : " Card "}
                <span className="color-light-grey card-ending">ending in </span>
                <span className="card-sliced-number">
                  {slicedCardNumber || selectedcardInfo?.payment?.item?.cardNumber.slice(-4)}
                </span>
              </span >
            </div >
          </div >
        ) : savedCardDetails ?
          <>
            {savedCardDetails?.value?.profile?.paymentProfiles.map((cards, key) => {
              return (
                <div
                  key={key}
                  data-test="saved-card-payment-method"
                  className={
                    cards.selected
                      ? "payment-method selected  align-items-center justify-content-between"
                      : "payment-method  align-items-center justify-content-between"
                  }

                >
                  <div className="payment-method-desc col-11 py-4 pointer" data-test="save-card-click"
                    onClick={(e) => savedCardPayment(cards, e)}>
                    <span>
                      {cards?.payment?.item?.cardType?.toLowerCase() === "visa"
                        ? <span data-test="saved-card-visa"><img
                          src={visaCard}
                          className="cardlogo"
                          alt=""
                        /> Visa card </span>
                        : cards?.payment?.item?.cardType?.toLowerCase() === "mastercard"
                          ? <span><img
                            src={masterCard}
                            alt=""
                            className="cardlogo"
                          /> Mastercard </span>
                          : cards?.payment?.item?.cardType?.toLowerCase() === "amex" || cards?.payment?.item?.cardType?.toLowerCase() === "americanexpress"
                            ? <span><img
                              src={americanExpress}
                              alt=""
                              className="cardlogo"
                            /><span> AMEX Card </span></span>
                            : " "}
                      <span className="color-light-grey card-ending">  ending in </span>
                      <span className="card-sliced-number">
                        {cards?.payment?.item?.cardNumber?.slice(-4)}

                      </span>
                    </span >
                  </div >
                  <img src={closeCard} className="mr-3 pointer" data-test="delete-btn-click" onClick={() => deleteSavedCard(savedCardDetails?.value?.profile, cards)} />
                </div >
              )

            })}
            {addNewPaymentMethod()}
          </>

          :
          addNewPaymentMethod()
        }
      </div >
      <div className="review-btn-group justify-content-end position-absolute right-0">{
        !expertHour &&
        <button
          type="button"
          className="btn btn-outline-primary"
          data-test="back-to-shop-btn"
          onClick={() => {
            history.push(`${constants.ROUTE.HR_TEMPLATE_PAGE.DOC_SHOP}`);
          }}
        >
          Back To Shop
        </button>
      }
        <button
          data-test="save"
          className=" btn btn-primary"
          disabled={getBtnStatus()}
          onClick={handleSave}
        >
          <span>
            {paymentLoading ? <Spinner animation="border" size="sm" /> : null}
            &nbsp;
            {orderReviewed
              ? "Complete Purchase"
              : "Review Order"}
          </span>
        </button>
      </div>
    </div >
  );
};
export default PaymentSummaryWrap;
