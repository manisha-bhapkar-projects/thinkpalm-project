import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CustomeNotification } from "../../Components/CustomeNotification/CustomeNotification";
import fetchClient from "../../utils/axiosConfig";
import constants from "../../utils/constants";

export const callAddSuperAdminUser = createAsyncThunk(
  "superAdminUserReducer/callAddSuperAdminUser",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .post(
        `${constants.API.SUPER_ADMIN_USER.ADD_SUPER_ADMIN}`,
        payload.initialValues
      )
      .then((res) => {
        payload.notify("User Added Successfully");
        if (payload.backToAccounts) {
          payload.history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Accounts');
        } else {
          payload.history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Users');
        }
        return res.data;
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          const m = error.response.data.errors;
          const message = m.join(",");
          payload.notify(message, 5000);
        }
      });
    return res;
  }
);

export const addSuperAdminUser = async (payload) => {
  let res = await fetchClient
    .post(
      `${constants.API.SUPER_ADMIN_USER.ADD_SUPER_ADMIN}`,
      payload.initialValues
    )
    .then((res) => res.data)
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

export const getUserInfo = async (id) => {
  let res = await fetchClient
    .get(
      `${constants.API.SUPER_ADMIN_USER.GET_USER_INFO + id}`)
    .then((res) => res.data)
    .catch((error) => {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.errors?.join(","),
        statusText: error?.response?.data?.message,
        error: true
      };
    });
  return res;
}

export const addEditUserInfo = async ({ id, initialValues }) => {
  let res = undefined;
  if (id) {
    res = await fetchClient
      .put(constants.API.SUPER_ADMIN_USER.ADD_EDIT_USER_INFO + id, { ...initialValues })
      .then((res) => res.data)
      .catch((error) => {
        return {
          status: error?.response?.status,
          data: error?.response?.data?.errors?.join(","),
          statusText: error?.response?.data?.message,
          error: true
        };
      });
  } else {
    res = await fetchClient
      .post(constants.API.SUPER_ADMIN_USER.ADD_EDIT_USER_INFO, { ...initialValues })
      .then((res) => res.data)
      .catch((error) => {
        return {
          status: error?.response?.status,
          data: error?.response?.data?.errors?.join(","),
          statusText: error?.response?.data?.message,
          error: true
        };
      });
  }

  return res;
}

export const deleteAccountUsers = async (id) => {
  let res = await fetchClient
    .delete(constants.API.SUPER_ADMIN_USER.ADD_EDIT_USER_INFO + id)
    .then((res) => res.data)
    .catch((error) => {
      return {
        status: error?.response?.status,
        data: error?.response?.data?.errors?.join(","),
        statusText: error?.response?.data?.message,
        error: true
      };
    });

  return res;
}

export const callgetAdministratorRole = createAsyncThunk(
  "superAdminUserReducer/callgetAdministratorRole",
  async () => {
    let res = await fetchClient
      .get(`${constants.API.SUPER_ADMIN_USER.GET_ADMINISTRATOR_ROLE}`)
      .then((res) => {
        return {
          data: {
            data: res?.data?.data || []
          }
        }
      })
      .catch(console.error);
    return res;
  }
);

export const callgetCompanyList = createAsyncThunk(
  "superAdminUserReducer/callgetCompanyList",
  async () => {
    let res = await fetchClient
      .get(`${constants.API.USER.GET_COMPANY_LIST}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const getCompanyInfo = createAsyncThunk(
  "superAdminUserReducer/getCompanyInfo",
  async ({ id }) => {
    let res = await fetchClient
      .get(`${constants.API.USER_ACCOUNTS.GET_ACCOUNT_INFO_BY_ID + id}`)
      .then((res) => res.data)
      .catch((error) => {
        return {
          status: error?.response.status,
          errorMessage: error?.response?.data?.errors || [],
          statusText: error?.response.statusText,
          error: true
        };
      });
    return res;
  }
);

export const getAllSubscriptions = createAsyncThunk(
  "superAdminUserReducer/getAllSubscriptions",
  async () => {
    let res = await fetchClient
      .get(`${constants.API.SUBSCRIPTION.GET_ALL_LIST}`, {})
      .then((res) => res.data)
      .catch(console.error);
    return res ? res : { data: [] };
  }
);

export const callgetUserList = createAsyncThunk(
  "superAdminUserReducer/callgetUserList",
  async (payload = {}) => {
    let params = {
      page: payload.pageNumber,
      pageSize: payload.pageSize,
      sortby: "updateddate",
      sortbydesc: true
    };
    if (payload.roles && payload.roles != "" && payload.roles != null) {
      params.roleId = payload.roles.join(",");
    }
    if (payload.sortField && payload.sortField != "" && payload.sortField != null) {
      params.sortby = payload.sortField;
    }
    if (payload.sortOrder !== "" && payload.sortOrder !== null) {
      params.sortbydesc = payload.sortOrder; // sortByDesc
    }
    if (payload.searchText && payload.searchText !== "" && payload.searchText != null) {
      params.searchText = payload.searchText;
    }
    if (payload.showUsersStatusBy && payload.showUsersStatusBy.length > 0) {
      if (payload.showUsersStatusBy.includes("deactivated")) {
        params.showOnlyInactive = true;
      } else if (payload.showUsersStatusBy.includes("activated")) {
        params.showOnlyActive = true;
      } else {
        params.showOnlyClientUsers = true;
      }
    }

    let res = await fetchClient
      .get(`${constants.API.SUPER_ADMIN_USER.GET_USER_LIST}`, {
        params: { ...params },
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const callgetAllUserList = createAsyncThunk(
  "superAdminUserReducer/callgetAllUserList",
  async (payload = {}) => {
    let params = {
      skipPagination: payload.skipPagination,
      sortby: payload.sortby,
      sortbydesc: payload.sortbydesc,
      roleId: payload.roles
    }
    if (payload.roles && payload.roles != "" && payload.roles != null) {
      params.roleId = payload.roles.join(",");
    }
    let res = await fetchClient
      .get(`${constants.API.SUPER_ADMIN_USER.GET_USER_LIST}`, {
        params: params

      })
      .then((res) => {
        return res.data
      })
      .catch(console.error);
    return res;
  }
);

export const callUpdateSuperAdminUser = createAsyncThunk(
  "superAdminUserReducer/callUpdateSuperAdminUser",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .put(
        `${constants.API.SUPER_ADMIN_USER.UPDATE_SUPER_ADMIN}${payload.id}`,
        payload.request
      )
      .then((res) => {
        payload.notify("User Updated Successfully");
        if (payload.history) {
          payload.history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Users');
        }
        return res.data;
      })
      .catch((error) => {
        if (error?.response?.data?.message) {
          const m = error.response.data.errors;
          const message = m.join(",");
          payload.notify(message, 5000);
        }
      });
    return res;
  }
);

export const callgetSpecificUserDetails = createAsyncThunk(
  "superAdminUserReducer/callgetSpecificUserDetails",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.SUPER_ADMIN_USER.UPDATE_SUPER_ADMIN}${payload.id}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const callsendEmailToActiateUser = createAsyncThunk(
  "superAdminUserReducer/callsendEmailToActiateUser",
  async (payload = {}) => {
    let res = await fetchClient
      .put(`${constants.API.SUPER_ADMIN_USER.SEND_EMAIL_TO_CHANGE_STATUS}${payload.Id}`,)
      .then((res) => res)
      .catch(console.error);
    return res;
  }
);

export const callChangeUserStatusAPI = createAsyncThunk(
  "superAdminUserReducer/callChangeUserStatusAPI",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .put(`${constants.API.SUPER_ADMIN_USER.CHANGE_USER_STATUS}${payload.id}?active=${payload.statusFlag}`)
      .then((res) => {
        if (payload.userLIstRequestObject) {
          payload.notify(`User ${payload.statusFlag ? 'Activated' : 'Deactivated'} Successfully`);
          reduxInfo.dispatch(callgetUserList(payload.userLIstRequestObject));
        } else {
          payload.history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Users');
        }
        return res.data;
      })
      .catch((err) => {
        console.log('err', err)
      });
    return res;
  }
);

export const activate_deactivateUser = async (payload) => {
  let res = await fetchClient
    .put(`${constants.API.SUPER_ADMIN_USER.CHANGE_USER_STATUS}${payload.id}?active=${payload.statusFlag}`)
    .then((res) => {
      if (payload.userLIstRequestObject) {
        payload.notify(`User ${payload.statusFlag ? 'Activated' : 'Deactivated'} Successfully`);
      } else {
        payload.history.push(constants.ROUTE.SIDEBAR.SETTINGS.USERLIST + '/Users');
      }
      return res.data;
    })
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

export const updateUserStatus = async ({ id, statusFlag }) => {
  let res = await fetchClient.put(
    `${constants.API.SUPER_ADMIN_USER.CHANGE_USER_STATUS}${id}?active=${statusFlag}`
  ).then((res) => res.data)
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

export const sendEmailToActivateUser = async (id) => {
  let res = await fetchClient.put(
    `${constants.API.SUPER_ADMIN_USER.SEND_EMAIL_TO_CHANGE_STATUS}${id}`
  ).then((res) => res.data)
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

// Account API section
export const getAllAccounts = createAsyncThunk(
  "superAdminUserReducer/getAllAccounts",
  async (payload = {}, reduxInfo) => {

    let params = {
      page: payload.pageNumber,
      pageSize: payload.pageSize
    };

    if (payload.sortField && payload.sortField != "" && payload.sortField != null) {
      params.sortby = payload.sortField;
    }

    if (payload.sortOrder !== "" && payload.sortOrder != null) {
      params.sortByDesc = payload.sortOrder;
    }
    if (payload.searchText && payload.searchText !== "" && payload.searchText != null) {
      params.searchText = payload.searchText;
    }

    if (payload.showUsersStatusBy != null && payload.showUsersStatusBy.length > 0) {
      if (payload.showUsersStatusBy.includes("deactivated")) {
        params.showOnlyInactive = "true";
      } else {
        params.showOnlyActive = "true";
      }
    }

    if (payload.subscriptions != null && payload.subscriptions.length > 0) {
      params.subscriptionId = payload.subscriptions.join(',');
    }

    let res = await fetchClient
      .get(`${constants.API.USER_ACCOUNTS.GET_ACCOUNT_LIST}`, {
        params: { ...params },
      })
      .then((res) => {
        return {
          data: res?.data?.data?.data || [],
          totalCount: res?.data?.data?.totalCount,
          pageSize: res?.data?.data?.pageSize
        };
      })
      .catch((error) => {
        console.error('getAllAccounts', error?.response);
        return {
          data: [],
          totalCount: 0
        };
      });
    return res;
  }
);

export const getAllAccountsForDownload = createAsyncThunk(
  "superAdminUserReducer/getAllAccountsForDownload",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .get(`${constants.API.USER_ACCOUNTS.GET_ACCOUNT_LIST}`, {
        params: {
          skipPagination: true,
          sortby: payload.sortby,
          sortbydesc: payload.sortbydesc
        },
      })
      .then((res) => {
        return {
          data: res?.data?.data || [],
          totalCount: res?.data?.totalCount
        };
      })
      .catch((error) => {
        console.error('getAllAccounts', error?.response);
        return {
          data: [],
          totalCount: 0
        };
      });
    return res;
  }
);

export const getAccountInfoById = createAsyncThunk(
  "superAdminUserReducer/getAccountInfoById",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .get(`${constants.API.USER_ACCOUNTS.GET_ACCOUNT_INFO_BY_ID}${payload.id}`, {
        params: {
          skipPagination: payload.skipPagination,
          sortby: payload.sortby,
          sortbydesc: payload.sortbydesc
        },
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);


export const getIndustryList = createAsyncThunk(
  "superAdminUserReducer/getIndustryList",
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .get(`${constants.API.USER_ACCOUNTS.GET_INDUSTRY_LIST}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const addNewAccount = async (payload) => {
  let res = await fetchClient
    .post(`${constants.API.USER_ACCOUNTS.ADD_ACCOUNT}`, { ...payload })
    .then((res) => res.data)
    .catch((error) => {
      return {
        status: error?.response.status,
        errorMessage: error?.response?.data?.errors || [],
        statusText: error?.response.statusText,
        error: true
      };
    });

  return res;
};

export const updateAccountInfo = async (payload, id) => {
  let res = await fetchClient
    .put(`${constants.API.USER_ACCOUNTS.UPDATE_ACCOUNT}${id}`, { ...payload })
    .then((res) => res.data)
    .catch((error) => {
      return {
        status: error?.response.status,
        errorMessage: error?.response?.data?.errors || [],
        statusText: error?.response.statusText,
        error: true
      };
    });

  return res;
};

export const updateAccountStatus = async (id, status) => {
  let res = await fetchClient
    .put(`${constants.API.USER_ACCOUNTS.UPDATE_ACCOUNT_STATUS.replace('{id}', id)}${status}`)
    .then((res) => res.data)
    .catch((error) => {
      return {
        status: error?.response.status,
        errorMessage: error?.response?.data?.errors || [],
        statusText: error?.response.statusText,
        error: true
      };
    });

  return res;
};

export const getAllCountryList = createAsyncThunk(
  "country/getAllCountryList",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.COUNTRY.GET_COUNTRY_LIST}`)
      .then((res) => res.data)
      .catch(console.error); // implement a common error handler
    return res;
  }
);

export const getAccountUsers = createAsyncThunk(
  "superAdminUserReducer/getAccountUsers",
  async (payload = {}) => {
    let params = {
      page: payload.pageNumber,
      pageSize: payload.pageSize,
      sortby: "updateddate",
      sortbydesc: true
    };

    if (payload.sortField && payload.sortField != "" && payload.sortField != null) {
      params.sortby = payload.sortField;
    }

    if (payload.sortOrder !== "" && payload.sortOrder !== null) {
      params.sortbydesc = payload.sortOrder;
    }

    let res = await fetchClient
      .get(`${constants.API.SUPER_ADMIN_USER.GET_ACCOUNT_USER_LIST_BY_COMPANY + payload.company}`, {
        params: { ...params },
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const getAccountAllUsers = createAsyncThunk(
  "superAdminUserReducer/getAccountAllUsers",
  async (payload = {}) => {
    let params = {
      skipPagination: payload.skipPagination,
      sortby: payload.sortby,
      sortbydesc: payload.sortbydesc
    }

    let res = await fetchClient
      .get(`${constants.API.SUPER_ADMIN_USER.GET_ACCOUNT_USER_LIST_BY_COMPANY + payload.company}`, {
        params: params
      }).then((res) => {
        return res.data
      })
      .catch(console.error);
    return res;
  }
);


const superAdminUser = createSlice({
  name: "superAdminUserReducer",
  initialState: {
    userList: [],
    companyList: [],
    companyListLoading: false,
    userListAll: [],
    administratorRole: [],
    accountUsersList: [],
    accountUsersListLoading: false,
    accountAllUsersList: [],
    accountAllUsersListLoading: false,
    userDetails: {},
    emailStatus: "",
    updateUser: false,
    userAllListLoading: false,
    accountsList: {},
    accountsListLoading: false,
    accountInfoLoading: false,
    accountInfo: {},
    allAccountList: [],
    allAccountListLoading: false,
    industryList: [],
    subscriptionList: [],
    allCountryList: [],
    companyInfoById: {},
    companyInfoLoading: false || {},
  },
  reducers: {},
  extraReducers: {
    [callgetUserList.pending]: (state, action) => {
      state.userListLoading = true;
    },
    [callgetUserList.fulfilled]: (state, action) => {
      state.userListLoading = false;
      state.userList = action.payload?.data || [];
    },
    [callgetAllUserList.fulfilled]: (state, action) => {
      state.userAllListLoading = false;
      state.userListAll = action.payload?.data || [];
    },
    [callgetAllUserList.pending]: (state, action) => {
      state.userAllListLoading = true;
      state.allAccountListLoading = true

    },
    [callgetAdministratorRole.fulfilled]: (state, action) => {
      state.administratorRole = action.payload?.data?.data || [];
    },
    [callgetCompanyList.pending]: (state, action) => {
      state.companyListLoading = true;
      state.companyList = [];
    },
    [callgetCompanyList.fulfilled]: (state, action) => {
      state.companyListLoading = false;
      state.companyList = action.payload?.data?.data || [];
    },
    [getAllSubscriptions.fulfilled]: (state, action) => {
      state.subscriptionList = action.payload?.data || [];
    },
    [callgetSpecificUserDetails.fulfilled]: (state, action) => {
      state.updateUser = false;
      state.userDetails = action.payload?.data || [];
    },
    [callAddSuperAdminUser.fulfilled]: (state, action) => {
      state.addUser = action.payload || [];
    },
    [callsendEmailToActiateUser.fulfilled]: (state, action) => {
      state.emailStatus = action.payload?.data || [];
    },
    [callUpdateSuperAdminUser.pending]: (state, action) => {
      state.updateUser = false;
    },
    [callUpdateSuperAdminUser.fulfilled]: (state, action) => {
      state.updateUser = action.payload?.data || [];
    },

    [getAllAccounts.pending]: (state, action) => {
      state.accountsList = {};
      state.accountsListLoading = true;
    },
    [getAllAccounts.fulfilled]: (state, action) => {
      state.accountsList = action.payload || {};
      state.accountsListLoading = false;
    },
    [getAccountInfoById.pending]: (state, action) => {
      state.accountInfoLoading = true;
      state.accountInfo = {};
    },
    [getAccountInfoById.fulfilled]: (state, action) => {
      state.accountInfoLoading = false;
      state.accountInfo = action.payload?.data || {};
    },
    [getAllAccountsForDownload.fulfilled]: (state, action) => {
      state.allAccountList = action.payload.data || [];
      state.allAccountListLoading = false


    },
    [getAllAccountsForDownload.pending]: (state, action) => {
      state.allAccountListLoading = true

    },
    [getIndustryList.fulfilled]: (state, action) => {
      state.industryList = action.payload?.data || [];
    },
    [getAllCountryList.fulfilled]: (state, action) => {
      state.allCountryList = action.payload?.data || [];
    },
    [getCompanyInfo.pending]: (state, action) => {
      state.companyInfoById = {};
      state.companyInfoLoading = true;
    },
    [getCompanyInfo.fulfilled]: (state, action) => {
      state.companyInfoById = action.payload?.data || {};
      state.companyInfoLoading = action.payload?.error ? action.payload : false;
    },

    [getAccountUsers.pending]: (state, action) => {
      state.accountUsersList = [];
      state.accountUsersListLoading = true;
    },
    [getAccountUsers.fulfilled]: (state, action) => {
      state.accountUsersList = action.payload?.data || [];
      state.accountUsersListLoading = false;
    },

    [getAccountAllUsers.pending]: (state, action) => {
      state.accountAllUsersList = [];
      state.accountAllUsersListLoading = true;
    },
    [getAccountAllUsers.fulfilled]: (state, action) => {
      state.accountAllUsersList = action.payload?.data || [];
      state.accountAllUsersListLoading = false;
    },
  },
});

export default superAdminUser.reducer;
