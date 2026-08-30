/**
 * 关键词搜索高亮插件
 * new Search(vm) 或直接传入实例；调用实例 search(key, anchor?, horizontal?)
 */
export default function Search(vm) {
	this.vm = vm
	this.key = ''
}

Search.prototype.onParse = function (node, parser) {
	if (!this.key) return
	if (node.type === 'text' && node.text) {
		const key = this.key
		const text = node.text
		const idx = text.toLowerCase().indexOf(key.toLowerCase())
		if (idx === -1) return
		const children = []
		let last = 0
		let from = 0
		while (from < text.length) {
			const i = text.toLowerCase().indexOf(key.toLowerCase(), from)
			if (i === -1) break
			if (i > last) {
				children.push({ type: 'text', text: text.substring(last, i) })
			}
			children.push({
				name: 'span',
				attrs: {
					id: 'kex-search-' + (parser._searchId = (parser._searchId || 0) + 1),
					style: 'color:#f57c00;font-weight:bold'
				},
				children: [{ type: 'text', text: text.substr(i, key.length) }]
			})
			last = i + key.length
			from = last
		}
		if (last < text.length) children.push({ type: 'text', text: text.substring(last) })
		node.name = 'span'
		node.type = undefined
		node.attrs = node.attrs || {}
		node.children = children
		node.text = undefined
		node.c = 1
	}
}

/**
 * @param {string} key 关键词，空则清除
 * @param {boolean} [anchor] 是否跳到首个命中
 * @returns {Promise<number>} 命中次数
 */
Search.prototype.search = function (key, anchor) {
	this.key = key || ''
	const that = this
	return new Promise((resolve) => {
		if (!that.vm || typeof that.vm.setContent !== 'function') {
			resolve(0)
			return
		}
		const html = that.vm.content
		that.vm.setContent(html)
		that.vm.$nextTick(() => {
			let n = 0
			const walk = (list) => {
				for (let i = 0; i < (list || []).length; i++) {
					const node = list[i]
					if (node.attrs && String(node.attrs.id || '').indexOf('kex-search-') === 0) n++
					if (node.children) walk(node.children)
				}
			}
			walk(that.vm.nodes)
			if (anchor && n && that.vm.navigateTo) {
				that.vm.navigateTo('kex-search-1').catch(() => {})
			}
			resolve(n)
		})
	})
}
