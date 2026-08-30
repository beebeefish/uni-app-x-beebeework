import type { ClSelectSeatItem, ClSelectSeatValue } from "../../types";

export type ClSelectSeatProps = {
	className?: string;
	modelValue?: ClSelectSeatValue[];
	rows?: number;
	cols?: number;
	seatGap?: number;
	borderRadius?: number;
	borderWidth?: number;
	minScale?: number;
	maxScale?: number;
	color?: string;
	darkColor?: string;
	bgColor?: string;
	darkBgColor?: string;
	borderColor?: string;
	darkBorderColor?: string;
	selectedBgColor?: string;
	selectedColor?: string;
	selectedIcon?: string;
	selectedImage?: string;
	image?: string;
	width?: number;
	height?: number;
	seats?: ClSelectSeatItem[];
};
