import type { ClIconProps } from "../cl-icon/props";
import type { ClButtonType, Size } from "../../types";
import type { ClLoadingProps } from "../cl-loading/props";
import type { ClTextProps } from "../cl-text/props";

export type ClButtonPassThrough = {
	className?: string;
	label?: ClTextProps;
	icon?: ClIconProps;
	loading?: ClLoadingProps;
};

export type ClButtonProps = {
	className?: string;
	pt?: ClButtonPassThrough;
	type?: ClButtonType;
	color?: string;
	icon?: string;
	text?: boolean;
	rounded?: boolean;
	border?: boolean;
	loading?: boolean;
	disabled?: boolean;
	size?: Size;
	hoverClass?: string;
	hoverStopPropagation?: boolean;
	hoverStartTime?: number;
	hoverStayTime?: number;
	formType?: "submit" | "reset";
	openType?: "agreePrivacyAuthorization" | "feedback" | "share" | "getUserInfo" | "contact" | "getPhoneNumber" | "launchApp" | "openSetting" | "chooseAvatar" | "getAuthorize" | "lifestyle" | "contactShare" | "openGroupProfile" | "openGuildProfile" | "openPublicProfile" | "shareMessageToFriend" | "addFriend" | "addColorSign" | "addGroupApp" | "addToFavorites" | "chooseAddress" | "chooseInvoiceTitle" | "login" | "subscribe" | "favorite" | "watchLater" | "openProfile" | "liveActivity" | "getRealtimePhoneNumber";
	lang?: "en" | "zh_CN" | "zh_TW";
	sessionFrom?: string;
	sendMessageTitle?: string;
	sendMessagePath?: string;
	sendMessageImg?: string;
	showMessageCard?: boolean;
	appParameter?: string;
	groupId?: string;
	guildId?: string;
	publicId?: string;
	phoneNumberNoQuotaToast?: boolean;
	createliveactivity?: boolean;
	fluid?: boolean;
};
