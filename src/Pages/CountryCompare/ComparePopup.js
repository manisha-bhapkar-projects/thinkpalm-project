import React, { useEffect, useState } from 'react';
import { callgetCountryListAPI } from '../../Actions/CountryAction';
import { bindActionCreators } from 'redux';
import Modal from 'react-bootstrap/Modal';
import ModalDialog from 'react-bootstrap/ModalDialog';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalTitle';
import ModalFooter from 'react-bootstrap/ModalFooter';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import constants from '../../utils/constants';
import { exportToCSV } from './ExportCSV';
import { useHistory } from 'react-router';
import {
  callGetCompareCountrySolutionIdAPI,
  callGetSnapShotAPI,
} from '../../Actions/CompareCountryAction';
import close from '../../assets/images/search-close.svg';
/*  Mixpanel starts here  */
import mixpanel from 'mixpanel-browser';
import { userDetailsMixpnel } from '../../utils/utils';
mixpanel.init(constants.MIXPANEL_TOKEN);
/*  Mixpanel ends here  */
const ComparePopup = (props) => {
  const [countryList, setCountryList] = useState([]);
  const [countryId, setCountryId] = useState('');
  const [flagUploadId, setFlagUploadId] = useState('');
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState([]);
  const [addCountry, setAddCountry] = useState([]);
  const [mainCountryName, setMainCountryName] = useState('');
  const [mainCountry, setMainCountry] = useState([]);
  const [countrySearchResult, setcountrySearchResult] = useState([]);
  const [selectedCountryDetails, setselectedCountryDetails] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [countryDetails, setCountryDetails] = useState([]);
  const [checkBg, setcheckBg] = useState(false);
  const [exportData, setExportData] = useState({
    countryExportData: [],
    fileName: 'Country',
  });
  const history = useHistory();
  useEffect(() => {
    setAddCountry([]);
    getCountryList();
  }, []);
  useEffect(() => {
    const result = selectedCountryDetails.filter((country) =>
      country.country_Name.toLowerCase().includes(searchItem.toLowerCase())
    );

    setCountryList(result);
  }, [searchItem]);
  useEffect(() => {
    getExportData(exportData);
  }, [exportData]);
  const handleCompare = () => {
    localStorage.removeItem('hasCountryId');
    let data;
    if (props.id) {
      data = countrySearchResult.filter((item) =>
        addCountry.includes(item.country_Name)
      );
      data.unshift(mainCountry);
      localStorage.setItem('hasCountryId', props.id);
      localStorage.setItem('CountryData', JSON.stringify(data));
    } else {
      let mainCountry = countrySearchResult.filter(
        (item) => item.country_Name === addCountry[0]
      );

      data = countrySearchResult.filter((item) =>
        addCountry.find((e, index) =>
          index >= 1 ? item.country_Name === e : ''
        )
      );
      data.unshift(mainCountry[0]);

      localStorage.setItem('CountryData', JSON.stringify(data));
    }
    const solutionName = 'Employee Management - Labor and Employment';
    let selectExportCountry = [];
    if (props.id) {
      selectExportCountry.push(props.id);
    }
    selectedCountryDetails.filter((item) =>
      selectedCountry.find((e) => {
        if (item.country_Name === e) {
          selectExportCountry.push(item.id.toString());
        }
      })
    );
    if (selectExportCountry.length > 10) {
      let request = {
        countryIds: selectExportCountry,
        solutionName: [solutionName],
      };
      getCountrySolutionId(request);
    } else {      
      history.push(constants.ROUTE.COUNTRY_COMPARE.COMPARE);
    }
    if(props.allCountry){
      mixpanel.track('Compare countries from all country page', {'Content Country Name':data,
                  'User Details':userDetailsMixpnel()})
    }else{
      mixpanel.track('Compare countries from homepage', {'Content Country Name': data,
                         'User Details':userDetailsMixpnel()}) ;

    }
    
  };
  const getCountrySolutionId = (data) => {
    props
      .callGetCompareCountrySolutionIdAPIAction(data)
      .then((response) => {
        let selected_country_id = [];
        let selected_country_name = [];
        response.data.data.forEach((e) => {
          if (!selected_country_id.includes(e.solutionId)) {
            selected_country_id.push(e.solutionId);
          }
          selected_country_name.push(e.countryName);
        });
        //setSelecet_countryname(selected_country_name);
        getSnaphot(selected_country_id);
        //   setsolutionIds(selected_country_id);
      })
      .catch((errors) => {});
  };

  const getSnaphot = (data) => {
    let request = {
      SolutionIds: data,
      SuperTopicNames: [
        'Public Holidays',
        'Annual Leave',
        "Sick & Carer's Leave",
        'Maternity, Paternity & Family Leave',
        'Working Hours',
        'Wages, Bonuses & Other Remuneration',
        'Social Security & Payroll Taxes',
        'Termination & Severance',
        'Advantages',
        'Risk Factors',
      ],
    };
    props
      .callGetSnapShotAPIAction(request)
      .then((response) => {
        //setCountryDetails(response.data.data);
        allDataforExport(response.data.data);
      })

      .catch((errors) => {});
  };
  const stripHtml_fun = (a) => {
    let stripedHtml = a ? a.replace(/<[^>]+>/g, '') : a;
    return stripedHtml;
  };
  const allDataforExport = (exportCountry) => {
    let data = [];

    exportCountry.forEach((item, id) => {
      data.push({
        Snapshot: item.countryName,
        Public_Holidays: stripHtml_fun(
          item.superTopicMetadatas[0].supertopicContent
        ),
        Vacation_Leave: stripHtml_fun(
          item.superTopicMetadatas[1].supertopicContent
        ),
        Sick_Leave: stripHtml_fun(
          item.superTopicMetadatas[2].supertopicContent
        ),
        Maternity_Leave: stripHtml_fun(
          item.superTopicMetadatas[3].supertopicContent
        ),
        Working_Hours: stripHtml_fun(
          item.superTopicMetadatas[4].supertopicContent
        ),
        Bonus_Payments: stripHtml_fun(
          item.superTopicMetadatas[5].supertopicContent
        ),
        Taxes: stripHtml_fun(item.superTopicMetadatas[6].supertopicContent),
        Employee_Termination_Severance: stripHtml_fun(
          item.superTopicMetadatas[7].supertopicContent
        ),
        The_Advantages: stripHtml_fun(
          item.superTopicMetadatas[8].supertopicContent
        ),
        Risk_Factors: stripHtml_fun(
          item.superTopicMetadatas[9].supertopicContent
        ),
      });
    });
    setExportData({ ...exportData, countryExportData: data });
  };

  const getExportData = (exportData) => {
    if (exportData.countryExportData.length) {
      exportToCSV(exportData.countryExportData, exportData.fileName);
    }
  };

  const handleSearch = (e) => {
    setSearchItem(e.target.value);
  };
  const handleCheck = (e) => {
    setcheckBg(!checkBg);
    if (e.target.checked === true) {
      setSelectedCountry([...selectedCountry, e.target.value]);
    } else {
      setSelectedCountry(
        selectedCountry.filter((item) => item !== e.target.value)
      );
      setAddCountry(addCountry.filter((item) => item !== e.target.value));
    }
  };

  const getCountryList = () => {
    props
      .callgetCountryListAPIAction()
      .then((response) => {
        let countrylist = response.data.data.filter(
          (item) => item.id !== parseInt(props.id)
        );
        setCountryList(countrylist);
        setcountrySearchResult(response.data.data);
        setselectedCountryDetails(countrylist);

        if (props.id) {
          let mainCountry = response.data.data.find((item) => {
            return item.id === parseInt(props.id);
          });

          setMainCountryName(mainCountry.country_Name);
          setMainCountry(mainCountry);
        }

        setCountryId(response.data.data[0].id);
        setFlagUploadId(response.data.data[0].flag_Upload_Id);
      })
      .catch((errors) => {});
  };
  const handleAdd = () => {
    setAddCountry(selectedCountry);
  };

  return (
    <Modal
      {...props}
      aria-labelledby="exampleModalLabel"
      centered
      size="lg"
      className="modal_compare"
      data-test="compare-popup"
    >
      <ModalHeader data-test="header">
        <ModalTitle id="exampleModalLabel">
          <h5>Country Compare</h5>
        </ModalTitle>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-label="Close"
          onClick={props.onHide}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </ModalHeader>
      <ModalBody scrollable className="modal-body-container">
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label >Select Comparison Type</label>
              <select className="form-control" id>
                <option>Snapshot</option>
                <option>Country</option>
              </select>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-5">
            <div className="row">
              <div className="col">
                <span className="modal-lbl">Select Countries</span>
              </div>
              <div className="col text-right">
                <span className="modal-lbl select-lbl">
                  {selectedCountry.length} Selected
                </span>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="select-country-wrapper">
                  <div className="country-search">
                    <input
                      type="text"
                      value={searchItem}
                      onChange={handleSearch}
                      placeholder="Search by country name"
                      data-test="handleSearch"
                    />
                    <i className="ph-magnifying-glass" />
                    {searchItem ? (
                      <div
                        onClick={() => {
                          setSearchItem('');
                        }}
                        data-test="searchItem"
                      >
                        <img
                          alt=""
                          src={close}
                          height={11}
                          name="search-outline"
                          className="cursor-pointer search_clear_btn"
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="checkbox-container-scroll">
                    {countryList && countryList.length
                      ? countryList
                          .filter(
                            (item) =>
                              !addCountry.find(
                                (country) => country === item.country_Name
                              )
                          )
                          .map((item, index) => {
                            return (
                              <label
                              data-test="checked"
                                className={
                                  selectedCountry.find((e) => {
                                    return e === item.country_Name;
                                  })
                                    ? 'container-cb backColor'
                                    : 'container-cb'
                                }
                                key={index}
                              >
                                {item.country_Name}
                                <input
                                  type="checkbox"
                                  onChange={handleCheck}
                                  value={item.country_Name}
                                  checked={
                                    selectedCountry.find((e) => {
                                      return e === item.country_Name;
                                    })
                                      ? true
                                      : false
                                  }
                                  
                                />
                                <span className="checkmark" />
                              </label>
                            );
                          })
                      : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-2 d-flex justify-content-center align-items-center">
            <div className="row">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={handleAdd}
                disabled={
                  props.id
                    ? selectedCountry.length < 1
                      ? true
                      : false
                    : selectedCountry.length < 1
                    ? true
                    : false
                }
                data-test="handleAdd"
              >
                Add
              </button>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="row">
              <div className="col">
                <span className="modal-lbl">List of Countries To Compare</span>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className="selected-country-wrapper">
                  {props.id ? (
                    <ul>
                      <li>{mainCountryName}</li>
                      {addCountry.map((item, index) => {
                        return (
                          <li key={index}>
                            {item}
                            <button
                              className="close"
                              onClick={() => {
                                setAddCountry(
                                  addCountry.filter((i) => i !== item)
                                );
                                setSelectedCountry(
                                  selectedCountry.filter((i) => i !== item)
                                );
                              }}
                              data-test="close"
                            >
                              <i className="ph-x" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <ul>
                      {addCountry.map((item, index) => {
                        return (
                          <li key={index}>
                            {item}
                            <button
                              className="close"
                              onClick={() => {
                                setAddCountry(
                                  addCountry.filter((i) => i !== item)
                                );
                                setSelectedCountry(
                                  selectedCountry.filter((i) => i !== item)
                                );
                              }}
                            >
                              <i className="ph-x" />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="col-12 d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleCompare}
            disabled={
              props.id
                ? selectedCountry.length >= 0 && addCountry.length >= 0
                  ? false
                  : true
                : selectedCountry.length >= 1 && addCountry.length >= 1
                ? false
                : true
            }
            data-test="handleCompare"
          >
            Compare
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      callgetCountryListAPIAction: callgetCountryListAPI,
      callGetCompareCountrySolutionIdAPIAction:
        callGetCompareCountrySolutionIdAPI,
      callGetSnapShotAPIAction: callGetSnapShotAPI,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(ComparePopup);
