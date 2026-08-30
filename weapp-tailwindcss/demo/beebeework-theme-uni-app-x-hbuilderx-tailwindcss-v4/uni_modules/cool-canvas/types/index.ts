// 文本渲染参数
export type TextRenderOptions = {
	x: number;
	y: number;
	height?: number;
	width?: number;
	content: string;
	color?: string;
	fontSize?: number;
	fontFamily?: string;
	fontWeight?: "normal" | "bold" | "bolder" | "lighter" | number;
	textAlign?: "left" | "right" | "center";
	overflow?: "ellipsis";
	lineClamp?: number;
	letterSpace?: number;
	lineHeight?: number;
	opacity?: number;
	scale?: number;
	scaleX?: number;
	scaleY?: number;
	rotate?: number;
	translateX?: number;
	translateY?: number;
};

// 图片渲染参数
export type ImageRenderOptions = {
	x: number;
	y: number;
	height: number;
	width: number;
	url: string;
	mode?:
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
		| "bottomRight";
	radius?: number;
	opacity?: number;
	scale?: number;
	scaleX?: number;
	scaleY?: number;
	rotate?: number;
	translateX?: number;
	translateY?: number;
};

// 变换参数
export type TransformOptions = {
	scale?: number;
	scaleX?: number;
	scaleY?: number;
	rotate?: number;
	translateX?: number;
	translateY?: number;
};

// 块渲染参数
export type DivRenderOptions = {
	x: number;
	y: number;
	height?: number;
	width?: number;
	radius?: number;
	backgroundColor?: string;
	borderWidth?: number;
	borderColor?: string;
	opacity?: number;
	scale?: number;
	scaleX?: number;
	scaleY?: number;
	rotate?: number;
	translateX?: number;
	translateY?: number;
};

// 裁剪图片参数
export type CropImageResult = {
	sx: number;
	sy: number;
	sw: number;
	sh: number;
	dx: number;
	dy: number;
	dw: number;
	dh: number;
};
