import type { QrcodeOptions } from "./draw";
import type { ClQrcodeMode } from "../../types";

export type ClQrcodeProps = {
	className?: string;
	width?: number;
	height?: number;
	foreground?: string;
	background?: string;
	pdColor?: string | any;
	pdRadius?: number;
	text?: string;
	logo?: string;
	logoSize?: number;
	padding?: number;
	mode?: ClQrcodeMode;
};
