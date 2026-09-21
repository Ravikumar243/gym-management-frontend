import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import toast from "react-hot-toast";


export const createMember = createAsyncThunk(
    "member/createMember",

    async (formData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("accessToken");

            const gymData = JSON.parse(
                localStorage.getItem("gym")
            );

            const gymId = gymData?.id;

            if (!gymId) {
                return rejectWithValue(
                    "Gym ID not found. Please login again."
                );
            }

            formData.append("gymId", gymId);

            const response = await api.post(
                "/members/create",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = response?.data

            if (data?.success === true) {
                toast.success(data?.message || "Member created successfully")
            } else {
                toast.error(data?.message || "Something went wrong")
            }

            return data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong"
            );
        }
    }
);


export const getMembers = createAsyncThunk(
    "member/getMembers",

    async (
        {
            gymId,
            page = 1,
            limit = 10,
            status = "",
            planId = "",
            gender = "",
            search = "",
            paymentStatus = "",
            paymentMethod = "",
            assignedTrainer = "",
            startDateFrom = "",
            startDateTo = "",
            expiryDateFrom = "",
            expiryDateTo = "",
        } = {},
        { rejectWithValue }
    ) => {
        try {
            const token =
                localStorage.getItem("accessToken");

            const gymData = JSON.parse(
                localStorage.getItem("gym") || "null"
            );

            const finalGymId =
                gymId || gymData?.id;

            if (!finalGymId) {
                return rejectWithValue(
                    "Gym ID not found. Please login again."
                );
            }

            const response = await api.get(
                "/members/get-members",
                {
                    params: {
                        gymId: finalGymId,
                        page,
                        limit,

                        // Basic filters
                        ...(status && { status }),
                        ...(planId && { planId }),
                        ...(gender && { gender }),

                        // Additional filters
                        ...(search && { search }),
                        ...(paymentStatus && {
                            paymentStatus,
                        }),
                        ...(paymentMethod && {
                            paymentMethod,
                        }),
                        ...(assignedTrainer && {
                            assignedTrainer,
                        }),

                        // Start date
                        ...(startDateFrom && {
                            startDateFrom,
                        }),
                        ...(startDateTo && {
                            startDateTo,
                        }),

                        // Expiry date
                        ...(expiryDateFrom && {
                            expiryDateFrom,
                        }),
                        ...(expiryDateTo && {
                            expiryDateTo,
                        }),
                    },

                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch members"
            );
        }
    }
);


export const renewMembership = createAsyncThunk(
    "member/renewMembership",

    async (
        {
            gymId,
            memberId,
            planId,
            payment,
        },
        { rejectWithValue }
    ) => {
        try {
            if (!gymId) {
                return rejectWithValue(
                    "Gym ID not found. Please login again."
                );
            }

            if (!memberId) {
                return rejectWithValue(
                    "Member ID is required."
                );
            }

            if (!planId) {
                return rejectWithValue(
                    "New membership plan is required."
                );
            }

            if (!payment?.method) {
                return rejectWithValue(
                    "Payment method is required."
                );
            }

            const response = await api.post(
                "/members/renewMemberShip",
                {
                    gymId,
                    memberId,
                    planId,
                    payment,
                }
            );

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to renew membership"
            );
        }
    }
);

export const updateMember = createAsyncThunk(
    "member/updateMember",

    async (
        { memberId, formData },
        { rejectWithValue }
    ) => {
        try {
            const token =
                localStorage.getItem("accessToken");

            const gymData = JSON.parse(
                localStorage.getItem("gym") || "null"
            );

            const gymId = gymData?.id;

            if (!gymId) {
                return rejectWithValue(
                    "Gym ID not found. Please login again."
                );
            }

            formData.append("gymId", gymId);

            const response = await api.put(
                `/members/update/${memberId}`,
                formData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data = response.data;

            if (data?.success) {
                toast.success(
                    data.message ||
                    "Member updated successfully"
                );
            }

            return data;

        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to update member";

            toast.error(message);

            return rejectWithValue(message);
        }
    }
);

export const toggleMemberStatus =
    createAsyncThunk(
        "member/toggleMemberStatus",

        async (memberId, { rejectWithValue }) => {
            try {
                const token =
                    localStorage.getItem("accessToken");

                const gymData = JSON.parse(
                    localStorage.getItem("gym") || "null"
                );

                const gymId = gymData?.id;

                if (!gymId) {
                    return rejectWithValue(
                        "Gym ID not found."
                    );
                }

                const response = await api.patch(
                    `/members/toggle-status/${memberId}`,
                    {
                        gymId,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data = response.data;

                if (data?.success) {
                    toast.success(
                        data.message ||
                        "Member status updated"
                    );
                }

                return data;

            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to update member status";

                toast.error(message);

                return rejectWithValue(message);
            }
        }
    );


export const getMemberById = createAsyncThunk(
    "member/getMemberById",

    async (memberId, { rejectWithValue }) => {
        try {
            const token =
                localStorage.getItem("accessToken");

            const gymData = JSON.parse(
                localStorage.getItem("gym") || "null"
            );

            const gymId = gymData?.id;

            if (!gymId) {
                return rejectWithValue(
                    "Gym ID not found. Please login again."
                );
            }

            const response = await api.get(
                `/members/get-member/${memberId}`,
                {
                    params: {
                        gymId,
                    },
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch member"
            );
        }
    }
);



const initialState = {

    // CREATE
    loading: false,
    success: false,
    error: null,
    member: null,

    // GET
    membersLoading: false,
    membersSuccess: false,
    membersError: null,
    members: [],

    // PAGINATION
    totalMembers: 0,
    currentPage: 1,
    totalPages: 0,

    // RENEW
    renewLoading: false,
    renewSuccess: false,
    renewError: null,
    renewedMember: null,

    updateLoading: false,
    updateError: null,

    statusLoading: false,
    statusError: null,

    memberByIdLoading: false,
    memberByIdError: null,
    selectedMember: null,
};




const memberSlice = createSlice({

    name: "member",

    initialState,

    reducers: {


        clearMemberState: (state) => {

            state.loading = false;
            state.success = false;
            state.error = null;
            state.member = null;

        },



        clearMemberError: (state) => {

            state.error = null;

        },




        clearMembersError: (state) => {

            state.membersError = null;

        },

    },


    extraReducers: (builder) => {

        builder
            .addCase(createMember.pending, (state) => {

                state.loading = true;
                state.success = false;
                state.error = null;

            })
            .addCase(createMember.fulfilled, (state, action) => {

                state.loading = false;
                state.success = true;

                state.member =
                    action.payload?.member || null;

                state.error = null;

            })

            .addCase(createMember.rejected, (state, action) => {

                state.loading = false;
                state.success = false;

                state.error = action.payload;

            })

            .addCase(getMembers.pending, (state) => {

                state.membersLoading = true;
                state.membersSuccess = false;
                state.membersError = null;

            })

            .addCase(getMembers.fulfilled, (state, action) => {

                state.membersLoading = false;
                state.membersSuccess = true;
                state.membersError = null;

                state.members =
                    action.payload?.members || [];

                state.totalMembers =
                    action.payload?.totalMembers || 0;

                state.currentPage =
                    action.payload?.currentPage || 1;

                state.totalPages =
                    action.payload?.totalPages || 0;

            })

            .addCase(getMembers.rejected, (state, action) => {

                state.membersLoading = false;
                state.membersSuccess = false;

                state.membersError = action.payload;

                state.members = [];

                state.totalMembers = 0;
                state.currentPage = 1;
                state.totalPages = 0;

            })


            .addCase(
                renewMembership.pending,
                (state) => {
                    state.renewLoading = true;
                    state.renewSuccess = false;
                    state.renewError = null;
                    state.renewedMember = null;
                }
            )
            .addCase(
                renewMembership.fulfilled,
                (state, action) => {
                    state.renewLoading = false;
                    state.renewSuccess = true;
                    state.renewError = null;

                    state.renewedMember =
                        action.payload?.member || null;

                    // Update member directly in existing list
                    const updatedMember =
                        action.payload?.member;

                    if (updatedMember?._id) {
                        const index = state.members.findIndex(
                            (member) =>
                                member._id === updatedMember._id
                        );

                        if (index !== -1) {
                            state.members[index] =
                                updatedMember;
                        }
                    }
                }
            )


            .addCase(
                renewMembership.rejected,
                (state, action) => {
                    state.renewLoading = false;
                    state.renewSuccess = false;
                    state.renewError = action.payload;
                }
            )
            .addCase(
                updateMember.pending,
                (state) => {
                    state.updateLoading = true;
                    state.updateError = null;
                }
            )

            .addCase(
                updateMember.fulfilled,
                (state, action) => {
                    state.updateLoading = false;

                    const updatedMember =
                        action.payload?.member;

                    if (updatedMember?._id) {
                        const index =
                            state.members.findIndex(
                                (member) =>
                                    member._id ===
                                    updatedMember._id
                            );

                        if (index !== -1) {
                            state.members[index] =
                                updatedMember;
                        }
                    }
                }
            )

            .addCase(
                updateMember.rejected,
                (state, action) => {
                    state.updateLoading = false;
                    state.updateError =
                        action.payload;
                }
            )

            .addCase(
                toggleMemberStatus.pending,
                (state) => {
                    state.inactiveLoading = true;
                    state.inactiveError = null;
                }
            )

            .addCase(
                toggleMemberStatus.fulfilled,
                (state, action) => {
                    state.inactiveLoading = false;

                    const updatedMember =
                        action.payload?.member;

                    if (updatedMember?._id) {
                        const index =
                            state.members.findIndex(
                                (member) =>
                                    member._id ===
                                    updatedMember._id
                            );

                        if (index !== -1) {
                            state.members[index] =
                                updatedMember;
                        }
                    }
                }
            )

            .addCase(
                toggleMemberStatus.rejected,
                (state, action) => {
                    state.inactiveLoading = false;
                    state.inactiveError =
                        action.payload;
                }
            )
            .addCase(
                getMemberById.pending,
                (state) => {
                    state.memberByIdLoading = true;
                    state.memberByIdError = null;
                    state.selectedMember = null;
                }
            )

            .addCase(
                getMemberById.fulfilled,
                (state, action) => {
                    state.memberByIdLoading = false;
                    state.memberByIdError = null;

                    state.selectedMember =
                        action.payload?.member || null;
                }
            )

            .addCase(
                getMemberById.rejected,
                (state, action) => {
                    state.memberByIdLoading = false;
                    state.memberByIdError =
                        action.payload;

                    state.selectedMember = null;
                }
            )

    },

});



export const {
    clearMemberState,
    clearMemberError,
    clearMembersError,
} = memberSlice.actions;




export default memberSlice.reducer;