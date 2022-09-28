import React from "react";
import { useHistory } from "react-router-dom";

/* Component */
import constants from "../../utils/constants";

/* Icons */
import archive from "../../assets/images/archive.svg";
import book from "../../assets/images/book-blue.svg";

/* Pages */
import SearchBar from "../SearchBar";

import { permissionMapping } from "../../utils/utils"
const SearchHeaderText = (props) => {
  const history = useHistory();
  const permissionArray = permissionMapping();

  const handleClickBack = () => {
    if (props.addCountry) {
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.FAVORITE_COUNTRIES);
    } else if (props.viewQuery) {
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.MANAGE_BRIEFS);
    } else if (props.manageBriefsQuery) {
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.MANAGE_BRIEFS);
    }
    else if (props.AddQuery) {
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.MANAGE_BRIEFS);
    }
    else if (props.HRTemplateBreadcrumb) {
      history.push(constants.ROUTE.HR_TEMPLATE.LIST);
    } else if (props.accountPage) {
      if (props.title === "Edit") {
        props.gotoView();
      } else if (props.title === "Add") {
        history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Accounts');
      } else {
        history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST);
      }
    } else if (props.manageUsersAddEdit) {
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERS);
    } else if (props.pageTitle === 'Add User' || props.pageTitle === "Edit User") {
      if (props.backToAccounts) {
        history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Accounts');
      } else {
        history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Users');
      }
    } else if (props.clientViewEstimate || props.clientViewQuery) {
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.PURCHASE_EXPERT_BRIEFS + '/Expert-Briefs');
    } else {
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST);
    }
  };

  return (
    <>
      <div className="container-fluid" data-test="header">
        <SearchBar theme={props.cartIconWhite} />
      </div>
      {props.breadcrumb ? (
        <div className="container-fluid" data-test="breadcrumb">
          <div className="breadcrump-admin">
            <nav aria-label="breadcrumb">
              {props.userlistBreadcrumb ? (
                <ol className="breadcrumb" data-test="userlistBreadcrumb">
                  <li className="breadcrumb-item">
                    <span>Settings</span>
                  </li>
                  <li className="breadcrumb-item active">
                    <span className="breadcrumb-title">Accounts & Users</span>
                  </li>
                </ol>
              ) : props.myAccount ? (
                <>
                  <ol className="breadcrumb" data-test="myAccount">
                    {props.showSettings && (
                      <li className="breadcrumb-item">
                        <span>Settings</span>
                      </li>
                    )}
                    <li className="breadcrumb-item active" aria-current="page">
                      My Account
                    </li>
                  </ol>
                </>
              ) : props.favotiteCountries ? (
                <>
                  <ol className="breadcrumb" data-test="favotiteCountries">
                    <li className="breadcrumb-item">
                      <span>Settings</span>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Favorite Countries
                    </li>
                  </ol>
                </>
              ) : props.addCountry ? (
                <ol className="breadcrumb" data-test="addCountry">
                  <li className="breadcrumb-item">
                    <span>Settings</span>
                  </li>
                  <li
                    className="breadcrumb-item"
                    aria-current="page"
                    onClick={handleClickBack}
                    style={{ cursor: "pointer" }}
                    data-test="addClick"
                  >
                    Favorite Countries
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    <span>Add Country</span>
                  </li>
                </ol>
              ) : props.AddQuery ?
                <ol className="breadcrumb" data-test="addQuery">
                  <li className="breadcrumb-item">
                    <span>Settings</span>
                  </li>
                  <li
                    className="breadcrumb-item"
                    aria-current="page"
                    onClick={handleClickBack}
                    style={{ cursor: "pointer" }}
                    data-test="addClick"
                  >
                    Briefs
                  </li>
                  <li
                    className="breadcrumb-item active"
                    aria-current="page"
                  >
                    <span>Add Query</span>
                  </li>
                </ol>
                : props.HRTemplateBreadcrumb ? (
                  <ol className="breadcrumb" data-test="HRTemplateBreadcrumb">
                    <li className="breadcrumb-item">
                      <span>Settings</span>
                    </li>
                    <li
                      className={`${props.isView === undefined ? 'active' : ''} breadcrumb-item`}
                      aria-current="page"
                      onClick={props.handleClickBack}
                      style={{ cursor: "pointer" }}
                      data-test="hrClick"
                    >
                      HR Templates
                    </li>
                    {
                      props.isView !== undefined ?
                        <li className="breadcrumb-item active" aria-current="page">
                          <span>{props.isView} HR Template</span>
                        </li>
                        : null
                    }
                  </ol>
                ) : props.isArchive ? (
                  <ol className="breadcrumb" data-test="isArchive">
                    <li className="breadcrumb-item">
                      <span>Settings</span>
                    </li>
                    <li
                      className={`breadcrumb-item`}
                      // onClick={() => history.push(constants.ROUTE.HR_TEMPLATE.LIST)}
                      aria-current="page"
                      onClick={() => props.handleClickBack(props.isArchive)}
                      style={{ cursor: "pointer" }}
                      data-test="isArchiveClick"
                    >
                      HR Templates
                    </li>
                    <li
                      className={`${props.isView === undefined ? 'active' : ''} breadcrumb-item`}
                      aria-current="page"
                      onClick={props.handleClickBack}
                      style={{ cursor: "pointer" }}
                    >
                      Archives
                    </li>
                    {
                      props.isView !== undefined ?
                        <li className="breadcrumb-item active" aria-current="page">
                          <span>{props.isView} HR Template</span>
                        </li>
                        : null
                    }
                  </ol>
                )
                  :
                  props.addEditAccount ? (
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <span>Settings</span>
                      </li>
                      <li className="breadcrumb-item">
                        <span className="breadcrumb-title cp" onClick={props.onBreadCrumbsClick}>Accounts & Users</span>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        <span className="breadcrumb-title">
                          {props.title + " Account"}
                        </span>
                      </li>
                    </ol>
                  ) : props.accountUsers ? (
                    <>
                      <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                          <span>Settings</span>
                        </li>
                        <li className="breadcrumb-item active">
                          <span >Users</span>
                        </li>
                      </ol>
                      <div className="tbl-search mt-4">
                        <input
                          type="text"
                          className="form-control"
                          value={props.searchValue}
                          onChange={props.onTextChange}
                          placeholder="Search Users"
                          data-test="search"
                        />
                        {props.searchValue ?
                          <div onClick={() => {
                            props.setSearchValue("");
                          }} data-test="searchDiv">
                            <img
                              alt=""
                              src={props.close}
                              height={11}
                              name="search-outline"
                              className="cursor-pointer close-icon-search-users"
                            />
                          </div>
                          : null}
                      </div>
                    </>
                  ) : props.purchaseBreadcrumb ? (
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <span>Settings</span>
                      </li>
                      <li className="breadcrumb-item">
                        <span >Purchases & Expert Briefs</span>
                      </li>
                    </ol>
                  ) : props.UsersBreadcrumb ? (
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item">
                        <span>Settings</span>
                      </li>
                      <li className="breadcrumb-item active">
                        <span >Users</span>
                      </li>
                    </ol>
                  ) : props.manageUsersAddEdit ? (
                    <ol className="breadcrumb" data-test="manageUsersAddEdit">
                      <li className="breadcrumb-item">
                        <span>Settings</span>
                      </li>
                      <li className="breadcrumb-item">
                        <span className="pointer link" onClick={handleClickBack} data-test="managClick">Users</span>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        <span className="breadcrumb-title">
                          {props.isEdit ? "Edit User" : "Add User"}
                        </span>
                      </li>
                    </ol>
                  ) : props.manageBriefsQuery ? (
                    <ol className="breadcrumb" data-test="manageUsersAddEdit">
                      <li className="breadcrumb-item">
                        <span>Settings</span>
                      </li>
                      <li className="breadcrumb-item">
                        <span className="pointer link" data-test="managClick"
                          onClick={handleClickBack}>Briefs</span>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        <span className="breadcrumb-title">
                          Manage Query
                        </span>
                      </li>
                    </ol>
                  ) : props.manageBriefsListing ? (
                    <ol className="breadcrumb" data-test="manageUsersAddEdit">
                      <li className="breadcrumb-item">
                        <span>Settings</span>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        <span className="breadcrumb-title">
                          Briefs
                        </span>
                      </li>
                    </ol>
                  ) : props.viewQuery ? (
                    <ol className="breadcrumb" data-test="manageUsersAddEdit">
                      <li className="breadcrumb-item">
                        <span>Settings</span>
                      </li>
                      <li className="breadcrumb-item">
                        <span className="pointer link" data-test="managClick"
                          onClick={handleClickBack}
                        >Briefs</span>
                      </li>
                      <li className="breadcrumb-item active" aria-current="page">
                        <span className="breadcrumb-title">
                          View Query
                        </span>
                      </li>
                    </ol>
                  ) :
                    props.clientViewEstimate ? (
                      <ol className="breadcrumb" data-test="manageUsersAddEdit">
                        <li className="breadcrumb-item">
                          <span>Settings</span>
                        </li>
                        <li className="breadcrumb-item">
                          <span className="pointer link" onClick={handleClickBack} data-test="managClick">Purchases & Expert Briefs</span>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                          <span className="breadcrumb-title">
                            View Estimate
                          </span>
                        </li>
                      </ol>
                    ) :
                      props.clientViewQuery ? (
                        <ol className="breadcrumb" data-test="manageUsersAddEdit">
                          <li className="breadcrumb-item">
                            <span>Settings</span>
                          </li>
                          <li className="breadcrumb-item">
                            <span className="pointer link" onClick={handleClickBack} data-test="managClick">Purchases & Expert Briefs</span>
                          </li>
                          <li className="breadcrumb-item active" aria-current="page">
                            <span className="breadcrumb-title">
                              View Query
                            </span>
                          </li>
                        </ol>
                      )
                        : (
                          <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                              <span>Settings</span>
                            </li>
                            <li className="breadcrumb-item">
                              <span className="pointer link" onClick={handleClickBack} data-test="userClick">Accounts & Users</span>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                              <span className="breadcrumb-title">
                                {props.isEdit ? "Edit User" : "Add User"}
                              </span>
                            </li>
                          </ol>
                        )}
            </nav>
          </div>
        </div>
      ) : (
        ""
      )}
      {props.titleHeader ? (
        <div className="" data-test="title">
          <div className="col-12">
            <div className="title-action-wrap">
              <div className="container-fluid">
                <div className="row align-items-center">
                  <div className="col-sm-5 pl-0 d-flex align-items-center fav-header">
                    <h3>
                      {props.pageTitle}
                      <span className="left-arrow">
                        <i
                          className="ph-arrow-left"
                          style={{ cursor: "pointer" }}
                          onClick={handleClickBack}
                        />
                      </span>
                    </h3>
                  </div>
                  <div className="col-sm-7 d-flex justify-content-end pr-0">
                    <button
                      type="button"
                      className="secondary-gray-button"
                      onClick={handleClickBack}
                    >
                      Cancel
                    </button>

                    {
                      props.onSave_Add &&
                      (<button
                        type="button"
                        className="secondary-gray-button save-add-user"
                        data-testid="save-Template"
                        onClick={props.onSave_Add}
                      >
                        Save & Add New User
                      </button>)
                    }
                    {props.AddQuery ? <button
                      type="button"
                      className="primary-button"
                      data-testid={props.testId}
                      onClick={props.onClick}
                    >
                      Save
                    </button> :
                      <button
                        type="button"
                        className="primary-button"
                        data-testid="save-Template"
                        onClick={props.onClick}
                      >
                        {props.isEdit
                          ? props.activeUser
                            ? "Save & Reactivate User"
                            : "Save"
                          : "Add"}
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : props.manageUsersAddEdit ? (
        <div className="">
          <div className="col-12">
            <div className="title-action-wrap">
              <div className="container-fluid">
                <div className="row align-items-center">
                  <div className="col-sm-5 pl-0 d-flex align-items-center fav-header">
                    <h3>
                      {props.pageTitle}
                      <span className="left-arrow">
                        <i
                          className="ph-arrow-left"
                          style={{ cursor: "pointer" }}
                          onClick={handleClickBack}
                        />
                      </span>
                    </h3>
                  </div>
                  <div className="col-sm-7 d-flex justify-content-end pr-0">
                    <button
                      type="button"
                      className="secondary-gray-button"
                      onClick={handleClickBack}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      className="primary-button"
                      data-testid="save-Template"
                      onClick={props.onClick}
                    >
                      {props.isEdit
                        ? props.activeUser
                          ? "Save & Reactivate User"
                          : "Save"
                        : "Add"}

                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : props.manageBriefsQuery ? (
        <div className="">
          <div className="col-12">
            <div className="title-action-wrap brief-header">
              <div className="container-fluid">
                <div className="row align-items-center">
                  <div className="col-sm-5 pl-0 d-flex align-items-center">
                    <h3>
                      {props.pageTitle}
                      <span className="left-arrow">
                        <i
                          className="ph-arrow-left"
                          style={{ cursor: "pointer" }}
                          onClick={handleClickBack}
                        />
                      </span>
                    </h3>
                  </div>
                  <div className="col-sm-7 d-flex justify-content-end pr-0">

                    <span className="reference-id">
                      Reference #{props.referenceNo}
                    </span>

                    <span
                      // className="view-query"
                      className={
                        permissionArray?.includes(
                          constants.PERMISSION_MAPPING.VIEW_QUERY_MANAGEMENT_PAGE
                        )
                          ? 'view-query'
                          : 'view-query a-disabled'
                      }
                      onClick={() =>
                        history.push({
                          pathname: `${constants.ROUTE.SIDEBAR.SETTINGS.VIEW_QUERY}${props.viewQueryId}`,
                        })}>
                      View Query
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : props.viewQuery ? (
        <div className="col-12">
          <div className="title-action-wrap">
            <div className="container-fluid">
              <div className="row align-items-center">
                <div className="col-sm-5 pl-0 d-flex align-items-center fav-header">
                  <h3>
                    {props.pageTitle}
                    <span className="left-arrow">
                      <i
                        className="ph-arrow-left"
                        style={{ cursor: "pointer" }}
                        onClick={handleClickBack}
                      />
                    </span>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : props.clientViewEstimate ? (
        <div className="">
          <div className="col-12">
            <div className="title-action-wrap">
              <div className="container-fluid">
                <div className="row align-items-center">
                  <div className="col-sm-5 pl-0 d-flex align-items-center fav-header">
                    <h3>
                      Expert Briefs
                      <span className="left-arrow">
                        <i
                          className="ph-arrow-left"
                          style={{ cursor: "pointer" }}
                          onClick={handleClickBack}
                        />
                      </span>
                    </h3>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      ) : props.clientViewQuery ? (
        <div className="">
          <div className="col-12">
            <div className="title-action-wrap">
              <div className="container-fluid">
                <div className="row align-items-center">
                  <div className="col-sm-5 pl-0 d-flex align-items-center fav-header">
                    <h3>
                      Expert Briefs
                      <span className="left-arrow">
                        <i
                          className="ph-arrow-left"
                          style={{ cursor: "pointer" }}
                          onClick={handleClickBack}
                        />
                      </span>
                    </h3>
                  </div>
                  <div className="col-sm-7 d-flex justify-content-end pr-0">



                    <span style={{ color: '#40659E' }}>
                      Download
                    </span>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      ) : props.HrTemplateHeader ? (
        <div className="" data-test="HrTemplateHeader">
          <div className="col-12">
            <div className="title-action-wrap">
              <div className="container-fluid">
                <div className="row align-items-center">
                  {/* 
                  revert when archive enabled
                  <div className="col-sm-5 pl-0 d-flex align-items-center fav-header"> */}
                  <div className="col-sm-7 pl-0 d-flex align-items-center fav-header">
                    <h3>
                      {props.pageTitle}
                      <span className="left-arrow">
                        <i
                          className="ph-arrow-left"
                          style={{ cursor: "pointer" }}
                          onClick={props.handleClickBack || handleClickBack}
                          data-test="HrTemplateHeaderClick"
                        />
                      </span>
                    </h3>
                  </div>
                  {/* 
                   revert when archive enabled
                  <div className={`col-sm-7 d-flex ${!props.isPageView && props.isView !== "Add" ? "justify-content-between" : "justify-content-end"} pr-0`}> */}
                  <div className={`col-sm-5 d-flex ${!props.isPageView && props.isView !== "Add" ? "justify-content-between" : "justify-content-end"} pr-0`}>
                    {
                      props.isPageView ? (
                        <>
                          <button
                            type="button"
                            className="text-icon-button edit "
                            data-testid="edit-Template"
                            onClick={props.onClickEdit}
                          >
                            <img src={book} alt="archive" />
                            Edit
                          </button>
                          {/* <button
                            type="button"
                            className="text-icon-button"
                            data-testid="archive-Template"
                            onClick={props.onClickArchive}
                          >
                            <img src={archive} alt="archive" />
                            Add to Archives
                          </button> */}
                        </>
                      ) : props.isEdit ? (
                        <>
                          <button
                            type="button"
                            className="text-icon-button edit  disable-btn"
                            data-testid="edit-Template"
                          >
                            <img src={book} alt="archive" />
                            Edit
                          </button>
                          {/* <button
                            type="button"
                            className="text-icon-button "
                            data-testid="archive-Template"
                            onClick={props.onClickArchive}
                          >
                            <img src={archive} alt="archive" />
                            Add to Archives
                          </button> */}

                          <button
                            type="button"
                            className="secondary-gray-button"
                            onClick={props.handleClickBack}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="primary-button save-btn-hr-template"
                            data-testid="save-Template"
                            onClick={props.onClick}
                          >
                            Save
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="secondary-gray-button"
                            onClick={handleClickBack}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="primary-button"
                            data-testid="save-Template"
                            onClick={props.onClick}
                          >
                            Add
                          </button>
                        </>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : props.accountPage ? (
        <div className="" data-test="accountPage">
          <div className="col-12">
            <div className="title-action-wrap">
              <div className="container-fluid">
                <div className="row align-items-center">
                  <div className="col-sm-6 pl-0 d-flex align-items-center fav-header">
                    <h3>
                      {props.pageTitle}
                      <span className="left-arrow">
                        <i
                          className="ph-arrow-left"
                          style={{ cursor: "pointer" }}
                          onClick={handleClickBack}
                          data-test="accPageClick" />
                      </span>
                    </h3>
                  </div>
                  <div className="col-sm-6 d-flex justify-content-end pr-0">
                    {
                      props.title === "View" ? (
                        <button
                          type="button"
                          className={!permissionArray?.includes(
                            constants.PERMISSION_MAPPING.CREATE_EDIT_ACCOUNTS
                          ) ? "a-disabled primary-button" : "primary-button"}
                          data-testid="save-Template"
                          onClick={props.onEdit}
                        >
                          Edit
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="secondary-gray-button"
                            onClick={handleClickBack}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="primary-button"
                            data-testid="save-Template"
                            onClick={props.onClick}
                          >
                            {props.isEdit
                              ? props.activeUser
                                ? "Save & Reactivate Account"
                                : "Save"
                              : "Add"}
                          </button>
                        </>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : props.myAccount ? (
        <>
          <div className="container-fluid main_header_ai">
            <div className="row align-items-center">
              <div className="col-sm-6">
                <h3 className="">Account Info</h3>
              </div>
              <div className="col-sm-6 d-flex justify-content-end">
                <button
                  type="button"
                  className="primary-button"
                  onClick={props.onClick}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </>
      ) : props.favotiteCountries ? (
        <div className="">
          <div className="col-12">
            <div className="title-action-wrap fav-header">
              <h3 className="pl-0">Favorite Countries</h3>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default SearchHeaderText;
