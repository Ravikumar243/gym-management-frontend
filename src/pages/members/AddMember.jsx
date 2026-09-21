import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createMember,
  clearMemberState,
} from "../../redux/slices/memberSlice";

import "./AddMember.css";
import { getPlans } from "../../redux/slices/planSlice";
import { getTrainersByGym } from "../../redux/slices/trainerSlice";
import toast from "react-hot-toast";

const AddMember = () => {
  const dispatch = useDispatch();

  const {
    loading,
    success,
    error,
    member,
  } = useSelector((state) => state.member);

  const { trainers } = useSelector(
    (state) => state.trainer
  );

  useEffect(() => {
    const gymData = JSON.parse(
      localStorage.getItem("gym")
    );

    const gymId = gymData?.id;

    if (gymId) {
      dispatch(getTrainersByGym(gymId));
    }
  }, [dispatch]);

  const {
    plans,
    loading: plansLoading,
    error: plansError,
  } = useSelector((state) => state.plan);

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

    amountPaid: "",
    paymentMethod: "CASH",

    autoRenew: false,

    profilePhoto: null,
  });

  const [photoPreview, setPhotoPreview] = useState("");

  const gymData = JSON.parse(localStorage.getItem("gym"));

  const gymId = gymData?.id;

  useEffect(() => {

    if (gymId) {
      dispatch(getPlans(gymId));
    }

  }, [dispatch, gymId]);

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = e.target;

    // File
    if (type === "file") {
      const file = files?.[0];

      setFormData((prev) => ({
        ...prev,
        profilePhoto: file || null,
      }));

      if (file) {
        setPhotoPreview(URL.createObjectURL(file));
      }

      return;
    }

    if (
      name === "phone" ||
      name === "emergencyPhone" ||
      name === "postalCode"
    ) {
      // Remove everything except numbers
      let numericValue = value.replace(/\D/g, "");

      // Phone = 10 digits
      // Postal Code = 6 digits
      const maxLength =
        name === "postalCode" ? 6 : 10;

      numericValue = numericValue.slice(0, maxLength);

      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));

      return;
    }

    if (name === "amountPaid") {
      const numericValue = value.replace(/\D/g, "");

      setFormData((prev) => ({
        ...prev,
        amountPaid: numericValue,
      }));

      return;
    }

    // Other fields
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Phone validation
    if (formData.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    // Emergency phone validation - only if entered
    if (
      formData.emergencyPhone &&
      formData.emergencyPhone.length !== 10
    ) {
      alert("Emergency phone number must be exactly 10 digits.");
      return;
    }

    // Postal code validation - only if entered
    if (
      formData.postalCode &&
      formData.postalCode.length !== 6
    ) {
      alert("Postal code must be exactly 6 digits.");
      return;
    }

    // Only after validation
    const data = new FormData();

    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("dateOfBirth", formData.dateOfBirth);
    data.append("gender", formData.gender);

    data.append("email", formData.email);
    data.append("phone", formData.phone);

    // Address
    data.append(
      "address",
      JSON.stringify({
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
      })
    );

    data.append("planId", formData.planId);
    data.append("startDate", formData.startDate);

    if (formData.assignedTrainer) {
      data.append(
        "assignedTrainer",
        formData.assignedTrainer
      );
    }

    // Emergency Contact
    data.append(
      "emergencyContact",
      JSON.stringify({
        name: formData.emergencyName,
        relationship: formData.emergencyRelationship,
        phone: formData.emergencyPhone,
      })
    );


    data.append(
      "payment",
      JSON.stringify({
        amountPaid: Number(formData.amountPaid || 0),
        method: formData.paymentMethod,
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

    dispatch(createMember(data));
  };



  useEffect(() => {
    if (success) {

      setFormData({
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

        amountPaid: "",
        paymentMethod: "CASH",
        paymentStatus: "PENDING",

        autoRenew: false,

        profilePhoto: null,
      });

      setPhotoPreview("");

      dispatch(clearMemberState());
    }
  }, [success, dispatch]);

  // ==========================================
  // ERROR
  // ==========================================

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  return (
    <div className="add-member-page">

      {/* HEADER */}

      <div className="add-member-header">

        <div>
          <div className="add-member-breadcrumb">
            <span>Dashboard</span>
            <i className="bi bi-chevron-right"></i>
            <span>Members</span>
            <i className="bi bi-chevron-right"></i>
            <span>Add Member</span>
          </div>

          <h1>Add Member</h1>
        </div>

        <div className="add-member-actions">

          <button
            type="button"
            className="add-member-cancel"
            onClick={() => window.history.back()}
          >
            Cancel
          </button>

          <button
            type="submit"
            form="member-form"
            className="add-member-save"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Member"}
          </button>

        </div>
      </div>

      <form
        id="member-form"
        onSubmit={handleSubmit}
      >

        <div className="row">

          {/* ==========================================
              LEFT COLUMN
          ========================================== */}

          <div className="col-lg-8">

            {/* PERSONAL INFORMATION */}

            <div className="member-form-card">

              <div className="member-form-card-header">
                <i className="bi bi-person"></i>
                Personal Information
              </div>

              <div className="member-form-card-body">

                <div className="row">

                  {/* PHOTO */}

                  <div className="col-md-3">

                    <div className="member-photo-wrapper">

                      <label
                        htmlFor="profilePhoto"
                        className="member-photo"
                        style={{
                          cursor: "pointer",
                          overflow: "hidden",
                        }}
                      >

                        {photoPreview ? (
                          <img
                            src={photoPreview}
                            alt="Profile"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <i className="bi bi-camera"></i>
                        )}

                      </label>

                      <input
                        id="profilePhoto"
                        type="file"
                        name="profilePhoto"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleChange}
                        style={{ display: "none" }}
                      />

                      <span>Upload Photo</span>

                    </div>

                  </div>

                  {/* NAME */}

                  <div className="col-md-9">

                    <div className="row">

                      <div className="col-md-6">

                        <label className="member-label">
                          First Name <span>*</span>
                        </label>

                        <input
                          className="member-input"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="Enter first name"
                          required
                        />

                      </div>

                      <div className="col-md-6">

                        <label className="member-label">
                          Last Name <span>*</span>
                        </label>

                        <input
                          className="member-input"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Enter last name"
                          required
                        />

                      </div>

                    </div>

                    <div className="row member-field">

                      <div className="col-md-6">

                        <label className="member-label">
                          Date of Birth
                        </label>

                        <input
                          type="date"
                          className="member-input"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                        />

                      </div>

                      <div className="col-md-6">

                        <label className="member-label">
                          Gender
                        </label>

                        <select
                          className="member-input"
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

                  </div>

                </div>

                {/* CONTACT */}

                <div className="row member-field">

                  <div className="col-md-6">

                    <label className="member-label">
                      Email <span>*</span>
                    </label>

                    <input
                      type="email"
                      className="member-input"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                      required
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="member-label">
                      Phone <span>*</span>
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      className="member-input"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone"
                      required
                    />

                  </div>

                </div>

              </div>
            </div>


            {/* ADDRESS */}

            <div className="member-form-card">

              <div className="member-form-card-header">
                <i className="bi bi-geo-alt"></i>
                Address
              </div>

              <div className="member-form-card-body">

                <div className="row">

                  <div className="col-md-6">

                    <label className="member-label">
                      Street
                    </label>

                    <input
                      className="member-input"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Street address"
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="member-label">
                      City
                    </label>

                    <input
                      className="member-input"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                    />

                  </div>

                </div>

                <div className="row member-field">

                  <div className="col-md-6">

                    <label className="member-label">
                      State
                    </label>

                    <input
                      className="member-input"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="member-label">
                      Postal Code
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      className="member-input"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="Postal code"
                    />

                  </div>

                </div>

              </div>
            </div>


            {/* EMERGENCY CONTACT */}

            <div className="member-form-card emergency-card">

              <div className="member-form-card-header">
                <i className="bi bi-telephone"></i>
                Emergency Contact
              </div>

              <div className="member-form-card-body">

                <div className="row">

                  <div className="col-md-4">

                    <label className="member-label">
                      Name
                    </label>

                    <input
                      className="member-input"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleChange}
                      placeholder="Name"
                    />

                  </div>

                  <div className="col-md-4">

                    <label className="member-label">
                      Relationship
                    </label>

                    <input
                      className="member-input"
                      name="emergencyRelationship"
                      value={formData.emergencyRelationship}
                      onChange={handleChange}
                      placeholder="Relationship"
                    />

                  </div>

                  <div className="col-md-4">

                    <label className="member-label">
                      Phone
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      className="member-input"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      placeholder="Phone"
                    />

                  </div>

                </div>

              </div>
            </div>

          </div>


          {/* ==========================================
              RIGHT COLUMN
          ========================================== */}

          <div className="col-lg-4">

            {/* MEMBERSHIP */}

            <div className="member-form-card">

              <div className="member-form-card-header">
                <i className="bi bi-card-checklist"></i>
                Membership
              </div>

              <div className="member-form-card-body">

                <div className="member-field">

                  <label className="member-label">
                    Membership Plan <span>*</span>
                  </label>

                  <select
                    name="planId"
                    value={formData.planId}
                    onChange={handleChange}
                    className="member-input"
                    disabled={plansLoading}
                  >

                    <option value="">
                      {plansLoading
                        ? "Loading plans..."
                        : "Select Membership Plan"
                      }
                    </option>

                    {plans
                      .filter((plan) => plan.status === "ACTIVE")
                      .map((plan) => (
                        <option
                          key={plan._id}
                          value={plan._id}
                        >
                          {plan.planName} - ₹{plan.price}
                        </option>
                      ))}

                  </select>

                  {plansError && (
                    <small className="text-danger">
                      {plansError}
                    </small>
                  )}

                </div>

                <div className="member-field">

                  <label className="member-label">
                    Start Date <span>*</span>
                  </label>

                  <input
                    type="date"
                    className="member-input"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="member-field">

                  <label className="member-label">
                    Assigned Trainer
                  </label>

                  <select
                    name="assignedTrainer"
                    className="trainer-dropdown"
                    value={formData.assignedTrainer}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Trainer
                    </option>

                    {trainers.map((trainer) => (
                      <option
                        key={trainer._id}
                        value={trainer._id}
                      >
                        {trainer.firstName} {trainer.lastName}
                      </option>
                    ))}
                  </select>

                </div>

                <div className="member-field">

                  <label className="member-label">
                    Auto Renew
                  </label>

                  <div className="auto-renew-row">

                    <span>
                      Automatically renew membership
                    </span>

                    <div className="form-check form-switch">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="autoRenew"
                        checked={formData.autoRenew}
                        onChange={handleChange}
                      />

                    </div>

                  </div>

                </div>

              </div>
            </div>


            <div className="member-form-card">

              <div className="member-form-card-header">
                <i className="bi bi-credit-card"></i>
                Payment
              </div>

              <div className="member-form-card-body">

                <div className="member-field">

                  <label className="member-label">
                    Amount Paid <span>*</span>
                  </label>

                  <div className="amount-paid-wrapper">

                    <span className="amount-prefix">
                      ₹
                    </span>

                    <input
                      type="text"
                      inputMode="numeric"
                      className="amount-paid-input"
                      name="amountPaid"
                      value={formData.amountPaid}
                      onChange={handleChange}
                      placeholder="Enter amount received"
                      required
                    />

                  </div>

                </div>

                <div className="member-field">

                  <label className="member-label">
                    Payment Method
                  </label>

                  <div className="payment-radio-group">

                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="CASH"
                        checked={
                          formData.paymentMethod === "CASH"
                        }
                        onChange={handleChange}
                      />
                      Cash
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="CARD"
                        checked={
                          formData.paymentMethod === "CARD"
                        }
                        onChange={handleChange}
                      />
                      Card
                    </label>

                    <label>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="UPI"
                        checked={
                          formData.paymentMethod === "UPI"
                        }
                        onChange={handleChange}
                      />
                      UPI
                    </label>

                  </div>

                </div>

                <div className="payment-status-info">

                  {Number(formData.amountPaid) > 0 ? (
                    <>
                      <i className="bi bi-check-circle-fill"></i>

                      <span>
                        Payment will be recorded as
                        <strong> PAID</strong>.
                      </span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-clock-fill"></i>

                      <span>
                        No amount entered. Payment will be recorded as
                        <strong> PENDING</strong>.
                      </span>
                    </>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>

      </form>

    </div>
  );
};

export default AddMember;