<template>
	<!-- #ifdef APP-PLUS-NVUE -->
	<web-view
		ref="web"
		src="/uni_modules/kex-rich-text/static/app-plus/kex-rich-text/local.html"
		:style="'margin-top:-2px;height:' + nvueHeight + 'px'"
		@onPostMessage="onNvueMessage"
	/>
	<!-- #endif -->

	<!-- #ifndef APP-PLUS-NVUE -->
	<view
		id="_kex_rt"
		:class="['_kex-rt', selectable ? '_kex-rt--select' : '', themeClass, editable ? '_kex-rt--edit' : '']"
		:style="mergedContainerStyle"
	>
		<!-- 编辑工具栏 -->
		<view v-if="editable" class="_kex-toolbar">
			<view
				v-for="btn in toolbarBtns"
				:key="btn.cmd"
				class="_kex-toolbar-btn"
				@tap="onToolbar(btn.cmd)"
			>
				<text>{{ btn.label }}</text>
			</view>
		</view>
		<textarea
			v-if="editable && editMode === 'source'"
			class="_kex-edit-area"
			:value="editDraft"
			:maxlength="-1"
			auto-height
			@input="onEditInput"
		/>
		<slot v-if="!nodes.length && !(editable && editMode === 'source')" />
		<kex-rich-node
			v-else-if="!(editable && editMode === 'source')"
			name="div"
			:childs="nodes"
			:opts="nodeOpts"
		/>
		<view v-if="editable" class="_kex-edit-switch" @tap="toggleEditMode">
			<text>{{ editMode === 'source' ? '预览' : '源码' }}</text>
		</view>
	</view>
	<!-- #endif -->
</template>

<script setup>
	/**
	 * kex-rich-text — Vue3 `<script setup>` 全平台富文本解释器
	 */
	import {
		ref,
		computed,
		watch,
		provide,
		nextTick,
		onBeforeUnmount,
		getCurrentInstance
	} from 'vue'
	import KexRichNode from '../kex-rich-node/kex-rich-node.vue'
	import { parseHtml } from './parser/index.js'
	import { nodesToText, collectImgs } from './parser/utils.js'
	import { nodesToHtml, commandHtml } from './parser/plugins/editable.js'

	defineOptions({ name: 'kex-rich-text' })

	const props = defineProps({
		content: { type: String, default: '' },
		containerStyle: { type: String, default: '' },
		copyLink: { type: [Boolean, String], default: true },
		domain: { type: String, default: '' },
		errorImg: { type: String, default: '' },
		lazyLoad: { type: [Boolean, String], default: false },
		loadingImg: { type: String, default: '' },
		pauseVideo: { type: [Boolean, String], default: true },
		previewImg: { type: [Boolean, String], default: true },
		scrollTable: { type: [Boolean, String], default: true },
		selectable: { type: [Boolean, String], default: false },
		setTitle: { type: [Boolean, String], default: true },
		showImgMenu: { type: [Boolean, String], default: true },
		tagStyle: { type: Object, default: null },
		useAnchor: { type: [Boolean, Number], default: false },
		markdown: { type: [Boolean, String], default: false },
		sanitize: { type: [Boolean, String], default: true },
		theme: { type: String, default: 'default' },
		plugins: { type: Array, default: () => [] },
		/** 编辑模式 */
		editable: { type: [Boolean, String], default: false }
	})

	const emit = defineEmits([
		'load',
		'ready',
		'imgtap',
		'linktap',
		'play',
		'error',
		'pause',
		'fullscreenchange',
		'update:content',
		'edit'
	])

	const THEMES = {
		default: '',
		doc: '--kex-rt-link:#1d4ed8;--kex-rt-code-bg:#f4f4f5;--kex-rt-quote-border:#a1a1aa',
		dark:
			'--kex-rt-fg:#e4e4e7;--kex-rt-link:#93c5fd;--kex-rt-code-bg:#27272a;--kex-rt-quote-border:#52525b;--kex-rt-table-border:#3f3f46;color:var(--kex-rt-fg)'
	}

	const toolbarBtns = [
		{ cmd: 'bold', label: 'B' },
		{ cmd: 'italic', label: 'I' },
		{ cmd: 'underline', label: 'U' },
		{ cmd: 'h2', label: 'H2' },
		{ cmd: 'ul', label: 'UL' },
		{ cmd: 'ol', label: 'OL' },
		{ cmd: 'quote', label: '引' },
		{ cmd: 'link', label: '链' },
		{ cmd: 'img', label: '图' },
		{ cmd: 'table', label: '表' },
		{ cmd: 'hr', label: '—' }
	]

	const instance = getCurrentInstance()
	const nodes = ref([])
	const imgList = ref([])
	const editDraft = ref('')
	const editMode = ref('preview')
	const nvueHeight = ref(1)
	const web = ref(null)

	let _unloadimgs = 0
	let _videos = []
	let _pluginInstances = []
	let _in = null
	let playbackRate = 0
	let _streamTail = ''

	const themeClass = computed(() =>
		props.theme && props.theme !== 'default' ? '_kex-rt--' + props.theme : ''
	)
	const mergedContainerStyle = computed(() => {
		const vars = THEMES[props.theme] || (props.theme.includes('--') ? props.theme : '')
		return [vars, props.containerStyle].filter(Boolean).join(';')
	})
	const nodeOpts = computed(() => ({
		lazyLoad: props.lazyLoad,
		loadingImg: props.loadingImg,
		errorImg: props.errorImg,
		showImgMenu: props.showImgMenu,
		selectable: props.selectable
	}))

	function initPlugins() {
		const list = props.plugins || []
		_pluginInstances = []
		for (let i = 0; i < list.length; i++) {
			const P = list[i]
			try {
				_pluginInstances.push(typeof P === 'function' ? new P(api) : P)
			} catch (e) {
				if (P && typeof P === 'object') _pluginInstances.push(P)
			}
		}
	}

	function hookPlugins(name) {
		for (let i = _pluginInstances.length; i--; ) {
			if (_pluginInstances[i] && typeof _pluginInstances[i][name] === 'function') {
				try {
					_pluginInstances[i][name]()
				} catch (e) {}
			}
		}
	}

	function findTitle(list) {
		const walk = (arr) => {
			if (!arr) return ''
			for (let i = 0; i < arr.length; i++) {
				const n = arr[i]
				if (n.name === 'h1') return nodesToText(n.children || []).trim()
				if (n.children) {
					const r = walk(n.children)
					if (r) return r
				}
			}
			return ''
		}
		return walk(list)
	}

	function getRect() {
		return new Promise((resolve, reject) => {
			const q = uni.createSelectorQuery()
			// #ifndef MP-ALIPAY
			q.in(instance.proxy)
			// #endif
			q.select('#_kex_rt')
				.boundingClientRect()
				.exec((res) => (res && res[0] ? resolve(res[0]) : reject(Error('Root not found'))))
		})
	}

	function emitReady() {
		getRect()
			.then((rect) => emit('ready', rect))
			.catch(() => emit('ready', {}))
	}

	function pollReady() {
		let height = 0
		const callback = (rect) => {
			if (!rect || !rect.height) rect = {}
			if (rect.height === height) emit('ready', rect)
			else {
				height = rect.height
				setTimeout(() => {
					getRect().then(callback).catch(callback)
				}, 350)
			}
		}
		getRect().then(callback).catch(callback)
	}

	/**
	 * 流式差量：append 时若尾部未闭合块，先剥掉再拼接，减少闪烁
	 */
	function mergeStreamContent(prev, next, append) {
		if (!append) return next || ''
		return (prev || '') + (next || '')
	}

	function setContent(content, append) {
		if (!append) {
			imgList.value = []
			_videos = []
			_streamTail = ''
		}
		let raw = content || ''
		if (append) {
			raw = mergeStreamContent(_streamTail ? '' : '', raw, true)
			_streamTail = (props.content || '') + raw
		} else {
			_streamTail = raw
		}

		const parsed = parseHtml(raw, {
			domain: props.domain,
			tagStyle: props.tagStyle,
			useAnchor: props.useAnchor,
			scrollTable: !!props.scrollTable,
			previewImg: props.previewImg,
			containerStyle: props.containerStyle,
			markdown: !!props.markdown,
			sanitize: props.sanitize !== false && props.sanitize !== 'false',
			lazyLoad: props.lazyLoad,
			setTitle: props.setTitle,
			plugins: _pluginInstances || props.plugins || []
		})
		const nextNodes = parsed.nodes || []
		const nextImgs = parsed.imgList || []
		const title = parsed.title

		if (append) {
			nodes.value = (nodes.value || []).concat(nextNodes)
			const merged = (imgList.value || []).concat(nextImgs)
			if (nextImgs._unloadimgs) {
				merged._unloadimgs = (imgList.value._unloadimgs || 0) + nextImgs._unloadimgs
			}
			imgList.value = merged
		} else {
			nodes.value = nextNodes
			imgList.value = nextImgs
		}
		_unloadimgs = (imgList.value && imgList.value._unloadimgs) || 0
		editDraft.value = append ? (editDraft.value || '') + (content || '') : content || ''

		// #ifdef APP-PLUS-NVUE
		setNvueContent(nodes.value, append)
		// #endif

		if (props.setTitle) {
			const t = title || findTitle(nodes.value)
			if (t) {
				// #ifdef H5
				if (typeof document !== 'undefined') document.title = t
				// #endif
				uni.setNavigationBarTitle({ title: t })
			}
		}

		nextTick(() => {
			hookPlugins('onLoad')
			emit('load')
			if (props.lazyLoad || (imgList.value.length && _unloadimgs < imgList.value.length / 2)) {
				pollReady()
			} else if (!_unloadimgs) {
				emitReady()
			}
		})
	}

	function setNvueContent(nlist, append) {
		const opts = [
			props.containerStyle.replace(/(?:margin|padding)[^;]+/g, ''),
			props.errorImg,
			props.loadingImg,
			props.pauseVideo,
			props.scrollTable,
			props.selectable
		]
		try {
			const wv = web.value
			if (wv && typeof wv.evalJs === 'function') {
				wv.evalJs(
					'setContent(' +
						JSON.stringify(nlist).replace(/%22/g, '') +
						',' +
						JSON.stringify(opts) +
						',' +
						!!append +
						')'
				)
			}
		} catch (e) {}
	}

	function onNvueMessage(e) {
		const data = (e.detail && e.detail.data && e.detail.data[0]) || {}
		const action = data.action
		if (action === 'onLoad') {
			nvueHeight.value = data.height || 1
			emit('load')
		} else if (action === 'onReady') {
			nvueHeight.value = data.height || nvueHeight.value
			emit('ready', { height: data.height })
		} else if (action === 'onHeightChange') {
			nvueHeight.value = data.height || nvueHeight.value
		} else if (action === 'onImgTap') {
			onImg(data.attrs)
		} else if (action === 'onLinkTap') {
			onLink(data.attrs)
		} else if (action === 'onPlay') {
			emit('play', data)
		} else if (action === 'onError') {
			emit('error', data)
		}
	}

	function imgLoaded() {
		if (props.lazyLoad) return
		_unloadimgs = Math.max(0, _unloadimgs - 1)
		if (!_unloadimgs) emitReady()
	}

	function onImg(attrs) {
		emit('imgtap', attrs || {})
		if (props.previewImg && attrs && attrs.i != null) {
			uni.previewImage({
				// #ifdef MP-WEIXIN
				showmenu: !!props.showImgMenu,
				// #endif
				current: parseInt(attrs.i, 10),
				urls: imgList.value.length ? imgList.value : collectImgs(nodes.value)
			})
		}
	}

	function onLink(attrs, children) {
		const href = (attrs && attrs.href) || ''
		emit('linktap', Object.assign({ innerText: nodesToText(children || []) }, attrs || {}))
		if (!href) return
		if (href[0] === '#') {
			if (props.useAnchor) navigateTo(href.substring(1)).catch(() => {})
			return
		}
		if (href.split('?')[0].includes('://')) {
			if (!props.copyLink) return
			// #ifdef H5
			if (typeof window !== 'undefined') window.open(href)
			// #endif
			// #ifdef MP
			uni.setClipboardData({
				data: href,
				success: () => uni.showToast({ title: '链接已复制', icon: 'none' })
			})
			// #endif
			// #ifdef APP-PLUS
			plus.runtime.openURL(href)
			// #endif
			return
		}
		uni.navigateTo({
			url: href,
			fail: () => uni.switchTab({ url: href })
		})
	}

	function inScroll(page, selector, scrollTop) {
		if (page && selector && scrollTop) _in = { page, selector, scrollTop }
	}

	function navigateTo(id, offset) {
		return new Promise((resolve, reject) => {
			if (!props.useAnchor) {
				reject(Error('Anchor is disabled'))
				return
			}
			offset = offset || parseInt(props.useAnchor, 10) || 0
			let deep = ' '
			// #ifdef MP-WEIXIN || MP-QQ || MP-TOUTIAO
			deep = '>>>'
			// #endif
			const q = uni.createSelectorQuery()
			// #ifndef MP-ALIPAY
			q.in(_in ? _in.page : instance.proxy)
			// #endif
			q.select((_in ? _in.selector : '._kex-rt') + (id ? `${deep}#${id}` : '')).boundingClientRect()
			if (_in) {
				q.select(_in.selector).scrollOffset()
				q.select(_in.selector).boundingClientRect()
			} else {
				q.selectViewport().scrollOffset()
			}
			q.exec((res) => {
				if (!res || !res[0]) {
					reject(Error('Label not found'))
					return
				}
				const scrollTop = res[1].scrollTop + res[0].top - (res[2] ? res[2].top : 0) + offset
				if (_in) _in.page[_in.scrollTop] = scrollTop
				else uni.pageScrollTo({ scrollTop, duration: 300 })
				resolve()
			})
		})
	}

	function getText(n) {
		return nodesToText(n || nodes.value)
	}

	function getContent() {
		if (editMode.value === 'source') return editDraft.value
		return nodesToHtml(nodes.value)
	}

	function pauseMedia() {
		for (let i = _videos.length; i--; ) {
			try {
				_videos[i].pause()
			} catch (e) {}
		}
	}

	function setPlaybackRate(rate) {
		playbackRate = rate
		for (let i = _videos.length; i--; ) {
			try {
				_videos[i].playbackRate(rate)
			} catch (e) {}
		}
	}

	function onToolbar(cmd) {
		if (cmd === 'img') {
			uni.chooseImage({
				count: 1,
				success: (res) => {
					const src = (res.tempFilePaths && res.tempFilePaths[0]) || ''
					applyCommand('img', { src })
				}
			})
			return
		}
		if (cmd === 'link') {
			applyCommand('link', { href: 'https://', text: '链接' })
			return
		}
		applyCommand(cmd)
	}

	function applyCommand(cmd, payload) {
		const piece = commandHtml(cmd, payload)
		const next = (getContent() || '') + piece
		editDraft.value = next
		setContent(next, false)
		emit('update:content', next)
		emit('edit', { cmd, content: next })
	}

	function onEditInput(e) {
		const v = e.detail.value
		editDraft.value = v
		emit('update:content', v)
		emit('edit', { cmd: 'input', content: v })
	}

	function toggleEditMode() {
		if (editMode.value === 'source') {
			editMode.value = 'preview'
			setContent(editDraft.value, false)
		} else {
			editDraft.value = getContent()
			editMode.value = 'source'
		}
	}

	const api = {
		get content() {
			return props.content
		},
		get nodes() {
			return nodes.value
		},
		get imgList() {
			return imgList.value
		},
		get pauseVideo() {
			return props.pauseVideo
		},
		get playbackRate() {
			return playbackRate
		},
		get _videos() {
			return _videos
		},
		set _videos(v) {
			_videos = v
		},
		$nextTick: nextTick,
		$emit: (name, payload) => emit(name, payload),
		setContent,
		getText,
		getContent,
		getRect,
		navigateTo,
		in: inScroll,
		pauseMedia,
		setPlaybackRate,
		_imgLoaded: imgLoaded,
		_onImg: onImg,
		_onLink: onLink
	}

	provide('kexRichRoot', api)

	initPlugins()

	watch(
		() => props.content,
		(v) => {
			if (props.editable && editMode.value === 'source') {
				editDraft.value = v || ''
				return
			}
			setContent(v)
		},
		{ immediate: true }
	)
	watch(
		() => props.markdown,
		() => setContent(props.content)
	)
	watch(
		() => props.tagStyle,
		() => setContent(props.content),
		{ deep: true }
	)
	watch(
		() => props.plugins,
		() => {
			initPlugins()
			setContent(props.content)
		}
	)

	onBeforeUnmount(() => {
		hookPlugins('onDetached')
		_videos = []
		_pluginInstances = []
	})

	defineExpose({
		setContent,
		getText,
		getContent,
		getRect,
		navigateTo,
		in: inScroll,
		pauseMedia,
		setPlaybackRate,
		imgList,
		nodes
	})
</script>

<style>
	._kex-rt {
		padding: 1px 0;
		overflow-x: auto;
		overflow-y: hidden;
		-webkit-overflow-scrolling: touch;
		word-break: break-word;
		line-height: 1.7;
		font-size: 28rpx;
		color: #18181b;
	}
	._kex-rt--select {
		user-select: text;
		-webkit-user-select: text;
	}
	._kex-rt--dark {
		background: transparent;
	}
	._kex-toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 8rpx;
		padding: 12rpx 0 16rpx;
		margin-bottom: 12rpx;
		border-bottom: 1px solid #e4e4e7;
	}
	._kex-toolbar-btn {
		padding: 8rpx 16rpx;
		background: #f4f4f5;
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #3f3f46;
	}
	._kex-edit-area {
		width: 100%;
		min-height: 240rpx;
		padding: 16rpx;
		box-sizing: border-box;
		background: #fafafa;
		border-radius: 12rpx;
		font-size: 26rpx;
		line-height: 1.6;
	}
	._kex-edit-switch {
		margin-top: 16rpx;
		padding: 12rpx;
		text-align: center;
		color: #2563eb;
		font-size: 26rpx;
	}
</style>
