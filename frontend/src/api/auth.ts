/**
 * Auth API - Connects to backend /api/auth endpoints
 */
/// <reference types="vite/client" />

// Base URL for API: use /api when same-origin; if VITE_API_URL is a full origin (e.g. https://signage-six.vercel.app/), append /api so requests hit /api/auth/register not /auth/register
function getApiBase(): string {
  const raw = (import.meta.env.VITE_API_URL && String(import.meta.env.VITE_API_URL).trim()) || '';
  if (!raw) return '/api';
  if (raw.startsWith('http')) return raw.replace(/\/+$/, '') + '/api';
  return raw || '/api';
}
const API_BASE = getApiBase();

export interface User {
  id: string;
  email: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  role: string;
  avatar?: string | null;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  success: false;
  error: { code?: string; message: string };
}

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { message?: string };
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('accessToken');
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers, credentials: 'include' });
  const contentType = res.headers.get('Content-Type') || '';
  if (!contentType.includes('application/json')) {
    const text = await res.text();
    if (res.status === 404) {
      throw new Error('API not found (404). Check Vercel: Root Directory must be repo root, not frontend.');
    }
    throw new Error(
      res.ok ? 'Server returned non-JSON.' : `Server error (${res.status}). ${text.slice(0, 80)}`
    );
  }
  const json: ApiResponse<T> = await res.json();

  if (!res.ok) {
    throw new Error((json as ApiError).error?.message || 'Request failed');
  }

  return (json.data ?? json) as T;
}

export const authApi = {
  async register(email: string, password: string, username?: string, firstName?: string, lastName?: string): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username, firstName, lastName }),
    });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await request('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  },

  async refreshToken(): Promise<{ accessToken: string; refreshToken: string }> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');
    return request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },

  async me(): Promise<User> {
    return request<User>('/auth/me');
  },

  async updateProfile(data: { firstName?: string; lastName?: string; username?: string; avatar?: string | null }): Promise<User> {
    return request<User>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    return request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },

  async searchUsers(username: string): Promise<Array<{ id: string; username: string | null; firstName: string | null; lastName: string | null; avatar: string | null }>> {
    if (!username.trim()) return [];
    return request(`/auth/users/search?username=${encodeURIComponent(username.trim())}`);
  },
};
