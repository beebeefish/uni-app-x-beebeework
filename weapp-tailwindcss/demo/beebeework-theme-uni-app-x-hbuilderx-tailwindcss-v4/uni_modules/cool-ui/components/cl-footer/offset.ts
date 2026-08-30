import { router } from "@/.cool";
import { reactive } from "vue";

export class ClFooterOffset {
	private data = reactive({});

	set(value: number): void {
		this.data[router.path()] = value;
	}

	get(): number {
		return (this.data[router.path()] as number | null) ?? 0;
	}
}

export const clFooterOffset = new ClFooterOffset();
