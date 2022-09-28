import React, { useEffect, useState } from "react";
// import "../../assets/css/custom.css";
import HeaderText from "../Home/HeaderText";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUserProfile, isLastLoginAttempted } from "../../utils/storage";
import { updateLastLogin } from "../../Actions/UserProfileAction";
import { useHistory } from "react-router-dom";
import { Link, useParams } from "react-router-dom";
import SelectedFeat from "./SelectedFeat";
import { permissionMapping } from "../../utils/utils";
import { CustomeNotification } from "../../Components/CustomeNotification/CustomeNotification";
import Loader from "../../Components/Loader";

import {
  getFeatData,
  getUserGroups,
  updateUserDetails,
  getUserRolesbyId,
} from "../../Actions/RolesAction";
import dropdown from "../../assets/images/dropdown.png";
import constants from "../../utils/constants";

const EditRoles = (props) => {
  const [userFeat, setuserFeat] = useState();
  const [userData, setUserData] = useState();
  const [userRoles, setuserRoles] = useState();
  const [userGroup, setuserGroup] = useState();
  const [userGroupSelected, setUserGroupSelected] = useState(
    userRoles ? userRoles.UserGroupId : []
  );
  const [userGroupFSelected, setUserGroupFSelected] = useState([]);
  const [post, setPost] = useState({});
  const permissionArray = permissionMapping();

  const [selected_check, check_select_check] = useState();
  var user_data = getUserProfile();
  const history = useHistory();
  let { id } = useParams();
  const [showGroupData, setShowGroupData] = useState();
  const [selectedCheckData, setSelectedCheckData] = useState();
  const [textLength, setTextLength] = useState(0);
  const [loading, setLoader] = useState(false);

  var charLimit = 90;
  var group_temp = "";

  useEffect(() => {
    if (!permissionArray?.includes(constants.PERMISSION_MAPPING.CREATE_EDIT_DELETE_ROLES))
      history.push("/home")
    getFeatDataAction_details();
    getUserGroupsAction_details();
    getUserRolesAction_details(id);
  }, []);

  

  const getFeatDataAction_details = () => {
    props
      .getFeatDataAction()
      .then((response) => {
        let res_data = response.data.data;
        setuserFeat(res_data);
      })
      .catch((errors) => { });
  };

  const getUserGroupsAction_details = () => {
    props
      .getUserGroupsAction()
      .then((response) => {
        let res_data = response.data.data;
        setuserGroup(res_data);
      })
      .catch((errors) => { });
  };

  const postUserRoleAction_details = (a) => {
    setLoader(true);
    props
      .postUserRoleAction(a)
      .then((response) => {
        setLoader(false);

        let res_data = response.data.data;
        getUserRolesAction_details(id);
        props.notify("Role Saved Successfully", 5000);
        history.push("/roles");
      })
      .catch((error) => {
        setLoader(true);

        if (error?.response?.data?.errors) {
          const m = error.response.data.errors;
          const message = m.join(",");
          props.notify(message, 5000);
        }
      });
  };

  var sec_val = [];

 

  const eventtoggleChange = (e) => {
    let sec_Fval = [];
    
    let new_val = Number(e.target.value);
   
    if (e.target.checked == false) {
      sec_Fval = [...userGroupFSelected];
      sec_Fval = sec_Fval.filter(function (value, index, arr) {
        return value != new_val;
      });
    } else {
      sec_Fval = [...userGroupFSelected];
      sec_Fval.push(new_val);
    }
    setUserGroupFSelected(sec_Fval);
  };

  const postData = () => {
    
    let send_data_obj = {
      id: id,
      RoleName: post.title,
      Description: post.dis,
      UserGroupId: selected_check,
      FeatureIds: userGroupFSelected,
    };
    postUserRoleAction_details(send_data_obj);
  };

  const getUserRolesAction_details = (id) => {
    setLoader(true);
    props
      .getUserRolesAction(id)
      .then((response) => {
        setLoader(false);
        let res_data = response.data.data;
        setuserRoles(res_data);
        setTextLength(res_data.description.length);
        setUserGroupFSelected(res_data.featureIds);
        check_select_check(res_data.userGroupId);
        setPost({ title: res_data.roleName, dis: res_data.description });
      })
      .catch((errors) => { });
  };

  const show_dropdown_data = () => {
    if (showGroupData == "active") {
      setShowGroupData("");
    } else {
      setShowGroupData("active");
    }
  };
  const runDropdown = (event, e) => {
    check_select_check(event.target.value);
    setSelectedCheckData(e.userGroupName);
    show_dropdown_data();
  };

  if (userRoles != null && !loading) {
    return (
      <React.Fragment>
        <div className="hide-layout-ctrl" data-test="editRole">
          <HeaderText user={userData} hideTitle />
        </div>

        <div className="container-fluid" >
          <div className="">
            <div className="breadcrump-admin">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb pl-0">
                  <li className="breadcrumb-item">
                    <span>Settings</span>
                  </li>
                  <li className="breadcrumb-item">
                    <span
                      className="pointer link"
                      onClick={() => history.push("/roles")}
                    >
                      Roles &amp; Permissions
                    </span>
                  </li>
                  <li className="breadcrumb-item">
                    <span
                      className="pointer link"
                      onClick={() => history.push(`/view-role/${id}`)}
                    >
                      View Role
                    </span>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <span className="breadcrumb-title">Edit Role</span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <div className="">
            <div className="col-12">
              <div className="title-action-wrap">
                <div className="row">
                  <div className="col-sm-6 pl-0 d-flex align-items-center">
                    <h3 className="pb-0 mb-0">
                      Edit Role
                      <span  className="pointer">
                        <i
                          onClick={() => history.push(`/view-role/${id}`)}
                          className="ph-arrow-left"
                        />
                      </span>
                    </h3>
                  </div>
                  <div className="col-sm-6 d-flex justify-content-end pr-0">
                    <button
                      type="button"
                      onClick={() => history.push(`/view-role/${id}`)}
                      className="secondary-gray-button"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={(e) => postData(e)}
                      className="primary-button"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="form-wrapper role-container">
              <div className="col-12">
                <div className="row">
                  <div className="col-12">
                    <h4>Role Info</h4>
                  </div>
                  <div className="col-lg-5">
                    <div className="floating">
                      <input
                        id="input__username"
                        onChange={(e) =>
                          setPost({ ...post, title: e.target.value })
                        }
                        defaultValue={userRoles ? userRoles.roleName : ""}
                        className="floating__input"
                        name="rolename"
                        type="text"
                        placeholder="Role Name"
                      />
                      <label
                        htmlFor="input__username"
                        className="floating__label"
                        data-content="Role Name"
                      >
                        <span className="hidden--visually">Role Name</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="floating user_group_selector_inp">
                      <input
                        id="input__usergroup"
                        onClick={() => show_dropdown_data()}
                        value={userRoles ? userRoles.userGroupName : ""}
                        type="text"
                        className="floating__input"
                        name="usergroup"
                        placeholder="Assign to User Group"
                      />
                      <img src={dropdown} className="dropdown_img"></img>
                      <label
                        htmlFor="input__usergroup"
                        className="floating__label"
                        data-content="Assign to User Group"
                      >
                        <span className="hidden--visually">
                          Assign to User Group*
                        </span>
                      </label>
                      <div className={`user_group_selector ${showGroupData}`}>
                        {userGroup
                          ? userGroup.map((e) => {
                            if (selected_check == e.id) {
                              return (
                                <div className="checkbox-wrapper">
                                  <label className="tab-checkbox">
                                    {e.userGroupName}
                                    <input
                                      type="radio"
                                      name="user_group"
                                      defaultChecked={
                                        selected_check == e.id
                                          ? "true"
                                          : "false"
                                      }
                                      onChange={(e) =>
                                        check_select_check(e.target.value)
                                      }
                                      value={e.id}
                                    ></input>
                                    <span className="checkmark"></span>
                                  </label>
                                </div>
                              );
                            }
                            return (
                              <div className="checkbox-wrapper">
                                <label className="tab-checkbox">
                                  {e.userGroupName}
                                  <input
                                    type="radio"
                                    name="user_group"
                                    onChange={(event) =>
                                      runDropdown(event, e)
                                    }
                                    value={e.id}
                                    data-test="change"
                                  ></input>
                                  <span className="checkmark"></span>
                                </label>
                              </div>
                            );
                          })
                          : "Loading..."}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-10">
                    <div className="floating cus-text-area">
                      <label>Role Description*</label>
                      <textarea
                        
                        cols={30}
                        rows={10}
                        onChange={(e) => {
                          setPost({ ...post, dis: e.target.value });
                          setTextLength(e.target.value.length);
                        }}
                        defaultValue={userRoles ? userRoles.description : ""}
                        className="floating__input"
                        type="text"
                        placeholder="Email Address"
                        maxLength="90"
                      />
                      <span className="characters">
                        Characters left : {charLimit - textLength}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12">
                    <h4>Manage Permissions For Users In This Role</h4>
                  </div>
                  <div className="col-10">
                    <div className="row vertical-tab-group">
                      <SelectedFeat
                        box_click_fun={eventtoggleChange}
                        data_selected={userGroupFSelected}
                        feat_data={userFeat}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  } else {
    return (
      <div className="loader-enable" data-test="editRole">
        {

          (<div className="custom-loader">
            <Loader />
          </div>)
        }
      </div>

    )
  }
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateLastLoginAction: updateLastLogin,
      getFeatDataAction: getFeatData,
      getUserGroupsAction: getUserGroups,
      postUserRoleAction: updateUserDetails,
      getUserRolesAction: getUserRolesbyId,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(EditRoles);
