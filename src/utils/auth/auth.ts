import apiClient from "../api";

export interface form {
  userName: string;
  password: string;
  email: string;
  city: string;
  phoneNum: string;
}

export interface formForSocial {
  userName: string;
  city: string;
  phoneNum: string;
  isManager: boolean;
}

export async function login(data: { email: string; password: string }) {
  try {
    const response = await apiClient.post("/auth/login", data);
    console.log("로그인에 성공했습니다!!");
    return response.data;
  } catch (error) {
    console.log("로그인에 실패했습니다. ", error);
  }
}

export async function signUp(data: form) {
  try {
    const response = await apiClient.post("/auth/signup", data);
    return response.data;
  } catch (error) {
    console.log("회원가입에 실패했습니다. ", error);
  }
}

// 소셜 로그인한 후 추가 정보 입력
export async function signUpForSocial(data: formForSocial) {
  try {
    const response = await apiClient.put("/users/social", data);
    console.log("소셜 회원가입에 성공했습니다.");
    return response.data;
  } catch (error) {
    console.log("소셜 회원가입에 실패했습니다. ", error);
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

// ✅ 카카오 로그인 URL 생성
export function getKakaoLoginUrl(): string {
  const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY!;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!;
  return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_APP_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
}

// ✅ 백엔드에 code 넘겨서 로그인 처리
export async function kakaoLoginCallback(code: string) {
  try {
    const response = await apiClient.get(`/auth/kakao?code=${code}`, {
      withCredentials: true,
    });
    console.log("카카오 로그인 응답:", response.data);
    return response.data;
  } catch (error) {
    console.log("카카오 로그인 처리 실패", error);
    throw error;
  }
}

// ✅ 구글 로그인 URL 생성
export function getGoogleLoginUrl(): string {
  const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!;
  const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
  ].join(" ");

  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(
    scope
  )}`;
}

// ✅ 백엔드에 code 넘겨서 로그인 처리
export async function googleLoginCallback(code: string) {
  try {
    const response = await apiClient.get(`/auth/google?code=${code}`, {
      withCredentials: true,
    });
    console.log("구글 로그인 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("구글 로그인 처리 실패", error);
    throw error;
  }
}
