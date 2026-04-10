/**
 * API 客户端 SDK
 * 用于前端调用后端 API
 */

import type {
  User, UserCreate, UserResponse,
  Project, ProjectCreate, ProjectResponse,
  Character, CharacterCreate, CharacterResponse,
  Task, TaskCreate, TaskResponse, TaskType
} from '../types';

const DEFAULT_BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000';

export class ApiClient {
  private baseUrl: string;
  private apiKey: string | null = null;

  constructor(baseUrl: string = DEFAULT_BASE_URL) {
    this.baseUrl = baseUrl;
    this.apiKey = localStorage.getItem('api_key');
  }

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('api_key', key);
  }

  clearApiKey() {
    this.apiKey = null;
    localStorage.removeItem('api_key');
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // ============== 用户相关 ==============

  async register(data: UserCreate): Promise<UserResponse> {
    return this.request<UserResponse>('POST', '/api/v1/users/register', data);
  }

  async getMe(): Promise<UserResponse> {
    return this.request<UserResponse>('GET', '/api/v1/users/me');
  }

  // ============== 项目相关 ==============

  async createProject(data: ProjectCreate): Promise<ProjectResponse> {
    return this.request<ProjectResponse>('POST', '/api/v1/projects', data);
  }

  async listProjects(): Promise<ProjectResponse[]> {
    return this.request<ProjectResponse[]>('GET', '/api/v1/projects');
  }

  async getProject(id: string): Promise<ProjectResponse> {
    return this.request<ProjectResponse>('GET', `/api/v1/projects/${id}`);
  }

  async updateProject(id: string, data: Partial<ProjectCreate>): Promise<ProjectResponse> {
    return this.request<ProjectResponse>('PUT', `/api/v1/projects/${id}`, data);
  }

  async deleteProject(id: string): Promise<void> {
    return this.request<void>('DELETE', `/api/v1/projects/${id}`);
  }

  // ============== 角色相关 ==============

  async createCharacter(data: CharacterCreate): Promise<CharacterResponse> {
    return this.request<CharacterResponse>('POST', '/api/v1/characters', data);
  }

  async listCharacters(projectId: string): Promise<CharacterResponse[]> {
    return this.request<CharacterResponse[]>('GET', `/api/v1/projects/${projectId}/characters`);
  }

  async getCharacter(id: string): Promise<CharacterResponse> {
    return this.request<CharacterResponse>('GET', `/api/v1/characters/${id}`);
  }

  async updateCharacter(id: string, data: Partial<CharacterCreate>): Promise<CharacterResponse> {
    return this.request<CharacterResponse>('PUT', `/api/v1/characters/${id}`, data);
  }

  async deleteCharacter(id: string): Promise<void> {
    return this.request<void>('DELETE', `/api/v1/characters/${id}`);
  }

  // ============== 任务相关 ==============

  async createTask(data: TaskCreate): Promise<TaskResponse> {
    return this.request<TaskResponse>('POST', '/api/v1/tasks', data);
  }

  async getTask(id: string): Promise<TaskResponse> {
    return this.request<TaskResponse>('GET', `/api/v1/tasks/${id}`);
  }

  async listTasks(projectId?: string): Promise<TaskResponse[]> {
    const query = projectId ? `?project_id=${projectId}` : '';
    return this.request<TaskResponse[]>('GET', `/api/v1/tasks${query}`);
  }

  /**
   * 轮询任务状态直到完成或失败
   */
  async pollTask(
    taskId: string,
    onProgress?: (task: TaskResponse) => void,
    intervalMs: number = 2000
  ): Promise<TaskResponse> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const task = await this.getTask(taskId);
          onProgress?.(task);

          if (task.status === 'completed') {
            resolve(task);
            return;
          }

          if (task.status === 'failed') {
            reject(new Error(task.error_message || 'Task failed'));
            return;
          }

          setTimeout(poll, intervalMs);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }
}

// 导出单例
export const apiClient = new ApiClient();

// 导出快捷方法
export const userAPI = {
  register: (data: UserCreate) => apiClient.register(data),
  me: () => apiClient.getMe(),
};

export const projectAPI = {
  create: (data: ProjectCreate) => apiClient.createProject(data),
  list: () => apiClient.listProjects(),
  get: (id: string) => apiClient.getProject(id),
  update: (id: string, data: Partial<ProjectCreate>) => apiClient.updateProject(id, data),
  delete: (id: string) => apiClient.deleteProject(id),
};

export const characterAPI = {
  create: (data: CharacterCreate) => apiClient.createCharacter(data),
  list: (projectId: string) => apiClient.listCharacters(projectId),
  get: (id: string) => apiClient.getCharacter(id),
  update: (id: string, data: Partial<CharacterCreate>) => apiClient.updateCharacter(id, data),
  delete: (id: string) => apiClient.deleteCharacter(id),
};

export const taskAPI = {
  create: (data: TaskCreate) => apiClient.createTask(data),
  get: (id: string) => apiClient.getTask(id),
  list: (projectId?: string) => apiClient.listTasks(projectId),
  poll: (
    taskId: string,
    onProgress?: (task: TaskResponse) => void,
    intervalMs?: number
  ) => apiClient.pollTask(taskId, onProgress, intervalMs),
};

export default apiClient;
