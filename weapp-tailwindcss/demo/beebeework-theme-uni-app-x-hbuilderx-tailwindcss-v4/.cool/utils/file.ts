import { base64ToBlob, uuid } from "./comm";

/**
 * 将canvas转换为png图片
 * @param options 转换参数
 * @returns 图片路径
 */
export function canvasToPng(canvasRef: UniElement): Promise<string> {
	return new Promise((resolve) => {
		// #ifdef APP
		canvasRef.parentElement!.takeSnapshot({
			success(res) {
				resolve(res.tempFilePath);
			},
			fail(err) {
				console.error(err);
				resolve("");
			}
		});
		// #endif

		// #ifdef H5
		const url = URL.createObjectURL(
			base64ToBlob(
				(canvasRef as unknown as HTMLCanvasElement)?.toDataURL("image/png", 1) ?? ""
			)
		);

		resolve(url);
		// #endif

		// #ifdef MP
		uni.createCanvasContextAsync({
			id: canvasRef.id,
			component: canvasRef.$vm,
			success(context) {
				// 获取2D绘图上下文
				const ctx = context.getContext("2d")!;

				// 获取canvas对象
				const canvas = ctx.canvas;

				// 将canvas转换为base64格式的PNG图片数据
				const data = canvas.toDataURL("image/png", 1);

				// 获取文件系统管理器
				const fileMg = uni.getFileSystemManager();

				// 生成临时文件路径
				// @ts-ignore
				const filepath = `${wx.env.USER_DATA_PATH}/${uuid()}.png`;

				// 将base64数据写入文件
				fileMg.writeFile({
					filePath: filepath,
					data: data.split(",")[1],
					encoding: "base64",
					success() {
						resolve(filepath);
					},
					fail(err) {
						console.error(err);
						resolve("");
					}
				});
			},
			fail(err) {
				console.error(err);
				resolve("");
			}
		});
		// #endif
	});
}
