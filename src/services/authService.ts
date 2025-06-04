// src/services/authService.ts
import type  { LoginRequest, LoginResponse, ProtectedResponse } from '../types/auth';

const API_BASE_URL = 'http://localhost:8000';

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const loginData: LoginRequest = { email, password };
    
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    return data;
  }

  async getProtectedData(token: string): Promise<ProtectedResponse> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Token inválido o expirado');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ProtectedResponse = await response.json();
    return data;
  }
}

export const authService = new AuthService();