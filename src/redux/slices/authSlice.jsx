import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import toast from "react-hot-toast";



export const ownerLogin = createAsyncThunk(
    "auth/ownerLogin",
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/auth/login",
                loginData
            );

            const data = response.data;

            if (data?.success === true) {
                toast.success(data?.message)
            } else {
                toast.error(data?.message)
            }

            // New login => allow subscription popup again
            if (data?.gym?.id) {
                sessionStorage.removeItem(
                    `subscriptionNotificationShown_${data.gym.id}`
                );
            }

            return data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    }
);


const initialState = {
    user: null,
    gym: null,
    accessToken: null,
    notification: null,

    loading: false,
    error: null,

    isAuthenticated: false,
};



const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        logout: (state) => {

            state.user = null;
            state.gym = null;
            state.accessToken = null;
            state.notification = null;

            state.isAuthenticated = false;

            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
            localStorage.removeItem("gym");
        },

        clearAuthError: (state) => {
            state.error = null;
        },
    },

    extraReducers: (builder) => {

        builder
            .addCase(ownerLogin.pending, (state) => {

                state.loading = true;
                state.error = null;
            })

            .addCase(ownerLogin.fulfilled, (state, action) => {

                state.loading = false;

                state.user = action.payload.user;
                state.gym = action.payload.gym;
                state.accessToken = action.payload.accessToken;
                state.notification = action.payload.notification || null;

                state.isAuthenticated = true;



                // Save for refresh
                localStorage.setItem(
                    "accessToken",
                    action.payload.accessToken
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(action.payload.user)
                );

                localStorage.setItem(
                    "gym",
                    JSON.stringify(action.payload.gym)
                );
            })

            .addCase(ownerLogin.rejected, (state, action) => {

                state.loading = false;

                state.error = action.payload;
                state.isAuthenticated = false;
            });
    },
});

export const {
    logout,
    clearAuthError,
} = authSlice.actions;

export default authSlice.reducer;