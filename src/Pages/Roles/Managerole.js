import React, { useEffect, useState } from "react";
import HeaderText from "../Home/HeaderText";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getUserProfile, isLastLoginAttempted } from "../../utils/storage";
import { updateLastLogin } from "../../Actions/UserProfileAction";
import { permissionMapping } from "../../utils/utils";
import constants from "../../utils/constants";

import {
	getUserRoles,
	updateUserDetails,
	postUserRole,
} from "../../Actions/RolesAction";
import sortdownarrowort from "../../assets/images/sort-down-arrow.png";
import { CustomeNotification } from "../../Components/CustomeNotification/CustomeNotification";
import RolesTable from "./RolesTable";
import SupportButton from "../../Components/SupportButton"

const Manageroles = (props) => {
	const [userData, setUserData] = useState();
	const [userRoles, setuserRoles] = useState();
	var user_data = getUserProfile();
	const history = useHistory();
	const handleClick = () => history.push("create-role");
	const permissionArray = permissionMapping();

	useEffect(() => {
		if (!permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_ROLES))
		history.push("/home")
		getUserRolesAction_details();
	}, []);

	const getUserRolesAction_details = () => {
		props
			.getUserRolesAction()
			.then((response) => {
				let res_data = response.data.data;
				setuserRoles(res_data);
			})
			.catch((errors) => {
				console.log(errors);
			});
	};

	const postUserRoleAction_details = (a) => {
		props
			.postUserRoleAction(a)
			.then((response) => {
				let res_data = response.data.data;
				getUserRolesAction_details();
				props.notify("Role Duplicated Successfully", 5000);
			})
			.catch((error) => {
				console.log("error?.response?", error?.response);
				if (error?.response?.data?.errors) {
					const m = error.response.data.errors;
					const message = m.join(",");
					props.notify(message, 5000);
				}
			});
	};

	return (
		<React.Fragment >
			<div className="hide-layout-ctrl">
				<HeaderText user={userData} hideTitle />
			</div>

			<div className="container-fluid" data-test="manageroles">
				<div className="breadcrump-admin">
					<nav aria-label="breadcrumb">
						<ol className="breadcrumb pl-0">
							<li className="breadcrumb-item">
								<span>Settings</span>
							</li>
							<li
								className="breadcrumb-item active"
								aria-current="page"
							>
								<span className="breadcrumb-title">
									Roles &amp; Permissions
								</span>
							</li>
						</ol>
					</nav>
				</div>

				<div className="col-12">
					<div className="title-action-wrap">
						<div className="row">
							<div className="col-sm-6 pl-0 d-flex align-items-center">
								<h3 className="pb-0 mb-0 pl-0">
									Manage Roles
									{/* <a href=""><i className="ph-arrow-left"></i></a> */}
								</h3>
							</div>
							<div className="col-sm-6 col-12 d-flex align-items-start justify-content-md-end pr-0 pl-0">

								<button
									type="button"
									onClick={handleClick}
									className={permissionArray?.includes(constants.PERMISSION_MAPPING.CREATE_EDIT_DELETE_ROLES) ? "primary-button create-role-button" : "a-disabled primary-button"}
									data-test="roleClick"
								>
									Create Role
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="table-custom">
					<RolesTable
						data_duplicate={postUserRoleAction_details}
						user_roles_data={userRoles}
					></RolesTable>
				</div>
			</div>
			<SupportButton />
		</React.Fragment>
	);
};

const mapDispatchToProps = (dispatch) =>
	bindActionCreators(
		{
			updateLastLoginAction: updateLastLogin,
			getUserRolesAction: getUserRoles,
			updateUserDetailsAction: updateUserDetails,
			postUserRoleAction: postUserRole,
		},
		dispatch
	);

export default connect(null, mapDispatchToProps)(Manageroles);
