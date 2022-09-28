import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

/* Component */
import SearchHeaderText from '../../../Components/SearchHeaderText/SearchHeaderText';
import SupportButton from '../../../Components/SupportButton';
import constants from '../../../utils/constants';
import ImageRender from '../imageRender';
import FavouriteCountryEditModal from '../FavoriteCounries/FavouriteCountryEditModal';
import { permissionMapping } from '../../../utils/utils';
import CustomeTable from '../../../Components/CustomeTable/CustomeTable';

/* Icon */
import dotIcon from '../../../assets/images/dotIcon.svg';

/* Action */
import {
  callDeleteCountryAPI,
  callgetEmployeeType,
  callgetUserCountry,
  callgetUserCountryDetails,
  getEmployeeCountList,
} from '../../../Store/reducers/favoriteCountries';
/*  Mixpanel starts here  */
import mixpanel from 'mixpanel-browser';
import { userDetailsMixpnel } from '../../../utils/utils';
mixpanel.init(constants.MIXPANEL_TOKEN);
/*  Mixpanel ends here  */
const getTypeCount = (rows, empType, typeName) => {
  let rowStr = 0;

  rows?.employeeTypes?.forEach((type) => {
    if (type?.employeeTypeName === empType) {
      rowStr = type[typeName];
      return rowStr;
    }
  });

  return rowStr;
};

const FavoriteCountries = (props) => {
  document.title = 'Settings';
  const history = useHistory();
  const [countryList, setCountryList] = useState([]);
  const [editModeList, setEditModeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [id, setId] = useState('');
  const [empData, setEmpData] = useState([]);
  const permissionArray = permissionMapping();

  const dispatch = useDispatch();
  const countries = useSelector(
    (state) => state?.favoriteCountriesReducer?.userCountryList
  );
  const employeeType = useSelector(
    (state) => state?.favoriteCountriesReducer?.employeeType
  );
  const countryData = useSelector(
    (state) => state?.favoriteCountriesReducer?.UserCountryData
  );
  const deleteError = useSelector(
    (state) => state?.favoriteCountriesReducer?.deleteError
  );
  const countryDeleted = useSelector(
    (state) => state?.favoriteCountriesReducer?.countryDeleted
  );
  const employeeCountList = useSelector(
    (state) => state?.favoriteCountriesReducer?.employeeCountList
  );

  const loading = useSelector(
    (state) => state?.favoriteCountriesReducer?.employeeCountListPending
  );

  const userData = JSON.parse(localStorage.getItem('user-profile'));

  const userId = userData?.userId;
  useEffect(() => {
    if (
      !permissionArray?.includes(
        constants.PERMISSION_MAPPING.FAVORITE_COUNTRIES ||
        !permissionArray?.includes(
          constants.PERMISSION_MAPPING.ADDING_EMPLOYEE_COUNTS
        )
      )
    ) {
      history.push('/home');
    }
    dispatch(callgetEmployeeType());
    dispatch(getEmployeeCountList({ userId }));
  }, [userId]);

  useEffect(() => {
    if (countryDeleted === 200) {
      props.notify('Country Removed from Favorites');
      dispatch(callDeleteCountryAPI({ success: true }));
    } else if (deleteError && deleteError.length) {
      props.notify(deleteError);
    }
  }, [deleteError, countryDeleted]);

  const handleDeleteCountry = async (id, country) => {
    await dispatch(callDeleteCountryAPI({ id }));
    await dispatch(getEmployeeCountList({ userId }));
    mixpanel.track('Remove Country from favorites', {
      'Content Country Name': country,
      'User Details': userDetailsMixpnel()
    })

  };
  const handleCloseModal = async () => {
    setShowModal(false);
    await dispatch(getEmployeeCountList({ userId }));
  };
  const openModal = (row) => {
    setShowModal(true);
    setRowData(row);
  };

  const handleDotClick = (rowId) => {
    if (id && id == rowId) {
      setId(undefined);
    } else {
      setId(rowId);
    }
  };
  const CountryColumns = [
    {
      name: 'Country',
      selector: 'countryName',
      width: '13%',
      sortable: true,
      cell: (row) => (
        <>
          <div className="fav-country-list">
            <div
              className={
                row.flag_Upload_Id && row.flag_Upload_Id != null
                  ? 'flag'
                  : 'blank-flag flag'
              }
            >
              <ImageRender url={row.flag_Upload_Id} />
            </div>
            <div className="ml-3" style={{ lineHeight: '20px' }}>
              {row.countryName}
            </div>
          </div>
        </>
      ),
    },
    {
      name: 'Permanent Full-Time Hourly Expat',
      selector: '',
      sortable: false,
      sortName: '',
      width: '5',
      cell: (rows) => (
        <div>
          {getTypeCount(
            rows,
            'Permanent(Full-time)Expat',
            'hourlyCount'
          )}
        </div>
      ),
    },
    {
      name: 'Permanent Full-Time Hourly Local',
      selector: '',
      width: '5',
      sortable: false,
      sortName: '',
      cell: (rows) => (
        <div>
          {getTypeCount(rows, 'Permanent(Full-time)Local', 'hourlyCount')}
        </div>
      ),
    },
    {
      name: 'Permanent Full-Time Salaried Expat',
      selector: '',
      left: false,
      sortable: false,
      width: '5',
      cell: (rows) => (
        <div>
          {getTypeCount(rows, 'Permanent(Full-time)Expat', 'salariedCount')}
        </div>
      ),
    },
    {
      name: 'Permanent Full-Time Salaried Local',
      selector: '',
      left: false,
      sortable: false,
      width: '5',
      cell: (rows) => (
        <div>
          {getTypeCount(rows, 'Permanent(Full-time)Local', 'salariedCount')}
        </div>
      ),
    },
    {
      name: 'Permanent Part-Time Hourly Local',
      selector: '',
      left: false,
      sortable: false,
      width: '5',
      cell: (rows) => (
        <div>
          {getTypeCount(rows, 'Permanent(Part-time)Local', 'hourlyCount')}
        </div>
      ),
    },
    {
      name: 'Permanent Part-Time Salaried Local',
      selector: '',
      left: false,
      sortable: false,
      width: '5',
      cell: (rows) => (
        <div>
          {getTypeCount(rows, 'Permanent(Part-time)Local', 'salariedCount')}
        </div>
      ),
    },

    {
      name: 'Permanent Part-Time Hourly Expat',
      selector: '',
      left: false,
      sortable: false,
      width: '5',
      cell: (rows) => (
        <div>
          {getTypeCount(rows, 'Permanent(Part-time)Expat', 'hourlyCount')}
        </div>
      ),
    },
    {
      name: 'Permanent Part-Time Salaried Expat',
      selector: '',
      left: false,
      sortable: false,
      width: '5',
      cell: (rows) => (
        <div>
          {getTypeCount(rows, 'Permanent(Part-time)Expat', 'salariedCount')}
        </div>
      ),
    },
    {
      name: 'Temp/Intern',
      selector: '',
      left: false,
      sortable: false,
      width: '5',
      cell: (rows) => (
        <div>{getTypeCount(rows, 'Temporary/Interns', 'hourlyCount')}</div>
      ),
    },
    {
      name: 'Consultant',
      selector: '',
      left: false,
      sortable: false,
      width: '5',
      cell: (rows) => (
        <div>{getTypeCount(rows, 'Consultants', 'hourlyCount')}</div>
      ),
    },
    {
      name: 'Contractor',
      selector: '',
      left: false,
      sortable: false,
      width: '5',
      cell: (rows) => (
        <div>{getTypeCount(rows, 'Contractors', 'hourlyCount')}</div>
      ),
    },

    {
      name: '',
      selector: '',
      left: false,
      sortable: false,
      width: '2%',
      cell: (row) => {
        return (
          <div className="text-end">
            <div
              className="position-relative"
              onClick={() => handleDotClick(row?.countryId)}
            >
              <span className="btn-round">
                <img src={dotIcon} />
              </span>

              {id == row?.countryId ? (
                <div className="fav-edit-modal">
                  <Tooltip onClick={() => openModal(row)}>
                    <span>Edit Employee Info</span>
                  </Tooltip>

                  <div>
                    <Tooltip onClick={() => handleDeleteCountry(row?.id, row?.countryName)}>
                      <span>Remove from Favorites</span>
                    </Tooltip>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <SearchHeaderText breadcrumb={true} favotiteCountries={true} />
      <div className="container-fluid" data-test="favorite-countries">
        <div className="fav-container">
          <div className="col-12">
            <div className="row">
              <div className="col-8 pl-0">
                <div className="header-section fav-header">
                  <h2>
                    How many employees do you currently have in each location?
                  </h2>
                  <h4>
                    This information will help us give you compliance updates
                    and other useful insights.
                  </h4>
                </div>
              </div>
              <div className="col-4 d-flex justify-content-end align-items-center">
                <button
                  type="button"
                  className="primary-custome-btn"
                  onClick={() => {
                    history.push(
                      `${constants.ROUTE.SIDEBAR.SETTINGS.ADD_COUNTRY}`
                    );
                  }}
                >
                  Add Country
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="country-wrapper" data-test="country-wrapper">
          <div className="table-custom custom-tabe-tooltip container-fluid fav-table">
            <CustomeTable
              {...props}
              columns={CountryColumns}
              data={employeeCountList}
              pending={loading}
              pagination={false}
              noDataString={'No data found'}
              sortServer={false}
            />
          </div>
        </div>
      </div>
      <SupportButton />
      <FavouriteCountryEditModal
        isOpen={showModal}
        onCancelClickListner={handleCloseModal}
        FavouriteCountryModal={true}
        dialogClassName="doc-modal modal-top-right"
        notify={props.notify}
        rowData={rowData}
      />
    </div>
  );
};

export default FavoriteCountries;
