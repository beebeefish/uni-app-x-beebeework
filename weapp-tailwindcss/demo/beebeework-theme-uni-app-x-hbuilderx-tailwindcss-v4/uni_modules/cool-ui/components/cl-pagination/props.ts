import type { PassThroughProps } from "../../types";
import type { ClIconProps } from "../cl-icon/props";

export type ClPaginationPassThrough = {
	className?: string;
	item?: PassThroughProps;
	itemText?: PassThroughProps;
	prev?: PassThroughProps;
	prevIcon?: ClIconProps;
	next?: PassThroughProps;
	nextIcon?: ClIconProps;
};

export type ClPaginationProps = {
	className?: string;
	pt?: ClPaginationPassThrough;
	modelValue?: number;
	total?: number;
	size?: number;
};
