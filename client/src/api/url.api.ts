import axiosInstance from "./axiosInstance";
import type { ApiResponse, ShortUrl, CreateUrlInput } from "@/types";

export async function getUrls(): Promise<ApiResponse<{ urls: ShortUrl[] }>> {
  const res = await axiosInstance.get<ApiResponse<{ urls: ShortUrl[] }>>("/urls");
  return res.data;
}

export async function createUrl(data: CreateUrlInput): Promise<ApiResponse<{ url: ShortUrl }>> {
  const res = await axiosInstance.post<ApiResponse<{ url: ShortUrl }>>("/urls", data);
  return res.data;
}

export async function deleteUrl(id: string): Promise<ApiResponse> {
  const res = await axiosInstance.delete<ApiResponse>(`/urls/${id}`);
  return res.data;
}
