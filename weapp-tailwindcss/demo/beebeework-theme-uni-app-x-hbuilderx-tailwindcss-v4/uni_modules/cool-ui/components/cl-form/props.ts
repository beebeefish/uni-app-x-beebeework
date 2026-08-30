import type { ClFormLabelPosition, ClFormRule, ClFormValidateError } from "../../types";

export type ClFormPassThrough = {
	className?: string;
};

export type ClFormProps = {
	className?: string;
	pt?: ClFormPassThrough;
	modelValue?: any;
	rules?: Map<string, ClFormRule[]>;
	labelPosition?: ClFormLabelPosition;
	labelWidth?: string;
	showAsterisk?: boolean;
	showMessage?: boolean;
	disabled?: boolean;
	scrollToError?: boolean;
};
