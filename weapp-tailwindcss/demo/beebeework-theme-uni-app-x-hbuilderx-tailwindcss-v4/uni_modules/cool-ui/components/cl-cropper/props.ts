import type { PassThroughProps } from "../../types";

export type ClCropperPassThrough = {
	className?: string;
	image?: PassThroughProps;
	op?: PassThroughProps;
	opItem?: PassThroughProps;
	mask?: PassThroughProps;
	cropBox?: PassThroughProps;
};

export type ClCropperProps = {
	className?: string;
	pt?: ClCropperPassThrough;
	cropWidth?: number;
	cropHeight?: number;
	maxScale?: number;
	resizable?: boolean;
};
