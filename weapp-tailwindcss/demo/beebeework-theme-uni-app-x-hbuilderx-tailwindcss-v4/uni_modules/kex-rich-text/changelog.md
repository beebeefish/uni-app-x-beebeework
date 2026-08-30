## 1.0.2（2026-08-02）
- 修复 uni-app x 微信小程序（蒸汽模式）下 `<a>` 无法触发点击 / `linktap` 的问题
- 原因：小程序系统 `rich-text` 不支持子节点 `itemclick`；现对 MP 条件编译，将 `<a>` 拆成可点击 `text` 节点
## 1.0.1（2026-07-24）
支持uniappx
## 1.0.0（2026-07-22）
- 全新发布：全平台 HTML / Markdown 富文本解释器
- Vue3 `<script setup>`；默认 XSS、主题、内置 Markdown
- 插件：Style / Search / Emoji / Highlight / Audio / Latex / TxvVideo / ImgCache / Editable
- 支持 uni-app x（`.uvue` + UTS）；演示页功能矩阵
- 功能清单：`FEATURES.md`
