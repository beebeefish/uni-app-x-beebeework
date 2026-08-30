import { isDev, ignoreTokens, config } from "@/config";
import { locale, t } from "../locale";
import { isNull, isObject, parse, storage } from "../utils";
import { useStore } from "../store";

// 请求参数类型定义
export type RequestOptions = {
	url: string; // 请求地址
	method?: RequestMethod; // 请求方法
	data?: any; // 请求体数据
	params?: any; // URL参数
	header?: any; // 请求头
	timeout?: number; // 超时时间
	withCredentials?: boolean; // 是否携带凭证
	firstIpv4?: boolean; // 是否优先使用IPv4
	enableChunked?: boolean; // 是否启用分块传输
};

// 响应数据类型定义
export type Response = {
	code?: number;
	message?: string;
	data?: any;
};

// 请求队列（用于等待token刷新后继续请求）
let requests: ((token: string) => void)[] = [];

// 标记token是否正在刷新
let isRefreshing = false;

// 判断当前url是否忽略token校验
const isIgnoreToken = (url: string) => {
	return ignoreTokens.some((e) => {
		const pattern = e.replace(/\*/g, ".*");
		return new RegExp(pattern).test(url);
	});
};

/**
 * 通用请求方法
 * @param options 请求参数
 * @returns Promise<T>
 */
export function request(options: RequestOptions): Promise<any | null> {
	let { url, method = "GET", data = {}, header = {}, timeout = 60000 } = options;

	const { user } = useStore();

	// 开发环境下打印请求信息
	if (isDev) {
		console.log(`[${method}] ${url}`);
	}

	// 拼接基础url
	if (!url.startsWith("http")) {
		url = config.baseUrl + url;
	}

	// 获取当前token
	let Authorization: string | null = user.token;

	// 如果是忽略token的接口，则不携带token
	if (isIgnoreToken(url)) {
		Authorization = null;
	}

	return new Promise((resolve, reject) => {
		// 发起请求的实际函数
		const next = () => {
			uni.request({
				url,
				method,
				data,
				header: {
					Authorization,
					language: locale.value,
					...(header as UTSJSONObject)
				},
				timeout,

				success(res) {
					// 401 无权限
					if (res.statusCode == 401) {
						user.logout();
						reject({ message: t("无权限") } as Response);
					}

					// 502 服务异常
					else if (res.statusCode == 502) {
						reject({
							message: t("服务异常")
						} as Response);
					}

					// 404 未找到
					else if (res.statusCode == 404) {
						return reject({
							message: `[404] ${url}`
						} as Response);
					}

					// 200 正常响应
					else if (res.statusCode == 200) {
						if (res.data == null) {
							resolve(null);
						} else if (!isObject(res.data as any)) {
							resolve(res.data);
						} else {
							// 解析响应数据
							const { code, message, data } = parse<Response>(
								res.data ?? { code: 0 }
							)!;

							switch (code) {
								case 1000:
									resolve(data);
									break;
								default:
									reject({ message, code } as Response);
									break;
							}
						}
					} else {
						reject({ message: t("服务异常") } as Response);
					}
				},

				// 网络请求失败
				fail(err) {
					reject({ message: err.errMsg } as Response);
				}
			});
		};

		// 非刷新token接口才进行token有效性校验
		if (!options.url.includes("/refreshToken")) {
			if (!isNull(Authorization)) {
				// 判断token是否过期
				if (storage.isExpired("token")) {
					// 判断refreshToken是否过期
					if (storage.isExpired("refreshToken")) {
						// 刷新token也过期，直接退出登录
						user.logout();
						return;
					}

					// 如果当前没有在刷新token，则发起刷新
					if (!isRefreshing) {
						isRefreshing = true;
						user.refreshToken()
							.then((token) => {
								// 刷新成功后，执行队列中的请求
								requests.forEach((cb) => cb(token));
								requests = [];
								isRefreshing = false;
							})
							.catch((err) => {
								reject(err);
								user.logout();
							});
					}

					// 将当前请求加入队列，等待token刷新后再执行
					new Promise((resolve) => {
						requests.push((token: string) => {
							// 重新设置token
							Authorization = token;
							next();
							resolve(true);
						});
					});
					// 此处return，等待token刷新
					return;
				}
			}
		}

		// token有效，直接发起请求
		next();
	});
}
