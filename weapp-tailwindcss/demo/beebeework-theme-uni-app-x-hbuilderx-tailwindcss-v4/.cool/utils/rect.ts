import { config } from "@/config";
import { router } from "../router";
import { isH5, isHarmony } from "./device";
import { ctx } from "../ctx";
import { getNum } from "./unit";

/**
 * 是否需要计算 tabBar 高度
 * @returns boolean
 */
export function hasCustomTabBar() {
	if (router.isTabPage()) {
		if (isHarmony()) {
			return false;
		}

		return config.isCustomTabBar || isH5();
	}

	return false;
}

/**
 * 是否存在自定义 topbar
 * @returns boolean
 */
export function hasCustomTopbar() {
	return router.route()?.isCustomNavbar ?? false;
}

/**
 * 获取安全区域高度
 * @param type 类型
 * @returns 安全区域高度
 */
export function getSafeAreaHeight(type: "top" | "bottom") {
	const { safeAreaInsets } = uni.getWindowInfo();

	let h: number;

	if (type == "top") {
		h = safeAreaInsets.top;
	} else {
		h = safeAreaInsets.bottom;

		// #ifdef APP-ANDROID
		if (h == 0) {
			h = 16;
		}
		// #endif
	}

	return h;
}

/**
 * 获取 tabBar 高度
 * @returns tabBar 高度
 */
export function getTabBarHeight() {
	let h = ctx.tabBar.height == null ? 50 : getNum(ctx.tabBar.height!);

	if (hasCustomTabBar()) {
		h += getSafeAreaHeight("bottom");
	}

	return h;
}
