import type { PassThroughProps } from "../../types";
import type { ClIconProps } from "../cl-icon/props";

export type ClInputNumberValuePassThrough = {
	className?: string;
	input?: PassThroughProps;
};

export type ClInputNumberOpPassThrough = {
	className?: string;
	minus?: PassThroughProps;
	plus?: PassThroughProps;
	icon?: ClIconProps;
};

export type ClInputNumberPassThrough = {
	className?: string;
	value?: ClInputNumberValuePassThrough;
	op?: ClInputNumberOpPassThrough;
};

export type ClInputNumberProps = {
	className?: string;
	modelValue?: number;
	pt?: ClInputNumberPassThrough;
	placeholder?: string;
	step?: number;
	max?: number;
	min?: number;
	inputType?: "digit" | "number";
	inputable?: boolean;
	disabled?: boolean;
	size?: number | string;
};
