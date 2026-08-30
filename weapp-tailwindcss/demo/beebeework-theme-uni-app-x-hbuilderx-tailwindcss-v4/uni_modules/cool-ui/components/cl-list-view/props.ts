import type { ClListViewItem, ClListViewGroup, ClListViewVirtualItem, PassThroughProps, ClListViewRefresherStatus } from "../../types";

export type ClListViewPassThrough = {
	className?: string;
	item?: PassThroughProps;
	itemHover?: PassThroughProps;
	list?: PassThroughProps;
	indexBar?: PassThroughProps;
	scroller?: PassThroughProps;
	refresher?: PassThroughProps;
};

export type ClListViewProps = {
	className?: string;
	pt?: ClListViewPassThrough;
	data?: ClListViewItem[];
	itemHeight?: number;
	headerHeight?: number;
	topHeight?: number;
	bottomHeight?: number;
	bufferSize?: number;
	virtual?: boolean;
	scrollIntoView?: string;
	scrollWithAnimation?: boolean;
	showScrollbar?: boolean;
	refresherEnabled?: boolean;
	refresherThreshold?: number;
	refresherBackground?: string;
	refresherDefaultText?: string;
	refresherPullingText?: string;
	refresherRefreshingText?: string;
	showBackTop?: boolean;

	scrollTop?: number;
    viewportHeight?: number;
};
