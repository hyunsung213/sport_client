import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // 필요한 경우, 쿠키 포함 요청
});

export default apiClient;
