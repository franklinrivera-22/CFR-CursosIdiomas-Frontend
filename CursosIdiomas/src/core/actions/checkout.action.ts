import type { ApiResponse, CheckoutForm, CheckoutResult } from "../models";
import { cursosApi } from "../api";

export const checkoutAction = async (
  form: CheckoutForm
): Promise<ApiResponse<CheckoutResult>> => {
  const { data } = await cursosApi.post<ApiResponse<CheckoutResult>>("/checkout", form);
  return data;
};