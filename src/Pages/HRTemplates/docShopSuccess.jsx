import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import sortArrow from "../../assets/images/sort-arrows.svg";
import authorDP from "../../assets/images/author.png";
import searchIcon from "../../assets/images/search.svg";
import { Checkbox } from "primereact/checkbox";
import { getArticles } from "../../Store/reducers/country";
import { useDispatch, useSelector } from "react-redux";
import SupportButton from "../../Components/SupportButton";
import constants from "../../utils/constants";
import KnowledgeBaseHeader from "../KnowledgeBase/KnowledgeBaseHeader";
import profile_img from "../../assets/images/dp.jpeg";
import dollarIcon from "../../assets/images/payment-dollar.svg";
import masterCardIcon from "../../assets/images/master-card.svg";
import plusIcon from "../../assets/images/plus-circle-fill.svg";
import { downloadSuccessfulInvoice } from "../../Store/reducers/HRTemplate";
import { downloadFile } from "../../utils/utils";
import { Spinner } from "react-bootstrap";
import { getRemainingHours } from "../../Store/reducers/Purchase_ExpertBriefs";

import Loader from "../../Components/Loader";
import moment from "moment";
const InYourCart = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const paidItems = history?.location?.state?.paidItems;
  const slicedCardNumber = history?.location?.state?.slicedCardNumber;
  const cardType = history?.location?.state?.cardType;
  const emailResponse = history?.location?.state?.emailResponse;
  const checkoutResponse = history?.location?.state?.checkoutResponse;
  const failure = history?.location?.state?.failure;
  const errors = history?.location?.state?.errors;
  const expertHour = history?.location?.state?.expertHour;
  const refNo = history?.location?.state?.refNo;
  const id = history?.location?.state?.id;
  const fromCards = history?.location?.state?.fromCards;

  // const balanceHours = history?.location?.state?.balanceHours;

  const balanceHour = useSelector(
    (state) => state?.purchaseExpertReducer?.balanceHours?.availableHours
  );
  document.title = failure ? "Payment failed" : "Payment Successful";

  const [loading, setLoading] = useState(false);
  const [isSearchText, setSearchTextClear] = useState(false);

  const downloadDocument = (doc) => {
    window.open(constants.API.COUNTRY.GET_FLAG_DOWNLOAD + doc.id, "_blank");
  };

  useEffect(() => {
    if (emailResponse !== 200) {
      props.notify(" Email Sending Failed!");
    }
  }, [emailResponse]);

  useEffect(() => {
    if (expertHour) {
      dispatch(getRemainingHours());
    }
  }, [expertHour]);

  const getCardType = () => {
    if (cardType?.toLowerCase() === "visa") {
      return "VISA";
    } else if (cardType?.toLowerCase() === "mastercard") {
      return "MASTER";
    } else if (cardType?.toLowerCase() === "amex") {
      return "AMEX";
    }
  };

  const downloadInvoice = async (payload) => {
    // window.open(constants.API.COUNTRY.GET_FLAG_DOWNLOAD + doc.id, "_blank");
    setLoading(true);
    const invoiceResponse = await downloadSuccessfulInvoice(payload);
    if (invoiceResponse) {
      setLoading(false);
      const url = window.URL.createObjectURL(new Blob([invoiceResponse]));
      downloadFile(url, "invoice.pdf");
    }
  };

  return (
    <div data-test="doc-shop-success-wrap">
      {/* {loading && (
        <div className="custom-loader">
          <Loader />
        </div>
      )} */}
      <div data-test="insight">
        <SupportButton />

        <KnowledgeBaseHeader
          {...props}
          title="Doc Shop"
          doc_shop={true}
          className="knowledge-header-container doc-shop-header"
          cartLength={0}
          setSearchTextClear={setSearchTextClear}
          redirectToHrTemplate={true}
        />
        <div className="knowledge-content-container doc-cart-container">
          {fromCards && (
            <div className="breadcrumb-wrapper">
              <div className="breadcrump-admin mt-3 mb-3">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb pl-0">
                    <li className="breadcrumb-item pointer link">
                      <span
                        data-test="home-navigate"
                        onClick={() => history.push("/")}
                      >
                        Home
                      </span>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Buy More Hours
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          )}

          {refNo && id && (
            <div className="breadcrumb-wrapper">
              <div className="breadcrump-admin mt-3 mb-3">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb pl-0">
                    <li className="breadcrumb-item">
                      <span>Settings</span>
                    </li>
                    <li className="breadcrumb-item pointer link">
                      <span
                        data-test="purchase-expert-briefs"
                        onClick={() =>
                          history.push(
                            constants.ROUTE.SIDEBAR.SETTINGS
                              .PURCHASE_EXPERT_BRIEFS
                          )
                        }
                      >
                        Purchases & Expert Briefs
                      </span>
                    </li>
                    <li
                      className="breadcrumb-item pointer link"
                      aria-current="page"
                      data-test="client-view-estimate"
                      onClick={() =>
                        history.push(
                          `${constants.ROUTE.SIDEBAR.SETTINGS.CLIENT_VIEW_ESTIMATE}/${refNo}/${id}`
                        )
                      }
                    >
                      Approve Estimate
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Buy More Hours
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          )}
          <div
            className={`doc-cart-wrap ${
              failure ? "payment-failure" : "payment-success"
            }`}
          >
            <h4>Purchase {failure ? "Failed" : "Successful"}</h4>
            {failure &&
              errors?.length > 0 &&
              errors.map((it,index) => {
                return <div className="ml-5" key={index}>{it}</div>;
              })}
            {expertHour && (
              <p className="mx-5">
                Your new balance : {Math.round(balanceHour)}
              </p>
            )}
            {!failure && emailResponse === 200 && !expertHour && (
              <span>
                The template has been sent to{" "}
                <span>
                  {
                    JSON.parse(localStorage.getItem("userProfileDetails"))
                      .emailId
                  }
                </span>
              </span>
            )}
            {!expertHour &&
              paidItems &&
              paidItems.map((item,index) => {
                return (
                  <div className="doc-orders" key={index}>
                    <div className="doc-order">
                      <div className="doc-order-details">
                        <h4 className="doc-item-name">
                          {item?.docProduct?.document?.document?.title}
                        </h4>
                        <h5>{item?.docProduct?.document?.countryName}</h5>
                        <span>{item?.docProduct?.languageName}</span>
                      </div>
                      {!failure && (
                        <button
                          data-test="download-document"
                          className="download-template-btn"
                          onClick={() =>
                            downloadDocument(item?.docProduct?.upload)
                          }
                        >
                          Download Template
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            {!failure && (
              <div className="ml-5 mt-3 text-master-card">
                Payment processed through {getCardType()}CARD ending in{" "}
                <span>{slicedCardNumber}</span>
              </div>
            )}
            {!failure && (
              <div className="payment-footer">
                {!expertHour && (
                  <h5>
                    You now have{" "}
                    <strong>
                      {paidItems ? paidItems.length : ""} HR Templates
                    </strong>{" "}
                    available for download.
                  </h5>
                )}
                <span>Invoice is saved in Purchases within Settings.</span>
                <div className="link-group">
                  <a
                    data-test="download-btn-click"
                    onClick={() => downloadInvoice(checkoutResponse?.data)}
                    className="pointer"
                  >
                    Download Invoice
                  </a>
                  {loading && (
                    <Spinner
                      className="specifics-loading-spinner mx-2 "
                      animation="border"
                      size="sm"
                    />
                  )}
                  {/* <a>Share Invoice</a> */}
                </div>
              </div>
            )}
          </div>
          {!expertHour && (
            <button
              type="button"
              data-test="doc-shop-navigate"
              className="btn btn-outline-primary home-Button-margin"
              onClick={() => {
                history.push(`${constants.ROUTE.HR_TEMPLATE_PAGE.DOC_SHOP}`);
              }}
            >
              Back To Shop
            </button>
          )}
          {refNo && id && (
            <button
              type="button"
              className="estimate-approval-primary-btn home-Button-margin"
              onClick={() => {
                history.push(
                  `${constants.ROUTE.SIDEBAR.SETTINGS.CLIENT_VIEW_ESTIMATE}/${refNo}/${id}`
                );
              }}
            >
              Continue to Estimate Approval
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default InYourCart;
