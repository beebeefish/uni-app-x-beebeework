/**
 * txv-video：腾讯视频 iframe / vid → 可点击封面（跳转）
 */
function extractVid(src) {
	if (!src) return ''
	const m =
		String(src).match(/[?&]vid=([0-9a-zA-Z]+)/) ||
		String(src).match(/\/([0-9a-zA-Z]{11})(?:\.html)?/) ||
		String(src).match(/cover\/[^/]+\/([0-9a-zA-Z]+)\.html/)
	return m ? m[1] : ''
}

export default function TxvVideo() {}

TxvVideo.prototype.onParse = function (node) {
	if (node.name !== 'iframe' && node.name !== 'video') return
	const src = (node.attrs && (node.attrs.src || node.attrs['data-src'])) || ''
	if (!/v\.qq\.com|qq\.com\/.*vid/i.test(src) && !(node.attrs && node.attrs.vid)) return
	const vid = (node.attrs && node.attrs.vid) || extractVid(src)
	if (!vid) return
	node.name = 'a'
	node.c = 2
	node.attrs = {
		href: 'https://v.qq.com/x/page/' + vid + '.html',
		class: 'kex-txv',
		style:
			'display:block;position:relative;width:100%;max-width:100%;height:0;padding-bottom:56.25%;background:#000;border-radius:8px;overflow:hidden;text-decoration:none'
	}
	node.children = [
		{
			name: 'img',
			attrs: {
				src: 'https://puui.qpic.cn/vpic_cover/' + vid + '/' + vid + '_hz.jpg',
				ignore: 'T',
				style: 'position:absolute;left:0;top:0;width:100%;height:100%;object-fit:cover'
			}
		},
		{
			type: 'text',
			text: ' ▶ 腾讯视频'
		}
	]
}
