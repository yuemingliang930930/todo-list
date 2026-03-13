# Todo List

一个基于 React + TypeScript + Vite 的待办事项应用，支持多列表、标签、主题切换与本地持久化。

## 功能

- 待办事项新增、编辑、删除、完成切换
- 多列表管理（新增、编辑、删除、切换）
- 标签管理与事项标签关联
- 明暗主题切换
- localStorage 数据持久化

## 技术栈

- React 18
- TypeScript
- Vite
- Zustand
- Tailwind CSS
- Vitest

## 本地运行

```bash
npm install
npm run dev
```

默认访问：`http://localhost:5173`

## 测试与构建

```bash
npm run test -- --run
npm run build
```

## 项目结构（简要）

- `src/app`：应用入口与装配
- `src/shared`：跨功能共享能力
- `src/features`：功能域模块（todo/lists/tags/theme）
- `src/entities`：领域实体类型

## License

MIT
