import { cursosApi } from "../api";
import type { ApiResponse, Category } from "../models";

export const getCategoriesAction = async (): Promise<Category[]> => {
  const { data } = await cursosApi.get<ApiResponse<Category[]>>("/categories");
  return data.data;
};