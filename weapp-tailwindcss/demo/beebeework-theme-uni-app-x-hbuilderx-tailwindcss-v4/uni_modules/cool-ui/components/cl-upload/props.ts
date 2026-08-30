import type { ClUploadItem, PassThroughProps } from "../../types";
import type { ClIconProps } from "../cl-icon/props";
import type { ClTextProps } from "../cl-text/props";

export type ClUploadPassThrough = {
	className?: string;
	item?: PassThroughProps;
	add?: PassThroughProps;
	image?: PassThroughProps;
	icon?: ClIconProps;
	text?: ClTextProps;
};

export type ClUploadProps = {
	className?: string;
	pt?: ClUploadPassThrough;
	modelValue?: string[] | string;
	icon?: string;
	text?: string;
	sizeType?: string[] | string;
	sourceType?: string[];
	height?: any;
	width?: any;
	multiple?: boolean;
	limit?: number;
	disabled?: boolean;
	test?: boolean;
};
