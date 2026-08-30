export type ClSignPassThrough = {
	className?: string;
};

export type ClSignProps = {
	className?: string;
	pt?: ClSignPassThrough;
	width?: number;
	height?: number;
	strokeColor?: string;
	strokeWidth?: number;
	backgroundColor?: string;
	enableBrush?: boolean;
	minStrokeWidth?: number;
	maxStrokeWidth?: number;
	velocitySensitivity?: number;
};
