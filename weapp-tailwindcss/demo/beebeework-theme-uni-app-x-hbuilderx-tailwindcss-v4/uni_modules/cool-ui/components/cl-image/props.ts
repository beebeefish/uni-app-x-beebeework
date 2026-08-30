import type { PassThroughProps } from "../../types";
import type { ClIconProps } from "../cl-icon/props";

export type ClImagePassThrough = {
	className?: string;
	inner?: PassThroughProps;
	error?: ClIconProps;
	loading?: PassThroughProps;
};

export type ClImageProps = {
	className?: string;
	pt?: ClImagePassThrough;
	src?: string;
	mode?: "scaleToFill" | "aspectFit" | "aspectFill" | "widthFix" | "heightFix" | "top" | "bottom" | "center" | "left" | "right" | "top left" | "top right" | "bottom left" | "bottom right";
	border?: boolean;
	preview?: boolean;
	previewList?: string[];
	height?: string | number;
	width?: string | number;
	showLoading?: boolean;
	lazyLoad?: boolean;
	fadeShow?: boolean;
	webp?: boolean;
	showMenuByLongpress?: boolean;
};
