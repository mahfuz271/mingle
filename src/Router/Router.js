import { createBrowserRouter } from "react-router-dom";
import Error from "../Components/Error/Error";
import Homepage from "../Components/Homepage/Homepage";
import Main from "../Layout/Main";
import Login from "../Components/Login/Login";
import Signup from "../Components/Signup/Signup";
import PrivateRoute from "./PrivateRoute";
import Logout from "../Components/Logout/Logout";
import DashboardLayout from "../Layout/DashboardLayout";
import Dashboard from "../Components/Pages/Dashboard";
import Users from "../Components/Pages/Users";
import RoleRoute from "./RoleRoute";

const Router = createBrowserRouter([
    {
        path: '/',
        element: <Main />,
        errorElement: <Error></Error>,
        children: [
            {
                path: "/",
                element: <Homepage />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/logout",
                element: <PrivateRoute><Logout /></PrivateRoute>
            },
            {
                path: "/signup",
                element: <Signup />
            },
        ]
    },
    {
        path: '/dashboard',
        element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
        errorElement: <Error></Error>,
        children: [
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: "/dashboard/users",
                element: <RoleRoute for_role="admin"><Users /></RoleRoute>
            }
        ]
    },

    {
        path: '*',
        element: <Error />
    }
]);

export default Router;