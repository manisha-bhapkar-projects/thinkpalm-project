import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { debounce } from 'lodash';
import _ from "lodash";
import { connect } from "react-redux";
import next from "../../assets/images/nextIcon.svg";
import prev from "../../assets/images/prevIcon.svg";
import nextActive from "../../assets/images/activated-arrow-next.svg";

function CustomePagination({
  totalLength,
  onPageChangedCalled,
  limit,
  pageNumber,
  paginationPerPage,
  disabledJumpTo,
  paginationRowsPerPageOptions,
  handleDropdownChange,
  notify
}) {
  const [pageNo, setPageNo] = useState(1);
  const [jumpTo, setJumpTo] = useState(0);
  const countTotalPage = totalLength / limit;
  useEffect(() => {
    if (pageNumber === 1) {
      setPageNo(1);
      setJumpTo(0)
    } else if (pageNumber > 1) {
      setPageNo(pageNumber);
    }
  }, [totalLength, pageNumber]);
  const TotalPages = Math.ceil(countTotalPage);
  const NextPage = () => {
    if (TotalPages !== pageNo) {
      window.scrollTo(0, 0);
      const page = parseInt(pageNo) + 1;
      setJumpTo(0);
      setPageNo(page);
      onPageChangedCalled(page);
    }
  };
  const toLastPage = () => {
    if (TotalPages !== pageNo) {
      window.scrollTo(0, 0);
      const page = TotalPages;
      setJumpTo(0);
      setPageNo(page);
      onPageChangedCalled(page);
    }
  };


  const toFirstPage = () => {
    if (pageNo !== 1) {
      window.scrollTo(0, 0);
      const page = 1;
      setJumpTo(0);
      setPageNo(page);
      onPageChangedCalled(page);
    }
  };

  const handleChangeJumpTo = (e) => {
    setJumpTo(e.target.value);
    if (parseInt(Math.round((totalLength / limit).toString().replace('.', '.5')).toFixed()) < parseInt(e.target.value)) {
      notify('Please enter valid page number!');
    } else {
      window.scrollTo(0, 0);
      if (e.target.value) {
        setTimeout(() => {
          delayedChange(e.target.value)
        }, 1000)
      } else {
        setPageNo(1);
        setJumpTo(0);
        onPageChangedCalled(1);
      }
    }
  };
  const delayedChange = ((event) => {
    setPageNo(parseInt(event));
    setJumpTo(parseInt(event));
    onPageChangedCalled(event);
  })
  // const delayedChange = debounce(event => {
  //   setPageNo(parseInt(event));
  //   setJumpTo(parseInt(event));
  //   onPageChangedCalled(event);
  // }, 1500)
  const PreviousPage = () => {
    if (pageNo !== 1) {
      window.scrollTo(0, 0);
      const page = pageNo - 1;
      setPageNo(page);
      setJumpTo(0);
      onPageChangedCalled(page);
    }
  };

  const getPageNumbers = (totalPages) => {
    const arr = [];
    for (let i = 1; i <= totalPages; i += 1) {
      arr.push(i);
    }
    return arr;
  };

  return (
    <>
      <div className="pagination-wrap" data-test="customePagination">
        <div className="row">
          <div className="col-sm-12 col-md-4">
            <div className="count-select">
              <span>Show</span>
              <select
                className="form-control"
                value={limit}
                onChange={handleDropdownChange}
              >
                {
                  (paginationRowsPerPageOptions && paginationRowsPerPageOptions.length > 0) ?
                    paginationRowsPerPageOptions.map((item) => (
                      <option key={Math.random().toString(36).substr(2, 5)} value={item} data-test="option">{item}</option>
                    ))
                    : <>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={30}>30</option>
                    </>
                }
              </select>
              <span>per page</span>
            </div>
          </div>
          <div className="col-sm-12 col-md-8 d-flex justify-content-end" >
            <div className="main-pagination">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className={`page-item  ${pageNo === 1 ? "" : ""}`}
                    style={{ cursor: "pointer" }}
                  >
                    <span
                      className={`page-link border-right-pagination ${pageNo !== 1 ? "activePagination" : "disablePagination"}`}
                      aria-label="Previous"
                      onKeyDown={toFirstPage}
                      onClick={toFirstPage}
                      data-test="firstPage"
                    >
                      <span aria-hidden="true">
                        <img src={prev} />
                      </span>
                    </span>
                  </li>
                  <li className="page-item"
                  >
                    <span
                      className={`page-link click-inactive ${pageNo !== 1 ? "activePagination" : "disablePagination"}`}
                      onKeyDown={PreviousPage}
                      onClick={PreviousPage}
                      aria-label="Previous"
                      data-test="previousPage"
                    >
                      Prev
                    </span>
                  </li>
                  <li className="page-item">
                    <span className="page-link active">{pageNo}</span>
                  </li>
                  <li
                    className={`page-item ${getPageNumbers(TotalPages).length === pageNo
                      ? "click-inactive "
                      : ""
                      }`}
                    onKeyDown={NextPage}
                    onClick={NextPage}
                    data-test="nextPage"
                  >
                    <span
                      className={`page-link click-active  ${getPageNumbers(TotalPages).length === pageNo ? "disablePagination" : "activePagination"}`}
                      aria-label="Previous"
                    >
                      Next
                    </span>
                  </li>
                  <li
                    className={`page-item ${getPageNumbers(TotalPages).length === pageNo
                      ? "click-inactive"
                      : ""
                      }`}

                  >
                    <span
                      className={`page-link click-active click-inactive-border ${getPageNumbers(TotalPages).length === pageNo ? "disablePagination" : "activePagination"}`}
                      aria-label="Next"
                      onKeyDown={toLastPage}
                      onClick={toLastPage}
                      data-test="lastPage"
                    >
                      <span aria-hidden="true">
                        <img src={next} />
                      </span>
                    </span >
                  </li>
                  {!disabledJumpTo && <li className="jump-page">
                    <span>Jump to</span>
                    <input
                      type="number"
                      min="1"
                      max={1}
                      value={jumpTo > 0 ? jumpTo : ""}
                      className="form-control"
                      onChange={handleChangeJumpTo}
                      pattern="[0-9]"
                      data-test="jumpTo"
                    />
                  </li>}
                  <li className="jump-page" style={{ paddingRight: 20 }}>
                    <span>of &nbsp;{Math.round((totalLength / limit).toString().replace('.', '.5')).toFixed()}</span>
                  </li>

                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

CustomePagination.propTypes = {
  totalLength: PropTypes.number.isRequired,
  onPageChangedCalled: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
};


export default CustomePagination;
