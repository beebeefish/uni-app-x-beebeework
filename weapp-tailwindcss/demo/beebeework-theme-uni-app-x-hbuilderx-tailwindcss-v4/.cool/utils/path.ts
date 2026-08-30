/**
 * 获取文件名
 * @example filename("a/b/c.txt") // "c"
 */
export function filename(path: string): string {
	return basename(path.substring(0, path.lastIndexOf(".")));
}

/**
 * 获取路径的最后一部分
 * @example basename("a/b/c.txt") // "c.txt"
 */
export function basename(path: string): string {
	let index = path.lastIndexOf("/");
	index = index > -1 ? index : path.lastIndexOf("\\");
	if (index < 0) {
		return path;
	}
	return path.substring(index + 1);
}

/**
 * 获取文件扩展名
 * @example extname("a/b/c.txt") // "txt"
 */
export function extname(path: string): string {
	let index = path.lastIndexOf(".");
	if (index < 0) {
		return "";
	}
	return path.substring(index + 1);
}

/**
 * 首字母大写
 * @example firstUpperCase("useInfo") // "UseInfo"
 */
export function firstUpperCase(value: string): string {
	return value.charAt(0).toLocaleUpperCase() + value.slice(1);
}

/**
 * 获取地址栏参数
 * @example getUrlParam("a") // "1"
 */
export function getUrlParam(name: string): string | null {
	// #ifdef H5
	const params = new URLSearchParams(window.location.search);
	const value = params.get(name);
	return value !== null ? decodeURIComponent(value) : null;
	// #endif
}

/**
 * 连接路径
 * @example pathJoin("https://www.baidu.com/", "/a/b/c.txt") // "https://www.baidu.com/a/b/c.txt"
 */
export function pathJoin(...parts: string[]): string {
	return parts.map((part) => part.replace(/(^\/+|\/+$)/g, "")).join("/");
}
