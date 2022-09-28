import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import fetchClient from "../../utils/axiosConfig"
import constants from "../../utils/constants"
import { notifyAction } from "./notification";

const searchTextURL = ({ searchText, pagination, stateId, countryId, regionId }) => {
  return `?searchtext=${searchText}${pagination && pagination.pageNumber ? `&pageNumber=${pagination.pageNumber}` : ''}${pagination && pagination.pageSize ? `&pageSize=${pagination.pageSize}` : ''}${stateId ? `&stateId=${stateId}` : ''}${countryId ? `&countryId=${countryId}` : ''}${regionId ? `&regionId=${regionId}` : ''}`;
};

export const getSearchResult = createAsyncThunk(
  "searchResult/getSearchresult",
  async (param) => {
    if (fetchClient) {
      let res = fetchClient.get(`${constants.API.SEARCH_RESULT.GET_SEARCH_RESULT}${searchTextURL(param)}`)
        .then(res => res.data)
        .catch(console.error);

      return res ? res : false;
    } else {
      return false;
    }
  })

/**
   * This Function used to update the @params for the Search API.
   *
   * @param text Search Text
   * @param stateId If you have an state ID Parse here Or Else parse false.
   * @param countryId If you have an Country ID Parse here Or Else parse false.
   * @param regionId If you have an Region ID Parse here Or Else parse false.
   * @param stateName If you have an State name Parse here .
   * @param countryName If you have an Country Name Parse here.
   * @param regionName If you have an Region Name Parse here.
   *
*/
export const updateSearchText = createAsyncThunk(
  "searchResult/updateSearchText",
  async (payload = {}, reduxInfo) => {

    const validateParmAction = (value) => {
      return value != "" && value != null && value != undefined ? value : false;
    }

    let response = {
      searchTextValue: payload.text,
      countryId: validateParmAction(payload.countryId),
      stateId: validateParmAction(payload.stateId),
      regionId: validateParmAction(payload.regionId),
      stateName: payload.stateName || "",
      countryName: payload.countryName || "",
      regionName: payload.regionName || "",
    };

    reduxInfo.dispatch(setPagination({
      pageNumber: 1,
      pageSize: 6,
      reload: true,
    }));
    return response;
  }
);

export const autoSuggest = createAsyncThunk("country/autoSuggest",
  async (param) => {
    let res = fetchClient.get(`${constants.API.SEARCH_RESULT.GET_AUTO_POPULATE_RESULT}${searchTextURL(param)}`)
      .then(res => {
        return res.data
      })
      .catch(console.error)
    return res;
  }
)
export const autoSuggestDocShop = createAsyncThunk(
  "HRTemplate/autoSuggestDocShop",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.HR_TEMPLATE.GET_ALL_DOCUMENT_LIST}`, {
        params: {
          page: payload.page,
          pageSize: payload.pageSize,
          sortby: "countrythentitle",
          languageIds: payload.languageIds?.map((x) => x).join(","),
          countryIds: payload.countryIds?.map((x) => x).join(","),
          categoryIds: payload.categorIds?.map((x) => x).join(","),
          skipPagination: payload.skipPagination,
          sortBydesc: false,
          searchterm: payload.searchterm
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch(console.error);
    return res;
  }
);


const searchResult = createSlice({
  name: "searchResultReducer",
  initialState: {
    searchResult: [],
    searchTextValue: "",
    stateId: false,
    countryId: false,
    regionId: false,
    stateName: '',
    countryName: '',
    regionName: '',
    loading: false,
    pagination: {
      pageNumber: 1,
      pageSize: 6,
      reload: true
    },
    autoSuggestResults: [],
    autoSuggestResultsLoading: false,
  },
  reducers: {
    setPagination: (state, action) => {
      state.pagination = { ...action.payload }
    },
  },
  extraReducers: {
    [updateSearchText.fulfilled]: (state, action) => {

      state.searchTextLoading = true;
      state.searchTextValue = action.payload.searchTextValue;
      state.countryId = action.payload.countryId;
      state.countryName = action.payload.countryName;
      state.stateId = action.payload.stateId;
      state.regionId = action.payload.regionId;
      state.stateName = action.payload.stateName;
      state.regionName = action.payload.regionName;
    },
    [getSearchResult.fulfilled]: (state, action) => {
      state.searchResult = action.payload?.data || [];
      state.searchResultLoading = false;
    },
    [getSearchResult.pending]: (state, action) => {
      state.searchResultLoading = true;
    },
    [autoSuggest.pending]: (state, action) => {
      state.autoSuggestResults = [];
      state.autoSuggestResultsLoading = true;
    },
    [autoSuggest.rejected]: (state, action) => {
      state.autoSuggestResults = action?.error?.message || undefined;
      state.autoSuggestResultsLoading = false;
    },
    [autoSuggest.fulfilled]: (state, action) => {
      state.autoSuggestResults = action.payload?.data || {};
      state.autoSuggestResultsLoading = false;
    },
    [autoSuggestDocShop.pending]: (state, action) => {
      state.autoSuggestDocShopResults = [];
      state.autoSuggestDocShopResultsLoading = true;
    },
    [autoSuggestDocShop.rejected]: (state, action) => {
      state.autoSuggestDocShopResults = action?.error?.message || undefined;
      state.autoSuggestDocShopResultsLoading = false;
    },
    [autoSuggestDocShop.fulfilled]: (state, action) => {
      state.autoSuggestDocShopResults = action.payload?.data || {};
      state.autoSuggestDocShopResultsLoading = false;
    },
  }
})
export const { setPagination } = searchResult.actions
export default searchResult.reducer;
