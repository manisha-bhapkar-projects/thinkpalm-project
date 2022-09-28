import constants from "../utils/constants";
import fetchClient from "../utils/axiosConfig";

export const callAddCoworkers = (data) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(`${constants.API.USER.ADD_COWORKERS}`, data);
  };
};

export const callgetCoworkersList = (id) => {
  console.log("callgetCoworkersList", id);
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.USER.COWORKERS_LIST}${id}`);
  };
};

export const callgetUserByKeyClockId = (id) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.USER.GET_USER_PROFILE}${id}`);
  };
};

export const callDeleteUserAPI = (id) => {
  return (_dispatch, _getState) => {
    return fetchClient.delete(`${constants.API.USER.DELETE_USER}${id}`);
  };
};
