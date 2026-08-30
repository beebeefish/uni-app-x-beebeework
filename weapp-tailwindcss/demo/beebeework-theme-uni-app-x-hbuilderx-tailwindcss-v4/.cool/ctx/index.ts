import { isArray, parse } from "../utils";

type Page = {
    path: string;
    style?: UTSJSONObject;
    meta?: UTSJSONObject;
};

type SubPackage = {
    root: string;
    pages: Page[];
};

export type TabBarItem = {
    text?: string;
    pagePath: string;
    iconPath?: string;
    selectedIconPath?: string;
    visible?: boolean;
};

export type TabBar = {
    custom?: boolean;
    color?: string;
    selectedColor?: string;
    backgroundColor?: string;
    borderStyle?: string;
    blurEffect?: "dark" | "extralight" | "light" | "none";
    list?: TabBarItem[];
    position?: "top" | "bottom";
    fontSize?: string;
    iconWidth?: string;
    spacing?: string;
    height?: string;
    backgroundImage?: string;
    backgroundRepeat?: "repeat" | "repeat-x" | "repeat-y" | "no-repeat";
    redDotColor?: string;
};

export type Ctx = {
    appid: string;
    globalStyle: UTSJSONObject;
    pages: Page[];
    uniIdRouter: UTSJSONObject;
    theme: UTSJSONObject;
    tabBar: TabBar;
    subPackages: SubPackage[];
    color: UTSJSONObject;
};

// 初始化 ctx 对象，不可修改！！（添加默认结构兜底，防止属性为 undefined）
export const ctx = parse<Ctx>({
    pages: [],
    subPackages: [],
    tabBar: { list: [] }
} as any)!;

console.log(ctx);

// PAGES 用于存储所有页面的路径及样式信息（使用 ?? [] 绝对安全防护，杜绝 undefined is not iterable 报错）
export let PAGES: Page[] = [...(ctx?.pages ?? [])];

// 遍历 ctx.subPackages，将所有子包下的页面信息合并到 PAGES 中
if (isArray(ctx?.subPackages)) {
    ctx.subPackages.forEach((a) => {
        if (a && isArray(a.pages)) {
            a.pages.forEach((b) => {
                PAGES.push({
                    path: a.root + "/" + b.path, // 拼接子包根路径和页面路径
                    style: b.style,
                    meta: b.meta
                });
            });
        }
    });
}

// 确保每个页面路径都以 "/" 开头，符合 uni-app x 规范
PAGES.forEach((e) => {
    if (e && e.path && !e.path.startsWith("/")) {
        e.path = "/" + e.path;
    }
});

// TABS 用于存储 tabBar 配置项
export let TABS: TabBarItem[] = [];

// 如果 tabBar 配置存在且列表不为空，则初始化 TABS
if (ctx?.tabBar && isArray(ctx.tabBar.list)) {
    TABS = ctx.tabBar.list;

    // 确保每个 tabBar 页面的路径都以 "/" 开头
    TABS.forEach((e) => {
        if (e && e.pagePath && !e.pagePath.startsWith("/")) {
            e.pagePath = "/" + e.pagePath;
        }
    });
}