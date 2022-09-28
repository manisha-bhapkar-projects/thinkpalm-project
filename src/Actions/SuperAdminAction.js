import constants from "../utils/constants";
import fetchClient from "../utils/axiosConfig";

export const callAddSuperAdminUser = (data) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(
      `${constants.API.SUPER_ADMIN_USER.ADD_SUPER_ADMIN}`,
      data
    );
  };
};

export const callgetAdministratorRole = () => {
  return (_dispatch, _getState) => {
    return fetchClient.get(
      `${constants.API.SUPER_ADMIN_USER.GET_ADMINISTRATOR_ROLE}`
    );
  };
};

export const callgetUserList = (page, pageSize, roleId, sortField, sortOrder) => {
  console.log("page, pageSize, roleId",page, pageSize, roleId);
  return (_dispatch, _getState) => {
    return fetchClient.get(`${constants.API.SUPER_ADMIN_USER.GET_USER_LIST}`, {
      params: {
        page: page,
        pageSize: pageSize,
        // roleId: roleId,
        // sortby: sortField,
        // sortByDesc: sortOrder
      },
    });
  };
};

export const callUpdateSuperAdminUser = (id, data) => {
  return (_dispatch, _getState) => {
    return fetchClient.put(
      `${constants.API.SUPER_ADMIN_USER.UPDATE_SUPER_ADMIN}${id}`,
      data
    );
  };
};

export const callgetSpecificUserDetails = (id) => {
  return (_dispatch, _getState) => {
    return fetchClient.get(
      `${constants.API.SUPER_ADMIN_USER.UPDATE_SUPER_ADMIN}${id}`
    );
  };
};

export const callsendEmailToActiateUser = (email, activationCode) => {
  return (_dispatch, _getState) => {
    return fetchClient.post(
      `${constants.API.SUPER_ADMIN_USER.SEND_EMAIL_TO_CHANGE_STATUS}`,
      {
        EmailId: email,
        ActivationCode: activationCode,
      }
    );
  };
};

export const callChangeUserStatusAPI = (id, status) => {
  return (_dispatch, _getState) => {
    return fetchClient.put(
      `${constants.API.SUPER_ADMIN_USER.CHANGE_USER_STATUS}${id}?active=${status}`,
    );
  };
};