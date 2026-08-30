declare type ClCanvasComponentPublicInstance = {
	saveImage: () => void;
	previewImage: () => void;
	createImage: () => Promise<string>;
};
