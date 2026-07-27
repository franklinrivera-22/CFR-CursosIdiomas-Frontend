import type { ApiResponse, LoginResponse } from "../../models";
import { cursosApi } from "../api";

export const loginAction = async (
  email: string,
  password: string
): Promise<ApiResponse<LoginResponse>> => {
  const { data } = await cursosApi.post<ApiResponse<LoginResponse>>("/auth/login", {
    email,
    password,
  });
  return data;
};

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const registerAction = async (
  form: RegisterForm
): Promise<ApiResponse<LoginResponse>> => {

  const { data } = await cursosApi.post("/auth/register", form);
  return data;
};