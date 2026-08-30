/**
 * 判断 Tailwind class 字符串中是否包含文本颜色类（如 text-red, text-red-500, text-sky 等）
 * @param className 传入的 class 字符串
 * @returns 是否包含文本颜色类
 */
export function hasTextColor(className: string): boolean {
	if (className == "") return false;

	const regex =
		/\btext-(primary|surface|red|blue|green|yellow|purple|pink|indigo|gray|grey|black|white|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose|slate|zinc|neutral|stone)(?:-\d+)?\b/;

	return regex.test(className);
}

/**
 * 判断 Tailwind class 字符串中是否包含字体大小类
 * 支持如 text-xs, text-sm, text-base, text-lg, text-xl, 以及 text-[22px]、text-[22rpx] 等自定义写法
 * @param className 传入的 class 字符串
 * @returns 是否包含字体大小类
 */
export function hasTextSize(className: string): boolean {
	if (className == "") return false;

	const regex =
		/\btext-(xs|sm|md|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|\[\d+[a-zA-Z%]*\])\b/;

	return regex.test(className);
}
