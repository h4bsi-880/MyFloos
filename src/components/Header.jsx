import { useState } from "react";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import "../styles/header.css";

export default function Header({ user, onLogout }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="header">
      <button className="icon-button">
        <FaBars />
      </button>

      <h2 className="logo">
        Floos<span>Track</span>
      </h2>

      <div className="header-right">
        {user && (
          <span className="user-email" onClick={() => setShowProfile(true)} style={{ cursor: "pointer" }}>
            {user.displayName || user.email}
          </span>
        )}
        <button className="icon-button" onClick={onLogout} title="Log out">
          <FaSignOutAlt />
        </button>
      </div>

      {showProfile && <ProfileModal user={user} onClose={() => setShowProfile(false)} />}
    </header>
  );
}
