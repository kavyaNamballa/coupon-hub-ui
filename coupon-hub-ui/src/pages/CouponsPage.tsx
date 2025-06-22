import { useEffect, useState } from "react";
import {
  Coupon,
  PaginatedResponse,
  PaginationParams,
} from "../models/coupon.model";
import { useSearchParams } from "react-router-dom";
import { CouponService } from "../service/CouponService";
import { toast } from "react-toastify";
import "../styles/CouponsPage.css";
import Pagination from "../components/Pagination";
import CouponCard from "../components/CouponCard";

export const CouponsPage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const brand = searchParams.get("brand");

  const [paginationData, setPaginationData] =
    useState<PaginatedResponse<Coupon> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"ASC" | "DESC">("DESC");

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
          const response = await CouponService.getCouponsByBrandPaginated(
            brand,
            paginationParams
          );
          setPaginationData(response);
        } else {
          const response = await CouponService.searchCouponsPaginated(
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

  const handleWishlistChange = () => {
    // Optionally refresh the list or update wishlist count
  };

  const handleCouponUsed = () => {
    // Refresh the list when a coupon is used
    setCurrentPage(0);
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
              onWishlistChange={handleWishlistChange}
              onCouponUsed={handleCouponUsed}
              showActions={true}
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
