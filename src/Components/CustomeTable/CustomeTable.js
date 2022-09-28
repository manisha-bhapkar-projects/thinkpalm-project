import React from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import DataTable from "react-data-table-component";
import CustomePagination from "../CustomePagination/CustomePagination";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
// import "./CustomeTable.css";
const customStyles = {
	headCells: {
		style: {
			fontSize: "12px",
			fontWeight: "500",
		},
	},
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		"& > * + *": {
			marginTop: theme.spacing(0),
		},
	},
}));
const ac=80
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

const LinearIndeterminate = () => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<ColorLinearProgress />
		</div>
	);
};

const sortIcon = <ArrowDownward />;


function CustomeTable(props) {
	const {
		data,
		columns,
		total,
		customStyle,
		noDataString,
		pending,
		pagination,
		paginationServer,
		totalListCount,
		handlePageChange,
		numOfColumns,
		persistTableHead,
		onPageChangedCalled,
		custompagination,
		disabledJumpTo,
		onChangeLimit,
		paginationPerPage,
		inputClassName,
		pageNumber,
		handleDropdownChange,
		limit,
		onSort,
		shadowText,
		shadowTitle,
		customClassName,
		expertHour,
		progressBar,
		hoursDetails,
		// searchtext,
		...rest
	} = props;

	const numberOfCol = () => {
		if (numOfColumns === 0) {
			return columns?.length;
		}
		return numOfColumns;
	};

	let conditionalRowStyles = undefined;

	if (customStyle && customStyle != "") {
		if (customStyle === "accounts") {
			conditionalRowStyles = [
				{
					when: row => row.isActive === false,
					style: {
						backgroundColor: '#7080902e'
					},
				},
			];
		} else if (customStyle === "users") {

			conditionalRowStyles = [
				{
					when: row => row.userProfile?.isActive === false,
					style: {
						backgroundColor: '#7080902e'
					},
				},
			];
		}
	}

	

	if (props.testCase && props.UploadDocList) {
		onSort(props.UploadDocList, 'asc')
	}
	return (
		<>
			<div
				className={`${inputClassName} ${numberOfCol && numberOfCol() > 4
					? "card-list-table"
					: "card-list-table col-less-equal-4"
					}`}
			>
				{total && !pending ? (
					<div className="total">
						Total # <span> {data ? totalListCount : ""}</span>
					</div>
				) : null}
				{shadowText && expertHour ?
				<>
				<div>
				<p className="shadowText"> {shadowTitle}</p> 
				</div>
				<div className="summary-container">
					<div className="balance-hrs">
						<h3>{hoursDetails?.availableHours}</h3>
						<h4>Hours<br></br> Available</h4>
					</div>
					<div className="used-hrs">
						<h4>{hoursDetails?.availableHours>0?hoursDetails?.usedHours:"00:00"} hrs used</h4>
						<div className="status-bar">
							<div className="active-bar" 
							style={
								hoursDetails?.availableHours>0&&hoursDetails?.availableHours>parseInt(hoursDetails?.usedHours?.split(":")[0])?
								{
									width:
									`${
										(
											((parseInt(hoursDetails?.usedHours?.split(":")[0])*60)+(parseInt(hoursDetails?.usedHours?.split(":")[1])))
											/
											((hoursDetails?.availableHours*60))
											)*100
										}%`
								}:hoursDetails?.availableHours<parseInt(hoursDetails?.usedHours?.split(":")[0])?{width:"100%"}:{}
							}
							>

							</div>
						</div>
					</div>
					<div className="querys-status">
						<div className="querys-stat">
							<h3>{hoursDetails?.submittedQueryCount}</h3>
							<h5>Submitted <br></br>Queries</h5>
						</div>
						<div className="querys-stat">
							<h3 className="orange">{hoursDetails?.inprogressQueryCount}</h3>
							<h5>In Progress <br></br>Queries</h5>
						</div>
						<div className="querys-stat">
							<h3 className="green">{hoursDetails?.completedQueryCount}</h3>
							<h5>Completed <br></br>Queries</h5>
						</div>
					</div>
				</div>
				<div>
				<p className="shadowText"> {shadowTitle}</p> 
				</div>
				</>
				:<div>
				<p className="shadowText"> {shadowTitle}</p> 
				</div> }
				
				<DataTable
					columns={columns}
					sortIcon={sortIcon}
					data={data}
					responsive={true}
					// expandableRows = {true}
					// className={total && !pending ? "" : ""}
					className={`user-data-table ${customClassName}`}
					noHeader
					highlightOnHover
					noDataComponent={
						<div className="no-data-component">{noDataString}</div>
					}
					customStyles={customStyles}
					conditionalRowStyles={conditionalRowStyles}
					progressPending={pending}
					progressComponent={<LinearIndeterminate />}
					persistTableHead={persistTableHead}
					paginationPerPage={paginationPerPage}
					paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
					onChangeRowsPerPage={onChangeLimit}
					pagination={pagination}
					paginationServer={paginationServer}
					paginationTotalRows={totalListCount}
					paginationDefaultPage={1}
					paginationComponentOptions={{
						noRowsPerPage: true,
					}}
					onChangePage={handlePageChange}
					sortServer={true}
					{...rest}
					onSort={onSort}
				/>
			</div>
			{custompagination && !pagination && data && data.length ? (
				<CustomePagination
					{...props}
					totalLength={totalListCount}
					paginationPerPage={paginationPerPage}
					onPageChangedCalled={onPageChangedCalled}
					pageNumber={pageNumber}
					limit={paginationPerPage}
					paginationRowsPerPageOptions={[10, 15, 20, 25, 30]}
					handleDropdownChange={handleDropdownChange}
				// limit={limit}
				/>
			) : (
				<></>
			)}
		</>
	);
}

CustomeTable.defaultProps = {
	total: false,
	noDataString: "No Records Available",
	pagination: false,
	custompagination: false,
	pending: false,
	paginationServer: false,
	totalListCount: 0,
	numOfColumns: 0,
	handlePageChange: () => { },
	onChangeLimit: () => { },
	onPageChangedCalled: () => { },
	persistTableHead: true,
	paginationPerPage: 15,
	inputClassName: "",
};
CustomeTable.propTypes = {
	data: PropTypes.instanceOf(Array),
	columns: PropTypes.instanceOf(Array),
	total: PropTypes.bool,
	pagination: PropTypes.bool,
	custompagination: PropTypes.bool,
	noDataString: PropTypes.any,
	pending: PropTypes.bool,
	paginationServer: PropTypes.bool,
	totalListCount: PropTypes.number,
	handlePageChange: PropTypes.func,
	numOfColumns: PropTypes.number,
	persistTableHead: PropTypes.bool,
	onPageChangedCalled: PropTypes.func,
	onChangeLimit: PropTypes.func,
	paginationPerPage: PropTypes.number,
	inputClassName: PropTypes.string,
};

export default CustomeTable;
