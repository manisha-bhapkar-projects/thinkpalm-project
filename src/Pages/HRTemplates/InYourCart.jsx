import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/* Icons */

import cart_body_icon from "../../assets/images/cart-body-icon.svg";
import back_arrow from "../../assets/images/back-btn.svg";

/* Component */
import SupportButton from "../../Components/SupportButton";
import Loader from "../../Components/Loader";
import KnowledgeBaseHeader from "../KnowledgeBase/KnowledgeBaseHeader";
import constants from "../../utils/constants";
import OpenModal from "../Settings/User_and_Accounts/OpenModal";

/* Action */
import {
  getCartDetails,
  deleteCartItem,
  getAllDocumentList,
  addToCartAPI,
  getTemplateDetails,
} from "../../Store/reducers/HRTemplate";

const InYourCart = (props) => {
  document.title = "Your Cart";
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoader] = useState(false);
  const [skipPagination, SetSkipPagination] = useState(true);
  const [cardIds, setCardIds] = useState([]);
  const [myItemList, setMyItems] = useState([]);
  const [countryIdsInCarts, setCountryIdsInCart] = useState([]);
  const [item, setItem] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [previewLanguage, setPreviewLanguage] = useState();
  const [selectedTemplate, setSelectedTemplate] = useState();
  const [languages, setLanguageList] = useState([]);
  const [btnLoading, setBtnLoader] = useState(false);
  const [isSearchText, setSearchTextClear] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoCodeVAlidation, setPromoCodeVAlidation] = useState("");
  const userId = "00000000-0000-0000-0000-000000000000";
  const cartDetails = useSelector((state) => state?.HRTemplate?.cartDetails);
  const cartListLoading = useSelector(
    (state) => state?.HRTemplate?.cartListLoading
  );
  const itemId = useSelector((state) => state?.HRTemplate?.itemId);
  const countryId = useSelector((state) => state?.HRTemplate?.countryId);
  const documentList = useSelector(
    (state) => state?.HRTemplate?.documentList?.data
  );
  const docListLoading = useSelector(
    (state) => state?.HRTemplate?.docListLoading
  );
  const deleteCartSuccess = useSelector(
    (state) => state?.HRTemplate?.deleteCartSuccess
  );
  const cartSuccess = useSelector((state) => state?.HRTemplate?.cartSuccess);

  //this contains clicked template details
  const templateDetailsLoading = useSelector(
    (state) => state?.HRTemplate?.templateDetailsLoading
  );
  const templateDetails = useSelector(
    (state) => state?.HRTemplate?.templateDetails
  );
  //end

  useEffect(() => {
    if (cartListLoading) {
      setLoader(true);
    } else {
      setLoader(false);
    }
  }, [cartListLoading]);

  useEffect(() => {
    dispatch(getCartDetails({ userId }));
  }, []);

  useEffect(() => {
    if (
      !templateDetailsLoading &&
      templateDetails &&
      Object.keys(templateDetails)?.length > 0
    ) {
      setSelectedTemplate(templateDetails);
      const selectedLanguage = templateDetails?.documentUploads?.filter(
        (it) => it.id === item.documentUploadId
      );
      setPreviewLanguage(selectedLanguage?.[0]);
      setLanguageList(templateDetails?.documentUploads);

      setLoader(false);
      setShowModal(true);
    } else if (templateDetailsLoading) {
      setLoader(true);
    }
  }, [templateDetailsLoading, templateDetails]);

  useEffect(async () => {
    if (deleteCartSuccess) {
      props.notify("Item removed from cart");
      await dispatch(deleteCartItem({ success: true }));
    }
  }, [deleteCartSuccess]);

  useEffect(async () => {
    if (cartSuccess == 200) {
      props.notify("Item added to cart");
      window.scrollTo(0, 0);
      await dispatch(addToCartAPI({ success: true }));
    }
  }, [cartSuccess]);

  useEffect(() => {
    // let cartIds = cartDetails?.items?.map((item) => {
    //   debugger;
    //   return item?.docProduct?.id;
    // });
    // setCardIds(cartIds);
    if (cartDetails?.items?.length === 0) {
      history.push("/doc-shop");
    }
    let countryIdsInCart = cartDetails?.items?.map((item) => {
      return item?.docProduct?.document?.countryId;
    });
    setCountryIdsInCart(countryIdsInCart);
  }, [cartDetails]);

  useEffect(() => {
    if (countryIdsInCarts?.length > 0) {
      dispatch(
        getAllDocumentList({
          skipPagination,
          countryIds: countryIdsInCarts,
        })
      );
    }
  }, [countryIdsInCarts]);

  useEffect(() => {
    if (!docListLoading && !cartListLoading) {
      let cartIds = cartDetails?.items?.map((item) => {
        return item?.docProduct?.id;
      });
      setCardIds(cartIds);
      setShowModal(false);

      // let myItems = documentList?.filter((data) => {
      //   return cartIds?.includes(data?.document?.categoryId);
      // });
      let myItems1 = [];
      documentList?.forEach((myItem) => {
        // if (!itemId.includes(myItem?.document?.id)) {
        //   myItems1.push(myItem);
        // }

        if (
          countryId?.includes(myItem?.countryId) &&
          !itemId?.includes(myItem?.documentUploadId)
        ) {
          myItems1.push(myItem);
        }
      });
      setLoader(false);
      setBtnLoader(false);
      setMyItems(myItems1 ? myItems1 : "");
    }
  }, [cartDetails, documentList, countryId, docListLoading]);

  const deleteCart = async (id) => {
    await dispatch(deleteCartItem({ id }));
    await dispatch(getCartDetails({ userId }));
  };

  const addToCart = async (id) => {
    setLoader(true);
    setBtnLoader(true);
    await dispatch(addToCartAPI({ id }));
    await dispatch(getCartDetails({ userId }));
  };

  const openModal = (item) => {
    // let language = item?.documentUploads?.map((item) =>{
    // 	return item.languageName
    // })
    dispatch(getTemplateDetails(item?.document?.id));
    setItem(item);
    // setPreviewFileId(id);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const ContinueToAccount = () => {
    setPromoCodeVAlidation("");
    if (cardIds.length > 0) {
      history.push({
        pathname: constants.ROUTE.HR_TEMPLATE_PAGE.REVIEW_PAYMENT,
        state: { fromCart: true },
      });
    } else {
      props.notify("Cart is empty");
    }
  };
  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "USD",
      maximumSignificantDigits: 3,
    }).format(value);
  const handlePromoCode = () => {
    setPromoCodeVAlidation("Invalid Promo Code");
  };
  const handlePromoCodeText = (e) => {
    setPromoCode(e?.target?.value);
    if (!e?.target?.value?.length) {
      setPromoCodeVAlidation("");
    }
  };
  return (
    <div data-test="your-cart" className="loader-enable">
      {loading && (
        <div className="custom-loader h-full-loader">
          <Loader />
        </div>
      )}
      <div data-test="insight">
        <SupportButton />

        <KnowledgeBaseHeader
          {...props}
          title="Doc Shop"
          doc_shop={true}
          className="knowledge-header-container doc-shop-header"
          setSearchTextClear={setSearchTextClear}
          redirectToHrTemplate={true}
        />
        <div className="knowledge-content-container doc-cart-container">
          <div class="doc-cart-wrap">
            <h4 className="prev-page">
              In Your Cart
              <div
                className="back-btn-arrow"
                onClick={() =>
                  history.push(constants.ROUTE.HR_TEMPLATE_PAGE.DOC_SHOP)
                }
              >
                <img src={back_arrow} />
              </div>
            </h4>
            <div className="doc-orders-wrapper">
              {cartDetails && cartDetails?.items
                ? cartDetails?.items.map((card, index) => {
                    return (
                      <div className="doc-orders" key={index}>
                        <div className="doc-order">
                          <div className="doc-order-details">
                            <h4 className="doc-item-name">
                              {card?.docProduct?.document?.document?.title}
                            </h4>
                            <h5>{card?.docProduct?.document?.countryName}</h5>
                            <span>{card?.docProduct?.languageName}</span>
                          </div>
                          <div className="doc-order-price">
                            {numberFormat(
                              card?.docProduct?.document?.document?.price
                            )}
                          </div>
                          <button
                            className="doc-order-cancel"
                            onClick={() => deleteCart(card?.cartItemId)}
                          />
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>

            <div className="doc-payment-proceed">
              <div className="doc-promo">
                <div>I have a promo code:</div>
                <div className="doc-promo-field">
                  <input
                    type="text"
                    onChange={handlePromoCodeText}
                    value={promoCode}
                  />
                  <button className="btn btn-primary" onClick={handlePromoCode}>
                    APPLY
                  </button>
                </div>
              </div>
              <button
                className="doc-payment-btn btn btn-primary"
                disabled={cartDetails && cartDetails.items ? false : true}
                // onClick={()=>{
                // 	history.push({pathname:constants.ROUTE.HR_TEMPLATE_PAGE.REVIEW_PAYMENT,state:{fromCart:true}})

                // }}
                onClick={ContinueToAccount}
              >
                Continue to Payment
              </button>
            </div>
          </div>
          <span className="validation-message">{promoCodeVAlidation}</span>
          <div className="doc-shop-suggestion">
            <h4>We think you might like these:</h4>

            <div className="doc-card-grid">
              {myItemList &&
                myItemList.slice(0, 5).map((myItem, index) => {
                  return (
                    <div className="doc-card-item" key={index}>
                      <div className="doc-child-item">
                        <div className="justify-content-between d-flex">
                          <h3>{myItem?.countryName}</h3>
                          {/* {cardIds?.includes(myItem?.id) ? (
                            <img src={cart_body_icon} alt="cart-icon" />
                          ) : (
                            ""
                          )} */}
                        </div>
                        <span>
                          <ion-icon
                            class="folder-icon icon-yellow"
                            name="folder-sharp"
                          ></ion-icon>
                          {myItem?.document?.title}
                        </span>
                        <div className="seperator"></div>
                        <div className="doc-pricing">
                          <span>{myItem?.languageName}</span>
                          <span>{numberFormat(myItem?.document?.price)}</span>
                        </div>
                      </div>
                      <div className="doc-btn-container">
                        <button
                          className="light-btn"
                          onClick={() => openModal(myItem)}
                        >
                          Preview
                        </button>
                        {cardIds?.includes(myItem?.documentUploadId) ? (
                          <p style={{ color: "#40659E" }}>Added to Cart</p>
                        ) : (
                          <button
                            className="dark-btn"
                            onClick={() => addToCart(myItem.documentUploadId)}
                          >
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      {previewLanguage && (
        <OpenModal
          isOpen={showModal}
          dialogClassName="doc-modal"
          onCancelClickListner={handleCloseModal}
          previewFlag={true}
          cardId={cardIds}
          item={item}
          languages={languages}
          currentLanguage={previewLanguage}
          setCurrentLanguage={setPreviewLanguage}
          selectedTemplate={selectedTemplate?.documentUploads}
          isHrTemplate={true}
          setBtnLoader={setBtnLoader}
          loading={btnLoading}
          addToCartFromInCartPage={true}
          calladdToCartFromInCartPage={addToCart}
        />
      )}
    </div>
  );
};
export default InYourCart;
