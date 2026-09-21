import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
    getAllGyms,
    getGymById,
    updateGym,
    updateGymStatus,
    clearGymError,
    clearGymSuccess,
} from "../../redux/slices/gymSlice";

import "./GymManagement.css";

const GymManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        gyms,
        loading,
        detailsLoading,
        updateLoading,
        statusLoading,
        selectedGym,
        error,
        detailsError,
        updateError,
        statusError,
    } = useSelector((state) => state.gym);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [cityFilter, setCityFilter] = useState("ALL");
    const [subscriptionFilter, setSubscriptionFilter] =
        useState("ALL");

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [showDetails, setShowDetails] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showStatusModal, setShowStatusModal] =
        useState(false);

    const [selectedGymForAction, setSelectedGymForAction] =
        useState(null);

    const [editForm, setEditForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        logo: "",
        subscriptionStart: "",
        subscriptionEnd: "",
    });

    useEffect(() => {
        dispatch(getAllGyms());
    }, [dispatch]);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        search,
        statusFilter,
        cityFilter,
        subscriptionFilter,
        fromDate,
        toDate,
        rowsPerPage,
    ]);

    const cities = useMemo(() => {
        const values = gyms
            .map((gym) => gym.city)
            .filter(Boolean);

        return [...new Set(values)].sort();
    }, [gyms]);

    const getDateOnly = (date) => {
        if (!date) return "";

        return new Date(date)
            .toISOString()
            .split("T")[0];
    };

    const getDaysRemaining = (date) => {
        if (!date) return null;

        const today = new Date();
        const expiry = new Date(date);

        today.setHours(0, 0, 0, 0);
        expiry.setHours(0, 0, 0, 0);

        return Math.ceil(
            (expiry - today) / (1000 * 60 * 60 * 24)
        );
    };

    const getSubscriptionState = (gym) => {
        const days = getDaysRemaining(
            gym.subscriptionEnd
        );

        if (days === null) return "NONE";

        if (days < 0) return "EXPIRED";

        if (days <= 30) return "EXPIRING";

        return "ACTIVE";
    };

    const filteredGyms = useMemo(() => {
        return gyms.filter((gym) => {
            const searchValue = search
                .toLowerCase()
                .trim();

            const matchesSearch =
                !searchValue ||
                gym.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                gym.email
                    ?.toLowerCase()
                    .includes(searchValue) ||
                gym.phone
                    ?.toLowerCase()
                    .includes(searchValue) ||
                gym.owner?.name
                    ?.toLowerCase()
                    .includes(searchValue) ||
                gym.owner?.email
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                statusFilter === "ALL" ||
                gym.status === statusFilter;

            const matchesCity =
                cityFilter === "ALL" ||
                gym.city === cityFilter;

            const subscriptionState =
                getSubscriptionState(gym);

            const matchesSubscription =
                subscriptionFilter === "ALL" ||
                subscriptionState ===
                    subscriptionFilter;

            const gymStart = getDateOnly(
                gym.subscriptionStart
            );

            const gymEnd = getDateOnly(
                gym.subscriptionEnd
            );

            const matchesFromDate =
                !fromDate ||
                gymEnd >= fromDate;

            const matchesToDate =
                !toDate ||
                gymStart <= toDate;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCity &&
                matchesSubscription &&
                matchesFromDate &&
                matchesToDate
            );
        });
    }, [
        gyms,
        search,
        statusFilter,
        cityFilter,
        subscriptionFilter,
        fromDate,
        toDate,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(
            filteredGyms.length / rowsPerPage
        )
    );

    const paginatedGyms = useMemo(() => {
        const start =
            (currentPage - 1) * rowsPerPage;

        return filteredGyms.slice(
            start,
            start + rowsPerPage
        );
    }, [
        filteredGyms,
        currentPage,
        rowsPerPage,
    ]);

    const stats = useMemo(() => {
        const total = gyms.length;

        const active = gyms.filter(
            (gym) => gym.status === "ACTIVE"
        ).length;

        const inactive = gyms.filter(
            (gym) => gym.status === "INACTIVE"
        ).length;

        const expiring = gyms.filter(
            (gym) =>
                getSubscriptionState(gym) ===
                "EXPIRING"
        ).length;

        return {
            total,
            active,
            inactive,
            expiring,
        };
    }, [gyms]);

    const activePercentage =
        stats.total > 0
            ? ((stats.active / stats.total) * 100).toFixed(
                  1
              )
            : "0.0";

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    const handleReset = () => {
        setSearch("");
        setStatusFilter("ALL");
        setCityFilter("ALL");
        setSubscriptionFilter("ALL");
        setFromDate("");
        setToDate("");
        setCurrentPage(1);
    };

    const handleView = async (gym) => {
        const result = await dispatch(
            getGymById(gym._id)
        );

        if (getGymById.fulfilled.match(result)) {
            setShowDetails(true);
        }
    };

    const handleEdit = (gym) => {
        setEditForm({
            name: gym.name || "",
            email: gym.email || "",
            phone: gym.phone || "",
            address: gym.address || "",
            city: gym.city || "",
            state: gym.state || "",
            pincode: gym.pincode || "",
            logo: gym.logo || "",
            subscriptionStart:
                getDateOnly(gym.subscriptionStart),
            subscriptionEnd:
                getDateOnly(gym.subscriptionEnd),
        });

        setSelectedGymForAction(gym);
        setShowEdit(true);
        dispatch(clearGymError());
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdateGym = async (e) => {
        e.preventDefault();

        if (!selectedGymForAction) return;

        const result = await dispatch(
            updateGym({
                gymId: selectedGymForAction._id,
                gymData: editForm,
            })
        );

        if (updateGym.fulfilled.match(result)) {
            setShowEdit(false);
            setSelectedGymForAction(null);
            dispatch(getAllGyms());
        }
    };

    const openStatusModal = (gym) => {
        setSelectedGymForAction(gym);
        setShowStatusModal(true);
        dispatch(clearGymError());
    };

    const handleStatusChange = async () => {
        if (!selectedGymForAction) return;

        const newStatus =
            selectedGymForAction.status === "ACTIVE"
                ? "INACTIVE"
                : "ACTIVE";

        const result = await dispatch(
            updateGymStatus({
                gymId: selectedGymForAction._id,
                status: newStatus,
            })
        );

        if (
            updateGymStatus.fulfilled.match(result)
        ) {
            setShowStatusModal(false);
            setSelectedGymForAction(null);
        }
    };

    const exportCSV = () => {
        const headers = [
            "Gym Name",
            "Gym Email",
            "Owner",
            "Owner Email",
            "Phone",
            "City",
            "State",
            "Subscription Start",
            "Subscription End",
            "Status",
        ];

        const rows = filteredGyms.map((gym) => [
            gym.name || "",
            gym.email || "",
            gym.owner?.name || "",
            gym.owner?.email || "",
            gym.phone || "",
            gym.city || "",
            gym.state || "",
            formatDate(gym.subscriptionStart),
            formatDate(gym.subscriptionEnd),
            gym.status || "",
        ]);

        const csv = [
            headers,
            ...rows,
        ]
            .map((row) =>
                row
                    .map((value) =>
                        `"${String(value).replace(
                            /"/g,
                            '""'
                        )}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;
        link.download = "gym-management.csv";
        link.click();

        URL.revokeObjectURL(url);
    };

    const getInitials = (name) => {
        if (!name) return "G";

        return name
            .split(" ")
            .map((word) => word[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    const getPagination = () => {
        if (totalPages <= 7) {
            return Array.from(
                { length: totalPages },
                (_, index) => index + 1
            );
        }

        if (currentPage <= 4) {
            return [1, 2, 3, 4, 5, "...", totalPages];
        }

        if (currentPage >= totalPages - 3) {
            return [
                1,
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ];
        }

        return [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
        ];
    };

    return (
        <div className="gym-management-page">

            <div className="gym-page-header">

                <div>
                    <h1>Gym Management</h1>

                    <p>
                        Manage all gyms, owners,
                        subscriptions, and gym account
                        status from one place.
                    </p>
                </div>

                <div className="gym-header-actions">

                    <button
                        type="button"
                        className="gym-export-btn"
                        onClick={exportCSV}
                    >
                        <i className="bi bi-download"></i>
                        Export
                    </button>

                    <button
                        type="button"
                        className="gym-add-btn"
                        onClick={() =>
                            navigate(
                                "/users/create-user"
                            )
                        }
                    >
                        <i className="bi bi-plus-lg"></i>
                        Add New Gym
                    </button>

                </div>

            </div>


            <div className="gym-stat-grid">

                <div className="gym-stat-card blue">
                    <div className="gym-stat-icon">
                        <i className="bi bi-building"></i>
                    </div>

                    <div className="gym-stat-title">
                        TOTAL GYMS
                    </div>

                    <div className="gym-stat-value">
                        {stats.total}
                    </div>
                </div>


                <div className="gym-stat-card green">
                    <div className="gym-stat-icon">
                        <i className="bi bi-check-circle"></i>
                    </div>

                    <div className="gym-stat-top-right">
                        {activePercentage}% of total
                    </div>

                    <div className="gym-stat-title">
                        ACTIVE GYMS
                    </div>

                    <div className="gym-stat-value">
                        {stats.active}
                    </div>
                </div>


                <div className="gym-stat-card red">
                    <div className="gym-stat-icon">
                        <i className="bi bi-exclamation-triangle"></i>
                    </div>

                    <div className="gym-stat-top-right">
                        Requires attention
                    </div>

                    <div className="gym-stat-title">
                        INACTIVE GYMS
                    </div>

                    <div className="gym-stat-value">
                        {stats.inactive}
                    </div>
                </div>


                <div className="gym-stat-card yellow">
                    <div className="gym-stat-icon">
                        <i className="bi bi-clock"></i>
                    </div>

                    <div className="gym-stat-top-right">
                        Expires &lt; 30 days
                    </div>

                    <div className="gym-stat-title">
                        EXPIRING SOON
                    </div>

                    <div className="gym-stat-value">
                        {stats.expiring}
                    </div>
                </div>

            </div>


            <div className="gym-table-card">

                <div className="gym-filter-row">

                    <div className="gym-search-box">

                        <i className="bi bi-search"></i>

                        <input
                            type="text"
                            placeholder="Search gym name, owner, email..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="ALL">
                            All Status
                        </option>
                        <option value="ACTIVE">
                            Active
                        </option>
                        <option value="INACTIVE">
                            Inactive
                        </option>
                    </select>


                    <select
                        value={cityFilter}
                        onChange={(e) =>
                            setCityFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="ALL">
                            All Cities
                        </option>

                        {cities.map((city) => (
                            <option
                                key={city}
                                value={city}
                            >
                                {city}
                            </option>
                        ))}
                    </select>


                    <select
                        value={
                            subscriptionFilter
                        }
                        onChange={(e) =>
                            setSubscriptionFilter(
                                e.target.value
                            )
                        }
                    >
                        <option value="ALL">
                            All Subscription
                        </option>
                        <option value="ACTIVE">
                            Active
                        </option>
                        <option value="EXPIRING">
                            Expiring Soon
                        </option>
                        <option value="EXPIRED">
                            Expired
                        </option>
                    </select>


                    <div className="gym-date-box">

                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) =>
                                setFromDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <div className="gym-date-box">

                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) =>
                                setToDate(
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    <button
                        type="button"
                        className="gym-reset-btn"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                </div>


                {error && (
                    <div className="gym-alert error">
                        <i className="bi bi-exclamation-circle"></i>
                        {error}
                    </div>
                )}


                {loading ? (

                    <div className="gym-loading">
                        <div className="spinner-border"></div>
                        <span>
                            Loading gyms...
                        </span>
                    </div>

                ) : (

                    <div className="gym-table-wrapper">

                        <table className="gym-table">

                            <thead>
                                <tr>
                                    <th>GYM DETAILS</th>
                                    <th>OWNER INFO</th>
                                    <th>CONTACT & LOCATION</th>
                                    <th>SUBSCRIPTION PERIOD</th>
                                    <th>STATUS</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>

                            <tbody>

                                {paginatedGyms.length === 0 ? (

                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="gym-empty"
                                        >
                                            <i className="bi bi-building"></i>
                                            <strong>
                                                No gyms found
                                            </strong>
                                            <span>
                                                Try changing
                                                your search or
                                                filters.
                                            </span>
                                        </td>
                                    </tr>

                                ) : (

                                    paginatedGyms.map(
                                        (gym) => {

                                            const subscriptionState =
                                                getSubscriptionState(
                                                    gym
                                                );

                                            const days =
                                                getDaysRemaining(
                                                    gym.subscriptionEnd
                                                );

                                            return (
                                                <tr
                                                    key={
                                                        gym._id
                                                    }
                                                >

                                                    <td>

                                                        <div className="gym-details-cell">

                                                            <div className="gym-logo">

                                                                {gym.logo ? (
                                                                    <img
                                                                        src={
                                                                            gym.logo
                                                                        }
                                                                        alt={
                                                                            gym.name
                                                                        }
                                                                    />
                                                                ) : (
                                                                    getInitials(
                                                                        gym.name
                                                                    )
                                                                )}

                                                            </div>

                                                            <div>

                                                                <div className="gym-name">
                                                                    {
                                                                        gym.name
                                                                    }
                                                                </div>

                                                                <div className="gym-email">
                                                                    {
                                                                        gym.email ||
                                                                        "-"
                                                                    }
                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="owner-name">
                                                            {
                                                                gym
                                                                    .owner
                                                                    ?.name ||
                                                                "No Owner"
                                                            }
                                                        </div>

                                                        <div className="owner-email">
                                                            {
                                                                gym
                                                                    .owner
                                                                    ?.email ||
                                                                "-"
                                                            }
                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="contact-line">

                                                            <i className="bi bi-telephone"></i>

                                                            {
                                                                gym.phone ||
                                                                "-"
                                                            }

                                                        </div>

                                                        <div className="contact-line">

                                                            <i className="bi bi-geo-alt"></i>

                                                            {[
                                                                gym.city,
                                                                gym.state,
                                                            ]
                                                                .filter(
                                                                    Boolean
                                                                )
                                                                .join(
                                                                    ", "
                                                                ) ||
                                                                "-"}

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="subscription-period">

                                                            <div>
                                                                {formatDate(
                                                                    gym.subscriptionStart
                                                                )}{" "}
                                                                -{" "}
                                                                {formatDate(
                                                                    gym.subscriptionEnd
                                                                )}
                                                            </div>

                                                            {subscriptionState ===
                                                                "EXPIRED" && (
                                                                <span className="subscription-badge expired">
                                                                    Expired
                                                                </span>
                                                            )}

                                                            {subscriptionState ===
                                                                "EXPIRING" && (
                                                                <span className="subscription-badge expiring">
                                                                    Expires in{" "}
                                                                    {
                                                                        days
                                                                    }{" "}
                                                                    days
                                                                </span>
                                                            )}

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`gym-status ${
                                                                gym.status ===
                                                                "ACTIVE"
                                                                    ? "active"
                                                                    : "inactive"
                                                            }`}
                                                        >
                                                            {gym.status}
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="gym-actions">

                                                            <button
                                                                type="button"
                                                                className="gym-action-btn"
                                                                onClick={() =>
                                                                    handleView(
                                                                        gym
                                                                    )
                                                                }
                                                                title="View"
                                                            >
                                                                <i className="bi bi-eye"></i>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="gym-action-btn"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        gym
                                                                    )
                                                                }
                                                                title="Edit"
                                                            >
                                                                <i className="bi bi-pencil"></i>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className={`gym-action-btn ${
                                                                    gym.status ===
                                                                    "ACTIVE"
                                                                        ? "danger"
                                                                        : "success"
                                                                }`}
                                                                onClick={() =>
                                                                    openStatusModal(
                                                                        gym
                                                                    )
                                                                }
                                                                title={
                                                                    gym.status ===
                                                                    "ACTIVE"
                                                                        ? "Deactivate"
                                                                        : "Activate"
                                                                }
                                                            >
                                                                <i
                                                                    className={`bi ${
                                                                        gym.status ===
                                                                        "ACTIVE"
                                                                            ? "bi-power"
                                                                            : "bi-check-lg"
                                                                    }`}
                                                                ></i>
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}


                {!loading &&
                    filteredGyms.length > 0 && (

                        <div className="gym-pagination">

                            <div className="gym-pagination-info">

                                Showing{" "}
                                {Math.min(
                                    (currentPage - 1) *
                                        rowsPerPage +
                                        1,
                                    filteredGyms.length
                                )}
                                -
                                {Math.min(
                                    currentPage *
                                        rowsPerPage,
                                    filteredGyms.length
                                )}{" "}
                                of{" "}
                                {filteredGyms.length}{" "}
                                gyms

                            </div>


                            <div className="gym-pagination-right">

                                <div className="rows-per-page">

                                    <span>
                                        Rows per page:
                                    </span>

                                    <select
                                        value={
                                            rowsPerPage
                                        }
                                        onChange={(e) =>
                                            setRowsPerPage(
                                                Number(
                                                    e.target
                                                        .value
                                                )
                                            )
                                        }
                                    >
                                        <option value="10">
                                            10
                                        </option>

                                        <option value="25">
                                            25
                                        </option>

                                        <option value="50">
                                            50
                                        </option>
                                    </select>

                                </div>


                                <div className="pagination-buttons">

                                    <button
                                        type="button"
                                        disabled={
                                            currentPage ===
                                            1
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (prev) =>
                                                    prev - 1
                                            )
                                        }
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                    </button>


                                    {getPagination().map(
                                        (page, index) => {

                                            if (
                                                page ===
                                                "..."
                                            ) {
                                                return (
                                                    <span
                                                        key={
                                                            `dots-${index}`
                                                        }
                                                        className="pagination-dots"
                                                    >
                                                        ...
                                                    </span>
                                                );
                                            }

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        page
                                                    }
                                                    className={
                                                        currentPage ===
                                                        page
                                                            ? "active"
                                                            : ""
                                                    }
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            page
                                                        )
                                                    }
                                                >
                                                    {page}
                                                </button>
                                            );
                                        }
                                    )}


                                    <button
                                        type="button"
                                        disabled={
                                            currentPage ===
                                            totalPages
                                        }
                                        onClick={() =>
                                            setCurrentPage(
                                                (prev) =>
                                                    prev + 1
                                            )
                                        }
                                    >
                                        <i className="bi bi-chevron-right"></i>
                                    </button>

                                </div>

                            </div>

                        </div>
                    )}

            </div>


            {showDetails && selectedGym && (

                <div
                    className="gym-modal-overlay"
                    onClick={() =>
                        setShowDetails(false)
                    }
                >

                    <div
                        className="gym-modal details-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="gym-modal-header">

                            <div>
                                <h3>
                                    Gym Details
                                </h3>

                                <p>
                                    View gym and owner
                                    information
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowDetails(
                                        false
                                    )
                                }
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                        </div>


                        {detailsLoading ? (

                            <div className="gym-loading">
                                <div className="spinner-border"></div>
                            </div>

                        ) : detailsError ? (

                            <div className="gym-alert error">
                                {detailsError}
                            </div>

                        ) : (

                            <div className="gym-details-content">

                                <div className="gym-details-profile">

                                    <div className="gym-profile-logo">

                                        {selectedGym.logo ? (
                                            <img
                                                src={
                                                    selectedGym.logo
                                                }
                                                alt={
                                                    selectedGym.name
                                                }
                                            />
                                        ) : (
                                            getInitials(
                                                selectedGym.name
                                            )
                                        )}

                                    </div>

                                    <div>

                                        <h4>
                                            {
                                                selectedGym.name
                                            }
                                        </h4>

                                        <span
                                            className={`gym-status ${
                                                selectedGym.status ===
                                                "ACTIVE"
                                                    ? "active"
                                                    : "inactive"
                                            }`}
                                        >
                                            {
                                                selectedGym.status
                                            }
                                        </span>

                                    </div>

                                </div>


                                <div className="details-section">

                                    <h4>
                                        Gym Information
                                    </h4>

                                    <div className="details-grid">

                                        <div>
                                            <label>
                                                Gym Email
                                            </label>
                                            <span>
                                                {
                                                    selectedGym.email ||
                                                    "-"
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <label>
                                                Phone
                                            </label>
                                            <span>
                                                {
                                                    selectedGym.phone ||
                                                    "-"
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <label>
                                                Address
                                            </label>
                                            <span>
                                                {
                                                    selectedGym.address ||
                                                    "-"
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <label>
                                                City
                                            </label>
                                            <span>
                                                {
                                                    selectedGym.city ||
                                                    "-"
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <label>
                                                State
                                            </label>
                                            <span>
                                                {
                                                    selectedGym.state ||
                                                    "-"
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <label>
                                                Pincode
                                            </label>
                                            <span>
                                                {
                                                    selectedGym.pincode ||
                                                    "-"
                                                }
                                            </span>
                                        </div>

                                    </div>

                                </div>


                                <div className="details-section">

                                    <h4>
                                        Owner Information
                                    </h4>

                                    <div className="details-grid">

                                        <div>
                                            <label>
                                                Owner Name
                                            </label>
                                            <span>
                                                {
                                                    selectedGym
                                                        .owner
                                                        ?.name ||
                                                    "-"
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <label>
                                                Owner Email
                                            </label>
                                            <span>
                                                {
                                                    selectedGym
                                                        .owner
                                                        ?.email ||
                                                    "-"
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <label>
                                                Owner Phone
                                            </label>
                                            <span>
                                                {
                                                    selectedGym
                                                        .owner
                                                        ?.phone ||
                                                    "-"
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <label>
                                                Last Login
                                            </label>
                                            <span>
                                                {selectedGym
                                                    .owner
                                                    ?.lastLogin
                                                    ? formatDate(
                                                          selectedGym
                                                              .owner
                                                              .lastLogin
                                                      )
                                                    : "Never"}
                                            </span>
                                        </div>

                                    </div>

                                </div>


                                <div className="details-section">

                                    <h4>
                                        Subscription
                                    </h4>

                                    <div className="details-grid">

                                        <div>
                                            <label>
                                                Start Date
                                            </label>
                                            <span>
                                                {formatDate(
                                                    selectedGym.subscriptionStart
                                                )}
                                            </span>
                                        </div>

                                        <div>
                                            <label>
                                                End Date
                                            </label>
                                            <span>
                                                {formatDate(
                                                    selectedGym.subscriptionEnd
                                                )}
                                            </span>
                                        </div>

                                    </div>

                                </div>

                            </div>
                        )}


                        <div className="gym-modal-footer">

                            <button
                                type="button"
                                className="gym-secondary-btn"
                                onClick={() =>
                                    setShowDetails(
                                        false
                                    )
                                }
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                className="gym-primary-btn"
                                onClick={() => {
                                    setShowDetails(
                                        false
                                    );

                                    handleEdit(
                                        selectedGym
                                    );
                                }}
                            >
                                <i className="bi bi-pencil"></i>
                                Edit Gym
                            </button>

                        </div>

                    </div>

                </div>
            )}


            {showEdit && (

                <div
                    className="gym-modal-overlay"
                    onClick={() =>
                        setShowEdit(false)
                    }
                >

                    <form
                        className="gym-modal edit-modal"
                        onSubmit={handleUpdateGym}
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="gym-modal-header">

                            <div>
                                <h3>
                                    Edit Gym
                                </h3>

                                <p>
                                    Update gym information
                                    and subscription
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowEdit(false)
                                }
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>

                        </div>


                        <div className="edit-form">

                            {updateError && (
                                <div className="gym-alert error">
                                    {updateError}
                                </div>
                            )}

                            <div className="edit-form-grid">

                                <div className="edit-field">
                                    <label>
                                        Gym Name
                                    </label>
                                    <input
                                        name="name"
                                        value={
                                            editForm.name
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        required
                                    />
                                </div>

                                <div className="edit-field">
                                    <label>
                                        Gym Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            editForm.email
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />
                                </div>

                                <div className="edit-field">
                                    <label>
                                        Phone
                                    </label>
                                    <input
                                        name="phone"
                                        value={
                                            editForm.phone
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />
                                </div>

                                <div className="edit-field">
                                    <label>
                                        Address
                                    </label>
                                    <input
                                        name="address"
                                        value={
                                            editForm.address
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />
                                </div>

                                <div className="edit-field">
                                    <label>
                                        City
                                    </label>
                                    <input
                                        name="city"
                                        value={
                                            editForm.city
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />
                                </div>

                                <div className="edit-field">
                                    <label>
                                        State
                                    </label>
                                    <input
                                        name="state"
                                        value={
                                            editForm.state
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />
                                </div>

                                <div className="edit-field">
                                    <label>
                                        Pincode
                                    </label>
                                    <input
                                        name="pincode"
                                        value={
                                            editForm.pincode
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />
                                </div>

                                <div className="edit-field">
                                    <label>
                                        Logo URL
                                    </label>
                                    <input
                                        name="logo"
                                        value={
                                            editForm.logo
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />
                                </div>

                                <div className="edit-field">
                                    <label>
                                        Subscription Start
                                    </label>
                                    <input
                                        type="date"
                                        name="subscriptionStart"
                                        value={
                                            editForm.subscriptionStart
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />
                                </div>

                                <div className="edit-field">
                                    <label>
                                        Subscription End
                                    </label>
                                    <input
                                        type="date"
                                        name="subscriptionEnd"
                                        value={
                                            editForm.subscriptionEnd
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                    />
                                </div>

                            </div>

                        </div>


                        <div className="gym-modal-footer">

                            <button
                                type="button"
                                className="gym-secondary-btn"
                                onClick={() =>
                                    setShowEdit(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="gym-primary-btn"
                                disabled={
                                    updateLoading
                                }
                            >

                                {updateLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg"></i>
                                        Save Changes
                                    </>
                                )}

                            </button>

                        </div>

                    </form>

                </div>
            )}


            {showStatusModal &&
                selectedGymForAction && (

                    <div
                        className="gym-modal-overlay"
                        onClick={() =>
                            setShowStatusModal(
                                false
                            )
                        }
                    >

                        <div
                            className="gym-modal status-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="status-modal-icon">

                                <i
                                    className={`bi ${
                                        selectedGymForAction.status ===
                                        "ACTIVE"
                                            ? "bi-exclamation-triangle"
                                            : "bi-check-circle"
                                    }`}
                                ></i>

                            </div>

                            <h3>
                                {selectedGymForAction.status ===
                                "ACTIVE"
                                    ? "Deactivate Gym?"
                                    : "Activate Gym?"}
                            </h3>

                            <p>

                                {selectedGymForAction.status ===
                                "ACTIVE"
                                    ? `Are you sure you want to deactivate ${selectedGymForAction.name}? The gym owner will no longer be able to access the gym management system.`
                                    : `Are you sure you want to activate ${selectedGymForAction.name}? The gym owner will regain access to the gym management system.`}

                            </p>

                            {statusError && (
                                <div className="gym-alert error">
                                    {statusError}
                                </div>
                            )}

                            <div className="status-modal-actions">

                                <button
                                    type="button"
                                    className="gym-secondary-btn"
                                    onClick={() =>
                                        setShowStatusModal(
                                            false
                                        )
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className={
                                        selectedGymForAction.status ===
                                        "ACTIVE"
                                            ? "gym-danger-btn"
                                            : "gym-primary-btn"
                                    }
                                    onClick={
                                        handleStatusChange
                                    }
                                    disabled={
                                        statusLoading
                                    }
                                >

                                    {statusLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm"></span>
                                            Updating...
                                        </>
                                    ) : selectedGymForAction.status ===
                                      "ACTIVE" ? (
                                        "Deactivate Gym"
                                    ) : (
                                        "Activate Gym"
                                    )}

                                </button>

                            </div>

                        </div>

                    </div>
                )}

        </div>
    );
};

export default GymManagement;