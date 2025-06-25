import { useEffect, useState } from "react";
import {
  Coupon,
  PaginatedResponse,
  PaginationParams,
} from "../models/coupon.model";
import { CouponService, CouponUploadData } from "../service/CouponService";
import { WishlistService } from "../service/WishlistService";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import "../styles/Profile.css";
import { brands } from "../enum/brands";
import Pagination from "../components/Pagination";
import CouponCard from "../components/CouponCard";
import { Link } from "react-router-dom";

const Profile = () => {
  const brandNames = brands.map((brand) => brand.name);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { user } = useAuth();

  // Pagination state
  const [paginationData, setPaginationData] =
    useState<PaginatedResponse<Coupon> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

  // Wishlist count
  const [wishlistCount, setWishlistCount] = useState(0);

  const [uploadForm, setUploadForm] = useState<CouponUploadData>({
    code: "",
    couponType: "percentage",
    description: "",
    discountValue: "",
    minPurchaseAmount: undefined,
    brandName: "",
    expiryDate: "",
  });

  const couponTypes = [
    { value: "Percentage", label: "Percentage Discount" },
    { value: "Flat", label: "Flat Discount" },
    { value: "Cashback", label: "Cashback" },
    { value: "Free Shipping", label: "Free Shipping" },
    { value: "BOGO", label: "Buy One Get One" },
  ];

  useEffect(() => {
    if (user?.id) {
      loadUserCoupons();
      loadWishlistCount();
    }
  }, [user, currentPage, pageSize, sortBy, sortDirection]);

  const loadUserCoupons = async () => {
    try {
      const paginationParams: PaginationParams = {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDirection,
      };

      const response = await CouponService.getUserUploadedCoupons(
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

  const loadWishlistCount = async () => {
    try {
      const count = await WishlistService.getWishlistCount(user!.id);
      setWishlistCount(count);
    } catch (error) {
      console.error("Error loading wishlist count:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setSortDirection("DESC");
    }
    setCurrentPage(0); // Reset to first page when sorting
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error("Please login to upload coupons");
      return;
    }

    try {
      await CouponService.uploadCoupon(uploadForm, user.id);
      toast.success("Coupon uploaded successfully!");
      setShowUploadModal(false);
      setUploadForm({
        code: "",
        couponType: "percentage",
        description: "",
        discountValue: "",
        minPurchaseAmount: undefined,
        brandName: "",
        expiryDate: "",
      });
      loadUserCoupons(); // Refresh the list
    } catch (error: any) {
      toast.error(error?.message || error);
    }
  };

  const handleWishlistChange = () => {
    loadWishlistCount();
  };

  const handleCouponUsed = () => {
    loadUserCoupons();
  };

  const handleWishlistToggle = async (couponId: number) => {
    if (!user?.id) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      const currentStatus = await WishlistService.checkWishlistStatus(
        user.id,
        couponId
      );
      if (currentStatus) {
        await WishlistService.removeFromWishlist(couponId, user.id);
        toast.success("Removed from wishlist");
      } else {
        await WishlistService.addToWishlist(couponId, user.id);
        toast.success("Added to wishlist");
      }
      loadWishlistCount();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update wishlist");
    }
  };

  const handleUseCoupon = async (couponId: number) => {
    if (!user?.id) {
      toast.error("Please login to use coupons");
      return;
    }

    try {
      const success = await CouponService.useCoupon(couponId, user.id);
      if (success) {
        toast.success("Coupon used successfully!");
        loadUserCoupons();
      } else {
        toast.error("Failed to use coupon");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to use coupon");
    }
  };

  const truncateDescription = (description: string, maxLength: number = 50) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + "...";
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
      <div className="profile-container">
        <div className="loading">Loading your profile...</div>
      </div>
    );
  }

  const userCoupons = paginationData?.content || [];

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
          📤 Upload Coupon
        </button>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <h3>Total Uploaded</h3>
          <span className="stat-number">
            {paginationData?.totalElements || userCoupons.length}
          </span>
        </div>
        <div className="stat-card">
          <h3>Active Coupons</h3>
          <span className="stat-number">
            {
              userCoupons.filter((c) => {
                const now = new Date();
                const expiryDate = new Date(c.expiryDate);
                return expiryDate > now && !c.usedUserId;
              }).length
            }
          </span>
        </div>
        <div className="stat-card">
          <h3>Used Coupons</h3>
          <span className="stat-number">
            {userCoupons.filter((c) => c.usedUserId).length}
          </span>
        </div>
        <div className="stat-card">
          <h3>Wishlist</h3>
          <Link to="/wishlist" className="wishlist-link">
            <span className="stat-number">{wishlistCount}</span>
            <span className="wishlist-text">View Wishlist</span>
          </Link>
        </div>
      </div>

      <div className="user-coupons">
        <h2>My Uploaded Coupons</h2>

        {/* Sort controls */}
        <div className="sort-controls">
          <span>Sort by:</span>
          <button
            className={`sort-btn ${sortBy === "createdAt" ? "active" : ""}`}
            onClick={() => handleSortChange("createdAt")}
          >
            Date{" "}
            {sortBy === "createdAt" && (sortDirection === "ASC" ? "↑" : "↓")}
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

        {userCoupons.length === 0 ? (
          <div className="empty-state">
            <p>You haven't uploaded any coupons yet.</p>
            <button
              className="upload-btn"
              onClick={() => setShowUploadModal(true)}
            >
              Upload Your First Coupon
            </button>
          </div>
        ) : (
          <>
            <div className="coupons-grid">
              {userCoupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onWishlistToggle={handleWishlistToggle}
                  onUseCoupon={handleUseCoupon}
                  isInWishlist={false}
                  isWishlistLoading={false}
                  hideActions={true}
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

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowUploadModal(false)}
        >
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload New Coupon</h2>
              <button
                className="close-btn"
                onClick={() => setShowUploadModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="upload-form">
              <div className="form-group">
                <label>Coupon Code *</label>
                <input
                  type="text"
                  value={uploadForm.code}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, code: e.target.value })
                  }
                  required
                  placeholder="Enter coupon code"
                />
              </div>

              <div className="form-group">
                <label>Brand Name *</label>
                <select
                  value={uploadForm.brandName}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, brandName: e.target.value })
                  }
                  required
                >
                  <option value="">Select a brand</option>
                  {brandNames.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                  <option value="other">Other</option>
                </select>
                {uploadForm.brandName === "other" && (
                  <input
                    type="text"
                    placeholder="Enter brand name"
                    onChange={(e) =>
                      setUploadForm({
                        ...uploadForm,
                        brandName: e.target.value,
                      })
                    }
                    required
                  />
                )}
              </div>

              <div className="form-group">
                <label>Coupon Type *</label>
                <select
                  value={uploadForm.couponType}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, couponType: e.target.value })
                  }
                  required
                >
                  {couponTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Discount Value *</label>
                <input
                  type="text"
                  value={uploadForm.discountValue}
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      discountValue: e.target.value,
                    })
                  }
                  required
                  placeholder="e.g., 20%, ₹500, Free Shipping"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      description: e.target.value,
                    })
                  }
                  required
                  placeholder="Describe the coupon and its terms"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Minimum Purchase Amount (Optional)</label>
                <input
                  type="number"
                  value={uploadForm.minPurchaseAmount || ""}
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      minPurchaseAmount: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                  placeholder="e.g., 1000"
                />
              </div>

              <div className="form-group">
                <label>Expiry Date *</label>
                <input
                  type="date"
                  value={uploadForm.expiryDate}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, expiryDate: e.target.value })
                  }
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Upload Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
