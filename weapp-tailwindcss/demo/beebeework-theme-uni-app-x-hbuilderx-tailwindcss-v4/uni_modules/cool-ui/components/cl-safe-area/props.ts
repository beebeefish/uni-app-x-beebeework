export type ClSafeAreaPassThrough = {
	className?: string;
};

export type ClSafeAreaProps = {
	className?: string;
	pt?: ClSafeAreaPassThrough;
	type?: "top" | "bottom";
	transparent?: boolean;
};
