import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import ProfileModal from "./ProfileModal";
import { setLanguage } from "../i18n";
import "../styles/header.css";

export default function Header({ user, onLogout }) {
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { i18n } = useTranslation();

  function chooseLanguage(lang) {
    setLanguage(lang);
    setShowMenu(false);
  }

  return (
    <header className="header">
      <div className="menu-wrapper">
        <button className="icon-button" onClick={() => setShowMenu(!showMenu)}>
          <FaBars />
        </button>

        {showMenu && (
          <>
            <div className="menu-backdrop" onClick={() => setShowMenu(false)} />
            <div className="menu-dropdown">
              <p className="menu-title">Language / اللغة</p>
              <button
                className={`menu-option ${i18n.language === "en" ? "active" : ""}`}
                onClick={() => chooseLanguage("en")}
              >
                🇬🇧 English
              </button>
              <button
                className={`menu-option ${i18n.language === "ar" ? "active" : ""}`}
                onClick={() => chooseLanguage("ar")}
              >
                🇴🇲 العربية
              </button>
            </div>
          </>
        )}
      </div>

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