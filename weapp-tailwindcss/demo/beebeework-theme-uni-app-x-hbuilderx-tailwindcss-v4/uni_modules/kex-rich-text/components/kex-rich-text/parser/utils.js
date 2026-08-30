/**
 * HTML 实体解码 + XSS 相关工具
 */
import { ENTITIES, DANGER_ATTR } from './config.js'

export function decodeEntity(str, amp) {
	if (!str) return ''
	let i = str.indexOf('&')
	while (i !== -1) {
		const j = str.indexOf(';', i + 3)
		if (j === -1) break
		if (str[i + 1] === '#') {
			const hex = str[i + 2] === 'x' || str[i + 2] === 'X'
			const code = parseInt((hex ? '0' : '') + str.substring(i + 2, j), hex ? 16 : 10)
			if (!isNaN(code)) {
				str = str.substring(0, i) + String.fromCharCode(code) + str.substring(j + 1)
			}
		} else {
			const name = str.substring(i + 1, j)
			if (ENTITIES[name] || (name === 'amp' && amp)) {
				str = str.substring(0, i) + (ENTITIES[name] || '&') + str.substring(j + 1)
			}
		}
		i = str.indexOf('&', i + 1)
	}
	return str
}

/** 是否危险 URL（javascript: / data:text/html 等） */
export function isDangerUrl(url) {
	if (!url) return false
	const u = String(url).trim().toLowerCase()
	return (
		u.startsWith('javascript:') ||
		u.startsWith('vbscript:') ||
		u.startsWith('data:text/html') ||
		u.startsWith('data:application')
	)
}

export function isDangerAttr(name) {
	if (!name) return true
	const n = name.toLowerCase()
	if (DANGER_ATTR[n]) return true
	if (n.startsWith('on')) return true
	return false
}

/** 本地路径转绝对路径（APP） */
function convertLocalUrl(url) {
	try {
		if (typeof plus !== 'undefined' && plus.io && typeof plus.io.convertLocalFileSystemURL === 'function') {
			return plus.io.convertLocalFileSystemURL(url)
		}
	} catch (e) {}
	return url
}

/** 拼接 domain；无 domain 时尝试转换 APP 本地路径 */
export function joinUrl(url, domain) {
	if (!url) return ''
	if (isDangerUrl(url)) return ''
	if (url[0] === '/') {
		if (url[1] === '/') {
			return (domain ? domain.split('://')[0] : 'https') + ':' + url
		}
		if (domain) return domain + url
		return convertLocalUrl(url)
	}
	if (!url.includes('data:') && !url.includes('://')) {
		if (domain) return domain + '/' + url
		return convertLocalUrl(url)
	}
	return url
}

/** 节点树抽纯文本 */
export function nodesToText(nodes) {
	let text = ''
	const walk = (list) => {
		if (!list) return
		for (let i = 0; i < list.length; i++) {
			const n = list[i]
			if (n.type === 'text') {
				text += (n.text || '').replace(/&amp;/g, '&')
			} else if (n.name === 'br') {
				text += '\n'
			} else {
				const isBlock =
					n.name === 'p' ||
					n.name === 'div' ||
					n.name === 'tr' ||
					n.name === 'li' ||
					(n.name && n.name[0] === 'h' && n.name[1] >= '1' && n.name[1] <= '6')
				if (isBlock && text && text[text.length - 1] !== '\n') text += '\n'
				if (n.children) walk(n.children)
				if (isBlock && text[text.length - 1] !== '\n') text += '\n'
				else if (n.name === 'td' || n.name === 'th') text += '\t'
			}
		}
	}
	walk(nodes)
	return text
}

/** 收集图片 src */
export function collectImgs(nodes, list) {
	const out = list || []
	const walk = (arr) => {
		if (!arr) return
		for (let i = 0; i < arr.length; i++) {
			const n = arr[i]
			if (n.name === 'img' && n.attrs && n.attrs.src && !n.attrs.ignore) {
				out.push(n.attrs['original-src'] || n.attrs.src)
			}
			if (n.children) walk(n.children)
		}
	}
	walk(nodes)
	return out
}
