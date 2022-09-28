import React, { useEffect, useState } from "react";
// import "../../assets/css/custom.css";
import HeaderText from '../Home/HeaderText';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUserProfile, isLastLoginAttempted } from "../../utils/storage";
import { updateLastLogin } from "../../Actions/UserProfileAction";
import { useHistory } from 'react-router-dom';
import Tabdata from './Tabdata';
import { Link, useParams } from 'react-router-dom';
import { getUserRolesbyId, getFeatData, postUserRole } from "../../Actions/RolesAction";
import ListedFeatures from "./ListedFeatures";
import OpenModal from "./OpenModal";
import { permissionMapping } from "../../utils/utils";
import constants from "../../utils/constants";

const Viewroles = (props) => {
  const [userFeat, setuserFeat] = useState();
  const [userRoles, setuserRoles] = useState();
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState();
  const [userStatus, setUserStatus] = useState();
  const [editFlag, setEditFlag] = useState(false);
  const [userName, setUserName] = useState();
  var user_data = getUserProfile();
  const [userData, setUserData] = useState();

  const [statusFlag, setStatusFlag] = useState();
  const history = useHistory();
  const handleClick = () => history.push('/roles');
  var group_temp = "";
  let { id } = useParams();
  const permissionArray = permissionMapping();


  useEffect(() => {
    getUserRolesAction_details(id);
    getFeatDataAction_details();
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const openEditModal = (id) => {
    setShowModal(true);
    setUserId(id);
    setEditFlag(true);
  };

  const deactivateUser = async (id) => {
    let userStatus = await props.callChangeUserStatusAPIAction(id, statusFlag);
    setShowModal(false);
  };

  const getUserRolesAction_details = (id) => {
    props
      .getUserRolesAction(id)
      .then((response) => {
        let res_data = response.data.data;
        setuserRoles(res_data)
      })
      .catch((errors) => { });
  };

  const getFeatDataAction_details = () => {
    props.getFeatDataAction().then((response) => {
      let res_data = response.data.data;
      setuserFeat(res_data)
    })
      .catch((errors) => { });
  };

  return (
    <React.Fragment>
      <div className="hide-layout-ctrl">
        <HeaderText hideTitle user={userData} />
      </div>

      <div className="container-fluid" data-test="viewRole">
        <div className="">
          <div className="breadcrump-admin">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb pl-0">
                <li className="breadcrumb-item"><span>Settings</span></li>
                <li className="breadcrumb-item"><span className="pointer link" onClick={() => history.push('/roles')} data-test="roleClick">Roles &amp; Permissions</span></li>
                <li className="breadcrumb-item active" aria-current="page"><span className='breadcrumb-title'>View Role</span></li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="">
          <div className="col-12">
            <div className="title-action-wrap">
              <div className="row">
                <div className="col-sm-6 pl-0">
                  <h3 className="pb-0 mb-0">View Role
                    <span href className='pointer'><i onClick={handleClick} className="ph-arrow-left" data-test="click"/></span>
                  </h3>
                </div>

                <div className="col-sm-6 d-flex justify-content-end pr-0">
                  <button type="button" onClick={() => openEditModal()} className={permissionArray?.includes(constants.PERMISSION_MAPPING.CREATE_EDIT_DELETE_ROLES) ? "primary-button" : "primary-button a-disabled"} data-test="editModal" >Edit</button>
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
                    <input id="input__username" disabled value={userRoles ? userRoles.roleName : ""} className="floating__input" name="rolename" type="text" placeholder="Role Name" />
                    <label htmlFor="input__username" className="floating__label" data-content="Role Name">
                      <span className="hidden--visually">Role Name</span>
                    </label>
                  </div>
                </div>
                <div className="col-lg-5">
                  <div className="floating user_group_selector_inp">
                    <input id="input__usergroup" disabled value={userRoles ? userRoles.userGroupName : ""} type="text" className="floating__input" name="usergroup" placeholder="Assign to User Group" />
                    <label htmlFor="input__usergroup" className="floating__label" data-content="Assign to User Group">
                      <span className="hidden--visually">Assign to User Group*</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-10">
                  <div className="floating cus-text-area">
                    <label>Role Description*</label>
                    <textarea name id cols={30} disabled rows={10} value={userRoles ? userRoles.description : ""} className="floating__input" type="text" placeholder="Email Address" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  <h4>Manage Permissions For Users In This Role</h4>
                </div>
                <div className="col-10">
                  <div className="row vertical-tab-group">
                    <ListedFeatures feat_data={userFeat} feat_data_set={userRoles ? userRoles.featureIds : null} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OpenModal
        isOpen={showModal}
        onCancelClickListner={handleCloseModal}
        userName={userRoles ? userRoles.roleName : ""}
        deactivateUser={deactivateUser}
        userId={userRoles ? userRoles.id : ""}
        editFlag={editFlag}
      />
    </React.Fragment>
  )
}


const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      updateLastLoginAction: updateLastLogin,
      getUserRolesAction: getUserRolesbyId,
      getFeatDataAction: getFeatData,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(Viewroles);