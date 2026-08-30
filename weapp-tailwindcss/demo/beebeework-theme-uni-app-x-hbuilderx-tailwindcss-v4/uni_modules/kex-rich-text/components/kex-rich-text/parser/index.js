/**
 * kex-rich-text HTML 解析器
 * 词法 + 语法一次扫描，输出可递归渲染的节点树
 */
import {
	TRUST_TAGS,
	BLOCK_TAGS,
	IGNORE_TAGS,
	VOID_TAGS,
	INLINE_TAGS,
	DEFAULT_TAG_STYLE,
	BLANK_CHAR,
	SVG_DICT
} from './config.js'
import { decodeEntity, isDangerAttr, isDangerUrl, joinUrl } from './utils.js'
import { markdownToHtml } from './markdown.js'
import { createPluginHost } from './plugins.js'

let idIndex = 0

function getWindowWidth() {
	try {
		// #ifdef MP-WEIXIN
		if (typeof uni !== 'undefined' && uni.canIUse && uni.canIUse('getWindowInfo')) {
			return uni.getWindowInfo().windowWidth
		}
		// #endif
		if (typeof uni !== 'undefined' && uni.getSystemInfoSync) {
			return uni.getSystemInfoSync().windowWidth || 375
		}
	} catch (e) {}
	return 375
}

function getSystem() {
	try {
		// #ifdef MP-WEIXIN
		if (typeof uni !== 'undefined' && uni.canIUse && uni.canIUse('getWindowInfo')) {
			return (uni.getDeviceInfo && uni.getDeviceInfo().system) || ''
		}
		// #endif
		if (typeof uni !== 'undefined' && uni.getSystemInfoSync) {
			return uni.getSystemInfoSync().system || ''
		}
	} catch (e) {}
	return ''
}

/**
 * @param {object} options 组件侧配置
 */
export function parseHtml(content, options = {}) {
	const opts = Object.assign(
		{
			domain: '',
			tagStyle: null,
			useAnchor: false,
			scrollTable: false,
			previewImg: true,
			containerStyle: '',
			markdown: false,
			sanitize: true,
			lazyLoad: false,
			selectable: false,
			plugins: []
		},
		options
	)

	const pluginHost = createPluginHost(opts.plugins)
	let html = content || ''
	html = pluginHost.onUpdate(html, opts)
	if (opts.markdown) {
		html = markdownToHtml(html)
	}

	const vm = {
		options: opts,
		tagStyle: Object.assign({}, DEFAULT_TAG_STYLE, opts.tagStyle || {}),
		imgList: [],
		attrs: Object.create(null),
		stack: [],
		nodes: [],
		pre: (opts.containerStyle || '').includes('white-space') && (opts.containerStyle || '').includes('pre') ? 2 : 0,
		xml: 0,
		tagName: '',
		attrName: '',
		title: '',
		pluginHost
	}
	vm.imgList._unloadimgs = 0

	new Lexer(vm).parse(html)
	while (vm.stack.length) popNode(vm)

	if (vm.nodes.length > 50) mergeNodes(vm.nodes)
	pluginHost.onLoad(vm)
	return { nodes: vm.nodes, imgList: vm.imgList, title: vm.title }
}

function mergeNodes(nodes) {
	let i = nodes.length - 1
	for (let j = i; j >= -1; j--) {
		if (
			j === -1 ||
			nodes[j].c ||
			!nodes[j].name ||
			(nodes[j].name !== 'div' && nodes[j].name !== 'p' && nodes[j].name[0] !== 'h') ||
			((nodes[j].attrs && nodes[j].attrs.style) || '').includes('inline')
		) {
			if (i - j >= 5) {
				nodes.splice(j + 1, i - j, {
					name: 'div',
					attrs: {},
					children: nodes.slice(j + 1, i + 1)
				})
			}
			i = j - 1
		}
	}
}

function expose(vm) {
	for (let i = vm.stack.length; i--;) {
		const item = vm.stack[i]
		if (item.c || item.name === 'a' || item.name === 'video' || item.name === 'audio') return
		item.c = 1
	}
}

function parseStyle(vm, node) {
	const attrs = node.attrs
	const list = ((vm.tagStyle[node.name] || '') + ';' + (attrs.style || '')).split(';')
	const styleObj = {}
	let tmp = ''

	if (attrs.id && !vm.xml) {
		if (vm.options.useAnchor) expose(vm)
		else if (node.name !== 'img' && node.name !== 'a' && node.name !== 'video' && node.name !== 'audio') {
			attrs.id = undefined
		}
	}

	if (attrs.width) {
		styleObj.width = parseFloat(attrs.width) + (String(attrs.width).includes('%') ? '%' : 'px')
		attrs.width = undefined
	}
	if (attrs.height) {
		styleObj.height = parseFloat(attrs.height) + (String(attrs.height).includes('%') ? '%' : 'px')
		attrs.height = undefined
	}

	const windowWidth = getWindowWidth()
	for (let i = 0; i < list.length; i++) {
		const info = list[i].split(':')
		if (info.length < 2) continue
		const key = info.shift().trim().toLowerCase()
		let value = info.join(':').trim()
		if (!key || !value) continue
		if ((value[0] === '-' && value.lastIndexOf('-') > 0) || value.includes('safe')) {
			tmp += `;${key}:${value}`
			continue
		}
		if (value.includes('url')) {
			let j = value.indexOf('(') + 1
			if (j) {
				while (value[j] === '"' || value[j] === "'" || BLANK_CHAR[value[j]]) j++
				value = value.substr(0, j) + joinUrl(value.substr(j), vm.options.domain)
			}
		} else if (value.includes('rpx')) {
			value = value.replace(/[0-9.]+\s*rpx/g, ($) => (parseFloat($) * windowWidth) / 750 + 'px')
		}
		if (!styleObj[key] || value.includes('import') || !(styleObj[key] || '').includes('import')) {
			styleObj[key] = value
		}
	}
	node.attrs.style = tmp
	return styleObj
}

function onTagName(vm, name) {
	vm.tagName = vm.xml ? name : name.toLowerCase()
	if (vm.tagName === 'svg') {
		vm.xml = (vm.xml || 0) + 1
		// svg 内允许 style
		if (vm.xml === 1) {
			vm._styleIgnored = !!IGNORE_TAGS.style
			IGNORE_TAGS.style = undefined
		}
	}
}

function onAttrName(vm, name) {
	name = vm.xml ? name : name.toLowerCase()
	if (vm.options.sanitize && isDangerAttr(name)) {
		vm.attrName = undefined
		return
	}
	if (name.substr(0, 5) === 'data-') {
		if (name === 'data-src' && !vm.attrs.src) vm.attrName = 'src'
		else if (vm.tagName === 'img' || vm.tagName === 'a') vm.attrName = name
		else vm.attrName = undefined
	} else {
		vm.attrName = name
		vm.attrs[name] = 'T'
	}
}

function onAttrVal(vm, val) {
	const name = vm.attrName || ''
	if (!name) return
	if (name === 'style') {
		vm.attrs[name] = decodeEntity(val, true)
	} else if (name === 'href') {
		vm.attrs[name] = joinUrl(decodeEntity(val, true), vm.options.domain)
	} else if (name.includes('src')) {
		const url = joinUrl(decodeEntity(val, true), vm.options.domain)
		vm.attrs[name] = url
	} else {
		vm.attrs[name] = val
	}
}

function onOpenTag(vm, selfClose) {
	const node = Object.create(null)
	node.name = vm.tagName
	node.attrs = vm.attrs
	node.type = 'node'
	vm.attrs = Object.create(null)

	const attrs = node.attrs
	const parent = vm.stack[vm.stack.length - 1]
	const siblings = parent ? parent.children : vm.nodes
	const close = vm.xml ? selfClose : VOID_TAGS[node.name]

	// 净化危险链接
	if (vm.options.sanitize) {
		if (attrs.href && isDangerUrl(attrs.href)) attrs.href = ''
		if (attrs.src && isDangerUrl(attrs.src)) attrs.src = ''
	}

	// embed：小程序端按后缀转 video/audio；H5/APP 保留并暴露
	if (node.name === 'embed') {
		// #ifndef H5 || APP-PLUS
		const src = attrs.src || ''
		if (src.includes('.mp4') || src.includes('.3gp') || src.includes('.m3u8') || (attrs.type || '').includes('video')) {
			node.name = 'video'
		} else if (
			src.includes('.mp3') ||
			src.includes('.wav') ||
			src.includes('.aac') ||
			src.includes('.m4a') ||
			(attrs.type || '').includes('audio')
		) {
			node.name = 'audio'
		} else {
			return
		}
		if (attrs.autostart) attrs.autoplay = 'T'
		attrs.controls = 'T'
		// #endif
		// #ifdef H5 || APP-PLUS
		expose(vm)
		// #endif
	}

	if (node.name === 'video' || node.name === 'audio') {
		if (node.name === 'video' && !attrs.id) attrs.id = 'kv' + idIndex++
		if (!attrs.controls && !attrs.autoplay) attrs.controls = 'T'
		node.src = []
		if (attrs.src) {
			node.src.push(attrs.src)
			attrs.src = undefined
		}
		expose(vm)
	}

	if (close) {
		if (IGNORE_TAGS[node.name] && !vm.xml) {
			// base：设置主域名
			if (node.name === 'base' && !vm.options.domain) {
				vm.options.domain = attrs.href || ''
			} else if (node.name === 'source' && parent && (parent.name === 'video' || parent.name === 'audio') && attrs.src) {
				parent.src.push(attrs.src)
			}
			return
		}
		// xml（svg）内未信任标签也保留
		if (!vm.xml && !TRUST_TAGS[node.name] && !BLOCK_TAGS[node.name]) return

		const styleObj = parseStyle(vm, node)
		if (node.name === 'img') handleImg(vm, node, styleObj, parent)
		else applyStyle(node, styleObj)

		if (vm.pluginHost && vm.pluginHost.onParse(node, vm) === false) return
		siblings.push(node)
		return
	}

	node.children = []
	if (node.name === 'pre' || ((attrs.style || '').includes('white-space') && (attrs.style || '').includes('pre'))) {
		vm.pre = (vm.pre || 0) + 1
	}
	vm.stack.push(node)
}

/**
 * 图片节点处理：宽高标记、object-fit、重复域名、懒加载、flex 父级等
 */
function handleImg(vm, node, styleObj, parent) {
	const attrs = node.attrs
	const windowWidth = getWindowWidth()

	if (attrs.src) {
		if (attrs.src.includes('webp')) node.webp = 'T'
		if (attrs.src.includes('data:') && vm.options.previewImg !== 'all' && !attrs['original-src']) {
			attrs.ignore = 'T'
		}
		if (!attrs.ignore || node.webp || attrs.src.includes('cloud://')) {
			for (let i = vm.stack.length; i--;) {
				const item = vm.stack[i]
				if (item.name === 'a') node.a = item.attrs
				if (item.name === 'table' && !node.webp && !attrs.src.includes('cloud://')) {
					node.t = (styleObj.display || '').includes('inline') ? 'inline-block' : styleObj.display || 'block'
					styleObj.display = undefined
				}
				// #ifndef H5 || APP-PLUS
				const pStyle = item.attrs.style || ''
				if (
					pStyle.includes('flex:') &&
					!pStyle.includes('flex:0') &&
					!pStyle.includes('flex: 0') &&
					(!styleObj.width || parseInt(styleObj.width) > 100)
				) {
					styleObj.width = '100% !important'
					styleObj.height = ''
					for (let j = i + 1; j < vm.stack.length; j++) {
						vm.stack[j].attrs.style = (vm.stack[j].attrs.style || '').replace('inline-', '')
					}
				} else if (pStyle.includes('flex') && styleObj.width === '100%') {
					for (let j = i + 1; j < vm.stack.length; j++) {
						const s = vm.stack[j].attrs.style || ''
						if (!s.includes(';width') && !s.includes(' width') && s.indexOf('width') !== 0) {
							styleObj.width = ''
							break
						}
					}
				} else if (pStyle.includes('inline-block')) {
					if (styleObj.width && styleObj.width[styleObj.width.length - 1] === '%') {
						item.attrs.style += ';max-width:' + styleObj.width
						styleObj.width = ''
					} else {
						item.attrs.style += ';max-width:100%'
					}
				}
				// #endif
				item.c = 1
			}
			attrs.i = String(vm.imgList.length)
			let src = attrs['original-src'] || attrs.src
			// #ifndef H5 || MP-ALIPAY || APP-PLUS || MP-360
			if (vm.imgList.includes(src)) {
				// 重复 src：对域名随机大小写，避免预览错位
				let i = src.indexOf('://')
				if (i !== -1) {
					i += 3
					let newSrc = src.substr(0, i)
					for (; i < src.length; i++) {
						if (src[i] === '/') break
						newSrc += Math.random() > 0.5 ? src[i].toUpperCase() : src[i]
					}
					newSrc += src.substr(i)
					src = newSrc
				}
			}
			// #endif
			vm.imgList.push(src)
			if (!node.t) vm.imgList._unloadimgs += 1
			// #ifdef H5 || APP-PLUS
			if (vm.options.lazyLoad) {
				attrs['data-src'] = attrs.src
				attrs.src = undefined
			}
			// #endif
		}
	}
	if (styleObj.display === 'inline') styleObj.display = undefined
	if (attrs.ignore) {
		styleObj['max-width'] = styleObj['max-width'] || '100%'
		attrs.style = (attrs.style || '') + ';-webkit-touch-callout:none'
	}
	// 宽超屏时清空 height，避免变形
	if (parseInt(styleObj.width) > windowWidth) {
		styleObj.height = undefined
	}
	if (!isNaN(parseInt(styleObj.width))) node.w = 'T'
	if (
		!isNaN(parseInt(styleObj.height)) &&
		(!(styleObj.height || '').includes('%') || (parent && (parent.attrs.style || '').includes('height')))
	) {
		node.h = 'T'
	}
	if (node.w && node.h && styleObj['object-fit']) {
		if (styleObj['object-fit'] === 'contain') node.m = 'aspectFit'
		else if (styleObj['object-fit'] === 'cover') node.m = 'aspectFill'
	}
	applyStyle(node, styleObj)
	expose(vm)
}

function applyStyle(node, styleObj) {
	let style = node.attrs.style || ''
	for (const key in styleObj) {
		if (styleObj[key]) {
			style += `;${key}:${String(styleObj[key]).replace(' !important', '')}`
		}
	}
	node.attrs.style = style.replace(/^;/, '') || undefined
}

/**
 * 将 svg 子树序列化为 data URL 图片
 */
function serializeSvg(node) {
	let src = ''
	const style = node.attrs.style
	node.attrs.style = ''
	node.attrs.xmlns = 'http://www.w3.org/2000/svg'
	;(function traversal(n) {
		if (n.type === 'text') {
			src += n.text || ''
			return
		}
		const name = SVG_DICT[n.name] || n.name
		if (name === 'foreignObject') {
			for (const child of n.children || []) {
				if (child.attrs && !child.attrs.xmlns) {
					child.attrs.xmlns = 'http://www.w3.org/1999/xhtml'
					break
				}
			}
		}
		src += '<' + name
		for (const item in n.attrs) {
			const val = n.attrs[item]
			if (val) {
				src += ` ${SVG_DICT[item] || item}="${String(val).replace(/"/g, '')}"`
			}
		}
		if (!n.children) {
			src += '/>'
		} else {
			src += '>'
			for (let i = 0; i < n.children.length; i++) traversal(n.children[i])
			src += '</' + name + '>'
		}
	})(node)
	node.name = 'img'
	node.attrs = {
		src: 'data:image/svg+xml;utf8,' + src.replace(/#/g, '%23'),
		style,
		ignore: 'T'
	}
	node.children = undefined
}

function onCloseTag(vm, name) {
	name = vm.xml ? name : name.toLowerCase()
	let i
	for (i = vm.stack.length; i--;) {
		if (vm.stack[i].name === name) break
	}
	if (i === -1) return
	while (vm.stack.length > i) popNode(vm)
}

function popNode(vm) {
	const node = vm.stack.pop()
	const attrs = node.attrs
	const children = node.children
	const siblings = vm.stack.length ? vm.stack[vm.stack.length - 1].children : vm.nodes
	const parent = vm.stack[vm.stack.length - 1]

	// svg：闭合时序列化为图片
	if (node.name === 'svg') {
		if (vm.xml > 1) {
			vm.xml--
			siblings.push(node)
			return
		}
		serializeSvg(node)
		vm.xml = 0
		if (vm._styleIgnored) IGNORE_TAGS.style = true
		else IGNORE_TAGS.style = undefined
		if (vm.pluginHost && vm.pluginHost.onParse(node, vm) === false) return
		siblings.push(node)
		return
	}

	// ignore：title 抽出纯文本
	if (IGNORE_TAGS[node.name] && !vm.xml) {
		if (node.name === 'title' && children && children.length) {
			let text = ''
			for (let i = 0; i < children.length; i++) {
				if (children[i].type === 'text') text += children[i].text || ''
			}
			vm.title = text
		}
		return
	}

	// strike → s
	if (node.name === 'strike') node.name = 's'

	// #ifndef H5 || APP-PLUS
	// 小程序端丢弃 iframe（无法原生嵌入）
	if (node.name === 'iframe') return
	// #endif

	if (!TRUST_TAGS[node.name] && !BLOCK_TAGS[node.name] && !vm.xml) {
		node.name = INLINE_TAGS[node.name] ? 'span' : 'span'
	}
	if (BLOCK_TAGS[node.name] && !TRUST_TAGS[node.name]) node.name = 'div'

	if (node.name === 'pre' || vm.pre) {
		vm.pre = Math.max(0, (vm.pre || 0) - (node.name === 'pre' ? 1 : 0))
	}

	const styleObj = parseStyle(vm, node)

	// align / dir → style
	if (attrs.align) {
		if (node.name === 'table') {
			if (attrs.align === 'center') {
				styleObj['margin-inline-start'] = 'auto'
				styleObj['margin-inline-end'] = 'auto'
			} else {
				styleObj.float = attrs.align
			}
		} else {
			styleObj['text-align'] = attrs.align
		}
		attrs.align = undefined
	}
	if (attrs.dir) {
		styleObj.direction = attrs.dir
		attrs.dir = undefined
	}

	// font：color / face / size → style
	if (node.name === 'font') {
		if (attrs.color) {
			styleObj.color = attrs.color
			attrs.color = undefined
		}
		if (attrs.face) {
			styleObj['font-family'] = attrs.face
			attrs.face = undefined
		}
		if (attrs.size) {
			let size = parseInt(attrs.size)
			if (!isNaN(size)) {
				if (size < 1) size = 1
				else if (size > 7) size = 7
				styleObj['font-size'] = ['x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'xxx-large'][
					size - 1
				]
			}
			attrs.size = undefined
		}
	}

	// a / iframe 暴露
	if (node.name === 'a' || node.name === 'ad') {
		expose(vm)
		if (node.name === 'a' && !attrs.href) attrs.href = ''
	}
	// #ifdef H5 || APP-PLUS
	if (node.name === 'iframe' || node.name === 'embed') {
		expose(vm)
	}
	// #endif

	// video：保留 object-fit 到 attrs；height:auto 清理
	if (node.name === 'video') {
		if ((styleObj.height || '').includes('auto')) styleObj.height = undefined
		if (styleObj['object-fit']) {
			attrs['object-fit'] = styleObj['object-fit']
		} else if (attrs['object-fit']) {
			/* 已有属性保留 */
		}
	}

	// 合并单元格标记向上传递
	if ((node.name === 'td' || node.name === 'th') && (attrs.colspan || attrs.rowspan)) {
		for (let i = vm.stack.length; i--;) {
			const p = vm.stack[i]
			if (p.name === 'table' || p.name === 'tbody' || p.name === 'tr') p.flag = 1
		}
	}

	// 列表 type → list-style-type；li 标记 c
	if (node.name === 'li') node.c = 1
	if (node.name === 'ul' || node.name === 'ol') {
		const types = {
			a: 'lower-alpha',
			A: 'upper-alpha',
			i: 'lower-roman',
			I: 'upper-roman'
		}
		if (types[attrs.type]) {
			attrs.style = (attrs.style || '') + ';list-style-type:' + types[attrs.type]
			attrs.type = undefined
		}
		for (let i = (children || []).length; i--;) {
			if (children[i].name === 'li') children[i].c = 1
		}
	}

	// ruby：rt 注音结构转换
	if (node.name === 'ruby') {
		node.name = 'span'
		for (let i = 0; i < (children || []).length - 1; i++) {
			if (children[i].type === 'text' && children[i + 1].name === 'rt') {
				children[i] = {
					name: 'div',
					attrs: { style: 'display:inline-block;text-align:center' },
					children: [
						{
							name: 'div',
							attrs: { style: 'font-size:50%;' + (children[i + 1].attrs.style || '') },
							children: children[i + 1].children
						},
						children[i]
					]
				}
				children.splice(i + 1, 1)
			}
		}
	}

	// 交互节点标记 c（纯文本表格走 rich-text，便于原生 colspan/rowspan）
	if (node.name === 'a' || node.name === 'video' || node.name === 'audio' || node.name === 'li') {
		node.c = 1
	}

	// 子节点含交互则父也暴露
	if (!node.c && children) {
		for (let i = 0; i < children.length; i++) {
			if (children[i].c || children[i].name === 'img' || children[i].name === 'a') {
				node.c = 1
				break
			}
		}
	}

	// 表格：需在 c 确定后处理布局（table / grid）与边框属性
	if (node.name === 'table') {
		handleTable(node, styleObj, children)
	} else if ((node.name === 'tbody' || node.name === 'tr') && node.flag && node.c) {
		node.flag = undefined
		copyCellColor(children, styleObj)
	}

	if (node.name !== 'table' && parseInt(styleObj.width) > getWindowWidth()) {
		styleObj['max-width'] = '100%'
		styleObj['box-sizing'] = 'border-box'
	}

	applyStyle(node, styleObj)

	// flex / grid 提示
	if (parent && ((parent.attrs.style || '').includes('flex') || (parent.attrs.style || '').includes('grid'))) {
		node.f = ';max-width:100%'
	}

	if (children && children.length >= 50 && node.c && !(styleObj.display || '').includes('flex')) {
		mergeNodes(children)
	}

	// 表格横向滚动层（避免 margin-inline 等误判为 inline）
	if (node.name === 'table' && vm.options.scrollTable && !(styleObj.display || '').includes('inline')) {
		const table = Object.assign({}, node)
		node.name = 'div'
		node.attrs = { style: 'overflow-x:auto;width:100%;-webkit-overflow-scrolling:touch' }
		node.children = [table]
		node.c = 1
		node.flag = undefined
	}

	// 插件 onParse：返回 false 则不 push
	if (vm.pluginHost && vm.pluginHost.onParse(node, vm) === false) return
	siblings.push(node)
}

/** 将 tbody/tr 上的颜色下发到单元格，避免合并布局时丢失 */
function copyCellColor(nodes, styleObj) {
	for (let i = 0; i < (nodes || []).length; i++) {
		const n = nodes[i]
		if (n.name === 'td' || n.name === 'th') {
			for (const key of ['color', 'background', 'background-color']) {
				if (styleObj[key]) {
					n.attrs.style = key + ':' + styleObj[key] + ';' + (n.attrs.style || '')
				}
			}
		} else if (n.children) {
			copyCellColor(n.children, styleObj)
		}
	}
}

/**
 * 表格属性与布局：
 * - 无交互：交给 rich-text（原生支持 colspan/rowspan）
 * - 有交互无合并：display:table + cell 边框/内边距
 * - 有交互且合并：CSS Grid 拍平单元格
 */
function handleTable(node, styleObj, children) {
	const attrs = node.attrs
	let padding = parseFloat(attrs.cellpadding)
	let spacing = parseFloat(attrs.cellspacing)
	const border = parseFloat(attrs.border)
	const bordercolor = styleObj['border-color']
	const borderstyle = styleObj['border-style']
	attrs.cellpadding = undefined
	attrs.cellspacing = undefined
	attrs.border = undefined

	if (node.c) {
		if (isNaN(padding)) padding = 2
		if (isNaN(spacing)) spacing = 2
	}

	if (border) {
		styleObj.border = `${border}px ${borderstyle || 'solid'} ${bordercolor || 'gray'}`
	}

	if (node.flag && node.c) {
		styleObj.display = 'grid'
		if (styleObj['border-collapse'] === 'collapse') {
			styleObj['border-collapse'] = undefined
			spacing = 0
		}
		if (spacing) {
			styleObj['grid-gap'] = spacing + 'px'
			styleObj.padding = spacing + 'px'
		} else if (border) {
			styleObj['border-left'] = '0'
			styleObj['border-top'] = '0'
		}
		flattenTableGrid(node, children, styleObj, {
			padding,
			spacing,
			border,
			bordercolor,
			borderstyle
		})
		node.flag = undefined
	} else {
		if (node.c) styleObj.display = 'table'
		if (!isNaN(spacing)) styleObj['border-spacing'] = spacing + 'px'
		if (border || padding) {
			applyCellBox(children, border, borderstyle, bordercolor, padding)
		}
		node.flag = undefined
	}
}

function applyCellBox(nodes, border, borderstyle, bordercolor, padding) {
	for (let i = 0; i < (nodes || []).length; i++) {
		const td = nodes[i]
		if (td.name === 'th' || td.name === 'td') {
			if (border) {
				td.attrs.style =
					(td.attrs.style || '') + `;border:${border}px ${borderstyle || 'solid'} ${bordercolor || 'gray'}`
			}
			if (padding) {
				td.attrs.style = (td.attrs.style || '') + `;padding:${padding}px`
			}
		} else if (td.children) {
			applyCellBox(td.children, border, borderstyle, bordercolor, padding)
		}
	}
}

function flattenTableGrid(node, children, styleObj, opt) {
	const width = []
	const trList = []
	const cells = []
	const map = {}

	;(function walk(nodes) {
		for (let i = 0; i < (nodes || []).length; i++) {
			const n = nodes[i]
			if (n.name === 'tr') trList.push(n)
			else if (n.name === 'colgroup') {
				let colI = 1
				for (const col of n.children || []) {
					if (col.name === 'col') {
						const style = col.attrs.style || ''
						const start = style.indexOf('width') ? style.indexOf(';width') : 0
						if (start !== -1) {
							let end = style.indexOf(';', start + 6)
							if (end === -1) end = style.length
							width[colI] = style.substring(start ? start + 7 : 6, end)
						}
						colI += 1
					}
				}
			} else {
				walk(n.children || [])
			}
		}
	})(children)

	const { padding, spacing, border, bordercolor, borderstyle } = opt
	for (let row = 1; row <= trList.length; row++) {
		let col = 1
		for (let j = 0; j < (trList[row - 1].children || []).length; j++) {
			const td = trList[row - 1].children[j]
			if (td.name !== 'td' && td.name !== 'th') continue
			while (map[row + '.' + col]) col++

			let style = td.attrs.style || ''
			let start = style.indexOf('width') ? style.indexOf(';width') : 0
			if (start !== -1) {
				let end = style.indexOf(';', start + 6)
				if (end === -1) end = style.length
				if (!td.attrs.colspan) width[col] = style.substring(start ? start + 7 : 6, end)
				style = style.substr(0, start) + style.substr(end)
			}

			style += ';display:flex'
			start = style.indexOf('vertical-align')
			if (start !== -1) {
				const val = style.substr(start + 15, 10)
				if (val.includes('middle')) style += ';align-items:center'
				else if (val.includes('bottom')) style += ';align-items:flex-end'
			} else {
				style += ';align-items:center'
			}
			start = style.indexOf('text-align')
			if (start !== -1) {
				const val = style.substr(start + 11, 10)
				if (val.includes('center')) style += ';justify-content:center'
				else if (val.includes('right')) style += ';justify-content:right'
			}

			// 边框/内边距放后面，覆盖标签默认样式
			if (border) {
				style +=
					`;border:${border}px ${borderstyle || 'solid'} ${bordercolor || 'gray'}` +
					(spacing ? '' : ';border-right:0;border-bottom:0')
			}
			if (padding) style += `;padding:${padding}px`

			if (td.attrs.colspan) {
				style += `;grid-column-start:${col};grid-column-end:${col + parseInt(td.attrs.colspan)}`
				if (!td.attrs.rowspan) style += `;grid-row-start:${row};grid-row-end:${row + 1}`
				col += parseInt(td.attrs.colspan) - 1
			}
			if (td.attrs.rowspan) {
				style += `;grid-row-start:${row};grid-row-end:${row + parseInt(td.attrs.rowspan)}`
				if (!td.attrs.colspan) style += `;grid-column-start:${col};grid-column-end:${col + 1}`
				for (let rs = 1; rs < td.attrs.rowspan; rs++) {
					for (let cs = 0; cs < (td.attrs.colspan || 1); cs++) {
						map[row + rs + '.' + (col - cs)] = 1
					}
				}
			}
			td.attrs.style = style
			cells.push(td)
			col++
		}
		if (row === 1) {
			let temp = ''
			for (let i = 1; i < col; i++) temp += (width[i] ? width[i] : 'auto') + ' '
			styleObj['grid-template-columns'] = temp
		}
	}
	node.children = cells
}

function onText(vm, text) {
	if (!vm.pre) {
		let trim = ''
		let flag
		for (let i = 0, len = text.length; i < len; i++) {
			if (!BLANK_CHAR[text[i]]) trim += text[i]
			else {
				if (trim[trim.length - 1] !== ' ') trim += ' '
				if (text[i] === '\n' && !flag) flag = true
			}
		}
		if (trim === ' ') {
			if (flag) return
		}
		text = trim
	}
	if (!text) return
	const node = Object.create(null)
	node.type = 'text'
	node.text = decodeEntity(text)
	// selectable force：部分端需暴露节点树
	// #ifdef MP-WEIXIN
	if (vm.options.selectable === 'force') {
		const system = getSystem()
		if (
			system.includes('iOS') &&
			typeof uni !== 'undefined' &&
			uni.canIUse &&
			!uni.canIUse('rich-text.user-select')
		) {
			expose(vm)
		}
	}
	// #endif
	if (vm.pluginHost && vm.pluginHost.onParse(node, vm) === false) return
	const siblings = vm.stack.length ? vm.stack[vm.stack.length - 1].children : vm.nodes
	siblings.push(node)
}

/* —— Lexer —— */
function Lexer(handler) {
	this.handler = handler
}

Lexer.prototype.parse = function (content) {
	this.content = content || ''
	this.i = 0
	this.start = 0
	this.state = this.text
	for (let len = this.content.length; this.i !== -1 && this.i < len; ) {
		this.state()
	}
}

Lexer.prototype.checkClose = function (method) {
	const selfClose = this.content[this.i] === '/'
	if (this.content[this.i] === '>' || (selfClose && this.content[this.i + 1] === '>')) {
		if (method) {
			const fn = method === 'onTagName' ? onTagName : method === 'onAttrName' ? onAttrName : null
			if (fn) fn(this.handler, this.content.substring(this.start, this.i))
		}
		this.i += selfClose ? 2 : 1
		this.start = this.i
		onOpenTag(this.handler, selfClose)
		if (this.handler.tagName === 'script') {
			this.i = this.content.indexOf('</', this.i)
			if (this.i !== -1) {
				this.i += 2
				this.start = this.i
			}
			this.state = this.endTag
		} else {
			this.state = this.text
		}
		return true
	}
	return false
}

Lexer.prototype.text = function () {
	this.i = this.content.indexOf('<', this.i)
	if (this.i === -1) {
		if (this.start < this.content.length) onText(this.handler, this.content.substring(this.start))
		return
	}
	const c = this.content[this.i + 1]
	if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z')) {
		if (this.start !== this.i) onText(this.handler, this.content.substring(this.start, this.i))
		this.start = ++this.i
		this.state = this.tagName
	} else if (c === '/' || c === '!' || c === '?') {
		if (this.start !== this.i) onText(this.handler, this.content.substring(this.start, this.i))
		const next = this.content[this.i + 2]
		if (c === '/' && ((next >= 'a' && next <= 'z') || (next >= 'A' && next <= 'Z'))) {
			this.i += 2
			this.start = this.i
			this.state = this.endTag
			return
		}
		let end = '-->'
		if (c !== '!' || this.content[this.i + 2] !== '-' || this.content[this.i + 3] !== '-') end = '>'
		this.i = this.content.indexOf(end, this.i)
		if (this.i !== -1) {
			this.i += end.length
			this.start = this.i
		}
	} else {
		this.i++
	}
}

Lexer.prototype.tagName = function () {
	if (BLANK_CHAR[this.content[this.i]]) {
		onTagName(this.handler, this.content.substring(this.start, this.i))
		while (BLANK_CHAR[this.content[++this.i]]);
		if (this.i < this.content.length && !this.checkClose()) {
			this.start = this.i
			this.state = this.attrName
		}
	} else if (!this.checkClose('onTagName')) {
		this.i++
	}
}

Lexer.prototype.attrName = function () {
	let c = this.content[this.i]
	if (BLANK_CHAR[c] || c === '=') {
		onAttrName(this.handler, this.content.substring(this.start, this.i))
		let needVal = c === '='
		const len = this.content.length
		while (++this.i < len) {
			c = this.content[this.i]
			if (!BLANK_CHAR[c]) {
				if (this.checkClose()) return
				if (needVal) {
					this.start = this.i
					this.state = this.attrVal
					return
				}
				if (this.content[this.i] === '=') needVal = true
				else {
					this.start = this.i
					this.state = this.attrName
					return
				}
			}
		}
	} else if (!this.checkClose('onAttrName')) {
		this.i++
	}
}

Lexer.prototype.attrVal = function () {
	const c = this.content[this.i]
	const len = this.content.length
	if (c === '"' || c === "'") {
		this.start = ++this.i
		this.i = this.content.indexOf(c, this.i)
		if (this.i === -1) return
		onAttrVal(this.handler, this.content.substring(this.start, this.i))
		this.i++
	} else {
		for (; this.i < len; this.i++) {
			if (BLANK_CHAR[this.content[this.i]]) {
				onAttrVal(this.handler, this.content.substring(this.start, this.i))
				break
			} else if (this.content[this.i] === '>') {
				onAttrVal(this.handler, this.content.substring(this.start, this.i))
				break
			} else if (this.content[this.i] === '/' && this.content[this.i + 1] === '>') {
				onAttrVal(this.handler, this.content.substring(this.start, this.i))
				break
			}
		}
	}
	while (BLANK_CHAR[this.content[this.i]]) this.i++
	if (this.i < len && !this.checkClose()) {
		this.start = this.i
		this.state = this.attrName
	}
}

Lexer.prototype.endTag = function () {
	if (BLANK_CHAR[this.content[this.i]] || this.content[this.i] === '>' || this.content[this.i] === '/') {
		onCloseTag(this.handler, this.content.substring(this.start, this.i))
		while (this.content[this.i] !== '>' && this.i < this.content.length) this.i++
		this.start = ++this.i
		this.state = this.text
	} else {
		this.i++
	}
}

export default parseHtml
