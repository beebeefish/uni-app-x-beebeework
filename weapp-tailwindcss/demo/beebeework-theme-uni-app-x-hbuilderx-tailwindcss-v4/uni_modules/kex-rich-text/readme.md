# kex-rich-text

全新全平台富文本解释器（uni-app **Vue3** / `<script setup>`）。  
支持 HTML / Markdown 渲染、XSS 净化、主题、插件扩展、编辑模式，以及 **uni-app x**。

支持：**H5 / App（vue 页）/ 微信等小程序 / 鸿蒙 / nvue（webview）/ uni-app x**。

完整能力勾选见：[FEATURES.md](./FEATURES.md)

---

## 目录

1. [功能一览](#功能一览)
2. [安装](#安装)
3. [快速上手](#快速上手)
4. [进阶用法](#进阶用法)
5. [Props](#props)
6. [Events](#events)
7. [方法 ref](#方法-ref)
8. [插件](#插件)
9. [多端说明](#多端说明)
10. [常见问题](#常见问题)
11. [版本](#版本)

---

## 功能一览

| 能力 | 说明 |
| --- | --- |
| HTML 渲染 | 标题 / 段落 / 图 / 链 / 表 / 列表 / 音视频 / SVG 等 |
| Markdown | `markdown` 一键开启（表格、任务列表、围栏代码等） |
| XSS 净化 | `sanitize` 默认开启，过滤危险标签与脚本 |
| 主题 | `default` / `doc` / `dark`，或自定义 CSS 变量 |
| 图片 | 预览、懒加载、占位图、`original-src`、`ignore` |
| 链接 / 锚点 | 内链跳转、外链复制/打开、`use-anchor` |
| 表格 | 横向滚动、合并单元格 |
| 音视频 | 多源切换、互斥暂停、播放速率 |
| 编辑模式 | `editable` + 工具栏 + 源码/预览 + `v-model:content` |
| 插件 | Style / Search / Emoji / Highlight / Audio / Latex 等 |
| 流式追加 | `setContent(html, true)` |
| uni-app x | `.uvue` + UTS 净化层 |

---

## 安装

拷贝到业务项目：

```text
你的项目/uni_modules/kex-rich-text/
```

easycom 自动注册，页面直接写标签即可（无需手动 `import` 组件）。

要求：uni-app **Vue3**。

演示页：首页 → `kex-rich-text`，或 `/pages/demos/rich-text/index`。

---

## 快速上手

### 1. 最少代码（渲染 HTML）

```vue
<template>
  <kex-rich-text :content="html" />
</template>

<script setup>
import { ref } from 'vue'

const html = ref(`
  <h2>标题</h2>
  <p>一段 <strong>富文本</strong> 内容。</p>
  <p><img src="https://example.com/a.png" style="width:100%"/></p>
`)
</script>
```

内容为空时，可用默认插槽做加载提示：

```vue
<kex-rich-text :content="html">
  <view>加载中…</view>
</kex-rich-text>
```

### 2. Markdown

```vue
<template>
  <kex-rich-text markdown :content="md" theme="doc" />
</template>

<script setup>
import { ref } from 'vue'

const md = ref(`# 标题

- [x] 已完成
- [ ] 待办

| 列A | 列B |
| --- | --- |
| 1 | 2 |

\`\`\`js
const ok = true
\`\`\`
`)
</script>
```

### 3. 主题

```vue
<kex-rich-text :content="html" theme="default" />
<kex-rich-text :content="html" theme="doc" />
<kex-rich-text :content="html" theme="dark" />

<!-- 自定义 CSS 变量串 -->
<kex-rich-text
  :content="html"
  theme="--kex-rt-link:#0ea5e9;--kex-rt-code-bg:#f1f5f9"
/>
```

### 4. 图片预览 / 懒加载 / 占位

```vue
<kex-rich-text
  :content="html"
  :preview-img="true"
  :lazy-load="true"
  loading-img="/static/loading.png"
  error-img="/static/error.png"
  @imgtap="onImg"
/>
```

HTML 技巧：

```html
<!-- 预览用高清图 -->
<img src="thumb.jpg" original-src="hd.jpg" />

<!-- 装饰图：不预览、不弹菜单 -->
<img src="icon.png" ignore />
```

### 5. 链接与锚点

```vue
<template>
  <kex-rich-text
    :content="html"
    :use-anchor="true"
    :copy-link="true"
    domain="https://cdn.example.com"
    @linktap="onLink"
  />
</template>
```

```html
<a href="#sec">跳到章节</a>
<h2 id="sec">章节</h2>
<a href="/pages/index/index">小程序内页</a>
<a href="https://example.com">外链</a>
```

### 6. 表格横向滚动

```vue
<kex-rich-text :content="tableHtml" :scroll-table="true" />
```

### 7. 事件监听

```vue
<template>
  <kex-rich-text
    :content="html"
    @load="onLoad"
    @ready="onReady"
    @imgtap="onImg"
    @linktap="onLink"
    @play="onPlay"
    @error="onError"
  />
</template>

<script setup>
const onLoad = () => console.log('DOM 就绪')
const onReady = (rect) => console.log('图片/高度就绪', rect)
const onImg = (attrs) => console.log('点图', attrs)
const onLink = (e) => console.log('点链', e.href, e.innerText)
const onPlay = (e) => console.log('播放', e.source)
const onError = (e) => console.log('错误', e)
</script>
```

---

## 进阶用法

### 1. 编辑模式

```vue
<template>
  <kex-rich-text
    editable
    v-model:content="html"
    theme="doc"
    @edit="onEdit"
  />
</template>

<script setup>
import { ref } from 'vue'

const html = ref('<p>点工具栏插入内容，或切换「源码」编辑。</p>')
const onEdit = (e) => {
  // e.cmd / e.content
  console.log(e)
}
</script>
```

工具栏支持：粗体 / 斜体 / 下划线 / 标题 / 列表 / 引用 / 链接 / 图片 / 表格 / 分割线；可在「源码 / 预览」间切换。

### 2. ref 调用 API

```vue
<template>
  <kex-rich-text ref="rt" :content="html" :use-anchor="true" />
  <button @click="dump">导出</button>
  <button @click="append">追加一段</button>
</template>

<script setup>
import { ref } from 'vue'

const rt = ref(null)
const html = ref('<p>hello</p>')

const dump = () => {
  console.log(rt.value?.getText())
  console.log(rt.value?.getContent())
}

const append = () => {
  // 第二个参数 true：追加（流式场景）
  rt.value?.setContent('<p>more</p>', true)
}
</script>
```

### 3. 标签默认样式

```vue
<script setup>
const tagStyle = {
  p: 'margin:8px 0;line-height:1.7',
  h2: 'color:#1d4ed8;font-size:1.25em'
}
</script>

<template>
  <kex-rich-text :content="html" :tag-style="tagStyle" />
</template>
```

### 4. 插件（搜索 / 表情 / 公式等）

```vue
<template>
  <kex-rich-text :content="html" :plugins="pluginList" />
  <button @click="doSearch">搜索「富文本」</button>
</template>

<script setup>
import { ref } from 'vue'
import {
  Style,
  Search,
  Emoji,
  Highlight,
  Audio,
  Latex,
  TxvVideo,
  ImgCache
} from '@/uni_modules/kex-rich-text/components/kex-rich-text/parser/plugins/index.js'

const html = ref('<p>富文本示例 [笑] $E=mc^2$</p>')
const searchPlugin = new Search()

const pluginList = [
  Style,
  searchPlugin,
  new Emoji({ map: { 笑: 'https://example.com/smile.png' } }),
  Highlight,
  Audio,
  Latex,
  TxvVideo,
  ImgCache
]

const doSearch = async () => {
  searchPlugin.vm = {
    content: html.value,
    setContent: (c) => { html.value = c },
    // 若已挂载组件，也可把 rt.value 赋给 vm
  }
  const n = await searchPlugin.search('富文本', true)
  console.log('命中', n)
}
</script>
```

### 5. uni-app x

将本插件放入 x 工程 `uni_modules` 后：

```uvue
<kex-rich-text
  :content="html"
  :sanitize="true"
  :scroll-table="true"
  :preview-img="true"
/>
```

说明见 [`uni-app-x/readme.md`](./uni-app-x/readme.md)。

---

## Props

| 属性 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| content | String | `''` | HTML 或 Markdown |
| markdown | Boolean | `false` | 按 Markdown 解析 |
| sanitize | Boolean | `true` | XSS 净化 |
| theme | String | `default` | `default` / `doc` / `dark` / 自定义变量串 |
| container-style | String | | 容器样式 |
| domain | String | | 相对路径拼接域名 |
| copy-link | Boolean | `true` | 外链自动处理 |
| preview-img | Boolean | `true` | 点击预览图片 |
| lazy-load | Boolean | `false` | 图片懒加载 |
| loading-img | String | | 加载中占位图 |
| error-img | String | | 失败占位图 |
| pause-video | Boolean | `true` | 播放时暂停其它视频 |
| scroll-table | Boolean | `true` | 表格横向滚动 |
| selectable | Boolean / `'force'` | `false` | 长按选中；微信 iOS 可用 `force` |
| set-title | Boolean | `true` | 读取 `<title>` / h1 设导航标题 |
| show-img-menu | Boolean | `true` | 图片长按菜单 |
| tag-style | Object | | 标签默认样式 |
| use-anchor | Boolean / Number | `false` | 锚点；Number 为偏移 |
| plugins | Array | `[]` | 插件（构造函数或实例） |
| editable | Boolean | `false` | 编辑模式 |

---

## Events

| 事件 | 时机 | 回调 |
| --- | --- | --- |
| load | 节点树解析完成 | — |
| ready | 图片/高度稳定 | rect |
| error | 媒体等错误 | `{ source, attrs, errMsg }` |
| imgtap | 点击图片 | attrs |
| linktap | 点击链接 | `{ href, innerText, ... }` |
| play | 音视频播放 | `{ source, attrs }` |
| pause | 音视频暂停 | detail |
| fullscreenchange | 视频全屏变化 | detail |
| update:content | 编辑内容变化 | html 字符串 |
| edit | 编辑操作 | `{ cmd, content }` |

---

## 方法 ref

通过 `ref` 调用：

| 方法 / 属性 | 说明 |
| --- | --- |
| setContent(html, append?) | 设置内容；`append=true` 追加 |
| getText() | 纯文本 |
| getContent() | 导出 HTML（编辑场景） |
| getRect() | `Promise`，组件位置尺寸 |
| navigateTo(id) | 锚点跳转 |
| in(page, selector, scrollTop) | 锚点限定在 scroll-view |
| pauseMedia() | 暂停页面内音视频 |
| setPlaybackRate(rate) | 设置播放速率 |
| imgList | 当前预览用图片列表 |

```js
const rt = ref(null)
await rt.value?.navigateTo('sec')
rt.value?.pauseMedia()
```

---

## 插件

路径：

```text
@/uni_modules/kex-rich-text/components/kex-rich-text/parser/plugins/index.js
```

| 插件 | 作用 |
| --- | --- |
| Style | 解析 `<style>` 合并进样式 |
| Search | 关键词高亮；实例 `.search(key, anchor?)` |
| Emoji | `[笑]` → 图片（需传入 map） |
| Highlight | 代码块 language class / 自定义高亮函数 |
| Audio | 增强音频播放器 UI |
| Latex | `$...$` / `$$...$$` 轻量公式 |
| TxvVideo | 腾讯视频 iframe → 可点封面 |
| ImgCache | App/小程序远程图本地缓存 |
| Editable | 编辑辅助（序列化等，UI 由 `editable` prop 驱动） |

自定义插件钩子：`onUpdate(content)` / `onParse(node, vm)` / `onLoad()` / `onDetached()`。

---

## 多端说明

| 端 | 说明 |
| --- | --- |
| H5 / App vue / 小程序 | 递归节点渲染，能力最完整 |
| nvue | webview 降级（`static/app-plus/kex-rich-text`） |
| uni-app x | 系统 `rich-text` + UTS；小程序端自动拆分 `<a>` 以支持 `linktap`；部分插件/编辑能力有限 |
| iframe / embed | 主要在 H5 / App |

App 端图片长按保存依赖相册权限，请在 `manifest.json` 中按需配置。

---

## 常见问题

**Q：内容不显示？**  
检查 `content` 是否为空；危险标签在 `sanitize=true` 时会被去掉。可临时设 `:sanitize="false"` 对比（勿对不可信内容关闭）。

**Q：图片点不开预览？**  
确认 `preview-img` 为 true，且图片未设置 `ignore`。

**Q：锚点无效？**  
需 `:use-anchor="true"`，目标带 `id`；在 scroll-view 内需调用 `in(...)`。

**Q：Markdown 不生效？**  
需加 `markdown` 或 `:markdown="true"`。

**Q：编辑如何拿到 HTML？**  
`v-model:content` 或 `ref.getContent()`。

---

## 版本

当前：`1.0.0`（见 `package.json` / `changelog.md`）
