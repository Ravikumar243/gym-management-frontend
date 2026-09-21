import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import memberReducer from "./slices/memberSlice";
import planReducer from "./slices/planSlice";
import trainerReducer from "./slices/trainerSlice"
import dashboardReducer from "./slices/dashboardSlice" 
import userReducer from "./slices/userSlice"
import gymReducer from "./slices/gymSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        member: memberReducer,
        plan: planReducer,
        trainer: trainerReducer,
        dashboard: dashboardReducer,
        user: userReducer,
        gym : gymReducer
    },
});