import type { ClFormLabelPosition, ClFormRule, PassThroughProps } from "../../types";
import type { ClTextProps } from "../cl-text/props";

export type ClFormItemPassThrough = {
	className?: string;
	inner?: PassThroughProps;
	label?: ClTextProps;
	content?: PassThroughProps;
	error?: PassThroughProps;
};

export type ClFormItemProps = {
	className?: string;
	pt?: ClFormItemPassThrough;
	label?: string;
	prop?: string;
	rules?: ClFormRule[];
	labelPosition?: ClFormLabelPosition;
	labelWidth?: string | any;
	showAsterisk?: boolean | any;
	showMessage?: boolean | any;
	required?: boolean | any;
};
