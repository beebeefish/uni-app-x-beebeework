import type { PassThroughProps } from "../../types";
import type { ClLoadingProps } from "../cl-loading/props";

export type ClSwitchPassThrough = {
	className?: string;
	track?: PassThroughProps;
	thumb?: PassThroughProps;
	loading?: ClLoadingProps;
};

export type ClSwitchProps = {
	className?: string;
	pt?: ClSwitchPassThrough;
	modelValue?: boolean;
	disabled?: boolean;
	loading?: boolean;
	height?: number;
	width?: number;
};
