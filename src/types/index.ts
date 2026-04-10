// ============== 用户相关类型 ==============

export interface User {
  id: string;
  username: string;
  email?: string;
  role: string;
  api_key?: string;
  created_at: string;
}

export interface UserCreate {
  username: string;
  email?: string;
  password: string;
}

export interface UserResponse extends User {}

// ============== 项目相关类型 ==============

export interface ProjectSettings {
  fruit_type: string;
  target_audience: string;
  style: string;
  [key: string]: unknown;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: string;
  settings: ProjectSettings;
  created_at: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  fruit_type: string;
  target_audience: string;
  style: string;
}

export interface ProjectResponse extends Project {}

// ============== 角色相关类型 ==============

export interface CharacterAppearance {
  // 根据实际需求定义
  [key: string]: unknown;
}

export interface Character {
  id: string;
  project_id: string;
  name: string;
  personality: string;
  backstory: string;
  visual_config: CharacterAppearance;
  created_at: string;
}

export interface CharacterCreate {
  project_id: string;
  name: string;
  personality: string;
  backstory: string;
  appearance: CharacterAppearance;
}

export interface CharacterResponse extends Character {}

// ============== 任务相关类型 ==============

export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type TaskType = 'generate_3d' | 'generate_stickers' | 'generate_video';

export interface Task {
  id: string;
  user_id: string;
  project_id?: string;
  task_type: TaskType;
  status: TaskStatus;
  input_data: Record<string, unknown>;
  output_data?: Record<string, unknown>;
  error_message?: string;
  created_at: string;
  completed_at?: string;
}

export interface TaskCreate {
  project_id?: string;
  task_type: TaskType;
  params: Record<string, unknown>;
}

export interface TaskResponse extends Task {}

// ============== 3D 生成相关类型 ==============

export interface TextTo3DParams {
  prompt: string;
  style?: 'realistic' | 'celereal' | 'lowpoly' | 'voxel';
}

export interface ImageTo3DParams {
  image_url: string;
  prompt?: string;
}

export type Generate3DParams = TextTo3DParams | ImageTo3DParams;

// ============== 表情包生成相关类型 ==============

export interface StickerExpression {
  name: string;
  prompt: string;
}

export interface StickerParams {
  base_prompt: string;
  expressions: StickerExpression[];
}

export interface StickerResult {
  stickers: Array<{
    expression: string;
    url: string;
  }>;
}

// ============== API 响应类型 ==============

export interface ApiError {
  detail: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}
