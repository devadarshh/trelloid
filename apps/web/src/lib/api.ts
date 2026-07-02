import axios from "axios";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export function getApiErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Cannot reach the API server. Make sure the backend is running on port 5001.";
    }
    const data = error.response.data as { message?: string; error?: string } | undefined;
    return data?.message || data?.error || `Request failed (${error.response.status})`;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
