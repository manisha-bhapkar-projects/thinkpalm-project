import React, { useEffect, useState } from "react";
import { map } from "lodash";
import ReactDOM from "react-dom";
import { bindActionCreators } from "redux";
import DataTable from "react-data-table-component";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { updateUserDetails } from "../../Actions/RolesAction";
import LinearProgress from "@material-ui/core/LinearProgress";
import SortIcon from "@material-ui/icons/ArrowDownward";
import { useHistory } from "react-router-dom";
import sortdownarrowort from "../../assets/images/sort-down-arrow.png";
// import "./style.scss";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
const sortIcon = <ArrowDownward />;

const RolesTable = (props) => {
	const history = useHistory();
	const customStyles = {
		headCells: {
			style: {
				fontSize: "12px",
				fontWeight: "500",
				// paddingLeft: 0,
			},
		},
	};

	const columns = [
		{
			name: "Role",
			selector: "roleName",
			sortable: true,
		},
		{
			name: "Description",
			selector: "description",
			sortable: true,
		},
		{
			name: "User Group",
			selector: "userGroupName",
			sortable: true,
		},
		{
			name: "No. of Users",
			selector: "usersCount",
			sortable: true,
		},
		{
			name: "Action",
			selector_id: "id",
			cell: (row) => (
				<React.Fragment>
					<a
						className="blue_color pointer"
						onClick={() => {
							history.push(`view-role/${row.id}`);
						}}
						data-test="view"
					>
						View
					</a>
					<a
						id={row}
						onClick={() => getDuplicate(row)}
						className="ml-3 green_color pointer"
						data-test="duplicate"
					>
						Duplicate
					</a>
				</React.Fragment>
			),
		},
	];

	const ColorLinearProgress = withStyles({
		colorPrimary: {
			backgroundColor: "#007bff",
		},
		barColorPrimary: {
			backgroundColor: "#ffffff",
		},
		root: {
			height: 5,
			marginTop: 5,
		},
	})(LinearProgress);

	const useStyles = makeStyles((theme) => ({
		root: {
			width: "100%",
			"& > * + *": {
				marginTop: theme.spacing(0),
			},
		},
	}));

	const LinearIndeterminate = () => {
		const classes = useStyles();

		return (
			<div className={classes.root} >
				<ColorLinearProgress />
			</div>
		);
	};

	let count = 1;
	const checkIfNameExist = (name) => {
		const names = map(props.user_roles_data, "roleName");
		let exist = false;

		names.map((i) => {
			if (i === name && !exist) exist = true;
		});
		return exist;
	};
	const createName = (e, role_name, role_name_no) => {
		let name = "";
		if (role_name_no == 0) {
			name = role_name + count;
		} else {
			let n = role_name.toLowerCase().lastIndexOf(role_name_no);
			let pat = new RegExp(role_name_no, "i");
			name =
				role_name.slice(0, n) +
				role_name.slice(n).replace(pat, role_name_no + count);
		}
		if (checkIfNameExist(name)) {
			count = count + 1;
			createName(e, role_name, role_name_no, count);
		} else {
			if (name) {
				let obj = {
					RoleName: name,
					Description: e.description,
					UserGroupId: e.userGroupId,
					FeatureIds: e.featureIds,
				};
				props.data_duplicate(obj);
				count = 1;
			}
		}
	};
	const getDuplicate = (e) => {
		let role_name = e.roleName;
		let role_name_no = Number(role_name.match(/\d+$/));
		createName(e, role_name, role_name_no, count);
	};

	return (
		<div className="table-custom" data-test="rolesTable">
			<DataTable
				columns={columns}
				noHeader
				progressPending={!props.user_roles_data}
				progressComponent={<LinearIndeterminate />}
				persistTableHead
				customStyles={customStyles}
				noDataComponent={
					<div className="no-data-component">No Roles available</div>
				}
				data={props.user_roles_data || []}
				defaultSortFieldId={1}
				sortIcon={sortIcon}
				className="user-data-table"
			/>
		</div>
	);
};


export default RolesTable;
