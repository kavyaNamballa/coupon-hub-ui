import { Link } from "react-router-dom";
import "../styles/HeaderFooter.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Coupon Hub</Link>
      </div>
      <nav className="nav-links">
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
};

export default Header;
