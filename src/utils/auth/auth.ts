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

// 헤더 제거 로그인 함수
export async function login(data: { email: string; password: string }) {
  try {
    const response = await apiClient.post("/auth/login", data);
    const token = response.data.token;
    if (token) {
      localStorage.setItem("token", token);
    }
    console.log("로그인에 성공했습니다!!");
    return response.data;
  } catch (error) {
    console.error("로그인에 실패했습니다. ", error);
    throw error;
  }
}

// 카카오 로그인 콜백 함수
export async function kakaoLoginCallback(code: string) {
  try {
    const response = await apiClient.get(`/auth/kakao?code=${code}`);
    const { token, message, isNewUser } = response.data;

    if (token) {
      localStorage.setItem("token", token); // ✅ JWT 저장
    }

    return { token, message, isNewUser };
  } catch (error) {
    console.error("카카오 로그인 처리 실패:", error);
    throw error;
  }
}

// 구글 로그인 콜백 함수
export async function googleLoginCallback(code: string) {
  try {
    const response = await apiClient.get(`/auth/google?code=${code}`);
    const { token, message, isNewUser } = response.data;

    if (token) {
      localStorage.setItem("token", token); // ✅ JWT 저장
    }

    return { token, message, isNewUser };
  } catch (error) {
    console.error("구글 로그인 처리 실패:", error);
    throw error;
  }
}

// 카카오 로그인 URL 겟 함수
export function getKakaoLoginUrl(): string {
  const KAKAO_APP_KEY = process.env.NEXT_PUBLIC_KAKAO_APP_KEY!;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI!;
  return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_APP_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
}

// 구글 로그인 URL 겟 함수
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

// ✅ 회원가입
export async function signUp(data: form) {
  try {
    const response = await apiClient.post("/auth/signup", data);
    const token = response.data.token;
    if (token) {
      localStorage.setItem("token", token); // ✅ 토큰 저장
    }
    return response.data;
  } catch (error) {
    console.error("회원가입에 실패했습니다. ", error);
    throw error;
  }
}

// ✅ 소셜 회원가입 추가 정보
export async function signUpForSocial(data: formForSocial) {
  try {
    const response = await apiClient.put("/users/social", data);
    console.log("소셜 회원가입에 성공했습니다.");
    return response.data;
  } catch (error) {
    console.error("소셜 회원가입에 실패했습니다. ", error);
    throw error;
  }
}

// ✅ 개인정보 수정
export async function updateMyProfile(data: form) {
  try {
    const response = await apiClient.put("/users/edit/", data);
    console.log("개인정보 수정에 성공했습니다.");
    return response.data;
  } catch (error) {
    console.error("개인정보 수정에 실패했습니다. ", error);
    throw error;
  }
}

// ✅ 로그아웃 (서버 X, 클라이언트 토큰 삭제)
export function logout() {
  localStorage.removeItem("token");
  console.log("로그아웃 처리 완료");
}
