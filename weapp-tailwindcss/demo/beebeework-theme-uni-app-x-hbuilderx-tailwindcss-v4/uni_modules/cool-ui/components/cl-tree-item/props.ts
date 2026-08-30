import type { ClTreeItem, PassThroughProps } from "../../types";
import type { ClIconProps } from "../cl-icon/props";

export type ClTreeItemPassThrough = {
	item?: PassThroughProps;
	itemChecked?: PassThroughProps;
	itemWrapper?: PassThroughProps;
	expand?: PassThroughProps;
	expandIcon?: ClIconProps;
	checkbox?: PassThroughProps;
	checkedIcon?: ClIconProps;
	halfCheckedIcon?: ClIconProps;
	uncheckedIcon?: ClIconProps;
	label?: PassThroughProps;
};

export type ClTreeItemProps = {
	className?: string;
	pt?: ClTreeItemPassThrough;
	item?: ClTreeItem;
	level?: number;
};
