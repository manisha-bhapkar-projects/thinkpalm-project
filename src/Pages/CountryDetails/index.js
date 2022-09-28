import React, { useEffect, useState } from 'react';
import Hero_image_Africa from '../../assets/images/Hero-image-Africa.jpg';
import searchIcon from '../../assets/images/search_icon_1.svg';
import userIcon from '../../assets/images/user_icon_1.svg';
import shoppingIcon from '../../assets/images/shopping_icon_1.svg';
import compareIcon from '../../assets/images/compare_outline_1.svg';
import shareIcon from '../../assets/images/share_icon_1.svg';
import pinIcon from '../../assets/images/pin_icon_1.svg';
import { Spinner } from 'react-bootstrap';
import Alertcard from './AlertCard';
import EmployeeLifeCycle from './EmployeeLifeCycle';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import constants from '../../utils/constants';
import SupportButton from '../../Components/SupportButton';
import { permissionMapping } from '../../utils/utils';
import { useHistory } from 'react-router-dom';

import {
  callGetInsightsSolution,
  callGetBlogInsightsArticles,
  callGetAlertsList,
  callGetSnapShotAPI,
  callGetSnapShotListDataAPI,
  callGetSpecificsAPI,
  callGetSpecificsDataAPI,
  callGetCountryDeatils,
  callGetExpertProfile,
  callGetExpertProfiledataAPI,
  callGetCountryChartIndiactor,
} from '../../Actions/DetailsAction';
import SnapShot from './Snapshot';
import Expertimage from './Expertimage';
import CountrySpecifics from './CountrySpecifics';
import ComparePopup from '../CountryCompare/ComparePopup';
import { getUserProfile } from '../../utils/storage';
import UserDropdown from '../../Components/UserDropdown';
import ShareModal from './ShareModal';
import SearchBar from '../../Components/SearchBar';
import {
  getArticlesCountryPage,
  employeeLifeCycle,
  getEmployeeLifeCycle,
  deleteFromFavorite,
  callgetUserCountryDetails,
} from '../../Store/reducers/country';
import { useDispatch, useSelector } from 'react-redux';
import ChartBullet from './ChartBullet';
import { Settings } from '@material-ui/icons';
import ComingSoon from '../../Components/ComingSoon';
import { callgetUserCountryData } from '../../Store/reducers/favoriteCountries';
import { getUserCountry } from '../../Store/reducers/country';
import Loader from '../../Components/Loader';

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
/*  Mixpanel starts here  */
import mixpanel from 'mixpanel-browser';
import { userDetailsMixpnel } from '../../utils/utils';
mixpanel.init(constants.MIXPANEL_TOKEN);
/*  Mixpanel ends here  */
const Details = (props) => {
  const [countryName, setCountryName] = useState(null);
  const [countryChartData, setCountryChartData] = useState([]);
  const [alertCount, setAlertsCount] = useState(10);
  const [sharePopupModal, setSharePopupModal] = useState(false);
  const [alertsData, setalertsData] = useState(null);
  const [insightsId, setInshightsId] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  const [snapshotId, setSnapShotId] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(false);
  const [snapshostData, setSnapShotData] = useState(null);
  const [specificsId, setSpecificId] = useState(null);
  const [specificsData, setSpecificsData] = useState(null);
  const [ExpertSoultionId, SetExpertSolutionId] = useState(null);
  const [ExpertSoultionData, SetExpertSolutionData] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [userData, setUserData] = useState();
  const [popRender, setPopRender] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [propValue, setPropValue] = useState({
    searchDivScroll: '',
    snapShot: '',
  });

  const [labourAndProductivity, setLabourAndProductivity] = useState(false);
  const [tospecificsId, settoSpecificsId] = useState();
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(1);
  const [onBoard, setonBoard] = useState();
  const [attract, setAttract] = useState();
  const [develop, setDevelop] = useState();
  const [offBoard, setoffBoard] = useState();
  const [userId, setUserId] = useState();
  const history = useHistory();

  const dispatch = useDispatch();
  const permissionArray = permissionMapping();
  var lifeCycleId = [];
  const countryArticles = useSelector((state) => state?.country?.countryArticles);
  const attractId = useSelector((state) => state?.country?.attractId);
  const onBoardId = useSelector((state) => state?.country?.onBoardId);
  const developId = useSelector((state) => state?.country?.developId);
  const offBoardId = useSelector((state) => state?.country?.offBoardId);
  const lifeCycleData = useSelector((state) => state?.country?.lifeCycleData);
  const count = useSelector((state) => state?.country?.employeeCount);
  const employeeDetails = useSelector(
    (state) =>
      state?.favoriteCountriesReducer?.singleCountryData
  );
  const { globalLoader } = useSelector((state) => state?.country);
  const countryList = useSelector((state) => state?.country?.countryList);
  const UserCountryData = useSelector(
    (state) => state?.favoriteCountriesReducer?.UserCountryData
  );
  const userDataloading = useSelector(
    (state) => state?.favoriteCountriesReducer?.UserCountryDataLoading
  );
  const { deleteErr, detetedSuccess } = useSelector((state) => state?.country?.countryStatus);
  const CountryDataPending = useSelector((state) => state?.favoriteCountriesReducer?.CountryDataPending);

  const employeeCount = count[0]?.employeeCount;
  let { id, country } = useParams();
  const snapshot_count = 1;
  const specifics_count = 1;

  useEffect(() => {
    var user_data = getUserProfile();
    getUserCountry({ id: user_data?.userId }).then((countryListResponse) => {

      if (countryListResponse) {
        const isCountry = countryListResponse?.find((x) => (x.id == id && x.isUserFavourite === true));
        if (!isCountry) {
          history.push(
            `${constants.ROUTE.DETAILS_PAGE.CUSTOM_UN_FAV_COUNTRY_DETAILS_BY_ID}${id}`
          );
        }
      }
    });
  }, [id]);

  const handleModalFunction = () => {
    setModalOpen(true);
  }

  const onCancelClickListner = () => {
    setModalOpen(false);
  }
  const favouriteAction = () => {
    dispatch(deleteFromFavorite({ id: employeeDetails?.employeeCountryCount?.[0]?.id }));

  }
  useEffect(async () => {
    if (deleteErr && deleteErr.length) {
      props.notify(deleteErr);
    } else if (detetedSuccess && detetedSuccess === 200) {
      setModalOpen(false)
      props.notify("Country removed from favorites");
      history.push(`${constants.ROUTE.DETAILS_PAGE.CUSTOM_UN_FAV_COUNTRY_DETAILS_BY_ID}${id}`)
      await dispatch(deleteFromFavorite({ success: true }));
    }
  }, [deleteErr, detetedSuccess]);

  useEffect(() => {
    var user_data = getUserProfile();
    setUserId(user_data?.userId);
    setUserData(user_data);
    if (id != null) {
      callGetCountryChartIndiactors(id);
      callGetCountryDeatilsAction_details(id);
      callGetAlertsListAction_details(id);
      callGetSnapShotAPIAction_details(id, snapshot_count);
      callGetSpecificsAPIAction_details(id, specifics_count);
      dispatch(
        employeeLifeCycle({
          solutionName: [
            'Employee Management - Employee Lifecycle - Attract',
            'Employee Management - Employee Lifecycle - Onboard',
            'Employee Management - Employee Lifecycle - Develop and Retain',
            'Employee Management - Employee Lifecycle - Offboard',
          ],
          countryIds: [id],
        })
      );
    }
    setLabourAndProductivity(false);
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (id && userId != null) {
      dispatch(callgetUserCountryDetails({ userId, id }));
    }
  }, [id, userId]);
  useEffect(() => {
    if (countryName) {
      callGetcallGetExpertProfile_details();
      callGetBlogInsightsArticlesAction_details(id);
    }

    if (countryName && countryName != null) {
      document.title = countryName.country_Name;
    }
  }, [countryName]);
  useEffect(() => {
    if (ExpertSoultionId != null) {
      if (countryName) {
        callGetExpertProfiledataAPIAction_details(
          ExpertSoultionId,
          countryName.country_Name
        );
      }
    }
  }, [ExpertSoultionId]);
  useEffect(() => {
    if (countryName) {
      callGetInsightsSolutionAction_details(
        insightsId,
        countryName.country_Name
      );
    }
  }, [insightsId]);
  useEffect(() => {
    callGetSnapShotDataAPIAction_details(snapshotId, id);
  }, [snapshotId]);
  useEffect(() => {
    if (specificsId != null) {
      callGetSpecificsAPIDataAction_details(specificsId, id);
    }
  }, [specificsId]);
  useEffect(() => {
    getEmployeeData();
  }, [lifeCycleData]);
  useEffect(() => {
    if (
      attractId.length ||
      onBoardId.length ||
      developId.length ||
      offBoardId.length
    )
      lifeCycleId = [attractId[0], onBoardId[0], developId[0], offBoardId[0]];
    if (lifeCycleId.length > 0) {
      dispatch(getEmployeeLifeCycle(lifeCycleId));
    }
  }, [attractId, onBoardId, developId, offBoardId]);

  useEffect(() => {
    if (activeItem > 1) {
      setSpecificsData(null);
    } else if (activeItem === 1) {
      callGetSpecificsAPIDataAction_details(specificsId, id);
    }
    setSelectedSolution(false);
  }, [activeItem]);

  useEffect(() => {
    if (!topicsLoading && specificsData?.length > 0 && activeItem === 2) {
      const header = document.getElementById('specifics-header');
      if (header !== null) {
        window.scrollTo(0, header.offsetTop - 50);
      }
    }
  }, [topicsLoading, specificsData]);

  // get Diffdate logic
  const timeDiffCalc = (dateFuture, dateNow) => {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;
    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    let difference = '';
    if (days > 0) {
      difference += days === 1 ? `${days} Days Ago ` : `${days} Days Ago `;
    }
    return difference;
  };
  const callGetCountryDeatilsAction_details = (country_id) => {
    props
      .callGetCountryDeatilsAction(country_id)
      .then((response) => {
        let res_data = response.data.data;
        setCountryName(res_data);
      })
      .catch((errors) => { });
  };
  //calling function to get lifeCycle Data
  const getEmployeeData = () => {
    setAttract(getData(attractId[0]));
    setonBoard(getData(onBoardId[0]));
    setDevelop(getData(developId[0]));
    setoffBoard(getData(offBoardId[0]));
  };
  // getting lifecycle Data
  const getData = (id) => {
    let attract = [];
    lifeCycleData?.map((item) => {
      item.subcategorySettings.map((data) => {
        item.superTopicMetadatas.map((metaData) => {
          if (data.contenId === metaData.supertopicContentId) {
            if (item.solutionId === id) {
              attract.push(metaData);
            }
          }
        });
      });
      // item?.parentContentIds?.find((e) => {
      //
      // })
    });
    return attract.length ? attract : '';
  };
  const callGetCountryChartIndiactors = (country_id) => {
    props
      .callGetCountryChartIndiactorsAction(country_id)
      .then((response) => {
        if (response.data.data) {
          const { countryData, globalAverage, globalMedian, maxValues } =
            response.data.data;
          const res_data = [
            {
              category: 'Country GDP in USD\n(logarithmic)',
              value: countryData.gdp,
              median: globalMedian.gdp,
              average: globalAverage.gdp,
              maxValue: maxValues.gdp,
              isLogChart: 'true',
            },
            {
              category: 'GDP in USD\n(per person employed)',
              value: countryData.gdP_PP_employed,
              median: globalMedian.gdP_PP_employed,
              average: globalAverage.gdP_PP_employed,
              maxValue: maxValues.gdP_PP_employed,
              isLogChart: 'false',
              isKdollar: 'true',
            },
            {
              category: 'Unemployment %',
              value: countryData.unemployment,
              median: globalMedian.unemployment,
              average: globalAverage.unemployment,
              maxValue: maxValues.unemployment,
              isLogChart: 'false',
              isPercent: 'true',
            },
            {
              category: 'Productivity Industry\nEmployee in USD',
              value: countryData.productivity_Industry_Employee,
              median: globalMedian.productivity_Industry_Employee,
              average: globalAverage.productivity_Industry_Employee,
              maxValue: maxValues.productivity_Industry_Employee,
              isLogChart: 'false',
              isKdollar: 'true',
            },
            {
              category: 'Productivity Services\nEmployee in USD',
              value: countryData.productivity_Services_Employee,
              median: globalMedian.productivity_Services_Employee,
              average: globalAverage.productivity_Services_Employee,
              maxValue: maxValues.productivity_Services_Employee,
              isLogChart: 'false',
              isKdollar: 'true',
            },
            {
              category: 'Productivity Agriculture\nEmployee in USD',
              value: countryData.productivity_Agriculture_Employee,
              median: globalMedian.productivity_Agriculture_Employee,
              average: globalAverage.productivity_Agriculture_Employee,
              maxValue: maxValues.productivity_Agriculture_Employee,
              isLogChart: 'false',
              isKdollar: 'true',
              isEmp: 'true',
            },
            {
              category: 'Employer Tax %',
              value: countryData.employer_Tax,
              median: globalMedian.employer_Tax,
              average: globalAverage.employer_Tax,
              maxValue: maxValues.employer_Tax,
              isLogChart: 'false',
            },
            {
              category: 'Employee Tax',
              value: countryData.employee_Tax,
              median: globalMedian.employee_Tax,
              average: globalAverage.employee_Tax,
              maxValue: maxValues.employee_Tax,
              isLogChart: 'false',
            },
          ];

          setCountryChartData(res_data);
        }
      })
      .catch((errors) => { });
  };
  // calling alerts
  const callGetAlertsListAction_details = (country_id) => {
    props
      .callGetAlertsListAction(country_id, alertCount)
      .then((response) => {
        let res_data = response.data.data;
        setalertsData(res_data);
      })
      .catch((errors) => { });
  };
  // Expertprofile images
  const callGetcallGetExpertProfile_details = () => {
    props
      .callGetcallGetExpertProfile()
      .then((response) => {
        let res_data = response.data.data[0].solutionId;
        SetExpertSolutionId(res_data);
      })
      .catch((errors) => { });
  };
  const callGetExpertProfiledataAPIAction_details = (id, country) => {
    props
      .callGetExpertProfiledataAPIAction(id, country)
      .then((response) => {
        let res_data = response.data.data;
        SetExpertSolutionData(res_data);
      })
      .catch((errors) => {
        console.log(errors);
      });
  };
  const callGetBlogInsightsArticlesAction_details = (insigts_id) => {
    props
      .callGetBlogInsightsArticlesAction(insigts_id)
      .then((response) => {
        let soution_id = response.data.data[0].solutionId;
        setInshightsId(soution_id);
      })
      .catch((errors) => { });
  };

  // calling blog and articles
  const callGetInsightsSolutionAction_details = (country_id, country) => {
    {
      /*props
      .callGetInsightsSolutionAction(country_id, country)
      .then((response) => {
        let soution_id = response.data.data;
        setInsightsData(soution_id);
      })
    .catch((errors) => { });*/
    }
    if (country) {
      dispatch(
        getArticlesCountryPage({
          solutionName: [
            'Knowledge Base - Insights and Analysis - Articles',
            'Knowledge Base - Insights and Analysis - Whitepapers',
            'Knowledge Base - Insights and Analysis - Blogs',
          ],
          tags: [country],
        })
      );
    }
  };
  //  snapshot api calling
  const callGetSnapShotAPIAction_details = (country_id, count) => {
    props
      .callGetSnapShotAPIAction(country_id, count)
      .then((response) => {
        let soution_id = response.data.data[0].solutionId;
        setSnapShotId(soution_id);
      })
      .catch((errors) => { });
  };
  // getting snapshot data from snapshot id
  const callGetSnapShotDataAPIAction_details = (snapshot_id, countr_id) => {
    props
      .callGetSnapShotListDataAPIAction(
        snapshot_id,
        countr_id != null ? countr_id : id
      )
      .then((response) => {
        let soution_data = response.data.data;
        setSnapShotData(soution_data);
      })
      .catch((errors) => {
        console.log(errors);
      });
  };
  // getting specifics API
  const callGetSpecificsAPIAction_details = (country_id, specifics_count) => {
    props
      .callGetSpecificsAPIAction(country_id, specifics_count)
      .then((response) => {
        let soution_id = response.data.data[0].solutionId;

        setSpecificId(soution_id);
      })
      .catch((errors) => {
        console.log(errors);
      });
  };
  // getting data using specifics API
  const callGetSpecificsAPIDataAction_details = (
    specificsId_data,
    id,
    _sTopicContentId
  ) => {
    setTopicsLoading(true);

    props
      .callGetSpecificsDataAPIAction([specificsId_data], _sTopicContentId)
      .then((response) => {
        console.log('response.data.data', response.data.data[0]);
        let soution_id = response.data.data;
        setSpecificsData(soution_id);
        setTopicsLoading(false);
      })
      .catch((errors) => {
        console.log(errors);
        setTopicsLoading(false);
      });
  };

  const OnChangeEmployeeLifeCycle = (items, _index) => {
    setTopicsLoading(false);

    callGetSpecificsAPIDataAction_details(
      _index,
      id,
      items.supertopicContentId
    );

    // setSpecificsData([items])
    setSelectedSolution(items);
  };
  const OpenSharePopupModal = () => {
    setSharePopupModal(true)
    mixpanel.track('Content Downloads', {
      "Content Country Name1": countryName?.country_Name,
      'User Details': userDetailsMixpnel()
    })
  };

  const isValidLabour_productivity = (data) => {
    if (!labourAndProductivity) {
      let divideByBillion = 1000000000,
        divideByThousand = 1000,
        defaultValue = 0;
      if (data && data.length > 0) {
        data.map((item) => {
          if (item.isLogChart === 'true') {
            defaultValue = divideByBillion;
          }

          if (item.isKdollar === 'true') {
            defaultValue = divideByThousand;
          }

          if (item.isPercent === 'true') {
            if (item.maxValue > 0 && item.value.toFixed(0) < 1) {
              setLabourAndProductivity(true);
            }
          } else {
            if (
              (item.value / defaultValue).toFixed(0) < 1 &&
              item.maxValue > 0 &&
              item.median > 0 &&
              item.average > 0
            ) {
              setLabourAndProductivity(true);
            }
          }
        });
      }
    }

    return data;
  };
  const setDivScroll = (id, type) => {
    if (type === 'scroll') {
      setPropValue({
        searchDivScroll: id,
      });
    } else if (type === 'snapShot') {
      setPropValue({
        snapShot: id,
      });
    }
  };

  useEffect(() => {
    console.log('globalLoader', globalLoader)
  }, [globalLoader])

  return (
    <>
      <div data-test="country-details-page" className="loader-enable">
        {
          (CountryDataPending || globalLoader) &&
          (<div className="custom-loader h-full-loader">
            <Loader />
          </div>)
        }
        <React.Fragment>
          <div className="ip_header_wrap">
            <div className="ip_banner-img">
              <img
                src={
                  countryName?.header_Image_Id
                    ? `${constants.IMAGE.DOWNLOAD}${countryName.header_Image_Id}`
                    : ''
                }
              />
            </div>
            <div className="ip_banner_gradient"></div>
            <div className="container-fluid">
              <div className="row">
                <SearchBar
                  countryName={countryName ? countryName.country_Name : false}
                  countryId={id}
                  noRow
                  user={userData}
                  theme="dark"
                  setSearchPropValues={setDivScroll}
                />
                <div className="breadcrumb-w">
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                      {country ? (
                        <li className="breadcrumb-item">
                          <Link to="/all-country">All Country</Link>
                        </li>
                      ) : (
                        <li className="breadcrumb-item">
                          <Link to="/home">Home</Link>
                        </li>
                      )}
                      <li className="breadcrumb-item" aria-current="page">
                        <a href>
                          {countryName ? countryName.country_Name : 'Country'}
                        </a>
                      </li>
                    </ol>
                  </nav>
                </div>
                <div className="country-name-container">
                  <h3>{countryName ? countryName.country_Name : null}</h3>
                  <img
                    src={
                      countryName?.flag_Upload_Id
                        ? `${constants.IMAGE.DOWNLOAD}${countryName.flag_Upload_Id}`
                        : ''
                    }
                  ></img>
                </div>
                <div className="title-action-wrap">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="updated-info">
                        {/* <div className="">
                      <span>Last updated:</span> <span>{countryName ? timeDiffCalc(new Date(), new Date(countryName.updated_At)) : ""}</span>
                    </div> */}
                        <div className="display_comingsoon">
                          <ComingSoon direction="bottom"></ComingSoon>
                          <span>Last compliance check:</span> <span>{'N/A'}</span>
                        </div>

                        <div className="">
                          <img
                            alt=""
                            src={userIcon}
                            name="person-outline"
                            className="user-icon"
                          />
                          <span className="pl-3">
                            {employeeCount ? employeeCount : '0'}
                          </span>
                          <span> Employees</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-12 d-flex justify-content-end">
                      <span
                        className="actions"
                        onClick={() => {
                          setPopRender(true);
                          setShowDialog(true);
                        }}
                      >
                        <img
                          alt=""
                          src={compareIcon}
                          name="git-compare-outline"
                          className="compare"
                        />
                        <span className="link-style">Compare</span>
                      </span>
                      {popRender && (
                        <ComparePopup
                          id={id}
                          show={showDialog}
                          onHide={() => {
                            setPopRender(false);
                            setShowDialog(false);
                          }}
                        />
                      )}
                      <span className="actions" onClick={OpenSharePopupModal}>
                        <img
                          alt=""
                          src={shareIcon}
                          name="share-outline"
                          className="share"
                        />
                        <span className="link-style">Share</span>
                      </span>
                      <img alt="" src={pinIcon} href className="push-pin-icon pointer" onClick={() => handleModalFunction()} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row country-content-mt card_alert">
            <Alertcard
              card_data={alertsData}
              title="Alerts"
              card_id="alerts"
              notification_color={true}
              icon="ph-bell"
              icon_name=""
              id={userId}
              count_id={id}
              callGetAlertsListAction_details={callGetAlertsListAction_details}
            ></Alertcard>
            <Alertcard
              card_data={countryArticles}
              title="Insights &amp; Analysis"
              card_id="insights"
              notification_color={false}
              icon="ph-file"
              icon_name="document-outline"
              countryName={countryName}
            ></Alertcard>

            <Expertimage
              card_data={ExpertSoultionData}
              notify={props.notify}
              countryName={countryName ? countryName.country_Name : null}
              countryId={id}
            ></Expertimage>
          </div>
          <div className="">
            <div className="tab-container">
              <ul className="col-md-9">
                <li>
                  <a
                    href
                    className={
                      permissionArray?.includes(
                        constants.PERMISSION_MAPPING.LABOR_EMPLOYMENT_CONTENT
                      )
                        ? `cursor-pointer ${activeItem === 1 ? 'active' : ''}`
                        : 'list-disabled'
                    }
                    onClick={() => setActiveItem(1)}
                  >
                    LABOR &amp; EMPLOYMENT
                  </a>
                </li>
                <li>
                  <a
                    href
                    className={
                      permissionArray?.includes(
                        constants.PERMISSION_MAPPING.EMPLOYEE_LIFECYCLE_MANAGEMENT
                      )
                        ? `cursor-pointer ${activeItem === 2 ? 'active' : ' '}`
                        : 'list-disabled'
                    }
                    onClick={() => {
                      mixpanel.track('Employee Life cycle', { 'User Details': userDetailsMixpnel() });
                      return permissionArray?.includes(
                        constants.PERMISSION_MAPPING.EMPLOYEE_LIFECYCLE_MANAGEMENT
                      )
                        ? setActiveItem(2)
                        : '';
                    }

                    }
                  >
                    EMPLOYEE LIFECYCLE
                  </a>
                </li>
                <li className="display_comingsoon">
                  <a
                    href
                    className={
                      permissionArray?.includes(
                        constants.PERMISSION_MAPPING.COMPLIANCE
                      )
                        ? `cursor-pointer ${activeItem === 3 ? 'active' : ''}`
                        : 'list-disabled'
                    }
                    onClick={() =>
                      permissionArray?.includes(
                        constants.PERMISSION_MAPPING.COMPLIANCE
                      )
                        ? ''
                        : ''
                    }
                  >
                    COMPLIANCE
                  </a>{' '}
                  <ComingSoon direction="bottom"></ComingSoon>{' '}
                </li>
                <li>
                  <a
                    href
                    className={
                      permissionArray?.includes(
                        constants.PERMISSION_MAPPING.INDICATORS_AND_TRENDS
                      )
                        ? `cursor-pointer ${activeItem === 4 ? 'active' : ''}`
                        : 'list-disabled'
                    }
                    onClick={() =>
                      permissionArray?.includes(
                        constants.PERMISSION_MAPPING.INDICATORS_AND_TRENDS
                      )
                        ? setActiveItem(4)
                        : ''
                    }
                  >
                    INDICATORS &amp; TRENDS
                  </a>
                </li>
              </ul>
              {activeItem === 1 &&
                permissionArray?.includes(
                  constants.PERMISSION_MAPPING.LABOR_EMPLOYMENT_CONTENT
                ) && (
                  <SnapShot
                    snapdata={snapshostData}
                    title="Snapshots"
                    countryId={id}
                    snapShot={props.location.state}
                    searchSnapShot={propValue.snapShot}
                    settoSpecificsId={settoSpecificsId}
                  />
                )}
              {activeItem === 2 && (
                <div>
                  <EmployeeLifeCycle
                    onClickLifecycle={OnChangeEmployeeLifeCycle}
                    attract={attract}
                    onBoard={onBoard}
                    develop={develop}
                    offBoard={offBoard}
                    attractId={attractId[0]}
                    onBoardId={onBoardId[0]}
                    developId={developId[0]}
                    offBoardId={offBoardId[0]}
                  />
                </div>
              )}
              {activeItem === 3 && <div></div>}
              {activeItem === 4 && (
                <div className="indicator-and-trends">
                  {countryChartData?.length ? (
                    <div>
                      <div className="tab-section row justify-content-between">
                        <div className="col">
                          <h3>Indicators & trends</h3>
                        </div>
                      </div>
                      <div className="tab-2-container">
                        <div className="tab-section row justify-content-between">
                          <div className="col">
                            <h3 className="labor-productivity">
                              Labor & Productivity
                            </h3>
                          </div>
                          <div className="col justify-content-end">
                            <div className="row">
                              <div className="col">
                                <div className="legend-container">
                                  <div className="box-chart-bullet1"></div>
                                  <span>Country Value</span>
                                </div>
                              </div>
                              <div className="col">
                                <div className="legend-container">
                                  <div className="box-chart-bullet2"></div>
                                  <span>Global median</span>
                                </div>
                              </div>
                              <div className="col">
                                <div className="legend-container">
                                  <div className="box-chart-bullet3"></div>
                                  <span>Global Average</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isValidLabour_productivity(countryChartData).map(
                          (i, k) => {
                            if (i.value && i.median && i.average)
                              return <ChartBullet chartData={i} divId={k} />;
                          }
                        )}
                        {labourAndProductivity && (
                          <div className="country-value-unavailable">
                            **Country Value Currently Unavailable
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="country-value-unavailable">
                      **Country Value Currently Unavailable
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {permissionArray?.includes(
            constants.PERMISSION_MAPPING.LABOR_EMPLOYMENT_CONTENT
          ) &&
            activeItem < 3 &&
            (specificsData?.length > 0 || topicsLoading) && (
              <>
                <div className="row scrollspy-header specific-header">
                  <div
                    className="col-md-3 d-flex align-items-center"
                    id="specifics-header"
                  >
                    <h3>The Specifics</h3>{' '}
                    {topicsLoading && (
                      <Spinner
                        className="specifics-loading-spinner"
                        animation="border"
                        size="sm"
                      />
                    )}
                  </div>
                  <div className="col-md-9 d-flex justify-content-end">
                    <a
                      href
                      onClick={() => {
                        setPopRender(true);
                        setShowDialog(true);
                      }}
                      className="btn-main"
                    >
                      <ion-icon name="git-compare-outline" className="chatbox" />
                      <div>Compare</div>
                    </a>
                  </div>
                </div>
                {/* <div className="scrollspy-content">
            <Specifics content_data={specificsData}></Specifics>
          </div> */}
                {!topicsLoading &&
                  specificsData &&
                  specificsData?.length &&
                  (activeItem === 1 || activeItem === 2) && (
                    <div className="scrollspy-content specific-data">
                      <CountrySpecifics
                        selectedSolution={selectedSolution}
                        specifics={specificsData}
                        divScroll={props.location.state}
                        searchDivScroll={propValue.searchDivScroll}
                        tospecificsId={tospecificsId}
                      />
                    </div>
                  )}
              </>
            )}

          <SupportButton />
          <div className="last-updated-date">
            <span>Last Updated:</span>{' '}
            <span>
              {countryName
                ? timeDiffCalc(
                  new Date(),
                  new Date(specificsData?.[0]?.updatedAt)
                )
                : ''}
            </span>
          </div>

          <ShareModal
            isOpen={sharePopupModal}
            countryName={countryName}
            onCloseClickListener={() => setSharePopupModal(false)}
            specifics={specificsData}
            country_id={id}
          />
          <Modal
            show={modalOpen}
            onHide={onCancelClickListner}
            backdrop="static"
            keyboard={false}
            centered={true}
            contentClassName="add-country-template-modal"
          >
            <Modal.Header className="role_header_model" closeButton>
              <Modal.Title >
                <div className="d-flex modal-country align-items-center">
                  <div className="flag">
                    <img
                      src={
                        countryName?.flag_Upload_Id
                          ? `${constants.IMAGE.DOWNLOAD}${countryName?.flag_Upload_Id}`
                          : ""
                      }
                    />
                  </div>
                  <div className="ml-3">
                    Remove {countryName?.country_Name} from Favorites?</div>

                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="role_body_model">
              You will no longer see {countryName?.country_Name} on your Homepage or receive compliance updates and other useful insights.
            </Modal.Body>
            <Modal.Footer className="role_footer_model">
              <Button variant="secondary"
                onClick={onCancelClickListner}
              >
                Cancel
              </Button>
              <Button variant="primary"
                onClick={favouriteAction}
              >
                Remove From Favorites
              </Button>
              {/* <button
                        className="btn btn-primary btn-primary-10"
                        onClick={() => addTemplateToArchive}

                    >
                        Archieve
                    </button> */}
            </Modal.Footer>
          </Modal>

        </React.Fragment>
        {/* )} */}
      </div>
    </>
  );
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      callGetAlertsListAction: callGetAlertsList,
      callGetBlogInsightsArticlesAction: callGetBlogInsightsArticles,
      callGetInsightsSolutionAction: callGetInsightsSolution,
      callGetSnapShotAPIAction: callGetSnapShotAPI,
      callGetSnapShotListDataAPIAction: callGetSnapShotListDataAPI,
      callGetSpecificsAPIAction: callGetSpecificsAPI,
      callGetSpecificsDataAPIAction: callGetSpecificsDataAPI,
      callGetCountryDeatilsAction: callGetCountryDeatils,
      callGetcallGetExpertProfile: callGetExpertProfile,
      callGetExpertProfiledataAPIAction: callGetExpertProfiledataAPI,
      callGetCountryChartIndiactorsAction: callGetCountryChartIndiactor,
    },
    dispatch
  );
export default connect(null, mapDispatchToProps)(Details);
