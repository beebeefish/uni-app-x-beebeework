/**
 * img-cache：App / 小程序下载远程图到本地，替换 src，加速二次打开
 * new ImgCache({ max: 50 })
 */
const CACHE_KEY = 'kex_rt_img_cache'

function loadMap() {
	try {
		return uni.getStorageSync(CACHE_KEY) || {}
	} catch (e) {
		return {}
	}
}

function saveMap(map) {
	try {
		uni.setStorageSync(CACHE_KEY, map)
	} catch (e) {}
}

export default function ImgCache(config) {
	this.max = (config && config.max) || 80
	this.map = loadMap()
}

ImgCache.prototype.onParse = function (node, vm) {
	if (node.name !== 'img' || !node.attrs || !node.attrs.src) return
	const src = node.attrs.src
	if (!/^https?:\/\//i.test(src)) return
	if (this.map[src]) {
		node.attrs.src = this.map[src]
		return
	}
	// 异步下载：先保留原 src，下载后写缓存（下次生效）；也可立即替换
	// #ifdef APP-PLUS || MP
	uni.downloadFile({
		url: src,
		success: (res) => {
			if (res.statusCode === 200 && res.tempFilePath) {
				const keys = Object.keys(this.map)
				if (keys.length >= this.max) {
					delete this.map[keys[0]]
				}
				this.map[src] = res.tempFilePath
				saveMap(this.map)
				node.attrs.src = res.tempFilePath
				if (vm && typeof vm.setContent === 'function') {
					// 触发轻量刷新由外层自行决定，避免循环
				}
			}
		}
	})
	// #endif
}
