import { reactive } from "vue";
import { request } from "../service";
import { forInObject, isNull, parse } from "../utils";

// 字典项类型定义
export type DictItem = {
	id: number; // 字典项ID
	typeId: number; // 字典类型ID
	label: string; // 显示标签
	name: string; // 可选名称
	value: any; // 字典项值
	orderNum: number; // 排序号
	parentId?: number | null; // 父级ID，可选
};

// 字典数据类型定义
export type DictData = {
	key: string; // 字典key
	list: DictItem[]; // 字典项列表
};

// 字典管理类
export class Dict {
	private data: DictData[] = reactive([]); // 存储所有字典数据

	constructor() {}

	/**
	 * 获取指定key的字典数据
	 * @param key 字典key
	 * @returns 字典数据
	 */
	find(key: string) {
		return this.data.find((e) => e.key == key);
	}

	/**
	 * 获取指定key的字典项列表
	 * @param key 字典key
	 * @returns 字典项数组
	 */
	get(key: string): DictItem[] {
		return this.find(key)?.list ?? new Array<DictItem>();
	}

	/**
	 * 获取指定key和value的字典项
	 * @param key 字典key
	 * @param value 字典项值
	 * @returns 字典项或null
	 */
	getItem(key: string, value: any): DictItem | null {
		const item = this.get(key).find((e) => e.value == value);

		if (isNull(item)) {
			return null;
		}

		return item!;
	}

	/**
	 * 获取指定key和多个value的字典项数组
	 * @param key 字典key
	 * @param values 字典项值数组
	 * @returns 字典项数组
	 */
	getItems(key: string, values: any[]): DictItem[] {
		return values.map((e) => this.getItem(key, e)).filter((e) => !isNull(e)) as DictItem[];
	}

	/**
	 * 获取指定key和value的字典项的label
	 * @param key 字典key
	 * @param value 字典项值
	 * @returns 字典项label字符串
	 */
	getItemLabel(key: string, value: any): string {
		const item = this.getItem(key, value);

		if (isNull(item) || isNull(item?.label)) {
			return "";
		}

		return item!.label;
	}

	/**
	 * 刷新字典数据
	 * @param types 可选，指定需要刷新的字典key数组
	 */
	async refresh(types?: string[] | null): Promise<void> {
		const res = await request({
			url: "/app/dict/info/data",
			method: "POST",
			data: { types }
		});

		if (res == null) {
			return;
		}

		// 遍历返回的字典数据
		forInObject(res, (arr, key) => {
			let list: DictItem[] = [];

			(arr as UTSJSONObject[]).forEach((e) => {
				e["label"] = e["name"];
				const d = parse<DictItem>(e);

				if (d != null) {
					list.push(d);
				}
			});

			const item = this.find(key);

			// 如果不存在则新增，否则更新
			if (isNull(item)) {
				this.data.push({
					key,
					list
				});
			} else {
				item!.list = list;
			}
		});

		// #ifdef H5
		console.log("[DICT]", this.data);
		// #endif
	}
}

// 单例字典对象
export const dict = new Dict();
