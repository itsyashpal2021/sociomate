import { createSlice, configureStore } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
  name: "userData",
  initialState: null,
  reducers: {
    setUserData: (state, action) => action.payload,
    removeAccount: (state, action) => {
      delete state.accounts[action.payload];
      return state;
    },
    addAccount: (state, action) => {
      state.accounts[action.payload.platform] = {
        ...action.payload.accountData,
      };
      return state;
    },
  },
});

export const { setUserData, removeAccount, addAccount } = userDataSlice.actions;
export default configureStore({
  reducer: {
    userData: userDataSlice.reducer,
  },
});
