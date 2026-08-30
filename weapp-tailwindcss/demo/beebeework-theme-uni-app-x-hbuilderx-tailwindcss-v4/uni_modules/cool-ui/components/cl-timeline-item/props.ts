import type { PassThroughProps } from "../../types";

export type ClTimelineItemPassThrough = {
	className?: string;
	icon?: PassThroughProps;
	title?: PassThroughProps;
	content?: PassThroughProps;
	date?: PassThroughProps;
};

export type ClTimelineItemProps = {
	className?: string;
	pt?: ClTimelineItemPassThrough;
	title?: string;
	icon?: string;
	content?: string;
	date?: string;
	hideLine?: boolean;
};
