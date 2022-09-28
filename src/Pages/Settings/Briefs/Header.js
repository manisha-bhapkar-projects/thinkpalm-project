import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { Tooltip } from 'react-bootstrap';
import { Spinner } from 'react-bootstrap';

/* Icons */
import close from '../../../assets/images/search-close.svg';
import Download from '../../../assets/images/download.png';

/* Component */
import FilterDropDwon from '../../../Components/MultiselectDropDown/FilterDropdown';
import { downloadFile } from '../../../utils/utils';

/* Actions */
import {
  downloadFileAPI,
  getQueryStatusList,
} from '../../../Store/reducers/Purchase_ExpertBriefs';
import constants from '../../../utils/constants';
import { useHistory } from 'react-router';

const Header = ({
  setSearchValue,
  searchValue,
  onTextChange,
  placeholder,
  FilterAPIRequest,
}) => {
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState([]);

  const [assigneeFilter, setAssigneeFilter] = useState({
    assignIds: [],
  });
  const [statusFilter, setStatusFilter] = useState({
    statusId: [],
  });

  const [initialValues, setInitialValues] = useState({
    StartDate: '',
    EndDate: '',
  });

  const [exportUserData, setExportUserData] = useState({
    userExportData: [],
    fileName: '',
  });
  const dispatch = useDispatch();
  const history = useHistory();

  const statusList = useSelector(
    (state) => state?.purchaseExpertReducer?.statusList
  );
  const downlodFileloading = useSelector(
    (state) => state?.purchaseExpertReducer?.downloadFileLoading
  );

  useEffect(() => {
    dispatch(getQueryStatusList());
  }, []);
  useEffect(() => {
    const data = statusList?.filter((val) => {
      if (val.status == 'Submitted') {
        return val;
      } else if (val.status == 'In Progress') {
        return val;
      } else if (val.status == 'Completed') {
        return val;
      }
    });
    setStatusData(data);
  }, [statusList]);


  const handleDownloadFile = async () => {
    setLoading(true);
    const downloadResponse = await dispatch(downloadFileAPI());
    if (downloadResponse) {
      setLoading(false);
      const url = window.URL.createObjectURL(
        new Blob([downloadResponse?.payload?.data])
      );
      downloadFile(url, downloadResponse?.payload?.headers?.originalfilename);
    }
  };

  return (
    <div className="container-fluid" data-test="manage-brief-header">
      <div className="col-12">
        <div className="title-action-wrap">
          <div className="row">
            <div className="col-md-4 pl-0 header-label-section">
              <h3 className="gutter-manag-user" data-tip="Manage user">
                <div className="segment">Manage Briefs</div>
              </h3>
            </div>
            <div className="col-md-8 pl-0 row search-section">
              <div className="acc-account-container">
                <div className="download_btn">
                  <OverlayTrigger
                    overlay={(props) => (
                      <Tooltip id={`Download-Button`} {...props}>
                        Click here to download
                      </Tooltip>
                    )}
                  >
                    {downlodFileloading ? 
                    <>
                      <Spinner animation="border" size="sm" style={{color:'#40659e'}} />
                    </> : 
                    <img
                      src={Download}
                      style={{ cursor: 'pointer' }}
                      onClick={handleDownloadFile}
                      data-test="downloadFile"
                      alt=""
                    />
                    }
                  </OverlayTrigger>
                </div>
                <div className="tbl-search">
                  <input
                    type="text"
                    className="form-control"
                    value={searchValue}
                    onChange={onTextChange}
                    placeholder={placeholder}
                  />
                  {searchValue ? (
                    <div
                      onClick={() => {
                        setSearchValue('');
                      }}
                    >
                      <img
                        alt=""
                        src={close}
                        height={11}
                        name="search-outline"
                        className="cursor-pointer close-icon-search-users"
                      />
                    </div>
                  ) : null}
                </div>

                <button
                  type="button"
                  className="primary-button ml-0 ml-md-3 mr-3"
                  onClick={() => history.push(constants.ROUTE.SIDEBAR.SETTINGS.ADD_QUERY)}
                >
                  Add Query
                </button>

                <div className="filter-wrap">
                  <FilterDropDwon
                    data={statusData}
                    briefFlag={true}
                    assigneeFilter={assigneeFilter}
                    setAssigneeFilter={setAssigneeFilter}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    initialValues={initialValues}
                    setInitialValues={setInitialValues}
                    FilterAPIRequest={FilterAPIRequest}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
