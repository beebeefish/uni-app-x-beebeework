import type { ClSelectOption, ClSelectValue } from "../../types";
import type { ClSelectTriggerPassThrough } from "../cl-select-trigger/props";
import type { ClPopupPassThrough } from "../cl-popup/props";

export type ClSelectPassThrough = {
	trigger?: ClSelectTriggerPassThrough;
	popup?: ClPopupPassThrough;
};

export type ClSelectProps = {
	className?: string;
	pt?: ClSelectPassThrough;
	modelValue?: ClSelectValue;
	title?: string;
	placeholder?: string;
	options?: ClSelectOption[];
	showTrigger?: boolean;
	disabled?: boolean;
	columnCount?: number;
	splitor?: string;
	confirmText?: string;
	showConfirm?: boolean;
	cancelText?: string;
	showCancel?: boolean;
};
