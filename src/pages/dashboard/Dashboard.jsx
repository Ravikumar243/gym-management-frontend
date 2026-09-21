import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Dashboard.css";
import Swal from "sweetalert2";

import { getDashboardData } from "../../redux/slices/dashboardSlice";


const Dashboard = () => {

    const dispatch = useDispatch();

    const {
        data,
        loading,
        error,
    } = useSelector((state) => state.dashboard);
    const { gym, notification, } = useSelector((state) => state.auth);

    console.log(data, "datakjdlk")
    useEffect(() => {
        dispatch(getDashboardData());
    }, [dispatch]);

    useEffect(() => {
        if (
            !notification?.show ||
            !notification?.message ||
            !gym?.id
        ) {
            return;
        }

        const notificationKey =
            `subscriptionNotificationShown_${gym.id}`;

        const alreadyShown =
            sessionStorage.getItem(notificationKey);

        if (alreadyShown === "true") {
            return;
        }

        Swal.fire({
            icon: notification.type || "warning",

            title:
                notification.title ||
                "Subscription Notification",

            text: notification.message,

            confirmButtonText: "Okay",

            confirmButtonColor: "#0d6efd",

            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.setItem(
                    notificationKey,
                    "true"
                );
            }
        });
    }, [notification, gym?.id]);


    const summary = data?.data?.summary;


    const dashboardStats = [
        {
            id: 1,
            title: "Total Gyms",
            value: summary?.totalGyms ?? 0,
            change: `${summary?.activeGyms ?? 0} Active`,
            icon: "bi-building",
            roles: ["SUPER_ADMIN"],
        },

        {
            id: 2,
            title: "Total Members",
            value: summary?.totalMembers ?? 0,
            change: `${summary?.activeMembers ?? 0} Active`,
            icon: "bi-people",
            roles: ["SUPER_ADMIN", "OWNER"],
        },

        {
            id: 3,
            title: "New Members",
            value: summary?.newMembersThisMonth ?? 0,
            change: "This Month",
            icon: "bi-person-plus",
            roles: ["SUPER_ADMIN", "OWNER"],
        },

        {
            id: 4,
            title: "Monthly Revenue",
            value: `₹${(
                summary?.thisMonthRevenue ?? 0
            ).toLocaleString("en-IN")}`,
            change: `Total ₹${(
                summary?.totalRevenue ?? 0
            ).toLocaleString("en-IN")}`,
            icon: "bi-currency-rupee",
            roles: ["SUPER_ADMIN", "OWNER"],
        },
    ];

    const additionalStats = [
        {
            id: 1,
            title: "Active Members",
            value: summary?.activeMembers ?? 0,
            description: `Inactive: ${summary?.inactiveMembers ?? 0}`,
            roles: ["SUPER_ADMIN", "OWNER"],
        },
        {
            id: 2,
            title: "Expired Memberships",
            value: summary?.expiredMembers ?? 0,
            description: `Expiring Soon: ${summary?.expiringMembers ?? 0}`,
            roles: ["SUPER_ADMIN", "OWNER"],
        },
        {
            id: 3,
            title: "Pending Payments",
            value: summary?.pendingPayments ?? 0,
            description: "Payment status pending",
            roles: ["SUPER_ADMIN", "OWNER"],
        },
    ];

    if (loading) {
        return (
            <div className="fitpulse-dashboard">

                <div className="dashboard-heading">

                    <div>
                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Loading dashboard data...
                        </p>
                    </div>

                </div>

                <div className="text-center py-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                </div>

            </div>
        );
    }


    if (error) {
        return (
            <div className="fitpulse-dashboard">

                <div className="alert alert-danger">
                    {error}
                </div>

            </div>
        );
    }


    return (
        <div className="fitpulse-dashboard">

            <div className="dashboard-heading">

                <div>

                    <h1>
                        {data?.role === "SUPER_ADMIN"
                            ? "Super Admin Overview"
                            : "Gym Owner Overview"}
                    </h1>

                    <p>
                        {data?.role === "SUPER_ADMIN"
                            ? "Network performance and gym management metrics."
                            : "Your gym performance and management metrics."}
                    </p>

                </div>


                <div className="dashboard-actions">

                    {/* <button className="btn btn-light">

                        <i className="bi bi-file-earmark-text me-2"></i>

                        Generate System Report

                    </button> */}


                    {data?.role === "SUPER_ADMIN" && (

                        <button className="btn btn-primary">

                            <i className="bi bi-plus-lg me-2"></i>

                            Add New Gym

                        </button>

                    )}

                </div>

            </div>


            {/* Stats */}

            <div className="row g-3">

                {dashboardStats.filter((stat) => stat.roles.includes(data?.role)).map((stat) => (

                    <div
                        key={stat.id}
                        className="col-12 col-sm-6 col-xl-3"
                    >

                        <div className="dashboard-stat-card">

                            <div className="stat-top">

                                <div className="stat-icon">

                                    <i
                                        className={`bi ${stat.icon}`}
                                    ></i>

                                </div>


                                <span className="stat-change">

                                    {stat.change}

                                </span>

                            </div>


                            <div className="stat-title">

                                {stat.title}

                            </div>


                            <div className="stat-value">

                                {stat.value}

                            </div>

                        </div>

                    </div>

                ))}

            </div>


            {/* Additional Summary */}

            <div className="row g-3 mt-1">

                {additionalStats
                    .filter((stat) =>
                        stat.roles.includes(data?.role)
                    )
                    .map((stat) => (
                        <div
                            key={stat.id}
                            className="col-12 col-md-4"
                        >
                            <div className="dashboard-stat-card">

                                <div className="stat-title">
                                    {stat.title}
                                </div>

                                <div className="stat-value">
                                    {stat.value}
                                </div>

                                <small>
                                    {stat.description}
                                </small>

                            </div>
                        </div>
                    ))}

            </div>


            {/* Dashboard Analytics */}

            <div className="dashboard-empty">

                <div>

                    <div className="dashboard-empty-icon">

                        <i className="bi bi-grid-1x2"></i>

                    </div>

                    <h5>
                        Dashboard Analytics
                    </h5>

                    <p>
                        Charts and reports will be added here.
                    </p>

                </div>

            </div>


        </div>
    );
};


export default Dashboard;