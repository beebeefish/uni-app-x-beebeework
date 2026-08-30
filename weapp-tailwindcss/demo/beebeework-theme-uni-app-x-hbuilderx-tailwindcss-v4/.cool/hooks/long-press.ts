import { onUnmounted, ref, type Ref } from "vue";

// 长按触发延迟时间,单位毫秒
const DELAY = 500;
// 长按重复执行间隔时间,单位毫秒
const REPEAT = 100;

/**
 * 长按操作钩子函数返回类型
 */
type UseLongPress = {
	// 开始长按
	start: (cb: () => void) => void;
	// 停止长按
	stop: () => void;
	// 清除定时器
	clear: () => void;
	// 是否正在长按中
	isPressing: Ref<boolean>;
};

/**
 * 长按操作钩子函数
 * 支持长按持续触发,可用于数字输入框等需要连续操作的场景
 */
export const useLongPress = (): UseLongPress => {
	// 是否正在长按中
	const isPressing = ref(false);
	// 长按延迟定时器
	let pressTimer: number = 0;
	// 重复执行定时器
	let repeatTimer: number = 0;

	/**
	 * 清除所有定时器
	 * 重置长按状态
	 */
	const clear = () => {
		// 清除长按延迟定时器
		if (pressTimer != 0) {
			clearTimeout(pressTimer);
			pressTimer = 0;
		}
		// 清除重复执行定时器
		if (repeatTimer != 0) {
			clearInterval(repeatTimer);
			repeatTimer = 0;
		}
		// 重置长按状态
		isPressing.value = false;
	};

	/**
	 * 开始长按操作
	 * @param cb 长按时重复执行的回调函数
	 */
	const start = (cb: () => void) => {
		// 清除已有定时器
		clear();

		// 立即执行一次回调
		cb();

		// 延迟500ms后开始长按
		// @ts-ignore
		pressTimer = setTimeout(() => {
			// 震动
			uni.$emit("cool.vibrate");

			// 设置长按状态
			isPressing.value = true;
			// 每100ms重复执行回调
			// @ts-ignore
			repeatTimer = setInterval(() => {
				cb();
			}, REPEAT);
		}, DELAY);
	};

	/**
	 * 停止长按操作
	 * 清除定时器并重置状态
	 */
	const stop = () => {
		clear();
	};

	// 组件卸载时清理定时器
	onUnmounted(() => {
		clear();
	});

	return {
		start,
		stop,
		clear,
		isPressing
	};
};
