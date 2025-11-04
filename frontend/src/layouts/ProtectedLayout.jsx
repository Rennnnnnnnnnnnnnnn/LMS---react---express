import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ProtectedLayout({ isLoggedIn }) {
    if (!isLoggedIn) return <Navigate to="/" replace />;

    return (
        <div>
            <Navbar />


            <main>
                <Outlet />
            </main>
        </div>
    );
}
