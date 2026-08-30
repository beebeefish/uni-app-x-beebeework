/**
 * 检查是否为小程序环境
 * @returns 是否为小程序环境
 */
export const isMp = (): boolean => {
	// #ifdef MP
	return true;
	// #endif

	return false;
};

/**
 * 检查是否为App环境
 * @returns 是否为App环境
 */
export const isApp = (): boolean => {
	// #ifdef APP
	return true;
	// #endif

	return false;
};

/**
 * 检查是否为App-IOS环境
 * @returns 是否为App-IOS环境
 */
export const isAppIOS = (): boolean => {
	// #ifdef APP-IOS
	return true;
	// #endif
	return false;
};

/**
 * 检查是否为App-Android环境
 * @returns 是否为App-Android环境
 */
export const isAppAndroid = (): boolean => {
	// #ifdef APP-ANDROID
	return true;
	// #endif
	return false;
};

/**
 * 检查是否为H5环境
 * @returns 是否为H5环境
 */
export const isH5 = (): boolean => {
	// #ifdef H5
	return true;
	// #endif

	return false;
};

/**
 * 检查是否为鸿蒙环境
 * @returns 是否为鸿蒙环境
 */
export const isHarmony = (): boolean => {
	// #ifdef APP-HARMONY
	return true;
	// #endif

	return false;
};

/**
 * 获取设备像素比
 * @returns 设备像素比
 */
export const getDevicePixelRatio = (): number => {
	const dpr = uni.getDeviceInfo().devicePixelRatio ?? 1;

	// #ifdef  MP
	// 微信小程序高清处理
	return 3;
	// #endif

	return dpr;
};
