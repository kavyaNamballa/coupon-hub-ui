import { Link, useNavigate } from "react-router-dom";
import "../styles/HeaderFooter.css";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/coupons" className="nav-link">
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
              <Link to="/profile" className="nav-link profile-link">
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
