// src/types/auth.ts
export interface User {
  nombre: string;
  apellido: string;
}

// Interfaz para usuarios de la base de datos
export interface DatabaseUser {
  idusuario: number;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
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

// Nueva interfaz para la respuesta de usuarios
export interface UsersResponse {
  msg: string;
  succes: boolean; // Nota: en el backend está mal escrito como "succes"
  data: DatabaseUser[];
}