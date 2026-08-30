import { reactive } from "vue";
import type { Config } from "./types";

export const config = reactive<Config>({
	fontSize: null,
	zIndex: 600,
	startDate: "2000-01-01 00:00:00",
	endDate: "2050-12-31 23:59:59"
});
