import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import fetchClient from '../../utils/axiosConfig';
import constants from '../../utils/constants';
import { notifyAction } from './notification';

export const callgetUserCountry = createAsyncThunk(
  'favoriteCountriesReducer/callgetUserCountry',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.COUNTRY.GET_USER_COUNTRY}${payload.userId}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const getEmployeeCountList = createAsyncThunk(
  'favoriteCountriesReducer/getEmployeeCountList',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.COUNTRY.GET_EMPLOYEE_COUNT_LIST}${payload.userId}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const getSingleCountryData = createAsyncThunk(
  'favoriteCountriesReducer/getSingleCountryData',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.COUNTRY.GET_USER_COUNTRY}${payload.userId}`, {
        params: {
          countryId: payload.country_Id,
        },
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const callgetUserCountryDetails = createAsyncThunk(
  'favoriteCountriesReducer/callgetUserCountryDetails',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HOME.GET_COUNTRY_LIST}${payload.userId}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);
export const callgetUserCountryData = createAsyncThunk(
  'favoriteCountriesReducer/callgetUserCountryData',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HOME.GET_COUNTRY_LIST}${payload.userId}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const callgetRegionListAPI = createAsyncThunk(
  'favoriteCountriesReducer/callgetRegionListAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.COUNTRY.GET_REGION_LIST}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);
export const callgetSpecificRegionListAPI = createAsyncThunk(
  'favoriteCountriesReducer/callgetSpecificRegionListAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.COUNTRY.GET_SPECIFIC_REGION_LIST}`, {
        params: { RegionId: payload.regionID.map((x) => x).join(',') },
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const callgetEmployeeType = createAsyncThunk(
  'favoriteCountriesReducer/callgetEmployeeType',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.COUNTRY.GET_EMPLOYEE_TYPE}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);
export const callgetEmployeeTypeExpert = async (data, reduxInfo) => {

  let res = fetchClient
    .get(`${constants.API.COUNTRY.GET_EMPLOYEE_TYPE}`)
    .then((res) => res.data)
    .catch((error) => {

    });

  return res ? res : false;
};

export const callgetCountryListAPI = createAsyncThunk(
  'favoriteCountriesReducer/callgetCountryListAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.COUNTRY.GET_COUNTRY_LIST}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const callgetIndustryListAPI = createAsyncThunk(
  'favoriteCountriesReducer/callgetIndustryListAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.USER.GET_INDUSTRY_LIST}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const callAddCountryAPI = createAsyncThunk(
  'favoriteCountriesReducer/callAddCountryAPI',
  async (payload = {}) => {
    if (payload.success) {
      return {};
    } else {
      let res = await fetchClient
        .put(`${constants.API.COUNTRY.ADD_COUNTRY}`, payload.data)
        .then((res) => res.data)
        .catch((error) => {
          if (error?.response?.data?.message) {
            let result = error.response.data?.message;
            if (result != '') {
              throw result;
            }
          }
        });
      return res;
    }
  }
);

export const callUpdateEmployeeCountListAPI = createAsyncThunk(
  'favoriteCountriesReducer/callUpdateEmployeeCountListAPI',
  async (payload = {}) => {
    if (payload.success) {
      return false;
    } else {
      let res = await fetchClient
        .put(`${constants.API.COUNTRY.GET_EMPLOYEE_COUNTRY}`, payload.data)
        .then((res) => res.data)
        .catch((error) => {
          if (error?.response?.data?.message) {
            let result = error.response.data?.message;
            if (result != '') {
              throw result;
            }
          }
        });
      return res;
    }
  }
);

export const callDeleteCountryAPI = createAsyncThunk(
  'favoriteCountriesReducer/callDeleteCountryAPI',
  async (payload = {}, reduxInfo) => {
    if (payload.success) {
      return false;
    } else {
      let res = await fetchClient
        .delete(`${constants.API.COUNTRY.DELETE_COUNTRY}${payload.id}`)
        .then((res) => res.data)
        .catch((error) => {
          if (error?.response?.data?.errors?.length > 0) {
            return reduxInfo.dispatch(
              notifyAction({ message: error?.response?.data?.errors[0] })
            );
          }
        });
      return res;
    }
  }
);

const favoriteCountries = createSlice({
  name: 'favoriteCountriesReducer',
  initialState: {
    userCountryList: [],
    UserCountryData: [],
    regionList: [],
    specificRegionList: [],
    employeeType: [],
    expertEmployeeType: [],
    countryList: [],
    regionListLoading: true,
    ediModeCountryList: [],
    loading: false,
    industryList: [],
    employeeCountList: [],
    singleCountryData: [],
    CountryDataPending: false,
  },
  reducers: {},
  extraReducers: {
    [callAddCountryAPI.fulfilled]: (state, action) => {
      state.countryAdded = action?.payload?.responseCode || undefined;
    },
    [callAddCountryAPI.rejected]: (state, action) => {
      state.countryError = action?.error?.message || undefined;
    },
    [callUpdateEmployeeCountListAPI.pending]: (state, action) => {
      state.countryUpdatedPending = true;
    },
    [callUpdateEmployeeCountListAPI.fulfilled]: (state, action) => {
      state.countryUpdatedPending = false;
      state.countryUpdated = action?.payload?.responseCode || [];
    },
    [callUpdateEmployeeCountListAPI.rejected]: (state, action) => {
      state.countryUpdatedError = action?.error?.message || [];
    },

    [callgetUserCountryDetails.pending]: (state, action) => {
      state.UserCountryDataLoading = true;
    },
    [callgetUserCountryDetails.fulfilled]: (state, action) => {
      state.UserCountryDataLoading = false;
      state.UserCountryData = action.payload?.data || [];
    },
    [callgetRegionListAPI.pending]: (state, action) => {
      state.regionListLoading = true;
    },
    [callgetRegionListAPI.fulfilled]: (state, action) => {
      state.regionList = action.payload?.data || [];
    },
    [callgetSpecificRegionListAPI.fulfilled]: (state, action) => {
      state.specificRegionList = action.payload?.data || [];
    },
    [callgetEmployeeTypeExpert.fulfilled]: (state, action) => {
      state.expertEmployeeType = action.payload?.data || [];
    },
    [callgetEmployeeType.fulfilled]: (state, action) => {
      state.employeeType = action.payload?.data || [];
    },

    [callgetCountryListAPI.pending]: (state, action) => {
      state.loading = true;
    },
    [callgetCountryListAPI.fulfilled]: (state, action) => {
      state.loading = false;
      state.countryList = action.payload?.data || [];
    },
    [callgetUserCountry.fulfilled]: (state, action) => {
      state.userCountryList = action.payload?.data || [];
    },
    [callDeleteCountryAPI.fulfilled]: (state, action) => {
      state.countryDeleted = action.payload?.responseCode || undefined;
    },
    [callDeleteCountryAPI.rejected]: (state, action) => {
      state.deleteError = action?.error?.message || undefined;
    },
    [callgetIndustryListAPI.fulfilled]: (state, action) => {
      state.industryList = action.payload?.data || [];
    },
    [getEmployeeCountList.pending]: (state, action) => {
      state.employeeCountListPending = true;
    },
    [getEmployeeCountList.fulfilled]: (state, action) => {
      state.employeeCountListPending = false;
      state.employeeCountList = action.payload?.data || [];
    },
    [getSingleCountryData.pending]: (state, action) => {
      state.CountryDataPending = true;
    },
    [getSingleCountryData.fulfilled]: (state, action) => {
      state.CountryDataPending = false;
      state.singleCountryData = action.payload?.data || [];
    },
  },
});

export default favoriteCountries.reducer;
