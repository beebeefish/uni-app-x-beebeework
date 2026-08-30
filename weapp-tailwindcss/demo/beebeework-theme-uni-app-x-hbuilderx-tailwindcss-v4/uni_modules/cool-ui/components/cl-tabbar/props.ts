import type { ClTabbarItem, PassThroughProps } from "../../types";
import type { ClTextProps } from "../cl-text/props";
import type { ClImageProps } from "../cl-image/props";

export type ClTabbarPassThrough = {
	className?: string;
	item?: PassThroughProps;
	icon?: ClImageProps;
	text?: ClTextProps;
	footer?: PassThroughProps;
	footerContent?: PassThroughProps;
};

export type ClTabbarProps = {
	className?: string;
	modelValue?: string;
	pt?: ClTabbarPassThrough;
	list?: ClTabbarItem[];
	height?: number;
	backgroundColor?: string;
	color?: string;
	selectedColor?: string;
	iconSize?: number;
	textSize?: number;
	showIcon?: boolean;
	showText?: boolean;
};
