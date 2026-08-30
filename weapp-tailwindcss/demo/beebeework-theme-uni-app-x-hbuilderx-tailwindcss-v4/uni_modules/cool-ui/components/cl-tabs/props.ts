import type { ClTabsItem, PassThroughProps } from "../../types";

export type ClTabsPassThrough = {
	className?: string;
	text?: PassThroughProps;
	item?: PassThroughProps;
	line?: PassThroughProps;
	slider?: PassThroughProps;
};

export type ClTabsProps = {
	className?: string;
	pt?: ClTabsPassThrough;
	modelValue?: string | number;
	height?: string | number;
	list?: ClTabsItem[];
	fill?: boolean;
	gutter?: number;
	color?: string;
	unColor?: string;
	showLine?: boolean;
	showSlider?: boolean;
	disabled?: boolean;
};
