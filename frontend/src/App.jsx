import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Resources from "./pages/Resources";
import Accounts from "./pages/Accounts";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Activities from "./pages/Activities";
import MyAccount from "./pages/MyAccount";
import ToastNotification from "./components/ToastNotification";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Login onLogin={() => setIsLoggedIn(true)} />} />

          {/* Protected layout */}
          <Route element={<ProtectedLayout isLoggedIn={isLoggedIn} />}>
            <Route path="/home" element={<Home />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/my-account" element={<MyAccount />} />
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastNotification />
    </>
  );
}

export default App;
