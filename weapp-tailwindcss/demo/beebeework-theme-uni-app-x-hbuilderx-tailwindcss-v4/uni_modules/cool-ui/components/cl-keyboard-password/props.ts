import type { PassThroughProps } from "../../types";
import type { ClPopupProps } from "../cl-popup/props";

export type ClKeyboardPasswordPassThrough = {
	className?: string;
	item?: PassThroughProps;
	value?: PassThroughProps;
	popup?: ClPopupProps;
};

export type ClKeyboardPasswordProps = {
	className?: string;
	pt?: ClKeyboardPasswordPassThrough;
	modelValue?: string;
	title?: string;
	placeholder?: string;
	minlength?: number;
	maxlength?: number;
	confirmText?: string;
	showValue?: boolean;
	inputImmediate?: boolean;
	encrypt?: boolean;
};
