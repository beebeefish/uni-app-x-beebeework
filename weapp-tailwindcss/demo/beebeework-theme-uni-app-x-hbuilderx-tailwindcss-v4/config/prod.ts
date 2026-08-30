import { get } from "@/.cool";
import { proxy } from "./proxy";

export const prod = () => {
	const host = get(proxy, `prod.target`) as string;

	let baseUrl: string;

	// #ifdef H5
	baseUrl = host + "/api";
	// #endif

	// #ifndef H5
	baseUrl = host + "/api";
	// #endif

	return {
		host,
		baseUrl
	};
};
