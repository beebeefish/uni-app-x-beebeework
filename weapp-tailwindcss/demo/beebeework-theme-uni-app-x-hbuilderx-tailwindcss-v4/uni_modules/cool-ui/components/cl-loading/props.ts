import type { ClIconProps } from "../cl-icon/props";

export type ClLoadingPassThrough = {
	className?: string;
	icon?: ClIconProps;
};

export type ClLoadingProps = {
	className?: string;
	pt?: ClLoadingPassThrough;
	loading?: boolean;
	size?: number;
	color?: string;
};
