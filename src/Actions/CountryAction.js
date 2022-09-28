import constants from "../utils/constants";
import fetchClient from "../utils/axiosConfig";

export const callgetCountryListAPI = (RegionId) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.COUNTRY.GET_COUNTRY_LIST}`, {
      params: { RegionId: RegionId && RegionId.map((x) => x).join(",") },
    });
  };
};

export const callgetRegionListAPI = () => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.COUNTRY.GET_REGION_LIST}`);
  };
};

export const callgetSpecificRegionListAPI = (RegionId) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(
      `${constants.API.COUNTRY.GET_SPECIFIC_REGION_LIST}`,
      { params: { RegionId: RegionId.map((x) => x).join(",") } }
    );
  };
};

export const callgetFavouriteCountryAPI = (id) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.COUNTRY.GET_FAVOURITE_COUNTRY + id}`);
  };
};

export const callUpdateEmployeeCountListAPI = (data) => {
  return (_dispatch, _getState) => {
    return fetchClient.put(
      `${constants.API.COUNTRY.GET_EMPLOYEE_COUNTRY}`,
      data
    );
  };
};

export const callAddCountryAPI = (data) => {
  return (_dispatch, _getState) => {
    return fetchClient.put(`${constants.API.COUNTRY.ADD_COUNTRY}`, data);
  };
};

export const callgetUserCountry = (id) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.COUNTRY.GET_USER_COUNTRY}${id}`);
  };
};

export const callgetEmployeeType = () => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.COUNTRY.GET_EMPLOYEE_TYPE}`);
  };
};

export const callgetUserCountryDetails = (id) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.HOME.GET_COUNTRY_LIST}${id}`);
  };
};
