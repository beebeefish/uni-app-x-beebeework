/**
 * 将rpx转换为px
 * @param rpx - 输入值
 * @returns number - 返回对应的px值
 */
export const rpx2px = (rpx: number): number => {
	let px: number;

	// #ifdef MP
	px = rpx / (750 / uni.getWindowInfo().windowWidth);
	// #endif

	// #ifndef MP
	px = uni.rpx2px(rpx);
	// #endif

	return px;
};

/**
 * 将px转换为rpx
 * @param px - 输入值
 * @returns number - 返回对应的rpx值
 */
export const px2rpx = (px: number): number => {
	return px / rpx2px(1);
};

/**
 * 将数值或字符串转换为对应的单位
 * @param val - 输入值，例如 10、"10rpx"、"10px"
 * @returns string - 返回对应的单位
 */
export const getUnit = (val: string | number | null): string | null => {
	if (val != null) {
		if (typeof val == "string") {
			const num = parseFloat(val);
			const unit = val.replace(`${num}`, "");

			if (unit == "rpx") {
				return `${rpx2px(num)}px`;
			} else if (unit == "%") {
				return `${num}%`;
			} else {
				return `${num}px`;
			}
		} else {
			return `${val}px`;
		}
	}

	return null;
};

/**
 * 示例: 获取数值部分
 * @example
 * getNum("10rpx") // 返回 10
 * getNum("10px")  // 返回 10
 * getNum("10")    // 返回 10
 * getNum("-5.5px") // 返回 -5.5
 * @param val - 输入值，例如 "10rpx"、"10px"、"10"
 * @returns number - 返回提取的数值
 */
export const getNum = (val: string): number => {
	// 使用正则提取数字部分，支持小数和负数
	const match = val.match(/-?\d+(\.\d+)?/);
	return match != null ? parseFloat(match[0] ?? "0") : 0;
};
