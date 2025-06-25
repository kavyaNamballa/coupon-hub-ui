import api from "../api/instance.ts";
import {
  Coupon,
  PaginatedResponse,
  PaginationParams,
} from "../models/coupon.model";

const nameSpace = "/api/coupons";
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

const getCouponsByBrand = (
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

const searchCoupons = (
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

const getUserUploadedCoupons = (
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

const getUsedCouponsCount = (userId: number): Promise<number> => {
  return api
    .get(`${nameSpace}/user/${userId}/usedCount`)
    .then((res) => res.data)
    .catch((err) => {
      throw err.response?.data || "Failed to load used coupons count";
    });
};

const useCoupon = (couponId: number, userId: number): Promise<Coupon> => {
  return api
    .post(`${nameSpace}/use?couponId=${couponId}&userId=${userId}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log("Error using coupon: ", err);
      throw err.response?.data || "Failed to use coupon";
    });
};

export const CouponService = {
  getCouponsByBrand,
  findAllCoupons,
  getUsedCouponsCount,
  searchCoupons,
  uploadCoupon,
  getUserUploadedCoupons,
  useCoupon,
  async getRemainingDailyUsage(userId: number): Promise<number> {
    try {
      const response = await api.get(`${nameSpace}/daily-usage/${userId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error getting daily usage:", error);
      return 0;
    }
  },
};
