import { get } from "@/.cool";
import { proxy, value } from "./proxy";

export const dev = () => {
	const host = get(proxy, `${value}.target`) as string;

	let baseUrl: string;

	// #ifdef H5
	baseUrl = `/${value}`;
	// #endif

	// #ifndef H5
	baseUrl = host + "";
	// #endif

	return {
		host,
		baseUrl
	};
};
