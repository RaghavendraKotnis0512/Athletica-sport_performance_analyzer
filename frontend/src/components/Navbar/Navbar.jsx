import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ username }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Here you would typically clear any stored authentication data (like tokens)
    localStorage.removeItem("authToken"); // Example of removing an auth token
    navigate("/"); // Redirect to the login page
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h2 className="navbar-brand">Athletica</h2>
        <div className="navbar-right">
          <span className="navbar-user">{username}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
