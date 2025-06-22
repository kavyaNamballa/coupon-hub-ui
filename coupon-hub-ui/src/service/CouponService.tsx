import api from "../api/instance.ts";
import {
  Coupon,
  PaginatedResponse,
  PaginationParams,
} from "../models/coupon.model";

const nameSpace = "/api/coupons";

// Interface for search criteria
export interface CouponSearchParams {
  brand?: string;
  type?: string;
  discount?: string;
  minAmount?: number;
  description?: string;
  code?: string;
  uploadedBy?: number;
  usedBy?: number;
  expiryFrom?: string;
  expiryTo?: string;
  expired?: boolean;
  used?: boolean;
  onlyActive?: boolean;
  onlyUnused?: boolean;
}

// Interface for coupon upload
export interface CouponUploadData {
  code: string;
  couponType: string;
  description: string;
  discountValue: string;
  minPurchaseAmount?: number;
  brandName: string;
  expiryDate: string;
}

const getCouponsByBrand = (brand: string): Promise<Coupon[]> => {
  return api
    .get(nameSpace + `?brand=${encodeURIComponent(brand)}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response?.data || "Failed to fetch coupons";
    });
};

const getCouponsByBrandPaginated = (
  brand: string,
  pagination: PaginationParams = {}
): Promise<PaginatedResponse<Coupon>> => {
  const {
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDirection = "DESC",
  } = pagination;

  return api
    .get(
      `${nameSpace}/brand/${encodeURIComponent(
        brand
      )}?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    )
    .then((res) => res.data)
    .catch((err) => {
      throw err.response?.data || "Failed to fetch coupons";
    });
};

const findAllCoupons = (): Promise<Coupon[]> => {
  return api
    .get(nameSpace)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response?.data || "Failed to fetch coupons";
    });
};

const searchCouponsPaginated = (
  params: CouponSearchParams,
  pagination: PaginationParams = {}
): Promise<PaginatedResponse<Coupon>> => {
  const {
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDirection = "DESC",
  } = pagination;

  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString());
    }
  });

  queryParams.append("page", page.toString());
  queryParams.append("size", size.toString());
  queryParams.append("sortBy", sortBy);
  queryParams.append("sortDirection", sortDirection);

  const queryString = queryParams.toString();
  const url = `${nameSpace}?${queryString}`;

  return api
    .get(url)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response?.data || "Failed to fetch coupons";
    });
};

const uploadCoupon = (
  couponData: CouponUploadData,
  userId: number
): Promise<Coupon> => {
  return api
    .post(`${nameSpace}/upload?userId=${userId}`, couponData)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response?.data || "Failed to upload coupon";
    });
};

const getUserUploadedCouponsPaginated = (
  userId: number,
  pagination: PaginationParams = {}
): Promise<PaginatedResponse<Coupon>> => {
  const {
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDirection = "DESC",
  } = pagination;

  return api
    .get(
      `${nameSpace}/user/${userId}/uploaded?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log("kavya error, ", err);
      throw err.response?.data || "Failed to load your coupons";
    });
};

const getActiveCouponsPaginated = (
  pagination: PaginationParams = {}
): Promise<PaginatedResponse<Coupon>> => {
  const {
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDirection = "DESC",
  } = pagination;

  return api
    .get(
      `${nameSpace}/active?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log("kavya error, ", err);
      throw err.response?.data || "Failed to fetch active coupons";
    });
};

const getExpiredCouponsPaginated = (
  pagination: PaginationParams = {}
): Promise<PaginatedResponse<Coupon>> => {
  const {
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDirection = "DESC",
  } = pagination;

  return api
    .get(
      `${nameSpace}/expired?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log("kavya error, ", err);
      throw err.response?.data || "Failed to fetch expired coupons";
    });
};

const getUsedCouponsPaginated = (
  pagination: PaginationParams = {}
): Promise<PaginatedResponse<Coupon>> => {
  const {
    page = 0,
    size = 10,
    sortBy = "createdAt",
    sortDirection = "DESC",
  } = pagination;

  return api
    .get(
      `${nameSpace}/used/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log("kavya error, ", err);
      throw err.response?.data || "Failed to fetch used coupons";
    });
};

const useCoupon = (couponId: number, userId: number): Promise<boolean> => {
  return api
    .post(`${nameSpace}/use?couponId=${couponId}&userId=${userId}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log("Error using coupon: ", err);
      throw err.response?.data || "Failed to use coupon";
    });
};

const revealCouponCode = (
  couponId: number,
  userId: number
): Promise<string> => {
  return api
    .get(`${nameSpace}/reveal/${couponId}?userId=${userId}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log("Error revealing coupon code: ", err);
      throw err.response?.data || "Failed to reveal coupon code";
    });
};

export const CouponService = {
  getCouponsByBrand,
  getCouponsByBrandPaginated,
  findAllCoupons,
  searchCouponsPaginated,
  uploadCoupon,
  getUserUploadedCouponsPaginated,
  getActiveCouponsPaginated,
  getExpiredCouponsPaginated,
  getUsedCouponsPaginated,
  useCoupon,
  revealCouponCode,
};
