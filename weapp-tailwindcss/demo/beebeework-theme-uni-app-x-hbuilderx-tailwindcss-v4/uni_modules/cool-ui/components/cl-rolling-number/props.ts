export type ClRollingNumberProps = {
	/**
	 * 绑定值
	 */
	modelValue: number
	/**
	 * 动画持续时间，单位毫秒
	 * @default 1000
	 */
	duration?: number
	/**
	 * 保留小数位数
	 * @default 0
	 */
	decimals?: number
	/**
	 * 是否自动开始动画
	 * @default true
	 */
	autoStart?: boolean
} 