/**
 * 代码高亮插件：内置简易配色（纯文本着色标记）；可注入 highlight(code, lang) => 纯文本或简单 HTML 片段
 */
const KW =
	/\b(function|return|const|let|var|if|else|for|while|class|import|export|from|async|await|new|this|true|false|null|undefined|typeof|in|of)\b/g

function builtinHighlight(code) {
	// 输出仍为纯文本（避免小程序 rich-text 复杂 HTML）；仅保证 language class
	return String(code || '')
}

export default function Highlight(config) {
	this.highlight = config && config.highlight
}

Highlight.prototype.onParse = function (node) {
	if (node.name !== 'pre' || !node.children) return
	let codeNode = null
	for (let i = 0; i < node.children.length; i++) {
		if (node.children[i].name === 'code') {
			codeNode = node.children[i]
			break
		}
	}
	if (!codeNode) return

	let lang = ''
	const cls = (codeNode.attrs && codeNode.attrs.class) || ''
	const m = cls.match(/language-([\w-]+)/) || cls.match(/lang-([\w-]+)/)
	if (m) lang = m[1]

	let text = ''
	const walk = (list) => {
		for (let i = 0; i < (list || []).length; i++) {
			const n = list[i]
			if (n.type === 'text') text += n.text || ''
			else if (n.children) walk(n.children)
		}
	}
	walk(codeNode.children)

	codeNode.attrs = codeNode.attrs || {}
	if (lang && !(codeNode.attrs.class || '').includes('language-')) {
		codeNode.attrs.class = ((codeNode.attrs.class || '') + ' language-' + lang).trim()
	}
	codeNode.attrs['data-lang'] = lang
	node.attrs = node.attrs || {}
	node.attrs['data-lang'] = lang
	node.attrs.style =
		((node.attrs.style || '') +
			';background:#1e1e1e;color:#d4d4d4;padding:12px;border-radius:8px;overflow:auto').replace(
			/^;/,
			''
		)

	if (typeof this.highlight === 'function') {
		const out = this.highlight(text, lang)
		if (typeof out === 'string' && out && !out.includes('<')) {
			codeNode.children = [{ type: 'text', text: out }]
		}
	} else {
		builtinHighlight(text)
		codeNode.attrs.style = 'color:#9cdcfe'
	}
}

Highlight.builtinHighlight = builtinHighlight
