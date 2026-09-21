import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const getDashboardData = createAsyncThunk(
    "dashboard/getDashboardData",
    async (_, { rejectWithValue }) => {
        try {
            const user = JSON.parse(
                localStorage.getItem("user")
            );

            if (!user?.role) {
                return rejectWithValue("User role not found");
            }

            const params = {
                role: user.role,
            };

            // OWNER needs gymId
            if (user.role === "OWNER") {
                params.gymId = user.gymId;
            }

            const response = await api.get("/dashboard/getDashboard", {
                params,
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch dashboard data"
            );
        }
    }
);

const initialState = {
    data: null,
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,

    reducers: {
        clearDashboard: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(
                getDashboardData.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                getDashboardData.fulfilled,
                (state, action) => {
                    state.loading = false;
                    state.data = action.payload;
                }
            )

            .addCase(
                getDashboardData.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            );
    },
});

export const { clearDashboard } =
    dashboardSlice.actions;

export default dashboardSlice.reducer;