import type { PassThroughProps } from "../../types";

export type ClDraggablePassThrough = {
	className?: string;
	ghost?: PassThroughProps;
};

export type ClDraggableProps = {
	className?: string;
	pt?: ClDraggablePassThrough;
	modelValue?: UTSJSONObject[];
	disabled?: boolean;
	columns?: number;
	longPress?: boolean;
};
