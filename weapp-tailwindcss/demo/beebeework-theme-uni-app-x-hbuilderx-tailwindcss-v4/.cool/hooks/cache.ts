import { reactive, watch } from "vue";
import { isDark } from "../theme";
import { router } from "../router";

type CacheData = {
	key: number;
};

type UseCache = {
	cache: CacheData;
};

export const useCache = (source: () => any[]): UseCache => {
	const id = router.path();

	const cache = reactive<CacheData>({
		key: 0
	});

	const update = () => {
		if (id == router.path()) {
			cache.key++;
		}
	};

	watch(source, () => {
		update();
	});

	watch(isDark, () => {
		update();
	});

	return {
		cache
	};
};
