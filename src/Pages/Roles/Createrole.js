import React, { useEffect, useState, useRef } from "react";
// import "../../assets/css/custom.css";
import HeaderText from "../Home/HeaderText";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUserProfile, isLastLoginAttempted } from "../../utils/storage";
import { updateLastLogin } from "../../Actions/UserProfileAction";
import { useHistory } from "react-router-dom";
import { CustomeNotification } from "../../Components/CustomeNotification/CustomeNotification";
import Tabdata from "./Tabdata";
import {
  getFeatData,
  getUserGroups,
  postUserRole,
} from "../../Actions/RolesAction";
import dropdown from "../../assets/images/dropdown.png";
import SupportButton from "../../Components/SupportButton"
import { permissionMapping } from "../../utils/utils";
import constants from "../../utils/constants";

const Createroles = (props) => {
  const [userFeat, setuserFeat] = useState();
  const [userData, setUserData] = useState();
  const [userGroup, setuserGroup] = useState(null);
  const [userGroupSelected, setUserGroupSelected] = useState([]);
  const [userGroupFSelected, setUserGroupFSelected] = useState([]);
  const [post, setPost] = useState({});
  
  var user_data = getUserProfile();
  const history = useHistory();
  const permissionArray = permissionMapping();

  const [selected_check, check_select_check] = useState();
  const [showGroupData, setShowGroupData] = useState();
  const handleClick = () => history.push("/roles");
  const [selectedCheckData, setSelectedCheckData] = useState();
  const [textLength, setTextLength] = useState(0);
  var charLimit = 90;

  var group_temp = "";

  useEffect(() => {
    if (!permissionArray?.includes(constants.PERMISSION_MAPPING.CREATE_EDIT_DELETE_ROLES))
			history.push("/home")
    getFeatDataAction_details();
    getUserGroupsAction_details();
  }, []);

 

  const getFeatDataAction_details = () => {
    props
      .getFeatDataAction()
      .then((response) => {
        let res_data = response.data.data;
        setuserFeat(res_data);
      })
      .catch((errors) => {});
  };

  const getUserGroupsAction_details = () => {
    props
      .getUserGroupsAction()
      .then((response) => {
        let res_data = response.data.data;
        setuserGroup(res_data);
      })
      .catch((errors) => {});
  };

  const postUserRoleAction_details = (a) => {
    props
      .postUserRoleAction(a)
      .then((response) => {
        let res_data = response.data.data;
        props.notify("Role Added Successfully", 2000);
        history.push("roles");
      })
      .catch((error) => {
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
      RoleName: post.title,
      Description: post.dis,
      UserGroupId: selected_check,
      FeatureIds: userGroupFSelected,
    };
    postUserRoleAction_details(send_data_obj);
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

  return (
    <React.Fragment>
      <div className="hide-layout-ctrl">
        <HeaderText user={userData} hideTitle />
      </div>

      <div className="container-fluid" data-test="createRole"> 
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
                    data-test="roles"
                  >
                    Roles &amp; Permissions
                  </span>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <span className="breadcrumb-title">Create Role</span>
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
                    Create Role
                    <span className="pointer" >
                      <i onClick={handleClick} className="ph-arrow-left" data-test="arrow"/>
                    </span>
                  </h3>
                </div>
                <div className="col-sm-6 d-flex justify-content-end">
                  <button
                    type="button"
                    onClick={handleClick}
                    className="secondary-gray-button"
                    data-test="cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => postData(e)}
                    className="primary-button"
                    data-test="create"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="form-wrapper role-add-container">
            <div className="col-12">
              <div className="row">
                <div className="col-lg-10">
                  <h4>Role Info</h4>
                </div>
                <div className="col-lg-5">
                  <div className="floating">
                    <input
                      autoComplete="off"
                      id="input__username"
                      onChange={(e) =>
                        setPost({ ...post, title: e.target.value })
                      }
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
                      defaultValue={selectedCheckData}
                      onClick={() => show_dropdown_data()}
                      type="text"
                      className="floating__input"
                      name="usergroup"
                      placeholder="Assign to User Group"
                      data-test="userGroup"
                    />
                    <img src={dropdown} className="dropdown_img"></img>
                    <label
                      htmlFor="input__usergroup"
                      className="floating__label select_label"
                      data-content="Assign to User Group"
                    >
                      <span className="hidden--visually">
                        Assign to User Group*
                      </span>
                    </label>
                    <div className={`user_group_selector ${showGroupData}`}>
                      {userGroup
                        ? userGroup.map((e) => {
                            return (
                              <div className="checkbox-wrapper">
                                <label className="tab-checkbox">
                                  {e.userGroupName}
                                  <input
                                    type="radio"
                                    name="user_group"
                                    onChange={(event) => runDropdown(event, e)}
                                    value={e.id}
                                    data-test="userData"
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
                      className="floating__input"
                      type="text"
                      defaultValue={""}
                      maxLength="90"
                      data-test="textarea"
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
                <div className="col-lg-10">
                  <div className="row vertical-tab-group">
                    <Tabdata
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
      <SupportButton/>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateLastLoginAction: updateLastLogin,
      getFeatDataAction: getFeatData,
      getUserGroupsAction: getUserGroups,
      postUserRoleAction: postUserRole,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(Createroles);
