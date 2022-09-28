import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchClient from '../../utils/axiosConfig';
import constants from '../../utils/constants';
import { notifyAction } from './notification';


export const getAllAlerts = async ({ pageNumber, pagesize, skipPagination }) => {
  // page=2&pageSize=10&skipPagination=true&Type=ALL
  let res = await fetchClient
    .get(`${constants.API.ALERTS.GET_ALL_ALERTS}`, {
      params: {
        page: pageNumber,
        pageSize: pagesize,
        skipPagination: skipPagination || false,
        Type: 'ALL'
      }
    })
    .then((res) => res?.data)
    .catch((error) => {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.errors?.join(","),
        statusText: error?.response?.data?.message,
        error: true
      };
    });

  return res;
};

export const markAsRead = async ({ id, status }) => {
  let res = await fetchClient
    .put(constants.API.ALERTS.GET_MARK_AS_READ + id + '/read/' + status)
    .then((res) => res?.data)
    .catch((error) => {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.errors?.join(","),
        statusText: error?.response?.data?.message,
        error: true
      };
    });

  return res;
};

export const deleteAlertItem = async ({ id, status }) => {
  let res = await fetchClient
    .delete(`${constants.API.ALERTS.DELETE_ALERTS + id + '?delete=' + status}`)
    .then((res) => res?.data)
    .catch((error) => {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.errors?.join(","),
        statusText: error?.response?.data?.message,
        error: true
      };
    });

  return res;
};

export const getCountryAlerts = async ({ pageNumber, countryId, pagesize, skipPagination }) => {
  // page=2&pageSize=10&skipPagination=true&Type=ALL
  let res = await fetchClient
    .get(`${constants.API.ALERTS.GET_COUNTRIES_ALERTS}`, {
      params: {
        page: pageNumber,
        pageSize: pagesize,
        skipPagination: skipPagination || false,
        countryId: !!countryId ? countryId : undefined,
        Type: 'MyCountries'
      }
    })
    .then((res) => res?.data)
    .catch((error) => {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.countryId?.join(","),
        statusText: error?.response?.data?.message,
        error: true
      };
    });

  return res;
};
export const getGeneralAlerts = async ({ pageNumber, pagesize, skipPagination }) => {
  // page=2&pageSize=10&skipPagination=true&Type=ALL
  let res = await fetchClient
    .get(`${constants.API.ALERTS.GET_ALL_ALERTS}`, {
      params: {
        page: pageNumber,
        pageSize: pagesize,
        skipPagination: skipPagination || false,
        Type: 'General'
      }
    })
    .then((res) => res?.data)
    .catch((error) => {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.errors?.join(","),
        statusText: error?.response?.data?.message,
        error: true
      };
    });

  return res;
};

export const getUnReadAlerts = async ({ pageNumber, pagesize, skipPagination }) => {
  // page=2&pageSize=10&skipPagination=true&Type=ALL
  let res = await fetchClient
    .get(`${constants.API.ALERTS.GET_ALL_ALERTS}`, {
      params: {
        page: pageNumber,
        pageSize: pagesize,
        skipPagination: skipPagination || false,
        Type: 'Unread'
      }
    })
    .then((res) => res?.data)
    .catch((error) => {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.errors?.join(","),
        statusText: error?.response?.data?.message,
        error: true
      };
    });

  return res;
};
const alerts = createSlice({
  name: 'alertsReducer',
  initialState: {

    countryAlertsListLoading: false,
    countryAlertsList: [],

  },
  reducers: {},
  extraReducers: {},
});

export default alerts.reducer;
