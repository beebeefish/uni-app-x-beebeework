import type { PassThroughProps } from "../../types";

export type ClCountdownPassThrough = {
	className?: string;
	text?: PassThroughProps;
	splitor?: PassThroughProps;
};

export type ClCountdownProps = {
	className?: string;
	pt?: ClCountdownPassThrough;
	format?: string;
	hideZero?: boolean;
	day?: number;
	hour?: number;
	minute?: number;
	second?: number;
	datetime?: Date | string;
	auto?: boolean;
};
