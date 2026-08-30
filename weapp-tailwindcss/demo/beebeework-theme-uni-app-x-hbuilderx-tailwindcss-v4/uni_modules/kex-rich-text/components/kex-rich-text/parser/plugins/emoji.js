/**
 * 表情插件：将 [笑] 等形式替换为 img 或字符
 * 配置：new Emoji({ map: { '笑': 'https://...' }, src?: base })
 */
export default function Emoji(config) {
	this.map = (config && config.map) || Object.create(null)
	this.src = (config && config.src) || ''
}

Emoji.prototype.onUpdate = function (content) {
	const map = this.map
	const src = this.src
	return String(content || '').replace(/\[([^\]]+)\]/g, (all, name) => {
		if (map[name]) {
			const url = map[name].indexOf('://') >= 0 || map[name][0] === '/' ? map[name] : src + map[name]
			return '<img src="' + url + '" style="width:1.25em;height:1.25em;vertical-align:middle" ignore />'
		}
		return all
	})
}
