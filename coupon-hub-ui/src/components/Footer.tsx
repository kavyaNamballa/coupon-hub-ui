import "../styles/HeaderFooter.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3 className="footer-title">🎫 CouponHub</h3>
          <p className="footer-description">
            Your trusted platform for sharing and discovering amazing deals.
            Join our community of smart shoppers and save together.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              📘
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              🐦
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              📷
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              💼
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Quick Links</h4>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/coupons" className="footer-link">
                Browse Coupons
              </Link>
            </li>
            <li>
              <Link to="/register" className="footer-link">
                Sign Up
              </Link>
            </li>
            <li>
              <Link to="/login" className="footer-link">
                Login
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Support</h4>
          <ul className="footer-links">
            <li>
              <a href="#" className="footer-link">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Report Issue
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-subtitle">Legal</h4>
          <ul className="footer-links">
            <li>
              <a href="#" className="footer-link">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                Cookie Policy
              </a>
            </li>
            <li>
              <a href="#" className="footer-link">
                DMCA
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            © {currentYear} CouponHub. All Rights Reserved.
          </p>
          <div className="footer-stats">
            <span className="stat">10K+ Coupons Shared</span>
            <span className="stat">5K+ Happy Users</span>
            <span className="stat">₹50L+ Total Savings</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
