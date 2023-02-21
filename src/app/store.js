import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../state/index/authSlice';

export const store = configureStore({
    reducer: {
        auth : authReducer,
    },
})