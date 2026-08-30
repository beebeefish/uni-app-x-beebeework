# uni-app x 用法

本目录为 **uni-app x** 源码副本，与 `components/kex-rich-text/*.uvue|*.uts` 保持同步。

## 平台说明

- **渲染**：系统 `rich-text` + UTS 净化
- **微信等小程序**：系统 `rich-text` **不支持**子节点点击（`itemclick` 无效）。本组件在 `#ifdef MP` 下会把 `<a>` 拆成可点击节点，并正常触发 `linktap`
- **API**：props / events / 实例方法与 Vue3 版同名，便于双端共用业务代码

## 接入

1. 将整个 `uni_modules/kex-rich-text` 拷入 uni-app x 工程
2. 页面直接使用：

```uvue
<template>
  <kex-rich-text
    :content="html"
    :sanitize="true"
    :scroll-table="true"
    :set-title="true"
    :use-anchor="true"
    :allow-iframe="false"
    domain="https://cdn.example.com"
    @load="onLoad"
    @ready="onReady"
    @imgtap="onImg"
    @linktap="onLink"
  />
</template>
```

3. easycom 会解析 `components/kex-rich-text/kex-rich-text.uvue`

## Props

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| content | String | `''` | HTML 或 Markdown |
| markdown | Boolean | `false` | 按 Markdown 解析 |
| sanitize | Boolean | `true` | XSS 净化 |
| scrollTable | Boolean | `true` | 表格横向滚动 |
| setTitle | Boolean | `true` | 读取 title |
| useAnchor | Boolean | `false` | 锚点 |
| allowIframe | Boolean | `false` | 是否保留 iframe |
| domain | String | | 相对路径域名 |
| copyLink | Boolean | `true` | 外链处理 |
| previewImg | Boolean | `true` | 图片预览 |
| selectable | Boolean | `false` | 长按选中 |
| containerStyle | String | | 容器样式 |
| lazyLoad | Boolean | `false` | 声明保留（系统侧能力有限） |
| tagStyleCss | String | | 附加样式 |

## Events

`load` / `ready` / `imgtap` / `linktap` / `error`（`play` 在系统 rich-text 上通常接不到，声明保留）

## API

`setContent` / `getText` / `getContent` / `pauseMedia` / `navigateTo` / `imgList`
