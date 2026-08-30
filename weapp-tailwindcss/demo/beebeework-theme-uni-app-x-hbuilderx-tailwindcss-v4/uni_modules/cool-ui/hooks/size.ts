import { computed, type ComputedRef } from "vue";
import { config } from "../config";

/**
 * 字号管理类
 * 用于处理文本大小的缩放和样式
 */
class Size {
	// 预设的字号类名
	public names = [
		"text-xs",
		"text-sm",
		"text-md",
		"text-lg",
		"text-xl",
		"text-2xl",
		"text-3xl",
		"text-4xl",
		"text-5xl",
		"text-6xl",
		"text-7xl",
		"text-8xl",
		"text-9xl"
	];

	// 对应的字号大小
	public sizes = [12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72, 96, 128];

	// 对应的行高
	public lineHeights = [16, 20, 24, 28, 32, 36, 40, 1, 1, 1, 1, 1, 1];

	// 原始类名
	public className: ComputedRef<string> = computed(() => "");

	// 计算后的类名
	public ptClassName: ComputedRef<string>;

	constructor(cb: (() => string) | null) {
		this.className = computed(cb ?? (() => ""));

		// 根据全局字号配置动态计算类名
		this.ptClassName = computed(() => {
			if (config.fontSize == null) {
				return this.className.value;
			}

			const name = this.names[this.getIndex()];
			return this.className.value.replace(`-important-${name}`, "").replace(name, "");
		});
	}

	/**
	 * 获取全局字号缩放比例
	 */
	getScale = () => {
		return config.fontSize ?? 1;
	};

	/**
	 * 根据缩放比例计算值
	 * @param val - 需要转换的值
	 * @returns 转换后的值
	 */
	toScale = (val: number) => {
		return this.getScale() * val;
	};

	/**
	 * 获取当前字号在预设中的索引
	 */
	getIndex = () => {
		let index = this.names.findIndex((name) => {
			if (this.className.value.includes(name)) {
				return true;
			}

			return false;
		});

		if (index < 0) {
			index = 1;
		}

		return index;
	};
}

/**
 * 字号管理Hook
 * @param className - 类名
 */
export function useSize(cb: (() => string) | null = null): Size {
	return new Size(cb);
}
