import type { ApiResponse, Page, Transaction } from "../models";
import { cursosApi } from "../api";


export const getTransactionsAction = async (
  email = "",
  page = 1
): Promise<Page<Transaction[]>> => {
  const { data } = await cursosApi.get<ApiResponse<Page<Transaction[]>>>("/transactions", {
    params: { email, page, pageSize: 20 },
  });
  return data.data;
};