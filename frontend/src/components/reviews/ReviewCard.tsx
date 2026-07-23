/**
 * ReviewCard.tsx — Single Customer Review Card Component
 *
 * Renders user avatar, username, verified purchase badge, star rating,
 * title, review body, timestamp, and owner-only Edit/Delete buttons.
 */

import React from 'react';
import { Star, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import type { ProductReview } from '../../types';

interface ReviewCardProps {
  review: ProductReview;
  isOwner: boolean;
  onEdit: (review: ProductReview) => void;
  onDelete: (reviewId: number) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  isOwner,
  onEdit,
  onDelete,
}) => {
  const formattedDate = new Date(review.created_at || Date.now()).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'short', day: 'numeric' },
  );

  const avatarUrl =
    review.user_avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      review.user_name || 'Customer',
    )}&background=6c63ff&color=fff`;

  const isVerified = Boolean(review.verified_purchase);

  return (
    <div className="review-card-item">
      <div className="review-card-header">
        <div className="review-user-info">
          <img
            src={avatarUrl}
            alt={review.user_name}
            className="review-user-avatar"
            onError={(e) => {
              const target = e.currentTarget;
              target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                review.user_name || 'Customer',
              )}&background=6c63ff&color=fff`;
            }}
          />
          <div>
            <div className="review-user-name-row">
              <span className="review-user-name">{review.user_name || 'Verified Customer'}</span>
              {isVerified && (
                <span className="verified-purchase-badge">
                  <CheckCircle2 className="w-3 h-3 mr-1 inline-block" />
                  Verified Purchase
                </span>
              )}
            </div>
            <span className="review-date-text">{formattedDate}</span>
          </div>
        </div>

        {/* Action Buttons for Owner */}
        {isOwner && (
          <div className="review-owner-actions">
            <button
              type="button"
              className="review-action-btn review-action-btn--edit"
              onClick={() => onEdit(review)}
              title="Edit your review"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1" />
              Edit
            </button>
            <button
              type="button"
              className="review-action-btn review-action-btn--delete"
              onClick={() => onDelete(review.id)}
              title="Delete your review"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Stars & Title */}
      <div className="review-card-rating-row">
        <div className="review-card-stars">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating
                  ? 'fill-amber-400 stroke-amber-400'
                  : 'text-gray-600 fill-gray-800'
              }`}
            />
          ))}
        </div>
        <h4 className="review-card-title">{review.title}</h4>
      </div>

      {/* Review Content Body */}
      <p className="review-card-body">{review.review}</p>
    </div>
  );
};

export default ReviewCard;
