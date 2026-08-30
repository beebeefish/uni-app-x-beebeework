import type { ClSelectOption } from "../../types";

export type ClSelectPickerViewProps = {
	className?: string;
	headers?: string[];
	value?: number[];
	columns?: ClSelectOption[][];
	itemHeight?: number;
	height?: number;
};
