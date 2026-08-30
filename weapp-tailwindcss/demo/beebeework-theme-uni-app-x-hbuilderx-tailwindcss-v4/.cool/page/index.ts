import { router } from "../router";
import { t } from "../locale";

// 更新标题
export function updateTitle() {
	const style = router.route()?.style;

	if (style != null) {
		if (style.navigationBarTitleText != null) {
			uni.setNavigationBarTitle({
				title: t(style.navigationBarTitleText as string)
			});
		}
	}
}
