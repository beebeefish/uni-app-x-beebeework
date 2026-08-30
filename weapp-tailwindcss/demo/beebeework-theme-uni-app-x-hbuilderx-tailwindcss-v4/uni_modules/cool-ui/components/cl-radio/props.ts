import type { ClIconProps } from "../cl-icon/props";
import type { ClTextProps } from "../cl-text/props";

export type ClRadioPassThrough = {
	className?: string;
	icon?: ClIconProps;
	label?: ClTextProps;
};

export type ClRadioProps = {
	className?: string;
	pt?: ClRadioPassThrough;
	modelValue?: any;
	activeIcon?: string;
	inactiveIcon?: string;
	showIcon?: boolean;
	label?: string;
	value?: any;
	disabled?: boolean;
};
