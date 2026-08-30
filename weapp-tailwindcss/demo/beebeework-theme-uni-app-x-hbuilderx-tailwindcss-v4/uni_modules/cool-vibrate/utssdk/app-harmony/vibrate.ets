import { vibrator } from '@kit.SensorServiceKit';
import { BusinessError } from '@kit.BasicServicesKit';

/**
 * 原生振动控制类
 * 用于控制设备振动,提供触觉反馈
 */
export class VibrateNative {
	/**
	 * 使设备振动指定时长
	 * @param duration 振动持续时间(毫秒)
	 */
	static vibrate(duration: number): void {
		try {
			// 调用系统振动API
			vibrator.startVibration(
				{
					type: 'time', // 振动类型为时间模式
					duration: duration // 振动持续时间
				},
				{
					id: 0, // 振动任务ID
					usage: 'alarm' // 振动场景类型,用于系统开关管控
				},
				(error: BusinessError) => {
					// 错误处理回调
					if (error) {
						console.error(
							`振动启动失败: 错误码 ${error.code}, 错误信息 ${error.message}`
						);
						return;
					}
				}
			);
		} catch (err) {
			// 捕获意外错误
			const error: BusinessError = err as BusinessError;
			console.error(
				`发生意外错误: 错误码 ${error.code}, 错误信息 ${error.message}`
			);
		}
	}
}