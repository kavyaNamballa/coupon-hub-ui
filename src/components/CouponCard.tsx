import React, { useState } from "react";
import { Coupon } from "../models/coupon.model";
import { useAuth } from "../context/AuthContext";
import "../styles/CouponCard.css";

interface CouponCardProps {
  coupon: Coupon;
  onWishlistToggle: (couponId: number) => void;
  onUseCoupon: (couponId: number) => void;
  isInWishlist: boolean;
  isWishlistLoading?: boolean;
  hideActions?: boolean; // For uploaded coupons in profile
}

const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  onWishlistToggle,
  onUseCoupon,
  isInWishlist,
  isWishlistLoading = false,
  hideActions = false,
}) => {
  const { user } = useAuth();
  const [isRevealed, setIsRevealed] = useState(false);

  const handleUse = async () => {
    setIsRevealed(true);
    onUseCoupon(coupon.id);
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateDescription = (description: string, maxLength: number = 50) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
  };

  const getStatusBadge = () => {
    if (coupon.usedUserId) {
      return <span className="status-badge used">Used</span>;
    }
    if (new Date(coupon.expiryDate) < new Date()) {
      return <span className="status-badge expired">Expired</span>;
    }
    return <span className="status-badge active">Active</span>;
  };

  const isExpired = new Date(coupon.expiryDate) < new Date();

  return (
    <div className="coupon-card">
      <div className="coupon-header">
        <div className="coupon-brand">
          <h4>{coupon.brandName}</h4>
        </div>
        {!hideActions && (
          <button
            className={`wishlist-btn ${isInWishlist ? "filled" : ""}`}
            onClick={() => onWishlistToggle(coupon.id)}
            disabled={isWishlistLoading}
            aria-label={
              isInWishlist ? "Remove from wishlist" : "Add to wishlist"
            }
          >
            {isInWishlist ? "❤️" : "🤍"}
          </button>
        )}
      </div>

      {/* Main content */}
      <div className="coupon-content">
        <p className="coupon-description" title={coupon.description}>
          {coupon.description}
        </p>

        <div className="coupon-details">
          <div className="coupon-info">
            <span className="discount-value">{coupon.discountValue}</span>
            <span className="coupon-type">{coupon.couponType}</span>
            {coupon.minPurchaseAmount && (
              <span className="min-purchase">
                Min: ₹{coupon.minPurchaseAmount}
              </span>
            )}
          </div>

          {/* Coupon code section */}
          <div className="coupon-code-section">
            {isRevealed || hideActions ? (
              <div className="revealed-code">
                <span className="code-label">Coupon Code</span>
                <div className="code-value">{coupon.code}</div>
              </div>
            ) : (
              <div className="hidden-code">
                <div className="code-placeholder">••••••••</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer with expiry date and status */}
      <div className="coupon-meta">
        <span className="expiry-date">
          Expires: {formatExpiryDate(coupon.expiryDate)}
        </span>
        {getStatusBadge()}
      </div>

      {/* Action buttons - only show if not hidden and not used */}
      {!hideActions && !isRevealed && (
        <div className="coupon-actions">
          <button
            className="action-btn use-btn"
            onClick={handleUse}
            disabled={isRevealed || isExpired}
          >
            💳 Use Coupon
          </button>
        </div>
      )}

      {/* Show "Used" status if coupon is used */}
      {!hideActions && isRevealed && (
        <div className="coupon-actions">
          <button className="action-btn use-btn" disabled>
            ✓ Used
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponCard;
