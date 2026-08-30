// 过期时间后缀，用于标识存储数据的过期时间键名
const EXPIRES_SUFFIX = "_deadtime";

/**
 * 存储管理类
 *
 * 封装了 uni-app 的存储 API，提供更便捷的存储操作
 * 支持数据过期时间管理，自动处理过期数据
 */
class Storage {
	/**
	 * 获取存储数据
	 *
	 * @param key 存储键名
	 * @returns 存储的数据，如果不存在则返回 null
	 *
	 * @example
	 * const userData = storage.get('user');
	 * if (userData != null) {
	 *   console.log(userData);
	 * }
	 */
	get(key: string): any | null {
		console.log(`获取数据：${key}`);
		return uni.getStorageSync(key);
	}

	/**
	 * 获取所有存储数据的信息
	 *
	 * 遍历所有存储键，返回包含所有键值对的对象
	 * 注意：此方法会读取所有存储数据，大量数据时需注意性能
	 *
	 * @returns 包含所有存储数据的对象
	 *
	 * @example
	 * const allData = storage.info();
	 * console.log('所有存储数据：', allData);
	 */
	info() {
		// 获取存储信息，包含所有键名
		const info = uni.getStorageInfoSync();

		// 创建空对象用于存放所有数据
		const d = {};

		// 遍历所有键名，获取对应的值
		info.keys.forEach((e) => {
			d[e] = this.get(e);
		});

		return d;
	}

	/**
	 * 设置存储数据
	 *
	 * @param key 存储键名
	 * @param value 要存储的数据，支持任意类型
	 * @param expires 过期时间（秒），默认为0表示永不过期
	 *
	 * @example
	 * // 存储永久数据
	 * storage.set('user', { name: '张三', age: 25 }, 0);
	 *
	 * // 存储5分钟后过期的数据
	 * storage.set('token', 'abc123', 300);
	 */
	set(key: string, value: any, expires: number): void {
		console.log(`存储数据：${key} = ${value}`);
		console.log(key, value, expires);
		// 存储主要数据
		uni.setStorageSync(key, value);

		// 如果设置了过期时间，则存储过期时间戳
		if (expires > 0) {
			// 计算过期时间戳：当前时间 + 过期时间（秒转毫秒）
			const expireTime = new Date().getTime() + expires * 1000;
			uni.setStorageSync(`${key}${EXPIRES_SUFFIX}`, expireTime);
		}
	}

	/**
	 * 检查数据是否已过期
	 *
	 * @param key 存储键名
	 * @returns true表示已过期或无过期时间设置，false表示未过期
	 *
	 * @example
	 * if (storage.isExpired('token')) {
	 *   console.log('token已过期');
	 * }
	 */
	isExpired(key: string): boolean {
		// 获取过期时间戳
		const value = uni.getStorageSync(`${key}${EXPIRES_SUFFIX}`) as number | null;

		// 如果没有设置过期时间，视为已过期
		if (value == null) {
			return true;
		}

		// 比较过期时间戳与当前时间，判断是否过期
		return value - new Date().getTime() <= 0;
	}

	/**
	 * 删除存储数据
	 *
	 * 会同时删除数据本身和对应的过期时间
	 *
	 * @param key 存储键名
	 *
	 * @example
	 * storage.remove('user');
	 * storage.remove('token');
	 */
	remove(key: string) {
		// 删除主要数据
		uni.removeStorageSync(key);
		// 删除对应的过期时间数据
		uni.removeStorageSync(`${key}${EXPIRES_SUFFIX}`);
	}

	/**
	 * 清空所有存储数据
	 *
	 * 警告：此操作会删除所有本地存储数据，请谨慎使用
	 *
	 * @example
	 * storage.clear(); // 清空所有数据
	 */
	clear() {
		uni.clearStorageSync();
	}

	/**
	 * 获取数据后立即删除（一次性读取）
	 *
	 * 适用于临时数据、一次性令牌等场景
	 * 读取后数据会被自动删除，确保数据的一次性使用
	 *
	 * @param key 存储键名
	 * @returns 存储的数据，如果不存在则返回 null
	 *
	 * @example
	 * const tempToken = storage.once('temp_token');
	 * // tempToken 使用后，存储中的 temp_token 已被删除
	 */
	once(key: string): any | null {
		// 先获取数据
		const value = this.get(key);
		// 立即删除数据
		this.remove(key);
		// 返回获取到的数据
		return value;
	}
}

// 导出存储实例，提供全局访问
export const storage = new Storage();
