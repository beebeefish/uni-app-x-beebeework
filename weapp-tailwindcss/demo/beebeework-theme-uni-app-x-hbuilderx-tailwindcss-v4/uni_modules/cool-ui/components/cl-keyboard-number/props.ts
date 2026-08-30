import type { PassThroughProps } from "../../types";
import type { ClPopupProps } from "../cl-popup/props";

export type ClKeyboardNumberPassThrough = {
	className?: string;
	item?: PassThroughProps;
	value?: PassThroughProps;
	popup?: ClPopupProps;
};

export type ClKeyboardNumberProps = {
	className?: string;
	pt?: ClKeyboardNumberPassThrough;
	modelValue?: string;
	type?: "number" | "digit" | "idcard";
	title?: string;
	placeholder?: string;
	maxlength?: number;
	confirmText?: string;
	showValue?: boolean;
	inputImmediate?: boolean;
};
