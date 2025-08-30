import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  google_id: string;
  picture?: string;
  bio?: string;
  created_at: string;
}

export interface Work {
  id: number;
  title: string;
  summary?: string;
  content: string;
  author_id: number;
  is_published: boolean;
  word_count: number;
  tags?: string;
  content_warnings?: string;
  created_at: string;
  updated_at?: string;
  published_at?: string;
  author: User;
}

export interface WorkCreate {
  title: string;
  summary?: string;
  content: string;
  tags?: string;
  content_warnings?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export const authAPI = {
  googleAuth: (googleToken: string) =>
    api.post<AuthResponse>('/auth/google', { token: googleToken }),
    
  getMe: () => api.get<User>('/auth/me'),
};

export const worksAPI = {
  create: (work: WorkCreate) => api.post<Work>('/works', work),
  
  getAll: (skip = 0, limit = 10) =>
    api.get<Work[]>(`/works?skip=${skip}&limit=${limit}`),
  
  getById: (id: number) => api.get<Work>(`/works/${id}`),
  
  update: (id: number, updates: Partial<WorkCreate> & { is_published?: boolean }) =>
    api.put<Work>(`/works/${id}`, updates),
  
  getUserWorks: (userId: number) => api.get<Work[]>(`/users/${userId}/works`),
};

export default api;