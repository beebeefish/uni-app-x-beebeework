<template>
	<view :id="attrs.id" :class="['_block', '_' + name, attrs.class]" :style="attrs.style">
		<block v-for="(n, i) in nodes" :key="n._k || i">
			<image
				v-if="n.name === 'img' && !n.t && ((opts.loadingImg && !ctrl[i]) || ctrl[i] < 0)"
				class="_img"
				:style="n.attrs.style"
				:src="ctrl[i] < 0 ? opts.errorImg : opts.loadingImg"
				mode="widthFix"
			/>
			<rich-text
				v-if="n.name === 'img' && n.t"
				:style="'display:' + n.t"
				:nodes="[
					{
						attrs: {
							style: n.attrs.style || '',
							src: n.attrs.src || (ctrl.load ? n.attrs['data-src'] : '')
						},
						name: 'img'
					}
				]"
				:data-i="i"
				@tap.stop="onImgTap"
			/>
			<image
				v-else-if="n.name === 'img'"
				:id="n.attrs.id"
				:class="['_img', n.attrs.class]"
				:style="(ctrl[i] === -1 ? 'display:none;' : '') + (n.attrs.style || '')"
				:src="n.attrs.src || (ctrl.load ? n.attrs['data-src'] : '')"
				:mode="!n.h ? 'widthFix' : !n.w ? 'heightFix' : n.m || 'scaleToFill'"
				:lazy-load="!!opts.lazyLoad"
				:webp="n.webp"
				:show-menu-by-longpress="!!opts.showImgMenu && !n.attrs.ignore"
				:data-i="i"
				@load="onImgLoad"
				@error="onMediaError"
				@tap.stop="onImgTap"
				@longpress="onImgLongTap"
			/>
			<!-- #ifdef MP-WEIXIN -->
			<text v-else-if="n.type === 'text'" :user-select="opts.selectable === 'force' && isiOS" decode>{{
				n.text
			}}</text>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<text v-else-if="n.type === 'text'" :user-select="!!opts.selectable" decode>{{ n.text }}</text>
			<!-- #endif -->
			<text v-else-if="n.name === 'br'">{{ '\n' }}</text>
			<view
				v-else-if="n.name === 'a'"
				:id="n.attrs.id"
				:class="[n.attrs.href ? '_a' : '', n.attrs.class]"
				hover-class="_hover"
				:style="'display:inline;' + (n.attrs.style || '')"
				:data-i="i"
				@tap.stop="onLinkTap"
			>
				<kex-rich-node name="span" :childs="n.children" :opts="opts" />
			</view>
			<video
				v-else-if="n.name === 'video'"
				:id="n.attrs.id"
				:class="n.attrs.class"
				:style="n.attrs.style"
				:autoplay="!!n.attrs.autoplay"
				:controls="n.attrs.controls !== undefined"
				:loop="!!n.attrs.loop"
				:muted="!!n.attrs.muted"
				:object-fit="n.attrs['object-fit'] || 'contain'"
				:poster="n.attrs.poster"
				:src="(n.src && n.src[ctrl[i] || 0]) || ''"
				:data-i="i"
				@play="onPlay"
				@pause="onMediaEvent"
				@fullscreenchange="onMediaEvent"
				@error="onMediaError"
			/>
			<!-- #ifdef H5 || APP-PLUS -->
			<iframe
				v-else-if="n.name === 'iframe'"
				:style="n.attrs.style"
				:allowfullscreen="n.attrs.allowfullscreen"
				:frameborder="n.attrs.frameborder"
				:src="n.attrs.src"
			/>
			<embed v-else-if="n.name === 'embed'" :style="n.attrs.style" :src="n.attrs.src" />
			<!-- #endif -->
			<!-- 增强音频播放器 -->
			<view
				v-else-if="n.name === 'audio'"
				class="_audio"
				:id="n.attrs.id"
				:class="n.attrs.class"
				:style="n.attrs.style"
				:data-i="i"
				@tap="onAudioTap"
			>
				<image
					v-if="n.attrs.poster"
					class="_audio-poster"
					:src="n.attrs.poster"
					mode="aspectFill"
				/>
				<view class="_audio-body">
					<text class="_audio-name">{{ n.attrs.name || n.attrs.author || '音频' }}</text>
					<text class="_audio-tip">{{
						ctrl['a' + i] === 2 ? formatTime(ctrl['t' + i]) : ctrl['a' + i] ? '播放中…' : '点击播放'
					}}</text>
				</view>
				<text class="_audio-icon">{{ ctrl['a' + i] ? '❚❚' : '▶' }}</text>
			</view>
			<view
				v-else-if="(n.name === 'table' && n.c) || n.name === 'li'"
				:id="n.attrs.id"
				:class="['_' + n.name, n.attrs.class]"
				:style="n.attrs.style"
			>
				<kex-rich-node v-if="n.name === 'li'" :childs="n.children" :opts="opts" />
				<template v-else>
					<view
						v-for="(tbody, x) in n.children"
						:key="x"
						:class="['_' + tbody.name, tbody.attrs && tbody.attrs.class]"
						:style="tbody.attrs && tbody.attrs.style"
					>
						<kex-rich-node
							v-if="tbody.name === 'td' || tbody.name === 'th'"
							:childs="tbody.children"
							:opts="opts"
						/>
						<template v-else>
							<view
								v-for="(tr, y) in tbody.children"
								:key="y"
								:class="['_' + tr.name, tr.attrs && tr.attrs.class]"
								:style="tr.attrs && tr.attrs.style"
							>
								<template v-if="tr.name === 'td' || tr.name === 'th'">
									<kex-rich-node :childs="tr.children" :opts="opts" />
								</template>
								<template v-else>
									<view
										v-for="(td, z) in tr.children"
										:key="z"
										:class="['_' + td.name, td.attrs && td.attrs.class]"
										:style="td.attrs && td.attrs.style"
									>
										<kex-rich-node :childs="td.children" :opts="opts" />
									</view>
								</template>
							</view>
						</template>
					</view>
				</template>
			</view>
			<rich-text
				v-else-if="n._rich"
				:style="n.attrs && n.attrs.style"
				:nodes="n._rich"
			/>
			<rich-text
				v-else-if="!n.c && n.name"
				:id="n.attrs && n.attrs.id"
				:style="(n.f || '') + (INLINE_HINT[n.name] ? ';display:inline' : '')"
				:user-select="opts.selectable"
				:selectable="opts.selectable"
				:nodes="[n]"
			/>
			<view
				v-else-if="n.c === 2"
				:id="n.attrs.id"
				:class="['_block', '_' + n.name, n.attrs.class]"
				:style="(n.f || '') + ';' + (n.attrs.style || '')"
			>
				<kex-rich-node
					v-for="(n2, j) in n.children"
					:key="j"
					:style="n2.f"
					:name="n2.name"
					:attrs="n2.attrs"
					:childs="n2.children"
					:opts="opts"
				/>
			</view>
			<kex-rich-node
				v-else-if="n.name"
				:style="n.f"
				:name="n.name"
				:attrs="n.attrs || {}"
				:childs="n.children"
				:opts="opts"
			/>
		</block>
	</view>
</template>

<script setup>
	import { ref, reactive, watch, inject, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'

	defineOptions({
		name: 'kex-rich-node',
		options: {
			// #ifdef MP-WEIXIN
			virtualHost: true
			// #endif
		}
	})

	const INLINE_HINT = {
		abbr: 1,
		b: 1,
		big: 1,
		code: 1,
		del: 1,
		em: 1,
		i: 1,
		ins: 1,
		label: 1,
		q: 1,
		small: 1,
		span: 1,
		strong: 1,
		sub: 1,
		sup: 1,
		mark: 1,
		s: 1,
		u: 1
	}

	const props = defineProps({
		name: { type: String, default: 'div' },
		attrs: { type: Object, default: () => ({}) },
		childs: { type: Array, default: () => [] },
		opts: { type: Object, default: () => ({}) }
	})

	const root = inject('kexRichRoot', null)
	const instance = getCurrentInstance()
	const ctrl = reactive({})
	const nodes = ref([])
	let observer = null
	let _audio = null
	let _audioTimer = null

	// #ifdef MP-WEIXIN
	const isiOS = (
		uni.canIUse('getDeviceInfo') ? uni.getDeviceInfo() : uni.getSystemInfoSync()
	).system.includes('iOS')
	// #endif
	// #ifndef MP-WEIXIN
	const isiOS = false
	// #endif

	watch(
		() => props.childs,
		(list) => {
			const arr = list || []
			for (let i = 0; i < arr.length; i++) {
				if (arr[i] && !arr[i]._k) {
					arr[i]._k = (arr[i].name || arr[i].type || 'n') + '-' + i
				}
			}
			nodes.value = arr
		},
		{ immediate: true }
	)

	function setCtrl(key, val) {
		ctrl[key] = val
	}

	function formatTime(sec) {
		sec = Math.floor(sec || 0)
		const m = Math.floor(sec / 60)
		const s = sec % 60
		return m + ':' + (s < 10 ? '0' : '') + s
	}

	function onImgTap(e) {
		const node = nodes.value[e.currentTarget.dataset.i]
		if (!node || !root) return
		if (node.a) {
			root._onLink(node.a)
			return
		}
		if (node.attrs.ignore) return
		// #ifdef H5 || APP-PLUS
		node.attrs.src = node.attrs.src || node.attrs['data-src']
		// #endif
		root._onImg(node.attrs)
	}

	function onImgLongTap(e) {
		// #ifdef APP-PLUS
		const node = nodes.value[e.currentTarget.dataset.i]
		if (!node || !root) return
		const attrs = node.attrs || {}
		if (props.opts.showImgMenu && !attrs.ignore) {
			uni.showActionSheet({
				itemList: ['保存图片'],
				success: () => {
					const save = (path) => {
						uni.saveImageToPhotosAlbum({
							filePath: path,
							success() {
								uni.showToast({ title: '保存成功' })
							}
						})
					}
					const url = (root.imgList && root.imgList[attrs.i]) || attrs.src || attrs['data-src']
					if (!url) return
					if (String(url).startsWith('http')) {
						uni.downloadFile({ url, success: (res) => save(res.tempFilePath) })
					} else save(url)
				}
			})
		}
		// #endif
	}

	function onImgLoad(e) {
		const i = e.currentTarget.dataset.i
		if (!nodes.value[i].w) setCtrl(i, e.detail.width)
		else if ((props.opts.loadingImg && !ctrl[i]) || ctrl[i] === -1) setCtrl(i, 1)
		root && root._imgLoaded()
	}

	function onLinkTap(e) {
		const node = nodes.value[e.currentTarget.dataset.i]
		if (!node || !root) return
		root._onLink(node.attrs || {}, node.children)
	}

	function onPlay(e) {
		const i = e.currentTarget.dataset.i
		const node = nodes.value[i]
		if (!root || !node) return
		const src = (node.src && node.src[ctrl[i] || 0]) || ''
		root.$emit('play', { source: node.name, attrs: { ...(node.attrs || {}), src } })
		if (root.pauseVideo && node.name === 'video') {
			const id = e.target.id || (node.attrs && node.attrs.id)
			if (!root._videos) root._videos = []
			for (let j = root._videos.length; j--; ) {
				if (root._videos[j].id !== id) {
					try {
						root._videos[j].pause()
					} catch (err) {}
				}
			}
			const exist = root._videos.find((v) => v.id === id)
			if (!exist && id) {
				const ctx = uni.createVideoContext(id, instance.proxy)
				ctx.id = id
				if (root.playbackRate && typeof ctx.playbackRate === 'function') {
					try {
						ctx.playbackRate(root.playbackRate)
					} catch (err) {}
				}
				root._videos.push(ctx)
			}
		}
	}

	function onMediaEvent(e) {
		const i = e.currentTarget.dataset.i
		const node = nodes.value[i]
		if (!root || !node) return
		root.$emit(e.type, {
			...(e.detail || {}),
			source: node.name,
			attrs: {
				...(node.attrs || {}),
				src: (node.src && node.src[ctrl[i] || 0]) || ''
			}
		})
	}

	function onMediaError(e) {
		const i = e.currentTarget.dataset.i
		const node = nodes.value[i]
		if (!node) return
		if (node.name === 'video' || node.name === 'audio') {
			let index = (ctrl[i] || 0) + 1
			if (node.src && index < node.src.length) {
				setCtrl(i, index)
				return
			}
		} else if (node.name === 'img') {
			// #ifdef H5
			if (props.opts.lazyLoad && !ctrl.load) return
			// #endif
			if (props.opts.errorImg) setCtrl(i, -1)
			root && root._imgLoaded()
		}
		root &&
			root.$emit('error', {
				source: node.name,
				attrs: node.attrs,
				errMsg: (e.detail && e.detail.errMsg) || ''
			})
	}

	function destroyAudio() {
		if (_audioTimer) {
			clearInterval(_audioTimer)
			_audioTimer = null
		}
		if (_audio) {
			try {
				_audio.stop()
				_audio.destroy()
			} catch (e) {}
			_audio = null
		}
	}

	function onAudioTap(e) {
		const i = e.currentTarget.dataset.i
		const node = nodes.value[i]
		const idx = ctrl[i] || 0
		const src = (node && node.src && node.src[idx]) || (node && node.attrs && node.attrs.src) || ''
		if (!src) return
		if (ctrl['a' + i] && _audio) {
			destroyAudio()
			setCtrl('a' + i, 0)
			return
		}
		destroyAudio()
		// 互斥：通知其它音频通过 root
		if (root && root.pauseMedia) root.pauseMedia()
		const audio = uni.createInnerAudioContext()
		_audio = audio
		audio.src = src
		audio.loop = !!(node.attrs && node.attrs.loop)
		audio.onPlay(() => {
			setCtrl('a' + i, 1)
			_audioTimer = setInterval(() => {
				try {
					setCtrl('t' + i, audio.currentTime || 0)
					setCtrl('a' + i, 2)
				} catch (err) {}
			}, 400)
			root && root.$emit('play', { source: 'audio', attrs: { ...(node.attrs || {}), src } })
		})
		audio.onEnded(() => {
			destroyAudio()
			setCtrl('a' + i, 0)
		})
		audio.onStop(() => {
			destroyAudio()
			setCtrl('a' + i, 0)
		})
		audio.onError(() => {
			if (node.src && idx + 1 < node.src.length) {
				setCtrl(i, idx + 1)
				setCtrl('a' + i, 0)
				destroyAudio()
				setTimeout(() => onAudioTap(e), 0)
				return
			}
			setCtrl('a' + i, 0)
			destroyAudio()
			root && root.$emit('error', { source: 'audio', attrs: node.attrs })
		})
		audio.play()
	}

	onMounted(() => {
		// #ifdef H5 || APP-PLUS
		if (props.opts.lazyLoad) {
			let i
			for (i = nodes.value.length; i--; ) {
				if (nodes.value[i] && nodes.value[i].name === 'img') break
			}
			if (i !== -1) {
				observer = uni.createIntersectionObserver(instance.proxy).relativeToViewport({
					top: 500,
					bottom: 500
				})
				observer.observe('._img', (res) => {
					if (res.intersectionRatio) {
						ctrl.load = 1
						for (let j = 0; j < nodes.value.length; j++) {
							const node = nodes.value[j]
							if (node && node.name === 'img' && node.attrs && !node.attrs.src && node.attrs['data-src']) {
								node.attrs.src = node.attrs['data-src']
							}
						}
						observer.disconnect()
					}
				})
			}
		}
		// #endif
	})

	onBeforeUnmount(() => {
		// #ifdef H5 || APP-PLUS
		if (observer) {
			try {
				observer.disconnect()
			} catch (e) {}
			observer = null
		}
		// #endif
		destroyAudio()
	})
</script>

<style>
	._block {
		display: block;
	}
	._img {
		max-width: 100%;
		-webkit-touch-callout: none;
	}
	._a {
		padding: 1px 0;
	}
	._hover {
		opacity: 0.7;
	}
	._table {
		width: 100%;
	}
	._caption {
		display: table-caption;
		text-align: center;
	}
	._thead,
	._tbody,
	._tfoot {
		display: table-row-group;
	}
	._tr {
		display: table-row;
	}
	._td,
	._th {
		display: table-cell;
		vertical-align: middle;
	}
	._th {
		font-weight: bold;
		text-align: center;
	}
	._li {
		display: list-item;
		margin-left: 1.2em;
	}
	._audio {
		display: flex;
		align-items: center;
		gap: 16rpx;
		padding: 16rpx 20rpx;
		margin: 12rpx 0;
		border-radius: 16rpx;
		background: #f5f6f8;
		color: #333;
	}
	._audio-poster {
		width: 72rpx;
		height: 72rpx;
		border-radius: 12rpx;
		background: #ddd;
	}
	._audio-body {
		flex: 1;
		min-width: 0;
	}
	._audio-icon {
		font-size: 28rpx;
		color: #2979ff;
		width: 48rpx;
		text-align: center;
	}
	._audio-name {
		display: block;
		font-size: 26rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	._audio-tip {
		display: block;
		font-size: 22rpx;
		color: #888;
		margin-top: 4rpx;
	}
</style>
