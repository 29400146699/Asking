import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { isLogin: false, userInfo: {} },
  reducers: {
    loginSuccess(state, { payload }) {
      state.isLogin = true;
      state.userInfo = payload;
    },
    logout(state) {
      state.isLogin = false;
      state.userInfo = {};
    },
    
updateAvatar(state, { payload }) {
      state.userInfo = state.userInfo || {};
      state.userInfo.avatar = payload;
    },
  }
});

export const { loginSuccess, logout, updateAvatar } = userSlice.actions;

export default userSlice.reducer;
