import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import constants from "../../../utils/constants";
import { useHistory } from "react-router-dom";
import { addToCartAPI, getCartDetails, getPreviewPOPupDetails, callPurchasedDocumentList } from "../../../Store/reducers/HRTemplate";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";

function OpenModal({
  isOpen,
  onCancelClickListner,
  userName,
  deactivate,
  deactivateUser,
  userId,
  deleteModal,
  dialogClassName,
  userStatus,
  editFlag,
  previewFlag,
  askAnExpert,
  reActivateAccounts,
  previewFileId,
  cardId,
  item,
  languages,
  currentLanguage,
  setCurrentLanguage,
  selectedTemplate,
  setBtnLoader,
  isHrTemplate,
  loading,
  addToCartFromInCartPage,
  calladdToCartFromInCartPage
}) {
  const [show, setShow] = useState(false);
  // const [cartIds, setCartId] = useState([]);
  const [indent, setIndent] = useState([]);
  const [previewLanguage, setPreviewLanguage] = useState();
  const user_Id = "00000000-0000-0000-0000-000000000000";
  const cartDetails = useSelector(state => state?.HRTemplate?.cartDetails);
  const history = useHistory();
  const dispatch = useDispatch();
  // console.log('previewLanguage', previewLanguage, languages);
  // useEffect(() => {
  //   setCartId(cardId);
  // }, []);
  useEffect(() => {
    setPreviewLanguage(currentLanguage)
  }, [currentLanguage])

  // useEffect(() => {
  //   console.log("lan", languages[0], previewLanguage)
  //   setPreviewLanguage(languages && languages[0] || []);
  // }, [languages]);

  const goToEditPage = (userId) => {
    history.push(`${constants.ROUTE.SIDEBAR.SETTINGS.EDIT_USER}${userId}`);
    setShow(true);
  };

  useEffect(async () => {
    let cartIds = cartDetails?.items?.map((item) => {
      return item?.docProduct?.id
    })
    if (isHrTemplate) setBtnLoader(false)
    // setCartId(cartIds);
  }, [cartDetails]);

  const addToCart = async (id) => {
    if (isHrTemplate) setBtnLoader(true)
    await dispatch(addToCartAPI({ id }));
    // await dispatch(getCartDetails({ userId: user_Id }));
    await dispatch(callPurchasedDocumentList());

  };
  const handleLanguageChange = (e) => {
    const temp = languages.find((item) => item.id === e.target.value)
    console.log("temp", temp);
    setPreviewLanguage(temp)
  };
  const handleCloseModal = () => {
    setPreviewLanguage([]);
    if (setCurrentLanguage) setCurrentLanguage([])
    onCancelClickListner();
  }
  const numberFormat = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "USD",
      maximumSignificantDigits: 3,
    }).format(value);
  return (
    <div data-test="openModal-page">
      {editFlag ? (
        <Modal
          show={isOpen}
          onHide={onCancelClickListner}
          backdrop="static"
          keyboard={false}
          centered={true}
          contentClassName="custome-modal"
        >
          <Modal.Header className="role_header_model" closeButton>
            <Modal.Title>Reactivate {userName ? userName : ""} ?</Modal.Title>
          </Modal.Header>
          <Modal.Body className="role_body_model">
            This will allow the user access to Expandopedia features set
            previously by their admin. Continue to edit to make changes to user
            and subscription info.
          </Modal.Body>
          <Modal.Footer className="role_footer_model">
            <Button variant="secondary" onClick={onCancelClickListner}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                history.push({
                  pathname: `${constants.ROUTE.SIDEBAR.SETTINGS.EDIT_USER}${userId}`,
                  state: { editFlag: "true" },
                })
              }
            >
              Continue to Edit User
            </Button>
          </Modal.Footer>
        </Modal>
      ) : previewFlag ? (
        <>
          <Modal
            show={isOpen}
            onHide={handleCloseModal}
            backdrop="static"
            dialogClassName={dialogClassName}
            keyboard={false}
            centered={true}
            contentClassName="custome-modal"
          >
            <Modal.Header className="modal-header" closeButton>
              <Modal.Title>
                {item?.document?.title}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="doc-modal-body">
              <div className="contract-header">
                <div className="left-side">
                  <span>{item?.countryName}</span>
                  <select onChange={handleLanguageChange} value={previewLanguage?.id}>
                    {selectedTemplate && selectedTemplate.map((language, index) => {
                      return (
                        <option key={language.id} value={language.id}>{language.languageName}</option>
                      )
                    })}
                  </select>
                </div>
                <div className="right-side ml-auto">
                  <span>{numberFormat(item?.document?.price)}</span>
                  {cardId?.includes(previewLanguage?.id) ?
                    <span>
                      Added to Cart
                    </span> :
                    <button className="modal-add-btn"
                      onClick={() => addToCartFromInCartPage ? calladdToCartFromInCartPage(previewLanguage?.id) : addToCart(previewLanguage?.id)}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : null}
                      &nbsp;
                      Add to Cart
                    </button>
                  }
                </div>
              </div>
              <hr></hr>
              <div className="contract-preview-container">
                <div className="page-count-container">
                  {
                    previewLanguage?.versions?.length > 0 ? Array.from(Array(previewLanguage?.versions[previewLanguage?.versions?.length - 1]?.numberOfPages)).slice(0, 3).map((_, index) => {

                      return <div className="page-count">
                        <div className="doc_img"></div>
                        <span>{index + 1}/{previewLanguage?.versions[previewLanguage?.versions?.length - 1]?.numberOfPages}</span>
                      </div>
                    })
                      :
                      <div className="page-count">
                        <div className="doc_img"></div>
                        <span>0/0</span>
                      </div>
                  }
                </div>

                <div className="preview-container">
                  <div className="preview-document">
                    <img
                      src={`${constants.API.HR_TEMPLATE.DOWNLOAD_PREVIEW_FILE}${previewLanguage?.upload?.id}?showPreview=true`}
                    />
                    <img
                      src={`${constants.API.HR_TEMPLATE.DOWNLOAD_PREVIEW_FILE}${previewLanguage?.upload?.id}?showPreview=true`}
                    />
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="role_footer_model d-none">
              <Button variant="secondary" onClick={onCancelClickListner}>
                Cancel
              </Button>
              <Button variant="primary">
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : askAnExpert ? (
        <Modal
          show={isOpen}
          onHide={onCancelClickListner}
          backdrop="static"
          keyboard={false}
          centered={true}
          contentClassName="custome-modal"
        >
          <Modal.Header className="role_header_model" closeButton>
            <Modal.Title>
              expert pic
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="role_body_model">
            expert body
          </Modal.Body>
          <Modal.Footer className="role_footer_model">
            <Button variant="secondary" onClick={onCancelClickListner}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => deactivateUser(userId)}>
            </Button>
          </Modal.Footer>
        </Modal>
      ) : reActivateAccounts ? (
        <Modal
          show={isOpen}
          onHide={onCancelClickListner}
          backdrop="static"
          keyboard={false}
          centered={true}
          contentClassName="custome-modal"
        >
          <Modal.Header className="role_header_model" closeButton>
            <Modal.Title>
              {deactivate ? "Deactivate Account?" : "Reactivate Account?"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="role_body_model">
            {deactivate ?
              "All users linked to this account will lose access to Expandopedia." :
              "All users linked to this account will get reactivated and regain access to Expandopedia."}
          </Modal.Body>
          <Modal.Footer className="role_footer_model">
            <Button variant="secondary" onClick={onCancelClickListner}>
              Cancel
            </Button>
            {
              deactivate ?
                <Button variant="primary" style={{ width: '200px' }} onClick={() => deactivateUser(false)}>
                  Deactivate Account
                </Button> :
                <Button variant="primary" style={{ width: '200px' }} onClick={() => deactivateUser(userId)}>
                  Continue to Edit Account
                </Button>
            }
          </Modal.Footer>
        </Modal>
      ) : deleteModal ? (
        <Modal
          show={isOpen}
          onHide={onCancelClickListner}
          backdrop="static"
          keyboard={false}
          centered={true}
          contentClassName="custome-modal"
        >
          <Modal.Header className="role_header_model" closeButton>
            <Modal.Title>
              {`Remove User ${userName}?`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="role_body_model">
            This will remove all access to Expandopedia and preferences
            that were set by the user.
          </Modal.Body>
          <Modal.Footer className="role_footer_model">
            <Button variant="secondary" onClick={() => deactivateUser(false)}>
              Cancel
            </Button>
            <Button variant="primary" style={{ width: '150px', backgroundColor: '#104378' }} onClick={() => deactivateUser(userId)}>Remove</Button>
          </Modal.Footer>
        </Modal>
      ) : (
        <Modal
          show={isOpen}
          onHide={onCancelClickListner}
          backdrop="static"
          keyboard={false}
          centered={true}
          contentClassName="custome-modal"
        >
          <Modal.Header className="role_header_model" closeButton>
            <Modal.Title>
              {userStatus
                ? `Deactivate User ${userName ? userName : ""}?`
                : `Activate User ${userName ? userName : ""}?`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="role_body_model">
            {userStatus
              ? "This deactivates the user account, but does not delete the company account."
              : "This will activate the user."}
          </Modal.Body>
          <Modal.Footer className="role_footer_model">
            <Button variant="secondary" onClick={onCancelClickListner}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => deactivateUser(userId)}>
              {userStatus ? "Deactivate" : "Activate"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default OpenModal;
