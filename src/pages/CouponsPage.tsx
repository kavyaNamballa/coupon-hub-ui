import { useEffect, useState } from "react";
import {
  Coupon,
  PaginatedResponse,
  PaginationParams,
} from "../models/coupon.model";
import { useSearchParams } from "react-router-dom";
import { CouponService } from "../service/CouponService";
import { WishlistService } from "../service/WishlistService";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import "../styles/CouponsPage.css";
import Pagination from "../components/Pagination";
import CouponCard from "../components/CouponCard";

export const CouponsPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const brand = searchParams.get("brand");
  const { user } = useAuth();

  const [paginationData, setPaginationData] =
    useState<PaginatedResponse<Coupon> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");
  const [wishlistStatus, setWishlistStatus] = useState<{
    [key: number]: boolean;
  }>({});
  const [wishlistLoading, setWishlistLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const [remainingDailyUsage, setRemainingDailyUsage] = useState<number>(10);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const paginationParams: PaginationParams = {
          page: currentPage,
          size: pageSize,
          sortBy,
          sortDirection,
        };

        if (brand) {
          const response = await CouponService.getCouponsByBrand(
            brand,
            paginationParams
          );
          setPaginationData(response);
        } else {
          const response = await CouponService.searchCoupons(
            { onlyUnused: true },
            paginationParams
          );
          setPaginationData(response);
        }
      } catch (err: any) {
        toast.error(err?.message || err);
        setPaginationData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [brand, currentPage, pageSize, sortBy, sortDirection]);

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

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!user?.id || !paginationData?.content) return;

      const statuses: { [key: number]: boolean } = {};
      const loadingStates: { [key: number]: boolean } = {};

      for (const coupon of paginationData.content) {
        loadingStates[coupon.id] = true;
        try {
          const status = await WishlistService.checkWishlistStatus(
            user.id,
            coupon.id
          );
          statuses[coupon.id] = status;
        } catch (error) {
          console.error(
            `Error checking wishlist status for coupon ${coupon.id}:`,
            error
          );
          statuses[coupon.id] = false;
        } finally {
          loadingStates[coupon.id] = false;
        }
      }

      setWishlistStatus(statuses);
      setWishlistLoading(loadingStates);
    };

    checkWishlistStatus();
  }, [user?.id, paginationData?.content]);

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
    if (!user?.id) {
      toast.error("Please login to add to wishlist");
      return;
    }

    setWishlistLoading((prev) => ({ ...prev, [couponId]: true }));
    try {
      const currentStatus = wishlistStatus[couponId];
      if (currentStatus) {
        await WishlistService.removeFromWishlist(couponId, user.id);
        toast.success("Removed from wishlist");
        setWishlistStatus((prev) => ({ ...prev, [couponId]: false }));
      } else {
        await WishlistService.addToWishlist(couponId, user.id);
        toast.success("Added to wishlist");
        setWishlistStatus((prev) => ({ ...prev, [couponId]: true }));
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading((prev) => ({ ...prev, [couponId]: false }));
    }
  };

  const handleUseCoupon = async (couponId: number) => {
    if (!user?.id) {
      toast.error("Please login to use coupons");
      return;
    }
    if (remainingDailyUsage <= 0) {
      toast.error(
        "You have reached your daily limit of 10 coupons. Please try again tomorrow!"
      );
      return;
    }
    try {
      const success = await CouponService.useCoupon(couponId, user.id);
      if (success) {
        toast.success("Coupon used successfully!");
        setRemainingDailyUsage((prev) => Math.max(0, prev - 1));
        setCurrentPage(0);
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
        toast.error(error?.message || "Failed to use coupon");
      }
    }
  };

  if (loading) {
    return (
      <div className="coupons-container">
        <h2>{brand ? `${brand} Coupons` : "Coupons"}</h2>
        <div className="coupons-loading">
          <div>Loading coupons...</div>
        </div>
      </div>
    );
  }

  const coupons = paginationData?.content || [];

  return (
    <div className="coupons-container">
      <h2>{brand ? `${brand} Coupons` : "All Coupons"}</h2>

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

      <div className="coupon-list">
        {coupons.length > 0 ? (
          coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onWishlistToggle={handleWishlistToggle}
              onUseCoupon={handleUseCoupon}
              isInWishlist={wishlistStatus[coupon.id] || false}
              isWishlistLoading={wishlistLoading[coupon.id] || false}
            />
          ))
        ) : (
          <div className="coupons-loading">
            {brand ? `No coupons found for ${brand}` : "No coupons available"}
          </div>
        )}
      </div>

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
    </div>
  );
};
