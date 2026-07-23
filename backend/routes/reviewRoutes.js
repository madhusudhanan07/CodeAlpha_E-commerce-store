/**
 * reviewRoutes.js — Product Reviews API Routes
 *
 * Mount point: /api/reviews (registered in app.js)
 *
 * Routes:
 *   PUT    /api/reviews/:reviewId  → Update user's own review (protected)
 *   DELETE /api/reviews/:reviewId  → Delete user's own review (protected)
 */

import { Router } from 'express';
import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js';
import { updateReview, deleteReview } from '../controllers/reviewController.js';

const router = Router();

// Review management endpoints (Owner only)
router.put('/:reviewId',    verifyFirebaseToken, updateReview);
router.delete('/:reviewId', verifyFirebaseToken, deleteReview);

export default router;
