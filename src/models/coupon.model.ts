export interface Coupon {
  id: number;
  brandName: string;
  couponType: string;
  code: string;
  minPurchaseAmount?: number;
  discountValue: string;
  description: string;
  expiryDate: string;
  uploadedUserId?: number;
  usedUserId?: number;
  createdAt?: string;
  updatedAt?: string;
  isInWishlist?: boolean;
  isRevealed?: boolean;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirst: boolean;
  isLast: boolean;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface WishlistRequest {
  couponId: number;
  userId: number;
}

export interface CouponUsageRequest {
  couponId: number;
  userId: number;
}
