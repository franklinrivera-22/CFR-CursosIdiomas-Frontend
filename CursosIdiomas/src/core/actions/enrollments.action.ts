import { cursosApi } from "../api";
import type { ApiResponse, Enrollment } from "../models";

export const getMyCoursesAction = async (): Promise<Enrollment[]> => {
  const { data } = await cursosApi.get<ApiResponse<Enrollment[]>>(
    "/enrollments/my-courses"
  );
  return data.data;
};