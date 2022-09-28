
import React, { useCallback, useState, Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

import {
  getAllCountryList,
  uploadImageFile,
  updateCountryDetails,
  updateCountryStatus,
  addCountryDetails
} from "../../../Store/reducers/country";
import SearchBar from "../../../Components/SearchBar";
import { getUserProfile } from "../../../utils/storage";

import constants from "../../../utils/constants";
import Loader from "../../../Components/Loader";
import SupportButton from "../../../Components/SupportButton";
import CountryConfigurationView from "./CountryConfigurationView";

import albania from "../../../assets/images/no-flag.jpeg";
import backBtn from "../../../assets/images/back-btn.svg";
import close from "../../../assets/images/search-close.svg";
import ImageRender from "../imageRender";
import { permissionMapping } from "../../../utils/utils";


const CountryConfigurationList = (props) => {
  document.title = "Settings";
  const [countryList, setCountryList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ active: false, formData: {}, status: false });
  const [onFormData, setOnFormData] = useState(false);
  const [addNewCountry, setAddNewCountry] = useState({ active: false });
  const [countryDetail, setCountryDetail] = useState({});
  const [selectedCountry, setSelectedCountry] = useState({});
  const [countryImageList, setCountryImageList] = useState([]);
  const dispatch = useDispatch();
  const permissionArray = permissionMapping();
  const history = useHistory();


  const { allCountryLoading, allCountryFailed, allCountryList } = useSelector(state => state.country);

  useEffect(() => {
    if (!permissionArray?.includes(constants.PERMISSION_MAPPING.VIEW_COUNTRIES_LISTING_PAGE))
      history.push("/home")
    setLoading(true);
    loadCountryDetails();
  }, []);

  /* When updated on the reducer updating to state */
  useEffect(() => {
    if (allCountryList.length > 0) {
      setCountryList(allCountryList);
    }

  }, [allCountryList]);

  const loadCountryDetails = async (reload) => {
    var user_data = getUserProfile();

    if ((allCountryList.length === 0 || reload) && user_data && user_data?.userId) {
      await dispatch(getAllCountryList())
    } else {
    }
    setLoading(false);
  };

  const updateCountryWithStatus = async (item, status) => {
    setLoading(true);
    setConfirmModal({ active: false });
    let response = await updateCountryStatus(item.id, !status);
    if (response && response.data === null) {
      props.notify(`${item.country_Name} ${status === true ? 'deactivated' : 'activated'} Successfully`, 5000);
      setCountryDetail({ ...countryDetail, is_Active: !status })
      loadCountryDetails(true);
    } else {
      props.notify('Add update failed!', 5000);
      setLoading(true);
    }
  }

  const saveCountryDetails = async (type, id) => {
    if (selectedCountry.country_Name === "") {
      props.notify("Please enter a country name")
    } else if (selectedCountry.country_Code.length > 3) {
      props.notify("country code should not exceed 3 ")

    }
    else {

      let param = {
        Country_Name: selectedCountry.country_Name,
        Country_Code: selectedCountry.country_Code,
        videoLink: selectedCountry.videoLink,
        DefaultRegionId: selectedCountry?.defaultRegion?.id,
        Region: selectedCountry?.defaultRegion?.id ? JSON.stringify(selectedCountry.defaultRegion.id) : "",
      };

      let API_status = true;
      setLoading(true);
      if (countryImageList.length > 0) {
        for (let index = 0; index < countryImageList.length; index++) {
          const data = countryImageList[index];
          let status = await uploadImage(data.file, data.type);
          if (status) {
            if (data.type === "flag") {
              param['flag_Upload_Id'] = status;
            } else {
              param['header_Image_Id'] = status;
            }
          } else {
            API_status = status;
          }
        }
      }

      if (API_status) {
        if (type === "add_country") {
          param.Is_Active = true;
          let res = await addCountryDetails(param);
          if (res && res.responseCode === 200) {
            props.notify('Country added successfully', 5000);
          } else if (res.errors && res.errors.length > 0) {
            props.notify(res.errors[0], 5000);
          } else {
            props.notify('Country country failed!', 5000);
          }
          setAddNewCountry({ active: false });
        } else if (type === "update_country") {
          param = {
            Is_Active: selectedCountry.is_Active,
            flag_Upload_Id: selectedCountry.flag_Upload_Id,
            header_Image_Id: selectedCountry.header_Image_Id,
            Country_Code: selectedCountry.country_Code,
            videoLink: selectedCountry.videoLink,
            DefaultRegionId: selectedCountry?.defaultRegion?.id,
            Region: selectedCountry?.defaultRegion?.id ? JSON.stringify(selectedCountry.defaultRegion.id) : "",
            ...param
          };

          let res = await updateCountryDetails(id, param);
          if (res && res.responseCode === 200) {
            props.notify('Country updated successfully', 5000);
            setCountryDetail({ ...res.data });
            setSelectedCountry({ ...res.data });
          } else if (res.errors && res.errors.length > 0) {
            props.notify(res.errors[0], 5000);
            setCountryDetail({});
          } else {
            props.notify('Country country failed!', 5000);
            setCountryDetail({});
          }
          cancelEdit(false)
        }
        setSearchText("")
        loadCountryDetails(true);

      } else {
        setLoading(false);
      }
    }
  };

  const onSearchCountry = (searchText) => {
    if (searchText.length > 0) {
      let filteredList = allCountryList.filter(country => country.country_Name.toLowerCase().includes(searchText.toLowerCase()));
      setSearchText(searchText)
      setCountryList(filteredList);
    } else {
      setSearchText('')
      setCountryList(allCountryList);
    }
  };

  const uploadImage = async (file, type) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await uploadImageFile(formData);

    if (response && response.data) {
      return response.data.id;
    } else {
      props.notify(`Error Uploading an ${type} Image!`);
      return false;
    }
  };

  const onImageChange = (file, type) => {
    if (file === false) {
      setCountryImageList([])
    } else {
      setCountryImageList([...countryImageList, { file, type }])
    }
  };
  const cancelEdit = (status) => {
    setOnFormData(status);
  }

  const cancelAddNew = () => {
    setAddNewCountry({ active: false })
    setSearchText("")
    setCountryList(allCountryList)
  };
  return (
    <div className="country-config-list-container loader-enable" data-test="countryConfig">
      {
        loading &&
        (<div className="custom-loader">
          <Loader />
        </div>)
      }
      <SearchBar />
      <div className="breadcrumb-container">
        <div className="breadcrump-admin mt-3 mb-3">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb p-0">
              <li className="breadcrumb-item" >Settings</li>
              <li
                className={`breadcrumb-item cp ${!addNewCountry.active && "activeSection"}`}
                data-testid="add-new-country"
                onClick={cancelAddNew}
              >Countries</li>
              {addNewCountry.active &&
                <li className={`breadcrumb-item cp ${addNewCountry.active && "activeSection"}`} >Add country</li>
              }
            </ol>
          </nav>
        </div>
      </div>
      <div className="header-section">
        {addNewCountry.active &&
          <span className="back-icon" onClick={cancelAddNew}><img src={backBtn} alt="" /></span>
        }
        <h3 className="back-btn">{addNewCountry.active ? "Add Country " : "Manage  Countries"}
        </h3>
        {
          addNewCountry.active ?
            (<>
              <span className="cancel-btn ml-auto" onClick={cancelAddNew} data-test="cancelAddnew">Cancel</span>
              <span className="add-Country" onClick={() => saveCountryDetails("add_country")} data-test="addnew">Add</span></>) :
            <>
              {
                onFormData ? (
                  <>
                    <span className="cancel-btn ml-auto" onClick={() => cancelEdit(false)}>Cancel</span>
                    <span className="add-Country" onClick={() => saveCountryDetails("update_country", countryDetail.id)} data-test="update">Save</span>
                  </>
                ) :

                  <span onClick={() => { setSelectedCountry({}); setCountryDetail({}); setAddNewCountry({ active: true }) }} className={permissionArray?.includes(constants.PERMISSION_MAPPING.ADD_EDIT_COUNTRIES_LISTING_PAGE) ? "add-Country ml-auto" : "add-Country ml-auto a-disabled"} data-test="addCountry">Add Country</span>
              }

            </>
        }
      </div>
      <div className="country-config-container">
        <div className="row">
          {!addNewCountry.active &&
            <div className="col-md-4 pr-0">
              <div className="coutry-list-container">
                <div className="search-country-wrapper">
                  <input type="text" value={searchText} onChange={(e) => onSearchCountry(e.target.value)} placeholder="Search by country or US state " data-test="search"></input>
                  {
                    searchText.length > 0 &&
                    <img className="search-icon" height={11} src={close} onClick={() => onSearchCountry("")} alt="" data-test="searchClose" />
                  }
                </div>
                <div className="country-container">
                  <ul>
                    {
                      countryList.map((country) => {
                        return (
                          <li key={country.id} onClick={() => {
                            setCountryDetail(country);
                            setSelectedCountry(country);
                            cancelEdit(false)
                          }} data-test="countryClick">
                            <span>{country.country_Name}</span>
                            <div className="flag-placer">
                              <ImageRender url={country.flag_Upload_Id} />
                              {/* <img
                                src={country.flag_Upload_Id && country.flag_Upload_Id != "" ? constants.API.COUNTRY.GET_FLAG_DOWNLOAD + country.flag_Upload_Id : albania}
                                alt={country.flag_Upload_Id} /> */}
                            </div>
                          </li>
                        )
                      })
                    }
                    {(countryList.length === 0 && searchText !== "" && allCountryList.length !== 0) ? <div className="no-country-found">No country found</div> : null}
                    {countryList.length === 0 && allCountryLoading === true ? <div className="no-country-found">Loading...</div> : null}
                    {countryList.length === 0 && (allCountryLoading === false && allCountryFailed === true) ? <div className="no-country-found red">No data found</div> : null}
                  </ul>
                </div>
              </div>
            </div>
          }
          <div className={`col-md-${addNewCountry.active ? 12 : 8} pl-0 country-config-view-container`}>
            {
              (countryDetail.id === undefined && !addNewCountry.active) &&
              <div className="select-country-action">Select a country to view saved information here.</div>
            }
            <CountryConfigurationView
              {...props}
              isViewAddNew={addNewCountry}
              onEditFromData={setOnFormData}
              updateCountryWithStatus={(item, _status) => setConfirmModal({ active: true, formData: item, status: _status })}
              uploadImage={uploadImage}
              onChangeCountry={(item) => setSelectedCountry({ ...item })}
              onImageChange={onImageChange}
              formState={onFormData}
              country={countryDetail} />
          </div>
          <Modal
            show={confirmModal.active}
            onHide={() => setConfirmModal({ active: false })}
            backdrop="static"
            keyboard={false}
            centered={true}
            size="md"
            contentClassName="confirm-popup-custom-modal"
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <div className="confirm-popup-modal-body">
                <div className="modal-heading">
                  {confirmModal.status ? "Deactivate" : "Activate"} {confirmModal.active ? confirmModal.formData.country_Name : ''}?
                </div>
                <div className="confirm-modal-content">
                  This will {confirmModal.status ? "remove" : "display"} the country page and related information from Expandopedia.
                </div>
                <div className="confirm-action-buttons">
                  <span className="cancel-btn ml-auto" onClick={() => setConfirmModal({ active: false })}>Cancel</span>
                  <span className="save-btn" onClick={() => updateCountryWithStatus(confirmModal.formData, confirmModal.status)}>
                    {confirmModal.status ? "Deactivate" : "Activate"}
                  </span>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
      <SupportButton />
    </div>
  );
};

export default CountryConfigurationList;
