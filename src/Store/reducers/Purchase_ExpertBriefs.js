import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { Dropdown } from "react-bootstrap";
import fetchClient from "../../utils/axiosConfig";
import constants from "../../utils/constants";
import { notifyAction } from "./notification";
import axios from "axios";


export const getExpertList = createAsyncThunk(
  "purchaseExpertReducer/getExpertList",
  async (payload = {}) => {
    let params = {
      page: payload.pageNumber,
      pageSize: payload.pageSize,
      sortby: payload.sortField,
      sortbydesc: payload.sortOrder,
      isInternalView: false
    };

    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.GET_EXPERT_LIST}`, {
        params: params
      })
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);

export const updateStatusRequest = async (data, reduxInfo) => {

  let res = fetchClient
    .post(`${constants.API.PURCHASE_EXPERT_BRIEFS.UPDATE_STATUS}`, data)
    .then((res) => res.data)
    .catch((error) => {

    });

  return res ? res : false;
};

export const downloadExpertBriefs = async (id) => {
  let res = fetchClient
    .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.DOWNLOAD_EXPERT_BRIEFS}${id}`, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf',
      }
    })
    .then((res) => {
      return res
    })
    .catch((error) => {
    });

  return res ? res : false;
};
export const getStatusQuery = async (data, reduxInfo) => {

  let res = fetchClient
    .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.GET_STATUS_QUERY}${data.id}`)
    .then((res) => res.data)
    .catch((error) => {

    });

  return res ? res : false;
};
export const getQueryDetails = createAsyncThunk(
  "purchaseExpertReducer/getQueryDetails",
  async (payload = {}) => {

    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.GET_QUERY_DETAILS}${payload?.queryId}`)
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);
export const getEstimateDetails = createAsyncThunk(
  "purchaseExpertReducer/getEstimateDetails",
  async (payload = {}) => {

    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.GET_ESTIMATE_DETAILS}${payload?.queryId}/${payload?.statusId}`)
      .then((res) => res?.data)
      .catch();
    return res;
  }
);
export const getHoursDetails = createAsyncThunk(
  "purchaseExpertReducer/getHoursDetails",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.GET_QUERY_SUMNMERY}`)
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);
export const getRemainingHours = createAsyncThunk(
  "purchaseExpertReducer/getRemainingHours",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.GET_EXPERT_HOURS}`)
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);



export const getPurchaseList = createAsyncThunk(
  "purchaseExpertReducer/getPurchaseList",
  async (payload = {}) => {
    let params = {
      page: payload.pageNumber,
      pageSize: payload.pageSize,
      sortby: payload.sortField,
      sortbydesc: payload.sortOrder
    };

    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.GET_PURCHASE_LIST}`, {
        params: params
      })
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);
export const getManageBriefsList = createAsyncThunk(
  "purchaseExpertReducer/getManageBriefsList",
  async (payload = {}) => {
    let params = {
      page: payload.pageNumber ? payload.pageNumber : null,
      pageSize: payload.pageSize ? payload.pageSize : null,
      sortby: payload.sortField ? payload.sortField : null,
      sortbydesc: payload.sortOrder ? payload.sortOrder : null,
      searchtext: payload.searchText,
      isInternalView: true,
      statusids: payload.statusIds ? payload.statusIds : null,
      assigneeIds: payload.assigneeIds ? payload.assigneeIds : null,
      StartDate: payload.StartDate ? payload.StartDate : null,
      EndDate: payload.EndDate ? payload.EndDate : null,
    };

    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.GET_MANAGE_BRIEFS_LIST}`, {
        params: params
      })
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);
export const addTimetrackerDetails = createAsyncThunk(
  "purchaseExpertReducer/addTimetrackerDetails",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .post(`${constants.API.PURCHASE_EXPERT_BRIEFS.SAVE_TIME_TRACKER_DETAILS}`, payload)
      .then((res) => res?.data)
      .catch((error) => {
        if (error?.response?.data?.message?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({ message: error?.response?.data?.message })
          );
        }
      });
    return res;
  }
);

export const updateTimetrackerDetails = createAsyncThunk(
  "purchaseExpertReducer/updateTimetrackerDetails",
  async (payload, reduxInfo) => {
    let res = await fetchClient
      .put(`${constants.API.PURCHASE_EXPERT_BRIEFS.SAVE_TIME_TRACKER_DETAILS}/${payload.id}`, payload)
      .then((res) => res?.data)
      .catch((error) => {
        if (error?.response?.data?.message?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({ message: error?.response?.data?.message })
          );
        }
      });
    return res;
  }
);

export const viewQueryDetails = createAsyncThunk(
  "purchaseExpertReducer/viewQueryDetails",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.VIEW_QUERY_DETAILS}${payload.id}`,)
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);

export const getManageQueryDetails = createAsyncThunk(
  "purchaseExpertReducer/getManageQueryDetails",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.GET_MANAGE_QUERY_DETAILS}${payload.id}`,)
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);

export const uploadDocument = createAsyncThunk(
  "purchaseExpertReducer/uploadDocument",
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.PURCHASE_EXPERT_BRIEFS.UPLOAD_DOCUMENT}`, payload.temp)
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);

export const deleteUploadedDocument = async (id) => {
  let res = await fetchClient
    .delete(`${constants.API.PURCHASE_EXPERT_BRIEFS.DELETE_DOCUMENT}${id}`)
    .then((res) => res?.data)
    .catch((error) => {
      return {
        status: error?.response.status,
        data: error?.response?.data?.errors?.join(","),
        statusText: error?.response.statusText,
        error: true
      };
    });

  return res;
};

export const getExpertEmailList = createAsyncThunk(
  "purchaseExpertReducer/getExpertEmailList",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.GET_EXPERT_EMAIL_LIST}`)
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);

export const assignToExpert = createAsyncThunk(
  "purchaseExpertReducer/assignToExpert",
  async (payload = {}, reduxInfo) => {
    if (payload.success) {
      return false;
    }
    else{
      let res = await fetchClient
        .put(`${constants.API.PURCHASE_EXPERT_BRIEFS.ASSIGN_TO_EXPERT}${payload.id}/emailid/${payload.emailId}`)
        .then((res) => res?.data)
        .catch(console.error);
      return res;
    }
  }
);

export const postNoteForInternalView = createAsyncThunk(
  "purchaseExpertReducer/postNoteForInternalView",
  async (payload = {}, reduxInfo) => {
    if (payload.success) {
      return false;
    } else {
      let res = await fetchClient
        .post(`${constants.API.PURCHASE_EXPERT_BRIEFS.NOTE_FOR_INTERNAL_VIEW}`, payload.data)
        .then((res) => res?.data)
        .catch((error) => {
          if (error?.response?.data?.message?.length > 0) {
            return reduxInfo.dispatch(
              notifyAction({ message: error?.response?.data?.message })
            );
          }
        });
      return res;
    }
  }
);

export const addEstimation = createAsyncThunk(
  "purchaseExpertReducer/addEstimation",
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.PURCHASE_EXPERT_BRIEFS.ADD_ESTIMATION}`, payload.temp)
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);
export const updateEstimation = createAsyncThunk(
  "purchaseExpertReducer/updateEstimation",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .post(`${constants.API.PURCHASE_EXPERT_BRIEFS.UPDATE_ESTIMATE}`, payload.temp)
      .then((res) => res?.data)
      .catch((error) => {
        if (error?.response?.data?.message?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({ message: error?.response?.data?.message })
          );
        }
      });
    return res;
  }
);
export const getQueryStatusList = createAsyncThunk(
  "purchaseExpertReducer/getQueryStatusList",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.GET_QUERY_STATUS}`)
      .then((res) => res?.data)
      .catch(console.error);
    return res;
  }
);

export const downloadFileAPI = createAsyncThunk(
  "purchaseExpertReducer/downloadFileAPI",
  async () => {
    let res = await fetchClient
      .post(`${constants.API.PURCHASE_EXPERT_BRIEFS.DOWNLOAD_MANAGE_BRIEFS_FILE}?isinternalview=true`, {
        responseType: 'blob',
      })
      .then((res) => res)
      .catch(console.error);
    return res;
  }
);

export const downloadSingleFile = createAsyncThunk(
  "purchaseExpertReducer/downloadSingleFile",
  async (id) => {
    let res = await fetchClient
      .get(`${constants.API.PURCHASE_EXPERT_BRIEFS.DOWNLOAD_SINGLE_FILE}${id}`, {
        responseType: 'blob',
      })
      .then((res) => res)
      .catch(console.error);
    return res;
  }
);




export const getAccountList = createAsyncThunk(
  'purchaseExpertReducer/getAccountList',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.MANAGE_ALERTS.GET_ACCOUNT_LIST}`,{
        params:{
          skipPagination: true
        }
      })
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

export const getUserList = createAsyncThunk(
  'purchaseExpertReducer/getUserList',
  async (id) => {
    let res = await fetchClient
      .get(`${constants.API.MANAGE_ALERTS.GET_USER_LIST}${id}`,{
        params:{
          skipPagination: true
        }
      })
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

export const addQuery = createAsyncThunk(
  'purchaseExpertReducer/addQuery',
  async (payload = {}, reduxInfo) => {
    if(payload.Success){
      return false;
    }else{
      let res = await fetchClient
        .post(`${constants.API.MANAGE_ALERTS.ADD_QUERY}`,payload.data)
        .then((res) => res.data)
        .catch((error) => {
        });
      return res;
    }
  }
);
const purchaseExpertBriefs = createSlice({
  name: "purchaseExpertReducer",
  initialState: {
    expertList: [],
    expertListLoading: false,
    purchaseList: [],
    purchasetListLoading: false,
    manageBriefList: [],
    viewQueryData: [],
    manageQueryData: {},
    manageQueryDataLoading: false,
    docUploaded: [],
    expertEmailList: [],
    hoursDetails: [],
    estimateDetails: [],
    queryDetails: [],
    addEstimationError: false,
    addEstimationdata: [],
    assignExpertPending: false,
    updateEstimationError: false,
    addTimeTrackerLoading: false,
    statusList: [],
    downloadFileLoading: false,
    accountList: [],
    userList: [],
    addQuery: [],
    addQuerySuccess: '',
    accountLoading: false,
    userListLoading: false
  },
  reducers: {},
  extraReducers: {
    [getExpertList.pending]: (state, action) => {
      state.expertList = [];
      state.expertListLoading = true
    },
    [getExpertList.fulfilled]: (state, action) => {
      state.expertList = action?.payload?.data || [];
      state.expertListLoading = false
    },
    [getHoursDetails.fulfilled]: (state, action) => {
      state.hoursDetails = action?.payload?.data || [];

    },
    [getEstimateDetails.pending]: (state, action) => {
      state.estimateDetails = [];

    },
    [getEstimateDetails.fulfilled]: (state, action) => {
      state.estimateDetails = action?.payload?.data || [];

    },
    [getQueryDetails.pending]: (state, action) => {
      state.queryDetails = [];
    },

    [getQueryDetails.fulfilled]: (state, action) => {
      state.queryDetails = action?.payload?.data || [];
    },

    [getPurchaseList.pending]: (state, action) => {
      state.purchasetListLoading = true
    },
    [getPurchaseList.fulfilled]: (state, action) => {
      state.purchaseList = action?.payload?.data || [];
      state.purchasetListLoading = false
    },
    [getManageBriefsList.pending]: (state, action) => {
      state.manageBriefListLoading = true
    },
    [getManageBriefsList.fulfilled]: (state, action) => {
      state.manageBriefListLoading = false;
      state.userList = [];
      state.manageBriefList = action?.payload?.data || [];
    },
    [addTimetrackerDetails.pending]: (state, action) => {
      state.addTimeTrackerLoading = true;
    },
    [addTimetrackerDetails.rejected]: (state, action) => {
      state.addTimeTrackerLoading = true;
    },
    [addTimetrackerDetails.fulfilled]: (state, action) => {
      state.addTimeTrackerLoading = false;
      state.timeTrackerData = action?.payload?.data || [];
    },
    [viewQueryDetails.fulfilled]: (state, action) => {
      state.viewQueryData = action?.payload?.data || [];
    },
    [getManageQueryDetails.pending]: (state, action) => {
      state.manageQueryDataLoading = true;
      state.manageQueryData = {};
    },
    [getManageQueryDetails.fulfilled]: (state, action) => {
      state.manageQueryDataLoading = false;
      state.manageQueryData = action?.payload?.data || {};
    },
    [uploadDocument.fulfilled]: (state, action) => {
      state.docUploaded = action?.payload?.data || [];
    },
    [updateTimetrackerDetails.fulfilled]: (state, action) => {
      state.updateTimetracker = action?.payload?.data || [];
    },
    [updateTimetrackerDetails.pending]: (state, action) => {
      state.addTimeTrackerLoading = true;
    },
    [updateTimetrackerDetails.rejected]: (state, action) => {
      state.addTimeTrackerLoading = true;
    },
    [updateTimetrackerDetails.fulfilled]: (state, action) => {
      state.addTimeTrackerLoading = false;
      state.timeTrackerData = action?.payload?.data || [];
    },
    [getExpertEmailList.fulfilled]: (state, action) => {
      state.expertEmailList = action?.payload?.data || [];
    },
    [assignToExpert.pending]: (state, action) => {
      state.assignExpertPending = true;
    },
    [assignToExpert.fulfilled]: (state, action) => {
      state.assignExpertPending = false;
      state.emailAssigned = action?.payload?.responseCode;
      state.assignedExpert = action?.payload?.data || [];
    },
    [postNoteForInternalView.fulfilled]: (state, action) => {
      state.internalNote = action?.payload?.data || [];
    },
    [updateEstimation.rejected]: (state, action) => {
      state.updateEstimationError = true;
    },
    [updateEstimation.fulfilled]: (state, action) => {
      state.updateEstimationError = false;
      state.updateEstimationdata = action?.payload?.data || [];
    },
    [addEstimation.rejected]: (state, action) => {
      state.addEstimationError = true;
    },
    [addEstimation.fulfilled]: (state, action) => {
      state.addEstimationError = false;
      state.addEstimationdata = action?.payload?.data || [];
    },
    [getQueryStatusList.fulfilled]: (state, action) => {
      state.statusList = action?.payload?.data || [];
    },
    [downloadFileAPI.pending]: (state, action) => {
      state.downloadFileLoading = true;
    },
    [downloadFileAPI.fulfilled]: (state, action) => {
      state.downloadFileLoading = false;
      state.downloadFileResult = action?.payload?.data;
    },
    [downloadSingleFile.fulfilled]: (state, action) => {
      state.downloadSingleFileResult = action?.payload?.data;
    },
    [getRemainingHours.pending]: (state, action) => {
      state.remainingHoursLoading = true;
    },
    [getRemainingHours.fulfilled]: (state, action) => {
      state.balanceHours = action?.payload?.data;
      state.remainingHoursLoading = false;
    },
    [getRemainingHours.rejected]: (state, action) => {
      state.remainingHoursLoading = false
    },
    [getAccountList.pending] : (state, action) =>{
      state.accountLoading = true;
    },
    [getAccountList.fulfilled] : (state, action) =>{
      state.accountLoading = false;
      state.accountList = action?.payload?.data?.data || [];
    },
    [getUserList.pending] : (state, action) =>{
      state.userListLoading = true;
    },
    [getUserList.fulfilled] : (state, action) =>{
      state.userListLoading = false;
      state.userList = action?.payload?.data?.data || [];
    },
    [addQuery.fulfilled] : (state, action) =>{
      state.addQuerySuccess = action?.payload?.responseCode;
      state.addQuery = action?.payload?.data?.data || [];
    },

  },
});

export default purchaseExpertBriefs.reducer;



