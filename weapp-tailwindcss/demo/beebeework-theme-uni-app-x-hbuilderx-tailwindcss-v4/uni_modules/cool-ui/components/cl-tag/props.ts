import type { PassThroughProps, Type } from "../../types";

export type ClTagPassThrough = {
	className?: string;
	text?: PassThroughProps;
};

export type ClTagProps = {
	className?: string;
	pt?: ClTagPassThrough;
	type?: Type;
	icon?: string;
	rounded?: boolean;
	closable?: boolean;
	plain?: boolean;
};
