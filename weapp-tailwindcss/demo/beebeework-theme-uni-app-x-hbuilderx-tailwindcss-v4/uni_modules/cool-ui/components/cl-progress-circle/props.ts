import type { PassThroughProps } from "../../types";

export type ClProgressCirclePassThrough = {
	className?: string;
	text?: PassThroughProps;
};

export type ClProgressCircleProps = {
	className?: string;
	pt?: ClProgressCirclePassThrough;
	value?: number;
	size?: number;
	strokeWidth?: number;
	color?: string | any;
	unColor?: string | any;
	showText?: boolean;
	unit?: string;
	startAngle?: number;
	clockwise?: boolean;
	duration?: number;
};
