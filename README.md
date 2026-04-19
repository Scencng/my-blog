# 个人博客（Astro + Decap CMS）部署说明

本仓库为基于 [Astro 5](https://astro.build/)、[Yukina 主题](https://github.com/WhitePaper233/yukina) 的**静态博客**项目，输出目录为 `dist/`。按本文档操作即可在本地运行、构建并部署到常见静态托管平台。

## 一、环境要求

| 软件 | 说明 |
|------|------|
| **Node.js** | **22.x 或更高**（与上游模板要求一致） |
| **pnpm** | 本项目使用 `package.json` 中的 `packageManager` 字段固定了 pnpm 版本，建议开启 Corepack |

安装并启用 Corepack（随 Node.js 附带）：

```bash
corepack enable
```

准备 pnpm：

```bash
corepack prepare pnpm@9.15.4 --activate
```

（若已安装其他版本的 pnpm，只要在项目根目录执行 `pnpm install`，Corepack 通常会按 `packageManager` 自动选用匹配版本。）

### 可选：VS Code

仓库内带有 `.vscode/extensions.json`，使用 VS Code / Cursor 打开项目时建议安装推荐扩展（Astro、Prettier 等），便于编辑 `.astro` 与格式化。

---

## 二、获取代码与安装依赖

```bash
git clone <你的仓库地址>
cd my-blog
pnpm install
```

---

## 三、部署前必须修改的配置

### 1. 站点地址 `yukina.config.ts`

将 `site` 改为**线上访问时使用的完整站点 URL**（含 `https://`，末尾不要多余斜杠）。该地址用于 RSS、站点地图、canonical 链接等。

```ts
site: "https://你的域名",
```

### 2. 站点文案与社交信息（同上文件）

按需修改 `title`、`brandTitle`、`description`、`navigators`、`socialLinks`、`banners` 等。

### 3. Decap CMS（后台）— `public/admin/config.yml`

- **本地写作用 `local_backend: true`**：配合 `pnpm cms` 使用本地代理，不向 GitHub 直接写库。
- **线上使用 GitHub + Netlify Identity（git-gateway）**时：
  - 将 `local_backend` 删除或设为 `false`；
  - 确认 `backend.branch` 与默认分支一致；
  - 在托管平台配置好 Identity / Git Gateway（详见 [Decap 文档](https://decapcms.org/docs/intro/)）。

文章目录为 `src/contents/posts`，媒体目录为 `public/images`，与当前 `config.yml` 中的 `folder` / `media_folder` 对应，**勿随意改名**，除非同步修改 `config.yml` 与 `src/content.config.ts`。

---

## 四、本地开发

### 启动博客预览（默认 <http://localhost:4321>）

```bash
pnpm dev
```

构建产物中的 **Pagefind 搜索索引**在完整构建时生成；若本地搜索异常，可先执行一次 `pnpm build` 再 `pnpm dev`，或使用下方预览命令验证生产构建。

### （可选）启动 Decap 本地后台

需要**两个终端**：

1. 终端 A：`pnpm dev`
2. 终端 B：`pnpm cms`（实际为 `npx decap-server`）

浏览器访问：<http://localhost:4321/admin/>（或你配置的 admin 路径，以项目内 `src/pages/admin.astro` 为准）。

---

## 五、生产构建与本地预览

```bash
pnpm build
```

成功后会生成 `dist/`，并包含 **Pagefind** 搜索索引（由 `astro-pagefind` 集成在构建流程中）。

本地用静态服务器预览生产包：

```bash
pnpm preview
```

默认仍为 Astro 内置预览地址（端口以终端输出为准）。

---

## 六、部署到静态托管（通用）

任意支持**纯静态文件**的平台均可：将 **`dist/` 目录整体**作为网站根目录发布即可。

构建命令统一为：

```bash
pnpm install
pnpm build
```

发布目录：**`dist`**。

---

## 七、常见平台指引（示例）

以下为常见配置思路，具体以各平台最新文档为准。

### Vercel

- **Framework Preset**：可选 Other / Astro（若检测到）。
- **Build Command**：`pnpm build`
- **Output Directory**：`dist`
- **Install Command**：`pnpm install`

将仓库连接 Vercel 后，把生产分支设为默认分支即可自动部署。

### Netlify

- **Build command**：`pnpm build`
- **Publish directory**：`dist`

若使用 Decap + Git Gateway + Netlify Identity，请在 Netlify 控制台完成 Identity 与网关配置。

### Cloudflare Pages

- **Build command**：`pnpm build`
- **Build output directory**：`dist`
- **Environment**：Node 版本建议选择 22（若支持通过环境变量指定）。

### GitHub Actions（示例）

在仓库中配置 Workflow：检出代码 → 安装 Node → `corepack enable` → `pnpm install` → `pnpm build` → 将 `dist` 部署到 Pages 或其他存储。若使用 GitHub Pages 且站点不在根路径，可能需要在 `astro.config.mjs` 中配置 `base`（当前项目默认站点在域名根路径，一般**不需要** `base`）。

---

## 八、内容与搜索说明

- 文章为 Markdown，放在 `src/contents/posts/`；集合定义见 `src/content.config.ts`。
- **站内搜索**依赖构建时生成的 Pagefind 索引；**每次新增/大量修改文章后，务必重新执行 `pnpm build`** 再部署，否则线上搜索可能不完整。

---

## 九、故障排查（简要）

| 现象 | 建议 |
|------|------|
| RSS/站点地图 URL 错误 | 检查 `yukina.config.ts` 中 `site` 是否为最终线上地址。 |
| 搜索无结果或旧数据 | 重新完整执行 `pnpm build` 后再部署；确认 CI 未缓存过期的 `dist`。 |
| Decap 无法登录/无法保存 | 区分本地 `local_backend` 与线上 `git-gateway`；检查分支名、OAuth/Identity 配置。 |
| 依赖安装失败 | 确认 Node 版本 ≥ 22；删除 `node_modules` 与锁文件后重新 `pnpm install`（团队应统一锁文件策略）。 |

---

## 十、脚本一览

| 命令 | 作用 |
|------|------|
| `pnpm dev` | 本地开发服务器 |
| `pnpm build` | 生产构建（含 Pagefind 索引） |
| `pnpm preview` | 预览 `dist/` |
| `pnpm cms` | 启动 Decap 本地代理（需配合 `local_backend`） |

---

## 十一、开源与致谢

模板基于开源项目 **Yukina**，原仓库说明见上游 [README](https://github.com/WhitePaper233/yukina)；本仓库在配置与文档上做了适合本博客的定制。若二次发布请注明上游与相关许可证。
