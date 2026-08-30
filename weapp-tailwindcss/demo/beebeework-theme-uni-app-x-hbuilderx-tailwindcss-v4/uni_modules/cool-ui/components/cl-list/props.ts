import type { ClListItem, PassThroughProps } from "../../types";
import type { ClListItemPassThrough } from "../cl-list-item/props";

export type ClListPassThrough = {
	className?: string;
	list?: PassThroughProps;
	item?: ClListItemPassThrough;
};

export type ClListProps = {
	className?: string;
	pt?: ClListPassThrough;
	list?: ClListItem[];
	border?: boolean;
};
