import type { PassThroughProps } from "../../types";
import type { ClIconProps } from "../cl-icon/props";

export type ClRatePassThrough = {
	className?: string;
	item?: PassThroughProps;
	icon?: ClIconProps;
	score?: PassThroughProps;
};

export type ClRateProps = {
	className?: string;
	pt?: ClRatePassThrough;
	modelValue?: number;
	max?: number;
	disabled?: boolean;
	allowHalf?: boolean;
	showScore?: boolean;
	size?: number;
	icon?: string;
	voidIcon?: string;
	color?: string;
	voidColor?: string;
};
