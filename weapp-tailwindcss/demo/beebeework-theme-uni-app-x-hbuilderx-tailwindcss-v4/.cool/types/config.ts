// 微信配置
export type WxConfig = {
	debug: boolean;
};

// 应用配置
export type Config = {
	name: string; // 应用名称
	locale?: string; // 应用语言
	website: string; // 官网地址
	host: string; // 主机地址
	baseUrl: string; // 基础路径
	showDarkButton: boolean; // 是否显示暗色模式切换按钮
	isCustomTabBar: boolean; // 是否自定义 tabBar
	backTop: boolean; // 是否显示回到顶部按钮
	wx: WxConfig; // 微信配置
};

// 插件配置
export type PluginConfig = {
	options?: UTSJSONObject;
	install(app: VueApp): UTSJSONObject | void;
};
