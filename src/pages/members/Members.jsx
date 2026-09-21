import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMembers, toggleMemberStatus, renewMembership } from "../../redux/slices/memberSlice";
import { getPlans } from "../../redux/slices/planSlice";

import "./Members.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Members = () => {
    const dispatch = useDispatch();

    const {
        members,
        membersLoading,
        membersError,
        totalMembers,
        currentPage,
        totalPages,
        renewLoading,
        renewSuccess,
        renewError,
        statusLoading,
    } = useSelector((state) => state.member);

    const { plans } = useSelector((state) => state.plan);


    const gym = JSON.parse(
        localStorage.getItem("gym") || "null"
    );

    const gymId = gym?.id;

    const [status, setStatus] = useState("");
    const [planId, setPlanId] = useState("");
    const [gender, setGender] = useState("");

    const [showRenewModal, setShowRenewModal] = useState(false);

    const [selectedMember, setSelectedMember] = useState(null);

    const [renewPayment, setRenewPayment] = useState("");
    const [renewPaymentMethod, setRenewPaymentMethod] = useState("CASH");
    const [renewPlanId, setRenewPlanId] = useState("");


    const [page, setPage] = useState(1);

    const limit = 10;

    const navigate = useNavigate()


    useEffect(() => {
        if (!gymId) return;

        dispatch(
            getMembers({
                gymId,
                page,
                limit,
                status,
                planId,
                gender,
            })
        );
    }, [
        dispatch,
        gymId,
        page,
        status,
        planId,
        gender,
    ]);


    useEffect(() => {
        if (gymId) {
            dispatch(getPlans(gymId));
        }
    }, [dispatch, gymId]);



    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setPage(1);
    };

    const handlePlanChange = (e) => {
        setPlanId(e.target.value);
        setPage(1);
    };

    const handleGenderChange = (e) => {
        setGender(e.target.value);
        setPage(1);
    };


    const handlePrevious = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };



    const getStatusClass = (member) => {
        const memberStatus = member.status?.toUpperCase();

        if (memberStatus === "ACTIVE") {
            return "active";
        }

        if (memberStatus === "EXPIRED") {
            return "expired";
        }

        return "pending";
    };

    const getPaymentClass = (status) => {
        if (status === "PAID") {
            return "paid";
        }

        if (status === "OVERDUE") {
            return "overdue";
        }

        return "pending";
    };


    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleOpenRenew = (member) => {
        setSelectedMember(member);

        // Default selected plan = current plan
        setRenewPlanId(member?.planId?._id || "");

        const planPrice = Number(
            member?.planId?.price ||
            member?.plan?.price ||
            member?.payment?.total ||
            0
        );

        setRenewPayment(planPrice);

        setRenewPaymentMethod(
            member?.payment?.method || "CASH"
        );

        setShowRenewModal(true);
    };


    const handleCloseRenew = () => {
        if (renewLoading) return;

        setShowRenewModal(false);
        setSelectedMember(null);
        setRenewPayment("");
        setRenewPaymentMethod("CASH");
        setRenewPlanId("");
    };

    const getRenewalDates = (member, plan) => {
        if (!member) {
            return {
                renewalStart: null,
                newExpiry: null,
            };
        }

        const today = new Date();

        const currentExpiry = new Date(
            member.expiryDate
        );

        let renewalStart;

        // If current membership is still active,
        // renewal starts from existing expiry date.
        if (
            !isNaN(currentExpiry.getTime()) &&
            currentExpiry > today
        ) {
            renewalStart = currentExpiry;
        } else {
            // If membership already expired,
            // renewal starts from today.
            renewalStart = today;
        }

        const newExpiry = new Date(renewalStart);

        // IMPORTANT:
        // Use NEW selected plan duration
        const durationMonths = Number(
            plan?.durationMonths || 0
        );

        newExpiry.setMonth(
            newExpiry.getMonth() + durationMonths
        );

        return {
            renewalStart,
            newExpiry,
        };
    };

    const handleRenewMembership = async () => {

        if (!selectedMember) return;

        if (!renewPlanId) {
            return;
        }

        const amount = Number(renewPayment);

        if (!amount || amount <= 0) {
            return;
        }

        const result = await dispatch(
            renewMembership({
                gymId,

                memberId:
                    selectedMember._id,

                planId: renewPlanId,

                payment: {
                    total: amount,
                    method: renewPaymentMethod,
                },
            })
        );

        if (
            renewMembership.fulfilled.match(result)
        ) {

            setShowRenewModal(false);
            setSelectedMember(null);

            setRenewPayment("");
            setRenewPaymentMethod("CASH");
            setRenewPlanId("");
        }
    };

    const handleEdit = (member) => {
        navigate(`/members/edit/${member._id}`)
    };

    const handleToggleStatus = async (member) => {

        const isActive =
            member.status?.toUpperCase() === "ACTIVE";

        const newStatus =
            isActive ? "INACTIVE" : "ACTIVE";

        const result = await Swal.fire({
            title: isActive
                ? "Make Member Inactive?"
                : "Activate Member?",

            text: isActive
                ? `${member.firstName} ${member.lastName} will be marked as inactive.`
                : `${member.firstName} ${member.lastName} will be activated.`,

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: isActive
                ? "Yes, Make Inactive"
                : "Yes, Activate",

            cancelButtonText: "Cancel",

            confirmButtonColor: isActive
                ? "#dc3545"
                : "#198754",

            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        await dispatch(
            toggleMemberStatus(member._id)
        );
    };

    return (
        <div className="members-page">

            <div className="members-header">

                <div>
                    <h1>Members</h1>

                    <p>
                        Manage your gym members, track attendance,
                        and monitor payments.
                    </p>
                </div>

                <div className="members-header-actions">

                    <button className="members-export-btn">
                        <i className="bi bi-download"></i>
                        Export
                    </button>

                    <button
                        className="members-add-btn"
                        onClick={() =>
                            window.location.href = "/members/add"
                        }
                    >
                        <i className="bi bi-plus-lg"></i>
                        Add Member
                    </button>

                </div>

            </div>


            <div className="members-filter-card">

                <select
                    value={status}
                    onChange={handleStatusChange}
                >
                    <option value="">
                        All Statuses
                    </option>

                    <option value="ACTIVE">
                        Active
                    </option>
                    <option value="INACTIVE">
                        Inactive
                    </option>

                    <option value="EXPIRED">
                        Expired
                    </option>

                    <option value="PENDING">
                        Pending
                    </option>

                </select>


                <select
                    value={planId}
                    onChange={handlePlanChange}
                >
                    <option value="">
                        All Plans
                    </option>

                    {plans
                        ?.filter((plan) => plan.status === "ACTIVE")
                        .map((plan) => (
                            <option
                                key={plan._id}
                                value={plan._id}
                            >
                                {plan.planName}
                            </option>
                        ))}

                </select>


                <select
                    value={gender}
                    onChange={handleGenderChange}
                >
                    <option value="">
                        Gender
                    </option>

                    <option value="MALE">
                        Male
                    </option>

                    <option value="FEMALE">
                        Female
                    </option>

                    <option value="OTHER">
                        Other
                    </option>

                </select>


                <div className="members-count">

                    Showing{" "}
                    {members.length > 0
                        ? `${(page - 1) * limit + 1}-${Math.min(
                            page * limit,
                            totalMembers
                        )}`
                        : "0"}{" "}
                    of{" "}
                    <strong>
                        {totalMembers}
                    </strong>{" "}
                    members

                </div>

            </div>


            <div className="members-table-card">

                <div className="members-table-header">

                    <div>MEMBER</div>

                    <div>ID / CONTACT</div>

                    <div>MEMBERSHIP PLAN</div>

                    <div>STATUS & EXPIRY</div>

                    <div>PAYMENT</div>

                    <div>ACTIONS</div>

                </div>


                {membersLoading ? (

                    <div className="members-loading">
                        Loading members...
                    </div>

                ) : membersError ? (

                    <div className="members-error">
                        {membersError}
                    </div>

                ) : members.length === 0 ? (

                    <div className="members-empty">
                        No members found.
                    </div>

                ) : (

                    members.map((member) => (

                        <div
                            className="members-table-row"
                            key={member._id}
                        >

                            {/* MEMBER */}

                            <div className="member-info">

                                {member.profilePhoto?.url ? (

                                    <img
                                        src={
                                            member.profilePhoto.url
                                        }
                                        alt=""
                                    />

                                ) : (

                                    <div className="member-avatar">
                                        {member.firstName
                                            ?.charAt(0)
                                            ?.toUpperCase()}
                                    </div>

                                )}

                                <div>

                                    <strong>
                                        {member.firstName}{" "}
                                        {member.lastName}
                                    </strong>

                                    <span>
                                        {member.gender
                                            ? `${member.gender}, `
                                            : ""}
                                        {member.age
                                            ? member.age
                                            : ""}
                                    </span>

                                </div>

                            </div>


                            {/* ID / CONTACT */}

                            <div className="member-contact">

                                <strong>
                                    #MEM-{member._id?.slice(-4)}
                                </strong>

                                <span>
                                    {member.email}
                                </span>

                                <span>
                                    {member.phone}
                                </span>

                            </div>


                            {/* PLAN */}

                            <div className="member-plan">

                                <strong>
                                    {member.planId?.name ||
                                        member.plan?.name ||
                                        "Membership Plan"}
                                </strong>

                                <span>
                                    $
                                    {Number(
                                        member.payment?.total ||
                                        member.planId?.price ||
                                        0
                                    ).toFixed(2)}
                                    {" / "}
                                    {member.durationMonths ||
                                        member.planId?.durationMonths ||
                                        0}{" "}
                                    mo
                                </span>

                            </div>


                            {/* STATUS */}

                            <div className="member-status">

                                <span
                                    className={`member-status-badge ${getStatusClass(
                                        member
                                    )}`}
                                >
                                    {member.status ||
                                        "Pending"}
                                </span>

                                <span>
                                    {member.expiryDate
                                        ? `Expires: ${formatDate(
                                            member.expiryDate
                                        )}`
                                        : "Expiry not available"}
                                </span>

                            </div>


                            {/* PAYMENT */}

                            <div className="member-payment">

                                <span
                                    className={getPaymentClass(
                                        member.payment?.status
                                    )}
                                >
                                    <i
                                        className={`bi ${member.payment?.status ===
                                            "PAID"
                                            ? "bi-check-circle-fill"
                                            : member.payment?.status ===
                                                "OVERDUE"
                                                ? "bi-exclamation-circle-fill"
                                                : "bi-clock"
                                            }`}
                                    ></i>

                                    {member.payment?.status ||
                                        "Pending"}

                                </span>

                            </div>


                            <div className="member-actions">

                                <button
                                    type="button"
                                    className="member-renew-btn"
                                    title="Renew Membership"
                                    onClick={() =>
                                        handleOpenRenew(member)
                                    }
                                >
                                    <i className="bi bi-arrow-clockwise"></i>
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-light"
                                    onClick={() => handleEdit(member)}
                                >
                                    <i className="bi bi-pencil"></i>
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-sm btn-light"
                                    onClick={() =>
                                        handleToggleStatus(member)
                                    }
                                    disabled={statusLoading}
                                    title={
                                        member.status?.toUpperCase() === "ACTIVE"
                                            ? "Make Inactive"
                                            : "Activate Member"
                                    }
                                >
                                    <i
                                        className={
                                            member.status?.toUpperCase() === "ACTIVE"
                                                ? "bi bi-person-x"
                                                : "bi bi-person-check"
                                        }
                                    ></i>
                                </button>

                            </div>

                        </div>

                    ))

                )}


                {!membersLoading &&
                    members.length > 0 && (

                        <div className="members-table-footer">

                            <div>
                                Rows per page:
                                <select
                                    value={limit}
                                    disabled
                                >
                                    <option>
                                        10
                                    </option>
                                </select>
                            </div>


                            <div className="members-pagination">

                                <button
                                    onClick={handlePrevious}
                                    disabled={page === 1}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                </button>

                                <span className="active">
                                    {page}
                                </span>

                                <span>
                                    of {totalPages}
                                </span>

                                <button
                                    onClick={handleNext}
                                    disabled={
                                        page >= totalPages
                                    }
                                >
                                    <i className="bi bi-chevron-right"></i>
                                </button>

                            </div>

                        </div>

                    )}

            </div>


            {showRenewModal &&
                selectedMember &&
                (() => {
                    const selectedPlan = plans?.find(
                        (plan) => plan._id === renewPlanId
                    );
                    const {
                        renewalStart,
                        newExpiry,
                    } = getRenewalDates(
                        selectedMember,
                        selectedPlan
                    );

                    const currentPlanName =
                        selectedMember?.planId?.name ||
                        selectedMember?.plan?.name ||
                        "Membership Plan";

                    const currentPlanPrice = Number(
                        selectedMember?.planId?.price ||
                        selectedMember?.plan?.price ||
                        selectedMember?.payment?.total ||
                        0
                    );

                    const currentDuration = Number(
                        selectedMember?.durationMonths ||
                        selectedMember?.planId?.durationMonths ||
                        selectedMember?.plan?.durationMonths ||
                        0
                    );

                    const newPlanName =
                        selectedPlan?.name || "Select Plan";

                    const newPlanPrice =
                        Number(selectedPlan?.price || 0);

                    const newDuration =
                        Number(selectedPlan?.durationMonths || 0);

                    const planPrice = Number(
                        selectedMember?.planId?.price ||
                        selectedMember?.plan?.price ||
                        selectedMember?.payment?.total ||
                        0
                    );

                    const durationMonths = Number(
                        selectedMember?.durationMonths ||
                        selectedMember?.planId?.durationMonths ||
                        selectedMember?.plan?.durationMonths ||
                        0
                    );

                    return (
                        <div
                            className="renew-modal-overlay"
                            onMouseDown={(e) => {
                                if (
                                    e.target ===
                                    e.currentTarget
                                ) {
                                    handleCloseRenew();
                                }
                            }}
                        >

                            <div className="renew-modal">

                                {/* HEADER */}

                                <div className="renew-modal-header">

                                    <div>
                                        <h2>
                                            Renew Membership
                                        </h2>

                                        <p>
                                            Renew the member's
                                            current membership
                                            plan
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="renew-modal-close"
                                        onClick={
                                            handleCloseRenew
                                        }
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>

                                </div>


                                {/* BODY */}

                                <div className="renew-modal-body">


                                    <div className="renew-member-card">

                                        {selectedMember
                                            ?.profilePhoto
                                            ?.url ? (

                                            <img
                                                src={
                                                    selectedMember
                                                        .profilePhoto
                                                        .url
                                                }
                                                alt=""
                                            />

                                        ) : (

                                            <div className="renew-member-avatar">
                                                {selectedMember
                                                    ?.firstName
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}
                                            </div>

                                        )}

                                        <div className="renew-member-info">

                                            <div className="renew-member-name">

                                                <strong>
                                                    {
                                                        selectedMember.firstName
                                                    }{" "}
                                                    {
                                                        selectedMember.lastName
                                                    }
                                                </strong>

                                                <span className="renew-active-badge">
                                                    ACTIVE
                                                </span>

                                            </div>

                                            <div className="renew-member-contact">

                                                <span>
                                                    <i className="bi bi-envelope"></i>
                                                    {
                                                        selectedMember.email
                                                    }
                                                </span>

                                                <span className="renew-contact-divider">
                                                    •
                                                </span>

                                                <span>
                                                    <i className="bi bi-telephone"></i>
                                                    {
                                                        selectedMember.phone
                                                    }
                                                </span>

                                            </div>

                                        </div>

                                    </div>

                                    <div className="renew-new-plan-section">

                                        <div className="renew-payment-title">
                                            <i className="bi bi-box-seam"></i>
                                            SELECT MEMBERSHIP PLAN
                                        </div>

                                        <div className="renew-payment-line"></div>

                                        <div className="renew-field">

                                            <label>
                                                New Membership Plan
                                            </label>

                                            <select
                                                value={renewPlanId}
                                                onChange={(e) => {
                                                    const selectedPlanId = e.target.value;

                                                    setRenewPlanId(selectedPlanId);

                                                    const selectedPlan = plans?.find(
                                                        (plan) => plan._id === selectedPlanId
                                                    );

                                                    if (selectedPlan) {
                                                        setRenewPayment(
                                                            Number(selectedPlan.price || 0)
                                                        );
                                                    }
                                                }}
                                            >

                                                <option value="">
                                                    Select Membership Plan
                                                </option>

                                                {plans?.map((plan) => (
                                                    <option
                                                        key={plan._id}
                                                        value={plan._id}
                                                        disabled={plan.status !== "ACTIVE"}
                                                    >
                                                        {plan.name} - ₹
                                                        {Number(plan.price || 0).toLocaleString("en-IN")}
                                                        {" / "}
                                                        {plan.durationMonths} Month
                                                        {plan.durationMonths > 1 ? "s" : ""}
                                                    </option>
                                                ))}

                                            </select>

                                        </div>

                                    </div>

                                    <div className="renew-plan-grid">

                                        {/* CURRENT PLAN */}

                                        <div className="renew-info-box">

                                            <div className="renew-box-title">
                                                <i className="bi bi-clock-history"></i>
                                                CURRENT PLAN
                                            </div>

                                            <div className="renew-current-plan">

                                                <div className="renew-plan-top">
                                                    <strong>
                                                        {currentPlanName}
                                                    </strong>

                                                    <strong>
                                                        ₹{currentPlanPrice.toLocaleString("en-IN")}
                                                    </strong>
                                                </div>

                                                <div className="renew-detail-row">
                                                    <span>Duration</span>
                                                    <strong>
                                                        {currentDuration} Months
                                                    </strong>
                                                </div>

                                                <div className="renew-detail-row">
                                                    <span>Expiry Date</span>

                                                    <strong className="renew-old-expiry">
                                                        {selectedMember.expiryDate
                                                            ? formatDate(selectedMember.expiryDate)
                                                            : "-"
                                                        }
                                                    </strong>
                                                </div>

                                            </div>

                                        </div>


                                        <div className="renew-info-box renewal-summary-box">

                                            <div className="renew-box-title renewal-title">
                                                <i className="bi bi-arrow-clockwise"></i>
                                                RENEWAL SUMMARY
                                            </div>

                                            <div className="renew-summary-content">

                                                <div className="renew-plan-top">

                                                    <strong>
                                                        {newPlanName}
                                                    </strong>

                                                    <strong>
                                                        ₹{newPlanPrice.toLocaleString("en-IN")}
                                                    </strong>

                                                </div>

                                                <div className="renew-detail-row">

                                                    <span>
                                                        Duration
                                                    </span>

                                                    <strong>
                                                        {newDuration} Months
                                                    </strong>

                                                </div>

                                                <div className="renew-detail-row">

                                                    <span>
                                                        Renewal Start
                                                    </span>

                                                    <strong>
                                                        {renewalStart
                                                            ? formatDate(renewalStart)
                                                            : "-"
                                                        }
                                                    </strong>

                                                </div>

                                                <div className="renew-new-expiry">

                                                    <span>
                                                        New Expiry
                                                    </span>

                                                    <strong>
                                                        {newExpiry
                                                            ? formatDate(newExpiry)
                                                            : "-"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>

                                        </div>

                                    </div>


                                    {/* PAYMENT */}

                                    <div className="renew-payment-section">

                                        <div className="renew-payment-title">

                                            <i className="bi bi-cash-stack"></i>

                                            PAYMENT DETAILS

                                        </div>

                                        <div className="renew-payment-line"></div>


                                        <div className="renew-payment-grid">

                                            <div className="renew-field">

                                                <label>
                                                    Payment Amount
                                                </label>

                                                <div className="renew-input-wrapper">

                                                    <span>
                                                        ₹
                                                    </span>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={
                                                            renewPayment
                                                        }
                                                        onChange={(
                                                            e
                                                        ) =>
                                                            setRenewPayment(
                                                                e.target.value
                                                            )
                                                        }
                                                    />

                                                </div>

                                            </div>


                                            <div className="renew-field">

                                                <label>
                                                    Payment Method
                                                </label>

                                                <select
                                                    value={
                                                        renewPaymentMethod
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        setRenewPaymentMethod(
                                                            e.target.value
                                                        )
                                                    }
                                                >

                                                    <option value="CASH">
                                                        Cash
                                                    </option>

                                                    <option value="UPI">
                                                        UPI
                                                    </option>

                                                    <option value="CREDIT_CARD">
                                                        Credit Card
                                                    </option>

                                                    <option value="DEBIT_CARD">
                                                        Debit Card
                                                    </option>

                                                    <option value="BANK_TRANSFER">
                                                        Bank Transfer
                                                    </option>

                                                    <option value="OTHER">
                                                        Other
                                                    </option>

                                                </select>

                                            </div>

                                        </div>

                                    </div>

                                </div>


                                {/* FOOTER */}

                                <div className="renew-modal-footer">

                                    <span className="renew-paid-badge">

                                        <i className="bi bi-check-circle"></i>

                                        {Number(
                                            renewPayment
                                        ) > 0
                                            ? "PAID"
                                            : "PENDING"}

                                    </span>

                                    <div className="renew-footer-actions">

                                        <button
                                            type="button"
                                            className="renew-cancel-btn"
                                            onClick={
                                                handleCloseRenew
                                            }
                                            disabled={
                                                renewLoading
                                            }
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className="renew-submit-btn"
                                            onClick={
                                                handleRenewMembership
                                            }
                                            disabled={
                                                renewLoading ||
                                                !renewPlanId ||
                                                !Number(renewPayment)
                                            }
                                        >

                                            {renewLoading ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                    ></span>

                                                    Renewing...
                                                </>
                                            ) : (
                                                "Renew Membership"
                                            )}

                                        </button>

                                    </div>

                                </div>


                                {renewError && (
                                    <div className="renew-error">
                                        {renewError}
                                    </div>
                                )}

                            </div>

                        </div>
                    );
                })()}

        </div>
    );
};

export default Members;