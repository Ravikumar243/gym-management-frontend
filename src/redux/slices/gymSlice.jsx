import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const getAllGyms = createAsyncThunk(
    "gym/getAllGyms",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/gyms/getAllGym");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch gyms"
            );
        }
    }
);

export const getGymById = createAsyncThunk(
    "gym/getGymById",
    async (gymId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/gyms/getGymById/${gymId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch gym details"
            );
        }
    }
);

export const updateGym = createAsyncThunk(
    "gym/updateGym",
    async ({ gymId, gymData }, { rejectWithValue }) => {
        try {
            const response = await api.put(
                `/gyms/updateGymById/${gymId}`,
                gymData
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update gym"
            );
        }
    }
);

export const updateGymStatus = createAsyncThunk(
    "gym/updateGymStatus",
    async ({ gymId, status }, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                `/gyms/updateActiveDeativeStatus/${gymId}/status`,
                { status }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update gym status"
            );
        }
    }
);

const initialState = {
    gyms: [],
    totalGyms: 0,
    selectedGym: null,

    loading: false,
    detailsLoading: false,
    updateLoading: false,
    statusLoading: false,

    updateSuccess: false,
    statusSuccess: false,

    error: null,
    detailsError: null,
    updateError: null,
    statusError: null,
};

const gymSlice = createSlice({
    name: "gym",
    initialState,

    reducers: {
        clearGymError: (state) => {
            state.error = null;
            state.detailsError = null;
            state.updateError = null;
            state.statusError = null;
        },

        clearGymSuccess: (state) => {
            state.updateSuccess = false;
            state.statusSuccess = false;
        },

        clearSelectedGym: (state) => {
            state.selectedGym = null;
        },

        resetGymState: () => initialState,
    },

    extraReducers: (builder) => {
        builder

            .addCase(getAllGyms.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getAllGyms.fulfilled, (state, action) => {
                state.loading = false;
                state.gyms = action.payload?.gyms || [];
                state.totalGyms =
                    action.payload?.count ||
                    action.payload?.gyms?.length ||
                    0;
            })

            .addCase(getAllGyms.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to fetch gyms";
            })

            .addCase(getGymById.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = null;
            })

            .addCase(getGymById.fulfilled, (state, action) => {
                state.detailsLoading = false;
                state.selectedGym =
                    action.payload?.gym || null;
            })

            .addCase(getGymById.rejected, (state, action) => {
                state.detailsLoading = false;
                state.detailsError =
                    action.payload ||
                    "Failed to fetch gym details";
            })

            .addCase(updateGym.pending, (state) => {
                state.updateLoading = true;
                state.updateSuccess = false;
                state.updateError = null;
            })

            .addCase(updateGym.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.updateSuccess = true;

                const updatedGym = action.payload?.gym;

                if (!updatedGym) return;

                state.selectedGym = updatedGym;

                const index = state.gyms.findIndex(
                    (gym) =>
                        gym._id === updatedGym._id ||
                        gym._id === updatedGym.id
                );

                if (index !== -1) {
                    state.gyms[index] = {
                        ...state.gyms[index],
                        ...updatedGym,
                    };
                }
            })

            .addCase(updateGym.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError =
                    action.payload ||
                    "Failed to update gym";
            })

            .addCase(updateGymStatus.pending, (state) => {
                state.statusLoading = true;
                state.statusSuccess = false;
                state.statusError = null;
            })

            .addCase(
                updateGymStatus.fulfilled,
                (state, action) => {
                    state.statusLoading = false;
                    state.statusSuccess = true;

                    const updatedGym =
                        action.payload?.gym;

                    if (!updatedGym) return;

                    if (state.selectedGym) {
                        if (
                            state.selectedGym._id ===
                            updatedGym._id ||
                            state.selectedGym._id ===
                            updatedGym.id
                        ) {
                            state.selectedGym = {
                                ...state.selectedGym,
                                status: updatedGym.status,
                            };
                        }
                    }

                    const index = state.gyms.findIndex(
                        (gym) =>
                            gym._id === updatedGym._id ||
                            gym._id === updatedGym.id
                    );

                    if (index !== -1) {
                        state.gyms[index] = {
                            ...state.gyms[index],
                            status: updatedGym.status,
                        };
                    }
                }
            )

            .addCase(
                updateGymStatus.rejected,
                (state, action) => {
                    state.statusLoading = false;
                    state.statusError =
                        action.payload ||
                        "Failed to update gym status";
                }
            );
    },
});

export const {
    clearGymError,
    clearGymSuccess,
    clearSelectedGym,
    resetGymState,
} = gymSlice.actions;

export default gymSlice.reducer;