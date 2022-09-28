import axios from "axios";
import config from "../Config"
import keycloak from "../keycloak";
import { notifyAction } from "../Store/reducers/notification";
import store from "../Store"



const fetchClient = () => {
  const defaultOptions = {
    baseURL: `${config.apiUrl}`,
  };


  const instance = axios.create(defaultOptions);

  if (instance && instance.interceptors) {
    instance.interceptors.request.use((config) => {
      if (keycloak.authenticated) {
        config.headers.Authorization = `Bearer ${keycloak.token}`;
        return Promise.resolve(config);

        // const validToken = keycloak.updateToken(5)
        //   .then(function (refreshed) {
        //     if (refreshed) {
        //       alert('Token was successfully refreshed');
        //       return true;

        //     } else {
        //       alert('Token is still valid');
        //       return true;

        //     }
        //   }).catch(function () {
        //     alert('Failed to refresh the token, or the session has expired');
        //   });
        // if (validToken) {
        //   config.headers.Authorization = `Bearer ${keycloak.token}`;
        //   return Promise.resolve(config);
        // }

      };
    })
    instance.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        // if (error.message === "Network Error") {
        //   keycloak?.logout({ redirectUri: window.location.origin + '/login' });
        // }
        if (
          error.response
          // error.response.config.url !== API_END_POINTS.SaveAsDraft
        ) {

          switch (error.response.status) {
            case 500:
              // showAlert("Internal Server Error", "error");
              break;
            case 402:
              // showAlert(error.response.data);
              break;
            case 401:
              keycloak?.logout({ redirectUri: window.location.origin + '/login' });
              // history.push("/unauthorized");
              break;
            case 404:
              // showAlert("Something went wrong.", "error");
              break;
            case 422:
              // showAlert("Something went wrong.", "error");
              break;
            default:
              // return store.dispatch(
              //   notifyAction({
              //     message: error?.response?.data?.errors[0],
              //     timeOut: 1500,
              //   }))
              break;
          }
        }

        return Promise.reject(error);
      }
    );

  }

  return instance;
};

export default fetchClient();























