# lycheeVoice2.0 项目管理助手

一个使用 Next.js、TypeScript 和 Tailwind CSS 创建的中文 Web 端项目管理工具前端原型。

## 功能页面

- 首页 Dashboard：展示项目概览、关键指标和重点风险。
- 会议纪要导入页：粘贴会议纪要，并使用模拟数据展示分析结果。
- 工作流看板页：展示 W01-W12 工作流的进展、负责人、截止时间、风险、下一步动作和状态。
- 周报页：根据模拟数据生成本周项目周报。

## 技术栈

- Next.js
- TypeScript
- Tailwind CSS

## 本地启动

安装依赖：

```bash
npm install
```

如果本机使用 pnpm：

```bash
pnpm install
```

启动开发服务器：

```bash
npm run dev
```

或：

```bash
pnpm dev
```

打开浏览器访问：

```text
http://localhost:3000
```

## 说明

第一版仅用于前端演示：

- 不连接真实 AI API。
- 不包含登录系统。
- 不使用复杂数据库。
- 所有分析结果和页面内容均来自模拟数据。
