import type { PassThroughProps } from "../../types";

export type ClNoticebarPassThrough = {
	className?: string;
	text?: PassThroughProps;
};

export type ClNoticebarProps = {
	className?: string;
	pt?: ClNoticebarPassThrough;
	text?: string | string[];
	direction?: "horizontal" | "vertical";
	duration?: number;
	speed?: number;
	height?: string | number;
};
