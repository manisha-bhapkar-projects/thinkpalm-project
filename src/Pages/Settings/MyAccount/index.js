import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import Loader from "react-loader-spinner";

/* Icons */
import star from "../../../Scss_Homepages/images/star.svg";
import rocket from "../../../Scss_Homepages/images/rocket.svg";
import mastercard from "../../../Scss_Homepages/images/master-card-icon.svg";

/* Component */
import SearchHeaderText from "../../../Components/SearchHeaderText/SearchHeaderText";
import SupportButton from "../../../Components/SupportButton";
import TextFieldComponent from "../../../Components/TextFieldComponent/TextFieldComponent";
import CustomeDropDown from "../../../Components/CustomeDropDown/CustomeDropDown";
import { storeUserProfile, getKeyClockToken_Data } from "../../../utils/storage";
import constants from "../../../utils/constants";
import jwt_decode from "jwt-decode";

/* Action */
import {
  callDeleteProfilePic,
  callgetUserProfileDetailsAPI,
  callUpdateUserProfileAPI,
  callUploadProfilePicAPI,
} from "../../../Store/reducers/myAccount";
import { setUserProfile } from "../../../Store/reducers/user";

const MyAccount = (props) => {
  document.title = "Settings";
  const token_data = getKeyClockToken_Data();

  const userData = token_data ? jwt_decode(token_data) : undefined;
  const id = userData?.sub;

  const history = useHistory();
  const [userId, setUserId] = useState("");
  const [requestParams, setRequestParams] = useState({});
  const hiddenFileInput = React.useRef(null);
  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    preferredName: "",
    emailId: "",
    CompanyId: "",
    RoleId: "",
    industryName: "",
    ImageUrl: "",
    roleName: "",
  });
  const dispatch = useDispatch();
  const showSettings = history?.location?.state?.showSettings;
  const userDetails = useSelector((state) => state.myAccountReducer.userDetails);
  const profileUpdate = useSelector((state) => state.myAccountReducer.profileUpdate);
  const profileUpdateError = useSelector((state) => state.myAccountReducer.profileUpdateError);
  const profilePicError = useSelector((state) => state.myAccountReducer.profilePicError);
  const profilePicDeleted = useSelector((state) => state.myAccountReducer.profilePicDeleted);
  const imageURL = useSelector((state) => state.myAccountReducer.imageURL);
  const isLoading = useSelector((state) => state.myAccountReducer.isLoading);
  useEffect(() => {
    dispatch(callgetUserProfileDetailsAPI({ id }));
  }, []);
  useEffect(() => {
    setInitialValues({
      ...initialValues,
      firstName: userDetails?.userProfile?.firstName,
      lastName: userDetails?.userProfile?.lastName,
      preferredName: userDetails?.userProfile?.preferredName,
      emailId: userDetails?.emailId,
      jobTitle: userDetails?.userProfile?.jobTitle,
      industryName: userDetails?.company?.industryName,
      companyName: userDetails?.company?.companyName,
      ImageUrl: userDetails?.userProfile?.imageUrl,
      RoleId: userDetails?.roleId,
      CompanyId: userDetails?.companyId,
      roleName: userDetails?.roleName
    });
    setRequestParams(userDetails?.userProfile);
    setUserId(userDetails?.userProfile?.id);
  }, [userDetails]);

  useEffect(() => {
    setInitialValues({
      ...initialValues,
      ImageUrl: imageURL?.id,
    });
  }, [imageURL]);

  const handleChange = (event) => {
    const data = new FormData();
    data.append("file", event.target.files[0]);
    dispatch(callUploadProfilePicAPI({ data }));
  };
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChangeValue = (e) => {
    setInitialValues({
      ...initialValues,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (profileUpdate === 200) {
      props.notify("Profile Updated Successfully");
      dispatch(callUpdateUserProfileAPI({ success: true }));
      storeUserProfile(initialValues ? {
        ...initialValues,
        imageUrl: initialValues.ImageUrl,
        roleName: userDetails?.roleName,
        userId: userDetails?.id
      } : {});
      dispatch(setUserProfile(initialValues ? {
        ...initialValues,
        imageUrl: initialValues.ImageUrl,
        roleName: userDetails?.roleName,
        userId: userDetails?.id
      } : {}));
    }
  }, [profileUpdate]);

  useEffect(() => {
    if (profileUpdateError && profileUpdateError.length) {
      props.notify(profileUpdateError);
    }
  }, [profileUpdateError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let data = { ...requestParams, ...initialValues };
    await dispatch(callUpdateUserProfileAPI({ userId, data }));
  };


  useEffect(() => {
    if (profilePicError && profilePicError.length) {
      props.notify(profilePicError);
    } else if (profilePicDeleted && profilePicDeleted === 200) {
      props.notify("Profile Image Deleted");
      setInitialValues({
        ...initialValues,
        ImageUrl: "",
      });
      dispatch(callDeleteProfilePic({ success: true }));
    }
  }, [profilePicError, profilePicDeleted]);

  const deleteProfilePic = async () => {
    let image = initialValues.ImageUrl;
    await dispatch(callDeleteProfilePic({ image }));
  };

  return (
    <div data-test="my-account">
      <div >
        <SearchHeaderText
          breadcrumb={true}
          myAccount={true}
          showSettings={showSettings}
          onClick={handleSubmit}
          data-testid="handleSubmit"
        />
        <div className="container-fluid">
          <div className="form-wrapper">
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <h4>My Profile</h4>
                </div>
                <div className="col-lg-3">
                  <TextFieldComponent
                    id="firstName"
                    label="First name*"
                    data-test="firstName"
                    dataContent="First name*"
                    type="text"
                    placeholder="First name*"
                    name="firstName"
                    value={initialValues.firstName}
                    onChange={handleChangeValue}
                  />
                </div>
                <div className="col-lg-3">
                  <div className="floating">
                    <TextFieldComponent
                      id="lastName"
                      label="Last Name*"
                      data-test="lastName"
                      dataContent="Last Name*"
                      type="text"
                      placeholder="Last Name*"
                      name="lastName"
                      value={initialValues.lastName}
                      onChange={handleChangeValue}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="floating">
                    <TextFieldComponent
                      id="preferredName*"
                      label="Preferred Name*"
                      data-test="preferredName*"
                      dataContent="Preferred Name*"
                      type="text"
                      placeholder="preferredName*"
                      name="preferredName"
                      value={initialValues.preferredName}
                      onChange={handleChangeValue}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-5">
                  <div className="floating readOnly">
                    <TextFieldComponent
                      id="email"
                      label="Email Address*"
                      data-test="email"
                      dataContent="Email Address*"
                      type="email"
                      readOnly
                      name="emailId"
                      placeholder="Email Address*"
                      value={initialValues.emailId}
                      onChange={handleChangeValue}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="floating">
                    <TextFieldComponent
                      id="jobTitle"
                      label="Job Title"
                      data-test="jobTitle"
                      dataContent="Job Title"
                      type="text"
                      name="jobTitle"
                      placeholder="Job Title"
                      value={initialValues.jobTitle}
                      onChange={handleChangeValue}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-5">
                  <div className="floating">
                    <TextFieldComponent
                      id="companyName"
                      label="Company Name*"
                      data-test="companyName"
                      dataContent="Company Name*"
                      type="text"
                      readOnly
                      name="companyName"
                      placeholder="Company Name*"
                      value={initialValues.companyName}
                      onChange={handleChangeValue}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="floating">
                    <CustomeDropDown
                      className="form-control ld_form-ctrl custome-dropdown"
                      data={[1, 2, 3]}
                      placeholder="Industry*"
                      value={initialValues.industryName}
                    />
                    <span className="dropdown_btn_label">Industry*</span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-5">
                  <div style={{
                    fontWeight: 500, fontFamily: 'webfontmedium'
                  }} className="floating">
                    You are assigned the role of{" "}
                    <span className="owner-text">{initialValues?.roleName}</span>.
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="view-profile-pic-wrap col-12">
                  <div className="profile-pic">
                    <div className="profile-picture">
                      {initialValues.ImageUrl ? (
                        <img
                          src={
                            initialValues.ImageUrl
                              ? `${constants.API.COUNTRY.GET_FLAG_DOWNLOAD}${initialValues.ImageUrl} `
                              : ""
                          }
                          className="profile-picture"
                        />
                      ) : (
                        ""
                      )}
                      <input
                        type="file"
                        style={{ display: "none" }}
                        ref={hiddenFileInput}
                        accept=".png, .jpg, .jpeg, .gif, .svg"
                        onChange={handleChange}
                        data-test="profileChange"
                      />
                      <a className="registration-img-txt"
                        onClick={initialValues.ImageUrl ? deleteProfilePic : handleClick}
                        data-test="profile"
                      >
                        {initialValues.ImageUrl ? "Remove" : "Upload Image"}
                      </a>
                    </div>
                    {/* <span
                    onClick={initialValues.ImageUrl ? deleteProfilePic : handleClick}
                    className="registration-img-txt"
                    style={{cursor:"pointer"}}
                  >
                	{ initialValues.ImageUrl ? "Remove" : "Upload Image"}	

                  </span> */}
                  </div>
                  <span
                    className={initialValues.ImageUrl ? "btn btn-secondary btn-upload ml-5" : "btn btn-secondary btn-upload-grey ml-5 disabled"}
                    style={{ width: "90px" }}
                    onClick={initialValues.ImageUrl ? handleClick : ""}>
                    {isLoading ? (
                      <Loader
                        type="Oval"
                        color="#727cf5"
                        height={20}
                        width={20}
                        timeout={3000000} //3 secs
                      />
                    ) : (
                      <>
                        Change
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="col-12">
            <div className="title-action-wrap mb-4">
              <div className="col-sm-6 pl-0">
                <h3 className="pl-0 mt-4">Subscription Info</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-6 pr-lg-3">
              <div className="subscription-wrapper">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="subscription-details">
                      <h5>Subscription Type</h5>
                      {/* <div className="subscription-selected-plan">
                        <img src={star} />
                        <span>Enterprise</span>
                      </div> */}
                      {/* <div className="user-license">
                        1 user licenses <span>(0 assigned)</span>
                      </div>
                      <div className="user-license">
                        36 Expert Hours
                      </div> */}
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="subscription-details">
                      <h5>Important Dates</h5>
                      <div className="date">
                        <h5 className="my-4" style={{
                          textTransform: "capitalize"
                        }}></h5>
                        <h6>Registration Date</h6>
                      </div>
                      <div className="date">
                        <h5 className="my-4" style={{
                          textTransform: "capitalize"
                        }}></h5>
                        <h6>Renewal Date</h6>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-12">
                    <a href className="features cursor-pointer">

                      <span>What’s included?</span>
                    </a>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="col-lg-6 pl-lg-3 mt-3 mt-lg-0">
              <div className="subscription-wrapper">
                <div className="row">
                  <div className="col-lg-5">
                    <div className="subscription-details">
                      <h5>Billing Address</h5>
                      {/* <address>
                        Suite #135
                        <br />
                        100 Street Name
                        <br />
                        Toronto, ON
                        <br />
                        M1J2H8
                      </address> */}
                    </div>
                  </div>
                  <div className="col-lg-7">
                    <div className="subscription-details">
                      <h5>Payment Method</h5>
                      {/* <div className="card-number">
                        <img src={mastercard} />
                        <span>XXXX XXXX XXXX </span> <span> 1234</span>
                      </div>
                      <address>
                        Mastercard - Expires 10/21
                        <br />
                        Billed Yearly
                        <br />
                      </address> */}
                    </div>
                  </div>
                  {/* <div className="col-12 d-flex justify-content-end">
                    <a href className="features mr-5 cursor-pointer">
                      Change
                    </a>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid mt-4">
          <div className="">
            <div className="contact-wrapper">
              <span>
                <img src={rocket} />
                Need to change your plan or find out more about your subscription?
              </span>
              <a className="ml-2 ml-md-auto cursor-pointer">
                Contact Sales
              </a>
            </div>
          </div>
          <SupportButton />
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
