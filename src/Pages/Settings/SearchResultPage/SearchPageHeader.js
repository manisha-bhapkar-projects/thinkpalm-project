import React, { useCallback, useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useHistory } from 'react-router';
import Constants from "../../../utils/constants";

/* Component */
import UserDropdown from "../../../Components/UserDropdown";

/* Icons */
import searchIcon from "../../../assets/images/search_icon_1.svg";
import closeIcon from "../../../assets/images/close.svg";
import shoppingIcon from "../../../assets/images/shopping_icon_1.svg";
import Hero_image_Africa from "../../../assets/images/search-page-header-bg.png";
import close from "../../../assets/images/search-close.svg";
import ComingSoon from "../../../Components/ComingSoon"
import bellIcon from "../../../assets/images/bell-icon.svg";
import bellIconBlue from "../../../assets/images/bell-icon-new.svg";
import whitebellIcon from "../../../assets/images/whitebellIcon.svg";
import whiteBellBlue from "../../../assets/images/whiteBellBlue.svg";

/* Action */
import { getUserProfile } from "../../../utils/storage";
import { updateSearchText, autoSuggest } from "../../../Store/reducers/searchResult";

import {
  getCartDetails,
} from "../../../Store/reducers/HRTemplate"

const SearchPageHeader = (props) => {
  const [searchText, setSearchText] = useState('');
  const [populatedSearchText, setPopulatedSearchText] = useState(props.searchTextValue);
  const dispatch = useDispatch();
  const userData = getUserProfile();
  const [result, setSearchSuggest] = useState('');
  const location = useLocation();
  const history = useHistory();
  const userId = "00000000-0000-0000-0000-000000000000";
  const cartDetails = useSelector((state) => state?.HRTemplate?.cartDetails);

  const reducerResult = useSelector(state => state?.searchResultReducer?.autoSuggestResults);
  const autoSuggestResultsLoading = useSelector(state => state?.searchResultReducer?.autoSuggestResultsLoading);
  const searchResultLoading = useSelector(state => state.searchResultReducer.searchResultLoading);

  useEffect(() => {
    dispatch(getCartDetails({ userId }));
  }, []);

  useEffect(() => {
    setSearchSuggest(reducerResult);
  }, [reducerResult])

  useEffect(() => {
    setSearchSuggest('');
  }, [searchResultLoading])

  useEffect(() => {
    setSearchSuggest('');
  }, [location])

  const autoPopulateSearchBox = async () => {
    await dispatch(autoSuggest({
      searchText
    }));
  }


  useEffect(() => {
    if (searchText.length > 0 && populatedSearchText.length > 0) {
      setPopulatedSearchText('')
    }
    if (searchText.length >= 2) {
      setPopulatedSearchText('')
      autoPopulateSearchBox()
    }
  }, [searchText])

  /* Trigger the API call and navigate to the UI */
  const handleOnSearch = async (fullText) => {
    console.log('API call', props);
    dispatch(updateSearchText({ text: fullText || searchText }));
    props.getSearchResult(fullText || searchText);
  };


  /* Tracks when user press enter */
  const handleOnKeyPress = (e) => {
    const key = e.keyCode || e.which;
    if (key == 13) {
      setSearchSuggest('');
      handleOnSearch();
    }
  };


  const navigateTo = (where, id) => {
    switch (where) {
      case "home":
        props.history.push(`/home`);
        break;

      case "country":
        props.history.push(`/details/${id}`);
        break;

      default:
        console.log('Need to add the logic here', where)
        break;
    }
  }
  const onNavigateCountry = async (navigatePath) => {
    history.push(navigatePath)
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
      setSearchText(fullText);
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

  const { countryName, countryId } = props.reducer;
  return (
    <Fragment>
      <div className="ip_header_wrap search-results-wrap" data-testid="search-results-wrap">
        <div className="ip_banner-img">
          <img src={Hero_image_Africa} />
        </div>
        <div>
          <div className="row">
            <div className="search-wrapper">
              <div className="breadcrump-admin mt-3 mb-3">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb p-0">
                    <li className="breadcrumb-item" onClick={() => navigateTo('home')} >Home</li>
                    {
                      countryName &&
                      <li className="breadcrumb-item" data-testid="navBar" onClick={() => navigateTo('country', countryId)}>{countryName}</li>
                    }
                    <li className="breadcrumb-item">Search Results</li>
                  </ol>
                </nav>
              </div>

              <div className="profile-wrap">
                <UserDropdown user={userData} />
              </div>
              <div className="shopping-cart display_comingsoon searchPageHeader"
                onClick={() => {
                  (cartDetails?.items?.length > 0) && cartDetails?.items?.[0].productType !== "expert-hour" &&
                    history.push(Constants.ROUTE.HR_TEMPLATE_PAGE.IN_YOUR_CART)
                }}
              >
                <>
                  <span
                    className="cart-count-top">
                    {
                      cartDetails?.items?.length && cartDetails?.items?.[0].productType !== "expert-hour"
                        ?
                        cartDetails.items.length
                        :
                        0
                    }</span>
                  <img
                    alt=""
                    src={shoppingIcon}
                    name="cart-outline"
                    className="icon"
                  />
                </>
                {/* <ComingSoon direction="top"></ComingSoon> */}

              </div>
              <div className="notify pointer" onClick={() => {
                history.push(Constants.ROUTE.KNOWLEDGE_BASE.ALERTS_HOME_PAGE)
                //  setShowAlertPopUp(!showAlertPopUp) 
              }}>

                <img
                  alt=""
                  src={whitebellIcon}
                  name="cart-outline"
                  className="icon"
                />
              </div>
            </div>

            <div className="quick-search">
              <div className="relative">
                <input
                  type="text"
                  className="form-control"
                  data-testid="quick-search-input"
                  value={populatedSearchText !== '' ? populatedSearchText : searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyPress={handleOnKeyPress}
                  placeholder="Ask a question, search countries, labor laws and more"
                />

                <img
                  alt=""
                  onClick={() => searchText ? setSearchText("") : ""}
                  src={searchText ? close : searchIcon}
                  name="search-outline"
                  className="search-icon cursor-pointer"
                />

              </div>
              {
                searchText.length >= 2 && result && result.length > 0 &&
                <div className="p-2 auto-populate-search-result">
                  {
                    result.map((item, key) => {
                      return (
                        <div className="result-container pointer"
                          onClick={() => checkNavigation(item)}>
                          {
                            item.contentName === "country page" && item.countryName
                          }
                          {(item?.parentMetaDataInfo?.templateType === 'The Specifics'
                            || item?.parentMetaDataInfo?.templateType === 'Snapshot'
                            || item?.parentMetaDataInfo?.templateType === 'Attract'
                            || item?.parentMetaDataInfo?.templateType === 'Develop and Retain'
                            || item?.parentMetaDataInfo?.templateType === 'Offboard'
                            || item?.parentMetaDataInfo?.templateType === 'Onboard')
                            && item.countryName && item.contentName.length > 1 ?
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
                <div className="p-2 auto-populate-search-result">
                  <div className="result-container pointer">
                    No results found
                  </div>
                </div>
              }

            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default connect(null, null)(SearchPageHeader);
