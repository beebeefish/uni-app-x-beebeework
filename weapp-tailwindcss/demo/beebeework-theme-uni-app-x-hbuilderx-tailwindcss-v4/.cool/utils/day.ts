/**
 * 轻量级日期工具类
 * 基于 uni-app-x UTS Date API
 * 参考 dayjs 设计理念
 */

export class DayUts {
	private _date: Date;

	constructor(date?: Date | string | number | null) {
		if (date == null || date == "") {
			this._date = new Date();
		} else if (typeof date == "string") {
			this._date = new Date(date);
		} else if (typeof date == "number") {
			this._date = new Date(date);
		} else if (date instanceof Date) {
			this._date = new Date(date.getTime());
		} else {
			this._date = new Date();
		}
	}

	/**
	 * 格式化日期
	 * @param template 格式模板，支持 YYYY-MM-DD HH:mm:ss 等
	 */
	format(template: string): string {
		// 使用传入的模板
		let actualTemplate: string = template;

		const year = this._date.getFullYear();
		const month = this._date.getMonth() + 1;
		const date = this._date.getDate();
		const hours = this._date.getHours();
		const minutes = this._date.getMinutes();
		const seconds = this._date.getSeconds();
		const milliseconds = this._date.getMilliseconds();

		// 使用数组来依次替换，避免UTS的replace方法兼容性问题
		let result: string = actualTemplate;

		// 按照长度从长到短替换，避免冲突
		// 替换年份 (YYYY 必须在 YY 之前)
		result = result.replace("YYYY", year.toString());
		result = result.replace("YY", year.toString().slice(-2));

		// 替换月份 (MM 必须在 M 之前)
		result = result.replace("MM", month.toString().padStart(2, "0"));
		result = result.replace("M", month.toString());

		// 替换日期 (DD 必须在 D 之前)
		result = result.replace("DD", date.toString().padStart(2, "0"));
		result = result.replace("D", date.toString());

		// 替换小时 (HH 必须在 H 之前)
		result = result.replace("HH", hours.toString().padStart(2, "0"));
		result = result.replace("H", hours.toString());

		// 替换分钟 (mm 必须在 m 之前)
		result = result.replace("mm", minutes.toString().padStart(2, "0"));
		result = result.replace("m", minutes.toString());

		// 替换秒数 (ss 必须在 s 之前)
		result = result.replace("ss", seconds.toString().padStart(2, "0"));
		result = result.replace("s", seconds.toString());

		// 替换毫秒
		result = result.replace("SSS", milliseconds.toString().padStart(3, "0"));

		return result;
	}

	/**
	 * 本月多少天
	 */
	getDays(): number {
		return new Date(this._date.getFullYear(), this._date.getMonth() + 1, 0).getDate();
	}

	/**
	 * 是否为闰年
	 */
	isLeapYear(): boolean {
		return this._date.getFullYear() % 4 == 0 && this._date.getFullYear() % 100 != 0;
	}

	/**
	 * 星期几
	 */
	getDay(): number {
		return this._date.getDay();
	}

	/**
	 * 获取某个单位的开始时间
	 */
	startOf(unit: "month" | "day" | "year" | "week"): DayUts {
		const newDate = new Date(this._date.getTime());

		switch (unit) {
			case "year":
				newDate.setMonth(0);
				newDate.setDate(1);
				newDate.setHours(0);
				newDate.setMinutes(0);
				newDate.setSeconds(0);
				newDate.setMilliseconds(0);
				break;
			case "month":
				newDate.setDate(1);
				newDate.setHours(0);
				newDate.setMinutes(0);
				newDate.setSeconds(0);
				newDate.setMilliseconds(0);
				break;
			case "week":
				newDate.setDate(newDate.getDate() - newDate.getDay());
				newDate.setHours(0);
				newDate.setMinutes(0);
				newDate.setSeconds(0);
				newDate.setMilliseconds(0);
				break;
			case "day":
				newDate.setHours(0);
				newDate.setMinutes(0);
				newDate.setSeconds(0);
				newDate.setMilliseconds(0);
				break;
		}

		return new DayUts(newDate);
	}

	/**
	 * 获取某个单位的结束时间
	 */
	endOf(unit: "month" | "day" | "year" | "week"): DayUts {
		const newDate = new Date(this._date.getTime());

		switch (unit) {
			case "year":
				newDate.setMonth(11);
				newDate.setDate(31);
				newDate.setHours(23);
				newDate.setMinutes(59);
				newDate.setSeconds(59);
				newDate.setMilliseconds(999);
				break;
			case "month":
				newDate.setMonth(newDate.getMonth() + 1);
				newDate.setDate(0);
				newDate.setHours(23);
				newDate.setMinutes(59);
				newDate.setSeconds(59);
				newDate.setMilliseconds(999);
				break;
			case "week":
				const day = newDate.getDay();
				const diff = 6 - day;
				newDate.setDate(newDate.getDate() + diff);
				newDate.setHours(23);
				newDate.setMinutes(59);
				newDate.setSeconds(59);
				newDate.setMilliseconds(999);
				break;
			case "day":
				newDate.setHours(23);
				newDate.setMinutes(59);
				newDate.setSeconds(59);
				newDate.setMilliseconds(999);
				break;
		}

		return new DayUts(newDate);
	}

	/**
	 * 判断是否早于另一个日期
	 */
	isBefore(date: DayUts | Date | string | number): boolean {
		const compareDate = this._parseDate(date);
		return this._date.getTime() < compareDate.getTime();
	}

	/**
	 * 判断是否晚于另一个日期
	 */
	isAfter(date: DayUts | Date | string | number): boolean {
		const compareDate = this._parseDate(date);
		return this._date.getTime() > compareDate.getTime();
	}

	/**
	 * 判断是否与另一个日期相同
	 */
	isSame(date: DayUts | Date | string | number): boolean {
		const compareDate = this._parseDate(date);
		return this._date.getTime() == compareDate.getTime();
	}

	/**
	 * 计算与另一个日期的差值（毫秒）
	 */
	diff(date: DayUts | Date | string | number): number {
		const compareDate = this._parseDate(date);
		return this._date.getTime() - compareDate.getTime();
	}

	/**
	 * 计算与另一个日期的差值（指定单位）
	 */
	diffUnit(
		date: DayUts | Date | string | number,
		unit: "day" | "hour" | "minute" | "second" | "millisecond"
	): number {
		const compareDate = this._parseDate(date);
		const diffMs = this._date.getTime() - compareDate.getTime();

		switch (unit) {
			case "day":
				return Math.floor(diffMs / (1000 * 60 * 60 * 24));
			case "hour":
				return Math.floor(diffMs / (1000 * 60 * 60));
			case "minute":
				return Math.floor(diffMs / (1000 * 60));
			case "second":
				return Math.floor(diffMs / 1000);
			case "millisecond":
			default:
				return diffMs;
		}
	}

	/**
	 * 添加时间
	 */
	add(value: number, unit: "day" | "month" | "year" | "hour" | "minute" | "second"): DayUts {
		const newDate = new Date(this._date.getTime());

		switch (unit) {
			case "year":
				newDate.setFullYear(newDate.getFullYear() + value);
				break;
			case "month":
				newDate.setMonth(newDate.getMonth() + value);
				break;
			case "day":
				newDate.setDate(newDate.getDate() + value);
				break;
			case "hour":
				newDate.setHours(newDate.getHours() + value);
				break;
			case "minute":
				newDate.setMinutes(newDate.getMinutes() + value);
				break;
			case "second":
				newDate.setSeconds(newDate.getSeconds() + value);
				break;
		}

		return new DayUts(newDate);
	}

	/**
	 * 减少时间
	 */
	subtract(value: number, unit: "day" | "month" | "year" | "hour" | "minute" | "second"): DayUts {
		return this.add(-value, unit);
	}

	/**
	 * 获取时间戳
	 */
	valueOf(): number {
		return this._date.getTime();
	}

	/**
	 * 获取原生Date对象
	 */
	toDate(): Date {
		return new Date(this._date.getTime());
	}

	/**
	 * 获取日期数组
	 */
	toArray(): number[] {
		return [
			this._date.getFullYear(),
			this._date.getMonth() + 1,
			this._date.getDate(),
			this._date.getHours(),
			this._date.getMinutes(),
			this._date.getSeconds()
		];
	}

	/**
	 * 私有方法：解析不同类型的日期参数
	 */
	private _parseDate(date: DayUts | Date | string | number): Date {
		if (date instanceof DayUts) {
			return date.toDate();
		} else if (date instanceof Date) {
			return date;
		} else if (typeof date == "string") {
			return new Date(date);
		} else if (typeof date == "number") {
			return new Date(date);
		} else {
			// 如果都不匹配，返回当前时间
			return new Date();
		}
	}
}

/**
 * 创建 DayUts 实例
 */
export function dayUts(date: Date | string | number | null = new Date()): DayUts {
	return new DayUts(date);
}
