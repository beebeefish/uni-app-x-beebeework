import { router, scroller, useParent } from "@/.cool";

class Page {
	pageRef: ClPageComponentPublicInstance | null = null;

	constructor() {
		this.pageRef = useParent<ClPageComponentPublicInstance>("cl-page");
	}

	/**
	 * 获取页面路径
	 * @returns 页面路径
	 */
	path = () => {
		return router.path();
	};

	/**
	 * 获取滚动位置
	 * @returns 滚动位置
	 */
	getScrollTop = (): number => {
		return this.pageRef!.scrollTop as number;
	};

	/**
	 * 滚动到指定位置
	 * @param top 滚动位置
	 */
	scrollTo = (top: number) => {
		this.pageRef!.scrollTo(top);
	};

	/**
	 * 回到顶部
	 */
	scrollToTop = () => {
		this.pageRef!.scrollToTop();
	};

	/**
	 * 监听页面滚动
	 * @param callback 回调函数
	 */
	onScroll = (callback: (top: number) => void) => {
		scroller.on(callback);
	};

	/**
	 * 取消监听页面滚动
	 * @param callback 回调函数
	 */
	offScroll = (callback: (top: number) => void) => {
		scroller.off(callback);
	};
}

export function usePage(): Page {
	return new Page();
}
