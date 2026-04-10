# @ip-dev/shared

IP 开发平台共享类型定义和 API 客户端 SDK。

## 安装

```bash
npm install @ip-dev/shared
# 或
pnpm add @ip-dev/shared
```

## 类型使用

```typescript
import type { User, Project, Character, Task, TaskType } from '@ip-dev/shared';

// 使用类型
const user: User = {
  id: '123',
  username: 'test',
  role: 'user',
  created_at: new Date().toISOString(),
};
```

## API 客户端使用

```typescript
import { apiClient, userAPI, projectAPI, taskAPI } from '@ip-dev/shared';

// 设置 API Key
apiClient.setApiKey('your-api-key');

// 获取当前用户
const user = await userAPI.me();

// 创建项目
const project = await projectAPI.create({
  name: '我的IP项目',
  fruit_type: '龙眼',
  target_audience: '儿童',
  style: 'cute',
});

// 创建任务并轮询
const task = await taskAPI.create({
  task_type: 'generate_3d',
  params: { prompt: 'a cute dragon' },
});

// 轮询直到完成
const result = await taskAPI.poll(task.id, (t) => {
  console.log(`进度: ${t.status}`);
});
```

## 发布新版本

```bash
# 1. 更新版本号
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# 2. 构建
npm run build

# 3. 发布到 npm
npm publish
```

## 目录结构

```
shared/
├── src/
│   ├── types/          # 类型定义
│   │   └── index.ts
│   ├── api-client/     # API 客户端
│   │   └── index.ts
│   └── index.ts        # 统一导出
├── package.json
├── tsconfig.json
└── README.md
```
