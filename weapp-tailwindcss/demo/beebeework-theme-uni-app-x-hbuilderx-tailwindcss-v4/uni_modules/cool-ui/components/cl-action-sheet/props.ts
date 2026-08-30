import type { ClActionSheetItem, ClActionSheetOptions, PassThroughProps } from "../../types";
import type { ClIconProps } from "../cl-icon/props";

export type ClActionSheetPassThrough = {
	className?: string;
	item?: PassThroughProps;
	list?: PassThroughProps;
	icon?: ClIconProps;
};

export type ClActionSheetProps = {
	className?: string;
	pt?: ClActionSheetPassThrough;
};
