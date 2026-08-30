import type { ClSelectOption } from "../../types";
import type { ClSelectTriggerPassThrough } from "../cl-select-trigger/props";
import type { ClPopupPassThrough } from "../cl-popup/props";

export type ClSelectTimePassThrough = {
	trigger?: ClSelectTriggerPassThrough;
	popup?: ClPopupPassThrough;
};

export type ClSelectTimeProps = {
	className?: string;
	pt?: ClSelectTimePassThrough;
	modelValue?: string;
	headers?: string[];
	type?: "hour" | "minute" | "second";
	title?: string;
	placeholder?: string;
	showTrigger?: boolean;
	disabled?: boolean;
	confirmText?: string;
	showConfirm?: boolean;
	cancelText?: string;
	showCancel?: boolean;
	labelFormat?: string | any;
};
