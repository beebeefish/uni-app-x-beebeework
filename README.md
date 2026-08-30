# uni-app-x-beebeework

&gt; 比比主题官方小程序开源项目 —— 基于 uni-app X + Tailwind CSS 4 + Skyline 构建的现代化小程序前端框架。

[![uni-app X](https://img.shields.io/badge/uni--app%20X-latest-2d8cf0)](https://doc.dcloud.net.cn/uni-app-x/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8)](https://tailwindcss.com/)
[![Skyline](https://img.shields.io/badge/WeChat-Skyline-07c160)](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/introduction.html)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 写在前面

大家好，我是比比主题的开发者。

经过一段时间的筹备和技术调研，我们正式启动了比比 WordPress 主题的移动端小程序开发工作。目前，我们已经完成了第一个里程碑：**一个基于临时本地数据的前端框架版本**。虽然还没有完成与比比主题真实后台的 API 对接，但整体界面框架、交互逻辑和视觉风格已经基本成型。

我们将于 **2026 年 9 月 1 日** 将这套前端开发源码正式上传到 GitHub，完全开源。所有喜欢比比主题设计风格的开发者，都可以免费获取这套前端代码，基于它进行二次开发，打造属于自己的小程序项目。

---

## 技术选型

在正式动手之前，我们花了相当一段时间评估技术方案。最终确定的技术栈如下：

| 技术 | 说明 |
|------|------|
| **uni-app X** | 下一代 uni-app 编译器，性能和原生渲染能力显著提升，保留"一套代码，多端运行"的核心优势 |
| **Tailwind CSS 4** | 原子化 CSS 方案，快速构建响应式、高度定制化的 UI，保持样式文件的可维护性 |
| **Skyline** | 微信新一代渲染引擎，在列表滚动、页面转场动画和复杂布局性能上更接近原生 App |
| **weapp-tailwindcss** | 小程序 Tailwind CSS 适配方案，让原子化 CSS 在小程序环境中完美运行 |

---

## 当前进展

我们已经输出了一个**临时本地数据版本**的比比小程序界面。

这个版本的核心价值在于：你可以完整体验到官方小程序的整体前端样式和交互流程。所有文章列表、详情页、分类导航、个人中心等模块的 UI 已经按照比比主题的设计语言进行了还原。

&gt; ⚠️ **注意**：当前版本使用的是内置模拟数据，尚未完成与比比主题真实后台的数据对接。你看到的文章、分类、用户信息等都是占位数据。但页面结构、组件封装、状态管理和路由逻辑都是按照最终生产环境的标准来编写的。

---

## 开源范围说明

为了让大家对开源内容有清晰的预期，这里明确说明开源的边界：

| 开源内容 ✅ | 不开源内容 ❌ |
|-------------|---------------|
| 完整的前端框架代码（uni-app X 项目） | 与比比主题真实后台对接的 API 接口层 |
| 基于 Tailwind CSS 4 的样式系统和组件库 | 后端数据接口、数据库结构、业务逻辑 |
| 页面路由、状态管理、本地数据模拟方案 | 用户系统、付费验证、主题授权相关代码 |
| Skyline 适配方案和性能优化实践 | 服务端渲染（SSR）及私有部署配置 |

**简单来说：我们开源的是"前端框架和样式"，而不是"完整的后端服务"。**

比比主题的商业模式和核心服务能力建立在后端系统之上，这部分涉及用户数据、授权验证和商业逻辑，不适合公开。但我们希望前端的设计理念和工程实践能够为社区所用，让更多开发者受益。

---

## 特别致谢

我们的前端框架源码并非从零开始构建，而是基于社区优秀的开源方案进行了深度定制和扩展。在此，特别感谢以下两个项目：

- **[icebreaker](https://github.com/sonofmagic)** 的 [Tailwind CSS for uniapp](https://github.com/sonofmagic/weapp-tailwindcss) —— 为我们提供了 uni-app 环境下 Tailwind CSS 4 的完整解决方案，让我们能够快速在 uni-app X 项目中落地原子化 CSS 的开发模式。
- **Cool Unix 通用组件库** —— 作为官方赛事一等奖项目，提供了基于 Tailwind CSS 的 uvue 通用组件库，支持多语言、深色模式、鸿蒙适配等特性，为我们的组件化开发提供了坚实基础。

正是这些优秀开源项目的存在，让我们能够将更多精力投入到比比主题特有的业务逻辑和视觉风格打磨上。

---

## 如何体验

如果你对比比小程序的当前效果感兴趣，可以通过微信扫描下方二维码，直接体验官方小程序的前端界面。

&gt; ⚠️ **体验名额说明**：由于微信小程序体验版用户额度有限，申请体验通过后，权限将在每月底自动清空。如果你在下个月仍需继续体验，需要重新提交申请。每月体验额度通过满为止，建议大家尽早申请。

我们非常欢迎你在体验后，通过留言或社区反馈你的感受和建议。你的每一条意见，都会直接影响我们后续的功能迭代和视觉优化方向。

---

## 开源计划

- **2026 年 9 月 1 日**：前端开发源码正式上传 GitHub，完全开源

开源之后，你可以：

- **学习参考**：了解如何使用 uni-app X + Tailwind CSS 4 构建现代化小程序
- **样式复用**：直接复用比比主题的视觉组件，快速搭建自己的项目界面
- **二次开发**：基于我们的前端框架，对接你自己的后端 API，打造独立产品
- **贡献代码**：如果你发现了 Bug 或有优化建议，欢迎提交 PR

我们相信，开源不仅是代码的共享，更是设计思想和工程经验的传递。比比主题从 WordPress 社区成长起来，现在也希望能在小程序开发社区里，回馈一份力所能及的力量。

---

# 🚀 项目目录与使用方法

本项目实际的 uni‑app X 项目源码存放在子目录下：

```
weapp-tailwindcss/demo/beebeework-theme-uni-app-x-hbuilderx-tailwindcss-v4/
```

## 快速开始

1. **克隆项目到本地**

```
git clone https://github.com/beebeefish/uni-app-x-beebeework.git
```

2. **准备开发工具**

- 安装 HBuilderX（官方推荐的 uni‑app X 开发工具）
- 安装 微信开发者工具（用于小程序预览与真机调试）

3. **打开并运行项目**

打开 HBuilderX，点击菜单栏的 `文件` → `打开目录`，选中下面文件夹导入即可开始开发：

```
weapp-tailwindcss/demo/beebeework-theme-uni-app-x-hbuilderx-tailwindcss-v4
```

关于 Tailwind CSS v4 的安装与更多使用细节，请查阅 `weapp-tailwindcss` 目录内相关文档。

## 相关链接

- [uni‑app X 官方文档](https://doc.dcloud.net.cn/uni-app-x/)
- [Tailwind CSS 官方文档](https://tailwindcss.com/docs)
- [微信小程序 Skyline 渲染器介绍](https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/introduction.html)
- [weapp‑tailwindcss GitHub](https://github.com/sonofmagic/weapp-tailwindcss)

## 许可证

[LICENSE](https://www.kimi.com/chat/LICENSE) © BeebeeWork
