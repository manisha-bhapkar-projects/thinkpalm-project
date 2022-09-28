import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';

/* Component */
import SearchHeaderText from '../../../Components/SearchHeaderText/SearchHeaderText';
import MySelect from '../../../Components/MultiselectDropDown/MySelect';
import SupportButton from '../../../Components/SupportButton';
import constants from '../../../utils/constants';

/* Icons */
import Pin_active from '../../../assets/images/Vector-active.svg';
import Pin from '../../../assets/images/Vector.svg';
import close from '../../../assets/images/search-close.svg';
import { permissionMapping } from '../../../utils/utils';

/* Action */
import {
  callAddCountryAPI,
  callgetCountryListAPI,
  callgetRegionListAPI,
  callgetSpecificRegionListAPI,
  callgetUserCountryDetails,
} from '../../../Store/reducers/favoriteCountries';

import {
  getCompanyInfo,
} from "../../../Store/reducers/superAdminUser";

import {
  callSubscriptionDataById,
} from "../../../Store/reducers/subscription";

import Checkbox from '../../../Components/Inputs/Checkbox';
import Loader from './../../../Components/Loader/index';

const formatCountryList = (countryList, mapData) => {
  const pinnedCountryList = countryList.filter((item) =>
    mapData.includes(item.id)
  );
  const unpinnedCountryList = countryList.filter(
    (item) => !mapData.includes(item.id)
  );

  pinnedCountryList.sort((a, b) =>
    a.country_Name.toLowerCase() > b.country_Name.toLowerCase() ? 1 : -1
  );
  unpinnedCountryList.sort((a, b) =>
    a.country_Name.toLowerCase() > b.country_Name.toLowerCase() ? 1 : -1
  );
  return [...pinnedCountryList, ...unpinnedCountryList];
};

const AddCountry = (props) => {
  const history = useHistory();
  const [selectedRegion, setSelectedRegion] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const [regionID, setRegionIds] = useState('');
  const [updateCountryList, setUpdateCountryList] = useState([]);
  const [companyLicenceLimit, setCompanyLicenceLimit] = useState(false);
  const [allCountrySubscription, setAllCountrySubscription] = useState(false);
  const [mapData, setMapData] = useState([]);
  const [searchCountry, setSearchCountry] = useState([]);
  const [isCheckAllCountry, setIsCheckAllCountry] = useState(false);
  const [loader, setLoading] = useState(false);
  const permissionArray = permissionMapping();

  const dispatch = useDispatch();
  const countryList = useSelector(
    (state) => state.favoriteCountriesReducer?.countryList
  );

  const { companyInfoById, companyInfoLoading } = useSelector((state) => state.superAdminUserReducer);

  const regionList = useSelector(
    (state) => state.favoriteCountriesReducer?.regionList
  );
  const specificRegionList = useSelector(
    (state) => state.favoriteCountriesReducer?.specificRegionList
  );
  const UserCountryData = useSelector(
    (state) => state.favoriteCountriesReducer?.UserCountryData
  );

  const userProfile = JSON.parse(localStorage.getItem(constants.STORAGE.AUTH.USER_PORFILE));

  const countryError = useSelector(
    (state) => state?.favoriteCountriesReducer?.countryError
  );
  const countryAdded = useSelector(
    (state) => state.favoriteCountriesReducer?.countryAdded
  );
  const loading = useSelector(
    (state) => state.favoriteCountriesReducer?.loading
  );
  const UserCountryDataLoading = useSelector(
    (state) => state.favoriteCountriesReducer?.UserCountryDataLoading
  );


  useEffect(() => {
    if (
      !permissionArray?.includes(
        constants.PERMISSION_MAPPING.FAVORITE_COUNTRIES
      )
    )
      history.push('/home');
    setLoading(true)
    dispatch(callgetCountryListAPI());
    dispatch(callgetRegionListAPI());
    dispatch(getCompanyInfo({ id: userProfile?.company?.id }))
    console.log('userProfile', userProfile)
    dispatch(callgetUserCountryDetails({ userId: userProfile?.userId }));
  }, []);

  useEffect(async () => {
    if (companyInfoById?.subscription != null && companyInfoById?.subscription?.length > 0 &&
      companyInfoById?.subscription[0].isAllCountrySubscription === false) {
      let res = await callSubscriptionDataById(companyInfoById.subscription[0].subscriptionId);
      if (res && res.data?.length > 0) {
        const _features = res.data[0].features || [];
        // '13', 'Access to data for all countries'
        // '26', 'Access to data for fixed number of countries
        const isLimited = _features.find((_f) => _f.id === 26);
        if (isLimited && isLimited?.attributes.length > 0) {
          if (isLimited?.attributes[0].isSelected) {
            if (userProfile?.isAccountOwner && Number(isLimited?.attributes[0].value) > 0) {
              setCompanyLicenceLimit(Number(isLimited?.attributes[0].value));
            } else {
              setCompanyLicenceLimit(false);
            }
          }
        }
      }
    } else {
      if (companyInfoById?.subscription != null && companyInfoById?.subscription?.length > 0 &&
        companyInfoById?.subscription[0].isAllCountrySubscription) {
        setAllCountrySubscription(true);
      }
    }
  }, [companyInfoById, companyInfoLoading]);

  useEffect(() => {
    if (countryList && countryList.length) {
      setUpdateCountryList(countryList);
      setSearchCountry(countryList);
    }
  }, [countryList]);

  useEffect(() => {
    if (regionID && regionID.length) {
      dispatch(callgetSpecificRegionListAPI({ regionID }));
    } else {
      dispatch(callgetCountryListAPI());
    }
  }, [regionID]);

  useEffect(() => {
    if (specificRegionList && specificRegionList.length) {
      const newCountryList = formatCountryList(specificRegionList, mapData);
      setUpdateCountryList(newCountryList);
      setSearchCountry(newCountryList);
    }
  }, [specificRegionList]);

  useEffect(() => {
    if (loading && UserCountryDataLoading) {
      setLoading(true)
    }

  }, [loading, UserCountryDataLoading])

  useEffect(() => {
    if (countryError && countryError.length) {
      props.notify(countryError);
    } else if (countryAdded && countryAdded === 200) {
      setLoading(false)
      props.notify('Country Added to Favorites');
      history.push(constants.ROUTE.SIDEBAR.SETTINGS.FAVORITE_COUNTRIES);
      dispatch(callAddCountryAPI({ success: true }));
    }
  }, [countryError, countryAdded]);

  useEffect(() => {
    if (UserCountryData?.length > 0 && countryList?.length > 0) {
      setLoading(false)

      const mapData = UserCountryData.filter(
        (item) => item.isUserFavourite
      ).map((item) => item.id);
      const newCountryList = formatCountryList(countryList, mapData).map(
        (item) => {
          const userCountry = UserCountryData.find(
            (country) => country.id === item.id
          );
          if (userCountry) {
            return {
              ...item,
              isCompanyFavourite: userCountry.isCompanyFavourite,
              isUserFavourite: userCountry.isUserFavourite,
            };
          }
          return { ...item, isCompanyFavourite: false, isUserFavourite: false };
        }
      );
      setUpdateCountryList(newCountryList);
      setMapData(mapData);
    }
  }, [UserCountryData, countryList]);

  const handleClick = (id) => {
    setSelectedRegion(id);
    let region_ID = [];
    if (id && id.length) {
      region_ID =
        id &&
        id.map((countryItem) => {
          return countryItem.id;
        });
    }
    setRegionIds(region_ID);
  };

  const handleSearch = (e) => {
    setSearchItem(e.target.value);
    const updateValue = searchCountry.filter((item) => {
      return (
        item.country_Name
          .toLowerCase()
          .search(e.target.value.trim().toLowerCase()) !== -1
      );
    });
    const newCountryList = formatCountryList(updateValue, mapData);
    setUpdateCountryList(newCountryList);
  };

  const handleSearchClose = () => {
    setSearchItem('');
    const updateValue = searchCountry.filter((item) => {
      return item.country_Name.toLowerCase().search('') !== -1;
    });
    const newCountryList = formatCountryList(updateValue, mapData);
    setUpdateCountryList(newCountryList);
  };

  const handleChangeMap = (id, item) => {
    // if (!userProfile?.isAccountOwner && !allCountrySubscription) {
    //   return;
    // }

    let tempData = [...mapData];
    if (tempData.includes(id)) {
      const index = tempData.indexOf(id);
      tempData.splice(index, 1);
    } else {
      tempData.push(id);
    }

    let tempData1 = [...updateCountryList];
    let index = tempData1.findIndex((item) => item.id === id);
    tempData1[index] = {
      ...tempData1[index],
      isMap: !tempData1[index].isMap,
    };

    if (companyLicenceLimit != false && companyLicenceLimit < tempData.length) {
      props.notify('Company Subscription limit reached!');
      return;
    }

    const newCountryList = formatCountryList(tempData1, tempData);
    setTimeout(() => {
      setUpdateCountryList(newCountryList);
    }, 1000);
    setMapData(tempData);
  };

  const handleCheckAllCountry = (e) => {
    let tempCountryList = [];
    if (e.target.checked) {
      tempCountryList = updateCountryList.reduce((acc, curr) => {
        if (curr.isCompanyFavourite) {
          acc.push(curr.id);
        }

        return acc;
      }, []);

      tempCountryList = Array.from(new Set([...mapData, ...tempCountryList]));
    } else {
      tempCountryList = mapData.filter(
        (data) =>
          !updateCountryList.some(
            (item) => item.isCompanyFavourite && item.id === data
          )
      );
    }

    const newCountryList = formatCountryList(
      updateCountryList,
      tempCountryList
    );
    setIsCheckAllCountry(e.target.checked);
    setMapData(tempCountryList);
    setUpdateCountryList(newCountryList);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mappedData = [];
    for (let index = 0; index < mapData.length; index++) {
      if (!mappedData.includes(mapData[index])) {
        mappedData.push(mapData[index])
      }
    }

    if (mappedData.length === 0) {
      props.notify('Company favorites are empty, So Please choose at least one country!', 3000);
      return;
    }

    if (companyLicenceLimit != false && mappedData.length !== companyLicenceLimit) {
      if (companyLicenceLimit - mappedData.length < 0) {
        props.notify(`You have ${companyLicenceLimit} Country limit, So please remove ${mappedData.length - companyLicenceLimit} countries!`, 5000);
      } else {
        props.notify(`You have ${companyLicenceLimit} Country limit, So please choose rest of ${companyLicenceLimit - mappedData.length} countries!`, 5000);
      }

      return;
    }

    setLoading(true);
    let countryId = mappedData.toString();
    let data = { userId: userProfile?.userId, countryId };
    dispatch(callAddCountryAPI({ data }));
  };

  return (
    <div data-test="add-country" className="loader-enable">
      {
        loader &&
        (<div className="custom-loader h-full-loader">
          <Loader />
        </div>)
      }
      <div>
        <SearchHeaderText
          breadcrumb={true}
          addCountry={true}
          titleHeader={true}
          pageTitle="Add Country"
          onClick={handleSubmit}
        />
      </div>
      {UserCountryDataLoading && (
        <div className="custom-loader">
          <Loader />
        </div>
      )}
      <div className="justify-content-center mt-3">
        <div className="col-12">
          <div className="header-section fav-header">
            <h2>
              Select countries your company has operations in or is interested
              in .
            </h2>
            <h4>
              You will see these countries / states on your Home Page every time
              you log in .
            </h4>
          </div>
          <div className="fav-add-container">
            <div className="row mb-4">
              <div className="col-6 pl-0">
                <div className="search-wrap">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search By Country/US state"
                    value={searchItem}
                    onChange={handleSearch}
                  />
                  <span>
                    <i className="ph-magnifying-glass" />
                  </span>
                  {searchItem ? (
                    <div
                      onClick={() => {
                        handleSearchClose();
                      }}
                    >
                      <img
                        alt=""
                        src={close}
                        height={11}
                        style={{ top: '15px' }}
                        name="search-outline"
                        className="cursor-pointer close-icon-search-knowledge"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="col-6 pr-0">
                <div className="country_dropdown">
                  <MySelect
                    data={regionList}
                    labelKey="region_Name"
                    placeholder="Find countries by region"
                    valueKey="id"
                    value={selectedRegion}
                    updateDropdown={handleClick}
                  />
                </div>
              </div>
            </div>
            {!userProfile?.isAccountOwner && (
              <div>
                <Checkbox
                  checked={isCheckAllCountry}
                  onChange={handleCheckAllCountry}
                />

                <span className="add-checkbox">
                  Add all company favorites to my favorites.
                </span>
              </div>
            )}
            <>
              {/* {loading && UserCountryDataLoading ? (
                <div className="text-center">
                  <span> Loading... </span>
                </div>
              ) : ( */}
              <div className="country-wrapper contry-page-fit col-12">
                {updateCountryList.map((item, index) => {
                  return (
                    <div className="row">
                      <div
                        className="country-list cursor-pointer"
                        onClick={() => handleChangeMap(item.id, item)}
                      >
                        <div>
                          <span>
                            <span className="country-list-active pointer">
                              {item.country_Name}
                            </span>
                          </span>
                          <div className="flag">
                            <img
                              src={`${constants.API.COUNTRY.GET_FLAG_DOWNLOAD
                                }${item.flag_Upload_Id ? item.flag_Upload_Id : ''
                                }`}
                            />
                          </div>
                        </div>
                        <div className="navigation">
                          <div>
                            {mapData.includes(item.id) ? (
                              <img src={Pin_active} />
                            ) : (
                              <img src={Pin} />
                            )}
                          </div>
                        </div>
                        <div className="fav-msg">
                          {userProfile.isAccountOwner
                            ? item.isUserFavourite && ''
                            : item.isCompanyFavourite && 'Company Favorite!'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </>
          </div>
        </div>
      </div>
      <SupportButton />
    </div>
  );
};

export default AddCountry;
