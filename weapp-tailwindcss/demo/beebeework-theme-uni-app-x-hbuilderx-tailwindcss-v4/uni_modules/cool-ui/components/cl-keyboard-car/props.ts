import type { PassThroughProps } from "../../types";
import type { ClPopupProps } from "../cl-popup/props";

export type ClKeyboardCarPassThrough = {
	className?: string;
	item?: PassThroughProps;
	value?: PassThroughProps;
	popup?: ClPopupProps;
};

export type ClKeyboardCarProps = {
	className?: string;
	pt?: ClKeyboardCarPassThrough;
	modelValue?: string;
	title?: string;
	placeholder?: string;
	maxlength?: number;
	showValue?: boolean;
	inputImmediate?: boolean;
};
