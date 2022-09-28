import constants from "../utils/constants";
import fetchClient from "../utils/axiosConfig";

export const callCreatePasswordAPI = () => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.PASSWORD.CREATE_PASSWORD}`, {
      params: {
        activationCode: "73IOWC",
      },
    });
  };
};

export const callSetUserProfileAPI = (data) => {
  console.log("profile data", data);
  return (_dispatch, _getState) => {
    return fetchData.post(`${constants.API.PASSWORD.SET_USER_PROFILE}`, data);
  };
};
