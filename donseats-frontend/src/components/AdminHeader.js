import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { AuthContext } from "../services/AuthContext";
import { signOut } from "firebase/auth";
import { getAuth } from "firebase/auth";
import app from "../services/firebaseConfig";

const auth = getAuth(app);

const AdminHeader = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1 className="website-title">DonsEats</h1>
        <h2 className="admin-title">Admin Dashboard</h2>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
