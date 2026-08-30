import type { PassThroughProps } from "../../types";

export type ClReadMorePassThrough = {
	className?: string;
	wrapper?: PassThroughProps;
	content?: PassThroughProps;
	contentText?: PassThroughProps;
	mask?: PassThroughProps;
	toggle?: PassThroughProps;
};

export type ClReadMoreProps = {
	className?: string;
	pt?: ClReadMorePassThrough;
	modelValue?: boolean;
	content?: string;
	height?: number;
	expandText?: string;
	collapseText?: string;
	expandIcon?: string;
	collapseIcon?: string;
	disabled?: boolean;
	showToggle?: boolean;
	showMask?: boolean;
};
