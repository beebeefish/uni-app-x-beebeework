/**
 * 解析器插件钩子内核
 * 支持 onUpdate / onParse / onLoad / onDetached
 */

/**
 * @param {Array} plugins 插件列表
 */
export function createPluginHost(plugins = []) {
	const list = Array.isArray(plugins) ? plugins : []
	return {
		plugins: list,
		/** 内容更新前：依次调用 plugin.onUpdate，返回最终 content */
		onUpdate(content, options) {
			let html = content
			for (let i = 0; i < list.length; i++) {
				const plugin = list[i]
				if (plugin && typeof plugin.onUpdate === 'function') {
					const next = plugin.onUpdate(html, options)
					if (next != null) html = next
				}
			}
			return html
		},
		/** 每个节点出栈前：返回 false 可丢弃节点 */
		onParse(node, vm) {
			for (let i = 0; i < list.length; i++) {
				const plugin = list[i]
				if (plugin && typeof plugin.onParse === 'function') {
					if (plugin.onParse(node, vm) === false) return false
				}
			}
			return true
		},
		onLoad(vm) {
			for (let i = 0; i < list.length; i++) {
				const plugin = list[i]
				if (plugin && typeof plugin.onLoad === 'function') {
					plugin.onLoad(vm)
				}
			}
		},
		onDetached(vm) {
			for (let i = 0; i < list.length; i++) {
				const plugin = list[i]
				if (plugin && typeof plugin.onDetached === 'function') {
					plugin.onDetached(vm)
				}
			}
		}
	}
}

export default createPluginHost
