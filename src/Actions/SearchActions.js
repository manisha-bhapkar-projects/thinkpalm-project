import constants from "../utils/constants";
import fetchClient from "../utils/axiosConfig";
import { ON_SEARCH_TEXT_CHANGE } from "../ReducerAction/type";


const searchTextURL = ({ searchText, pageNumber, pageSize, stateId, countryId, regionId }) => {
  return `?searchtext=${searchText}${pageNumber ? `&pageNumber=${pageNumber}` : ''}${pageSize ? `&pageSize=${pageSize}` : ''}${stateId ? `&stateId=${stateId}` : ''}${countryId ? `&countryId=${countryId}` : ''}${regionId ? `&regionId=${regionId}` : ''}`;
}

export const getSearchResult = (param) => {
    // console.log('API URL', `${constants.API.SEARCH_RESULT.GET_SEARCH_RESULT}${searchTextURL(param)}`)
    return fetchClient.get(`${constants.API.SEARCH_RESULT.GET_SEARCH_RESULT}${searchTextURL(param)}`);
};

/**
   * This Function used to update the @params for the Search API.
   *
   * @param text Search Text
   * @param stateId If you have an state ID Parse here Or Else parse false.
   * @param countryId If you have an Country ID Parse here Or Else parse false.
   * @param regionId If you have an Region ID Parse here Or Else parse false.
   *
*/
export const updateSearchText = ({ text, stateId, countryId, regionId, stateName, countryName, regionName }) => {
  return {
      type: ON_SEARCH_TEXT_CHANGE,
      payload: {
        text,
        countryId,
        stateId,
        regionId,
        stateName,
        countryName,
        regionName
      }
  };
};
