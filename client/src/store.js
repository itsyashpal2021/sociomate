import { createSlice, configureStore } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
  name: "userData",
  initialState: null,
  reducers: {
    setUserData: (state, action) => action.payload,
    removeAccount: (state, action) => {
      state.accounts[action.payload] = undefined;
      return state;
    },
  },
});

export const { setUserData, removeAccount } = userDataSlice.actions;
export default configureStore({
  reducer: {
    userData: userDataSlice.reducer,
  },
});
