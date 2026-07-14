/**
 * orderService.ts — Order API Layer
 *
 * All order-related HTTP calls go through this service.
 * Uses the pre-configured axiosInstance (auth token auto-attached when signed in).
 *
 * Functions:
 *  - placeOrder(payload)      → POST /api/orders
 *  - fetchOrders()            → GET  /api/orders
 *  - fetchOrderById(id)       → GET  /api/orders/:id
 */

import axiosInstance from './axiosInstance';
import type {
  ApiResponse,
  OrderConfirmation,
  OrderListResponse,
  OrderDetailResponse,
  PlaceOrderPayload,
} from '../types';

const BASE = '/api/orders';

// ── Place a new order (checkout) ──────────────────────────────────────────────

export const placeOrder = async (
  payload: PlaceOrderPayload,
): Promise<OrderConfirmation> => {
  const { data } = await axiosInstance.post<ApiResponse<{ order: OrderConfirmation }>>(
    BASE,
    payload,
  );
  return data.data!.order;
};

// ── Fetch all orders for the logged-in user ───────────────────────────────────

export const fetchOrders = async (): Promise<OrderListResponse> => {
  const { data } = await axiosInstance.get<ApiResponse<OrderListResponse>>(BASE);
  return data.data!;
};

// ── Fetch full order details by order ID ──────────────────────────────────────

export const fetchOrderById = async (
  id: number,
): Promise<OrderDetailResponse> => {
  const { data } = await axiosInstance.get<ApiResponse<OrderDetailResponse>>(
    `${BASE}/${id}`,
  );
  return data.data!;
};
