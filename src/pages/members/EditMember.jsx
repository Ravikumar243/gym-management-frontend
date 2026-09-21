import React, { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import {
    updateMember,
    getMemberById,
    clearMemberError,
} from "../../redux/slices/memberSlice"

import { getPlans } from "../../redux/slices/planSlice";
import { getTrainersByGym } from "../../redux/slices/trainerSlice";

import "./EditMember.css";


const EditMember = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { memberId } = useParams();

    const {
        updateLoading,
        updateError,
        memberByIdLoading,
        memberByIdError,
        selectedMember,
    } = useSelector((state) => state.member);

    const { plans } = useSelector(
        (state) => state.plan
    );

    const { trainers } = useSelector(
        (state) => state.trainer
    );

    const gymData = JSON.parse(
        localStorage.getItem("gym") || "null"
    );

    const gymId = gymData?.id;



    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        email: "",
        phone: "",

        street: "",
        city: "",
        state: "",
        postalCode: "",

        planId: "",
        startDate: "",
        assignedTrainer: "",

        emergencyName: "",
        emergencyRelationship: "",
        emergencyPhone: "",

        autoRenew: false,

        profilePhoto: null,
    });


    const [photoPreview, setPhotoPreview] = useState("");

    const [member, setMember] = useState(null);




    useEffect(() => {

        if (!gymId || !memberId) {
            return;
        }

        dispatch(getPlans(gymId));

        dispatch(getTrainersByGym(gymId));

        dispatch(getMemberById(memberId));

    }, [dispatch, gymId, memberId]);

    useEffect(() => {

        if (!selectedMember) {
            return;
        }

        setMember(selectedMember);

        setFormData({
            firstName:
                selectedMember.firstName || "",

            lastName:
                selectedMember.lastName || "",

            dateOfBirth:
                selectedMember.dateOfBirth
                    ? new Date(
                        selectedMember.dateOfBirth
                    )
                        .toISOString()
                        .split("T")[0]
                    : "",

            gender:
                selectedMember.gender || "",

            email:
                selectedMember.email || "",

            phone:
                selectedMember.phone || "",


            street:
                selectedMember.address?.street || "",

            city:
                selectedMember.address?.city || "",

            state:
                selectedMember.address?.state || "",

            postalCode:
                selectedMember.address?.postalCode || "",


            planId:
                selectedMember.planId?._id ||
                selectedMember.planId ||
                "",

            startDate:
                selectedMember.startDate
                    ? new Date(
                        selectedMember.startDate
                    )
                        .toISOString()
                        .split("T")[0]
                    : "",

            assignedTrainer:
                selectedMember.assignedTrainer?._id ||
                selectedMember.assignedTrainer ||
                "",


            emergencyName:
                selectedMember.emergencyContact?.name ||
                "",

            emergencyRelationship:
                selectedMember.emergencyContact?.relationship ||
                "",

            emergencyPhone:
                selectedMember.emergencyContact?.phone ||
                "",


            autoRenew:
                Boolean(
                    selectedMember.autoRenew
                ),

            profilePhoto: null,
        });


        if (
            selectedMember.profilePhoto?.url
        ) {
            setPhotoPreview(
                selectedMember.profilePhoto.url
            );
        }

    }, [selectedMember]);



    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
            files,
        } = e.target;


        // PROFILE PHOTO
        if (type === "file") {

            const file =
                files?.[0] || null;

            setFormData((prev) => ({
                ...prev,
                profilePhoto: file,
            }));

            if (file) {
                setPhotoPreview(
                    URL.createObjectURL(file)
                );
            }

            return;
        }


        // PHONE / POSTAL CODE
        if (
            name === "phone" ||
            name === "emergencyPhone" ||
            name === "postalCode"
        ) {

            const numericValue =
                value.replace(/\D/g, "");

            const maxLength =
                name === "postalCode"
                    ? 6
                    : 10;

            if (
                numericValue.length >
                maxLength
            ) {
                return;
            }

            setFormData((prev) => ({
                ...prev,
                [name]: numericValue,
            }));

            return;
        }


        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));

    };


    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!formData.firstName.trim()) {
            Swal.fire(
                "Validation",
                "First name is required.",
                "warning"
            );
            return;
        }

        if (!formData.lastName.trim()) {
            Swal.fire(
                "Validation",
                "Last name is required.",
                "warning"
            );
            return;
        }

        if (formData.phone.length !== 10) {
            Swal.fire(
                "Validation",
                "Mobile number must be 10 digits.",
                "warning"
            );
            return;
        }

        if (
            formData.postalCode &&
            formData.postalCode.length !== 6
        ) {
            Swal.fire(
                "Validation",
                "Pincode must be 6 digits.",
                "warning"
            );
            return;
        }


        const data = new FormData();


        data.append(
            "firstName",
            formData.firstName.trim()
        );

        data.append(
            "lastName",
            formData.lastName.trim()
        );

        data.append(
            "dateOfBirth",
            formData.dateOfBirth
        );

        data.append(
            "gender",
            formData.gender
        );

        data.append(
            "email",
            formData.email.trim()
        );

        data.append(
            "phone",
            formData.phone
        );


        data.append(
            "address",
            JSON.stringify({
                street:
                    formData.street.trim(),

                city:
                    formData.city.trim(),

                state:
                    formData.state.trim(),

                postalCode:
                    formData.postalCode,
            })
        );


        data.append(
            "planId",
            formData.planId
        );

        data.append(
            "startDate",
            formData.startDate
        );


        if (
            formData.assignedTrainer
        ) {
            data.append(
                "assignedTrainer",
                formData.assignedTrainer
            );
        }


        data.append(
            "emergencyContact",
            JSON.stringify({
                name:
                    formData.emergencyName.trim(),

                relationship:
                    formData.emergencyRelationship.trim(),

                phone:
                    formData.emergencyPhone,
            })
        );


        data.append(
            "autoRenew",
            formData.autoRenew
        );


        if (formData.profilePhoto) {

            data.append(
                "profilePhoto",
                formData.profilePhoto
            );

        }


        const result = await dispatch(
            updateMember({
                memberId,
                formData: data,
            })
        );


        if (
            updateMember.fulfilled.match(
                result
            )
        ) {

            sessionStorage.removeItem(
                "editMember"
            );

            await Swal.fire({
                icon: "success",
                title: "Member Updated",
                text: "Member information updated successfully.",
                confirmButtonColor: "#1769da",
            });

            navigate("/members/list");

        }

    };


    // ==========================================
    // CANCEL
    // ==========================================

    const handleCancel = () => {

        if (updateLoading) return;

        sessionStorage.removeItem(
            "editMember"
        );

        navigate("/members/list");

    };


    // ==========================================
    // SELECTED PLAN
    // ==========================================

    const selectedPlan =
        plans?.find(
            (plan) =>
                plan._id ===
                formData.planId
        );


    const currentPlanName =
        selectedPlan?.planName ||
        member?.planId?.planName ||
        "Membership Plan";


    const currentPlanPrice =
        Number(
            selectedPlan?.price ||
            member?.planId?.price ||
            member?.payment?.total ||
            0
        );


    const currentDuration =
        Number(
            selectedPlan?.durationMonths ||
            member?.planId?.durationMonths ||
            member?.durationMonths ||
            0
        );



    if (memberByIdLoading) {

        return (
            <div className="edit-member-loading">

                <div className="spinner-border text-primary" />

                <p>
                    Loading member information...
                </p>

            </div>
        );

    }


    return (

        <div className="edit-member-page">

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="edit-member-header">

                <div>

                    <div className="edit-member-breadcrumb">

                        <span>Dashboard</span>

                        <i className="bi bi-chevron-right"></i>

                        <span>Members</span>

                        <i className="bi bi-chevron-right"></i>

                        <span>Edit Member</span>

                    </div>


                    <h1>
                        Edit Member
                    </h1>

                    <p>
                        Update information for{" "}
                        <strong>
                            {formData.firstName}{" "}
                            {formData.lastName}
                        </strong>
                        .
                    </p>

                </div>


                <div className="edit-member-actions">

                    <button
                        type="button"
                        className="edit-member-cancel"
                        onClick={handleCancel}
                        disabled={updateLoading}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        form="edit-member-form"
                        className="edit-member-save"
                        disabled={updateLoading}
                    >

                        {updateLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-floppy me-1"></i>
                                Save Changes
                            </>
                        )}

                    </button>

                </div>

            </div>


            {/* ======================================
                FORM
            ====================================== */}

            <form
                id="edit-member-form"
                onSubmit={handleSubmit}
            >

                <div className="edit-member-grid">


                    {/* ==================================
                        LEFT COLUMN
                    ================================== */}

                    <div className="edit-member-left">


                        {/* PERSONAL INFORMATION */}

                        <div className="edit-card">

                            <div className="edit-card-header">

                                <div>
                                    <i className="bi bi-person"></i>
                                    Personal Information
                                </div>

                            </div>


                            <div className="edit-card-body">


                                {/* PHOTO */}

                                <div className="edit-photo-section">

                                    <div className="edit-photo-wrapper">

                                        {photoPreview ? (

                                            <img
                                                src={photoPreview}
                                                alt="Member"
                                                className="edit-profile-photo"
                                            />

                                        ) : (

                                            <div className="edit-profile-placeholder">

                                                {formData.firstName
                                                    ?.charAt(0)
                                                    ?.toUpperCase()}

                                            </div>

                                        )}

                                    </div>


                                    <label
                                        htmlFor="profilePhoto"
                                        className="edit-change-photo"
                                    >
                                        Change Photo
                                    </label>


                                    <input
                                        id="profilePhoto"
                                        type="file"
                                        accept="image/*"
                                        name="profilePhoto"
                                        onChange={handleChange}
                                        hidden
                                    />

                                </div>


                                {/* NAME */}

                                <div className="edit-two-column">

                                    <div className="edit-field">

                                        <label>
                                            First Name
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder="First name"
                                            required
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Last Name
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder="Last name"
                                            required
                                        />

                                    </div>

                                </div>


                                {/* DOB + GENDER */}

                                <div className="edit-two-column">

                                    <div className="edit-field">

                                        <label>
                                            Date of Birth
                                        </label>

                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Gender
                                        </label>

                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >

                                            <option value="">
                                                Select Gender
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

                                    </div>

                                </div>


                                {/* EMAIL + PHONE */}

                                <div className="edit-two-column">

                                    <div className="edit-field">

                                        <label>
                                            Email Address
                                        </label>

                                        <div className="edit-input-icon">

                                            <i className="bi bi-envelope"></i>

                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email address"
                                            />

                                        </div>

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Phone Number
                                            <span>*</span>
                                        </label>

                                        <div className="edit-input-icon">

                                            <i className="bi bi-telephone"></i>

                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="10 digit mobile"
                                                maxLength={10}
                                                required
                                            />

                                        </div>

                                    </div>

                                </div>


                                {/* ADDRESS */}

                                <div className="edit-section-label">
                                    Address
                                </div>


                                <div className="edit-field">

                                    <label>
                                        Street Address
                                    </label>

                                    <input
                                        type="text"
                                        name="street"
                                        value={formData.street}
                                        onChange={handleChange}
                                        placeholder="Street address"
                                    />

                                </div>


                                <div className="edit-address-grid">

                                    <div className="edit-field">

                                        <label>
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="City"
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            State/Prov
                                        </label>

                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="State"
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            ZIP Code
                                        </label>

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            placeholder="ZIP"
                                            maxLength={6}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* EMERGENCY CONTACT */}

                        <div className="edit-card">

                            <div className="edit-card-header">

                                <div>
                                    <i className="bi bi-shield-plus"></i>
                                    Emergency Contact
                                </div>

                            </div>


                            <div className="edit-card-body">

                                <div className="edit-three-column">

                                    <div className="edit-field">

                                        <label>
                                            Contact Name
                                        </label>

                                        <input
                                            type="text"
                                            name="emergencyName"
                                            value={formData.emergencyName}
                                            onChange={handleChange}
                                            placeholder="Contact name"
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Relationship
                                        </label>

                                        <input
                                            type="text"
                                            name="emergencyRelationship"
                                            value={formData.emergencyRelationship}
                                            onChange={handleChange}
                                            placeholder="Relationship"
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Phone Number
                                        </label>

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            name="emergencyPhone"
                                            value={formData.emergencyPhone}
                                            onChange={handleChange}
                                            placeholder="Phone number"
                                            maxLength={10}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ==================================
                        RIGHT COLUMN
                    ================================== */}

                    <div className="edit-member-right">


                        {/* MEMBERSHIP DETAILS */}

                        <div className="edit-card">

                            <div className="edit-card-header">

                                <div>
                                    <i className="bi bi-card-checklist"></i>
                                    Membership Details
                                </div>

                            </div>


                            <div className="edit-card-body">


                                <div className="edit-field">

                                    <label>
                                        Select Plan
                                        <span>*</span>
                                    </label>

                                    <select
                                        name="planId"
                                        value={formData.planId}
                                        onChange={handleChange}
                                        required
                                    >

                                        <option value="">
                                            Select Plan
                                        </option>

                                        {plans
                                            ?.filter(
                                                (plan) =>
                                                    plan.status ===
                                                    "ACTIVE"
                                            )
                                            .map(
                                                (plan) => (
                                                    <option
                                                        key={
                                                            plan._id
                                                        }
                                                        value={
                                                            plan._id
                                                        }
                                                    >
                                                        {plan.planName}
                                                        {" - ₹"}
                                                        {Number(
                                                            plan.price ||
                                                            0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </option>
                                                )
                                            )}

                                    </select>

                                </div>


                                <div className="edit-two-column">

                                    <div className="edit-field">

                                        <label>
                                            Start Date
                                        </label>

                                        <input
                                            type="date"
                                            name="startDate"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                        />

                                    </div>


                                    <div className="edit-field">

                                        <label>
                                            Status
                                        </label>

                                        <div className="edit-status-box">

                                            <span>
                                                {member?.status ||
                                                    "ACTIVE"}
                                            </span>

                                        </div>

                                    </div>

                                </div>


                                <div className="edit-field">

                                    <label>
                                        Assigned Trainer
                                    </label>

                                    <select
                                        name="assignedTrainer"
                                        value={formData.assignedTrainer}
                                        onChange={handleChange}
                                    >

                                        <option value="">
                                            Select Trainer
                                        </option>

                                        {trainers?.map(
                                            (trainer) => (
                                                <option
                                                    key={
                                                        trainer._id
                                                    }
                                                    value={
                                                        trainer._id
                                                    }
                                                >
                                                    {
                                                        trainer.firstName
                                                    }{" "}
                                                    {
                                                        trainer.lastName
                                                    }
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>


                                <div className="edit-auto-renew">

                                    <div>

                                        <strong>
                                            Auto Renew
                                        </strong>

                                        <span>
                                            Automatically renew membership
                                        </span>

                                    </div>


                                    <div className="form-check form-switch">

                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="autoRenew"
                                            checked={
                                                formData.autoRenew
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* CURRENT SUBSCRIPTION */}

                        <div className="edit-card">

                            <div className="edit-card-header">

                                <div>
                                    <i className="bi bi-credit-card"></i>
                                    Current Subscription
                                </div>

                            </div>


                            <div className="edit-card-body subscription-body">

                                <div className="subscription-row">

                                    <span>
                                        Plan Base Rate
                                    </span>

                                    <strong>
                                        ₹
                                        {currentPlanPrice.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>


                                <div className="subscription-row">

                                    <span>
                                        Locker Rental
                                    </span>

                                    <strong>
                                        ₹0
                                    </strong>

                                </div>


                                <div className="subscription-row">

                                    <span>
                                        Tax (0%)
                                    </span>

                                    <strong>
                                        ₹0
                                    </strong>

                                </div>


                                <div className="subscription-divider"></div>


                                <div className="subscription-total">

                                    <span>
                                        Monthly Total
                                    </span>

                                    <strong>
                                        ₹
                                        {currentPlanPrice.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>

                                </div>


                                <div className="subscription-duration">

                                    {currentDuration}{" "}
                                    Month
                                    {currentDuration >
                                        1
                                        ? "s"
                                        : ""}{" "}
                                    Plan

                                </div>

                            </div>

                        </div>


                        {/* PAYMENT METHOD */}

                        <div className="edit-card">

                            <div className="edit-card-header">

                                <div>
                                    <i className="bi bi-wallet2"></i>
                                    Payment Method
                                </div>

                            </div>


                            <div className="edit-card-body">

                                <div className="payment-method-box">

                                    <div className="payment-method-icon">

                                        <i className="bi bi-credit-card-2-front"></i>

                                    </div>


                                    <div>

                                        <span>
                                            Payment method on file:
                                        </span>

                                        <strong>
                                            {
                                                member?.payment
                                                    ?.method ||
                                                "Not available"
                                            }
                                        </strong>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </form>


            {/* ERROR */}

            {updateError && (

                <div className="edit-member-error">

                    {updateError}

                </div>

            )}

        </div>
    );
};


export default EditMember;