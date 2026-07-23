/**
 * ReviewFormModal.tsx — Write or Edit Review Modal Component
 *
 * Interactive modal supporting star ratings, title, review body,
 * validation, error reporting, and submit loading state.
 */

import React, { useState, useEffect } from 'react';
import { X, Star, AlertCircle } from 'lucide-react';
import type { ProductReview } from '../../types';

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  initialReview?: ProductReview | null;
  onSubmit: (data: { rating: number; title: string; review: string }) => Promise<void>;
}

const RATING_LABELS: Record<number, string> = {
  1: 'Terrible — Poor quality',
  2: 'Poor — Disappointed',
  3: 'Average — Could be better',
  4: 'Good — Recommended',
  5: 'Excellent — Outstanding product!',
};

export const ReviewFormModal: React.FC<ReviewFormModalProps> = ({
  isOpen,
  onClose,
  productName,
  initialReview,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [title, setTitle] = useState<string>('');
  const [review, setReview] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating);
      setTitle(initialReview.title || '');
      setReview(initialReview.review || '');
    } else {
      setRating(5);
      setTitle('');
      setReview('');
    }
    setErrorMessage(null);
  }, [initialReview, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMessage('Please enter a review title.');
      return;
    }
    if (!review.trim()) {
      setErrorMessage('Please enter your review description.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);
    try {
      await onSubmit({ rating, title: title.trim(), review: review.trim() });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeStarRating = hoverRating !== null ? hoverRating : rating;

  return (
    <div className="review-modal-backdrop" onClick={onClose}>
      <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="review-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="review-modal-title">
          {initialReview ? 'Edit Your Review' : 'Write a Product Review'}
        </h3>
        <p className="review-modal-subtitle">
          Share your authentic experience with <strong>{productName}</strong>
        </p>

        {errorMessage && (
          <div className="review-modal-error">
            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="review-modal-form">
          {/* Rating Picker */}
          <div className="review-form-group">
            <label className="review-form-label">Overall Rating</label>
            <div className="review-star-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="star-picker-btn"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      star <= activeStarRating
                        ? 'fill-amber-400 stroke-amber-400'
                        : 'text-gray-600 fill-gray-900'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="review-rating-label">
              {RATING_LABELS[activeStarRating]}
            </span>
          </div>

          {/* Title Input */}
          <div className="review-form-group">
            <label htmlFor="review-title" className="review-form-label">
              Review Title *
            </label>
            <input
              id="review-title"
              type="text"
              className="review-form-input"
              placeholder="e.g., Outstanding performance & design!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
            />
          </div>

          {/* Description Textarea */}
          <div className="review-form-group">
            <label htmlFor="review-desc" className="review-form-label">
              Review Description *
            </label>
            <textarea
              id="review-desc"
              rows={4}
              className="review-form-textarea"
              placeholder="What did you like or dislike about this product? How is the quality, fit, or performance?"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
              minLength={10}
            />
          </div>

          {/* Actions */}
          <div className="review-modal-footer">
            <button
              type="button"
              className="review-btn-secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="review-btn-primary"
              disabled={submitting}
            >
              {submitting
                ? 'Submitting...'
                : initialReview
                ? 'Update Review'
                : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewFormModal;
