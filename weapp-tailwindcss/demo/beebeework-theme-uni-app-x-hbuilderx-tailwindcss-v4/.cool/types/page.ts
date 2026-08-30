export type PushAnimationType =
	| "auto"
	| "none"
	| "slide-in-right"
	| "slide-in-left"
	| "slide-in-top"
	| "slide-in-bottom"
	| "fade-in"
	| "zoom-out"
	| "zoom-fade-out"
	| "pop-in";

export type BackAnimationType =
	| "auto"
	| "none"
	| "slide-out-right"
	| "slide-out-left"
	| "slide-out-top"
	| "slide-out-bottom"
	| "fade-out"
	| "zoom-in"
	| "zoom-fade-in"
	| "pop-out";

export type PushMode = "navigateTo" | "redirectTo" | "reLaunch" | "switchTab";

export type BackOptions = {
	delta?: number;
	animationType?: BackAnimationType;
	animationDuration?: number;
	success?: (result: any) => void;
	fail?: (result: any) => void;
	complete?: (result: any) => void;
};

export type PushOptions = {
	path: string;
	mode?: PushMode;
	events?: any;
	query?: UTSJSONObject;
	isAuth?: boolean;
	params?: UTSJSONObject;
	animationType?: PushAnimationType;
	routeType?: string;
	animationDuration?: number;
	success?: (result: any) => void;
	fail?: (result: any) => void;
	complete?: (result: any) => void;
};

export type PageInstance = {
	path: string;
	vm: any;
	style?: UTSJSONObject;
	query: UTSJSONObject;
	exposed: any;
	isCustomNavbar: boolean;
	meta?: UTSJSONObject;
};
