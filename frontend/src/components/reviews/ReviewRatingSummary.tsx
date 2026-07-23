/**
 * ReviewRatingSummary.tsx — Top Rating Breakdown & Distribution Component
 *
 * Displays overall average rating score, animated star rating, total review count,
 * and 5-star to 1-star distribution breakdown bars with animated fill percentages.
 */

import React from 'react';
import { Star, MessageSquarePlus } from 'lucide-react';
import type { RatingDistribution } from '../../types';

interface ReviewRatingSummaryProps {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDistribution;
  isAuthenticated: boolean;
  onOpenWriteModal: () => void;
}

export const ReviewRatingSummary: React.FC<ReviewRatingSummaryProps> = ({
  averageRating,
  totalReviews,
  distribution,
  isAuthenticated,
  onOpenWriteModal,
}) => {
  const starsArray = [5, 4, 3, 2, 1] as const;

  return (
    <div className="reviews-summary-card">
      <div className="reviews-summary-left">
        <div className="reviews-score-big">{averageRating.toFixed(1)}</div>
        <div className="reviews-stars-row">
          {Array.from({ length: 5 }, (_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(averageRating)
                  ? 'fill-amber-400 stroke-amber-400'
                  : 'text-gray-600 fill-gray-800'
              }`}
            />
          ))}
        </div>
        <p className="reviews-total-text">Based on {totalReviews} verified ratings</p>

        {isAuthenticated ? (
          <button
            type="button"
            className="review-btn-primary"
            onClick={onOpenWriteModal}
          >
            <MessageSquarePlus className="w-4 h-4 mr-2 inline-block" />
            Write a Review
          </button>
        ) : (
          <div className="review-guest-banner">
            <span>Sign in to write a review</span>
          </div>
        )}
      </div>

      <div className="reviews-summary-right">
        <h4 className="reviews-dist-title">Rating Breakdown</h4>
        <div className="reviews-dist-list">
          {starsArray.map((starNum) => {
            const count = distribution[starNum] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

            return (
              <div key={starNum} className="reviews-dist-row">
                <div className="reviews-dist-label">
                  <span>{starNum}</span>
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 inline-block" />
                </div>
                <div className="reviews-bar-track">
                  <div
                    className="reviews-bar-fill"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="reviews-dist-count">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReviewRatingSummary;
