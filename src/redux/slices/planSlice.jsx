import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// =========================================================
// GET PLANS
// =========================================================

export const getPlans = createAsyncThunk(
    "plan/getPlans",

    async (gymId, { rejectWithValue }) => {
        try {
            const response = await api.get(
                "/plan/get-plans",
                {
                    params: {
                        gymId: gymId,
                    },
                }
            );

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch plans"
            );
        }
    }
);



export const createPlan = createAsyncThunk(
    "plan/createPlan",

    async (planData, { rejectWithValue }) => {
        try {

            const response = await api.post(
                "/plan/create-plan",
                planData
            );

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to create plan"
            );

        }
    }
);


// =========================================================
// UPDATE PLAN
// =========================================================

export const updatePlan = createAsyncThunk(
    "plan/updatePlan",

    async (
        { planId, planData },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.put(
                `/plan/update-plan/${planId}`,
                planData
            );

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to update plan"
            );
        }
    }
);


// =========================================================
// DELETE / DEACTIVATE PLAN
// =========================================================

export const deletePlan = createAsyncThunk(
    "plan/deletePlan",

    async (
        { planId, gymId },
        { rejectWithValue }
    ) => {
        try {
            const response = await api.delete(
                `/plan/delete-plan/${planId}`,
                {
                    data: {
                        gymId,
                    },
                }
            );

            return {
                ...response.data,
                planId,
            };

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to deactivate plan"
            );
        }
    }
);



const initialState = {
    loading: false,
    createLoading: false,
    updateLoading: false,
    deleteLoading: false,

    success: false,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,

    error: null,

    plans: [],
    createdPlan: null,
    updatedPlan: null,
};



const planSlice = createSlice({
    name: "plan",

    initialState,

    reducers: {

        clearPlanState: (state) => {

            state.loading = false;
            state.createLoading = false;

            state.success = false;
            state.createSuccess = false;

            state.error = null;

            state.plans = [];
            state.createdPlan = null;
        },


        clearPlanError: (state) => {
            state.error = null;
        },


        clearCreatePlanState: (state) => {
            state.createSuccess = false;
            state.createdPlan = null;
            state.error = null;
        },

    },


    extraReducers: (builder) => {

        builder

            .addCase(getPlans.pending, (state) => {

                state.loading = true;
                state.success = false;
                state.error = null;

            })



            .addCase(getPlans.fulfilled, (state, action) => {

                state.loading = false;
                state.success = true;

                state.plans =
                    action.payload?.plans || [];

                state.error = null;

            })



            .addCase(getPlans.rejected, (state, action) => {

                state.loading = false;
                state.success = false;

                state.error = action.payload;

                state.plans = [];

            })

            .addCase(createPlan.pending, (state) => {

                state.createLoading = true;

                state.createSuccess = false;

                state.error = null;

            })

            .addCase(createPlan.fulfilled, (state, action) => {

                state.createLoading = false;

                state.createSuccess = true;

                state.error = null;

                state.createdPlan =
                    action.payload?.plan || null;

                // Add newly created plan
                // directly into existing list

                if (action.payload?.plan) {

                    state.plans.unshift(
                        action.payload.plan
                    );

                }

            })

            .addCase(createPlan.rejected, (state, action) => {

                state.createLoading = false;

                state.createSuccess = false;

                state.error = action.payload;

            })
            // =================================================
            // UPDATE PLAN - PENDING
            // =================================================

            .addCase(updatePlan.pending, (state) => {
                state.updateLoading = true;
                state.updateSuccess = false;
                state.error = null;
            })


            // =================================================
            // UPDATE PLAN - SUCCESS
            // =================================================

            .addCase(updatePlan.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.updateSuccess = true;
                state.error = null;

                state.updatedPlan =
                    action.payload?.plan || null;

                const updatedPlan =
                    action.payload?.plan;

                if (updatedPlan?._id) {

                    const index = state.plans.findIndex(
                        (plan) =>
                            plan._id === updatedPlan._id
                    );

                    if (index !== -1) {
                        state.plans[index] = updatedPlan;
                    }
                }
            })

            .addCase(updatePlan.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateSuccess = false;
                state.error = action.payload;
            })
            .addCase(deletePlan.pending, (state) => {
                state.deleteLoading = true;
                state.deleteSuccess = false;
                state.error = null;
            })
            .addCase(deletePlan.fulfilled, (state, action) => {

                state.deleteLoading = false;
                state.deleteSuccess = true;
                state.error = null;

                const planId =
                    action.payload?.planId;

                const plan = state.plans.find(
                    (item) => item._id === planId
                );

                if (plan) {
                    // Backend deactivates instead of deleting
                    plan.status = "INACTIVE";
                }
            })

            .addCase(deletePlan.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteSuccess = false;
                state.error = action.payload;
            })

    },
});


export const {
    clearPlanState,
    clearPlanError,
    clearCreatePlanState,
} = planSlice.actions;


export default planSlice.reducer;