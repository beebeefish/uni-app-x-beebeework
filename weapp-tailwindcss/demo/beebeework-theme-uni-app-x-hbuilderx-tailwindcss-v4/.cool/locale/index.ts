import { isNull, forInObject, storage } from "../utils";
import { ref } from "vue";

// 解析语言包
function parse(val: string[][]) {
	const isCustom = val.length == 1 && val[0].length == 1;

	if (!isCustom) {
		return val;
	}

	return val[0][0].split("<__&__>").map((e) => e.split("<__=__>"));
}

// 语言包映射对象
const messages = {};

// 当前语言
export const locale = ref<string>("");

// 默认语言
export const defaultLocale = ref<string>("none");

// 设置当前语言
export const setLocale = (value: string) => {
	locale.value = value;

	// 设置缓存
	storage.set("locale", value, 0);
};

// 获取当前语言
export const getLocale = (): string => {
	let value = storage.get("locale") as string;

	if (value == "") {
		if (defaultLocale.value != "none") {
			value = defaultLocale.value;
		} else {
			// #ifdef APP
			// @ts-ignore
			value = uni.getDeviceInfo().osLanguage as string;
			// #endif

			// #ifndef APP
			value = uni.getLocale();
			// #endif
		}
	}

	return value;
};

// 追加数据
export const appendLocale = (name: string, data: string[][]) => {
	if (messages[name] == null) {
		messages[name] = [] as string[][];
	}

	(messages[name] as string[][]).unshift(...parse(data));
};

// 不带参数的翻译方法
export const t = (name: string) => {
	let data = messages[locale.value] as string[][] | null;

	if (data == null) {
		return name;
	}

	let text = data.find((e) => e[0] == name)?.[1];

	if (text == null || text == "") {
		text = name;
	}

	return text;
};

// 带参数的翻译方法
export const $t = (name: string, data: any) => {
	let text = t(name);

	// 替换参数
	if (!isNull(data)) {
		forInObject(data, (value, key) => {
			if (typeof value === "number") {
				value = value.toString();
			}

			text = text.replaceAll(`{${key}}`, value as string);
		});
	}

	return text;
};

// 初始化语言设置
export function initLocale(value: string) {
	// 设置默认语言
	defaultLocale.value = value;

	// 设置当前语言
	locale.value = getLocale();

	// #ifndef APP
	// 监听语言切换事件，自动更新 locale
	uni.onLocaleChange((res) => {
		setLocale(res.locale!);
	});
	// #endif
}
