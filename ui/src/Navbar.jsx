// Navbar.js
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkStyle = {
    padding: "6px 12px",
    borderRadius: "6px",
    fontWeight: "bold",
    textDecoration: "none",
  };

  return (
    <nav
      style={{
        display: "flex",
        gap: "20px",
        padding: "12px 20px",
        background: "#f7f7f7",
        borderBottom: "1px solid #ddd",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <NavLink
        to="/"
        style={({ isActive }) => ({
          ...linkStyle,
          background: isActive ? "#007bff" : "transparent",
          color: isActive ? "white" : "#333",
        })}
      >
        Campaigns
      </NavLink>

      <NavLink
        to="/create"
        style={({ isActive }) => ({
          ...linkStyle,
          background: isActive ? "#007bff" : "transparent",
          color: isActive ? "white" : "#333",
        })}
      >
        Create Campaign
      </NavLink>

      <NavLink
        to="/recipients"
        style={({ isActive }) => ({
          ...linkStyle,
          background: isActive ? "#007bff" : "transparent",
          color: isActive ? "white" : "#333",
        })}
      >
        Recipients
      </NavLink>
    </nav>
  );
}
