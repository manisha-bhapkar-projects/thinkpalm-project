import constants from "../constants";

export const storeUserData = (data) => {
  if (data) {
    localStorage.setItem(constants.STORAGE.AUTH.USER_DATA, JSON.stringify(data));
  } else {
    localStorage.removeItem(constants.STORAGE.AUTH.USER_DATA);
  }
};


export const getUserData = () => {
    return JSON.parse(localStorage.getItem(constants.STORAGE.AUTH.USER_DATA));

  };

  export const storeUserProfile = (data) => {
    if (data) {
      localStorage.setItem(constants.STORAGE.AUTH.USER_PORFILE, JSON.stringify(data));
    } else {
      localStorage.removeItem(constants.STORAGE.AUTH.USER_PORFILE);
    }
  };
  export const getUserProfile = () => {
      return JSON.parse(localStorage.getItem(constants.STORAGE.AUTH.USER_PORFILE));
    };


  export const storeKeyClockToken = (data) => {
    if (data) {
      localStorage.setItem(constants.STORAGE.AUTH.KEY_CLOCK_TOKEN, data);
    } else {
      localStorage.removeItem(constants.STORAGE.AUTH.KEY_CLOCK_TOKEN);
    }
  };
  

  export const getKeyClockToken = () => {
    return JSON.parse(localStorage.getItem(constants.STORAGE.AUTH.KEY_CLOCK_TOKEN));

  };

  export const getKeyClockToken_Data = () => {
    return localStorage.getItem(constants.STORAGE.AUTH.KEY_CLOCK_TOKEN);

  };


  export const storeCountryData = (id, data) => {
    if (id && data) {
      localStorage.setItem(`${constants.STORAGE.AUTH.COUNTRY_DATA}-${id}`, JSON.stringify(data));
    } else {
      localStorage.removeItem(constants.STORAGE.AUTH.COUNTRY_DATA);
    }

  }; 

  export const getCountryData = (id) => {
    return JSON.parse(localStorage.getItem(`${constants.STORAGE.AUTH.COUNTRY_DATA}-${id}`));

  };


  export const storeKeyClockUserId = (data) => {
    if (data) {
      localStorage.setItem(`${constants.STORAGE.AUTH.KEY_CLOCK_USER_ID}`, JSON.stringify(data));
    } else {
      localStorage.removeItem(constants.STORAGE.AUTH.KEY_CLOCK_USER_ID);
    }

  }; 

  export const getKeyClockUserId = () => {
    // return localStorage.getItem(constants.STORAGE.AUTH.KEY_CLOCK_USER_ID);
    return JSON.parse(localStorage.getItem(`${constants.STORAGE.AUTH.KEY_CLOCK_USER_ID}`));

  };

  export const storeAboutYou = (data) => {
    if (data) {
      localStorage.setItem(`${constants.STORAGE.AUTH.ABOUT_YOU}`, JSON.stringify(data));
    } else {
      localStorage.removeItem(constants.STORAGE.AUTH.ABOUT_YOU);
    }
  };

  export const getAboutYou = () => {
    return JSON.parse(localStorage.getItem(`${constants.STORAGE.AUTH.ABOUT_YOU}`));

  };


  export const storeCountrySelection = (data) => {
    if (data) {
      localStorage.setItem(`${constants.STORAGE.AUTH.COUNTRY_SELECTION}`, JSON.stringify(data));
    } else {
      localStorage.removeItem(constants.STORAGE.AUTH.COUNTRY_SELECTION);
    }
  };

  export const getCountrySelection = () => {
    return JSON.parse(localStorage.getItem(`${constants.STORAGE.AUTH.COUNTRY_SELECTION}`));

  };

  export const storeEmployeeInfo = (data) => {
    if (data) {
      localStorage.setItem(`${constants.STORAGE.AUTH.EMPLOYEE_INFO}`, JSON.stringify(data));
    } else {
      localStorage.removeItem(constants.STORAGE.AUTH.EMPLOYEE_INFO);
    }
  };

  export const getEmployeeInfo = () => {
    return JSON.parse(localStorage.getItem(`${constants.STORAGE.AUTH.EMPLOYEE_INFO}`));

  };

  export const storeAddUser = (data) => {
    if (data) {
      localStorage.setItem(`${constants.STORAGE.AUTH.ADD_USER}`, JSON.stringify(data));
    } else {
      localStorage.removeItem(constants.STORAGE.AUTH.ADD_USER);
    }
  };

  export const getAddUser = () => {
    return JSON.parse(localStorage.getItem(`${constants.STORAGE.AUTH.ADD_USER}`));

  };

  export const isLastLoginAttempted = () => {
    let isAttempted = sessionStorage.getItem(constants.STORAGE.AUTH.LAST_LOGIN_ATTEMPTED)
    return isAttempted ? true : false
  }

  export const setLastLoginAttempted = () => {
    sessionStorage.setItem(constants.STORAGE.AUTH.LAST_LOGIN_ATTEMPTED, true)
  }

  export const setKeyClockId = (data) => {
    if (data) {
      localStorage.setItem(`${constants.STORAGE.AUTH.KEY_CLOCK_ID}`, data);
    } else {
      localStorage.removeItem(constants.STORAGE.AUTH.KEY_CLOCK_ID);
    }
  };

  export const getKeyClockId = () => {
    return localStorage.getItem(constants.STORAGE.AUTH.KEY_CLOCK_ID);

  };