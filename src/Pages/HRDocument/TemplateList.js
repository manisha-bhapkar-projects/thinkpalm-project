import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

/* Icons */
import userActiveIcon from "../../assets/images/user-active.svg";
import userDeActiveIcon from "../../assets/images/user-inactive.svg";
import userEditIcon from "../../assets/images/user-edit.svg";
import userPendingIcon from "../../assets/images/user-pending.svg";
import close from "../../assets/images/search-close.svg";
import closeWhite from "../../assets/images/search-close-white.svg";
import archive from "../../assets/images/archive.png";
import dotIcon from "../../assets/images/dotIcon.svg";

/* Component */
import { CustomeNotification } from "../../Components/CustomeNotification/CustomeNotification";
import HRTemplateFilterDropdown from "../../Components/MultiselectDropDown/HRTemplateFilterDropdown";
import SearchHeaderText from "../../Components/SearchHeaderText/SearchHeaderText";
import CustomeTable from "../../Components/CustomeTable/CustomeTable";

/* Action */
import {
	getAllTemplates,
	getAllLanguages,
	updateDocumentStatus,
	getAllCategoriesList
} from "../../Store/reducers/HRTemplate";
import { getUserProfile } from "../../utils/storage";
import constants from "../../utils/constants";

const TemplateList = (props) => {
	document.title = "HR Templates";
	const defaultCats = ['Dismissal', 'Employee Agreement', 'Employee Handbook', 'Mutual Termination Agreement'];
	const defaultLanguages = ['English', 'Local'];
	const dispatch = useDispatch();
	const history = useHistory();
	const [selectedRole, setSelectedRole] = useState([]);
	const [hrTableList, setHrTableList] = useState([]);
	const [selectedCats, setSelectedCats] = useState([]);
	const [searchText, setSearchText] = useState('');
	const [selectedLangs, setSelectedLangs] = useState([]);
	const [showStatusModal, setShowStatusModal] = useState(false);
	const [deactivateStatus, setDeactivateStatus] = useState({});
	const [templateListParam, setTemplateListParam] = useState({
		pageNumber: 1,
		pageSize: 10,
		total: 0,
		category: [],
		language: [],
	});

	const [userData, setUserData] = useState();
	const [sortOrder, setSortOrder] = useState(true);
	const [sortField, setSortField] = useState("updateddate");
	const [id, setId] = useState("");

	const {
		templatesListLoading,
		templatesList,
		languageList,
		categoriesList,
		templatesListCount,
		_updateDocumentStatus,
		updateDocumentStatusLoading
	} = useSelector((state) => state.HRTemplate);

	const TemplateListColumns = [
		{
			name: "Type",
			selector: "type",
			width: "20%",
			sortable: true,
			sortName: "type",
			cell: (row) => {
				return (
					<p className="font-family-for-list mb-2 link-btn" onClick={() => onViewClick(row)}>{row.type}</p>
				);
			},
		},
		{
			name: "Description",
			selector: "description",
			sortable: true,
			sortName: "description",
			width: "30%",
			cell: (row) => (
				<p className="font-family-for-list mb-2">{row.description}</p>
			),
		},
		{
			name: "Country",
			selector: "countryName",
			right: false,
			sortable: true,
			width: "20%",
			sortName: "country",
			cell: (row) => {
				return (
					<p className="font-family-for-list mb-2">{row.countryName}</p>
				);
			},
		},
		{
			name: "Language",
			selector: "languageName",
			width: "20%",
			sortable: true,
			right: false,
			sortName: "language",
			cell: (row) => {
				return (
					<p className="font-family-for-list mb-2">{row.languageName}</p>
				);
			},
		}
	];

	const loadTemplateResult = (req) => {
		const _apiLangs = { ...templateListParam };

		if (_apiLangs?.language?.length > 0 && _apiLangs.language.includes('all')) {
			_apiLangs.language = _apiLangs.language.filter(_lng => _lng !== 'all');
			const filteredList = [];
			languageList.map(_langs => {
				if (!defaultLanguages.includes(_langs.language_Name)) {
					filteredList.push(_langs.id);
				}
			})
			_apiLangs.language = filteredList;
		}

		if (!props.testCase) dispatch(getAllTemplates(req ? { ...req, ..._apiLangs } : { ..._apiLangs }));
	};

	useEffect(() => {
		var user_data = getUserProfile();
		setUserData(user_data);
		if (!props.testCase) dispatch(getAllLanguages());
		if (!props.testCase) dispatch(getAllCategoriesList());

	}, []);

	useEffect(() => {
		if (!templatesListLoading) {
			setHrTableList(templatesList.map((_template) => {
				return {
					..._template, description: _template?.document?.description,
					type: _template?.category?.categoryName,
				}
			}));

			setTemplateListParam({
				...templateListParam,
				total: templatesListCount
			})
		}
		else {
			setHrTableList(templatesList)
		}
	}, [templatesListLoading, templatesList]);


	useEffect(() => {
		if (_updateDocumentStatus === true) {
			loadTemplateResult();
			handleResetFilter();
		}
	}, [_updateDocumentStatus, updateDocumentStatusLoading]);

	useEffect(() => {
		loadTemplateResult({ sort: sortOrder, sortBy: sortField, searchText: searchText });
	}, [
		templateListParam.pageNumber,
		templateListParam.pageSize,
		templateListParam.category,
		templateListParam.language,
		searchText
	]);

	useEffect(() => {
		if (_updateDocumentStatus === true) {
			handleResetFilter();
			loadTemplateResult();
		}
	}, [_updateDocumentStatus, updateDocumentStatusLoading])

	const handleSort = (field, order) => {
		setSortField(field?.sortName);
		setSortOrder(order === "asc" ? false : true);
		loadTemplateResult({ sort: order === "asc" ? false : true, sortBy: field?.sortName, searchText: searchText });
	};

	const handleDotClick = (statusId) => {
		if (id && id == statusId) {
			setId(undefined);
		} else {
			setId(statusId);
		}
	};

	const deactivateTemplate = async (row) => {
		if (!props.testCase) await dispatch(updateDocumentStatus({ id: row.id, status: !deactivateStatus.document?.isActive }));
		setShowStatusModal(false);
	};

	const onViewClick = (row) => {
		goToEditPage(row)
	};

	const goToEditPage = (navigateTo) => {
		if (!props.testCase) {
			if (navigateTo) {
				history.push(`${constants.ROUTE.HR_TEMPLATE.VIEW_EDIT_NEW_TEMPLATE.replace(":id", navigateTo.id).replace(":status", "view")}`);
			} else {
				history.push(`${constants.ROUTE.HR_TEMPLATE.ADD_NEW_TEMPLATE}`);
			}
		}
	};

	const handleClickSelect = async (data, e, type) => {
		const APIRequest = {
			...templateListParam,
			category: [],
			language: [],
		};

		if (type === 'document') {
			let array = selectedCats.slice(0);
			if (e.target.checked) {
				setSelectedCats([...array, data.id]);
				array = [...array, data.id];
			} else {
				setSelectedCats(array.filter((item) => item !== data.id));
				array = array.filter((item) => item !== data.id);
			}

			APIRequest.category.push(...array);
		} else {
			let array = selectedLangs.slice(0);
			if (e.target.checked) {
				if (data === 'all') {
					setSelectedLangs([...array, data]);
					array = [...array, data];
				} else {
					setSelectedLangs([...array, data.id]);
					array = [...array, data.id];
				}
			} else {
				if (data === 'all') {
					setSelectedLangs(array.filter((item) => item != data));
					array = array.filter((item) => item != data);
				} else {
					setSelectedLangs(array.filter((item) => item != data.id));
					array = array.filter((item) => item != data.id);
				}
			}

			APIRequest.language.push(...array);
		}

		setTemplateListParam(APIRequest);
	};

	const onSearchValueChange = ({ target: { value } }) => {
		setSearchText(value);
	}

	const handleResetFilter = () => {
		setSelectedCats([]);
		setSelectedLangs([]);
		setTemplateListParam({
			...templateListParam,
			category: [],
			language: [],
		});
	}

	const popupAction = (type, row) => {
		if (type === "deactivate") {
			setShowStatusModal(true);
			setDeactivateStatus(row)
		} else if (type === "activate") {
			setShowStatusModal(true);
			setDeactivateStatus(row)
		} else {
			goToEditPage(row.id);
		}
	};

	const handleDropdownChange = (e) => {
		const requestObject = {
			...templateListParam,
			pageNumber: 1,
			pageSize: e.target.value,
		};

		setTemplateListParam(requestObject)
	};

	const handlePageChange = (perPage) => {
		const requestObject = {
			...templateListParam,
			pageNumber: perPage,
		};

		setTemplateListParam(requestObject)
	};

	const closePopup = ({ target }) => {
		// console.log(target.className) // Enable this to check the classNames
		const closeActionClickClassName = ["hr-template-container", 'font-family-for-list mb-2', "row", "table-custom custom-tabe-tooltip", 'rdt_TableCell'];
		if (closeActionClickClassName.includes(target.className) || target.className.includes("rdt_TableCell") || target.className.includes("rdt_TableCol")) {
			setId(undefined);
		}
	}

	return (
		<div className="hr-template-container" data-testid="TemplateList-result-page" onClick={closePopup}>
			<SearchHeaderText
				filter={true}
				breadcrumb={true}
				user={userData}
				handleClickBack={undefined}
				HRTemplateBreadcrumb={true}
			/>
			<div className="container-fluid">
				<div className="col-12">
					<div className="title-action-wrap">
						<div className="row">
							<div className="col-sm-6 pl-0">
								<h3
									className="gutter-manag-user"
									data-tip="Manage user"
								>
									Manage Templates
								</h3>
							</div>
						</div>
						<div className="row">
							<div className="col-sm-6 col-12 pl-0">
								<div className="tbl-search">
									<div className="hr-template-search">
										<input
											type="text"
											className="form-control"
											value={searchText}
											data-testid="search-filter-country"
											onChange={onSearchValueChange}
											placeholder="Search by country"
										/>
										{searchText ?
											<div onClick={() => onSearchValueChange({ target: { value: '' } })}>
												{props.theme === "dark" ?
													<img
														alt=""
														src={closeWhite}
														name="search-outline"
														className="close-icon-search-knowledge cursor-pointer"
													/>
													:
													<img
														alt=""
														src={close}
														name="search-outline"
														className="close-icon-search cursor-pointer"
													/>}
											</div>
											: null}
									</div>

									{/* 
									Hiding Archives for now
									
									<div className="download_btn" onClick={() => history.push(`${constants.ROUTE.HR_TEMPLATE.ARCHIVE}`)}>
										<span>
											<img src={archive} alt="archive" />
											Archives
										</span>
									</div> */}
								</div>
							</div>
							<div className="col-sm-6 col-12 d-flex align-items-center justify-content-md-end pr-0 pl-0">
								<Tooltip title="Add Template">
									<button
										type="button"
										data-testid="open-template-filter"
										className="primary-button ml-0 ml-md-3 mr-3"
										onClick={() => goToEditPage()}
									>
										Add Template
									</button>
								</Tooltip>
								<div className="filter-wrap">
									<HRTemplateFilterDropdown
										data={categoriesList}
										languages={languageList.filter(c => defaultLanguages.includes(c.language_Name))}
										handleClickSelect={handleClickSelect}
										resetFilter={handleResetFilter}
										selectedType={selectedCats}
										selectedLanguages={selectedLangs}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="container-fluid">
				<div
					className="table-custom custom-tabe-tooltip"
					data-test="custome-table"
				>
					<CustomeTable
						{...props}
						columns={TemplateListColumns}
						data={hrTableList}
						pending={templatesListLoading}
						pagination={false}
						disabledJumpTo={false}
						paginationServer={false}
						noDataString={<div className="no-data-found-hr-template">Add templates to see them listed here.</div>}
						onSort={handleSort}
						custompagination
						totalListCount={templateListParam.total}
						paginationTotalRows={templateListParam.total}
						paginationPerPage={templateListParam.pageSize}
						onPageChangedCalled={handlePageChange}
						pageNumber={templateListParam.pageNumber}
						handleDropdownChange={handleDropdownChange}
						limit={templateListParam.pageSize}
						inputClassName={"hrTemplate"}
					/>
				</div>
			</div>

			<Modal
				show={showStatusModal}
				onHide={() => { setDeactivateStatus({}); setShowStatusModal(false) }}
				backdrop="static"
				keyboard={false}
				centered={true}
				contentClassName="custome-modal"
			>
				<Modal.Header className="role_header_model" closeButton>
					<Modal.Title>
						{deactivateStatus?.document?.isActive ? 'Deactivate' : 'Activate'} {deactivateStatus?.type}?
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="role_body_model">
					{
						deactivateStatus?.document?.isActive ? 'Users will no longer have access to this template.' : 'Users will have the access to this template.'
					}
					{
						deactivateStatus?.document?.isActive ? 'The template will be archived after 30 days.' : ''
					}
				</Modal.Body>
				<Modal.Footer className="role_footer_model">
					<Button variant="secondary" onClick={() => { setDeactivateStatus({}); setShowStatusModal(false) }}>
						Cancel
					</Button>
					<Button variant="primary" onClick={() => deactivateTemplate(deactivateStatus)}>
						{deactivateStatus?.document?.isActive ? "Deactivate" : "Activate"}
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default TemplateList;
