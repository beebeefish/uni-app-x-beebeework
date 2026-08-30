import type { ClIconProps } from "../cl-icon/props";

export type ClAvatarPassThrough = {
	className?: string;
	icon?: ClIconProps;
};

export type ClAvatarProps = {
	className?: string;
	pt?: ClAvatarPassThrough;
	src?: string;
	size?: number;
	rounded?: boolean;
};
