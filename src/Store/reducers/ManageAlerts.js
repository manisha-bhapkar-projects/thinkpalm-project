import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import fetchClient from '../../utils/axiosConfig';
import constants from '../../utils/constants';
import { notifyAction } from './notification';

export const getAlertTypeList = createAsyncThunk(
  'manageAlertReducer/getAlertTypeList',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.MANAGE_ALERTS.GET_ALERT_TYPES_LIST}`)
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
);

export const updateManageAlert = createAsyncThunk(
  'manageAlertReducer/updateManageAlert',
  async (payload = {}) => {
    if (payload.success) {
      return false;
    } else {
    let res = await fetchClient
      .post(`${constants.API.MANAGE_ALERTS.UPDATE_ALERT}`, payload.data)
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



const manageAlert = createSlice({
  name: 'manageAlertReducer',
  initialState: {
    alertTypeList: [],
    updateAlert: [],
    alertTypeListLoading: false
  },
  reducers: {},
  extraReducers: {

    [getAlertTypeList.pending] : (state, action) =>{
      state.alertTypeListLoading = true;
    },
    [getAlertTypeList.fulfilled] : (state, action) =>{
      state.alertTypeListLoading = false;
      state.alertTypeList = action?.payload?.data || [];
    },
    [updateManageAlert.fulfilled] : (state, action) =>{
      state.updateSuccess = action?.payload?.responseCode;
      state.updateAlert = action?.payload?.data || [];
    },
    
  },
});

export default manageAlert.reducer;
