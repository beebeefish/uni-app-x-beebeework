export {};

declare module "vue" {
	export interface GlobalComponents {
		"cl-svg": (typeof import("./components/cl-svg/cl-svg.uvue"))["default"];
	}
}

declare module "@/uni_modules/cool-svg" {
	export class CoolSvg {
		constructor(element: UniNativeViewElement): void;
		load(src: string, color: string): void;
	}
}
