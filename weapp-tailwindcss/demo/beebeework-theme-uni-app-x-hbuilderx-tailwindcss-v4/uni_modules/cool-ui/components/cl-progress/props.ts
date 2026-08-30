import type { PassThroughProps } from "../../types";

export type ClProgressPassThrough = {
	className?: string;
	outer?: PassThroughProps;
	inner?: PassThroughProps;
	text?: PassThroughProps;
};

export type ClProgressProps = {
	className?: string;
	pt?: ClProgressPassThrough;
	value?: number;
	strokeWidth?: number;
	showText?: boolean;
	color?: string;
	unColor?: string;
};
