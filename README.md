# Personal Blog

一个使用 Next.js、Tailwind CSS 和 Supabase 构建的现代化个人博客系统。

## 功能特性

- ✅ 用户注册和登录系统
- ✅ 创建、编辑、删除博客文章
- ✅ 富文本编辑器（Tiptap）
- ✅ 评论系统
- ✅ 音乐播放器（Spotify 集成）
- ✅ 响应式设计
- ✅ 现代化 UI 设计

## 技术栈

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS 4
- Prisma + PostgreSQL
- Supabase
- Zustand (状态管理)
- Tiptap (富文本编辑)

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并填写配置：

```bash
cp .env.local.example .env.local
```

### 3. 初始化数据库

```bash
npx prisma generate
npx prisma db push
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 详细文档

请查看项目文档以获取完整的设置和使用指南。

## 项目结构

```
├── app/              # Next.js 应用
├── components/       # React 组件
├── lib/             # 工具库
├── prisma/          # 数据库模型
└── public/          # 静态资源
```

## License

MIT
