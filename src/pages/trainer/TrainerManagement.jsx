import React, { useEffect, useState } from "react";
import "./TrainerManagement.css";
import { useDispatch, useSelector } from "react-redux";
import { createTrainer, getTrainersByGym } from "../../redux/slices/trainerSlice";

const TrainerManagement = () => {
    const [showModal, setShowModal] = useState(false);

    const [trainerForm, setTrainerForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        specialization: "",
        experience: "",
    });

    const dispatch = useDispatch();

    const {
        trainers,
        loading,
        createLoading,
        createError,
        success,
        message,
    } = useSelector((state) => state.trainer);

    useEffect(() => {
        const gymData = JSON.parse(
            localStorage.getItem("gym")
        );

        const gymId = gymData?.id;

        if (gymId) {
            dispatch(getTrainersByGym(gymId));
        }
    }, [dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setTrainerForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateTrainer = async (e) => {
        e.preventDefault();

        try {
            const gymData = JSON.parse(
                localStorage.getItem("gym")
            );

            const gymId = gymData?.id;

            if (!gymId) {
                alert("Gym ID not found");
                return;
            }

            const payload = {
                ...trainerForm,
                gymId,
                experience:
                    Number(trainerForm.experience) || 0,
            };

            const result = await dispatch(
                createTrainer(payload)
            ).unwrap();

            alert(
                result?.message ||
                "Trainer created successfully"
            );

            setTrainerForm({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                gender: "",
                specialization: "",
                experience: "",
            });

            setShowModal(false);

        } catch (error) {
            console.error(
                "Create Trainer Error:",
                error
            );
        }
    };

    return (
        <div className="trainer-management-page">

            <div className="trainer-management-header">

                <div>
                    <h1>Trainer Management</h1>

                    <p>
                        Manage trainers, track performance ratings,
                        and assign members.
                    </p>
                </div>

                <div className="trainer-management-actions">

                    <button className="trainer-export-btn">
                        <i className="bi bi-download"></i>
                        Export
                    </button>

                    <button
                        className="trainer-add-btn"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi bi-plus"></i>
                        Add New Trainer
                    </button>

                </div>

            </div>


            {/* FILTER */}

            <div className="trainer-filter-card">

                <select>
                    <option>All Specializations</option>
                </select>

                <select>
                    <option>All Statuses</option>
                </select>

                <div className="trainer-count">
                    Showing <strong>{trainers.length}</strong> Trainers
                </div>

            </div>



            <div className="trainer-table-card">

                {/* TABLE HEADER */}

                <div className="trainer-table-header">

                    <div>TRAINER NAME</div>
                    <div>SPECIALIZATION</div>
                    <div>ASSIGNED MEMBERS</div>
                    <div>RATING</div>
                    <div>STATUS</div>
                    <div>ACTIONS</div>

                </div>


                {/* TABLE BODY */}

                {loading ? (

                    <div className="trainer-list-message">
                        Loading trainers...
                    </div>

                ) : trainers.length === 0 ? (

                    <div className="trainer-list-message">
                        No trainers found
                    </div>

                ) : (

                    trainers.map((trainer) => {

                        const firstName =
                            trainer.firstName || "";

                        const lastName =
                            trainer.lastName || "";

                        const initials =
                            `${firstName.charAt(0)}${lastName.charAt(0)}`
                                .toUpperCase();

                        return (
                            <div
                                className="trainer-table-row"
                                key={trainer._id}
                            >

                                {/* TRAINER */}

                                <div className="trainer-info">

                                    <div className="trainer-avatar">
                                        {initials || "T"}
                                    </div>

                                    <div className="trainer-info-text">

                                        <strong>
                                            {firstName} {lastName}
                                        </strong>

                                        <span>
                                            {trainer.email || "-"}
                                        </span>

                                    </div>

                                </div>


                                {/* SPECIALIZATION */}

                                <div className="trainer-specialization">

                                    <span>
                                        {trainer.specialization ||
                                            "Not specified"}
                                    </span>

                                </div>


                                {/* ASSIGNED MEMBERS */}

                                <div className="trainer-members">

                                    <strong>
                                        0
                                    </strong>

                                    <span>
                                        / 30 Cap
                                    </span>

                                </div>


                                {/* RATING */}

                                <div className="trainer-rating">

                                    <span className="rating-star">
                                        ★
                                    </span>

                                    <span>
                                        --
                                    </span>

                                    <small>
                                        (0)
                                    </small>

                                </div>


                                {/* STATUS */}

                                <div className="trainer-status">

                                    <span
                                        className={
                                            trainer.isActive !== false
                                                ? "trainer-status-badge active"
                                                : "trainer-status-badge inactive"
                                        }
                                    >

                                        <span className="status-dot"></span>

                                        {trainer.isActive !== false
                                            ? "Active"
                                            : "Inactive"}

                                    </span>

                                </div>


                                {/* ACTIONS */}

                                <div className="trainer-actions">

                                    <button
                                        type="button"
                                        title="Edit Trainer"
                                        onClick={() =>
                                            console.log(
                                                "Edit Trainer",
                                                trainer
                                            )
                                        }
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </button>

                                    <button
                                        type="button"
                                        title="View Trainer"
                                        onClick={() =>
                                            console.log(
                                                "View Trainer",
                                                trainer
                                            )
                                        }
                                    >
                                        <i className="bi bi-eye"></i>
                                    </button>

                                </div>

                            </div>
                        );
                    })

                )}




                <div className="trainer-table-footer">

                    <span>
                        Showing <strong>{trainers.length}</strong> trainers
                    </span>

                    <div className="trainer-pagination">

                        <button
                            type="button"
                            disabled
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            className="active"
                        >
                            1
                        </button>

                        <button type="button">
                            2
                        </button>

                        <button type="button">
                            3
                        </button>

                        <span>...</span>

                        <button type="button">
                            Next
                        </button>

                    </div>

                </div>

            </div>


            {showModal && (
                <div
                    className="trainer-modal-overlay"
                    onClick={() => setShowModal(false)}
                >

                    <div
                        className="trainer-modal"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* MODAL HEADER */}

                        <div className="trainer-modal-header">

                            <div>
                                <h2>Add New Trainer</h2>

                                <p>
                                    Enter trainer details to register
                                    a new trainer.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="trainer-modal-close"
                                onClick={() =>
                                    setShowModal(false)
                                }
                            >
                                <i className="bi bi-x"></i>
                            </button>

                        </div>


                        {/* FORM */}

                        <form
                            onSubmit={handleCreateTrainer}
                        >

                            <div className="trainer-modal-body">

                                {/* FIRST + LAST NAME */}

                                <div className="trainer-form-row">

                                    <div className="trainer-form-group">

                                        <label>
                                            First Name
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="firstName"
                                            value={
                                                trainerForm.firstName
                                            }
                                            onChange={handleChange}
                                            placeholder="Enter first name"
                                            required
                                        />

                                    </div>


                                    <div className="trainer-form-group">

                                        <label>
                                            Last Name
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="text"
                                            name="lastName"
                                            value={
                                                trainerForm.lastName
                                            }
                                            onChange={handleChange}
                                            placeholder="Enter last name"
                                            required
                                        />

                                    </div>

                                </div>


                                {/* EMAIL + PHONE */}

                                <div className="trainer-form-row">

                                    <div className="trainer-form-group">

                                        <label>
                                            Email Address
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            value={
                                                trainerForm.email
                                            }
                                            onChange={handleChange}
                                            placeholder="Enter email address"
                                            required
                                        />

                                    </div>


                                    <div className="trainer-form-group">

                                        <label>
                                            Phone Number
                                            <span>*</span>
                                        </label>

                                        <input
                                            type="tel"
                                            name="phone"
                                            value={
                                                trainerForm.phone
                                            }
                                            onChange={handleChange}
                                            placeholder="Enter phone number"
                                            required
                                        />

                                    </div>

                                </div>


                                {/* GENDER + SPECIALIZATION */}

                                <div className="trainer-form-row">

                                    <div className="trainer-form-group">

                                        <label>
                                            Gender
                                        </label>

                                        <select
                                            name="gender"
                                            value={
                                                trainerForm.gender
                                            }
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select gender
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


                                    <div className="trainer-form-group">
                                        <label>
                                            Specialization
                                        </label>

                                        <select
                                            name="specialization"
                                            value={trainerForm.specialization}
                                            onChange={handleChange}
                                        >
                                            <option value="">
                                                Select specialization
                                            </option>

                                            <option value="Strength & Conditioning">
                                                Strength & Conditioning
                                            </option>

                                            <option value="Yoga & Pilates">
                                                Yoga & Pilates
                                            </option>

                                            <option value="CrossFit">
                                                CrossFit
                                            </option>

                                            <option value="Cardio">
                                                Cardio
                                            </option>

                                            <option value="Weight Training">
                                                Weight Training
                                            </option>

                                            <option value="Personal Training">
                                                Personal Training
                                            </option>

                                            <option value="Nutrition & Fitness">
                                                Nutrition & Fitness
                                            </option>
                                        </select>
                                    </div>

                                </div>




                                <div className="trainer-form-group trainer-experience-field">

                                    <label>
                                        Experience (Years)
                                    </label>

                                    <input
                                        type="number"
                                        name="experience"
                                        value={
                                            trainerForm.experience
                                        }
                                        onChange={handleChange}
                                        placeholder="e.g. 5"
                                        min="0"
                                    />

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div className="trainer-modal-footer">

                                <button
                                    type="button"
                                    className="trainer-cancel-btn"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="trainer-create-btn"
                                >
                                    Create Trainer
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default TrainerManagement;