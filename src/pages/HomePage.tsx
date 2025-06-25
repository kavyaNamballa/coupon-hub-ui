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
              <div className="hero-coupon-card coupon-1">
                <div className="coupon-header">
                  <div className="store-info">
                    <div className="store-logo">🛒</div>
                    <span className="store-name">Amazon</span>
                  </div>
                  <span className="discount">20% OFF</span>
                </div>
                <div className="coupon-content">
                  <div className="coupon-details">
                    <p className="category">Electronics & Gadgets</p>
                    <p className="description">
                      Get amazing discounts on smartphones, laptops, and more!
                    </p>
                  </div>
                  <div className="coupon-meta">
                    <div className="usage-info">
                      <span className="usage-count">🔥 1.2K used</span>
                      <span className="expiry">⏰ Expires: 15 Dec</span>
                    </div>
                    <div className="min-purchase">
                      <span>Min. Purchase: ₹999</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hero-coupon-card coupon-2">
                <div className="coupon-header">
                  <div className="store-info">
                    <div className="store-logo">👗</div>
                    <span className="store-name">Myntra</span>
                  </div>
                  <span className="discount">₹500 OFF</span>
                </div>
                <div className="coupon-content">
                  <div className="coupon-details">
                    <p className="category">Fashion & Lifestyle</p>
                    <p className="description">
                      Upgrade your wardrobe with trendy fashion items!
                    </p>
                  </div>
                  <div className="coupon-meta">
                    <div className="usage-info">
                      <span className="usage-count">🔥 856 used</span>
                      <span className="expiry">⏰ Expires: 20 Dec</span>
                    </div>
                    <div className="min-purchase">
                      <span>Min. Purchase: ₹1499</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hero-coupon-card coupon-3">
                <div className="coupon-header">
                  <div className="store-info">
                    <div className="store-logo">🏠</div>
                    <span className="store-name">Flipkart</span>
                  </div>
                  <span className="discount">15% OFF</span>
                </div>
                <div className="coupon-content">
                  <div className="coupon-details">
                    <p className="category">Home & Kitchen</p>
                    <p className="description">
                      Transform your home with premium kitchen appliances!
                    </p>
                  </div>
                  <div className="coupon-meta">
                    <div className="usage-info">
                      <span className="usage-count">🔥 2.1K used</span>
                      <span className="expiry">⏰ Expires: 25 Dec</span>
                    </div>
                    <div className="min-purchase">
                      <span>Min. Purchase: ₹799</span>
                    </div>
                  </div>
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
