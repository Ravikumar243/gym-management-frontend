import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";



export const createTrainer = createAsyncThunk(
    "trainer/createTrainer",
    async (trainerData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");

            const response = await api.post(
                "/trainers/create-trainer",
                trainerData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Failed to create trainer"
            );
        }
    }
);




export const getTrainersByGym = createAsyncThunk(
    "trainer/getTrainersByGym",
    async (gymId, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");

            const response = await api.get(
                `/trainers/get-trainers?gymId=${gymId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    "Failed to fetch trainers"
            );
        }
    }
);




const initialState = {
    trainers: [],

    loading: false,
    createLoading: false,

    error: null,
    createError: null,

    success: false,
    message: "",
};




const trainerSlice = createSlice({
    name: "trainer",

    initialState,

    reducers: {
        clearTrainerError: (state) => {
            state.error = null;
            state.createError = null;
        },

        clearTrainerSuccess: (state) => {
            state.success = false;
            state.message = "";
        },

        clearTrainers: (state) => {
            state.trainers = [];
        },
    },

    extraReducers: (builder) => {


        builder
            .addCase(createTrainer.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
                state.success = false;
            })

            .addCase(createTrainer.fulfilled, (state, action) => {
                state.createLoading = false;

                state.success = true;

                state.message =
                    action.payload?.message ||
                    "Trainer created successfully";

                // Add newly created trainer to list
                if (action.payload?.trainer) {
                    state.trainers.unshift(
                        action.payload.trainer
                    );
                }
            })

            .addCase(createTrainer.rejected, (state, action) => {
                state.createLoading = false;

                state.createError =
                    action.payload ||
                    "Failed to create trainer";
            });


        /* =====================================================
           GET TRAINERS
        ===================================================== */

        builder
            .addCase(getTrainersByGym.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getTrainersByGym.fulfilled, (state, action) => {
                state.loading = false;

                state.trainers =
                    action.payload?.trainers || [];

                state.message =
                    action.payload?.message || "";
            })

            .addCase(getTrainersByGym.rejected, (state, action) => {
                state.loading = false;

                state.error =
                    action.payload ||
                    "Failed to fetch trainers";

                state.trainers = [];
            });
    },
});


export const {
    clearTrainerError,
    clearTrainerSuccess,
    clearTrainers,
} = trainerSlice.actions;


export default trainerSlice.reducer;