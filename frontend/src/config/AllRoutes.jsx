import { Navigate, useRoutes } from "react-router-dom";
import AdminModule from "../modules/AdminModule";
import rootRoutes from "./Root/Root";
import AdminLogin from "../components/feature/Auth/AdminLogin";

const AllRoutes = () => {
    // Function to check if a token exists
    const isToken = () => !!localStorage.getItem("ddlj");

    const userRoutes = useRoutes([
        {
            path: "/",
            element: isToken() ? <AdminModule /> : <Navigate to="/signin" replace />,
            children: rootRoutes, // Child routes only render if the token exists
        },
        {
            path: "/signin",
            element: isToken() ? <Navigate to="/" replace /> : <AdminLogin />,
        },
        {
            path: "*",
            element: <Navigate to="/" replace />, // Catch-all for undefined routes
        },
    ]);

    return userRoutes;
};

export default AllRoutes;
