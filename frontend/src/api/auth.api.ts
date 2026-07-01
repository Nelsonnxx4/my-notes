import { api } from "./axios";

interface User {
  id: string;
  email: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const registerApi = async (payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);

  return data;
};

export const loginApi = async (payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);

  return data;
};

export const googleAuthApi = async (idToken: string): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/google", { idToken });

  return data;
};

export const getMeApi = async (): Promise<User> => {
  const { data } = await api.get<User>("/auth/me");

  return data;
};
