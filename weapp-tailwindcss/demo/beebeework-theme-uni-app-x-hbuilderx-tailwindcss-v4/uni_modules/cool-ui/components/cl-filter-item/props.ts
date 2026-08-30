import type { PassThroughProps, ClFilterItemType, ClSelectOption } from "../../types";

export type ClFilterItemPassThrough = {
	className?: string;
	label?: PassThroughProps;
};

export type ClFilterItemProps = {
	className?: string;
	pt?: ClFilterItemPassThrough;
	label?: string;
	value: any;
	type?: ClFilterItemType;
	options?: ClSelectOption[];
};
