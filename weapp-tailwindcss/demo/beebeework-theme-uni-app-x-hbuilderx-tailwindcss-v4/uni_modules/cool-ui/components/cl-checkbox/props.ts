import type { ClIconProps } from "../cl-icon/props";
import type { ClTextProps } from "../cl-text/props";

export type ClCheckboxPassThrough = {
	className?: string;
	icon?: ClIconProps;
	label?: ClTextProps;
};

export type ClCheckboxProps = {
	className?: string;
	pt?: ClCheckboxPassThrough;
	modelValue?: any[] | boolean;
	label?: string;
	value?: any;
	disabled?: boolean;
	activeIcon?: string;
	inactiveIcon?: string;
	showIcon?: boolean;
};
