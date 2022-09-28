import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { guid } from "../../utils/utils";
import Loader from "../../Components/Loader";

/* Icon */
import articleBanner from "../../assets/images/Rectangle.svg";
import alertsBanner from "../../assets/images/alerts_bg.jpg";


/* Component */
import { getUserProfile } from "../../utils/storage";
import constants from "../../utils/constants";
import SearchBar from "../../Components/SearchBar";
import SupportButton from "../../Components/SupportButton";
import AlertAllPage from "./allPage";
import AlertCountryPage from "./myCountry";
import Checkbox from "../../Components/Inputs/Checkbox";
import AlertGeneralPage from "./AlertGeneralPage";
import AlertUnRead from "./AlertUnRead";

import { getAllAlerts, markAsRead, deleteAlertItem, getCountryAlerts } from "../../Store/reducers/alertsReducer";

/* Action */
import { getUserCountryList } from "../../Store/reducers/country";


const AlertsLandingPage = (props) => {
    const param = useParams();
    const history = useHistory();
    const dispatch = useDispatch();
    const scrollContainer = useRef(null);

    const [userData, setUserData] = useState({});
    const [pageFromCountry, setPageFromCountry] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [sectionTabs, setSectionTabs] = useState('All');
    const [userCountryList, setUserCountryList] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState(['all']);
    const [loadingAPI, setLoadingAPI] = useState(false);

    const {
        userCountryLoading,
        countryList
    } = useSelector(state => state.country);

    useEffect(() => {
        var user_data = getUserProfile();
        setUserData(user_data);
        if (user_data?.userId) dispatch(getUserCountryList({ id: user_data.userId }));
    }, []);

    useEffect(() => {
        if (param?.country && param?.country != "" && countryList.length > 0) {
            setPageFromCountry('loading');
            const _isCountry = countryList.find((_country) => _country.country_Name.toLowerCase() === (param.country).toLowerCase());
            if (_isCountry) {
                setPageFromCountry(_isCountry);
            }
        }

        if (!userCountryLoading && !!countryList.length) {
            setUserCountryList(countryList);
        }
    }, [param, userCountryLoading]);

    useEffect(() => {
        if (sectionTabs === 'all') {

        } else { }
        console.log('reset or perform any specific action for the Tab: ', sectionTabs);
    }, [sectionTabs]);

    useEffect(() => {
        window.addEventListener('scroll', (event) => {
            setCurrentPosition(window.scrollY);
        });
    }, []);

    const getValidatedBredCrumb = () => {
        if (pageFromCountry) {
            if (pageFromCountry === 'loading') {
                return (
                    <li
                        className="breadcrumb-item"
                        aria-current="page"
                        style={{ color: "white", cursor: "pointer" }}
                    >
                        Loading...
                    </li>
                )
            } else {
                return (
                    <li
                        className="breadcrumb-item"
                        aria-current="page"
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={() =>
                            history.push(constants.ROUTE.DETAILS_PAGE.DETAILS_ID + pageFromCountry.id)
                        }
                    >
                        {pageFromCountry.country_Name}
                    </li>
                )
            }
        }

        return (
            <li
                className="breadcrumb-item"
                aria-current="page"
                style={{ color: "white", cursor: "pointer" }}
                onClick={() =>
                    history.push(constants.ROUTE.KNOWLEDGE_BASE.HOME)
                }
            >
                Knowledge Base
            </li>
        )
    }

    const RenderCountryList = ({ onChange, checked, name, id, index }) => {
        return (
            <div className={`check-group ${selectedCountryId.includes(id) ? 'checked' : ''}`} key={id}>
                <Checkbox
                    name={name + '_' + index}
                    value="2"
                    className="checkbox"
                    container="check-container child"
                    checked={checked}
                    onChange={({ target }) => onChange(target.checked, id)}
                    testId={name + '_' + index}
                    inputId={name + '_' + index}
                ></Checkbox>
                <label onClick={() => document.getElementById(name + '_' + index)?.click()} className="pointer">{name}</label>
            </div>
        )
    };

    const onSelectCountryId = (checkMark, id) => {
        if (checkMark === 'all' || checkMark === 'contentAlerts') {
            setSelectedCountryId([checkMark]);
        } else {
            if (checkMark) {
                if (!selectedCountryId.includes(id)) {
                    setSelectedCountryId([...selectedCountryId.filter((c) => c != 'all' && c != 'contentAlerts'), id]);
                }
            } else {
                setSelectedCountryId([...selectedCountryId.filter((c) => c != id && c != 'all' && c != 'contentAlerts')]);
            }
        }
    }

    const appendMockAPI = (API) => {
        if (props.isTestCase) {
            return () => { };
        } else {
            return API;
        }
    }

    return (
        <div data-test="alerts-page" className="alerts-page-container loader-enable" data-testid="alerts-page-container">
            {
                loadingAPI &&
                (<div className="custom-loader">
                    <Loader />
                </div>)
            }
            <div
                className="ip_header_wrap alerts-page-wrap article-header-wrap"
                data-testid="alerts-page-wrap"
            >
                <div className="ip_banner-img large-banner">
                    <img
                        src={alertsBanner}
                        alt=""
                    />
                </div>
                <div>
                    <div className="row">
                        <SearchBar noRow user={userData} theme="dark" />
                        <div className="breadcrumb-w ml-3">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li
                                        className="breadcrumb-item"
                                        style={{ color: "white", cursor: "pointer" }}
                                        onClick={() => history.push(constants.ROUTE.HOME_PAGE.HOME)}
                                        data-test="bredcrumbClick"
                                    >
                                        Home
                                    </li>
                                    {getValidatedBredCrumb()}
                                    <li
                                        className="breadcrumb-item"
                                        aria-current="page"
                                        style={{ color: "white", cursor: "pointer" }}
                                    >
                                        Alerts
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="article-title-wrap">
                    <h1>Alerts</h1>
                </div>
            </div>
            <div className="alerts-main-container" ref={scrollContainer}>
                <div className="alert-tab-section">
                    <ul>
                        <li
                            onClick={() => { setSectionTabs('All') }}
                            data-testid="All"
                            className={sectionTabs === 'All' ? 'select-tab' : ''}><span>All</span></li>
                        <li
                            onClick={() => { setSectionTabs('Country') }}
                            data-testid="Country"
                            className={sectionTabs === 'Country' ? 'select-tab' : ''}><span>My Countries</span></li>
                        <li
                            onClick={() => { setSectionTabs('General') }}
                            data-testid="General"
                            className={sectionTabs === 'General' ? 'select-tab' : ''}><span>General</span></li>
                        <li
                            onClick={() => { setSectionTabs('Unread') }}
                            data-testid="Unread"
                            className={sectionTabs === 'Unread' ? 'select-tab' : ''}><span>Unread</span></li>
                    </ul>
                </div>
                <button
                    onClick={() => history.push(constants.ROUTE.KNOWLEDGE_BASE.MANAGE_ALERTS)}
                    className={`primary-button ml-auto `}>Manage</button>

                {sectionTabs === "All" && (
                    <AlertAllPage
                        currentPosition={currentPosition}
                        setLoadingAPI={setLoadingAPI}
                        getAllAlerts={(param) => appendMockAPI(getAllAlerts(param))}
                        markAsRead={(param) => appendMockAPI(markAsRead(param))}
                        deleteAlertItem={(param) => appendMockAPI(deleteAlertItem(param))}
                        {...props} />
                )}
                {sectionTabs === "Country" && (
                    <AlertCountryPage
                        id={pageFromCountry && pageFromCountry != "loading" ? pageFromCountry.id : false}
                        currentPosition={currentPosition}
                        selectedCountryId={selectedCountryId}
                        setLoadingAPI={setLoadingAPI}
                        getCountryAlerts={(param) => appendMockAPI(getCountryAlerts(param))}
                        markAsRead={(param) => appendMockAPI(markAsRead(param))}
                        deleteAlertItem={(param) => appendMockAPI(deleteAlertItem(param))}
                        {...props}
                    />
                )}
                {sectionTabs === 'Country' && (
                    <div className="alerts-checkbox-container">
                        <h3>My Countries</h3>
                        <div className={`check-group ${selectedCountryId.includes('all') ? 'checked' : ''}`}>
                            <Checkbox
                                className={`checkbox ${!(selectedCountryId.includes('all') || selectedCountryId.includes('contentAlerts')) && 'minus'}`}
                                container="check-container"
                                onChange={() => onSelectCountryId('all')}
                                checked={selectedCountryId.includes('all')}
                                name='AllFavorites'
                                testId='select-all-fav-country'
                                inputId="select-all-fav-country"
                            ></Checkbox>
                            <label onClick={() => document.getElementById("select-all-fav-country")?.click()} className="pointer">All Favorites</label>
                        </div>
                        {userCountryList.map((item, i) => {
                            return (
                                <RenderCountryList
                                    onChange={(checked, value) => onSelectCountryId(checked, value)}
                                    checked={selectedCountryId.includes(item.id)}
                                    name={item.country_Name}
                                    id={item.id}
                                    index={i}
                                />)
                        })}
                        <div className={`check-group checked`}>
                            <Checkbox
                                className="checkbox"
                                container="check-container"
                                onChange={() => onSelectCountryId('contentAlerts')}
                                checked={selectedCountryId.includes('contentAlerts')}
                                name='contentAlertsOnly'
                                testId='show-content-alerts-only'
                                inputId="show-content-alerts-only"
                            ></Checkbox>
                            <label onClick={() => document.getElementById("show-content-alerts-only")?.click()} className="pointer">Show Content Alerts Only</label>
                        </div>
                    </div>
                )}
                {sectionTabs === "General" && (
                    <AlertGeneralPage
                        currentPosition={currentPosition}
                        setLoadingAPI={setLoadingAPI}
                        markAsRead={(param) => appendMockAPI(markAsRead(param))}
                        deleteAlertItem={(param) => appendMockAPI(deleteAlertItem(param))}
                        {...props} />
                )}
                {sectionTabs === "Unread" && (
                    <AlertUnRead
                        currentPosition={currentPosition}
                        setLoadingAPI={setLoadingAPI}
                        markAsRead={(param) => appendMockAPI(markAsRead(param))}
                        deleteAlertItem={(param) => appendMockAPI(deleteAlertItem(param))}
                        {...props} />
                )}
            </div>

            <SupportButton />
        </div>
    );
};

export default React.memo(AlertsLandingPage);
