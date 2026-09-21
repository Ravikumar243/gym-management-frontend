import React, { useEffect, useState } from "react";
import {
    useDispatch,
    useSelector,
} from "react-redux";
import {
    createUser,
    clearUserState,
} from "../../redux/slices/userSlice";
import "./CreateUser.css";

const CreateUser = () => {
    const dispatch = useDispatch();

    const {
        loading,
        success,
        error,
        createdUser,
    } = useSelector((state) => state.user);

    const [role, setRole] = useState("SUPER_ADMIN");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",

        gymName: "",
        gymEmail: "",
        gymPhone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
    });

    const [validationError, setValidationError] = useState("");
    const [accessType, setAccessType] = useState("DEMO");
    const [demoDays, setDemoDays] = useState("7");
    const [subscriptionPlan, setSubscriptionPlan] = useState("");
    const [subscriptionAmount, setSubscriptionAmount] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setValidationError("");

        if (error) {
            dispatch(clearUserState());
        }
    };

    const handleRoleChange = (selectedRole) => {
        setRole(selectedRole);

        setValidationError("");
        dispatch(clearUserState());

        if (selectedRole === "SUPER_ADMIN") {
            setFormData((prev) => ({
                ...prev,
                gymName: "",
                gymEmail: "",
                gymPhone: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setValidationError("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password.trim()
        ) {
            setValidationError(
                "Name, email and password are required"
            );

            return;
        }

        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setValidationError(
                "Passwords do not match"
            );

            return;
        }

        if (formData.password.length < 6) {
            setValidationError(
                "Password must be at least 6 characters"
            );

            return;
        }

        if (role === "OWNER") {
            if (!formData.gymName.trim()) {
                setValidationError(
                    "Gym name is required for owner"
                );

                return;
            }

            if (!formData.address.trim()) {
                setValidationError(
                    "Gym address is required for owner"
                );

                return;
            }

            if (!formData.city.trim()) {
                setValidationError(
                    "Gym city is required for owner"
                );

                return;
            }

            if (!formData.state.trim()) {
                setValidationError(
                    "Gym state is required for owner"
                );

                return;
            }

            if (!formData.pincode.trim()) {
                setValidationError(
                    "Gym pincode is required for owner"
                );

                return;
            }
        }

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
            role,
        };

        if (role === "OWNER") {
            payload.accessType = accessType;

            if (accessType === "DEMO") {
                payload.demoDays = Number(demoDays);
            }

            if (accessType === "SUBSCRIPTION") {
                payload.subscriptionPlan = subscriptionPlan;
                payload.subscriptionAmount = Number(subscriptionAmount);
            }

            payload.gymName = formData.gymName.trim();
            payload.gymEmail = formData.gymEmail.trim();
            payload.gymPhone = formData.gymPhone.trim();
            payload.address = formData.address.trim();
            payload.city = formData.city.trim();
            payload.state = formData.state.trim();
            payload.pincode = formData.pincode.trim();
        }

        dispatch(createUser(payload));
    };

    useEffect(() => {
        if (success) {
            setFormData({
                name: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: "",

                gymName: "",
                gymEmail: "",
                gymPhone: "",
                address: "",
                city: "",
                state: "",
                pincode: "",
            });

            setRole("SUPER_ADMIN");
        }
    }, [success]);

    useEffect(() => {
        return () => {
            dispatch(clearUserState());
        };
    }, [dispatch]);

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",

            gymName: "",
            gymEmail: "",
            gymPhone: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
        });

        setValidationError("");
        dispatch(clearUserState());
    };

    return (
        <div className="create-user-page">

            <div className="create-user-breadcrumb">
                Dashboard
                <span>/</span>
                User Management
                <span>/</span>
                <strong>Create New ID</strong>
            </div>

            <div className="create-user-header">
                <div>
                    <h1>Create New ID</h1>

                    <p>
                        Create a Super Admin or Gym Owner account.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>

                <div className="create-user-card">

                    <div className="section-label">
                        Select Role
                    </div>

                    <div className="role-options">

                        <div
                            className={`role-card ${role === "SUPER_ADMIN"
                                ? "selected"
                                : ""
                                }`}
                            onClick={() =>
                                handleRoleChange(
                                    "SUPER_ADMIN"
                                )
                            }
                        >
                            <div className="role-radio">
                                <span></span>
                            </div>

                            <div className="role-icon">
                                <i className="bi bi-shield-check"></i>
                            </div>

                            <div className="role-content">

                                <div className="role-title">
                                    Super Admin
                                </div>

                                <div className="role-description">
                                    Full platform-level access
                                    and system configuration
                                    control.
                                </div>

                            </div>
                        </div>

                        <div
                            className={`role-card ${role === "OWNER"
                                ? "selected"
                                : ""
                                }`}
                            onClick={() =>
                                handleRoleChange(
                                    "OWNER"
                                )
                            }
                        >
                            <div className="role-radio">
                                <span></span>
                            </div>

                            <div className="role-icon">
                                <i className="bi bi-building"></i>
                            </div>

                            <div className="role-content">

                                <div className="role-title">
                                    Gym Owner
                                </div>

                                <div className="role-description">
                                    Manage one gym location,
                                    memberships, and staff.
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                <div className="create-user-card">

                    <div className="section-header">

                        <div>
                            <h3>
                                Account Information
                            </h3>
                        </div>

                        <span className="access-badge">

                            <i className="bi bi-info-circle"></i>

                            {role === "SUPER_ADMIN"
                                ? "Platform-wide access granted"
                                : "Gym-level access granted"}

                        </span>

                    </div>

                    <div className="info-message">

                        <i className="bi bi-shield-check"></i>

                        <span>
                            {role === "SUPER_ADMIN"
                                ? "Super Admin accounts have access to the entire gym management platform."
                                : "Gym Owner accounts can manage their assigned gym, members, trainers and staff."}
                        </span>

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Ravi Kumar"
                                required
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="ravi@example.com"
                                required
                            />

                        </div>

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="9876543210"
                            />

                        </div>

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Password
                            </label>

                            <div className="password-input">

                                <input
                                    type="password"
                                    name="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="••••••••"
                                    required
                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label>
                                Confirm Password
                            </label>

                            <div className="password-input">

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={
                                        formData.confirmPassword
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="••••••••"
                                    required
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {role === "OWNER" && (

                    <div className="create-user-card">

                        <div className="section-header">

                            <div>

                                <h3>
                                    Gym Information
                                </h3>

                                <p>
                                    Details of the gym
                                    assigned to this owner.
                                </p>

                            </div>

                            <span className="required-badge">
                                Owner Only
                            </span>

                        </div>

                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    Gym Name
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="gymName"
                                    value={
                                        formData.gymName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. FitPulse Gym"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Gym Email
                                </label>

                                <input
                                    type="email"
                                    name="gymEmail"
                                    value={
                                        formData.gymEmail
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="gym@example.com"
                                />

                            </div>

                        </div>

                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    Gym Phone
                                </label>

                                <input
                                    type="tel"
                                    name="gymPhone"
                                    value={
                                        formData.gymPhone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="9876543210"
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Pincode
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="pincode"
                                    value={
                                        formData.pincode
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="122001"
                                    maxLength={6}
                                    required
                                />

                            </div>

                        </div>

                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    Address
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={
                                        formData.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="MG Road, Sector 15"
                                    required
                                />

                            </div>

                        </div>

                        <div className="form-row">

                            <div className="form-group">

                                <label>
                                    City
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="city"
                                    value={
                                        formData.city
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Gurgaon"
                                    required
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    State
                                    <span>*</span>
                                </label>

                                <input
                                    type="text"
                                    name="state"
                                    value={
                                        formData.state
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Haryana"
                                    required
                                />

                            </div>

                        </div>

                        <div className="gym-info-note">

                            <i className="bi bi-link-45deg"></i>

                            <span>
                                The owner will be automatically
                                linked to this gym after
                                account creation.
                            </span>

                        </div>

                    </div>



                )}

                <div className="create-user-card">
                    <div className="section-header">
                        <div>
                            <h3>Access & Subscription</h3>
                            <p>Choose how this gym will access the platform.</p>
                        </div>

                        <span className="required-badge">
                            Required
                        </span>
                    </div>

                    <div className="access-options">

                        <div
                            className={`access-card ${accessType === "DEMO" ? "selected" : ""
                                }`}
                            onClick={() => setAccessType("DEMO")}
                        >
                            <div className="access-radio">
                                {accessType === "DEMO" && <span />}
                            </div>

                            <div className="access-icon">
                                <i className="bi bi-clock-history"></i>
                            </div>

                            <div className="access-content">
                                <div className="access-title">
                                    Demo Access
                                </div>

                                <div className="access-description">
                                    Temporary access for 5 or 7 days.
                                </div>
                            </div>
                        </div>

                        <div
                            className={`access-card ${accessType === "SUBSCRIPTION"
                                ? "selected"
                                : ""
                                }`}
                            onClick={() =>
                                setAccessType("SUBSCRIPTION")
                            }
                        >
                            <div className="access-radio">
                                {accessType === "SUBSCRIPTION" && (
                                    <span />
                                )}
                            </div>

                            <div className="access-icon">
                                <i className="bi bi-credit-card"></i>
                            </div>

                            <div className="access-content">
                                <div className="access-title">
                                    Subscription
                                </div>

                                <div className="access-description">
                                    Paid access with an active plan.
                                </div>
                            </div>
                        </div>

                    </div>

                    {accessType === "DEMO" && (
                        <div className="access-fields">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>
                                        Demo Duration
                                        <span>*</span>
                                    </label>

                                    <select
                                        value={demoDays}
                                        onChange={(e) =>
                                            setDemoDays(e.target.value)
                                        }
                                    >
                                        <option value="5">
                                            5 Days
                                        </option>

                                        <option value="7">
                                            7 Days
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <div className="subscription-summary">
                                <i className="bi bi-info-circle"></i>

                                <span>
                                    Gym will have active demo access
                                    for <strong>{demoDays} days</strong>.
                                </span>
                            </div>
                        </div>
                    )}

                    {accessType === "SUBSCRIPTION" && (
                        <div className="access-fields">

                            <div className="form-row">

                                <div className="form-group">
                                    <label>
                                        Subscription Plan
                                        <span>*</span>
                                    </label>

                                    <select
                                        value={subscriptionPlan}
                                        onChange={(e) =>
                                            setSubscriptionPlan(
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select Plan
                                        </option>

                                        <option value="MONTHLY">
                                            Monthly
                                        </option>

                                        <option value="SIX_MONTHS">
                                            6 Months
                                        </option>

                                        <option value="YEARLY">
                                            Yearly
                                        </option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Subscription Amount
                                        <span>*</span>
                                    </label>

                                    <div className="amount-input-wrapper">
                                        <span className="amount-prefix">
                                            ₹
                                        </span>

                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Enter amount"
                                            value={subscriptionAmount}
                                            onChange={(e) =>
                                                setSubscriptionAmount(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                            </div>

                            <div className="subscription-summary">
                                <i className="bi bi-check-circle"></i>

                                <span>
                                    Subscription will start
                                    <strong> immediately </strong>
                                    after the account is created.
                                </span>
                            </div>

                        </div>
                    )}
                </div>

                {validationError && (

                    <div className="form-alert error">

                        <i className="bi bi-exclamation-circle"></i>

                        {validationError}

                    </div>

                )}

                {error && (

                    <div className="form-alert error">

                        <i className="bi bi-exclamation-circle"></i>

                        {error}

                    </div>

                )}

                {success && (

                    <div className="form-alert success">

                        <i className="bi bi-check-circle"></i>

                        {role === "OWNER"
                            ? "Gym and Owner created successfully."
                            : "Super Admin created successfully."}

                    </div>

                )}

                <div className="create-user-footer">

                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={resetForm}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="btn-create"
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                />

                                Creating...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-plus-circle me-2"></i>

                                {role === "OWNER"
                                    ? "Create Gym & Owner"
                                    : "Create Super Admin"}
                            </>
                        )}

                    </button>

                </div>

            </form>

        </div>
    );
};

export default CreateUser;