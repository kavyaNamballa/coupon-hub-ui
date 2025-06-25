import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/HeaderFooter.css";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import lightSwitchOn from "../assets/20170101-light-switch-on-80675.mp3";
import lightSwitchOff from "../assets/light-switch-81967.mp3";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const playSound = (audioFile: string) => {
    const audio = new Audio(audioFile);
    audio.volume = 0.3;
    audio.play().catch((error) => {
      console.log("Audio playback failed:", error);
    });
  };

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      playSound(lightSwitchOn);
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      playSound(lightSwitchOff);
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to="/">
            <span className="logo-icon">🎫</span>
            <span className="logo-text">CouponHub</span>
          </Link>
        </div>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Home
          </Link>
          <Link
            to="/coupons"
            className={`nav-link ${isActive("/coupons") ? "active" : ""}`}
          >
            Coupons
          </Link>

          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={`nav-link profile-link ${
                  isActive("/profile") ? "active" : ""
                }`}
              >
                <span className="profile-icon">👤</span>
                <span className="profile-text">Profile</span>
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <span className="logout-icon">🚪</span>
                <span className="logout-text">Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="login-btn">
              <span className="login-icon">👤</span>
              <span className="login-text">Login</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
