import React, { useState, useEffect, useReducer, Fragment } from "react";
import { connect, useDispatch } from "react-redux";
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import moment from 'moment';

/* Component */
import SearchPageHeader from "./SearchPageHeader";
import Loader from "../../../Components/Loader";

/* Action */
import { getSearchResult, setPagination } from "../../../Store/reducers/searchResult";
import { updateSearchText } from "../../../Store/reducers/searchResult";
import constants from "../../../utils/constants";

/* Images */
import expandologo from "../../../assets/images/Logo.svg";
import profile_img from "../../../assets/images/dp.jpeg";


const SearchResultPage = (props) => {
  document.title = "Results";
  const history = useHistory();
  const dispatch = useDispatch();

  const reducer = useSelector(state => state.searchResultReducer);
  const result = useSelector(state => state.searchResultReducer.searchResult);
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(reducer.searchTextValue)
  const [pageNumbers, setPageNumbers] = useState([1])
  const [searchResultCount, setSearchResultCount] = useState(0)
  const { pagination } = useSelector(state => state.searchResultReducer);

  useEffect(() => {
    if (reducer.searchTextValue && reducer.searchTextValue != null && reducer.searchTextValue != "") {
      setSearchText(reducer.searchTextValue);
    }

  }, [reducer.searchTextValue]);


  useEffect(() => {
    if (result && result.result) {
      setSearchResult(result.result);
      setSearchResultCount(result.count);
      getPaginationValue(result.count);
      window.scrollTo(0, 300)
    }
    setLoading(false)
  }, [result])


  const handleOnSearch = async (search, paginated) => {
    if ((search && search != "") || searchText && searchText != null && searchText != "" && searchText.length > 1) {
      setLoading(true);

      dispatch(getSearchResult({
        searchText: (search && search != "") ? search : searchText,
        pagination: pagination,
        stateId: reducer.stateId,
        countryId: reducer.countryId,
        regionId: reducer.regionId
      }))

      if (result && result.result) {
        setSearchResult(result.result);
        setSearchResultCount(result.count);
        getPaginationValue(result.count);
        if (!paginated) {
          dispatch(setPagination({
            pageNumber: 1,
            pageSize: 6,
            reload: false,
          }))
        }

      }

      setLoading(true);
    }
  };

  const customPaginate = (pageLen, curPage) => {
    let PageLength = String(pageLen).indexOf('.') > 0 ? Math.round(pageLen) : pageLen;
    let item = Array.from(Array(PageLength + 1).keys());
    item.shift();
    function isPageInRange(curPage, _index, maxPages, pageBefore, pageAfter) {
      if (_index <= 1) return true;
      if (_index >= maxPages - 3) return true;
      if (_index >= curPage - pageBefore && _index < curPage + pageAfter) return true;
    }

    let html = [];
    let pageIndex = [];
    for (var i in item) {
      if (isPageInRange(curPage, i, PageLength, 1, 1)) {
        html.push(item[i]);
      } else if (!html.includes('dot') || (html.includes('dot') && i == PageLength - 5)) {
        html.push("dot");
      }
    }

    for (var i in html) {
      if (html[i] !== html[i - 1]) {
        pageIndex.push(html[i])
      }
    }

    return pageIndex;
  }

  const getPaginationValue = (count) => {
    if (typeof count === "number" && count !== 0 && count > 6) {
      const { pageSize, pageNumber } = pagination;
      setPageNumbers(customPaginate(count / pageSize, pageNumber));
    } else {
      setPageNumbers([0])
    }
  }

  useEffect(() => {
    if (pagination.reload) {
      handleOnSearch(searchText, true);
    }
  }, [pagination])

  const onSubmitSearchText = (text) => {
    dispatch(setPagination({
      pageNumber: 1,
      pageSize: 6,
      reload: true,
    }))

    setSearchText(text);
  }


  const onNavigateCountry = async (navigatePath) => {
    history.push(navigatePath)
  }

  const { pageNumber, pageSize } = pagination;
  return (

    <Fragment>

      <div className="search-result-page loader-enable" data-testid="search-result-page">
        <SearchPageHeader searchTextValue={searchText} history={history} reducer={reducer} getSearchResult={onSubmitSearchText} />
        <div className="search-result-wrapper container">
          <div className="search-result-header">
            <h3>Results for : <span>“{searchText}”</span></h3>
            <div className="result-count">{searchResultCount} results</div>
          </div>
          {
            loading && (
              <div className="custom-loader">
                <Loader />
              </div>
            )
          }
          <div className="search-results">

            {/* Search result block .slice((pageNumber - 1) * pageSize, pageNumber * pageSize)*/}
            {
              searchResult.map((data, i) => {
                return (
                  <div key={i} className={
                    data.contentName === "country page" ||
                      data?.parentMetaDataInfo?.templateType === 'The Specifics' ||
                      data?.parentMetaDataInfo?.templateType === 'Article' ||
                      data?.parentMetaDataInfo?.templateType === 'Snapshot' ?
                      "result-container pointer" : "result-container"}
                    onClick={
                      data.contentName === "country page" ? () =>
                        onNavigateCountry({
                          pathname: `/details/${data.countryId}`,
                          // state: {
                          //   divScroll: item.contentLevelId,
                          // },
                        })
                        :

                        data?.parentMetaDataInfo?.templateType === 'The Specifics' ?
                          () => onNavigateCountry({
                            pathname: `/details/${data.countryId}`,
                            state: {
                              divScroll: data.contentLevelId
                            },
                          }) : data?.parentMetaDataInfo?.templateType === 'Article' ? () => {
                            onNavigateCountry({
                              pathname: `${constants.ROUTE.KNOWLEDGE_BASE.ARTICLE_PAGE}`,
                              state: {
                                supertopicName:
                                  data?.contentName,
                              },
                            })
                          } : data?.parentMetaDataInfo?.templateType === 'Snapshot' ? () => {
                            onNavigateCountry({
                              pathname: `/details/${data.countryId}`,
                              state: {
                                snapShot: "snapshot"
                              },
                            })
                          } : ""}>
                    <h4 className="regular">
                      {
                        data.contentName === "country page" ? data.countryName + ' -'
                          :
                          (
                            data?.parentMetaDataInfo?.templateType === 'The Specifics' ||
                            data?.parentMetaDataInfo?.templateType === 'Snapshot' ||
                            data?.parentMetaDataInfo?.templateType === 'Attract' ||
                            data?.parentMetaDataInfo?.templateType === 'Develop and Retain' ||
                            data?.parentMetaDataInfo?.templateType === 'Offboard' ||
                            data?.parentMetaDataInfo?.templateType === 'Onboard') &&
                            data.countryName && data.contentName.length > 1 ?
                            data.countryName + " -" : " "} {data.alertTitle ? data.alertTitle : ''}
                      {data.contentName} {data?.parentMetaDataInfo?.templateType === 'Snapshot' &&
                        data.countryName ? " -" + data?.parentMetaDataInfo?.templateType : ""}
                    </h4>
                    <p dangerouslySetInnerHTML={{ __html: data?.content?.length >= 200 ? data.content + "..." : data.content }}></p>

                    <span><img src={data?.parentMetaDataInfo?.templateType === 'Article' ? data.parentMetaDataInfo.authorPic ? `${constants.IMAGE.DOWNLOAD}${data.parentMetaDataInfo.authorPic}` : profile_img : expandologo} className={`${data.updatedDate ? '' : ''}`} />
                      {
                        data.updatedDate ? 'Updated ' + moment(data.updatedDate).format('MMM DD, YYYY') : data.publishedDate ? 'Published ' + moment(data.publishedDate).format('MMM DD, YYYY') + ` ${data.parentMetaDataInfo?.authorName ? " by " + data.parentMetaDataInfo.authorName : ""}` : " "
                      }
                      {data.updatedBy ? 'by' + data.updatedBy : ''}
                    </span>
                  </div>
                )
              })
            }
            {/* Pagination */}
            <div className="row mb-3">
              <div className="col-sm-6">
                <span className="footer-results">Showing {pageNumber > 1 ? (pageSize * (pageNumber - 1) + 1) : (searchResultCount === 0 ? 0 : pageNumber)} -  {(searchResultCount > pageSize) ? (pageNumber * pageSize < searchResultCount) ? (pageNumber * pageSize) : searchResultCount : searchResultCount} of {searchResultCount}
                </span>
              </div>
              <div className="col-sm-6 d-flex justify-content-end">
                <ul>
                  <li data-testid="paginate" className={pageNumber != 1 ? 'active-txt' : 'inactive-txt'}
                    onClick={() => dispatch(setPagination({ ...pagination, reload: true, pageNumber: pageNumber - 1 }))}>Prev</li>
                  {
                    pageNumbers.map((number, i) => {
                      return (
                        <li
                          key={number + i}
                          onClick={() => { if (number != 'dot') dispatch(setPagination({ ...pagination, reload: true, pageNumber: number })); }}
                          className={pageNumber === Number(number) ? 'active' : ''}>
                          {number === 'dot' ? '...' : number}
                        </li>
                      )
                    })
                  }
                  <li onClick={() => dispatch(setPagination({ ...pagination, reload: true, pageNumber: pageNumber + 1 }))} className={pageNumber >= pageNumbers[pageNumbers.length - 1] ? 'inactive-txt' : 'active-txt'}>Next</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default React.memo(SearchResultPage);