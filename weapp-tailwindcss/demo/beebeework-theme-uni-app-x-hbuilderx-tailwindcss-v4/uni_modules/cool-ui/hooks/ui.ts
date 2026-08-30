import { router, t } from "@/.cool";
import type { ClConfirmAction, ClConfirmOptions, ClToastOptions } from "../types";

/**
 * UiInstance 类型定义
 * - showConfirm: 显示确认弹窗的方法
 * - showTips: 显示提示弹窗的方法
 */
export type UiInstance = {
	/**
	 * 显示确认弹窗
	 * @param options ClConfirmOptions 弹窗配置项
	 */
	showConfirm: (options: ClConfirmOptions) => void;

	/**
	 * 显示提示弹窗
	 * @param message 提示消息
	 * @param callback 回调函数，参数为用户操作类型
	 */
	showTips: (message: string, callback: (action: ClConfirmAction) => void) => void;

	/**
	 * 显示提示弹窗
	 * @param options ClToastOptions 弹窗配置项
	 */
	showToast: (options: ClToastOptions) => void;
};

/**
 * 存储每个页面对应的 UiInstance 实例
 * key: 当前页面路由
 * value: UiInstance 实例
 */
const list = new Map<string, UiInstance>();

/**
 * Ui 类，提供全局弹窗调用能力
 */
class Ui {
	/**
	 * 获取当前页面的 UiInstance 实例
	 * @returns UiInstance | undefined
	 */
	getInstance() {
		return list.get(router.path());
	}

	/**
	 * 显示确认弹窗
	 * @param options ClConfirmOptions 弹窗配置项
	 */
	showConfirm(options: ClConfirmOptions): void {
		const instance = this.getInstance();
		if (instance != null) {
			instance.showConfirm(options);
		}
	}

	/**
	 * 显示提示弹窗
	 * @param message 提示消息
	 * @param callback 回调函数
	 */
	showTips(message: string, callback: (action: ClConfirmAction) => void): void {
		const instance = this.getInstance();
		if (instance != null) {
			instance.showTips(message, callback);
		}
	}

	/**
	 * 显示提示弹窗
	 * @param options ClToastOptions 弹窗配置项
	 */
	showToast(options: ClToastOptions): void {
		const instance = this.getInstance();
		if (instance != null) {
			instance.showToast(options);
		}
	}

	/**
	 * 显示加载中弹窗
	 * @param title 提示内容
	 * @param mask 是否显示蒙层
	 */
	showLoading(title: string | null = null, mask: boolean | null = null): void {
		uni.showLoading({
			title: title ?? t("加载中"),
			mask: mask ?? true
		});
	}

	/**
	 * 隐藏加载中弹窗
	 */
	hideLoading(): void {
		uni.hideLoading();
	}
}

/**
 * 获取 Ui 实例（始终返回同一个 Ui 实例）
 * @returns Ui
 */
const ui = new Ui();

export function useUi() {
	return ui;
}

/**
 * 注册当前页面的 UiInstance 实例
 * @param instance UiInstance
 */
export function createUi(instance: UiInstance): void {
	list.set(router.path(), instance);
}
