import constants from "../utils/constants";
import axios from "axios";
import fetchClient from "../utils/axiosConfig";
import { setLastLoginAttempted } from "../utils/storage";

export const callgetUserProfileAPI = (id) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.USER.GET_USER_PROFILE}${id}`);
  };
};

export const callUpdateUserProfileAPI = (id, data) => {
  return (_dispatch, _getState) => {
    return fetchClient.put(
      `${constants.API.USER.UPDATE_USER_PROFILE}${id}`,
      data
    );
  };
};

export const callUploadProfilePicAPI = (data) => {
  return (_dispatch, _getState) => {
    return axios.post(`${constants.API.USER.UPLOAD_PROFILE_PIC}`, data);
  };
};

export const callgetIndustryList = () => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.USER.GET_INDUSTRY_LIST}`);
  };
};

export const callgetCompanyList = () => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.USER.GET_COMPANY_LIST}`);
  };
};

export const updateLastLogin = (user_id) => {
  return (_dispatch, _getState) => {
    return fetchClient
      .put(`${constants.API.USER.UPDATE_LAST_LOGIN}${user_id}`)
      .then(() => {
        setLastLoginAttempted();
      });
  };
};

export const callgetPrimaryUser = (id) => {
  return (_dispatch, _getState) => {
    return fetchClient.put(`${constants.API.USER.GET_PRIMARY_USER}${id}`);
  };
};
