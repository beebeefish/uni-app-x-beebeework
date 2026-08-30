/**
 * audio 插件：将 audio 标记为增强播放器节点（kex-audio）
 * 渲染侧按 name=audio + c=2 走自定义 UI（封面/进度/互斥）
 */
export default function Audio() {}

Audio.prototype.onParse = function (node) {
	if (node.name !== 'audio') return
	node.c = 2
	node.attrs = node.attrs || {}
	node.attrs.class = ((node.attrs.class || '') + ' kex-audio').trim()
	if (!node.attrs.controls && !node.attrs.autoplay) {
		node.attrs.controls = 'T'
	}
}
