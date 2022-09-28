import React, { useEffect, useReducer, useState, Fragment } from "react";
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';


/* Components */
import UserDropdown from "../../Components/UserDropdown";
import ComingSoon from "../../Components/ComingSoon";

/* Icons */
import searchIcon from "../../assets/images/search_icon_1.svg";
import shoppingIcon from "../../assets/images/shopping-cart-ts.svg";
import shoppingIconWhite from "../../assets/images/shopping_icon_1.svg";
import close from "../../assets/images/search-close.svg";
import closeWhite from "../../assets/images/search-close-white.svg";
import bellIcon from "../../assets/images/bell-icon.svg";
import bellIconBlue from "../../assets/images/bell-icon-new.svg";
import whitebellIcon from "../../assets/images/whitebellIcon.svg";
import whiteBellBlue from "../../assets/images/whiteBellBlue.svg";




/* Action */
import { updateSearchText, autoSuggest } from "../../Store/reducers/searchResult";
import Constants from "../../utils/constants";
import { getUserProfile } from "../../utils/storage";
import { useLocation } from "react-router-dom";

import {
    getCartDetails,
} from "../../Store/reducers/HRTemplate";

// import popOverNotification from "../../Pages/PopOverNotification"
import PopOverNotification from './../../Pages/Alerts/popOverNotification';
import constants from "../../utils/constants";

const SearchBar = (props) => {
    const [searchText, setSearchText] = useState('');
    const [result, setSearchSuggest] = useState('');
    const userData = getUserProfile();
    const history = useHistory();
    const dispatch = useDispatch();
    const location = useLocation();
    const [showAlertPopUp, setShowAlertPopUp] = useState(false);


    const { setSearchPropValues } = props;

    const reducerResult = useSelector(state => state?.searchResultReducer?.autoSuggestResults);
    const autoSuggestResultsLoading = useSelector(state => state?.searchResultReducer?.autoSuggestResultsLoading);
    const userId = "00000000-0000-0000-0000-000000000000";
    const cartDetails = useSelector((state) => state?.HRTemplate?.cartDetails);

    useEffect(() => {
        dispatch(getCartDetails({ userId }));
    }, []);

    useEffect(() => {
        setSearchSuggest(reducerResult);
    }, [reducerResult])

    useEffect(() => {
        setSearchSuggest('');
    }, [location])


    /* Trigger the API call and navigate to the UI */
    const handleOnSearch = async (fullText) => {
        if (searchText.length > 1) {
            await dispatch(updateSearchText({
                text: fullText || searchText,
                countryId: props.countryId ? props.countryId : false,
                countryName: props.countryName ? props.countryName : false,
            }));
            history.push(Constants.ROUTE.SIDEBAR.SETTINGS.SEARCH_PAGE)
        }
    };

    /* Tracks when user press enter */
    const handleOnKeyPress = (e) => {
        const key = e.keyCode || e.which;
        if (key == 13) {
            handleOnSearch();
        }
    };

    const autoPopulateSearchBox = async () => {
        await dispatch(autoSuggest({
            searchText,
            countryId: props.countryId ? props.countryId : false,
            stateId: props.stateId ? props.stateId : false,
            regionId: props.regionId ? props.regionId : false,
            includePopularCountries: props.includePopularCountries ? props.includePopularCountries : false,
            maxResults: props.maxResults ? props.maxResults : false,

        }));
    }

    useEffect(() => {
        if (searchText.length >= 2) {
            autoPopulateSearchBox()
        }
    }, [searchText])

    const onNavigateCountry = async (navigatePath) => {
        if ((props.countryId && navigatePath.state.countryId !== JSON.parse(props.countryId)) || (!props.countryId)) {
            history.push(navigatePath)
        } else {
            setSearchSuggest('');
            if (navigatePath?.state?.divScroll) {
                setSearchPropValues(navigatePath.state.divScroll, "scroll");
            } else if (navigatePath?.state?.snapShot) {
                setSearchPropValues(navigatePath.state.snapShot, "snapShot")
            }
        }
    }
    const checkNavigation = (item) => {
        if (item.contentName === "country page") {
            onNavigateCountry({
                pathname: `/details/${item.countryId}`,
                state: {
                    countryId: item.countryId || ""
                },
            })

        } else if (item?.parentMetaDataInfo?.templateType === 'The Specifics') {
            onNavigateCountry({
                pathname: `/details/${item.countryId}`,
                state: {
                    divScroll: item.contentLevelId,
                    countryId: item.countryId || ""
                },
            })
        } else if (item?.parentMetaDataInfo?.templateType === 'Article') {
            onNavigateCountry({
                pathname: `${Constants.ROUTE.KNOWLEDGE_BASE.ARTICLE_PAGE}`,
                state: {
                    supertopicName:
                        item?.contentName,
                    countryId: item.countryId || ""
                },
            })
        } else if (item?.parentMetaDataInfo?.templateType === 'Snapshot') {
            onNavigateCountry({
                pathname: `/details/${item.countryId}`,
                state: {
                    snapShot: "snapshot",
                    countryId: item.countryId || ""
                },
            })
        } else {
            const fullText = getFullText(item)
            handleOnSearch(fullText)
        }
    }
    const getFullText = (item) => {
        const a = item.contentName === "country page" ? item.countryName : "";
        const b = (item?.parentMetaDataInfo?.templateType === 'The Specifics'
            || item?.parentMetaDataInfo?.templateType === 'Snapshot'
            || item?.parentMetaDataInfo?.templateType === 'Attract'
            || item?.parentMetaDataInfo?.templateType === 'Develop and Retain'
            || item?.parentMetaDataInfo?.templateType === 'Offboard'
            || item?.parentMetaDataInfo?.templateType === 'Onboard')
            && item.countryName && item.contentName.length > 1
            ?
            item.countryName + " -" : " ";
        const c = item.alertTitle ? item.alertTitle : '';
        const d = item.contentName === "country page" ? "Country Page" : item.contentName;
        const e = item?.parentMetaDataInfo?.templateType === 'Snapshot'
            && item.countryName ? " -" + item?.parentMetaDataInfo?.templateType : "";
        return `${a}${b}${c} ${d}${e}`
    }

    return (
        <Fragment>
            <div className={props.noRow ? "full-width" : "row"} data-test="searchBar">
                <div className="search-wrapper">
                    <div className="backdrop-filter">
                        <input
                            type="text"
                            className="form-control"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyPress={handleOnKeyPress}
                            placeholder={props.placeholder ? props.placeholder : "Ask a question"}
                            data-test="searchInput"
                        />
                        {/* <i className="ph-magnifying-glass" /> */}
                        {searchText ?
                            <div onClick={() => setSearchText("")} data-test="imageDiv">
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
                                    />
                                }
                            </div>
                            : null}
                        {
                            searchText.length >= 2 && result && result.length > 0 &&
                            <div className="p-2 auto-populate">
                                {
                                    result.map((item, key) => {
                                        return (
                                            <div
                                                className="result-container pointer"
                                                data-test="clickSearch"
                                                onClick={() => checkNavigation(item)}
                                            >
                                                {
                                                    item.contentName === "country page" && item.countryName
                                                }
                                                {(item?.parentMetaDataInfo?.templateType === 'The Specifics'
                                                    || item?.parentMetaDataInfo?.templateType === 'Snapshot'
                                                    || item?.parentMetaDataInfo?.templateType === 'Attract'
                                                    || item?.parentMetaDataInfo?.templateType === 'Develop and Retain'
                                                    || item?.parentMetaDataInfo?.templateType === 'Offboard'
                                                    || item?.parentMetaDataInfo?.templateType === 'Onboard')
                                                    && item.countryName && item.contentName.length > 1
                                                    ?
                                                    item.countryName + " -" : " "} {item.alertTitle ? item.alertTitle : ''} { }
                                                {item.contentName === "country page" ? "Country Page" : item.contentName} {item?.parentMetaDataInfo?.templateType === 'Snapshot'
                                                    && item.countryName ? " -" + item?.parentMetaDataInfo?.templateType : ""}
                                            </div>
                                        )
                                    })
                                }

                            </div>
                        }
                        {
                            searchText.length >= 2 && result && result.length === 0 && !autoSuggestResultsLoading &&
                            <div className="p-2 auto-populate">
                                <div className="result-container pointer">
                                    No results found
                                </div>
                            </div>
                        }

                    </div>
                    {/* <img
                        alt=""
                        src={searchIcon}
                        name="search-outline"
                        className="search-icon"
                    /> */}
                    <div className="profile-wrap">
                        {!props.testCase && <UserDropdown user={userData} />}
                    </div>
                    <div className="shopping-cart display_comingsoon searchBar-index"
                        onClick={() => {
                            (cartDetails?.items?.length > 0) && cartDetails?.items?.[0].productType !== "expert-hour" &&
                                history.push(Constants.ROUTE.HR_TEMPLATE_PAGE.IN_YOUR_CART)
                        }}
                    >
                        {props.theme === "dark" ?
                            <>
                                <span
                                    className="cart-count-top">
                                    {
                                        cartDetails?.items?.length > 0
                                            && cartDetails?.items?.[0].productType !== "expert-hour" ? cartDetails?.items?.length : 0
                                    }</span>
                                <img
                                    alt=""
                                    src={shoppingIconWhite}
                                    name="cart-outline"
                                    className="icon"
                                />
                            </>
                            :
                            <>
                                <span
                                    className="cart-count-top">
                                    {
                                        cartDetails?.items?.length > 0 && cartDetails?.items?.[0].productType !== "expert-hour" ? cartDetails?.items?.length : 0
                                    }</span>
                                <img
                                    alt=""
                                    src={shoppingIcon}
                                    name="cart-outline"
                                    className="icon"
                                />
                            </>

                        }
                        {/* <ComingSoon direction="top"></ComingSoon> */}

                    </div>
                    <div className="notify pointer" onClick={() => {
                        history.push(constants.ROUTE.KNOWLEDGE_BASE.ALERTS_HOME_PAGE)
                        //  setShowAlertPopUp(!showAlertPopUp) 
                    }}>
                        {props.theme === "dark" ?
                            <img
                                alt=""
                                src={whitebellIcon}
                                name="cart-outline"
                                className="icon"
                            />
                            :

                            <img
                                alt=""
                                src={bellIcon}
                                name="cart-outline"
                                className="icon"
                            />
                        }
                    </div>
                </div>
            </div>
            {
                showAlertPopUp &&
                <PopOverNotification />
            }
        </Fragment >
    );
};


export default React.memo(SearchBar);
