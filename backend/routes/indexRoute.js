/**
 * indexRoute.js — Root API Health Check Route
 * GET /
 * Returns a JSON payload confirming the server and API are operational.
 */

import { Router } from 'express';
import { getServerStatus } from '../controllers/indexController.js';

const router = Router();

router.get('/', getServerStatus);

export default router;
