/**
 * reviewService.ts — Product Reviews & Ratings API Service
 *
 * Encapsulates HTTP calls to /api/products/:id/reviews and /api/reviews/:reviewId
 */

import axiosInstance from './axiosInstance';
import type { ApiResponse, ProductReviewsData, ProductReview } from '../types';

/**
 * Fetch reviews and rating distribution for a product.
 */
export const fetchProductReviews = async (productId: number): Promise<ProductReviewsData> => {
  const response = await axiosInstance.get<ApiResponse<ProductReviewsData>>(
    `/api/products/${productId}/reviews`,
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to fetch reviews.');
  }
  return response.data.data;
};

/**
 * Post a new review for a product (Authenticated, Purchase Verified).
 */
export const submitProductReview = async (
  productId: number,
  payload: { rating: number; title: string; review: string },
): Promise<ProductReviewsData> => {
  const response = await axiosInstance.post<ApiResponse<ProductReviewsData>>(
    `/api/products/${productId}/reviews`,
    payload,
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to post review.');
  }
  return response.data.data;
};

/**
 * Update an existing review by ID (Owner only).
 */
export const updateReview = async (
  reviewId: number,
  payload: { rating: number; title: string; review: string },
): Promise<ProductReview> => {
  const response = await axiosInstance.put<ApiResponse<{ review: ProductReview }>>(
    `/api/reviews/${reviewId}`,
    payload,
  );
  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Failed to update review.');
  }
  return response.data.data.review;
};

/**
 * Delete a review by ID (Owner only).
 */
export const deleteReview = async (reviewId: number): Promise<void> => {
  const response = await axiosInstance.delete<ApiResponse>(`/api/reviews/${reviewId}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete review.');
  }
};
