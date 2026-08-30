import { Dict, dict } from "./dict";
import { User, user } from "./user";

type Store = {
	user: User;
	dict: Dict;
};

export function useStore(): Store {
	return {
		user,
		dict
	};
}

export * from "./dict";
export * from "./user";
