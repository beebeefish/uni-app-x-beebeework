import { ref } from "vue";
import { assign, getUrlParam, storage } from "../utils";
import { request } from "../service";
import { t } from "../locale";
import { config } from "@/config";

// #ifdef H5
import wx from "weixin-js-sdk";
// #endif

// 微信配置类型
type WxConfig = {
	appId: string;
};

// 微信相关功能封装类
export class Wx {
	// 微信登录code
	code = ref("");

	/**
	 * 获取微信登录code
	 */
	async getCode(): Promise<string> {
		return new Promise((resolve) => {
			// #ifdef MP-WEIXIN
			uni.login({
				provider: "weixin",
				success: (res) => {
					this.code.value = res.code;
					resolve(res.code);
				}
			});
			// #endif

			// #ifndef MP-WEIXIN
			resolve("");
			// #endif
		});
	}

	// #ifdef H5
	// 公众号配置
	mpConfig: WxConfig = {
		appId: ""
	};

	/**
	 * 判断当前是否为微信浏览器
	 */
	isWxBrowser() {
		const ua: string = window.navigator.userAgent.toLowerCase();
		if (ua.match(/MicroMessenger/i) != null) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 获取公众号配置信息，并初始化微信JS-SDK
	 */
	getMpConfig() {
		if (this.isWxBrowser()) {
			request({
				url: "/app/user/common/wxMpConfig",
				method: "POST",
				data: {
					url: `${location.origin}${location.pathname}`
				}
			}).then((res) => {
				if (res != null) {
					wx.config({
						debug: config.wx.debug,
						jsApiList: res.jsApiList || ["chooseWXPay"],
						appId: res.appId,
						timestamp: res.timestamp,
						nonceStr: res.nonceStr,
						signature: res.signature,
						openTagList: res.openTagList
					});

					// 合并配置到mpConfig
					assign(this.mpConfig, res);
				}
			});
		}
	}

	/**
	 * 跳转到微信授权页面
	 */
	mpAuth() {
		const { appId } = this.mpConfig;

		const redirect_uri = encodeURIComponent(
			`${location.origin}${location.pathname}#/pages/user/login`
		);
		const response_type = "code";
		const scope = "snsapi_userinfo";
		const state = "STATE";

		const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}&state=${state}#wechat_redirect`;

		location.href = url;
	}

	/**
	 * 公众号登录，获取code
	 */
	mpLogin() {
		return new Promise((resolve) => {
			const code = getUrlParam("code");
			const mpCode = storage.get("mpCode");

			// 去除url中的code参数，避免重复
			const url = window.location.href.replace(/(\?[^#]*)#/, "#");
			window.history.replaceState({}, "", url);

			if (code != mpCode) {
				storage.set("mpCode", code, 1000 * 60 * 5);
				resolve(code);
			} else {
				resolve(null);
			}
		});
	}

	/**
	 * 公众号微信支付
	 * @param params 支付参数
	 */
	mpPay(params: wx.IchooseWXPay & { timeStamp: number }): Promise<void> {
		return new Promise((resolve, reject) => {
			if (!this.isWxBrowser()) {
				return reject({ message: t("请在微信浏览器中打开") });
			}

			wx.chooseWXPay({
				...params,
				timestamp: params.timeStamp,
				success() {
					resolve();
				},
				complete(e: { errMsg: string }) {
					switch (e.errMsg) {
						case "chooseWXPay:cancel":
							reject({ message: t("已取消支付") });
							break;

						default:
							reject({ message: t("支付失败") });
					}
				}
			});
		});
	}
	// #endif

	// #ifdef MP
	/**
	 * 小程序登录，获取用户信息和code
	 */
	miniLogin(): Promise<{
		code: string;
		iv: string;
		encryptedData: string;
		signature: string;
		rawData: string;
	}> {
		return new Promise((resolve, reject) => {
			// 兼容 Mac，Mac 端需用 getUserInfo
			const k = uni.getDeviceInfo().platform === "mac" ? "getUserInfo" : "getUserProfile";

			uni[k]({
				lang: "zh_CN",
				desc: t("授权信息仅用于用户登录"),
				success: ({ iv, encryptedData, signature, rawData }) => {
					const next = () => {
						resolve({
							iv,
							encryptedData,
							signature,
							rawData,
							code: this.code.value
						});
					};

					// 检查登录状态是否过期
					uni.checkSession({
						success: () => {
							next();
						},
						fail: () => {
							this.getCode().then(() => {
								next();
							});
						}
					});
				},
				fail: (err) => {
					console.error(`[useWx.miniLogin] error`, err);
					this.getCode();

					reject(t("登录授权失败"));
				}
			});
		});
	}

	/**
	 * 小程序微信支付
	 * @param params 支付参数
	 */
	miniPay(params: any): Promise<void> {
		return new Promise((resolve, reject) => {
			uni.requestPayment({
				provider: "wxpay",
				...params,
				success() {
					resolve();
				},
				fail() {
					reject(t("已取消支付"));
				}
			});
		});
	}
	// #endif
}

/**
 * useWx 钩子函数，后续可扩展
 */
export const useWx = (): Wx => {
	const wx = new Wx();

	onReady(() => {
		wx.getCode();

		// #ifdef H5
		wx.getMpConfig();
		// #endif
	});

	return wx;
};
