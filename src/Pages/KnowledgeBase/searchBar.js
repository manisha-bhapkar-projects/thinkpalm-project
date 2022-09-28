import React, { useEffect, useState, Fragment, useCallback, useRef } from "react";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { debounce } from "lodash"
/* Components */
import UserDropdown from "../../Components/UserDropdown";
/* Icons */
import shoppingIcon from "../../assets/images/shopping-cart-ts.svg";
import shoppingIconWhite from "../../assets/images/shopping_icon_1.svg";
import close from "../../assets/images/search-close-white.svg";
import ComingSoon from "../../Components/ComingSoon";
import bellIcon from "../../assets/images/bell-icon.svg";
import bellIconBlue from "../../assets/images/bell-icon-new.svg";
import whitebellIcon from "../../assets/images/whitebellIcon.svg";
import whiteBellBlue from "../../assets/images/whiteBellBlue.svg";

/* Action */
import {
  updateSearchText,
  autoSuggest,
  autoSuggestDocShop
} from "../../Store/reducers/searchResult";
import Constants from "../../utils/constants";
import { getUserProfile } from "../../utils/storage";
import {
  getCartDetails,
} from "../../Store/reducers/HRTemplate";

const SearchBar = (props) => {
  const wrapperRef = useRef(null);
  const { cartList,
    doc_shop,
    callDocumentList,
    isSearchText,
    callSpecificDoc,
    setSearchTextClear,
    redirectToHrTemplate,
  } = props;
  const [searchText, setSearchText] = useState("");
  const [populatedSearchText, setPopulatedSearchText] = useState(props.param);
  const [result, setSearchSuggest] = useState("");
  const userData = getUserProfile();
  const history = useHistory();
  const dispatch = useDispatch();

  /** Doc shop auto suggest */
  const autoSuggestDocShopResults = useSelector(
    (state) => state.searchResultReducer?.autoSuggestDocShopResults?.data
  );
  const autoSuggestDocShopResultsLoading = useSelector(
    (state) => state.searchResultReducer?.autoSuggestDocShopResultsLoading
  );
  /** Doc shop auto suggest end */

  const reducerResult = useSelector(
    (state) => state.searchResultReducer?.autoSuggestResults
  );
  const autoSuggestResultsLoading = useSelector(state => state?.searchResultReducer?.autoSuggestResultsLoading);
  const searchResultLoading = useSelector(
    (state) => state.searchResultReducer?.searchResultLoading
  );
  const cartDetails = useSelector(state => state?.HRTemplate?.cartDetails)
  /* Trigger the API call and navigate to the UI */
  const handleOnSearch = async (fullText) => {

    if (searchText?.length > 1 && !props.testCase) {
      if (doc_shop && !redirectToHrTemplate) {
        const response = await callDocumentList(searchText)
        if (response === 200) {
          setSearchSuggest("")
        }
      } else if (redirectToHrTemplate) {
        history.push({
          pathname: Constants.ROUTE.HR_TEMPLATE_PAGE.DOC_SHOP,
          state: {
            redirectToHrTemplate: redirectToHrTemplate,
            searchText: searchText
          }
        })
      } else {
        await dispatch(
          updateSearchText({
            text: fullText || searchText,
            countryId: props.countryId ? props.countryId : false,
            countryName: props.countryName ? props.countryName : false,
          })
        );
        history.push(Constants.ROUTE.SIDEBAR.SETTINGS.SEARCH_PAGE);

      }
    }
  };
  const userId = "00000000-0000-0000-0000-000000000000";

  useEffect(() => {
    dispatch(getCartDetails({ userId }));
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);


  useEffect(() => {
    if (autoSuggestDocShopResults) {
      setSearchSuggest(autoSuggestDocShopResults);
    } else {
      setSearchSuggest(reducerResult);

    }
  }, [reducerResult, autoSuggestDocShopResults]);


  useEffect(() => {
    setSearchSuggest("");
  }, [searchResultLoading]);
  // useEffect(() => {
  //   setSearchSuggest("");
  // }, [location]);
  const autoPopulateSearchBox = async () => {
    if (doc_shop) {
      dispatch(autoSuggestDocShop({
        page: 1,
        pageSize: 10,
        searchterm: searchText

      }));
    } else {
      await dispatch(
        autoSuggest({
          searchText,
        })
      );
    }
  };

  useEffect(() => {
    if (searchText?.length > 0 && populatedSearchText?.length > 0) {
      setPopulatedSearchText("");
    }
    if (searchText?.length >= 2) {
      setPopulatedSearchText("");
      if (!doc_shop) {
        autoPopulateSearchBox();
      }
    }
  }, [searchText]);

  const onNavigateCountry = async (navigatePath) => {
    history.push(navigatePath);
  };

  /* Tracks when user press enter */
  const handleOnKeyPress = (e) => {
    const key = e.keyCode || e.which;
    if (key == 13 || props.testCase) {
      handleOnSearch();
    }
  };
  useEffect(() => {
    if (isSearchText) {
      setSearchText('')
    }
  }, [isSearchText])

  const callDocShopAutopopulate = (text) => {
    dispatch(autoSuggestDocShop({
      page: 1,
      pageSize: 100000,
      searchterm: text

    }));
  }

  const debouncedSave = useCallback(
    debounce(text => {
      if (text !== "" && text.length >= 2) {
        callDocShopAutopopulate(text)
      }
    }
      , 2000),
    [], // will be created only once initially
  );

  /** This is for closing the auto suggestion box while clicking outside of the search box */
  const handleClickOutside = event => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setSearchSuggest("")
    }
  };

  const callDocShopAutoSuggestion = () => {
    return (
      <div className="backdrop-filter" ref={wrapperRef}>
        <input
          type="text"
          className="form-control"
          value={
            searchText
          }
          autoComplete="doc-shop-autocomplete"
          data-testid="search-box"
          onChange={(e) => {
            setSearchText(e.target.value)

            debouncedSave(e.target.value);

            if (doc_shop) setSearchTextClear(false)

          }}
          onKeyPress={handleOnKeyPress}
          placeholder={`${props.doc_shop
            ? "Search by country or document name"
            : "Ask a question, search countries, labor laws and more"
            }`}
          data-test="searchInput"
        />
        {

          result &&
          searchText &&
          searchText?.length >= 2 &&
          result?.length > 0 && (
            <div className="p-2 auto-populate-search-result docshop-populate">
              {result?.map((item, key) => {
                return (
                  <div
                    className="result-container pointer text-left"
                    onClick={() => {
                      if (!redirectToHrTemplate) {
                        setSearchSuggest("")
                        callSpecificDoc(item);
                      } else {
                        history.push({
                          pathname: Constants.ROUTE.HR_TEMPLATE_PAGE.DOC_SHOP,
                          state: {
                            redirectToHrTemplate: redirectToHrTemplate,
                            searchSpecificItem: true,
                            specificItem: item,
                            // searchText: item?.countryName + "-" + item.category.categoryName + "-" + item.languageName
                          }
                        })
                      }

                    }}
                  >
                    {
                      item.countryName

                    }
                    &nbsp;-&nbsp;
                    {
                      item?.category.categoryName
                    }
                    &nbsp;-&nbsp;
                    {
                      item.title
                    }
                  </div>
                );
              })}
            </div>
          )}
        {
          searchText?.length >= 2 && autoSuggestDocShopResultsLoading &&
          //  result && result.length === 0 &&
          <div className="p-2 auto-populate-search-result">
            <div className="result-container pointer">
              {
                autoSuggestDocShopResultsLoading ? "Searching ..." :
                  result && result.length === 0 && !autoSuggestDocShopResultsLoading ?
                    "No results found"
                    :
                    "Searching ..."
              }
            </div>
          </div>
        }
        {searchText || populatedSearchText?.length ? (
          <div
            onClick={() => {
              setSearchText("");
              setPopulatedSearchText("");
              callDocumentList('')
            }}
          >
            <img
              alt=""
              src={close}
              name="search-outline"
              className="close-icon-search-knowledge close-icon-search cursor-pointer"
            />
          </div>
        ) : null}
      </div>

    )
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
      <div className="search-wrapper" data-test="serachBar">
        {props?.breadcrumb && props?.breadcrumb?.length > 0 && (
          <div className="breadcrumb-w">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                {props.breadcrumb.map((item) => (
                  <li
                    key={Math.random().toString(36).substr(2, 5)}
                    className={
                      item.pageLink === ""
                        ? "breadcrumb-item activeItem"
                        : "breadcrumb-item"
                    }
                  >
                    {item.pageLink !== "" ? (
                      <Link to={item.pageLink}>{item.name}</Link>
                    ) : (
                      <span>{item.name}</span>
                    )}
                  </li>
                ))}
                {/* <li className="breadcrumb-item">
                                    <span>Home</span>
                                </li>
                                <li className="breadcrumb-item" aria-current="page">
                                    <span>{"Country"}</span>
                                </li> */}
              </ol>
            </nav>
          </div>
        )}
        <div className="profile-wrap">
          <UserDropdown user={userData} />
        </div>
        <div className="shopping-cart display_comingsoon" data-test="shopping" onClick={() => {
          (cartList?.length > 0 || cartDetails?.items?.length > 0) && cartDetails?.items?.[0].productType !== "expert-hour" &&
            history.push(Constants.ROUTE.HR_TEMPLATE_PAGE.IN_YOUR_CART)
        }
        }>
          {props.theme === "dark" ? (
            <>
              <span
                className="cart-count-top">{cartList && cartList.length > 0 && cartList?.[0].productType !== "expert-hour"
                  ? cartList.length
                  : cartDetails?.items?.length && cartDetails?.items?.[0].productType !== "expert-hour"
                    && (props?.cartLength > 0 || props?.cartLength === undefined)
                    ? cartDetails?.items?.length
                    :
                    0}</span>
              <img
                alt=""
                src={shoppingIconWhite}
                name="cart-outline"
                className="icon"
              />
            </>
          ) : (
            <>
              <span
                style={{ color: "black" }}>
                {cartDetails?.items?.length && cartDetails?.items?.[0].productType !== "expert-hour" && (props?.cartLength > 0
                  || props?.cartLength === undefined) ?
                  cartDetails?.items?.length :
                  0
                }
              </span>
              <img
                alt=""
                src={shoppingIcon}
                name="cart-outline"
                className="icon"
              />
            </>
          )}
          {/* <ComingSoon direction="top"></ComingSoon> */}
        </div>
        <div className="notify pointer" onClick={() => {
          history.push(Constants.ROUTE.KNOWLEDGE_BASE.ALERTS_HOME_PAGE)
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
      <div className={"search-holder"} data-test="holder">
        <h3>{props.title}</h3>
        {props.doc_shop ? (
          <p>Your one stop shop for all HR Template needs.</p>
        ) : (
          ""
        )}
        {
          doc_shop ?
            callDocShopAutoSuggestion()
            :
            <div className="backdrop-filter">
              <input
                type="text"
                className="form-control"
                value={
                  populatedSearchText !== "" ? populatedSearchText : searchText
                }
                data-testid="search-box"
                onChange={(e) => setSearchText(e.target.value)}
                onKeyPress={handleOnKeyPress}
                placeholder={`${props.doc_shop
                  ? "Search by country or document name"
                  : "Ask a question, search countries, labor laws and more"
                  }`}
                data-test="searchInput"
              />
              {

                result &&
                searchText &&
                searchText?.length >= 2 &&
                result?.length > 0 && (
                  <div className="p-2 auto-populate-search-result">
                    {result?.map((item, key) => {
                      return (
                        <div
                          className="result-container pointer text-left"
                          onClick={() => checkNavigation(item)}
                        >
                          {
                            item.contentName === "country page" && item.countryName
                          }
                          {(item?.parentMetaDataInfo?.templateType === "The Specifics" ||
                            item?.parentMetaDataInfo?.templateType === "Snapshot" ||
                            item?.parentMetaDataInfo?.templateType === "Attract" ||
                            item?.parentMetaDataInfo?.templateType === "Develop and Retain" ||
                            item?.parentMetaDataInfo?.templateType === "Offboard" ||
                            item?.parentMetaDataInfo?.templateType === "Onboard") &&
                            item.countryName &&
                            item.contentName?.length > 1
                            ? item.countryName + " -"
                            : " "}{" "}
                          {item.alertTitle ? item.alertTitle : ""} { }
                          {item.contentName === "country page" ? "Country Page" : item.contentName}{" "}
                          {item?.parentMetaDataInfo?.templateType === "Snapshot" &&
                            item.countryName
                            ? " -" + item?.parentMetaDataInfo?.templateType
                            : ""}
                        </div>
                      );
                    })}
                  </div>
                )}
              {
                searchText?.length > 2 && result && result.length === 0 && !autoSuggestResultsLoading &&
                <div className="p-2 auto-populate-search-result">
                  <div className="result-container pointer">
                    No results found
                  </div>
                </div>
              }
              {searchText || populatedSearchText?.length ? (
                <div
                  onClick={() => {
                    setSearchText("");
                    setPopulatedSearchText("");
                  }}
                >
                  <img
                    alt=""
                    src={close}
                    name="search-outline"
                    className="close-icon-search-knowledge close-icon-search cursor-pointer"
                  />
                </div>
              ) : null}
            </div>

        }

      </div>
    </Fragment>
  );
};

export default React.memo(SearchBar);
