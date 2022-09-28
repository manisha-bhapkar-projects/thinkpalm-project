import axios from "../utils/axiosConfig";
import constants from "../utils/constants";


const getUserDetails = id => {
    const data = axios.get(`${constants.API.USER.GET_USER_PROFILE}${id}`)
        .then(response => {
            return response.data;
        })
        .catch(errors => {
            Promise.reject(errors);
        });
    return data;
};
const getInternalUserAPI = () => {
    const data = axios.post(`${constants.API.USER.INTERNAL_USER}`)
        .then(response => {
            return response.data;
        })
        .catch(errors => {
            Promise.reject(errors);
        });
    return data;
};


export default {
    getUserDetails,
    getInternalUserAPI
}