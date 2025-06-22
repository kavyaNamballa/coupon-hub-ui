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
import dayjs from "dayjs";
import "../styles/WishlistPage.css";
import Pagination from "../components/Pagination";

const WishlistPage = () => {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Pagination state
  const [paginationData, setPaginationData] =
    useState<PaginatedResponse<Coupon> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

  useEffect(() => {
    if (user?.id) {
      loadWishlist();
    }
  }, [user, currentPage, pageSize, sortBy, sortDirection]);

  const loadWishlist = async () => {
    try {
      const paginationParams: PaginationParams = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDirection,
      };

      const response = await WishlistService.getUserWishlistPaginated(
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

  const handleRemoveFromWishlist = async (couponId: number) => {
    try {
      await WishlistService.removeFromWishlist(couponId, user!.id);
      toast.success("Removed from wishlist!");
      loadWishlist(); // Refresh the list
    } catch (error: any) {
      toast.error(error?.message || error);
    }
  };

  const handleUseCoupon = async (couponId: number) => {
    try {
      const success = await CouponService.useCoupon(couponId, user!.id);
      if (success) {
        toast.success("Coupon used successfully!");
        loadWishlist(); // Refresh the list
      } else {
        toast.error("Failed to use coupon");
      }
    } catch (error: any) {
      toast.error(error?.message || error);
    }
  };

  const handleRevealCode = async (couponId: number) => {
    try {
      const code = await CouponService.revealCouponCode(couponId, user!.id);
      toast.success(`Coupon Code: ${code}`);
    } catch (error: any) {
      toast.error(error?.message || error);
    }
  };

  const getStatusBadge = (coupon: Coupon) => {
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

      {wishlistCoupons.length === 0 ? (
        <div className="empty-state">
          <p>Your wishlist is empty.</p>
          <p>Start adding coupons to your wishlist to see them here!</p>
        </div>
      ) : (
        <>
          <div className="wishlist-grid">
            {wishlistCoupons.map((coupon) => (
              <div key={coupon.id} className="wishlist-card">
                <div className="card-header">
                  <h4>{coupon.brandName}</h4>
                  {getStatusBadge(coupon)}
                </div>
                <div className="card-content">
                  <p className="coupon-description">{coupon.description}</p>
                  <div className="coupon-details">
                    <span className="discount">{coupon.discountValue}</span>
                    <span className="type">{coupon.couponType}</span>
                    {coupon.minPurchaseAmount && (
                      <span className="min-amount">
                        Min: ₹{coupon.minPurchaseAmount}
                      </span>
                    )}
                    <span className="expiry">
                      Expires: {dayjs(coupon.expiryDate).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className="action-btn reveal-btn"
                    onClick={() => handleRevealCode(coupon.id)}
                    disabled={coupon.usedUserId != null}
                  >
                    Reveal Code
                  </button>
                  <button
                    className="action-btn use-btn"
                    onClick={() => handleUseCoupon(coupon.id)}
                    disabled={coupon.usedUserId != null}
                  >
                    Use Coupon
                  </button>
                  <button
                    className="action-btn remove-btn"
                    onClick={() => handleRemoveFromWishlist(coupon.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
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
