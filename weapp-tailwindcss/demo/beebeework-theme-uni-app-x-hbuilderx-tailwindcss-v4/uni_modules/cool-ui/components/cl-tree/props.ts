import type { ClTreeItem, ClTreeNodeInfo } from "../../types";

export type ClTreePassThrough = {
	className?: string;
};

export type ClTreeProps = {
	className?: string;
	pt?: ClTreePassThrough;
	modelValue?: any | any;
	list?: ClTreeItem[];
	icon?: string;
	expandIcon?: string;
	checkStrictly?: boolean;
	checkable?: boolean;
	multiple?: boolean;
};
