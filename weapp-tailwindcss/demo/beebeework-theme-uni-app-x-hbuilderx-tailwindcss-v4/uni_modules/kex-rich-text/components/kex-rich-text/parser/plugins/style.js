/**
 * style 标签解析插件：把 <style> 规则合并进 tagStyle
 */
function parseStyleBlock(css) {
	const map = Object.create(null)
	if (!css) return map
	const text = String(css)
		.replace(/\/\*[\s\S]*?\*\//g, '')
		.replace(/\s+/g, ' ')
	const blocks = text.split('}')
	for (let i = 0; i < blocks.length; i++) {
		const part = blocks[i].split('{')
		if (part.length < 2) continue
		const selectors = part[0].split(',')
		const body = part[1].trim()
		if (!body) continue
		for (let j = 0; j < selectors.length; j++) {
			let sel = selectors[j].trim().toLowerCase()
			if (!sel || sel[0] === '@' || sel.includes(' ') || sel.includes(':') || sel.includes('.')) continue
			if (sel[0] === '#') continue
			map[sel] = (map[sel] ? map[sel] + ';' : '') + body
		}
	}
	return map
}

export default function Style() {
	this._style = ''
}

Style.prototype.onUpdate = function (content, options) {
	this._style = ''
	const html = String(content || '').replace(/<style[\s\S]*?>([\s\S]*?)<\/style>/gi, (_, css) => {
		this._style += css + '\n'
		return ''
	})
	const map = parseStyleBlock(this._style)
	options.tagStyle = Object.assign({}, options.tagStyle || {}, map)
	return html
}
