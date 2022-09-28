import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { format } from 'lodash';
import fetchClient from '../../utils/axiosConfig';
import constants from '../../utils/constants';
import { notifyAction } from './notification';
import moment from 'moment';

export const getPulseMapContent = createAsyncThunk(
  'country/getPulseMapContent',
  async () => {
    let res = await fetchClient
      .get(`${constants.API.USER.GET_PULSE_MAP_CONTENT}`)
      .then((res) => res.data)
      .catch(console.error); // implement a common error handler
    return res;
  }
);
export const getAccoutOwnerUserProfile = createAsyncThunk(
  'country/getAccoutOwnerUserProfile',
  async (id = {}) => {
    let res = await fetchClient
      .get(`${constants.API.USER.GET_USER_PROFILE}${id}`)
      .then((res) => res.data)
      .catch(console.error); // implement a common error handler
    return res;
  }
);

export const getUserCountryList = createAsyncThunk(
  'country/getUserCountryList',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HOME.GET_COUNTRY_LIST}${payload.id}`)
      .then((res) => res.data)
      .catch(console.error); // implement a common error handler
    return res;
  }
);

export const getUserCountry = async (payload) => {
  let res = await fetchClient
    .get(`${constants.API.HOME.GET_COUNTRY_LIST}${payload.id}`)
    .then((res) => res?.data?.data)
    .catch((error) => {
      return false;
    });
  return res;
};

export const alertAddtoUser = async (id, alert) => {
  let res = await fetchClient
    .post(`${constants.API.DETAILS.VIEWED_ALERT}`, id, alert)
    .then((res) => res.data)
    .catch((error) => error);

  return res ? res : false;
};

export const uploadImageFile = async (formData, preview) => {
  const config = {
    headers: { 'Content-Type': 'multipart/form-data' },
  };

  let res = fetchClient
    .post(
      `${constants.API.COUNTRY.FILE_UPLOAD}${preview ? '?PreviewNeeded=true' : ''
      }`,
      formData,
      config
    )
    .then((res) => res.data)
    .catch((error) => error);

  return res ? res : false;
};

export const updateCountryDetails = async (id, formData) => {
  let res = fetchClient
    .put(`${constants.API.COUNTRY.UPDATE_COUNTRY_BY_ID}${id}`, formData)
    .then((res) => res.data)
    .catch((error) => {
      return error?.response?.data;
    });

  return res ? res : false;
};

export const updateCountryStatus = async (country, status) => {
  let URI = constants.API.COUNTRY.UPDATE_COUNTRY_STATUS.replace(
    '{country_id}',
    country
  );
  let res = fetchClient
    .put(URI + status, {})
    .then((res) => res.data)
    .catch((error) => error);

  return res ? res : false;
};

export const addCountryDetails = async (formData) => {
  let res = fetchClient
    .post(`${constants.API.COUNTRY.CREATE_NEW_COUNTRY}`, formData)
    .then((res) => res.data)
    .catch((error) => {
      return error?.response?.data;
    });

  return res ? res : false;
};

export const getAllCountryList = createAsyncThunk(
  'country/getAllCountryList',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.COUNTRY.GET_COUNTRY_LIST}?showinactive=true`)
      .then((res) => res.data)
      .catch(console.error); // implement a common error handler
    return res;
  }
);

export const getPopularCountryList = createAsyncThunk(
  'country/getPopularCountryList',
  async () => {
    let res = await fetchClient
      .post(`${constants.API.HOME.GET_SUPER_TOPIC_TAG}`, {
        Tags: ['popular'],
        ShowCountryInfo: true,
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const getPopularContentList = createAsyncThunk(
  'country/getPopularContentList',
  async () => {
    let res = await fetchClient
      .post(`${constants.API.HOME.GET_SUPER_TOPIC_TAG}`, {
        Tags: ['Popular Content'],
        ShowTopicHierarchy: true,
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const fetchPopularContentForCountry = createAsyncThunk(
  'country/fetchPopularContentForCountry',
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.HOME.GET_SUPER_TOPIC_TAG}`, {
        Tags: ['Popular Content'],
        ShowTopicHierarchy: true,
        // CountryIds:[payload.id],
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);
export const getBlogSolutionId = createAsyncThunk(
  'country/getBlogSolutionId',
  async (payload = {}) => {
    let res = await fetchClient
      .post(
        `${constants.API.HOME.GET_POPULAR_COUNTRIES}?listcount=${payload.count}`,
        {
          solutionName: ['Knowledge Base - Insights and Analysis - Articles'],
        }
      )
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const getArticles = createAsyncThunk(
  'country/getArticles',
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .post(`${constants.API.KNOWLEDGE_BASE.GET_ARTICLES}`, payload)
      .then((res) => res.data)
      .catch((error) => {
        // console.log("callAddSuperAdminUser", error?.response.data.errors)
        if (error?.response?.data?.message?.length > 0) {
          return reduxInfo.dispatch(
            notifyAction({
              message: error?.response?.data?.message,
              timeOut: 1500,
            })
          );
        }
      });
    return res;
  }
);
export const getArticlesCountryPage = createAsyncThunk(
  'country/getArticlesCountryPage',
  async (payload = {}, reduxInfo) => {
    let res = await fetchClient
      .post(`${constants.API.KNOWLEDGE_BASE.GET_ARTICLES}`, payload)
      .then((res) => res.data)
      .catch((error) => {
        // console.log("callAddSuperAdminUser", error?.response.data.errors)
      });
    return res;
  }
);

export const getExpertSolutionId = createAsyncThunk(
  'country/getExpertSolutionId',
  async (payload = {}) => {
    let res = await fetchClient
      .post(
        `${constants.API.HOME.GET_POPULAR_COUNTRIES}?listcount=${payload.count}`,
        payload.data
      )
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const getCountryExpert = createAsyncThunk(
  'country/getCountryExpert',
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.HOME.GET_SUPER_TOPIC_TAG}`, payload.data)
      .then((res) => res.data)
      .catch(console.error);
    return { res, countryName: payload.countryName };
  }
);

export const getCountryBlogs = createAsyncThunk(
  'country/getCountryBlogs',
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.KNOWLEDGE_BASE.GET_ARTICLES}`, {
        solutionName: payload.data?.solutionName,
        tags: [...payload.data?.Tag],
      })
      .then((res) => res.data)
      .catch(console.error);
    return { res, countryName: payload.countryName };
  }
);

export const getCountryAlerts = createAsyncThunk(
  'country/getCountryAlerts',
  async (payload = {}) => {
    let res = await fetchClient
      .get(
        `${constants.API.HOME.GET_ALERT}${payload.id}/count/${payload.count}`
      )
      .then((res) => {
        return res.data
      })
      .catch(console.error);
    return res;
  }
);

export const getAllTopics = createAsyncThunk(
  'country/getAllTopics',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.COUNTRY.GET_ALL_TOPIC}${payload.id}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const createCountryPDF = createAsyncThunk(
  'country/createCountryPDF',
  async (payload = {}) => {
    let res = await fetchClient
      .post(
        `${constants.API.COUNTRY.PDF_CREATE}${payload.country_id}`,
        payload.data,
        { responseType: 'arraybuffer' }
      )
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);
export const employeeLifeCycle = createAsyncThunk(
  'country/employeeLifeCycle',
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.COUNTRY.GET_EMPLOYEE_LIFECYCLE}`, payload)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);
export const getEmployeeLifeCycle = createAsyncThunk(
  'country/getEmployeeLifeCycle',
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.HOME.GET_SOLUTION}`, payload)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const getArticleContent = createAsyncThunk(
  'country/getArticleContent',
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.HOME.GET_SUPER_TOPIC_TAG}`, {
        SuperTopicName: payload.SuperTopicName,
        ShowTopicHierarchy: true,
        RequiredCount: 0,
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const getPublicHolidays = createAsyncThunk(
  'country/getPublicHolidays',
  async (payload = {}) => {
    let res = await fetchClient
      .get(
        `${constants.API.COUNTRY.PUBLIC_HOLIDAYS}/${payload.countryId}/year/${payload.year}`
      )
      .then((res) => {
        console.log('PPPPPPPPPPres.data', res.data);
        return res.data;
      })
      .catch(console.error);
    return res;
  }
);
export const fetchCountryChartIndiactor = createAsyncThunk(
  'country/fetchCountryChartIndiactor',
  async (id = {}) => {
    let res = await fetchClient
      .get(`${constants.API.DETAILS.GET_COUNTRY_BULLETCHART}/${id}`)
      .then((res) => res)
      .catch(console.error);
    return res;
  }
);
export const fetchExpertProfiledataAPI = createAsyncThunk(
  'country/fetchExpertProfiledataAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.DETAILS.GET_SUPER_TOPICS}`, {
        SolutionIds: [payload.soultion_id],
        Tags: [payload.country],
        ShowTopicHierarchy: true,
      })
      .then((res) => {
        return res;
      })
      .catch(console.error);
    return res;
  }
);
export const fetchSnapShotAPI = createAsyncThunk(
  'country/fetchSnapShotAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .post(
        `${constants.API.HOME.GET_POPULAR_COUNTRIES}?listcount=${payload.count}`,
        {
          solutionName: ['Employee Management - Labor and Employment'],
          CountryIds: [payload.country_id],
        }
      )
      .then((res) => {
        return res;
      })
      .catch(console.error);
    return res;
  }
);
export const fetchExpertProfile = createAsyncThunk(
  'country/fetchExpertProfile',
  async () => {
    let res = await fetchClient
      .post(`${constants.API.HOME.GET_POPULAR_COUNTRIES}`, {
        solutionName: ['Consulting - Ask an Expert - Expert Profile'],
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);
export const fetchCountryDeatils = createAsyncThunk(
  'country/fetchCountryDeatils',
  async (id = {}) => {
    let res = await fetchClient
      .get(`${constants.API.DETAILS.GET_COUNTRY_DETAISL}/${id}`)
      .then((res) => res)
      .catch(console.error);
    return res;
  }
);
export const fetchSpecificsDataAPI = createAsyncThunk(
  'country/fetchSpecificsDataAPI',
  async (SolutionIds = {}) => {
    console.log('SolutionIds', SolutionIds);
    let res = await fetchClient
      .post(`${constants.API.DETAILS.GET_SPECIFICS_DATA}`, [...SolutionIds])
      .then((res) => res)
      .catch(console.error);
    return res;
  }
);
export const fetchSpecificsAPI = createAsyncThunk(
  'country/fetchSpecificsAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .post(
        `${constants.API.HOME.GET_POPULAR_COUNTRIES}?listcount=${payload.count}`,
        {
          solutionName: [
            'Employee Management - Labor and Employment - The Specifics',
          ],
          CountryIds: [payload.country_id],
        }
      )
      .then((res) => res)
      .catch(console.error);
    return res;
  }
);
export const fetchSnapShotListDataAPI = createAsyncThunk(
  'country/fetchSnapShotListDataAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.DETAILS.GET_SUPER_TOPICS}`, {
        SolutionIds: [payload.snapshot_id],
        CountryIds: [payload.country_id],
      })
      .then((res) => res)
      .catch(console.error);
    return res;
  }
);
export const fetchAlertsList = createAsyncThunk(
  'country/fetchAlertsList',
  async (payload = {}) => {
    let res = await fetchClient
      .get(
        `content/api/Content/alerts/${payload.country_id}/count/${payload.count}`
      )
      .then((res) => res)
      .catch(console.error);
    return res;
  }
);
export const fetchBlogInsightsArticles = createAsyncThunk(
  'country/fetchBlogInsightsArticles',
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.HOME.GET_POPULAR_COUNTRIES}`, {
        solutionName: ['Knowledge Base - Insights and Analysis - Articles'],
      })
      .then((res) => res)
      .catch(console.error);
    return res;
  }
);

export const callgetUserCountryDetails = createAsyncThunk(
  'favoriteCountriesReducer/callgetUserCountryDetails',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.COUNTRY.GET_USER_COUNTRY}${payload.userId}`, {
        params: {
          countryId: payload.id,
        },
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const callGetCountryDeatils = createAsyncThunk(
  'country/callGetCountryDeatils',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.DETAILS.GET_COUNTRY_DETAISL}/${payload.id}`)
      .then((res) => {
        return res.data;
      })
      .catch(console.error);
    return res;
  }
);

export const callGetSnapShotAPI = createAsyncThunk(
  'country/callGetSnapShotAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .post(
        `${constants.API.HOME.GET_POPULAR_COUNTRIES}?listcount=${payload.snapshot_count}`,
        {
          solutionName: [
            'Employee Management - Labor and Employment - Snapshot',
          ],
          CountryIds: [payload.id],
        }
      )
      .then((res) => {
        return res.data;
      })
      .catch(console.error);
    return res;
  }
);

export const callGetSnapShotListDataAPI = createAsyncThunk(
  'country/callGetSnapShotListDataAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.DETAILS.GET_SUPER_TOPICS}`, {
        SolutionIds: [payload.snapshotId],
        CountryIds: [payload.id],
      })
      .then((res) => {
        return res.data;
      })
      .catch(console.error);
    return res;
  }
);

export const callGetCountryChartIndiactor = createAsyncThunk(
  'country/callGetCountryChartIndiactor',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.DETAILS.GET_COUNTRY_BULLETCHART}/${payload.id}`)
      .then((res) => {
        return res.data;
      })
      .catch(console.error);
    return res;
  }
);
export const getCompanyDetails = createAsyncThunk(
  'country/getCompanyDetails',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.USER_ACCOUNTS.GET_ACCOUNT_INFO_BY_ID}${payload.id}`)
      .then((res) => {
        return res.data;
      })
      .catch(console.error);
    return res;
  }
);

export const callGetSpecificsAPI = createAsyncThunk(
  'country/callGetSpecificsAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .post(
        `${constants.API.HOME.GET_POPULAR_COUNTRIES}?listcount=${payload.specifics_count}`,
        {
          solutionName: [
            'Employee Management - Labor and Employment - The Specifics',
          ],
          CountryIds: [payload.id],
        }
      )
      .then((res) => {
        return res.data;
      })
      .catch(console.error);
    return res;
  }
);
export const callGetSpecificsDataAPI = createAsyncThunk(
  'country/callGetSpecificsDataAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.DETAILS.GET_SPECIFICS_DATA}`, [
        payload.specificsId,
      ])
      .then((res) => {
        return res.data;
      })
      .catch(console.error);
    return res;
  }
);

export const callGetSpecificsDataforLifecycleAPI = createAsyncThunk(
  'country/callGetSpecificsDataforLifecycleAPI',
  async (payload = {}) => {
    let res = await fetchClient
      .post(
        `${constants.API.DETAILS.GET_SPECIFICS_DATA}${payload._sTopicContentId ? '/' + payload._sTopicContentId : ''
        }`,
        [...payload.specificsId]
      )
      .then((res) => {
        return res.data;
      })
      .catch(console.error);
    return res;
  }
);

export const getAllCountriesList = createAsyncThunk(
  'country/getAllCountriesList',
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.COUNTRY.GET_ALL_COUNTRY_INFO_LIST}`, {
        ...payload.body,
      })
      .then((res) => {
        return {
          ...res.data,
          loadMore: payload.loadMore,
          previousList: payload.previousList,
        };
      })
      .catch((error) => {
        return { data: [] };
      });

    return res;
  }
);

export const fetchRegionList = createAsyncThunk(
  'favoriteCountriesReducer/fetchRegionList',
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.COUNTRY.GET_SPECIFIC_REGION_LIST}`, {
        params: { RegionId: payload.regionId },
      })
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const addtoFavorite = createAsyncThunk(
  'myAccountReducer/addtoFavorite',
  async (payload = {}, reduxInfo) => {
    if (payload.success) {
      return false;
    } else {
      let res = await fetchClient
        .post(`${constants.API.COUNTRY.ADD_SINGLE_FAV_COUNTRY}${payload.id}`)
        .then((res) => {
          setTimeout(() => {
            reduxInfo.dispatch(
              clearUserSuccess({
                countryaddedErr: undefined,
                detetedSuccess: false,
                deleteErr: undefined,
                countryadded: false,
              })
            );
          }, 1000);
          return res.data;
        })
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

export const deleteFromFavorite = createAsyncThunk(
  'myAccountReducer/deleteFromFavorite',
  async (payload = {}, reduxInfo) => {
    if (payload.success) {
      return false;
    } else {
      let res = await fetchClient
        .delete(`${constants.API.COUNTRY.ADD_SINGLE_FAV_COUNTRY}${payload.id}`)
        .then((res) => res.data)
        .catch((error) => {
          // if (error?.response?.data?.errors?.length > 0) {
          //   return reduxInfo.dispatch(
          //     notifyAction({ message: error?.response?.data?.errors[0] })
          //   );
          // }
        });
      return res;
    }
  }
);

export const getPublicHolidayList = createAsyncThunk(
  'country/getPublicHolidayList',
  async (payload = {}) => {
    let res = await fetchClient
      .get(
        `${constants.API.COUNTRY.GET_HOLIDAY_LIST}${payload.id}/year/${payload.year}`
      )
      .then((res) => {
        return res.data;
      })
      .catch(console.error);
    return res;
  }
);

export const getExpertHours = async (dispatch) => {
  dispatch(setGlobalLoading(true));
  let res = await fetchClient.get(
    `${constants.API.PURCHASE_EXPERT_BRIEFS.GET_EXPERT_HOURS}`
  ).then((res) => {
    dispatch(setGlobalLoading(false));
    return {
      availableHours: res?.data?.data?.availableHours || 0,
      totalExpertHours: res?.data?.data?.totalExpertHours || 0,
      usedHours: res?.data?.data?.usedHours || 0,
    };
  }).catch((error) => {
    dispatch(setGlobalLoading(false));
    return {
      error: true,
      availableHours: 0,
      totalExpertHours: 0,
      usedHours: 0,
    };
  });

  return res;
};

const country = createSlice({
  name: 'country',
  initialState: {
    countryList: [],
    allCountryList: [],
    allArticles: [],
    countryArticles: [],
    allCountry: [],
    expertData: {},
    expertLoading: {},
    blogData: {},
    blogLoading: {},
    alertLoading: {},
    alertData: {},
    loading: false,
    articleContent: [],
    lifeCycleData: [],
    allArticlesLoading: true,
    employeeCount: '',
    CountryDetails: [],
    solutionId: '',
    SnapShotData: [],
    topicsLoading: false,
    popularContentForCountry: [],
    attractId: [],
    onBoardId: [],
    developId: [],
    offBoardId: [],
    specificLifecycleData: [],
    regionList: [],
    addedtofav: {},
    holidayList: [],
    companyDetails: [],
    globalLoader: false,
    countryStatus: {
      countryaddedErr: false,
      detetedSuccess: false,
      deleteErr: false,
      countryadded: false,
    },
    userCountryLoading: false
  },
  reducers: {
    clearUserSuccess: (state, action) => {
      state.countryStatus = { ...action.payload };
    },
    setGlobalLoading: (state, action) => {
      console.log('setGlobalLoading', action.payload);
      state.globalLoader = action.payload || false;
    },
  },
  extraReducers: {
    [getAllCountriesList.pending]: (state, action) => {
      state.allCountriesLoading = true;
      state.allCountriesList = [];
    },
    [getAllCountriesList.fulfilled]: (state, action) => {
      if (action.payload?.data != null) {
        state.allCountriesLength = action.payload?.data.length;
        state.allCountriesList = action.payload?.loadMore
          ? [...action.payload.previousList, ...action.payload?.data]
          : action.payload?.data || [];
        state.allCountriesLoading = false;
      } else if (
        action.payload?.previousList &&
        action.payload.previousList.length > 0
      ) {
        state.allCountriesLength = 1;
        state.allCountriesList = action.payload?.loadMore
          ? [...action.payload.previousList]
          : action.payload?.data || [];
        state.allCountriesLoading = false;
      } else {
        state.allCountriesLength = 0;
        state.allCountriesList = [];
        state.allCountriesLoading = false;
      }
    },
    [fetchBlogInsightsArticles.fulfilled]: (state, action) => {
      state.insightsId = action.payload || null;
    },
    [fetchAlertsList.pending]: (state, action) => {
      state.alertsDataLoading = true;
    },
    [fetchAlertsList.fulfilled]: (state, action) => {
      state.alertsDataLoading = false;
      state.alertsData = action.payload || null;
    },
    [fetchSnapShotAPI.fulfilled]: (state, action) => {
      state.snapshotId = action.payload || null;
    },
    [fetchSnapShotListDataAPI.fulfilled]: (state, action) => {
      state.snapshostData = action.payload || null;
    },
    [fetchSpecificsAPI.fulfilled]: (state, action) => {
      state.specificsId = action.payload || null;
    },
    [fetchSpecificsDataAPI.fulfilled]: (state, action) => {
      state.specificsData = action.payload || [];
    },
    [fetchCountryDeatils.pending]: (state, action) => {
      state.countryNameLoading = true;
    },
    [fetchCountryDeatils.fulfilled]: (state, action) => {
      state.countryNameLoading = false;
      state.countryName = action.payload || [];
    },
    [fetchExpertProfile.fulfilled]: (state, action) => {
      state.ExpertSoultionId = action.payload || [];
    },
    [fetchExpertProfiledataAPI.fulfilled]: (state, action) => {
      state.ExpertSoultionData = action.payload || [];
    },
    [fetchCountryChartIndiactor.fulfilled]: (state, action) => {
      state.countryChartData = action.payload || [];
    },
    [getPulseMapContent.pending]: (state, action) => {
      state.pulseMapContentLoading = true;
    },
    [getPulseMapContent.fulfilled]: (state, action) => {
      state.pulseMapContentLoading = false;
      state.pulseMapContent = action.payload?.data || null;
    },
    [getAccoutOwnerUserProfile.pending]: (state, action) => {
      state.accoutOwnerUserLoading = true;
    },
    [getAccoutOwnerUserProfile.fulfilled]: (state, action) => {
      state.accoutOwnerUserLoading = false;
      state.accoutOwnerUserData = action.payload?.data || null;
    },
    [getUserCountryList.pending]: (state, action) => {
      state.userCountryLoading = true;
    },
    [getUserCountryList.fulfilled]: (state, action) => {
      state.userCountryLoading = false;
      state.countryList = action.payload?.data || [];
    },
    [getAllCountryList.pending]: (state, action) => {
      state.allCountryLoading = true;
    },
    [getAllCountryList.rejected]: (state, action) => {
      state.allCountryFailed = true;
      state.allCountryLoading = false;
    },
    [getAllCountryList.fulfilled]: (state, action) => {
      state.allCountryLoading = false;
      state.allCountryFailed = false;
      state.allCountryList = action.payload?.data || [];
      state.allCountry = action.payload?.data || [];
    },
    [getPopularCountryList.fulfilled]: (state, action) => {
      state.popularCountryList = action.payload?.data || [];
    },
    [getAllTopics.fulfilled]: (state, action) => {
      state.allTopics = action.payload?.data || [];
    },
    [getPopularContentList.fulfilled]: (state, action) => {
      state.popularContent = action.payload?.data || [];
    },
    [getBlogSolutionId.fulfilled]: (state, action) => {
      state.blogSolutions = action.payload?.data || [];
    },
    [getExpertSolutionId.fulfilled]: (state, action) => {
      state.expertSolutions = action.payload?.data || [];
    },
    [getCountryBlogs.pending]: (state, action) => {
      let countryName = action.meta?.arg?.countryName;
      state.blogLoading[countryName] = true;
    },
    [getCountryBlogs.fulfilled]: (state, action) => {
      state.blogData[action.payload?.countryName] = action.payload?.res?.data;
      state.blogLoading[action.payload?.countryName] = false;
    },
    [getCountryExpert.pending]: (state, action) => {
      let countryName = action.meta?.arg?.countryName;
      state.expertLoading[countryName] = true;
    },
    [getCountryExpert.fulfilled]: (state, action) => {
      state.expertData[action.payload?.countryName] = action.payload?.res?.data;
      state.expertLoading[action.payload?.countryName] = false;
    },
    [getCountryAlerts.pending]: (state, action) => {
      let countryName = action.meta?.arg?.countryName;
      state.alertLoading[countryName] = true;
    },
    [getCountryAlerts.fulfilled]: (state, action) => {
      let countryName = action.meta?.arg?.countryName;
      state.alertData[countryName] = action.payload?.data;
      state.alertLoading[countryName] = false;
    },
    [createCountryPDF.pending]: (state, action) => {
      state.pdfLoading = true;
    },
    [createCountryPDF.fulfilled]: (state, action) => {
      state.pdfLoading = false;
      download(action.payload, 'application/pdf');
    },
    [getArticles.pending]: (state, action) => {
      state.allArticlesLoading = true;
    },
    [getArticles.fulfilled]: (state, action) => {
      state.allArticlesLoading = false;
      state.allArticles = action.payload?.data || [];
    },
    [getArticlesCountryPage.fulfilled]: (state, action) => {
      state.allArticlesLoading = false;
      state.countryArticles = action.payload?.data || [];
    },
    [getArticleContent.fulfilled]: (state, action) => {
      state.articleContent = action.payload?.data || [];
    },
    [getPublicHolidays.fulfilled]: (state, action) => {
      let id = [];
      action.payload?.data.value[0]?.holidays?.forEach((item) => {
        id.push({
          date: moment.utc(item.date).format('DD-MM-YYYY'),
          description: item.description,
        });
      });
      state.publicHolidays = id;
    },
    [employeeLifeCycle.fulfilled]: (state, action) => {
      let attractId = [];
      let onBoardId = [];
      let developId = [];
      let offBoardId = [];
      action?.payload?.data.forEach((item) => {
        if (
          item.templateName ===
          'Employee Management - Employee Lifecycle - Attract'
        ) {
          attractId.push(item.solutionId);
        }
        if (
          item.templateName ===
          'Employee Management - Employee Lifecycle - Onboard'
        ) {
          onBoardId.push(item.solutionId);
        }
        if (
          item.templateName ===
          'Employee Management - Employee Lifecycle - Develop and Retain'
        ) {
          developId.push(item.solutionId);
        }
        if (
          item.templateName ===
          'Employee Management - Employee Lifecycle - Offboard'
        ) {
          offBoardId.push(item.solutionId);
        }
      });
      state.attractId = attractId;
      state.onBoardId = onBoardId;
      state.developId = developId;
      state.offBoardId = offBoardId;
    },
    [getEmployeeLifeCycle.fulfilled]: (state, action) => {
      state.lifeCycleData = action.payload?.data || [];
    },
    [callgetUserCountryDetails.pending]: (state, action) => {
      state.userDataloading = true;
    },
    [callgetUserCountryDetails.fulfilled]: (state, action) => {
      state.userDataloading = false;
      state.employeeCount = action.payload?.data?.employeeCountryCount || '';
    },
    [callGetCountryDeatils.fulfilled]: (state, action) => {
      state.CountryDetails = action.payload?.data || [];
    },
    [callGetSnapShotAPI.fulfilled]: (state, action) => {
      state.solutionId = action.payload?.data[0].solutionId || '';
    },
    [callGetSnapShotListDataAPI.fulfilled]: (state, action) => {
      state.SnapShotData = action.payload?.data || [];
    },

    [callGetCountryChartIndiactor.fulfilled]: (state, action) => {
      state.ChartData = action.payload?.data || [];
    },
    [callGetSpecificsAPI.fulfilled]: (state, action) => {
      state.specificSolutionId = action.payload?.data[0].solutionId || [];
    },
    [callGetSpecificsDataAPI.pending]: (state, action) => {
      state.topicsLoading = true;
    },
    [callGetSpecificsDataAPI.fulfilled]: (state, action) => {
      state.topicsLoading = false;
      state.specificData = action.payload?.data || [];
    },
    [fetchPopularContentForCountry.fulfilled]: (state, action) => {
      state.popularContentForCountry = action.payload?.data || [];
    },
    [callGetSpecificsDataforLifecycleAPI.fulfilled]: (state, action) => {
      state.specificLifecycleData = action.payload?.data || [];
    },
    [fetchRegionList.fulfilled]: (state, action) => {
      state.regionList = action.payload?.data || [];
    },
    [addtoFavorite.pending]: (state, action) => {
      state.countryadded = false;
    },
    [addtoFavorite.rejected]: (state, action) => {
      state.countryStatus.countryaddedErr = action?.error?.message || undefined;
    },
    [addtoFavorite.fulfilled]: (state, action) => {
      state.countryStatus.countryadded =
        action?.payload?.responseCode || undefined;
      state.addedtofav = action.payload?.data || {};
    },
    [deleteFromFavorite.pending]: (state, action) => {
      state.detetedSuccess = false;
    },
    [deleteFromFavorite.rejected]: (state, action) => {
      state.countryStatus.deleteErr = action?.error?.message || undefined;
    },
    [deleteFromFavorite.fulfilled]: (state, action) => {
      state.countryStatus.detetedSuccess =
        action?.payload?.responseCode || undefined;
    },
    [getPublicHolidayList.fulfilled]: (state, action) => {
      state.holidayList = action?.payload?.data?.value || [];
    },
    [getCompanyDetails.fulfilled]: (state, action) => {
      state.companyDetails = action.payload?.data || [];
    },
  },
});

function download(arrayBuffer, type) {
  var blob = new Blob([arrayBuffer], { type: type });
  var url = URL.createObjectURL(blob);
  window.open(url);
}
export const { clearUserSuccess, setGlobalLoading } = country.actions;
export default country.reducer;
