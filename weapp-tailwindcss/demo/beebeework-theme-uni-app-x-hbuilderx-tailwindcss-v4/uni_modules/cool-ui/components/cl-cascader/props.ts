import type { ClSelectTriggerPassThrough } from "../cl-select-trigger/props";
import type { ClPopupPassThrough } from "../cl-popup/props";
import type { ClListViewItem } from "../../types";

export type ClCascaderPassThrough = {
	trigger?: ClSelectTriggerPassThrough;
	popup?: ClPopupPassThrough;
};

export type ClCascaderProps = {
	className?: string;
	pt?: ClCascaderPassThrough;
	modelValue?: string[];
	title?: string;
	placeholder?: string;
	options?: ClListViewItem[];
	showTrigger?: boolean;
	disabled?: boolean;
	labelKey?: string;
	valueKey?: string;
	textSeparator?: string;
	height?: any;
};
