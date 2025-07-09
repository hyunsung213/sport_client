import apiClient from "../api";

export interface form {
  userName: string;
  password: string;
  email: string;
  city: string;
  phoneNum: string;
}

export async function login(data: { email: string; password: string }) {
  try {
    const response = await apiClient.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.log("로그인에 실패했습니다. ", error);
  }
}

export async function signUp(data: form) {
  try {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.log("로그인에 실패했습니다. ", error);
  }
}

export async function logout() {
  try {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  } catch (error) {
    console.log("로그아웃에 실패했습니다. ", error);
  }
}
