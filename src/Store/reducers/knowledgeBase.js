import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CustomeNotification } from "../../Components/CustomeNotification/CustomeNotification";
import fetchClient from "../../utils/axiosConfig";
import constants from "../../utils/constants";


export const getArticleById = createAsyncThunk(
  "knowledgeBase/getArticleById",
  async () => {
    let res = await fetchClient
      .get(`${constants.API.KNOWLEDGE_BASE.GET_ARTICLE_DETAILS}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const getAllFAQ = createAsyncThunk(
  "knowledgeBase/getAllFAQ",
  async (payload = {}) => {
    let res = await fetchClient
      .post(`${constants.API.KNOWLEDGE_BASE.GET_ALL_FAQS}`, {
        SolutionName: ["Knowledge Base - FAQ"],
        GeographicTags: [],
        Tags: []
      })
      .then((res) => res.data.data)
      .catch(console.error);
    return res;
  }
);

export const getFeaturedArticles = createAsyncThunk(
  "knowledgeBase/getFeaturedArticles",
  async (payload = {}) => {
    let res = {};
    res = await fetchClient
      .post(`${constants.API.KNOWLEDGE_BASE.GET_FEATURED_ARTICLES}`, {
        SolutionName: payload.SolutionName,
        GeographicTags: payload.GeographicTags,
        Tags: payload.Tags,
        GenericTags: payload.GenericTags || [],
        TrimContent: false
      })
      .then((res) => { return res.data.data; })
      .catch((e) => {
        if (e) {
          throw "Error";
        }
      });
    return res;
  }
);

export const getQuickLinks = createAsyncThunk(
  "knowledgeBase/getQuickLinks",
  async () => {
    let res = await fetchClient
      .get(`${constants.API.KNOWLEDGE_BASE.GET_QUICK_LINKS}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);

export const getTags = createAsyncThunk(
  "knowledgeBase/getTags",
  async (payload = {}) => {
    let res = await fetchClient
      .get(`${constants.API.KNOWLEDGE_BASE.GET_TAGS}`)
      .then((res) => res.data)
      .catch(console.error);
    return res;
  }
);



const knowledgeBase = createSlice({
  name: "knowledgeBase",
  initialState: {
    articleDetails: {},
    quickLinks: [],
    featureArticleList: [],
    tagList: [],
    faqList: [],
    insightsList: [],
  },
  reducers: {},
  extraReducers: {
    [getFeaturedArticles.pending]: (state, action) => {
      state.featureArticleLoading = true;
      state.featureArticleList = [];
    },
    [getFeaturedArticles.fulfilled]: (state, action) => {
      state.featureArticleLoading = false;
      state.featureArticleList = action.payload?.data || [];
    },
    [getFeaturedArticles.rejected]: (state, action) => {
      state.featureArticleLoading = false;
      state.featureArticleFailed = true;
      state.featureArticleList = [];
    },
    [getQuickLinks.pending]: (state, action) => {
      state.quickLinksLoading = true;
      state.quickLinks = [];
    },
    [getQuickLinks.fulfilled]: (state, action) => {
      state.quickLinksLoading = false;
      state.quickLinks = action.payload?.data || [];
    },
    [getTags.pending]: (state, action) => {
      state.tagsLoading = true;
      state.tagList = [];
    },
    [getTags.fulfilled]: (state, action) => {
      state.tagsLoading = false;
      state.tagList = action.payload?.data || [];
    },
    [getAllFAQ.pending]: (state, action) => {
      state.faqLoading = true;
    },
    [getAllFAQ.fulfilled]: (state, action) => {
      state.faqLoading = false;
      state.faqList = action.payload?.data || [];
    },
    [getArticleById.pending]: (state, action) => {
      state.insightsListLoading = true;
      state.insightsList = [];
    },
    [getArticleById.fulfilled]: (state, action) => {
      state.insightsListLoading = false;
      state.insightsList = action.payload?.data || [];
    },
  },
});

export default knowledgeBase.reducer;
