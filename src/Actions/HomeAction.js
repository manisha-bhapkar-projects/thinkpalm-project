import constants from "../utils/constants";
import fetchClient from "../utils/axiosConfig";


export const callGetCountryListAPI = (id) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.HOME.GET_COUNTRY_LIST}${id}`);
  };
};

export const callGetPopularCountryListAPI = (count, data) => {
  console.log("callGetPopularCountryListAPI", count, data);
  return (_dispatch, _getState) => {
    return fetchClient.post(
      `${constants.API.HOME.GET_POPULAR_COUNTRIES}?listcount=${count}`,
      {
        ...data,
      }
    );
  };
};

export const callGetSuperTopicsListAPI = (SolutionIds) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(
      `${constants.API.HOME.GET_SUPER_TOPICS}`,

      SolutionIds
    );
  };
};

export const callGetExpertAPI = (count) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(
      `${constants.API.HOME.GET_POPULAR_COUNTRIES}?listcount=${count}`,
      {
        solutionName: ["Consulting - Ask an Expert - Expert Profile"],
      }
    );
  };
};

export const callGetExpertDetailsAPI = (expertID) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(
      `${constants.API.HOME.GET_SOLUTION}`,
      expertID
      // "Tags" : [...countryName]
    );
  };
};

export const callGetPopularCountriesAPI = () => {
  return (_dispatch, _getState) => {
    return fetchClient.post(`${constants.API.HOME.GET_SUPER_TOPIC_TAG}`, {
      Tags: ["popular"],
      // SuperTopicName: ["Advantages"],
    });
  };
};

export const callgetBlogArticleWPAPI = (count) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(
      `${constants.API.HOME.GET_POPULAR_COUNTRIES}?listcount=${count}`,
      {
        solutionName: ["Knowledge Base - Insights and Analysis - Articles"],
      }
    );
  };
};

export const callgetBlogsforCountryAPI = (solutionID, Tag) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(`${constants.API.HOME.GET_SUPER_TOPIC_TAG}`, {
      SolutionIds: [solutionID],
      Tags: [...Tag, "Global"],
    });
  };
};

export const callgetAlertsAPI = (id, count) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(
      `${constants.API.HOME.GET_ALERT}${id}/count/${count}`
    );
  };
};

export const callPopularContentAPI = (solutionID) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(`${constants.API.HOME.GET_SUPER_TOPIC_TAG}`, {
      SolutionId: solutionID,
      Tags: ["Popular Content"],
    });
  };
};

export const callGetSolutionsAPI = (count, payload) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(
      `${constants.API.HOME.GET_POPULAR_COUNTRIES}?listcount=${count}`,
      payload
    );
  };
};

export const callGetSuperTopicsAPI = (payload) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(
      `${constants.API.HOME.GET_SUPER_TOPIC_TAG}`,
      payload
    );
  };
};

export const downloadImage = (payload) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(`${constants.API.IMAGE.DOWNLOAD}/${payload.id}`);
  };
};
