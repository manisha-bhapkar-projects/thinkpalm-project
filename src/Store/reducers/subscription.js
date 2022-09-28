import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchClient from "../../utils/axiosConfig";
import constants from "../../utils/constants";

export const getSubscriptionList = async (payload = "{ }") => {
  let obj = {};
  let res = fetchClient.get(`${constants.API.SUBSCRIPTION.GET_ALL_LIST}`, obj)
    .then(res => res.data)
    .catch(console.error);
  return res ? res : false;
};


export const callSubscriptionDataById = async (param) => {
  let res = fetchClient.get(`${constants.API.SUBSCRIPTION.GET}/${param}`)
    .then(res => res.data)
    .catch(console.error);
  return res ? res : false;
};


export const getFeatResult = async (param) => {
  let res = fetchClient.get(`${constants.API.SUBSCRIPTION.GET_FEAT_LIST}`)
    .then(res => res.data)
    .catch(console.error);
  return res ? res : false;
};

export const postSubscriptionData = async (payload = {}, props) => {
  let res = fetchClient.post(`${constants.API.SUBSCRIPTION.POST_DATA}`, payload)
    .then((res) =>
      res.data)
    .catch((error) => {
      props.notify(error?.response?.data?.errors?.toString(), 5000);
      if (error?.response?.data?.message) {
        let result = error.response.data?.message;
        if (result != "") {
          throw result;
        }
      }
    });
  return res;
};

export const EditSubscriptionData = async (payload = {}, id, props) => {
  let res = fetchClient.put(`${constants.API.SUBSCRIPTION.POST_DATA}/${id}`, payload)
    .then(res => res.data)
    .catch((error) => {
      props.notify(error?.response?.data?.errors?.toString(), 5000);

    });
  return res ? res : false;
};



const subscriptionData = createSlice({
  name: "subscriptionData",
  initialState: {
    allData: [],
  },

});

export default subscriptionData.reducer;
