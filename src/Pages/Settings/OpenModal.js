import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import constants from "../../utils/constants";
import { useHistory } from "react-router-dom";
import {
  callgetCountryListAPI,
  callgetIndustryListAPI,
} from "../../Store/reducers/favoriteCountries";
import { useDispatch, useSelector } from "react-redux";
import { askQuestionPOPUpAPI } from "../../Store/reducers/HRTemplate";
import close from "../../assets/images/search-close.svg";
import { uploadImageFile } from "../../Store/reducers/country";
import ReactDropdown from "../../Components/CustomeSelectDropDown/reactDropdown";
function OpenModal({
  isOpen,
  onCancelClickListner,
  userName,
  deactivateUser,
  userId,
  dialogClassName,
  userStatus,
  editFlag,
  previewFlag,
  askAnExpert,
  notify,
  expertDetails,
  
}) {
  const [show, setShow] = useState(false);
  
  const history = useHistory();
  const dispatch = useDispatch();
  const countries = useSelector(
    (state) => state?.favoriteCountriesReducer?.countryList
  );
  const industries = useSelector(
    (state) => state?.favoriteCountriesReducer?.industryList
  );
  const countryList =
    countries &&
    countries.map((x) => {
      return {
        ...x,
        value: x.id,
        label: x.country_Name,
      };
    });
  const industryList =
    industries &&
    industries.map((x) => {
      return {
        ...x,
        value: x.id,
        label: x.industryName,
      };
    });
  useEffect(async () => {
    dispatch(callgetCountryListAPI());
    dispatch(callgetIndustryListAPI());
  }, []);
  const goToEditPage = (userId) => {
    history.push(`${constants.ROUTE.SIDEBAR.SETTINGS.EDIT_USER}${userId}`);
    setShow(true);
  };
  
  return (
    <div data-test="user-account-openModal-page">
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
            onHide={onCancelClickListner}
            backdrop="static"
            dialogClassName={dialogClassName}
            keyboard={false}
            centered={true}
            contentClassName="custome-modal"
          >
            <Modal.Header className="modal-header" closeButton>
              <Modal.Title>HrTemplate</Modal.Title>
            </Modal.Header>
            <Modal.Body className="doc-modal-body">
              <div className="contract-header">
                <div className="left-side">
                  <span>Dominican Republic</span>
                  <select>
                    <option>English</option>
                    <option>French</option>
                    <option>Hindi</option>
                  </select>
                </div>
                <div className="right-side ml-auto">
                  <span>$700</span>
                  <span>Added to cart</span>
                </div>
              </div>
              <hr></hr>
              <div className="contract-preview-container">
                <div className="page-count-container">
                  <div className="page-count">
                    <div className="doc_img"></div>
                    <span>1/12</span>
                  </div>
                  <div className="page-count">
                    <div className="doc_img"></div>
                    <span>2/12</span>
                  </div>
                  <div className="page-count">
                    <div className="doc_img"></div>
                    <span>3/12</span>
                  </div>
                </div>
                <div className="preview-container">
                  <div className="preview-document">
                    <div className="document-title">
                      Hiring Employment Contract
                    </div>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nibh varius varius augue sed vel facilisi eleifend ornare.
                      Integer molestie nullam posuere interdum amet iaculis
                      gravida risus. Scelerisque mattis sit nulla orci. Vitae
                      dui risus, quisque fermentum neque, diam.
                    </p>
                    <div className="row mt-5">
                      <div className="col-md-6">
                        <p>
                          <mark>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nibh varius varius augue sed vel facilisi
                            eleifend ornare. Integer molestie nullam posuere
                            interdum amet iaculis gravida risus.
                          </mark>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="border-line">
                          <mark>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nibh varius varius augue sed vel facilisi
                            eleifend ornare. Integer molestie nullam posuere
                            interdum amet iaculis gravida risus.
                          </mark>
                        </p>

                        <p className="mt-3 border-line">
                          <mark>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nibh varius varius augue sed vel facilisi
                            eleifend ornare. Integer molestie nullam posuere
                            interdum amet iaculis gravida risus.
                          </mark>
                        </p>
                      </div>
                    </div>

                    <div className="document-title mt-5">
                      Hiring Employment Contract
                    </div>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Nibh varius varius augue sed vel facilisi eleifend ornare.
                      Integer molestie nullam posuere interdum amet iaculis
                      gravida risus. Scelerisque mattis sit nulla orci. Vitae
                      dui risus, quisque fermentum neque, diam.
                    </p>
                    <div className="row mt-5">
                      <div className="col-md-6">
                        <p>
                          <mark>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nibh varius varius augue sed vel facilisi
                            eleifend ornare. Integer molestie nullam posuere
                            interdum amet iaculis gravida risus.
                          </mark>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p className="border-line">
                          <mark>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nibh varius varius augue sed vel facilisi
                            eleifend ornare. Integer molestie nullam posuere
                            interdum amet iaculis gravida risus.
                          </mark>
                        </p>

                        <p className="mt-3 border-line">
                          <mark>
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Nibh varius varius augue sed vel facilisi
                            eleifend ornare. Integer molestie nullam posuere
                            interdum amet iaculis gravida risus.
                          </mark>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer className="role_footer_model d-none">
              <Button variant="secondary" onClick={onCancelClickListner}>
                Cancel
              </Button>
              <Button variant="primary"></Button>
            </Modal.Footer>
          </Modal>
        </>
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
                ? `Deactivate User ${userName ? userName : ""} ?`
                : `Activate User ${userName ? userName : ""} ?`}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="role_body_model">
            {userStatus
              ? "  This does not delete the user's account."
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
