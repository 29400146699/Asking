// src/redux/uiSlice.js
import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    loginModalOpen: false,
  },
  reducers: {
    openLoginModal(state) {
      state.loginModalOpen = true;
    },
    closeLoginModal(state) {
      state.loginModalOpen = false;
    },
    updateAvatar(state, action) {
  if (state.user) {
    state.user.avatar = action.payload;
  }
}
  },
});

export const { openLoginModal, closeLoginModal } = uiSlice.actions;
export default uiSlice.reducer;
