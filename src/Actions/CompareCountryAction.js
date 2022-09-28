import constants from "../utils/constants";
import fetchClient from "../utils/axiosConfig";

export const callGetCompareCountrySolutionIdAPI = (data) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(
      `${constants.API.HOME.GET_POPULAR_COUNTRIES}`,
      data
    );
  };
};

export const callGetSnapShotAPI = (data) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(`${constants.API.DETAILS.GET_SUPER_TOPICS}`, data);
  };
};
