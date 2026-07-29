import type { ApiResponse, Statistics } from "../models";
import { cursosApi } from "../api";


export const getStatisticsAction = async (): Promise<Statistics> => {
  const { data } = await cursosApi.get<ApiResponse<Statistics>>("/statistics");
  return data.data;
};