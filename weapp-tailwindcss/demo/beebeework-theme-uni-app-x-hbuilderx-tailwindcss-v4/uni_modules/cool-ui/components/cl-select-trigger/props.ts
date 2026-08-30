import type { ClIconProps } from "../cl-icon/props";
import type { PassThroughProps } from "../../types";
import type { ClTextProps } from "../cl-text/props";

export type ClSelectTriggerPassThrough = {
	className?: string;
	icon?: ClIconProps;
	placeholder?: PassThroughProps;
	text?: ClTextProps;
};

export type ClSelectTriggerProps = {
	className?: string;
	pt?: ClSelectTriggerPassThrough;
	text?: string;
	placeholder?: string;
	arrowIcon?: string;
	disabled?: boolean;
	focus?: boolean;
};
