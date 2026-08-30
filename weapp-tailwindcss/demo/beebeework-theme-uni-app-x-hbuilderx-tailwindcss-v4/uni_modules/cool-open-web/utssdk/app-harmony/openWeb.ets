import { Want, common } from '@kit.AbilityKit';
import { BusinessError } from '@kit.BasicServicesKit';

/**
 * 原生打开网页控制类
 * 用于在鸿蒙系统中打开网页URL
 */
export class OpenWebNative {
	/**
	 * 打开指定的网页URL
	 * @param url 要打开的网页地址
	 * @returns 返回操作结果，true表示成功，false表示失败
	 */
	static openUrl(url: string): boolean {
		try {
			// 获取应用上下文
			const context = getContext() as common.UIAbilityContext;
			
			// 构建Want对象，用于启动浏览器
			const want: Want = {
				action: 'ohos.want.action.viewData', // 查看数据的标准动作
				entities: ['entity.system.browsable'], // 可浏览实体
				uri: url // 目标URL
			};

			// 启动浏览器应用
			context.startAbility(want)
				.then(() => {
					console.info(`成功打开URL: ${url}`);
				})
				.catch((error: BusinessError) => {
					console.error(`打开URL失败: 错误码 ${error.code}, 错误信息 ${error.message}`);
				});

			return true;
		} catch (err) {
			// 捕获意外错误
			const error: BusinessError = err as BusinessError;
			console.error(
				`发生意外错误: 错误码 ${error.code}, 错误信息 ${error.message}`
			);
			return false;
		}
	}
} 