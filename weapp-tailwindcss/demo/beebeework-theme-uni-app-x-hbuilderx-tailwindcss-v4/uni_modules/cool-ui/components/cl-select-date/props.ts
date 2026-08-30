import type { ClSelectDateShortcut, ClSelectOption } from "../../types";
import type { ClSelectTriggerPassThrough } from "../cl-select-trigger/props";
import type { ClPopupPassThrough } from "../cl-popup/props";

export type ClSelectDatePassThrough = {
	trigger?: ClSelectTriggerPassThrough;
	popup?: ClPopupPassThrough;
};

export type ClSelectDateProps = {
	className?: string;
	pt?: ClSelectDatePassThrough;
	modelValue?: string;
	values?: string[];
	headers?: string[];
	title?: string;
	placeholder?: string;
	showTrigger?: boolean;
	disabled?: boolean;
	confirmText?: string;
	showConfirm?: boolean;
	cancelText?: string;
	showCancel?: boolean;
	labelFormat?: string;
	valueFormat?: string;
	start?: string;
	end?: string;
	type?: "year" | "month" | "date" | "hour" | "minute" | "second";
	rangeable?: boolean;
	startPlaceholder?: string;
	endPlaceholder?: string;
	rangeSeparator?: string;
	showShortcuts?: boolean;
	shortcuts?: ClSelectDateShortcut[];
};
