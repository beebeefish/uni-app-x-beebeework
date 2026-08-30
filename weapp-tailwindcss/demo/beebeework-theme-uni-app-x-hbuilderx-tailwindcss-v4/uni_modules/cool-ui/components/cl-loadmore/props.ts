import type { PassThroughProps } from "../../types";

export type ClLoadmorePassThrough = {
	className?: string;
	icon?: PassThroughProps;
	text?: PassThroughProps;
};

export type ClLoadmoreProps = {
	className?: string;
	pt?: ClLoadmorePassThrough;
	loading?: boolean;
	loadingText?: string;
	finish?: boolean;
	finishText?: string;
	safeAreaBottom?: boolean;
};
