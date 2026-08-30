import type { PassThroughProps } from "../../types";

export type ClMarqueePassThrough = {
	className?: string;
	list?: PassThroughProps;
	item?: PassThroughProps;
	image?: PassThroughProps;
};

export type ClMarqueeProps = {
	className?: string;
	pt?: ClMarqueePassThrough;
	list?: string[];
	direction?: "horizontal" | "vertical";
	duration?: number;
	itemHeight?: number;
	itemWidth?: number;
	gap?: number;
};
