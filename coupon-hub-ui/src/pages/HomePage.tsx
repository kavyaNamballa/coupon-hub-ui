import AboutUs from "../components/AboutUs";
import "../styles/Home.css";
import Brands from "../components/Brands";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Share & Save with
              <span className="highlight"> CouponHub</span>
            </h1>
            <p className="hero-subtitle">
              Don't let your unused coupons go to waste! Share them with the
              community and discover amazing deals from others. Join thousands
              of smart shoppers who save money together.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Coupons Shared</span>
              </div>
              <div className="stat">
                <span className="stat-number">5K+</span>
                <span className="stat-label">Happy Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">₹50L+</span>
                <span className="stat-label">Total Savings</span>
              </div>
            </div>
            <div className="hero-actions">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="cta-button primary">
                    Get Started Free
                  </Link>
                  <Link to="/login" className="cta-button secondary">
                    Sign In
                  </Link>
                </>
              ) : (
                <Link to="/coupons" className="cta-button primary">
                  Browse Coupons
                </Link>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="coupon-stack">
              <div className="coupon-card coupon-1">
                <div className="coupon-header">
                  <span className="store-name">Amazon</span>
                  <span className="discount">20% OFF</span>
                </div>
                <div className="coupon-details">
                  <p>Electronics & Gadgets</p>
                  <span className="expiry">Expires: 15 Dec</span>
                </div>
              </div>
              <div className="coupon-card coupon-2">
                <div className="coupon-header">
                  <span className="store-name">Myntra</span>
                  <span className="discount">₹500 OFF</span>
                </div>
                <div className="coupon-details">
                  <p>Fashion & Lifestyle</p>
                  <span className="expiry">Expires: 20 Dec</span>
                </div>
              </div>
              <div className="coupon-card coupon-3">
                <div className="coupon-header">
                  <span className="store-name">Flipkart</span>
                  <span className="discount">15% OFF</span>
                </div>
                <div className="coupon-details">
                  <p>Home & Kitchen</p>
                  <span className="expiry">Expires: 25 Dec</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-icon">📱</div>
            <h3>1. Upload</h3>
            <p>Share your unused coupons with the community</p>
          </div>
          <div className="step">
            <div className="step-icon">🔍</div>
            <h3>2. Discover</h3>
            <p>Browse through thousands of available coupons</p>
          </div>
          <div className="step">
            <div className="step-icon">💰</div>
            <h3>3. Save</h3>
            <p>Use coupons and save money on your purchases</p>
          </div>
        </div>
      </section>

      <main>
        <Brands />
        <AboutUs />
      </main>
    </div>
  );
};

export default Home;
