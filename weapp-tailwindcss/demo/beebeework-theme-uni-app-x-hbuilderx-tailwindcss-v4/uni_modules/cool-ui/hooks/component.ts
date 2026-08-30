import { parse } from "@/.cool";
import type { ClCascaderOption, ClListViewItem, ClTreeItem } from "../types";

export function useListView(data: UTSJSONObject[]) {
	return data.map((e) => {
		return parse<ClListViewItem>({
			...e,
			value: e
		})!;
	});
}

export function useCascader(data: UTSJSONObject[]) {
	return data.map((e) => parse<ClCascaderOption>(e)!);
}

export function useTree(data: UTSJSONObject[]) {
	return data.map((e) => {
		return parse<ClTreeItem>({
			...e,
			value: e
		})!;
	});
}
