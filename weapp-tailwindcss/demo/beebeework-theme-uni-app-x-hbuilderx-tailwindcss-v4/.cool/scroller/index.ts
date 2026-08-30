import { router } from "../router";

class Scroller {
	list: Map<string, ((top: number) => void)[]> = new Map();

	// 触发滚动
	emit(top: number) {
		const cbs = this.list.get(router.path()) ?? [];
		cbs.forEach((cb) => {
			cb(top);
		});
	}

	// 监听页面滚动
	on(callback: (top: number) => void) {
		const path = router.path();
		const cbs = this.list.get(path) ?? [];
		cbs.push(callback);
		this.list.set(path, cbs);
	}

	// 取消监听页面滚动
	off = (callback: (top: number) => void) => {
		const path = router.path();
		const cbs = this.list.get(path) ?? [];
		this.list.set(
			path,
			cbs.filter((cb) => cb != callback)
		);
	};
}

export const scroller = new Scroller();
