import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/* Icons */
import pencil from "../../assets/images/pencil-icon.svg";
import plusCircle from "../../assets/images/plus-circle.svg";
import clip from "../../assets/images/clip.svg";
import close from "../../assets/images/close-orange.svg";

/* Component */
import SearchHeaderText from "../../Components/SearchHeaderText/SearchHeaderText";
import AddTemplateUploadTable from "./AddTemplateUploadTable";
import ReactDropdown from "../../Components/CustomeSelectDropDown/reactDropdown";
import TextFieldComponent from "../../Components/TextFieldComponent/TextFieldComponent";
import { getUserProfile } from "../../utils/storage";
import Loader from "../../Components/Loader";
import constants from "../../utils/constants";
import { normalizePrice } from "../../utils/utils";
import SupportButton from "../../Components/SupportButton"
import OpenArchieveModal from "./OpenArchieveModal";

/* Action */
import {
  getAllLanguages,
  addToArchiveDocument,
  addNewTemplateType,
  addAndUpdateTemplate,
  getTemplateById,
  getCountryList,
  addNewLanguage,
  getAllCategoriesList
} from "../../Store/reducers/HRTemplate";

import {
  uploadImageFile
} from "../../Store/reducers/country";

// import { getCountryList } from "../../Store/reducers/country";

const AddUpdateTemplate = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id, status } = useParams();
  const isEdit = (status === "edit" || props.isEdit) ? (id) ? id : false : false;
  const isView = (status === "view" || props.isView) ? (id) ? id : false : false;
  const isAdd = status === undefined || props.isAdd;
  document.title = `HR Templates - ${isEdit ? "Edit" : isView ? 'View' : "Add"}`;

  const defaultState = {
    description: null,
    categoryId: "",
    language: '',
    title: '',
    version: '1.0',
    price: '',
    countryId: '',
    uploadId: "",
    stageInEmployeeLifecycle: "",
    isActive: true,
    isDeleted: false,
  };

  const [userData, setUserData] = useState();
  const [_countryList, setCountryList] = useState([]);

  const [_languagesList, setLanguagesList] = useState([]);
  const [languageValue, setLanguageValue] = useState("");
  const [englishLanguage, setEnglishLanguage] = useState({});
  const [addLanguagePopup, setAddLanguagePopup] = useState(false);
  const [type, setType] = useState();


  const [_documentTypes, setDocumentTypes] = useState([]);
  const [templateTypeValue, setTemplateTypeValue] = useState("");
  const [templateTypePopup, setTemplateTypePopup] = useState(false);
  const [languageID, setLanguageID] = useState({
    local: 0,
    english: ""
  });

  const language_document_clone = {
    language: languageID.english,
    isError: false,
    uploadId: '',
    uploadedTemplate: null
  };

  const [language_document_list, setLanguage_document_list] = useState([language_document_clone]);
  const [stageEmployeeLifecycle, setStageEmployeeLifecycle] = useState([
    {
      label: 'Attract',
      value: 'Attract'
    },
    {
      label: 'Onboard',
      value: 'Onboard'
    },
    {
      label: 'Develop & Retain',
      value: 'Develop & Retain'
    },
    {
      label: 'Offboard',
      value: 'Offboard'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [templateInfo, setTemplateInfo] = useState(undefined);
  const [revisedTemplate, setRevisedTemplate] = useState(false);
  const [openAddToArchieveModal, setOpenAddToArchieveModal] = useState(false);


  const {
    languageList,
    categoriesList,
    countryList,
    getTemplateInfoLoading,
    getTemplateInfo,
    addNewLanguageLoading,
    addNewLanguageStatus
  } = useSelector((state) => state.HRTemplate);


  useEffect(() => {
    var user_data = getUserProfile();
    setUserData(user_data);
    setLoading(true);
    setInitialValues({ ...defaultState })

    if (!props.testCase) dispatch(getCountryList());
    if (!props.testCase) dispatch(getAllLanguages());
    if (!props.testCase) dispatch(getAllCategoriesList());
  }, []);

  useEffect(() => {
    if (countryList.length > 0) {
      setLoading(true);
      if (isEdit || isView) {
        if (!props.testCase) dispatch(getTemplateById({ id }));
      }
    }
  }, [countryList])

  useEffect(() => {

    if (countryList.length > 0) {
      setCountryList(countryList.map((_country) => { return { label: _country.country_Name, value: _country.id } }));
    }

    if (categoriesList.length > 0) {
      const _documentTypesFilteredList = [];
      categoriesList.map((_cat) => {
        if (!_documentTypesFilteredList.some(x => x.value === _cat.categoryName)) {
          _documentTypesFilteredList.push({
            label: _cat.categoryName,
            value: _cat.id
          })
        }
      });

      setDocumentTypes(_documentTypesFilteredList);
      if (!isEdit && !isView) setLoading(false);
    }

    if (languageList.length > 0) {
      const _englishItem = languageList.find((_lang) => _lang.language_Name === "English");
      if (_englishItem) {
        setLanguageID({
          ...languageID,
          english: _englishItem
        })
      }

      const _updatedLanguageList = languageList.map((_lang) => { return { label: _lang.language_Name, value: _lang.id } });
      if (_updatedLanguageList.length > 0) {
        setLanguagesList(_updatedLanguageList);
      }

      if (!isEdit && !isView) setLoading(false);
    }

  }, [languageList, categoriesList, countryList]);

  useEffect(() => {
    if (!getTemplateInfoLoading && getTemplateInfo && (isEdit || isView)) {
      const __countryInfo = _countryList.find((x) => x.label == getTemplateInfo.countryName);
      let __language = _languagesList.find((x) => x.value == getTemplateInfo.document.language);
      let singleLang = false;

      if (__language && __language.label == "English") {
        __language = __language.value;
        singleLang = true;
      }

      setTemplateInfo({ ...getTemplateInfo });
      setInitialValues({
        description: getTemplateInfo.document.description,
        categoryId: { label: getTemplateInfo.category.categoryName, value: getTemplateInfo.category.id },
        language: __language ? singleLang ? __language : { ...__language } : "",
        price: normalizePrice(getTemplateInfo.document.price),
        countryId: __countryInfo ? { ...__countryInfo } : "",
        title: getTemplateInfo.document.title,
        stageInEmployeeLifecycle: { label: getTemplateInfo?.document?.employeeLifecycleStage, value: getTemplateInfo?.document?.employeeLifecycleStage },
        version: getTemplateInfo.versions != null && getTemplateInfo.versions.length > 0 ? getTemplateInfo.versions[0].version : '1.0',
        isActive: getTemplateInfo.document.isActive,
        isDeleted: getTemplateInfo.document.isDeleted,
      });

      setTimeout(() => setLoading(false), 1000);
    }
  }, [getTemplateInfoLoading, getTemplateInfo]);


  useEffect(() => {
    if (addNewLanguageLoading == false && addNewLanguageStatus) {
      if (addNewLanguageLoading == false && addNewLanguageStatus.error) {
        props.notify("You don't have a access!")
      } else if (addNewLanguageStatus.data) {
        props.notify("Language added successfully!");
      }
      if (!props.testCase) dispatch(getAllLanguages());
      setLanguageValue('');
      setAddLanguagePopup(false);
      setLoading(false);
    }
  }, [addNewLanguageLoading, addNewLanguageStatus]);

  const handleSubmit = async (e) => {
    const _stateParam = { ...initialValues };
    const _language_document_list = [];
    e.preventDefault();

    if (_stateParam.countryId === "") {
      props.notify("Template country is required", 3000);
      return;
    }

    if (_stateParam.categoryId === "") {
      props.notify("Template type is required", 3000);
      return;
    }

    let isDocumentUploadValid = false;
    for (let itemIndex = 0; itemIndex < language_document_list.length; itemIndex++) {
      const item = language_document_list[itemIndex];
      if (item.uploadedTemplate != null && item.language != "") {
        isDocumentUploadValid = true;
      }
    }

    if (isEdit) isDocumentUploadValid = true;
    if (language_document_list.length > 0 && isDocumentUploadValid) {
      for (let itemIndex = 0; itemIndex < language_document_list.length; itemIndex++) {
        const item = language_document_list[itemIndex];

        if (item.uploadedTemplate != null && item.language != "") {
          setLoading(true);
          const formData = new FormData();
          formData.append("file", item.uploadedTemplate);

          const response = await uploadImageFile(formData, true);
          if (response && response.data) {
            _language_document_list.push({
              ...item,
              uploadId: response.data?.id
            })
          } else {
            props.notify(`Failed to upload the document!`);
            setLoading(false);
            return false;
          }
        }
      }
    } else {
      props.notify(`Please upload at least one document`);
      return false;
    }

    const DocumentUploads = [];

    _language_document_list.map((item) => {
      DocumentUploads.push({
        "language": item.language.value,
        "uploadId": item.uploadId,
        "numberOfPages": 2
      });
    });

    if (isEdit) {
      const request = {
        id: isEdit,
        // title: (_stateParam.categoryId.label) + ' - ' + (_stateParam.countryId.label),
        title: (_stateParam.categoryId.label),
        description: _stateParam.description,
        categoryId: _stateParam.categoryId.value,
        subtitle: "",
        price: _stateParam.price.slice(1),
        employeelifecyclestage: _stateParam.stageInEmployeeLifecycle.value,
        countryId: _stateParam.countryId.value,
        isActive: _stateParam.isActive,
        isDeleted: _stateParam.isDeleted,
        DocumentUploads
      };

      setLoading(true);
      let templateUpdate = await addAndUpdateTemplate(request, isEdit);
      if (templateUpdate && templateUpdate.error) {
        props.notify(templateUpdate.data || "Failed to update the Template", 3000);
        setLoading(false);
        history.push(constants.ROUTE.HR_TEMPLATE.LIST);
      } else if (templateUpdate.data) {
        props.notify("Template updated successfully.", 3000);
        setLoading(false);
        // history.push(`${constants.ROUTE.HR_TEMPLATE.VIEW_EDIT_NEW_TEMPLATE.replace(":id", id).replace(":status", "view")}`);
        history.push(constants.ROUTE.HR_TEMPLATE.LIST);
      }
    } else {
      const request = {
        // title: (_stateParam.categoryId.label) + ' - ' + (_stateParam.countryId.label),
        title: (_stateParam.categoryId.label),
        description: _stateParam.description,
        categoryId: _stateParam.categoryId.value,
        subtitle: "",
        price: _stateParam.price.slice(1),
        employeelifecyclestage: _stateParam?.stageInEmployeeLifecycle?.value || "",
        countryId: _stateParam.countryId.value,
        isActive: _stateParam.isActive,
        isDeleted: _stateParam.isDeleted,
        DocumentUploads
      };

      setLoading(true);
      let templateCreate = await addAndUpdateTemplate(request);
      if (templateCreate && templateCreate.error) {
        props.notify(templateCreate.data || "Failed to create the Template", 3000);
        setLoading(false);
        history.push(constants.ROUTE.HR_TEMPLATE.LIST);
      } else if (templateCreate.data) {
        props.notify("Template added successfully.", 3000);
        setLoading(false);
        history.push(constants.ROUTE.HR_TEMPLATE.LIST);
      }

      setLoading(false);
    }
  };

  const onSaveLanguage = async () => {
    if (languageValue.length > 0) {
      // API Call
      setLoading(true);
      setLanguageValue('');
      setAddLanguagePopup(false);
      if (!props.testCase) dispatch(addNewLanguage({ name: languageValue }));
      setLoading(false);
    } else {
      props.notify('Please enter Language name');
      setLoading(false);
    }
  }

  const onSaveTemplateType = async () => {
    if (templateTypeValue.length > 0) {
      // API Call
      setLoading(true);
      setTemplateTypeValue('');
      setTemplateTypePopup(false);
      const addNewTemplateStatus = await addNewTemplateType({ name: templateTypeValue });
      if (addNewTemplateStatus && addNewTemplateStatus.error && !props.testCase) {
        props.notify('Failed to add new template type!', 5000);
      } else {
        const { data } = addNewTemplateStatus;
        if (!props.testCase) dispatch(getAllCategoriesList());
        setInitialValues({
          ...initialValues,
          categoryId: { ...data, label: data?.categoryName, value: data?.id },
        })
        props.notify('Template type added successfully');
      }

      setLoading(false);
    } else {
      props.notify('Please enter Template Type');
      setLoading(false);
    }
  }

  const onCancelLanguage = () => {
    setLanguageValue('');
    setAddLanguagePopup(!addLanguagePopup);
  }

  const onCancelType = () => {
    setTemplateTypeValue('');
    setTemplateTypePopup(!templateTypePopup);
  }

  const handleClosePopup = ({ target }) => {
    if (addLanguagePopup || templateTypePopup) {
      const closeActionClickClassName = ["row align-items-center", "row", "row mt-3", "add-language-container mb-4", "col-lg-5", "language-type", "language-type-label"];
      if (closeActionClickClassName.includes(target.className) || target.className.includes("select__value-container") || target.className.includes("floating__input")) {
        setLanguageValue('');
        setTemplateTypeValue('');
        setTemplateTypePopup(false);
        setAddLanguagePopup(false);
      }
    }
  }

  const onHandleAddToArchives = () => {
    setOpenAddToArchieveModal(true);
    // Blocked due to not for this sprint

    // if (isEdit) {
    //   addToArchive({ id: isEdit });
    // } else {
    //   props.notify('Archives only work on existing template!');
    // }
  }

  const resetFileUpload = (indx) => {
    const _language_document_list = [...language_document_list];
    _language_document_list[indx].uploadedTemplate = null;
    setLanguage_document_list(_language_document_list);
  };

  const handleClickBack = () => {
    history.push(constants.ROUTE.HR_TEMPLATE.LIST);
  }

  const isAddLanguageValid = () => {
    const currentState = language_document_list[language_document_list.length - 1];
    if (currentState) {
      if (currentState.language !== "" && currentState.uploadedTemplate != null && currentState.uploadedTemplate != "") {
        return true;
      }
    }
  };
  const addTemplateToArchive = () => {
    setOpenAddToArchieveModal(false)
    history.push(constants.ROUTE.HR_TEMPLATE.LIST);
    if (type === "document") {
      props.notify('Document Archived');

    } else {
      props.notify('Template Archived');

    }
    // Blocked due to not for this sprint

    // setLoading(true);
    // let status = await addToArchiveDocument(item.id);
    // if (status && status.error) {
    //   dispatch(getTemplateById({ id }));
    //   props.notify(status.data || 'Failed to Archive!');
    // } else {
    //   dispatch(getTemplateById({ id }));
    //   props.notify('Template Archived');
    // }
    // setLoading(false);
  }

  const addToArchive = async (item) => {
    // Blocked due to not for this sprint

    // setLoading(true);
    // let status = await addToArchiveDocument(item.id);
    // if (status && status.error) {
    //   dispatch(getTemplateById({ id }));
    //   props.notify(status.data || 'Failed to Archive!');
    // } else {
    //   dispatch(getTemplateById({ id }));
    //   props.notify('Template Archived');
    // }
    // setLoading(false);
  };
  const setDocumentArchiveModal = (status, type) => {
    if (type === "document") {
      setOpenAddToArchieveModal(true);
      setType(type);
    }
  }


  return (
    <div className="add-edit-hr-template loader-enable" data-testid="close-popup" onClick={handleClosePopup}>
      {
        loading &&
        (<div className="custom-loader">
          <Loader />
        </div>)
      }
      <SearchHeaderText
        breadcrumb={true}
        isEdit={isEdit}
        isPageView={isView}
        HrTemplateHeader={true}
        pageTitle={isEdit ? "Edit HR Template" : isView ? "View HR Template" : "Add HR Template"}
        onClick={handleSubmit}
        handleClickBack={handleClickBack}
        onClickArchive={onHandleAddToArchives}
        user={userData}
        onClickEdit={() => history.push(`${constants.ROUTE.HR_TEMPLATE.VIEW_EDIT_NEW_TEMPLATE.replace(":id", id).replace(":status", "edit")}`)}
        isView={isEdit ? "Edit" : isView ? "View" : "Add"}
        HRTemplateBreadcrumb={true}
      />
      <div className="container-fluid" data-testid="AddEditTemplate-result-page">
        <div className="form-wrapper">
          <div className="col-12">
            <div className="row">
              <div className="col-12 row">
                <div className="col-6">
                  <h4>Template Info</h4>
                </div>
              </div>
              <div className={`col-lg-5 ${(isView || isEdit) && "disabled"}`}>
                <div className={`floating ${(isView || isEdit) && "disabled"}`}>
                  <ReactDropdown
                    id="Country"
                    name="Country*"
                    htmlFor="Country*"
                    testid="country-input"
                    data_content="Country*"
                    title="Country"
                    // isDisabled={isEdit ? initialValues.countryId === "" ? false : true : false}
                    Prefilled={initialValues.countryId}
                    data={_countryList}
                    onChange={(value) => setInitialValues({
                      ...initialValues,
                      countryId: value,
                    })}
                  />
                </div>
              </div>
              <div className={`col-lg-5 ${(isView || isEdit) && "disabled"}`}>
                <ReactDropdown
                  id="DocumentType"
                  name="DocumentType*"
                  htmlFor="DocumentType*"
                  testid="document-input"
                  // isDisabled={isEdit}
                  data_content="Template Type*"
                  title="Template Type"
                  Prefilled={initialValues.categoryId}
                  data={_documentTypes}
                  onChange={(value) => setInitialValues({
                    ...initialValues,
                    categoryId: value,
                  })}
                />
                {
                  (isAdd) && (
                    <div className="add-language-container mb-4">
                      <img
                        alt=""
                        src={pencil}
                        id="add-language-pencil"
                        name="cart-outline"
                        className="icon"
                      />
                      <label htmlFor="add-language-pencil" data-testid="open-type-popup" onClick={onCancelType}>Add Template Type</label>
                      {
                        (templateTypePopup) &&
                        <div className="popup-language-container">
                          <div className="popup-language-body">
                            <input
                              type="text"
                              maxLength="35"
                              // disabled={isEdit}
                              value={templateTypeValue}
                              data-testid="add-template-input"
                              onChange={({ target }) => setTemplateTypeValue(target.value)}
                              className="col-md-7 form-control"
                            />
                            <div className="action-container col-md-5">
                              <button className="save-button" data-testid="add-language-btn" onClick={onSaveTemplateType}>SAVE</button>
                              <button className="cancel-button" onClick={onCancelType}>CANCEL</button>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  )
                }
              </div>
            </div>
            <div className={`row ${isView && "disabled"}`}>
              <div className="col-lg-10">
                <div className="floating textarea">
                  <textarea
                    cols={3}
                    // disabled={isEdit ? initialValues.description === "" ? false : true : false}
                    onChange={(e) => {
                      if (e?.target?.value?.length <= 90) {
                        setInitialValues({
                          ...initialValues,
                          description: e?.target?.value || "",
                        })
                      } else {
                        props.notify('Characters count reached!');
                      }
                    }}
                    data-testid="description-input"
                    value={initialValues.description != null ? initialValues.description : ""}
                    className={`floating__input textarea col-lg-12 ${isView && "disabled"}`}>
                  </textarea>
                  <span className="character-length reached">Characters left : {initialValues.description != null ? 90 - initialValues.description.length : 90}</span>
                  <label
                    htmlFor="Description"
                    className={'floating__label'}
                    data-content="Description"
                    data-test='input-label'
                  >
                    <span className="hidden--visually">Description</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Employee stage and pricing section */}
            <div className={`row ${isView && "disabled"}`}>
              <div className={`col-5 no-padding ${isView && "disabled"}`}>
                <div className="col-12">
                  <h4>Employment Stage</h4>
                </div>
                <div className={`col-lg-12 ${isView && "disabled"}`}>
                  <ReactDropdown
                    id="StageInEmployeeLifecycle"
                    name="StageInEmployeeLifecycle"
                    htmlFor="StageInEmployeeLifecycle"
                    testid="StageInEmployeeLifecycle-input"
                    // isDisabled={isEdit}
                    data_content="Stage in Employee Lifecycle"
                    title="Stage in Employee Lifecycle"
                    Prefilled={initialValues.stageInEmployeeLifecycle}
                    data={stageEmployeeLifecycle}
                    onChange={(value) => setInitialValues({
                      ...initialValues,
                      stageInEmployeeLifecycle: value,
                    })}
                  />
                </div>
              </div>
              <div className={`col-5 no-padding ${isView && "disabled"}`}>
                <div className="col-12">
                  <h4>Pricing</h4>
                </div>
                <div className="col-lg-12">
                  <TextFieldComponent
                    id="Price"
                    label="Price*"
                    // disabled={isEdit}
                    data-test="Price"
                    testid="price-input"
                    dataContent="Price*"
                    type="text"
                    name="Price*"
                    value={initialValues.price}
                    onChange={(e) => setInitialValues({
                      ...initialValues,
                      price: normalizePrice(e.target.value),
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Languages and templates section */}
            {
              (!isView && (revisedTemplate || isAdd)) &&
              <div className="row mt-5">
                <div className="col-12">
                  <h4>Language & Template Upload</h4>
                </div>
                {
                  language_document_list.map((item, _index) => {
                    return (
                      <div key={_index} className={(language_document_list.length - 1) === _index ? "row col-12" : "row col-12 mb-5"} key={Math.random().toString(36).substr(2, 5)}>
                        <div className="col-lg-5 no-padding-right">
                          <ReactDropdown
                            id="Language*"
                            name="Language*"
                            noFloating
                            // isDisabled={isEdit}
                            htmlFor="Language*"
                            testid="language-input"
                            data_content={"Language*"}
                            title="Language"
                            data={_languagesList}
                            onChange={(value) => {
                              const _language_document_list = [...language_document_list];
                              _language_document_list[_index].language = value;
                              setLanguage_document_list(_language_document_list);
                            }}
                            Prefilled={item.language}
                          />
                        </div>
                        <div className="col-md-5">
                          {
                            item.uploadedTemplate === null ?
                              <div className="file-uploaded-section">
                                <label
                                  htmlFor="file-uploaded-input"
                                  className="secondary-gray-button"
                                >
                                  <input
                                    type="file"
                                    className="file-uploaded-input"
                                    id="file-uploaded-input"
                                    name="file-uploaded"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files.length > 0) {
                                        const _language_document_list = [...language_document_list];
                                        _language_document_list[_index].uploadedTemplate = e.target.files[0];
                                        setLanguage_document_list(_language_document_list);
                                      }
                                    }}
                                    accept=".doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                  />
                                  Upload Template
                                </label>
                                {
                                  item.isError &&
                                  <div className="document-error">Please upload document*</div>
                                }
                              </div> :
                              <div className="row">
                                <div className="col-md-12 no-padding-right">
                                  <div className="file-uploaded-container">
                                    <div className="file-uploaded-label col-md-8">
                                      <img
                                        alt=""
                                        src={clip}
                                        name="search-outline"
                                        className="file-clip"
                                      />
                                      {item.uploadedTemplate.name}</div>
                                    <div
                                      className="file-uploaded-body col-md-4"
                                      onClick={() => resetFileUpload(_index)}
                                    >
                                      <img
                                        alt=""
                                        src={close}
                                        name="search-outline"
                                        className="file-upload-remove cursor-pointer"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                          }
                        </div>
                      </div>
                    )
                  })
                }

                <div className="add-language-container ml-3 mt-2">
                  <img
                    alt=""
                    src={pencil}
                    id="add-language-pencil"
                    name="cart-outline"
                    className="icon"
                  />
                  <label htmlFor="add-language-pencil" data-testid="add-language-popup" onClick={onCancelLanguage}>Add Language</label>
                  {
                    (addLanguagePopup) &&
                    <div className="popup-language-container">
                      <div className="popup-language-body">
                        <input
                          type="text"
                          maxLength="35"
                          // disabled={isEdit}
                          value={languageValue}
                          data-testid="add-language-input"
                          onChange={({ target }) => setLanguageValue(target.value)}
                          className="col-md-7 form-control"
                        />
                        <div className="action-container col-md-5">
                          <button className="save-button" data-testid="add-language-btn" onClick={onSaveLanguage}>SAVE</button>
                          <button className="cancel-button" onClick={onCancelLanguage}>CANCEL</button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
            {
              (!isView && isAddLanguageValid()) &&
              <div className="row mt-3">
                <div
                  className="add-another-template"
                  onClick={() => {
                    setLanguage_document_list([...language_document_list, language_document_clone])
                  }}
                >
                  <img src={plusCircle} />
                  <span>Add Another Template</span>
                </div>
              </div>
            }

            {/* Current Uploads section */}
            {
              (isView && templateInfo && templateInfo.documentUploads.length > 0) && templateInfo.documentUploads.map((item, tempIndex) =>
              (
                <div className={`row mt-5 ${isView && "disabled"}`} key={tempIndex}>
                  <div className="col-4 no-padding">
                    {
                      !tempIndex &&
                      (<div className="col-12">
                        <h4>Current Uploads</h4>
                      </div>)
                    }
                    <div className={`col-lg-12 ${isView && "disabled"}`}>
                      <ReactDropdown
                        id="Language*"
                        name="Language*"
                        noFloating
                        htmlFor="Language*"
                        testid="language-input"
                        data_content={"Language*"}
                        title="Language"
                        data={_languagesList}
                        onChange={(value) => { }}
                        Prefilled={{ label: item.languageName, value: item.language }}
                      />
                    </div>
                  </div>
                  <div className="col-4 no-padding">
                    <div className="col-md-12">
                      <div className={!tempIndex ? "file-uploaded-container margin-4" : "file-uploaded-container"}>
                        <div className="file-uploaded-label col-md-8">
                          <img
                            alt=""
                            src={clip}
                            name="search-outline"
                            className="file-clip"
                          />
                          {item.upload.originalFileName}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            {((isView || isEdit) && templateInfo) && (
              <div className="row mt-5 upload-section">
                <div className="col-8 no-padding">
                  <div className="row">
                    <div className="col-md-6 revised-header">
                      <h4>Uploads</h4>
                    </div>
                    {
                      (isEdit && !revisedTemplate) &&
                      <div className="col-md-6 revised-template-container">
                        <div className="revised-template-btn primary-button" onClick={() => setRevisedTemplate(true)}>
                          Upload Revised Template
                        </div>
                      </div>
                    }
                  </div>
                  <div className="col-12">
                    <AddTemplateUploadTable
                      {...props}
                      loading={loading}
                      id={id}
                      addToArchive={addToArchive}
                      setLoading={setLoading}
                      isEdit={isEdit}
                      documentList={templateInfo.versionHistory}
                      setOpenAddToArchieveModal={setDocumentArchiveModal}
                    />
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
      <SupportButton />

      <OpenArchieveModal
        isOpen={openAddToArchieveModal}
        onCancelClickListner={() => setOpenAddToArchieveModal(false)}
        addTemplateToArchive={addTemplateToArchive}

      />


    </div>
  );
};

export default AddUpdateTemplate;
