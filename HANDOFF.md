# 赛道测测 · 交接说明（换电脑必读）

本包用于在你自己的电脑上继续开发与部署。  
制作日期：2026-07-23

## 包内有什么

| 路径 | 说明 |
|------|------|
| `internet-career-explorer/` | 完整源码（不含 node_modules） |
| `docs/赛道测测-PRD.md` | 产品需求文档 |
| `docs/赛道测测-面试题准备.md` | 面试问答 |
| `docs/部署与本地运行.md` | 本地跑起来 + 部署 |
| `saidao-cece-dist.zip` | 已构建静态资源，可直接 Netlify Drop |
| `README-交接说明.md` | 本文件 |

桌面另有单独副本（方便直接打开）：

- `赛道测测-PRD.md`
- `赛道测测-面试题准备.md`
- `赛道测测-交接包.zip`（整个包的压缩版）

## 线上现状

- 生产地址：https://saidao-cece.vercel.app  
- Vercel 项目名：`saidao-cece`（原账号下；换电脑后建议用你自己的 Vercel 新建项目）

## 换电脑最小步骤

```bash
# 1. 解压交接包，进入源码
cd internet-career-explorer

# 2. 安装依赖（需要 Node 18+，建议 20/22）
npm install

# 3. 本地开发
npm run dev

# 4. 构建
npm run build
```

详细部署见 `docs/部署与本地运行.md`。

## 注意

1. **不要提交**旧机器的 `.vercel` 到公共仓库（本包已排除）；在你账号重新 `vercel link`。  
2. 用户测评进度在浏览器 `localStorage`（`saidao-quiz-v5`），不会随源码迁移。  
3. 面试请用自己的话复述 PRD/题库文档，现场演示线上或本地预览即可。
