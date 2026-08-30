/**
 * editable：编辑模式辅助（内容序列化 / 命令 HTML 片段）
 * 真正的工具栏 UI 在 kex-rich-text.vue 内；本插件提供 getContent 节点遍历
 */
export function nodesToHtml(nodes) {
	if (!nodes || !nodes.length) return ''
	let html = ''
	for (let i = 0; i < nodes.length; i++) {
		html += nodeToHtml(nodes[i])
	}
	return html
}

function nodeToHtml(n) {
	if (!n) return ''
	if (n.type === 'text') return escape(n.text || '')
	if (n.name === 'br') return '<br/>'
	const name = n.name || 'div'
	const attrs = n.attrs || {}
	let attrStr = ''
	Object.keys(attrs).forEach((k) => {
		if (k === 'style' || k === 'class' || k === 'href' || k === 'src' || k === 'id' || k === 'alt') {
			attrStr += ` ${k}="${escapeAttr(attrs[k])}"`
		}
	})
	if (name === 'img') {
		return `<img${attrStr}/>`
	}
	const inner = nodesToHtml(n.children || [])
	return `<${name}${attrStr}>${inner}</${name}>`
}

function escape(s) {
	return String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
}

function escapeAttr(s) {
	return String(s == null ? '' : s)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
}

/** 工具栏命令 → HTML 片段 */
export function commandHtml(cmd, payload) {
	switch (cmd) {
		case 'bold':
			return `<strong>${payload || '粗体'}</strong>`
		case 'italic':
			return `<em>${payload || '斜体'}</em>`
		case 'underline':
			return `<u>${payload || '下划线'}</u>`
		case 'h2':
			return `<h2>${payload || '标题'}</h2>`
		case 'h3':
			return `<h3>${payload || '小标题'}</h3>`
		case 'ul':
			return `<ul><li>${payload || '列表项'}</li></ul>`
		case 'ol':
			return `<ol><li>${payload || '列表项'}</li></ol>`
		case 'quote':
			return `<blockquote><p>${payload || '引用'}</p></blockquote>`
		case 'link':
			return `<a href="${escapeAttr((payload && payload.href) || 'https://')}">${(payload && payload.text) || '链接'}</a>`
		case 'img':
			return `<p><img src="${escapeAttr((payload && payload.src) || '')}" alt=""/></p>`
		case 'table':
			return '<table border="1"><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>'
		case 'hr':
			return '<hr/>'
		default:
			return payload || ''
	}
}

export default function Editable() {}
