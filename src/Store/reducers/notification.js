import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export const notifyAction = createAsyncThunk(
  "notification/notify",
  async (payload = {}) => {
    return {
      title: payload.title || "",
      message: payload.message,
      timeOut: payload.timeOut,
    };
  }
);

export const notifyTurnOff = createAsyncThunk(
  "notification/notifyTurnOff",
  async (payload = {}) => {
    return {
      title: '',
      message: '',
      timeOut: 0,
    };
  }
);

const notification = createSlice({
  name: "notificationReducer",
  initialState: {
    message: "",
    title: "",
    defaultTimeOut: 3000,
    timeOut: 0,
  },
  reducers: {},
  extraReducers: {
    [notifyAction.fulfilled]: (state, action) => {
      console.log('notify', action)
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.timeOut = action.payload.timeOut;
    },
    [notifyTurnOff.fulfilled]: (state, action) => {
      // console.log('notifyTurnOff', action)
      state.title = action.payload.title;
      state.message = action.payload.message;
      state.timeOut = action.payload.timeOut;
    },
  }
})

export default notification.reducer;
