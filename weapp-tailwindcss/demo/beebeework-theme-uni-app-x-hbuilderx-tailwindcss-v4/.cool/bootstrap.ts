import { watch } from "vue";
import { scroller } from "./scroller";
import { initTheme, setH5 } from "./theme";
import { locale } from "./locale";
import { updateTitle } from "./page";

export function coolPlugin(app: VueApp) {
	app.mixin({
		onPageScroll(e) {
			scroller.emit(e.scrollTop);
		},
		onShow() {
			// 更新标题
			updateTitle();

			// #ifdef H5
			setTimeout(() => {
				setH5();
			}, 0);
			// #endif

			// 触发 onShow 事件
			uni.$emit("page.onShow");
		},
		onLoad() {
			// 监听语言切换，更新标题
			watch(locale, () => {
				updateTitle();
			});

			// 触发 onLoad 事件
			uni.$emit("page.onLoad");
		},
		onHide() {
			// 触发 onHide 事件
			uni.$emit("page.onHide");
		}
	});

	// 初始化应用主题
	initTheme();
}
