import { useEffect, useState } from "react";
import {
  Coupon,
  PaginatedResponse,
  PaginationParams,
} from "../models/coupon.model";
import { WishlistService } from "../service/WishlistService";
import { CouponService } from "../service/CouponService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "../styles/WishlistPage.css";
import Pagination from "../components/Pagination";
import CouponCard from "../components/CouponCard";

const WishlistPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paginationData, setPaginationData] =
    useState<PaginatedResponse<Coupon> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [remainingDailyUsage, setRemainingDailyUsage] = useState<number>(10);

  useEffect(() => {
    if (user?.id) {
      loadWishlist();
    }
  }, [user?.id, currentPage, pageSize, sortBy, sortDirection]);

  // Load daily usage when user is available
  useEffect(() => {
    const loadDailyUsage = async () => {
      if (user?.id) {
        try {
          const remaining = await CouponService.getRemainingDailyUsage(user.id);
          setRemainingDailyUsage(remaining);
        } catch (error) {
          console.error("Error loading daily usage:", error);
        }
      }
    };

    loadDailyUsage();
  }, [user?.id]);

  const loadWishlist = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const paginationParams: PaginationParams = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDirection,
      };

      const response = await WishlistService.getUserWishlist(
        user!.id,
        paginationParams
      );
      setPaginationData(response);
    } catch (error: any) {
      toast.error(error?.message || error);
      setPaginationData(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setSortDirection("DESC");
    }
    setCurrentPage(0);
  };

  const handleWishlistToggle = async (couponId: number) => {
    try {
      await WishlistService.removeFromWishlist(couponId, user!.id);
      toast.success("Removed from wishlist!");
      loadWishlist(); // Refresh the list
    } catch (error: any) {
      toast.error(error?.message || error);
    }
  };

  const handleUseCoupon = async (couponId: number) => {
    if (remainingDailyUsage <= 0) {
      toast.error(
        "You have reached your daily limit of 10 coupons. Please try again tomorrow!"
      );
      return;
    }

    try {
      const success = await CouponService.useCoupon(couponId, user!.id);
      if (success) {
        toast.success("Coupon used successfully!");
        setRemainingDailyUsage((prev) => Math.max(0, prev - 1));
        loadWishlist();
      } else {
        toast.error("Failed to use coupon");
      }
    } catch (error: any) {
      if (error.message?.includes("Daily usage limit reached")) {
        toast.error(
          "You have reached your daily limit of 10 coupons. Please try again tomorrow!"
        );
        setRemainingDailyUsage(0);
      } else {
        toast.error(error?.message || error);
      }
    }
  };

  if (loading) {
    return (
      <div className="wishlist-container">
        <div className="loading">Loading your wishlist...</div>
      </div>
    );
  }

  const wishlistCoupons = paginationData?.content || [];

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>Your saved coupons ({paginationData?.totalElements || 0})</p>
      </div>

      {/* Sort controls */}
      <div className="sort-controls">
        <span>Sort by:</span>
        <button
          className={`sort-btn ${sortBy === "createdAt" ? "active" : ""}`}
          onClick={() => handleSortChange("createdAt")}
        >
          Date {sortBy === "createdAt" && (sortDirection === "ASC" ? "↑" : "↓")}
        </button>
        <button
          className={`sort-btn ${sortBy === "expiryDate" ? "active" : ""}`}
          onClick={() => handleSortChange("expiryDate")}
        >
          Expiry{" "}
          {sortBy === "expiryDate" && (sortDirection === "ASC" ? "↑" : "↓")}
        </button>
        <button
          className={`sort-btn ${sortBy === "brandName" ? "active" : ""}`}
          onClick={() => handleSortChange("brandName")}
        >
          Brand{" "}
          {sortBy === "brandName" && (sortDirection === "ASC" ? "↑" : "↓")}
        </button>
      </div>

      {/* Daily usage info */}
      {user && (
        <div className="daily-usage-info">
          <span className="usage-text">
            Daily usage: {10 - remainingDailyUsage}/10 coupons used
          </span>
          {remainingDailyUsage <= 2 && (
            <span className="usage-warning">
              ⚠️ Only {remainingDailyUsage} coupons remaining today!
            </span>
          )}
        </div>
      )}

      {wishlistCoupons.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is empty.</p>
          <p>Start adding coupons to your wishlist to see them here!</p>
        </div>
      ) : (
        <>
          <div className="wishlist-grid">
            {wishlistCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onWishlistToggle={handleWishlistToggle}
                onUseCoupon={handleUseCoupon}
                isInWishlist={true}
                isWishlistLoading={false}
              />
            ))}
          </div>

          {/* Pagination */}
          {paginationData && (
            <Pagination
              currentPage={currentPage}
              totalPages={paginationData.totalPages}
              totalElements={paginationData.totalElements}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showPageSizeSelector={true}
            />
          )}
        </>
      )}
    </div>
  );
};

export default WishlistPage;
