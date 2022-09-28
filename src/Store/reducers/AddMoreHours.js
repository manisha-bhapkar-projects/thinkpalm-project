import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { format } from "lodash";
import fetchClient from "../../utils/axiosConfig";
import constants from "../../utils/constants";
import { notifyAction } from "./notification";


export const getHoursApiList = createAsyncThunk(
    "AddMoreHours/getHoursApiList",
    async (payload = {}) => {
        let res = await fetchClient
            .get(`${constants.API.ADD_MORE_HOURS.EXPERT_HOUR}`, {
            })
            .then((res) => {
                return res.data
            })
            .catch(console.error);
        return res;
    });

export const addHoursToCart = async (data) => {
    let res = await fetchClient
        .post(`${constants.API.ADD_MORE_HOURS.ADD_TO_CART}`, data)
        .then((res) => res.data)
        .catch(console.error);
    return res ? res : false;
};
export const addHoursToEstimate = async (data) => {
    let res = await fetchClient
        .post(`${constants.API.ADD_MORE_HOURS.ADD_HOURS}`, data)
        .then((res) => res.data)
        .catch((err) => {
            return err?.response?.data
        });
    return res;
};


const AddMoreHours = createSlice({
    name: "AddMoreHours",
    initialState: {
        hourList: [],
        hourListLoading: false
    },
    reducers: {},
    extraReducers: {
        [getHoursApiList.pending]: (state, action) => {
            state.hourListLoading = true
        },
        [getHoursApiList.fulfilled]: (state, action) => {
            state.hourList = action?.payload?.data || [];
            state.hourListLoading = false
        },
        [getHoursApiList.rejected]: (state, action) => {
            state.hourListLoading = false
        },
    },
});

export default AddMoreHours.reducer;
