/**
 * ProductReviewsSection.tsx — Main Container Component for Reviews & Ratings
 *
 * Handles data fetching, review listing, summary score & bars,
 * owner authorization checks, modal popups, and CRUD operations.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  fetchProductReviews,
  submitProductReview,
  updateReview,
  deleteReview,
} from '../../services/reviewService';
import type { ProductReviewsData, ProductReview } from '../../types';
import ReviewRatingSummary from './ReviewRatingSummary';
import ReviewCard from './ReviewCard';
import ReviewFormModal from './ReviewFormModal';
import toast from 'react-hot-toast';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductReviewsSectionProps {
  productId: number;
  productName: string;
}

export const ProductReviewsSection: React.FC<ProductReviewsSectionProps> = ({
  productId,
  productName,
}) => {
  const { currentUser, isAuthenticated } = useAuth();

  const [reviewsData, setReviewsData] = useState<ProductReviewsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingReview, setEditingReview] = useState<ProductReview | null>(null);

  const loadReviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProductReviews(productId);
      setReviewsData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleOpenWriteModal = () => {
    setEditingReview(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (review: ProductReview) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const handleDelete = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await deleteReview(reviewId);
      toast.success('Review deleted successfully.');
      loadReviews();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete review.');
    }
  };

  const handleSubmitModal = async (data: { rating: number; title: string; review: string }) => {
    if (editingReview) {
      // Update existing review
      await updateReview(editingReview.id, data);
      toast.success('Your review has been updated!');
    } else {
      // Create new review
      await submitProductReview(productId, data);
      toast.success('Thank you! Your review has been posted.');
    }
    loadReviews();
  };

  const averageRating = reviewsData?.average_rating ?? 5.0;
  const totalReviews = reviewsData?.total_reviews ?? 0;
  const distribution = reviewsData?.rating_distribution ?? { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const reviewsList = reviewsData?.reviews ?? [];

  return (
    <div className="product-reviews-section">
      <div className="reviews-section-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <MessageSquare className="w-6 h-6 text-indigo-400" />
          <h2 className="reviews-section-title">Customer Reviews & Ratings</h2>
        </div>
        <span className="reviews-section-count">({totalReviews} Reviews)</span>
      </div>

      {loading ? (
        <div className="reviews-loading-skeleton">
          <div className="skeleton-box" style={{ height: '160px', borderRadius: '16px' }} />
          <div className="skeleton-box" style={{ height: '100px', borderRadius: '12px', marginTop: '1rem' }} />
          <div className="skeleton-box" style={{ height: '100px', borderRadius: '12px', marginTop: '1rem' }} />
        </div>
      ) : error ? (
        <div className="reviews-error-box">
          <AlertCircle className="w-5 h-5 mr-2 text-rose-400 inline-block" />
          <span>{error}</span>
        </div>
      ) : (
        <>
          {/* Top Rating Summary & Distribution Bars */}
          <ReviewRatingSummary
            averageRating={averageRating}
            totalReviews={totalReviews}
            distribution={distribution}
            isAuthenticated={isAuthenticated}
            onOpenWriteModal={handleOpenWriteModal}
          />

          {/* Guest prompt banner if not logged in */}
          {!isAuthenticated && (
            <div className="guest-review-prompt">
              <span className="guest-prompt-icon">💬</span>
              <div>
                <h4>Have you purchased this product?</h4>
                <p>Please log in to leave your feedback and rating.</p>
              </div>
              <Link to="/login" className="guest-login-link">
                Login to write a review
              </Link>
            </div>
          )}

          {/* Customer Reviews List */}
          <div className="reviews-list-container">
            <h3 className="reviews-list-heading">Recent Customer Reviews</h3>

            {reviewsList.length > 0 ? (
              reviewsList.map((rev) => {
                const isOwner =
                  !!currentUser &&
                  (rev.firebase_uid === currentUser.uid ||
                    rev.user_email === currentUser.email);

                return (
                  <ReviewCard
                    key={rev.id}
                    review={rev}
                    isOwner={isOwner}
                    onEdit={handleOpenEditModal}
                    onDelete={handleDelete}
                  />
                );
              })
            ) : (
              <div className="reviews-empty-state">
                <span className="empty-icon">💬</span>
                <h4>No Customer Reviews Yet</h4>
                <p>Be the first customer to leave a review for {productName}!</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Review Modal Form (Write / Edit) */}
      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={productName}
        initialReview={editingReview}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
};

export default ProductReviewsSection;
