import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import uiReducer from "./uiSlice";

export default configureStore({
    reducer: {
        user: userReducer,
         ui: uiReducer, 
    }
});
