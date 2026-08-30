import { computed, ref } from "vue";
import { assign, parse } from "../utils";
import { useListView, type ClListViewItem } from "@/uni_modules/cool-ui";

// 分页参数类型
type Pagination = {
	page: number; // 当前页码
	size: number; // 每页数量
	total: number; // 总数量
};

// 分页响应数据类型
type PagerResponse = {
	list: UTSJSONObject[]; // 列表数据
	pagination: Pagination; // 分页信息
};

// 分页回调函数类型
type PagerCallback = (params: UTSJSONObject, ctx: Pager) => void | Promise<void>;

// 分页器类
export class Pager {
	public page = 1; // 当前页码
	public size = 20; // 每页数量
	public total = 0; // 总数量
	public list = ref<UTSJSONObject[]>([]); // 列表数据
	public loading = ref(false); // 加载状态
	public refreshing = ref(false); // 刷新状态
	public finished = ref(false); // 是否加载完成
	public params = {} as UTSJSONObject; // 请求参数
	public cb: PagerCallback | null = null; // 回调函数

	// 构造函数
	constructor(cb: PagerCallback) {
		this.cb = cb;
	}

	// 完成加载
	done() {
		this.loading.value = false;
	}

	// 清空数据
	clear() {
		this.list.value = [];
		this.finished.value = false;
		this.refreshing.value = false;
		this.loading.value = false;
	}

	// 渲染数据
	public render = (res: any) => {
		const { list, pagination } = parse<PagerResponse>(res)!;

		// 更新分页信息
		this.page = pagination.page;
		this.size = pagination.size;
		this.total = pagination.total;

		// 更新列表数据
		if (this.params.page == 1) {
			this.list.value = [...list];
		} else {
			this.list.value.push(...list);
		}

		// 更新加载完成状态
		this.finished.value = this.list.value.length >= this.total;

		// 完成加载
		this.done();
	};

	// 刷新数据
	public refresh = async (params: UTSJSONObject) => {
		// 合并参数
		this.params = assign(this.params, params);

		// 构建请求参数
		const data = {
			page: this.page,
			size: this.size,
			...this.params
		};

		// 开始加载
		this.loading.value = true;

		// 发起请求
		await this.cb!(data, this);
	};

	// 加载更多数据
	public loadMore = () => {
		if (this.loading.value || this.finished.value) {
			return;
		}

		this.refresh({
			page: this.page + 1
		});
	};

	// 列表视图数据
	public listView = computed<ClListViewItem[]>(() => {
		return useListView(this.list.value);
	});
}

// 创建分页器实例
export const usePager = (cb: PagerCallback): Pager => {
	return new Pager(cb);
};
