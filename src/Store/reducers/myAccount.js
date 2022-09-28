import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import fetchClient from '../../utils/axiosConfig';
import constants from '../../utils/constants';
import { notifyAction } from './notification';

export const callgetUserProfileDetailsAPI = createAsyncThunk(
  'myAccountReducer/callgetUserProfileDetailsAPI',
  async (payload = {}) => {
    if (payload.success) {
      return {};
    } else {
      let res = await fetchClient
        .get(`${constants.API.USER.GET_USER_PROFILE}${payload.id}`)
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

export const callUploadProfilePicAPI = createAsyncThunk(
  'myAccountReducer/callUploadProfilePicAPI',
  async (payload = {}) => {
    if (payload.success) {
      return false;
    } else {
      let res = await fetchClient
        .post(`${constants.API.USER.UPLOAD_PROFILE_PIC}`, payload.data)
        .then((res) => res.data)
        .catch((error) => {
          return {
            status: error?.response.status,
            data: error?.response?.data?.errors?.join(","),
            statusText: error?.response.statusText,
            error: true
          };
        });
      return res;
    }
  }
);

export const callUpdateUserProfileAPI = createAsyncThunk(
  'myAccountReducer/callUpdateUserProfileAPI',
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .put(
        `${constants.API.USER.UPDATE_USER_PROFILE}${payload.userId}`,
        payload.data
      )
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
);

export const callDeleteProfilePic = createAsyncThunk(
  'favoriteCountriesReducer/callDeleteProfilePic',
  async (payload = {}, reduxInfo) => {
    if (payload.success) {
      return false;
    } else {
      let res = await fetchClient
        .delete(`${constants.API.USER.DELETE_PROFILE_PIC}${payload.image}`)
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

export const getAccUserCounts = createAsyncThunk(
  'myAccountReducer/getAccUserCounts',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.USER.GET_ACCOUNT_USER_COUNT}`)
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


export const uploadDocument = createAsyncThunk(
  "myAccountReducer/uploadDocument",
  async (payload = {}, reduxInfo) => {
    if (payload.success) {
      return false;
    } else {
    let res = await fetchClient
      .post(`${constants.API.PURCHASE_EXPERT_BRIEFS.UPLOAD_DOCUMENT}`, payload.temp)
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
}
);
const myAccount = createSlice({
  name: 'myAccountReducer',
  initialState: {
    userDetails: {},
    imageURL: {},
    uploadFileError: false,
    accUserCount: [],
    docUploadedLoading: false,
    docUploaded:[],
    isLoading:false
  },
  reducers: {},
  extraReducers: {

    [uploadDocument.pending] : (state, action) =>{
      state.docUploadedLoading = true;
    },
    [uploadDocument.fulfilled] : (state, action) =>{
      state.docUploadedLoading = false;
      state.imageURL = {};
      state.docUploaded = action?.payload?.data || [];
    },
    [callgetUserProfileDetailsAPI.fulfilled]: (state, action) => {
      state.userDetails = action.payload?.data || [];
    },
    [callUploadProfilePicAPI.pending]: (state, action) => {
      state.isLoading = true;
      state.uploadFileError = false;
    },
    [callUploadProfilePicAPI.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.profilePicSuccess = true;
      state.uploadFileError = action.payload?.error ? action.payload : false;
      state.imageURL = action.payload?.error ? {} : (action.payload?.data || {});
    },
    [callUpdateUserProfileAPI.fulfilled]: (state, action) => {
      state.profileUpdate = action?.payload?.responseCode || undefined;
    },

    [callUpdateUserProfileAPI.rejected]: (state, action) => {
      state.profileUpdateError = action?.error?.message || undefined;
    },
    [callDeleteProfilePic.fulfilled]: (state, action) => {
      state.profilePicDeleted = action?.payload?.responseCode || undefined;
    },
    [callDeleteProfilePic.rejected]: (state, action) => {
      state.profilePicError = action?.error?.message || undefined;
    },
    [getAccUserCounts.fulfilled]: (state, action) => {
      state.accUserCount = action?.payload?.data || [];
    },
  },
});

export default myAccount.reducer;
