import constants from "../utils/constants";
import fetchClient from "../utils/axiosConfig";

export const callGetCountryDeatils = (country_id) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(
      `${constants.API.DETAILS.GET_COUNTRY_DETAISL}/${country_id}`
    );
  };
};

export const callGetSpecificsDataAPI = (SolutionIds, _stcId) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(`${constants.API.DETAILS.GET_SPECIFICS_DATA}${_stcId ? '/' + _stcId : ''}`, [
      ...SolutionIds,
    ]);
  };
};

export const callGetSpecificsAPI = (country_id, count) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(
      `${constants.API.HOME.GET_POPULAR_COUNTRIES}?listcount=${count}`,
      {
        solutionName: ["Employee Management - Labor and Employment - The Specifics"],
        CountryIds: [country_id],
      }
    );
  };
};

export const callGetSnapShotListDataAPI = (snapshot_id, country_id) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(`${constants.API.DETAILS.GET_SUPER_TOPICS}`, {
      SolutionIds: [snapshot_id],
      CountryIds: [country_id],
    });
  };
};

export const callGetSnapShotAPI = (country_id, count) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(
      `${constants.API.HOME.GET_POPULAR_COUNTRIES}?listcount=${count}`,
      {
        solutionName: ["Employee Management - Labor and Employment - Snapshot"],
        CountryIds: [country_id],
      }
    );
  };
};

export const callGetInsightsSolution = (id, country) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(`${constants.API.DETAILS.GET_SUPER_TOPICS}`, {
      SolutionIds: [id],
      Tags: [country, "Global"],
    });
  };
};

export const callGetBlogInsightsArticles = (country_id) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(`${constants.API.HOME.GET_POPULAR_COUNTRIES}`, {
      solutionName: ["Knowledge Base - Insights and Analysis - Articles"],
    });
  };
};

export const callGetExpertProfile = (country_id) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(`${constants.API.HOME.GET_POPULAR_COUNTRIES}`, {
      solutionName: ["Consulting - Ask an Expert - Expert Profile"],
    });
  };
};

export const callGetExpertProfiledataAPI = (soultion_id, country) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(`${constants.API.DETAILS.GET_SUPER_TOPICS}`, {
      SolutionIds: [soultion_id],
      Tags: [country],
      ShowTopicHierarchy: true,
    });
  };
};

export const callGetAlertsList = (country_id, count) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(
      `content/api/Content/alerts/${country_id}/count/${count}`
    );
  };
};

export const callGetCountryChartIndiactor = (id) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.DETAILS.GET_COUNTRY_BULLETCHART}/${id}`);
  };
};