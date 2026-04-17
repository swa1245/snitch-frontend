import { createBrowserRouter, Navigate } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Dashboard from "../features/products/pages/Dashboard";
import SellerProducts from "../features/products/pages/SellerProducts";
import CreateProduct from "../features/products/pages/CreateProduct";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/seller/products",
        element: (
            <ProtectedRoute>
                <SellerProducts />
            </ProtectedRoute>
        ),
    },
    {
        path: "/seller/products/create",
        element: (
            <ProtectedRoute>
                <CreateProduct />
            </ProtectedRoute>
        ),
    },
    {
        path: "*",
        element: <Navigate to="/" replace />
    }
])