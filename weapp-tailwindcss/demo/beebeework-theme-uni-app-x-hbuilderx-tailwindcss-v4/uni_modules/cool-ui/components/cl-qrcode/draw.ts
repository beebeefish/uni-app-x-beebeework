/**
 * 导入所需的工具函数和依赖
 */
import { isNull } from "@/.cool";
import { generateFrame } from "./qrcode";
import type { ClQrcodeMode } from "../../types";

/**
 * 二维码生成配置选项接口
 * 定义了生成二维码所需的所有参数
 */
export type QrcodeOptions = {
	ecc: string; // 纠错级别,可选 L/M/Q/H,纠错能力依次增强
	text: string; // 二维码内容,要编码的文本
	size: number; // 二维码尺寸,单位px
	foreground: string; // 前景色,二维码数据点的颜色
	background: string; // 背景色,二维码背景的颜色
	padding: number; // 内边距,二维码四周留白的距离
	logo: string; // logo图片地址,可以在二维码中心显示logo
	logoSize: number; // logo尺寸,logo图片的显示大小
	mode: ClQrcodeMode; // 二维码样式模式,支持矩形、圆形、线条、小方块
	pdColor: string | null; // 定位点颜色,三个角上定位图案的颜色,为null时使用前景色
	pdRadius: number; // 定位图案圆角半径,为0时绘制直角矩形
};

/**
 * 获取当前设备的像素比
 * 用于处理高分屏显示
 * @returns 设备像素比
 */
function getRatio() {
	// #ifdef APP || MP-WEIXIN
	return uni.getWindowInfo().pixelRatio; // App和小程序环境
	// #endif

	// #ifdef H5
	return window.devicePixelRatio; // H5环境
	// #endif
}

/**
 * 绘制圆角矩形
 * 兼容不同平台的圆角矩形绘制方法
 * @param ctx Canvas上下文
 * @param x 矩形左上角x坐标
 * @param y 矩形左上角y坐标
 * @param width 矩形宽度
 * @param height 矩形高度
 * @param radius 圆角半径
 */
function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number
) {
	if (radius <= 0) {
		// 圆角半径为0时直接绘制矩形
		ctx.fillRect(x, y, width, height);
		return;
	}

	// 限制圆角半径不超过矩形的一半
	const maxRadius = Math.min(width, height) / 2;
	const r = Math.min(radius, maxRadius);

	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + width - r, y);
	ctx.arcTo(x + width, y, x + width, y + r, r);
	ctx.lineTo(x + width, y + height - r);
	ctx.arcTo(x + width, y + height, x + width - r, y + height, r);
	ctx.lineTo(x + r, y + height);
	ctx.arcTo(x, y + height, x, y + height - r, r);
	ctx.lineTo(x, y + r);
	ctx.arcTo(x, y, x + r, y, r);
	ctx.closePath();
	ctx.fill();
}

/**
 * 绘制定位图案
 * 绘制7x7的定位图案,包含外框、内框和中心点
 * @param ctx Canvas上下文
 * @param startX 定位图案起始X坐标
 * @param startY 定位图案起始Y坐标
 * @param px 单个像素点大小
 * @param pdColor 定位图案颜色
 * @param background 背景颜色
 * @param radius 圆角半径
 */
function drawPositionPattern(
	ctx: CanvasRenderingContext2D,
	startX: number,
	startY: number,
	px: number,
	pdColor: string,
	background: string,
	radius: number
) {
	const patternSize = px * 7; // 定位图案总尺寸 7x7

	// 绘制外层边框 (7x7)
	ctx.fillStyle = pdColor;
	drawRoundedRect(ctx, startX, startY, patternSize, patternSize, radius);

	// 绘制内层空心区域 (5x5)
	ctx.fillStyle = background;
	const innerStartX = startX + px;
	const innerStartY = startY + px;
	const innerSize = px * 5;
	const innerRadius = Math.max(0, radius - px); // 内层圆角适当减小
	drawRoundedRect(ctx, innerStartX, innerStartY, innerSize, innerSize, innerRadius);

	// 绘制中心实心区域 (3x3)
	ctx.fillStyle = pdColor;
	const centerStartX = startX + px * 2;
	const centerStartY = startY + px * 2;
	const centerSize = px * 3;
	const centerRadius = Math.max(0, radius - px * 2); // 中心圆角适当减小
	drawRoundedRect(ctx, centerStartX, centerStartY, centerSize, centerSize, centerRadius);
}

/**
 * 绘制二维码到Canvas上下文
 * 主要的二维码绘制函数,处理不同平台的兼容性
 * @param context Canvas上下文对象
 * @param options 二维码配置选项
 */
export function drawQrcode(context: CanvasContext, options: QrcodeOptions) {
	// 获取2D绘图上下文
	const ctx = context.getContext("2d")!;
	if (isNull(ctx)) return;

	// 获取设备像素比,用于高清适配
	const ratio = getRatio();

	// App和小程序平台的画布初始化
	// #ifdef APP || MP-WEIXIN
	const c1 = ctx.canvas;
	// 清空画布并设置尺寸
	ctx.clearRect(0, 0, c1.offsetWidth, c1.offsetHeight);
	c1.width = c1.offsetWidth * ratio;
	c1.height = c1.offsetHeight * ratio;
	// #endif

	// #ifdef APP
	ctx.reset();
	// #endif

	// H5平台的画布初始化
	// #ifdef H5
	const c2 = context as HTMLCanvasElement;
	c2.width = c2.offsetWidth * ratio;
	c2.height = c2.offsetHeight * ratio;
	// #endif

	// 缩放画布以适配高分屏
	ctx.scale(ratio, ratio);

	// 生成二维码数据矩阵
	const frame = generateFrame(options.text, options.ecc);
	const points = frame.frameBuffer; // 点阵数据
	const width = frame.width; // 矩阵宽度

	// 计算二维码内容区域大小（减去四周的padding）
	const contentSize = options.size - options.padding * 2;
	// 计算每个数据点的实际像素大小
	const px = contentSize / width;
	// 二维码内容的起始位置（考虑padding）
	const offsetX = options.padding;
	const offsetY = options.padding;

	// 绘制整个画布背景
	ctx.fillStyle = options.background;
	ctx.fillRect(0, 0, options.size, options.size);

	/**
	 * 判断坐标点是否在定位图案区域内
	 * 二维码三个角上的定位图案是7x7的方块
	 * @param i 横坐标
	 * @param j 纵坐标
	 * @param width 二维码宽度
	 * @returns 是否是定位点
	 */
	function isPositionDetectionPattern(i: number, j: number, width: number): boolean {
		// 判断三个角的定位图案(7x7)
		if (i < 7 && j < 7) return true; // 左上角
		if (i > width - 8 && j < 7) return true; // 右上角
		if (i < 7 && j > width - 8) return true; // 左下角
		return false;
	}

	/**
	 * 判断坐标点是否在Logo区域内(包含缓冲区)
	 * @param i 横坐标
	 * @param j 纵坐标
	 * @param width 二维码宽度
	 * @param logoSize logo尺寸(像素)
	 * @param px 单个数据点像素大小
	 * @returns 是否在logo区域内
	 */
	function isInLogoArea(
		i: number,
		j: number,
		width: number,
		logoSize: number,
		px: number
	): boolean {
		if (logoSize <= 0) return false;

		// 计算logo在矩阵中占用的点数，限制最大不超过二维码总宽度的25%
		// 根据二维码标准，中心区域最多可以遮挡约30%的数据，但为了确保识别率，我们限制在20%
		const maxLogoRatio = 0.2; // 20%的区域用于logo
		const maxLogoPoints = Math.floor(width * maxLogoRatio);
		const logoPoints = Math.min(Math.ceil(logoSize / px), maxLogoPoints);
		
		// 减少缓冲区，只保留必要的边距，避免过度遮挡数据
		// 当logo较小时不需要缓冲区，当logo较大时才添加最小缓冲区
		const buffer = logoPoints > width * 0.1 ? 1 : 0;
		const totalLogoPoints = logoPoints + buffer * 2;

		// 计算logo区域在矩阵中的中心位置
		const centerI = Math.floor(width / 2);
		const centerJ = Math.floor(width / 2);

		// 计算logo区域的边界
		const halfSize = Math.floor(totalLogoPoints / 2);
		const minI = centerI - halfSize;
		const maxI = centerI + halfSize;
		const minJ = centerJ - halfSize;
		const maxJ = centerJ + halfSize;

		// 判断当前点是否在logo区域内
		return i >= minI && i <= maxI && j >= minJ && j <= maxJ;
	}

	// 先绘制定位图案
	const pdColor = options.pdColor ?? options.foreground;
	const radius = options.pdRadius;

	// 绘制三个定位图案
	// 左上角 (0, 0)
	drawPositionPattern(ctx, offsetX, offsetY, px, pdColor, options.background, radius);
	// 右上角 (width-7, 0)
	drawPositionPattern(
		ctx,
		offsetX + (width - 7) * px,
		offsetY,
		px,
		pdColor,
		options.background,
		radius
	);
	// 左下角 (0, width-7)
	drawPositionPattern(
		ctx,
		offsetX,
		offsetY + (width - 7) * px,
		px,
		pdColor,
		options.background,
		radius
	);

	// 点的间距,用于圆形和小方块模式
	const dot = px * 0.1;

	// 遍历绘制数据点(跳过定位图案区域和logo区域)
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < width; j++) {
			if (points[j * width + i] > 0) {
				// 跳过定位图案区域
				if (isPositionDetectionPattern(i, j, width)) {
					continue;
				}

				// 跳过logo区域(包含缓冲区)
				if (options.logo != "" && isInLogoArea(i, j, width, options.logoSize, px)) {
					continue;
				}

				// 绘制数据点
				ctx.fillStyle = options.foreground;
				const x = offsetX + px * i;
				const y = offsetY + px * j;

				// 根据不同模式绘制数据点
				switch (options.mode) {
					case "line": // 线条模式 - 绘制水平线条
						ctx.fillRect(x, y, px, px / 2);
						break;

					case "circular": // 圆形模式 - 绘制圆点
						ctx.beginPath();
						const rx = x + px / 2 - dot;
						const ry = y + px / 2 - dot;
						ctx.arc(rx, ry, px / 2 - dot, 0, 2 * Math.PI);
						ctx.fill();
						ctx.closePath();
						break;

					case "rectSmall": // 小方块模式 - 绘制小一号的方块
						ctx.fillRect(x + dot, y + dot, px - dot * 2, px - dot * 2);
						break;

					default: // 默认实心方块模式
						ctx.fillRect(x, y, px, px);
				}
			}
		}
	}

	// 绘制 Logo
	if (options.logo != "") {
		let img: Image;

		// 微信小程序环境创建图片
		// #ifdef MP-WEIXIN || APP-HARMONY
		img = context.createImage();
		// #endif

		// 其他环境创建图片
		// #ifndef MP-WEIXIN || APP-HARMONY
		img = new Image(options.logoSize, options.logoSize);
		// #endif

		// 设置图片加载完成后的回调，然后设置图片源
		img.onload = () => {
			drawLogo(ctx, options, img);
		};
		img.src = options.logo;
	}
}

/**
 * 在二维码中心绘制Logo
 * 在二维码中心位置绘制Logo图片,优化背景处理以减少对二维码数据的影响
 * @param ctx Canvas上下文
 * @param options 二维码配置
 * @param img Logo图片对象
 */
function drawLogo(ctx: CanvasRenderingContext2D, options: QrcodeOptions, img: Image) {
	ctx.save(); // 保存当前绘图状态

	// 计算二维码内容区域的中心位置（考虑padding）
	const contentSize = options.size - options.padding * 2;
	const contentCenterX = options.padding + contentSize / 2;
	const contentCenterY = options.padding + contentSize / 2;

	// 优化背景处理：减少背景边距，最小化对二维码数据的影响
	// 背景边距从6px减少到3px，降低对数据点的遮挡
	const backgroundPadding = 3; // 背景比logo大3px
	const backgroundSize = options.logoSize + backgroundPadding * 2;

	// 绘制白色背景作为Logo的底色（适当大于logo以确保可读性）
	ctx.fillStyle = options.background; // 使用二维码背景色而不是固定白色，保持一致性
	const backgroundX = contentCenterX - backgroundSize / 2;
	const backgroundY = contentCenterY - backgroundSize / 2;
	
	// 绘制圆角背景，让logo与二维码更好融合
	const cornerRadius = Math.min(backgroundSize * 0.1, 6); // 背景圆角半径
	drawRoundedRect(ctx, backgroundX, backgroundY, backgroundSize, backgroundSize, cornerRadius);

	// 获取图片信息后绘制Logo
	uni.getImageInfo({
		src: options.logo,
		success: (imgInfo) => {
			// 计算logo的精确位置
			const logoX = contentCenterX - options.logoSize / 2;
			const logoY = contentCenterY - options.logoSize / 2;

			// 绘制Logo图片，减少边距从3px到1.5px，让logo更大一些
			const logoPadding = 1.5;
			const actualLogoSize = options.logoSize - logoPadding * 2;
			
			// #ifdef APP-HARMONY
			ctx.drawImage(
				img,
				logoX + logoPadding,
				logoY + logoPadding,
				actualLogoSize,
				actualLogoSize,
				0,
				0,
				imgInfo.width,
				imgInfo.height
			);
			// #endif

			// #ifndef APP-HARMONY
			ctx.drawImage(img, logoX + logoPadding, logoY + logoPadding, actualLogoSize, actualLogoSize);
			// #endif

			ctx.restore(); // 恢复之前的绘图状态
		},
		fail(err) {
			console.error(err);
		}
	});
}
