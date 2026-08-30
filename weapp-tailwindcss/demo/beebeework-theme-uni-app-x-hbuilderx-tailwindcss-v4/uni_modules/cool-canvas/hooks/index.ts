import { getDevicePixelRatio, isEmpty } from "@/.cool";
import { getCurrentInstance } from "vue";
import type {
	CropImageResult,
	DivRenderOptions,
	ImageRenderOptions,
	TextRenderOptions,
	TransformOptions
} from "../types";

/**
 * Canvas 绘图类，封装了常用的绘图操作
 */
export class Canvas {
	// uni-app CanvasContext 对象
	context: CanvasContext | null = null;
	// 2D 渲染上下文
	ctx: CanvasRenderingContext2D | null = null;
	// 组件作用域（用于小程序等环境）
	scope: ComponentPublicInstance | null = null;
	// 画布ID
	canvasId: string | null = null;
	// 渲染队列，存储所有待渲染的异步操作
	renderQuene: (() => Promise<void>)[] = [];
	// 图片渲染队列，存储所有待处理的图片参数
	imageQueue: ImageRenderOptions[] = [];

	/**
	 * 构造函数
	 * @param canvasId 画布ID
	 */
	constructor(canvasId: string) {
		const { proxy } = getCurrentInstance()!;

		// 当前页面作用域
		this.scope = proxy;

		// 画布ID
		this.canvasId = canvasId;
	}

	/**
	 * 创建画布上下文
	 * @returns Promise<void>
	 */
	async create(): Promise<void> {
		const dpr = getDevicePixelRatio(); // 获取设备像素比

		return new Promise((resolve) => {
			uni.createCanvasContextAsync({
				id: this.canvasId!,
				component: this.scope,
				success: (context: CanvasContext) => {
					this.context = context;
					this.ctx = context.getContext("2d")!;
					this.ctx.scale(dpr, dpr); // 按照 dpr 缩放，保证高清

					resolve();
				}
			});
		});
	}

	/**
	 * 设置画布高度
	 * @param value 高度
	 * @returns Canvas
	 */
	height(value: number): Canvas {
		this.ctx!.canvas.height = value;
		return this;
	}

	/**
	 * 设置画布宽度
	 * @param value 宽度
	 * @returns Canvas
	 */
	width(value: number): Canvas {
		this.ctx!.canvas.width = value;
		return this;
	}

	/**
	 * 添加块（矩形/圆角矩形）渲染到队列
	 * @param options DivRenderOptions
	 * @returns Canvas
	 */
	div(options: DivRenderOptions): Canvas {
		const render = async () => {
			this.divRender(options);
		};
		this.renderQuene.push(render);
		return this;
	}

	/**
	 * 添加文本渲染到队列
	 * @param options TextRenderOptions
	 * @returns Canvas
	 */
	text(options: TextRenderOptions): Canvas {
		const render = async () => {
			this.textRender(options);
		};
		this.renderQuene.push(render);
		return this;
	}

	/**
	 * 添加图片渲染到队列
	 * @param options ImageRenderOptions
	 * @returns Canvas
	 */
	image(options: ImageRenderOptions): Canvas {
		const render = async () => {
			await this.imageRender(options);
		};
		this.imageQueue.push(options);
		this.renderQuene.push(render);
		return this;
	}

	/**
	 * 执行绘制流程（预加载图片后依次渲染队列）
	 */
	async draw(): Promise<void> {
		// 如果有图片，先预加载
		if (!isEmpty(this.imageQueue)) {
			await this.preloadImage();
		}

		this.render();
	}

	/**
	 * 下载图片（获取本地路径，兼容APP等平台）
	 * @param item ImageRenderOptions
	 * @returns Promise<void>
	 */
	downloadImage(item: ImageRenderOptions): Promise<void> {
		return new Promise((resolve, reject) => {
			uni.getImageInfo({
				src: item.url,
				success: (res) => {
					// #ifdef APP
					item.url = res.path; // APP端需用本地路径
					// #endif
					resolve();
				},
				fail: (err) => {
					console.error(err);
					reject(err);
				}
			});
		});
	}

	/**
	 * 预加载所有图片，确保图片可用
	 */
	async preloadImage(): Promise<void> {
		await Promise.all(
			this.imageQueue.map((e) => {
				return this.downloadImage(e);
			})
		);
	}

	/**
	 * 设置背景颜色
	 * @param color 颜色字符串
	 */
	private setBackground(color: string) {
		this.ctx!.fillStyle = color;
	}

	/**
	 * 设置边框（支持圆角）
	 * @param options DivRenderOptions
	 */
	private setBorder(options: DivRenderOptions) {
		const { x, y, width: w = 0, height: h = 0, borderWidth, borderColor, radius: r } = options;

		if (borderWidth == null || borderColor == null) return;

		this.ctx!.lineWidth = borderWidth;
		this.ctx!.strokeStyle = borderColor;

		// 偏移距离，保证边框居中
		let p = borderWidth / 2;

		// 是否有圆角
		if (r != null) {
			this.drawRadius(x - p, y - p, w + 2 * p, h + 2 * p, r + p);
			this.ctx!.stroke();
		} else {
			this.ctx!.strokeRect(x - p, y - p, w + 2 * p, h + 2 * p);
		}
	}

	/**
	 * 设置变换（缩放、旋转、平移）
	 * @param options TransformOptions
	 */
	private setTransform(options: TransformOptions) {
		const ctx = this.ctx!;

		// 平移
		if (options.translateX != null || options.translateY != null) {
			ctx.translate(options.translateX ?? 0, options.translateY ?? 0);
		}

		// 旋转（角度转弧度）
		if (options.rotate != null) {
			ctx.rotate((options.rotate * Math.PI) / 180);
		}

		// 缩放
		if (options.scale != null) {
			// 统一缩放
			ctx.scale(options.scale, options.scale);
		} else if (options.scaleX != null || options.scaleY != null) {
			// 分别缩放
			ctx.scale(options.scaleX ?? 1, options.scaleY ?? 1);
		}
	}

	/**
	 * 绘制带圆角的路径
	 * @param x 左上角x
	 * @param y 左上角y
	 * @param w 宽度
	 * @param h 高度
	 * @param r 圆角半径
	 */
	private drawRadius(x: number, y: number, w: number, h: number, r: number) {
		// 圆角半径不能超过宽高一半
		const maxRadius = Math.min(w / 2, h / 2);
		const radius = Math.min(r, maxRadius);

		this.ctx!.beginPath();
		// 从左上角圆弧的结束点开始
		this.ctx!.moveTo(x + radius, y);
		// 顶边
		this.ctx!.lineTo(x + w - radius, y);
		// 右上角圆弧
		this.ctx!.arc(x + w - radius, y + radius, radius, -Math.PI / 2, 0);
		// 右边
		this.ctx!.lineTo(x + w, y + h - radius);
		// 右下角圆弧
		this.ctx!.arc(x + w - radius, y + h - radius, radius, 0, Math.PI / 2);
		// 底边
		this.ctx!.lineTo(x + radius, y + h);
		// 左下角圆弧
		this.ctx!.arc(x + radius, y + h - radius, radius, Math.PI / 2, Math.PI);
		// 左边
		this.ctx!.lineTo(x, y + radius);
		// 左上角圆弧
		this.ctx!.arc(x + radius, y + radius, radius, Math.PI, -Math.PI / 2);
		this.ctx!.closePath();
	}

	/**
	 * 裁剪图片，支持多种裁剪模式
	 * @param mode 裁剪模式
	 * @param canvasWidth 目标区域宽度
	 * @param canvasHeight 目标区域高度
	 * @param imageWidth 原图宽度
	 * @param imageHeight 原图高度
	 * @param drawX 绘制起点X
	 * @param drawY 绘制起点Y
	 * @returns CropImageResult
	 */
	private cropImage(
		mode:
			| "scaleToFill"
			| "aspectFit"
			| "aspectFill"
			| "center"
			| "top"
			| "bottom"
			| "left"
			| "right"
			| "topLeft"
			| "topRight"
			| "bottomLeft"
			| "bottomRight",
		canvasWidth: number,
		canvasHeight: number,
		imageWidth: number,
		imageHeight: number,
		drawX: number,
		drawY: number
	): CropImageResult {
		// sx, sy, sw, sh: 原图裁剪区域
		// dx, dy, dw, dh: 画布绘制区域
		let sx = 0,
			sy = 0,
			sw = imageWidth,
			sh = imageHeight;
		let dx = drawX,
			dy = drawY,
			dw = canvasWidth,
			dh = canvasHeight;

		// 计算宽高比
		const imageRatio = imageWidth / imageHeight;
		const canvasRatio = canvasWidth / canvasHeight;

		switch (mode) {
			case "scaleToFill":
				// 拉伸填充整个区域，可能变形
				break;

			case "aspectFit":
				// 保持比例完整显示，可能有留白
				if (imageRatio > canvasRatio) {
					// 图片更宽，以宽度为准
					dw = canvasWidth;
					dh = canvasWidth / imageRatio;
					dx = drawX;
					dy = drawY + (canvasHeight - dh) / 2;
				} else {
					// 图片更高，以高度为准
					dw = canvasHeight * imageRatio;
					dh = canvasHeight;
					dx = drawX + (canvasWidth - dw) / 2;
					dy = drawY;
				}
				break;

			case "aspectFill":
				// 保持比例填充，可能裁剪
				if (imageRatio > canvasRatio) {
					// 图片更宽，裁剪左右
					const scaledWidth = imageHeight * canvasRatio;
					sx = (imageWidth - scaledWidth) / 2;
					sw = scaledWidth;
				} else {
					// 图片更高，裁剪上下
					const scaledHeight = imageWidth / canvasRatio;
					sy = (imageHeight - scaledHeight) / 2;
					sh = scaledHeight;
				}
				break;

			case "center":
				// 居中显示，不缩放，超出裁剪
				sx = Math.max(0, (imageWidth - canvasWidth) / 2);
				sy = Math.max(0, (imageHeight - canvasHeight) / 2);
				sw = Math.min(imageWidth, canvasWidth);
				sh = Math.min(imageHeight, canvasHeight);
				dx = drawX + Math.max(0, (canvasWidth - imageWidth) / 2);
				dy = drawY + Math.max(0, (canvasHeight - imageHeight) / 2);
				dw = sw;
				dh = sh;
				break;

			case "top":
				// 顶部对齐，水平居中
				sx = Math.max(0, (imageWidth - canvasWidth) / 2);
				sy = 0;
				sw = Math.min(imageWidth, canvasWidth);
				sh = Math.min(imageHeight, canvasHeight);
				dx = drawX + Math.max(0, (canvasWidth - imageWidth) / 2);
				dy = drawY;
				dw = sw;
				dh = sh;
				break;

			case "bottom":
				// 底部对齐，水平居中
				sx = Math.max(0, (imageWidth - canvasWidth) / 2);
				sy = Math.max(0, imageHeight - canvasHeight);
				sw = Math.min(imageWidth, canvasWidth);
				sh = Math.min(imageHeight, canvasHeight);
				dx = drawX + Math.max(0, (canvasWidth - imageWidth) / 2);
				dy = drawY + Math.max(0, canvasHeight - imageHeight);
				dw = sw;
				dh = sh;
				break;

			case "left":
				// 左对齐，垂直居中
				sx = 0;
				sy = Math.max(0, (imageHeight - canvasHeight) / 2);
				sw = Math.min(imageWidth, canvasWidth);
				sh = Math.min(imageHeight, canvasHeight);
				dx = drawX;
				dy = drawY + Math.max(0, (canvasHeight - imageHeight) / 2);
				dw = sw;
				dh = sh;
				break;

			case "right":
				// 右对齐，垂直居中
				sx = Math.max(0, imageWidth - canvasWidth);
				sy = Math.max(0, (imageHeight - canvasHeight) / 2);
				sw = Math.min(imageWidth, canvasWidth);
				sh = Math.min(imageHeight, canvasHeight);
				dx = drawX + Math.max(0, canvasWidth - imageWidth);
				dy = drawY + Math.max(0, (canvasHeight - imageHeight) / 2);
				dw = sw;
				dh = sh;
				break;

			case "topLeft":
				// 左上角对齐
				sx = 0;
				sy = 0;
				sw = Math.min(imageWidth, canvasWidth);
				sh = Math.min(imageHeight, canvasHeight);
				dx = drawX;
				dy = drawY;
				dw = sw;
				dh = sh;
				break;

			case "topRight":
				// 右上角对齐
				sx = Math.max(0, imageWidth - canvasWidth);
				sy = 0;
				sw = Math.min(imageWidth, canvasWidth);
				sh = Math.min(imageHeight, canvasHeight);
				dx = drawX + Math.max(0, canvasWidth - imageWidth);
				dy = drawY;
				dw = sw;
				dh = sh;
				break;

			case "bottomLeft":
				// 左下角对齐
				sx = 0;
				sy = Math.max(0, imageHeight - canvasHeight);
				sw = Math.min(imageWidth, canvasWidth);
				sh = Math.min(imageHeight, canvasHeight);
				dx = drawX;
				dy = drawY + Math.max(0, canvasHeight - imageHeight);
				dw = sw;
				dh = sh;
				break;

			case "bottomRight":
				// 右下角对齐
				sx = Math.max(0, imageWidth - canvasWidth);
				sy = Math.max(0, imageHeight - canvasHeight);
				sw = Math.min(imageWidth, canvasWidth);
				sh = Math.min(imageHeight, canvasHeight);
				dx = drawX + Math.max(0, canvasWidth - imageWidth);
				dy = drawY + Math.max(0, canvasHeight - imageHeight);
				dw = sw;
				dh = sh;
				break;
		}

		return {
			// 源图片裁剪区域
			sx,
			sy,
			sw,
			sh,
			// 目标绘制区域
			dx,
			dy,
			dw,
			dh
		} as CropImageResult;
	}

	/**
	 * 获取文本每行内容（自动换行、支持省略号）
	 * @param options TextRenderOptions
	 * @returns string[] 每行内容
	 */
	private getTextRows({
		content,
		fontSize = 14,
		width = 100,
		lineClamp = 1,
		overflow,
		letterSpace = 0,
		fontFamily = "sans-serif",
		fontWeight = "normal"
	}: TextRenderOptions) {
		// 临时设置字体以便准确测量
		this.ctx!.save();
		this.ctx!.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

		let arr: string[] = [""];
		let currentLineWidth = 0;

		for (let i = 0; i < content.length; i++) {
			const char = content.charAt(i);
			const charWidth = this.ctx!.measureText(char).width;

			// 计算当前字符加上字符间距后的总宽度
			const needSpace = arr[arr.length - 1].length > 0 && letterSpace > 0;
			const totalWidth = charWidth + (needSpace ? letterSpace : 0);

			if (currentLineWidth + totalWidth > width) {
				// 换行：新行的第一个字符不需要字符间距
				currentLineWidth = charWidth;
				arr.push(char);
			} else {
				// 最后一行且设置超出省略号
				if (overflow == "ellipsis" && arr.length == lineClamp) {
					const ellipsisWidth = this.ctx!.measureText("...").width;
					const ellipsisSpaceWidth = needSpace ? letterSpace : 0;

					if (
						currentLineWidth + totalWidth + ellipsisSpaceWidth + ellipsisWidth >
						width
					) {
						arr[arr.length - 1] += "...";
						break;
					}
				}

				currentLineWidth += totalWidth;
				arr[arr.length - 1] += char;
			}
		}

		this.ctx!.restore();
		return arr;
	}

	/**
	 * 渲染块（矩形/圆角矩形）
	 * @param options DivRenderOptions
	 */
	private divRender(options: DivRenderOptions) {
		const {
			x,
			y,
			width = 0,
			height = 0,
			radius,
			backgroundColor = "#fff",
			opacity = 1,
			scale,
			scaleX,
			scaleY,
			rotate,
			translateX,
			translateY
		} = options;

		this.ctx!.save();

		// 设置透明度
		this.ctx!.globalAlpha = opacity;

		// 设置背景色
		this.setBackground(backgroundColor);
		// 设置边框
		this.setBorder(options);
		// 设置变换
		this.setTransform({
			scale,
			scaleX,
			scaleY,
			rotate,
			translateX,
			translateY
		});

		// 判断是否有圆角
		if (radius != null) {
			// 绘制圆角路径
			this.drawRadius(x, y, width, height, radius);
			// 填充
			this.ctx!.fill();
		} else {
			// 普通矩形
			this.ctx!.fillRect(x, y, width, height);
		}
		this.ctx!.restore();
	}

	/**
	 * 渲染文本
	 * @param options TextRenderOptions
	 */
	private textRender(options: TextRenderOptions) {
		let {
			fontSize = 14,
			textAlign,
			width,
			color = "#000000",
			x,
			y,
			letterSpace,
			lineHeight,
			fontFamily = "sans-serif",
			fontWeight = "normal",
			opacity = 1,
			scale,
			scaleX,
			scaleY,
			rotate,
			translateX,
			translateY
		} = options;

		// 如果行高为空，则设置为字体大小的1.4倍
		if (lineHeight == null) {
			lineHeight = fontSize * 1.4;
		}

		this.ctx!.save();

		// 应用变换
		this.setTransform({
			scale,
			scaleX,
			scaleY,
			rotate,
			translateX,
			translateY
		});

		// 设置字体样式
		this.ctx!.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

		// 设置透明度
		this.ctx!.globalAlpha = opacity;

		// 设置字体颜色
		this.ctx!.fillStyle = color;

		// 获取每行文本内容
		const rows = this.getTextRows(options);

		// 左偏移量
		let offsetLeft = 0;

		// 字体对齐（无字符间距时使用Canvas的textAlign）
		if (textAlign != null && width != null && (letterSpace == null || letterSpace <= 0)) {
			this.ctx!.textAlign = textAlign;

			switch (textAlign) {
				case "left":
					break;
				case "center":
					offsetLeft = width / 2;
					break;
				case "right":
					offsetLeft = width;
					break;
			}
		} else {
			// 有字符间距时，使用左对齐，手动控制位置
			this.ctx!.textAlign = "left";
		}

		// 计算行间距
		const lineGap = lineHeight - fontSize;

		// 逐行渲染
		for (let i = 0; i < rows.length; i++) {
			const currentRow = rows[i];
			const yPos = (i + 1) * fontSize + y + lineGap * i;

			if (letterSpace != null && letterSpace > 0) {
				// 逐字符计算宽度，确保字符间距准确
				let lineWidth = 0;
				for (let j = 0; j < currentRow.length; j++) {
					lineWidth += this.ctx!.measureText(currentRow.charAt(j)).width;
					if (j < currentRow.length - 1) {
						lineWidth += letterSpace;
					}
				}

				// 计算起始位置（考虑 textAlign）
				let startX = x;
				if (textAlign == "center" && width != null) {
					startX = x + (width - lineWidth) / 2;
				} else if (textAlign == "right" && width != null) {
					startX = x + width - lineWidth;
				}

				// 逐字符渲染
				let charX = startX;
				for (let j = 0; j < currentRow.length; j++) {
					const char = currentRow.charAt(j);
					this.ctx!.fillText(char, charX, yPos);

					// 移动到下一个字符位置
					charX += this.ctx!.measureText(char).width;
					if (j < currentRow.length - 1) {
						charX += letterSpace;
					}
				}
			} else {
				// 普通渲染（无字符间距）
				this.ctx!.fillText(currentRow, x + offsetLeft, yPos);
			}
		}

		this.ctx!.restore();
	}

	/**
	 * 渲染图片
	 * @param options ImageRenderOptions
	 */
	private async imageRender(options: ImageRenderOptions): Promise<void> {
		return new Promise((resolve) => {
			this.ctx!.save();

			// 设置透明度
			this.ctx!.globalAlpha = options.opacity ?? 1;

			// 应用变换
			this.setTransform({
				scale: options.scale,
				scaleX: options.scaleX,
				scaleY: options.scaleY,
				rotate: options.rotate,
				translateX: options.translateX,
				translateY: options.translateY
			});

			// 如果有圆角，先绘制路径并裁剪
			if (options.radius != null) {
				this.drawRadius(
					options.x,
					options.y,
					options.width,
					options.height,
					options.radius
				);
				this.ctx!.clip();
			}

			const temp = this.imageQueue[0];

			let img: Image;

			// 微信小程序/鸿蒙环境创建图片
			// #ifdef MP-WEIXIN || APP-HARMONY
			img = this.context!.createImage();
			// #endif

			// 其他环境创建图片
			// #ifndef MP-WEIXIN || APP-HARMONY
			img = new Image();
			// #endif

			img.src = temp.url;

			img.onload = () => {
				if (options.mode != null) {
					let h: number;
					let w: number;

					// #ifdef H5
					h = img["height"];
					w = img["width"];
					// #endif

					// #ifndef H5
					h = img.height;
					w = img.width;
					// #endif

					// 按模式裁剪并绘制
					const { sx, sy, sw, sh, dx, dy, dw, dh } = this.cropImage(
						options.mode,
						temp.width, // 目标绘制区域宽度
						temp.height, // 目标绘制区域高度
						w, // 原图片宽度
						h, // 原图片高度
						temp.x, // 绘制X坐标
						temp.y // 绘制Y坐标
					);

					// 使用 drawImage 的完整参数形式进行精确裁剪和绘制
					this.ctx!.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
				} else {
					// 不指定模式时，直接绘制整个图片
					this.ctx!.drawImage(img, temp.x, temp.y, temp.width, temp.height);
				}

				this.ctx!.restore();
				this.imageQueue.shift(); // 移除已渲染图片

				resolve();
			};
		});
	}

	/**
	 * 依次执行渲染队列中的所有操作
	 */
	async render() {
		for (let i = 0; i < this.renderQuene.length; i++) {
			const r = this.renderQuene[i];
			await r();
		}
	}
}

/**
 * useCanvas 钩子函数，返回 Canvas 实例
 * @param canvasId 画布ID
 * @returns Canvas
 */
export const useCanvas = (canvasId: string) => {
	return new Canvas(canvasId);
};
