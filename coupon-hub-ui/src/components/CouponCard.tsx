import React, { useState, useEffect } from "react";
import { Coupon } from "../models/coupon.model";
import { WishlistService } from "../service/WishlistService";
import { CouponService } from "../service/CouponService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import dayjs from "dayjs";

interface CouponCardProps {
  coupon: Coupon;
  onWishlistChange?: () => void;
  onCouponUsed?: () => void;
  showActions?: boolean;
}

const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  onWishlistChange,
  onCouponUsed,
  showActions = true,
}) => {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    if (user?.id) {
      checkWishlistStatus();
    }
  }, [user, coupon.id]);

  const checkWishlistStatus = async () => {
    try {
      const status = await WishlistService.checkWishlistStatus(
        user!.id,
        coupon.id
      );
      setIsInWishlist(status);
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user?.id) {
      toast.error("Please login to add to wishlist");
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        await WishlistService.removeFromWishlist(coupon.id, user.id);
        toast.success("Removed from wishlist");
        setIsInWishlist(false);
      } else {
        await WishlistService.addToWishlist(coupon.id, user.id);
        toast.success("Added to wishlist");
        setIsInWishlist(true);
      }
      onWishlistChange?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCoupon = async () => {
    if (!user?.id) {
      toast.error("Please login to use coupons");
      return;
    }

    setIsLoading(true);
    try {
      const success = await CouponService.useCoupon(coupon.id, user.id);
      if (success) {
        // Reveal the code after successful usage
        const code = await CouponService.revealCouponCode(coupon.id, user.id);
        setCouponCode(code);
        setIsRevealed(true);
        toast.success(`Coupon used successfully! Code: ${code}`);
        onCouponUsed?.();
      } else {
        toast.error("Failed to use coupon");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to use coupon");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevealCode = async () => {
    if (!user?.id) {
      toast.error("Please login to reveal coupon codes");
      return;
    }

    setIsLoading(true);
    try {
      const code = await CouponService.revealCouponCode(coupon.id, user.id);
      setCouponCode(code);
      setIsRevealed(true);
      toast.success(`Coupon Code: ${code}`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to reveal coupon code");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);

    if (coupon.usedUserId) {
      return <span className="status-badge used">Used</span>;
    } else if (expiryDate < now) {
      return <span className="status-badge expired">Expired</span>;
    } else {
      return <span className="status-badge active">Active</span>;
    }
  };

  const isUsed = coupon.usedUserId != null;
  const isExpired = new Date(coupon.expiryDate) < new Date();

  return (
    <div className="coupon-card">
      <div className="coupon-header">
        <div className="coupon-brand">
          <h4>{coupon.brandName}</h4>
          {getStatusBadge()}
        </div>
        {showActions && user && (
          <button
            className={`wishlist-btn ${isInWishlist ? "filled" : "outlined"}`}
            onClick={handleWishlistToggle}
            disabled={isLoading}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            {isInWishlist ? "❤️" : "🤍"}
          </button>
        )}
      </div>

      <div className="coupon-content">
        <p className="coupon-description">{coupon.description}</p>

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

          <div className="coupon-code-section">
            {isRevealed && couponCode ? (
              <div className="revealed-code">
                <span className="code-label">Coupon Code:</span>
                <span className="code-value">{couponCode}</span>
              </div>
            ) : (
              <div className="hidden-code">
                <span className="code-placeholder">••••••••</span>
              </div>
            )}
          </div>

          <div className="coupon-meta">
            <span className="expiry-date">
              Expires: {dayjs(coupon.expiryDate).format("DD/MM/YYYY")}
            </span>
          </div>
        </div>
      </div>

      {showActions && user && (
        <div className="coupon-actions">
          <button
            className="action-btn reveal-btn"
            onClick={handleRevealCode}
            disabled={isLoading || isUsed || isExpired}
          >
            Reveal Code
          </button>
          <button
            className="action-btn use-btn"
            onClick={handleUseCoupon}
            disabled={isLoading || isUsed || isExpired}
          >
            Use Coupon
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponCard;
