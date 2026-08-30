/**
 * 检查值是否为数组
 * @example isArray([1, 2, 3]) // true
 * @example isArray('123') // false
 */
export function isArray(value: any): boolean {
	return Array.isArray(value);
}

/**
 * 检查值是否为对象
 * @example isObject({}) // true
 * @example isObject([]) // false
 */
export function isObject(value: any): boolean {
	return typeof value == "object" && !Array.isArray(value) && !isNull(value);
}

/**
 * 检查值是否为字符串
 * @example isString('abc') // true
 * @example isString(123) // false
 */
export function isString(value: any): boolean {
	return typeof value == "string";
}

/**
 * 检查值是否为数字
 * @example isNumber(123) // true
 * @example isNumber('123') // false
 */
export function isNumber(value: any): boolean {
	return typeof value == "number" && !isNaN(value);
}

/**
 * 检查值是否为布尔值
 * @example isBoolean(true) // true
 * @example isBoolean(1) // false
 */
export function isBoolean(value: any): boolean {
	return typeof value == "boolean";
}

/**
 * 检查值是否为函数
 * @example isFunction(() => {}) // true
 * @example isFunction({}) // false
 */
export function isFunction(value: any): boolean {
	return typeof value == "function";
}

/**
 * 检查值是否为 null
 * @example isNull(null) // true
 * @example isNull(undefined) // true
 */
export function isNull(value?: any | null): boolean {
	// #ifdef APP
	return value == null;
	// #endif

	// #ifndef APP
	return value == null || value == undefined;
	// #endif
}

/**
 * 检查值是否为空
 * @example isEmpty([]) // true
 * @example isEmpty('') // true
 * @example isEmpty({}) // true
 */
export function isEmpty(value: any): boolean {
	if (isArray(value)) {
		return (value as any[]).length == 0;
	}

	if (isString(value)) {
		return value == "";
	}

	if (isObject(value)) {
		return keys(value).length == 0;
	}

	return false;
}

/**
 * 返回对象的所有键名
 * @example keys({a: 1, b: 2}) // ['a', 'b']
 */
export function keys(value: any): string[] {
	// @ts-ignore
	return UTSJSONObject.keys(value as UTSJSONObject);
}

/**
 * 返回数组的第一个元素
 * @example first([1, 2, 3]) // 1
 * @example first([]) // null
 */
export function first<T>(array: T[]): T | null {
	return isArray(array) && array.length > 0 ? array[0] : null;
}

/**
 * 返回数组的最后一个元素
 * @example last([1, 2, 3]) // 3
 * @example last([]) // null
 */
export function last<T>(array: T[]): T | null {
	return isArray(array) && array.length > 0 ? array[array.length - 1] : null;
}

/**
 * 截取数组的一部分
 * @example slice([1, 2, 3], 1) // [2, 3]
 * @example slice([1, 2, 3], 1, 2) // [2]
 */
export function slice<T>(array: T[], start: number = 0, end: number = array.length): T[] {
	if (!isArray(array)) return [];

	const result: T[] = [];

	for (let i = start; i < end && i < array.length; i++) {
		result.push(array[i]);
	}

	return result;
}

/**
 * 检查对象是否包含指定属性
 * @example has({a: 1}, 'a') // true
 * @example has({a: 1}, 'b') // false
 */
export function has(object: any, key: string): boolean {
	return keys(object).includes(key);
}

/**
 * 获取对象的属性值
 * @example get({a: {b: 1}}, 'a.b') // 1
 * @example get({a: {b: 1}}, 'a.c', 'default') // 'default'
 */
export function get(object: any, path: string, defaultValue: any | null = null): any | null {
	if (isNull(object)) {
		return defaultValue;
	}

	// @ts-ignore
	const value = new UTSJSONObject(object).getAny(path);

	if (isNull(value)) {
		return defaultValue;
	}

	return value;
}

/**
 * 设置对象的属性值
 * @example set({a: 1}, 'b', 2) // {a: 1, b: 2}
 */
export function set(object: any, key: string, value: any | null): void {
	(object as UTSJSONObject)[key] = value;
}

/**
 * 遍历数组并返回新数组
 * @example map([1, 2, 3], x => x * 2) // [2, 4, 6]
 */
export function map<T, U>(array: T[], iteratee: (item: T, index: number) => U): U[] {
	const result: U[] = [];

	if (!isArray(array)) return result;

	for (let i = 0; i < array.length; i++) {
		result.push(iteratee(array[i], i));
	}

	return result;
}

/**
 * 将数组归约为单个值
 * @example reduce([1, 2, 3], (sum, n) => sum + n, 0) // 6
 */
export function reduce<T, U>(
	array: T[],
	iteratee: (accumulator: U, value: T, index: number) => U,
	initialValue: U
): U {
	if (!isArray(array)) return initialValue;

	let accumulator: U = initialValue;
	for (let i = 0; i < array.length; i++) {
		accumulator = iteratee(accumulator, array[i], i);
	}

	return accumulator;
}

/**
 * 检查数组中的所有元素是否都满足条件
 * @example every([2, 4, 6], x => x % 2 == 0) // true
 */
export function every<T>(array: T[], predicate: (value: T, index: number) => boolean): boolean {
	if (!isArray(array)) return true;

	for (let i = 0; i < array.length; i++) {
		if (!predicate(array[i], i)) {
			return false;
		}
	}

	return true;
}

/**
 * 检查数组中是否有元素满足条件
 * @example some([1, 2, 3], x => x > 2) // true
 */
export function some<T>(array: T[], predicate: (value: T, index: number) => boolean): boolean {
	if (!isArray(array)) return false;

	for (let i = 0; i < array.length; i++) {
		if (predicate(array[i], i)) {
			return true;
		}
	}

	return false;
}

/**
 * 创建去重后的数组
 * @example uniq([1, 2, 2, 3]) // [1, 2, 3]
 */
export function uniq<T>(array: T[]): T[] {
	if (!isArray(array)) return [];

	const result: T[] = [];
	const seen = new Map<T, boolean>();

	for (let i = 0; i < array.length; i++) {
		const item = array[i];
		const key = item;
		if (!seen.has(item)) {
			seen.set(key, true);
			result.push(item);
		}
	}

	return result;
}

/**
 * 将数组扁平化一层
 * @example flatten([1, [2, 3], 4]) // [1, 2, 3, 4]
 */
export function flatten(array: any[]): any[] {
	if (!isArray(array)) return [];

	const result: any[] = [];

	for (let i = 0; i < array.length; i++) {
		const item = array[i];
		if (isArray(item)) {
			result.push(...(item as any[]));
		} else {
			result.push(item);
		}
	}

	return result;
}

/**
 * 将数组完全扁平化
 * @example flattenDeep([1, [2, [3, [4]]]]) // [1, 2, 3, 4]
 */
export function flattenDeep(array: any[]): any[] {
	if (!isArray(array)) return [];

	const result: any[] = [];

	for (let i = 0; i < array.length; i++) {
		const item = array[i];
		if (isArray(item)) {
			result.push(...flattenDeep(item as any[]));
		} else {
			result.push(item);
		}
	}

	return result;
}

/**
 * 对数组进行排序
 * @example sort([3, 1, 2]) // [1, 2, 3]
 * @example sort(['c', 'a', 'b'], 'desc') // ['c', 'b', 'a']
 */
export function sort<T>(array: T[], order: "asc" | "desc" = "asc"): T[] {
	const result = [...array];

	return result.sort((a, b) => {
		if (typeof a == "number" && typeof b == "number") {
			return order == "asc" ? a - b : b - a;
		}

		if (typeof a == "string" && typeof b == "string") {
			return order == "asc" ? a.localeCompare(b) : b.localeCompare(a);
		}

		return 0;
	});
}

/**
 * 根据对象属性对数组进行排序
 * @example orderBy([{age: 30}, {age: 20}], 'age') // [{age: 20}, {age: 30}]
 */
export function orderBy<T>(array: T[], key: string, order: "asc" | "desc" = "asc"): T[] {
	if (!isArray(array)) return [];

	const result = [...array];

	result.sort((a, b) => {
		const valueA = get(a as any, key) as number;
		const valueB = get(b as any, key) as number;

		if (order == "asc") {
			return valueA > valueB ? 1 : -1;
		} else {
			return valueA < valueB ? 1 : -1;
		}
	});

	return result;
}

/**
 * 根据对象属性对数组进行分组
 * @example groupBy([{type: 'a'}, {type: 'b'}, {type: 'a'}], 'type') // {a: [{type: 'a'}, {type: 'a'}], b: [{type: 'b'}]}
 */
export function groupBy<T>(array: T[], key: string) {
	if (!isArray(array)) return {};

	const result = {};

	for (let i = 0; i < array.length; i++) {
		const item = array[i];
		let value = get(item as any, key)!;

		if (typeof value == "number") {
			value = value.toString();
		}

		if (typeof value == "string") {
			if (!isArray(result[value])) {
				result[value] = new Array<T>();
			}

			(result[value] as T[]).push(item);
		}
	}

	return result;
}

/**
 * 将多个对象的属性合并到一个对象中
 * @example assign({a: 1}, {b: 2}) // {a: 1, b: 2}
 */
export function assign(...items: any[]) {
	// @ts-ignore
	return UTSJSONObject.assign(...items.map((item) => item as UTSJSONObject));
}

/**
 * 获取数组中指定索引的元素
 * @example nth([1, 2, 3], 1) // 2
 * @example nth([1, 2, 3], -1) // 3
 */
export function nth<T>(array: T[], index: number): T | null {
	if (index >= 0) {
		return array[index];
	}

	return array[array.length + index];
}

/**
 * 从数组中移除指定的值
 * @example pull([1, 2, 3, 1, 2, 3], 1, 2) // [3, 3]
 */
export function pull<T>(array: T[], ...values: T[]): T[] {
	if (!isArray(array)) return [];

	return array.filter((item) => !values.includes(item));
}

/**
 * 从数组中移除满足条件的元素
 * @example remove([1, 2, 3, 4], x => x % 2 == 0) // [1, 3]
 */
export function remove<T>(array: T[], predicate: (value: T, index: number) => boolean): T[] {
	if (!isArray(array)) return [];

	const result: T[] = [];

	for (let i = 0; i < array.length; i++) {
		if (!predicate(array[i], i)) {
			result.push(array[i]);
		}
	}

	return result;
}

/**
 * 遍历数组
 * @example forEach([1, 2, 3], x => console.log(x))
 */
export function forEach<T>(data: T[], iteratee: (value: T, index: number) => void): void {
	if (isArray(data)) {
		const array = data as T[];

		for (let i = 0; i < array.length; i++) {
			if (array[i] != null) {
				iteratee(array[i], i);
			}
		}
	}
}

/**
 * 查找数组中第一个满足条件的元素
 * @example find([1, 2, 3, 4], x => x > 2) // 3
 */
export function find<T>(array: T[], predicate: (value: T, index: number) => boolean): T | null {
	if (!isArray(array)) return null;

	for (let i = 0; i < array.length; i++) {
		if (predicate(array[i], i)) {
			return array[i];
		}
	}
	return null;
}

/**
 * 遍历对象
 * @example forInObject({a: 1, b: 2}, (value, key) => console.log(key, value))
 */
export function forInObject(data: any, iteratee: (value: any, key: string) => void): void {
	if (isObject(data)) {
		const objKeys = keys(data);
		for (let i = 0; i < objKeys.length; i++) {
			const key = objKeys[i];
			iteratee(get(data, key)!, key);
		}
	}
}

/**
 * 对象转数组
 * @example toArray({a: 1, b: 2}, (value, key) => ({key, value})) // [{key: 'a', value: 1}, {key: 'b', value: 2}]
 */
export function toArray<T>(data: any, iteratee: (value: any, key: string) => T): T[] {
	const result: T[] = [];

	if (isObject(data)) {
		forInObject(data, (value, key) => {
			result.push(iteratee(value, key));
		});
	}

	return result;
}

/**
 * 生成UUID
 * @example uuid() // "123e4567-e89b-12d3-a456-426614174000"
 */
export function uuid(): string {
	let uuid = "";
	let i: number;
	let random: number;

	for (i = 0; i < 36; i++) {
		if (i == 8 || i == 13 || i == 18 || i == 23) {
			uuid += "-";
		} else if (i == 14) {
			uuid += "4";
		} else if (i == 19) {
			random = (Math.random() * 16) | 0;
			uuid += ((random & 0x3) | 0x8).toString(16);
		} else {
			random = (Math.random() * 16) | 0;
			uuid += random.toString(16);
		}
	}
	return uuid;
}

/**
 * 创建一个防抖函数，在指定延迟后执行函数，如果在延迟期间再次调用则重新计时
 * @example debounce(() => console.log('执行'), 300)
 */
export function debounce(func: () => void, delay: number): () => number {
	let timeoutId = 0;

	return function (): number {
		// 清除之前的定时器
		if (timeoutId != 0) {
			clearTimeout(timeoutId);
		}

		// 设置新的定时器
		// @ts-ignore
		timeoutId = setTimeout(() => {
			func();
			timeoutId = 0;
		}, delay);

		return timeoutId;
	};
}

/**
 * 创建一个节流函数，在指定时间间隔内只会执行一次
 * @example
 * const throttled = throttle(() => console.log('执行'), 300)
 * throttled()
 */
export function throttle(func: () => void, delay: number): () => number {
	let timeoutId: number = 0;
	let lastExec: number = 0;

	return function (): number {
		const now: number = Date.now();

		// 如果距离上次执行已超过delay，则立即执行
		if (now - lastExec >= delay) {
			func();
			lastExec = now;
			return 0;
		}

		// 否则在剩余时间后执行
		if (timeoutId != 0) {
			clearTimeout(timeoutId);
		}
		const remaining: number = delay - (now - lastExec);
		// @ts-ignore
		timeoutId = setTimeout(() => {
			func();
			lastExec = Date.now();
			timeoutId = 0;
		}, remaining);

		return timeoutId;
	};
}

/**
 * 生成指定范围内的随机数
 * @example random(1, 10) // 随机生成1到10之间的整数
 */
export function random(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 将base64转换为blob
 * @param data base64数据
 * @returns blob数据
 */
export function base64ToBlob(data: string, type: string = "image/jpeg"): Blob {
	// #ifdef H5
	let bytes = window.atob(data.split(",")[1]);
	let ab = new ArrayBuffer(bytes.length);
	let ia = new Uint8Array(ab);
	for (let i = 0; i < bytes.length; i++) {
		ia[i] = bytes.charCodeAt(i);
	}
	return new Blob([ab], { type });
	// #endif
}

/**
 * 检查两个值是否相等
 * @param a 值1
 * @param b 值2
 * @returns 是否相等
 */
export function isEqual(a: any, b: any): boolean {
	if (isObject(a) && isObject(b)) {
		return isEqual(JSON.stringify(a), JSON.stringify(b));
	} else if (isArray(a) && isArray(b)) {
		return isEqual(JSON.stringify(a), JSON.stringify(b));
	}

	return a == b;
}
