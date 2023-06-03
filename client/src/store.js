import { createSlice, configureStore } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
  name: "userData",
  initialState: null,
  reducers: {
    setUserData: (state, action) => action.payload,
  },
});

export const { setUserData } = userDataSlice.actions;
export default configureStore({
  reducer: {
    userData: userDataSlice.reducer,
  },
});
