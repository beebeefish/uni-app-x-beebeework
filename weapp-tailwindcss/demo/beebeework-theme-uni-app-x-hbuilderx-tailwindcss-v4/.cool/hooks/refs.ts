import { reactive } from "vue";
import { isNull } from "../utils";

// #ifdef APP
// @ts-ignore
type Instance = ComponentPublicInstance | null;
// #endif

// #ifndef APP
// @ts-ignore
type Instance = any;
// #endif

/**
 * Refs 类用于管理组件引用，便于在组合式 API 中获取、操作子组件实例。
 */
class Refs {
	// 存储所有 ref 的响应式对象，key 为 ref 名称，value 为组件实例
	data = reactive({} as UTSJSONObject);

	/**
	 * 生成 ref 绑定函数，用于在模板中设置 ref。
	 * @param name ref 名称
	 * @returns 绑定函数 (el: Instance) => void
	 */
	set(name: string) {
		return (el: Instance) => {
			this.data[name] = el;
		};
	}

	/**
	 * 获取指定名称的组件实例
	 * @param name ref 名称
	 * @returns 组件实例或 null
	 */
	get(name: string): Instance {
		const d = this.data[name] as ComponentPublicInstance;

		if (isNull(d)) {
			return null;
		}

		return d;
	}

	/**
	 * 获取组件实例暴露的属性或方法（兼容不同平台）
	 * @param name ref 名称
	 * @param key 暴露的属性名
	 * @returns 属性值或 null
	 */
	getExposed<T>(name: string, key: string): T | null {
		// #ifdef APP-ANDROID
		const d = this.get(name);

		if (isNull(d)) {
			return null;
		}

		// 安卓平台下，$exposed 为 Map<string, any>
		const ex = d!.$exposed as Map<string, any>;

		if (isNull(ex)) {
			return null;
		}

		return ex[key] as T | null;
		// #endif

		// #ifndef APP-ANDROID
		// 其他平台直接通过属性访问
		return this.get(name)?.[key] as T;
		// #endif
	}

	/**
	 * 调用组件实例暴露的方法，并返回结果
	 * @param name ref 名称
	 * @param method 方法名
	 * @param data 传递的数据
	 * @returns 方法返回值
	 */
	call<T>(name: string, method: string, data: UTSJSONObject | null = null): T {
		return this.get(name)!.$callMethod(method, data) as T;
	}

	/**
	 * 调用组件实例暴露的方法，无返回值
	 * @param name ref 名称
	 * @param method 方法名
	 * @param data 传递的数据
	 */
	callMethod(name: string, method: string, data: UTSJSONObject | null = null): void {
		this.get(name)!.$callMethod(method, data);
	}

	/**
	 * 调用组件的 open 方法，常用于弹窗、抽屉等组件
	 * @param name ref 名称
	 * @param data 传递的数据
	 */
	open(name: string, data: UTSJSONObject | null = null) {
		this.callMethod(name, "open", data);
	}

	/**
	 * 调用组件的 close 方法，常用于弹窗、抽屉等组件
	 * @param name ref 名称
	 */
	close(name: string) {
		return this.callMethod(name, "close");
	}
}

/**
 * useRefs 组合式函数，返回 Refs 实例
 * @returns Refs 实例
 */
export function useRefs(): Refs {
	return new Refs();
}
