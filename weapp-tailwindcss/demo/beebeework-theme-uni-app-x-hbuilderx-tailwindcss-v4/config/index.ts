import { isMp, type Config } from "@/.cool";
import { dev } from "./dev";
import { prod } from "./prod";

// 判断当前是否为开发环境
export const isDev = process.env.NODE_ENV == "development";

// 忽略 token 校验的接口路径
export const ignoreTokens: string[] = [];

// 根据环境导出最终配置
export const config = {
	name: "Cool Unix",
	locale: "zh-tw",
	website: "https://cool-js.com",
	showDarkButton: isMp() ? false : true,
	isCustomTabBar: true,
	backTop: true,
	wx: {
		debug: false
	},
	...(isDev ? dev() : prod())
} as Config;
