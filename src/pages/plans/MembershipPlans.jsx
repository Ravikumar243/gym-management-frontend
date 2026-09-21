import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getPlans,
    createPlan,
    updatePlan,
    deletePlan,
    clearPlanError,
} from "../../redux/slices/planSlice";
import Swal from "sweetalert2";
import "./MembershipPlans.css";

const PLAN_OPTIONS = [
    {
        name: "Monthly Elite",
        duration: 1,
    },
    {
        name: "Quarterly Pro",
        duration: 3,
    },
    {
        name: "Half-Yearly Pro",
        duration: 6,
    },
    {
        name: "Annual Premium",
        duration: 12,
    },
];

const MembershipPlans = () => {
    const dispatch = useDispatch();

    const {
        plans,
        loading,
        createLoading,
        updateLoading,
        deleteLoading,
        error,
    } = useSelector(
        (state) => state.plan
    );

    const [showCreate, setShowCreate] = useState(false);
    const [showEdit, setShowEdit] = useState(false);

    const [selectedPlan, setSelectedPlan] = useState(null);

    const [formData, setFormData] = useState({
        planName: "",
        description: "",
        durationMonths: "",
        price: "",
        status: "ACTIVE",
    });

    const gym = JSON.parse(
        localStorage.getItem("gym")
    );

    const gymId = gym?.id;

    useEffect(() => {

        if (gymId) {
            dispatch(getPlans(gymId));
        }

    }, [dispatch, gymId]);


    const handleChange = (e) => {
        const { name, value } = e.target;

        // Plan selection
        if (name === "planName") {
            const selectedPlan = PLAN_OPTIONS.find(
                (plan) => plan.name === value
            );

            setFormData((prev) => ({
                ...prev,
                planName: value,
                durationMonths: selectedPlan
                    ? selectedPlan.duration
                    : "",
            }));

            return;
        }

        if (name === "price") {
            const numericValue = value.replace(/[^0-9]/g, "");

            setFormData((prev) => ({
                ...prev,
                price: numericValue,
            }));

            return;
        }


        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleStatusToggle = () => {
        setFormData((prev) => ({
            ...prev,
            status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
        }));
    };


    const handleCreatePlan = async (e) => {
        e.preventDefault();

        const planData = {
            gymId: gymId,
            planName: formData.planName,
            description: formData.description,
            durationMonths: Number(formData.durationMonths),
            price: Number(formData.price),
            status: formData.status,
        };

        const result = await dispatch(
            createPlan(planData)
        );

        if (createPlan.fulfilled.match(result)) {

            console.log(
                "Plan created:",
                result.payload
            );

            setShowCreate(false);

            setFormData({
                planName: "",
                description: "",
                durationMonths: "",
                price: "",
                status: "ACTIVE",
            });
        }
    };


    const getDurationText = (months) => {
        if (months === 1) return "1 Month";

        return `${months} Months`;
    };

    const handleEditPlan = (plan) => {

        dispatch(clearPlanError());

        setSelectedPlan(plan);

        setFormData({
            planName:
                plan.planName ||
                plan.name ||
                "",

            description:
                plan.description || "",

            durationMonths:
                plan.durationMonths || "",

            price:
                plan.price ?? "",

            status:
                plan.status || "ACTIVE",
        });

        setShowEdit(true);
    };

    const handleDeletePlan = async (plan) => {

        const result = await Swal.fire({
            icon: "warning",
            title: "Deactivate Plan?",
            text: `Are you sure you want to deactivate "${plan.planName || plan.name}"?`,
            showCancelButton: true,
            confirmButtonText: "Yes, Deactivate",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#dc3545",
        });

        if (!result.isConfirmed) {
            return;
        }

        const response = await dispatch(
            deletePlan({
                planId: plan._id,
                gymId,
            })
        );

        if (
            deletePlan.fulfilled.match(response)
        ) {
            await Swal.fire({
                icon: "success",
                title: "Plan Deactivated",
                text: "The membership plan has been deactivated.",
                timer: 1500,
                showConfirmButton: false,
            });
        }
    };

    const handleUpdatePlan = async (e) => {
        e.preventDefault();

        if (!selectedPlan?._id) {
            return;
        }

        const planData = {
            gymId,

            planName:
                formData.planName.trim(),

            description:
                formData.description.trim(),

            durationMonths:
                Number(formData.durationMonths),

            price:
                Number(formData.price),

            status:
                formData.status,
        };

        const result = await dispatch(
            updatePlan({
                planId: selectedPlan._id,
                planData,
            })
        );

        if (
            updatePlan.fulfilled.match(result)
        ) {
            setShowEdit(false);
            setSelectedPlan(null);

            setFormData({
                planName: "",
                description: "",
                durationMonths: "",
                price: "",
                status: "ACTIVE",
            });
        }
    };

    return (
        <div className="membership-plans-page">

            <div className="membership-plans-header">

                <div>
                    <h1>Membership Plans</h1>

                    <p>
                        Manage and configure your gym
                        membership tiers and pricing.
                    </p>
                </div>

                <button
                    className="add-plan-btn"
                    onClick={() => {
                        dispatch(clearPlanError());
                        setShowCreate(true);
                    }}
                >
                    <i className="bi bi-plus-lg"></i>

                    Add New Plan
                </button>

            </div>



            {error && (
                <div className="plan-error">
                    {error}
                </div>
            )}




            <div className="plans-table-card">

                <div className="plans-table-header">

                    <div>PLAN NAME</div>

                    <div>DURATION</div>

                    <div>PRICE</div>

                    <div>ACTIVE MEMBERS</div>

                    <div>STATUS</div>

                    <div>ACTIONS</div>

                </div>


                {loading ? (

                    <div className="plans-loading">
                        Loading plans...
                    </div>

                ) : plans.length === 0 ? (

                    <div className="plans-empty">
                        No membership plans found.
                    </div>

                ) : (

                    plans.map((plan) => (

                        <div
                            className="plans-table-row"
                            key={plan._id}
                        >

                            {/* PLAN */}

                            <div className="plan-name-column">

                                <strong>
                                    {plan.planName}
                                </strong>

                                <span>
                                    {plan.description ||
                                        "Membership plan"}
                                </span>

                            </div>


                            {/* DURATION */}

                            <div>
                                {getDurationText(
                                    plan.durationMonths
                                )}
                            </div>


                            <div>
                                {Number(
                                    plan.price || 0
                                ).toFixed(2)}
                            </div>


                            {/* ACTIVE MEMBERS */}

                            <div className="active-members">

                                <span></span>

                                {plan.activeMembers || 0}

                            </div>


                            {/* STATUS */}

                            <div>

                                <span
                                    className={`plan-status ${plan.status ===
                                        "ACTIVE"
                                        ? "active"
                                        : "inactive"
                                        }`}
                                >
                                    {plan.status ===
                                        "ACTIVE"
                                        ? "Active"
                                        : "Inactive"}
                                </span>

                            </div>


                            <div className="plan-actions">

                                <button
                                    title="Edit"
                                    onClick={() =>
                                        handleEditPlan(plan)
                                    }
                                >
                                    <i className="bi bi-pencil"></i>
                                </button>

                                <button
                                    title={
                                        plan.status === "ACTIVE"
                                            ? "Deactivate"
                                            : "Inactive"
                                    }
                                    disabled={
                                        plan.status !== "ACTIVE"
                                    }
                                    onClick={() =>
                                        handleDeletePlan(plan)
                                    }
                                >
                                    <i className="bi bi-trash"></i>
                                </button>

                            </div>

                        </div>

                    ))

                )}


                {/* FOOTER */}

                {!loading &&
                    plans.length > 0 && (
                        <div className="plans-table-footer">

                            Showing {plans.length} of{" "}
                            {plans.length} plans

                        </div>
                    )}

            </div>



            {(showCreate || showEdit) && (
                <div
                    className="plan-modal-overlay"
                    onClick={() => {
                        setShowCreate(false);
                        setShowEdit(false);
                        setSelectedPlan(null);
                    }}
                >
                    <div
                        className="plan-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* HEADER */}

                        <div className="plan-modal-header">

                            <div>
                                <h2>
                                    {showEdit
                                        ? "Edit Membership Plan"
                                        : "Create Membership Plan"}
                                </h2>

                                <p>
                                    {showEdit
                                        ? "Update membership plan details and pricing."
                                        : "Define a new subscription offering for members."}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="plan-modal-close"
                                onClick={() => {
                                    setShowCreate(false);
                                    setShowEdit(false);
                                    setSelectedPlan(null);
                                }}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                        </div>


                        {/* BODY */}

                        <form
                            onSubmit={
                                showEdit
                                    ? handleUpdatePlan
                                    : handleCreatePlan
                            }
                        >
                            <div className="plan-modal-body">

                                {/* PLAN NAME */}

                                <div className="plan-form-group">
                                    <select
                                        name="planName"
                                        value={formData.planName}
                                        onChange={handleChange}
                                    >
                                        <option value="">
                                            Select Plan
                                        </option>

                                        {PLAN_OPTIONS.map((plan) => (
                                            <option
                                                key={plan.duration}
                                                value={plan.name}
                                            >
                                                {plan.name}
                                            </option>
                                        ))}
                                    </select>

                                </div>


                                {/* DESCRIPTION */}

                                <div className="plan-form-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Brief details about what this plan includes..."
                                    />

                                </div>


                                {/* DURATION + PRICE */}

                                <div className="plan-form-row">

                                    <div className="plan-form-group">

                                        <label>
                                            Duration (Months)
                                        </label>

                                        <div className="plan-input-icon">

                                            <i className="bi bi-calendar3"></i>

                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                name="durationMonths"
                                                min="1"
                                                value={formData.durationMonths}
                                                onChange={handleChange}
                                            />

                                        </div>

                                    </div>


                                    <div className="plan-form-group">

                                        <label>
                                            Price
                                        </label>

                                        <div className="plan-input-icon">

                                            <span>₹</span>

                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                name="price"
                                                min="0"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                            />

                                        </div>

                                    </div>

                                </div>


                                {/* STATUS */}

                                <div className="plan-status-row">

                                    <div>

                                        <label>
                                            Plan Status
                                        </label>

                                        <p>
                                            Make available for purchase immediately
                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        className={`plan-switch ${formData.status === "ACTIVE"
                                            ? "active"
                                            : ""
                                            }`}
                                        onClick={handleStatusToggle}
                                    >
                                        <span></span>
                                    </button>

                                </div>

                                {error && (
                                    <div className="plan-create-error">
                                        {error}
                                    </div>
                                )}

                            </div>


                            {/* FOOTER */}

                            <div className="plan-modal-footer">

                                <button
                                    type="button"
                                    className="plan-cancel-btn"
                                    onClick={() => {
                                        setShowCreate(false);
                                        setShowEdit(false);
                                        setSelectedPlan(null);
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="plan-create-btn"
                                    disabled={
                                        showEdit
                                            ? updateLoading
                                            : createLoading
                                    }
                                >

                                    {showEdit ? (

                                        updateLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle"></i>
                                                Update Plan
                                            </>
                                        )

                                    ) : (

                                        createLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-plus-circle"></i>
                                                Create Plan
                                            </>
                                        )

                                    )}

                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};

export default MembershipPlans;