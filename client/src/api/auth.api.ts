import axiosInstance from "./axiosInstance";
import type { ApiResponse, User, LoginInput, RegisterInput } from "@/types";

/** Log in a user with email and password */
export async function login(data: LoginInput): Promise<ApiResponse<{ user: User }>> {
  const res = await axiosInstance.post<ApiResponse<{ user: User }>>("/auth/login", data);
  return res.data;
}

/** Register a new user */
export async function register(data: RegisterInput): Promise<ApiResponse<{ user: User }>> {
  const res = await axiosInstance.post<ApiResponse<{ user: User }>>("/auth/register", data);
  return res.data;
}

/** Log out the current user */
export async function logout(): Promise<ApiResponse> {
  const res = await axiosInstance.post<ApiResponse>("/auth/logout");
  return res.data;
}

/** Get the currently authenticated user */
export async function getMe(): Promise<ApiResponse<{ id: string; role: string }>> {
  const res = await axiosInstance.get<ApiResponse<{ id: string; role: string }>>("/auth/me");
  return res.data;
}

/** Get full user profile */
export async function getProfile(): Promise<ApiResponse<{ user: User }>> {
  const res = await axiosInstance.get<ApiResponse<{ user: User }>>("/user/profile");
  return res.data;
}

/** Update user profile */
export async function updateProfile(data: { name?: string; email?: string }): Promise<ApiResponse<{ user: User }>> {
  const res = await axiosInstance.put<ApiResponse<{ user: User }>>("/user/profile", data);
  return res.data;
}

/** Delete user account */
export async function deleteAccount(): Promise<ApiResponse> {
  const res = await axiosInstance.delete<ApiResponse>("/user");
  return res.data;
}
