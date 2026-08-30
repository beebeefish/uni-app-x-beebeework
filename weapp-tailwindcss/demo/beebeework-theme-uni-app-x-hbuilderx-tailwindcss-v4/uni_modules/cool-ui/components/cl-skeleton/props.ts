import type { PassThroughProps } from "../../types";

export type ClSkeletonPassThrough = {
	className?: string;
	loading?: PassThroughProps;
};

export type ClSkeletonProps = {
	className?: string;
	pt?: ClSkeletonPassThrough;
	loading?: boolean;
	type?: "text" | "image" | "circle" | "button";
};
