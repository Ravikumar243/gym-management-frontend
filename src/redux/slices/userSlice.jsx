import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const createUser = createAsyncThunk(
    "user/createUser",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post(
                "/auth/create-user",
                formData
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to create user"
            );
        }
    }
);

const initialState = {
    loading: false,
    success: false,
    error: null,
    createdUser: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,

    reducers: {
        clearUserState: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
            state.createdUser = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(createUser.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })

            .addCase(createUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.createdUser = action.payload;
            })

            .addCase(createUser.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });
    },
});

export const {
    clearUserState,
} = userSlice.actions;

export default userSlice.reducer;