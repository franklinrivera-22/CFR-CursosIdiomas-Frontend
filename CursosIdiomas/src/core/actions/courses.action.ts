import { cursosApi } from "../api";
import type { ApiResponse, Course, Page } from "../models";

export const getCoursesAction = async (
  searchTerm = "",
  categoryId = "",
  page = 1,
  pageSizeOverride?: number
): Promise<Page<Course[]>> => {
  const pageSize = pageSizeOverride ?? (Number(import.meta.env.VITE_PAGE_SIZE) || 9);
  const { data } = await cursosApi.get<ApiResponse<Page<Course[]>>>("/courses", {
    params: { searchTerm, categoryId, page, pageSize },
  });
  return data.data;
};

export const getCourseByIdAction = async (id: string): Promise<Course> => {
  const { data } = await cursosApi.get<ApiResponse<Course>>(`/courses/${id}`);
  return data.data;
};

export const createCourseAction = async (course: Partial<Course> & { categoryId: string }) => {
  const { data } = await cursosApi.post<ApiResponse<{ id: string }>>("/courses", course);
  return data;
};

export const updateCourseAction = async (
  id: string,
  course: Partial<Course> & { categoryId: string }
) => {
  const { data } = await cursosApi.put<ApiResponse<{ id: string }>>(`/courses/${id}`, course);
  return data;
};

export const deleteCourseAction = async (id: string) => {
  const { data } = await cursosApi.delete<ApiResponse<{ id: string }>>(`/courses/${id}`);
  return data;
};