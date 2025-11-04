import { Link } from "react-router-dom";
import ACTS_Logo from "../assets/ACTS_Logo.png";
import MyAccount_Logo from "../assets/MyAccount_Logo.png";

function Navbar() {
    return (
        <nav className="bg-green-900 text-white px-6 py-3">
            <div className="flex justify-between items-center">

                <div className="flex items-center">
                    <img src={ACTS_Logo} alt="ACTS Logo" className="h-10 w-10 mr-3" />
                    <h1 className="text-xl font-semibold tracking-wide">ACTS Library</h1>
                </div>

                <div className="flex space-x-6 items-center">
                    <Link to="/home" className="hover:text-gray-300 transition">Home</Link>
                    <Link to="/activities" className="hover:text-gray-300 transition">Activities</Link>
                    <Link to="/resources" className="hover:text-gray-300 transition">Resources</Link>
                    <Link to="/accounts" className="hover:text-gray-300 transition">Accounts</Link>
                    <Link to="/my-account">
                        <img
                            src={MyAccount_Logo}
                            alt="My Account"
                            className="h-8 w-8 hover:opacity-80 transition"
                        />
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
