import axios from "axios";
import constants from "./constants";
// import history from "./history";
import {getKeyClockToken_Data} from "./storage";
const fetchClient = () => {
  const defaultOptions = {
    baseURL: `${constants.API.BASEURL.MOCK}`,

  };
  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use(
    (config) => {
      const token = getKeyClockToken_Data();
      config.headers.Authorization = token ? `Bearer ${token}` : "";
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
 return instance;
};

export default fetchClient();

