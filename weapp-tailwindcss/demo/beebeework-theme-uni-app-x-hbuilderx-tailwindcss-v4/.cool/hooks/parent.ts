import { getCurrentInstance } from "vue";

/**
 * 获取父组件
 * @param name 组件名称
 * @example useParent<ClFormComponentPublicInstance>("cl-form")
 * @returns 父组件
 */
export function useParent<T>(name: string): T | null {
	const { proxy } = getCurrentInstance()!;

	let p = proxy?.$parent;

	while (p != null) {
		if (p.$options.name == name) {
			return p as T | null;
		}
		p = p.$parent;
	}

	return p as T | null;
}
