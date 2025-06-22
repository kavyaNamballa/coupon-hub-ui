import api from "../api/instance.ts";
import {
  Coupon,
  PaginatedResponse,
  PaginationParams,
  WishlistRequest,
} from "../models/coupon.model";

const nameSpace = "/api/wishlist";

const addToWishlist = (couponId: number, userId: number): Promise<boolean> => {
  const request: WishlistRequest = { couponId, userId };

  return api
    .post(`${nameSpace}/add`, request)
    .then((res) => res.data)
    .catch((err) => {
      console.log("Error adding to wishlist: ", err);
      throw err.response?.data || "Failed to add to wishlist";
    });
};

const removeFromWishlist = (
  couponId: number,
  userId: number
): Promise<boolean> => {
  const request: WishlistRequest = { couponId, userId };

  return api
    .post(`${nameSpace}/remove`, request)
    .then((res) => res.data)
    .catch((err) => {
      console.log("Error removing from wishlist: ", err);
      throw err.response?.data || "Failed to remove from wishlist";
    });
};

const getUserWishlist = (userId: number): Promise<Coupon[]> => {
  return api
    .get(`${nameSpace}/user/${userId}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log("Error fetching wishlist: ", err);
      throw err.response?.data || "Failed to fetch wishlist";
    });
};

const getUserWishlistPaginated = (
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
      `${nameSpace}/user/${userId}/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    )
    .then((res) => res.data)
    .catch((err) => {
      console.log("Error fetching paginated wishlist: ", err);
      throw err.response?.data || "Failed to fetch wishlist";
    });
};

const checkWishlistStatus = (
  userId: number,
  couponId: number
): Promise<boolean> => {
  return api
    .get(`${nameSpace}/user/${userId}/check/${couponId}`)
    .then((res) => res.data)
    .catch((err) => {
      console.log("Error checking wishlist status: ", err);
      return false;
    });
};

const getWishlistCount = (userId: number): Promise<number> => {
  return api
    .get(`${nameSpace}/user/${userId}/count`)
    .then((res) => res.data)
    .catch((err) => {
      console.log("Error getting wishlist count: ", err);
      return 0;
    });
};

export const WishlistService = {
  addToWishlist,
  removeFromWishlist,
  getUserWishlist,
  getUserWishlistPaginated,
  checkWishlistStatus,
  getWishlistCount,
};
