// src/types/auth.ts
export interface User {
  nombre: string;
  apellido: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken?: string;
  msg: string;
  data?: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface ProtectedResponse {
  message: string;
}