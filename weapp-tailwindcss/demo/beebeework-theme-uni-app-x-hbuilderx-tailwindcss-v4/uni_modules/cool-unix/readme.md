# Cool Unix

Cool Unix 是一个高效的项目脚手架。它内置了 UI 组件库、Service 请求、TailwindCSS 插件、多语言一键翻译等多种实用功能，极大提升了开发者的开发效率与体验。

- [📖 在线文档](https://unix.cool-js.com/)

- [🎯 快速开始](https://unix.cool-js.com/src/introduce/quick.html)

- [🌟 在线预览](https://unix.cool-js.com/demo)

### 单独组件库使用

首先全局安装

```shell
npm install -g @cool-vue/unix-cli
```

然后在你的项目根目录下初始化配置

```shell
unix-init
```

执行完成后，所需的配置与依赖文件会被自动集成到你的项目中，无需手动操作。

### 多语言

配置完成后，仅需执行一条命令，AI 即可自动检索并统一翻译全文内容，无需手动维护繁琐的中英对照表，大幅提升多语言开发效率。

```html
<text>{{ t('你好') }}</text>
```

在其他位置上绑定如下：

```html
<script setup lang="ts">
	import { $t, t } from "@/.cool";
	import { useUi } from "@/uni_modules/cool-ui";

	const ui = useUi();

	ui.showToast({
		message: t("操作成功")
	});

	ui.showToast({
		message: $t("欢迎回来，{name}", { name: "神仙都没用" })
	});
</script>
```

```shell
unix-i18n create
```

### TailwindCSS

不同于其他 UI 组件库仅内置简单样式，Cool Unix 深度兼容 TailwindCSS 的写法，支持如 `dark:`、`!` 等操作符，既保留了灵活性，也便于扩展。

```html
<view class="bg-gray-100/10 dark:!bg-gray-900/10">
	<text class="text-zinc-700/10 dark:!text-white">Cool Unix</text>
</view>
```

### PassThrough

PassThrough 是一种用于访问组件内部 DOM 结构的 API，它允许开发者将任意属性和监听器直接应用于组件内部的 DOM 元素。这种设计的核心优势在于突破了组件主要 API 的限制，提供更灵活的定制能力。

```html
<cl-button
	:pt="{
    className: '!rounded-2xl',
    icon: {
      size: 50,
      className: 'mr-5',
    },
    label: {
      color: 'red',
      className: 'font-bold',
    },
    loading: {
      size: 50,
    },
  }"
>
	点击
</cl-button>
```

### ⚡ 预览

- H5 预览

![](https://unix.cool-js.com/qrcode-h5.png)

- APP 下载

![](https://unix.cool-js.com/qrcode-apk.png)

### 🤝 参与贡献

我们欢迎所有形式的贡献，无论是新功能、Bug 修复、文档改进还是其他任何改进。

### 📄 开源协议

本项目基于 `MIT协议` 开源，您可以自由使用、修改和分发。
