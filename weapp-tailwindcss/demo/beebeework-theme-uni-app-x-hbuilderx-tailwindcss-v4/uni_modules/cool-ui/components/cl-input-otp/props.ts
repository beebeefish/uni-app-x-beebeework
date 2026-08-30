import type { ClInputType, PassThroughProps } from "../../types";

export type ClInputOtpPassThrough = {
	className?: string;
	list?: PassThroughProps;
	item?: PassThroughProps;
	cursor?: PassThroughProps;
	value?: PassThroughProps;
};

export type ClInputOtpProps = {
	className?: string;
	pt?: ClInputOtpPassThrough;
	modelValue?: string;
	autofocus?: boolean;
	length?: number;
	disabled?: boolean;
	inputType?: ClInputType;
};
