import type { PassThroughProps, Type } from "../../types";

export type ClBadgePassThrough = {
	className?: string;
	text?: PassThroughProps;
};

export type ClBadgeProps = {
	className?: string;
	pt?: ClBadgePassThrough;
	type?: Type;
	dot?: boolean;
	value?: any;
	position?: boolean;
};
