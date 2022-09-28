import constants from "../utils/constants";
import fetchClient from "../utils/axiosConfig";


export const getUserRoles = () => {
    return (_dispatch, _getState) => {
        return fetchClient.get(`${constants.API.ROLES.GET_ROLES_LIST}`)
    }
}

export const getFeatData = () => {
    return (_dispatch, _getState) => {
        return fetchClient.get(`${constants.API.ROLES.GET_USERS_FEAT}`,
        )
    }
}

export const getUserGroups = () => {
    return (_dispatch, _getState) => {
        return fetchClient.get(`${constants.API.ROLES.GET_USER_GROUP}`,
        )
    }
}

export const postUserRole = (data) => {
    return (_dispatch, _getState) => {
        return fetchClient.post(`${constants.API.ROLES.POST_USER_DATA}`, {
            ...data
        });
    };
};


export const updateUserDetails = (data) => {
    return (_dispatch, _getState) => {
        console.log(data);  
        return fetchClient.put(`${constants.API.ROLES.POST_USER_DATA}/${data.id}`, {
            ...data
        });
    };
};

export const getUserRolesbyId = (id) => {
    return (_dispatch, _getState) => {
        return fetchClient.get(`${constants.API.ROLES.POST_USER_DATA}/${id}`)
    };
};
