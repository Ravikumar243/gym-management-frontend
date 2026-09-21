import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import AddMember from "../pages/members/AddMember";
import Login from "../pages/auth/Login";
import MembershipPlans from "../pages/plans/MembershipPlans";
import Members from "../pages/members/Members";
import TrainerManagement from "../pages/trainer/TrainerManagement";
import CreateUser from "../pages/user/CreateUser";
import GymManagement from "../pages/gymManagement/GymManagement";
import EditMember from "../pages/members/EditMember";



const AppRoutes = () => {
    return (
        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Login />}
                />


                <Route
                    element={<MainLayout />}
                >

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/members/add"
                        element={<AddMember />}
                    />
                    <Route path="/membership-plans"
                        element={<MembershipPlans />}
                    />
                    <Route path="/members/list" element={<Members />} />

                    <Route path="/trainers" element={<TrainerManagement />} />
                    <Route path="/create-user" element={<CreateUser />} />
                    <Route path="/gym-management" element={<GymManagement />} />
                    <Route path="/members/edit/:memberId" element={<EditMember />} />
                </Route>

            </Routes>

        </BrowserRouter>
    );
};

export default AppRoutes;