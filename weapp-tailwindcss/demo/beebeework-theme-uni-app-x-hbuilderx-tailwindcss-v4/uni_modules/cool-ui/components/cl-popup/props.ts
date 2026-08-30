import type { ClPopupDirection, PassThroughProps } from "../../types";

export type ClPopupHeaderPassThrough = {
	className?: string;
	text?: PassThroughProps;
};

export type ClPopupPassThrough = {
	className?: string;
	inner?: PassThroughProps;
	header?: ClPopupHeaderPassThrough;
	container?: PassThroughProps;
	mask?: PassThroughProps;
	draw?: PassThroughProps;
};

export type ClPopupProps = {
	className?: string;
	pt?: ClPopupPassThrough;
	modelValue?: boolean;
	title?: string;
	direction?: ClPopupDirection;
	size?: any;
	showHeader?: boolean;
	showClose?: boolean;
	showMask?: boolean;
	maskClosable?: boolean;
	swipeClose?: boolean;
	swipeCloseThreshold?: number;
	pointerEvents?: "auto" | "none";
	keepAlive?: boolean;
	enablePortal?: boolean;
};
