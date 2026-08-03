import type { ApiResponse, CheckoutResult } from "../models";
import { cursosApi } from "../api";

interface CreateOrderResult {
  orderId: string;
  amount: number;
}

export const createOrderAction = async (
  items: { courseId: string; quantity: number }[]
): Promise<ApiResponse<CreateOrderResult>> => {
  const { data } = await cursosApi.post<ApiResponse<CreateOrderResult>>(
    "/checkout/create-order",
    { items }
  );
  return data;
};

export const captureOrderAction = async (
  orderId: string
): Promise<ApiResponse<CheckoutResult>> => {
  const { data } = await cursosApi.post<ApiResponse<CheckoutResult>>(
    "/checkout/capture",
    { orderId }
  );
  return data;
};