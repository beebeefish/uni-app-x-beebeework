import { computed, ref, type ComputedRef } from "vue";
import type { ClFormRule, ClFormValidateError } from "../types";
import { useParent } from "@/.cool";

export class Form {
	public formRef = ref<ClFormComponentPublicInstance | null>(null);
	public disabled: ComputedRef<boolean>;

	constructor() {
		// 获取 cl-form 实例
		if (this.formRef.value == null) {
			const ClForm = useParent<ClFormComponentPublicInstance>("cl-form");

			if (ClForm != null) {
				this.formRef.value = ClForm;
			}
		}

		// 监听表单是否禁用
		this.disabled = computed<boolean>(() => {
			if (this.formRef.value == null) {
				return false;
			}

			return this.formRef.value.disabled;
		});
	}

	// 注册表单字段
	addField = (prop: string, rules: ClFormRule[]): void => {
		this.formRef.value!.addField(prop, rules);
	};

	// 注销表单字段
	removeField = (prop: string): void => {
		this.formRef.value!.removeField(prop);
	};

	// 获取字段值
	getValue = (prop: string): any | null => {
		return this.formRef.value!.getValue(prop);
	};

	// 设置字段错误信息
	setError = (prop: string, error: string): void => {
		this.formRef.value!.setError(prop, error);
	};

	// 获取字段错误信息
	getError = (prop: string): string => {
		return this.formRef.value!.getError(prop);
	};

	// 获取所有错误信息
	getErrors = async (): Promise<ClFormValidateError[]> => {
		return this.formRef.value!.getErrors();
	};

	// 移除字段错误信息
	removeError = (prop: string): void => {
		this.formRef.value!.removeError(prop);
	};

	// 清除所有错误信息
	clearErrors = (): void => {
		this.formRef.value!.clearErrors();
	};

	// 获取字段规则
	getRule = (prop: string): ClFormRule[] => {
		return this.formRef.value!.getRule(prop);
	};

	// 设置字段规则
	setRule = (prop: string, rules: ClFormRule[]): void => {
		this.formRef.value!.setRule(prop, rules);
	};

	// 移除字段规则
	removeRule = (prop: string): void => {
		this.formRef.value!.removeRule(prop);
	};

	// 验证单个规则
	validateRule = (value: any | null, rule: ClFormRule): string | null => {
		return this.formRef.value!.validateRule(value, rule);
	};

	// 清除所有验证
	clearValidate = (): void => {
		this.formRef.value!.clearValidate();
	};

	// 验证单个字段
	validateField = (prop: string): string | null => {
		return this.formRef.value!.validateField(prop);
	};

	// 验证整个表单
	validate = (callback: (valid: boolean, errors: ClFormValidateError[]) => void): void => {
		this.formRef.value!.validate(callback);
	};

	// 检查字段是否存在错误
	isError = (prop: string): boolean => {
		return this.formRef.value!.getError(prop) != "";
	};
}

class FormItem {
	public formItemRef = ref<ClFormItemComponentPublicInstance | null>(null);
	public isError: ComputedRef<boolean>;

	constructor() {
		const { isError } = new Form();

		if (this.formItemRef.value == null) {
			const ClFormItem = useParent<ClFormItemComponentPublicInstance>("cl-form-item");

			if (ClFormItem != null) {
				this.formItemRef.value = ClFormItem;
			}
		}

		// 监听表单字段是否验证错误
		this.isError = computed<boolean>(() => {
			if (this.formItemRef.value == null) {
				return false;
			}

			return isError(this.formItemRef.value.prop);
		});
	}
}

export const useForm = (): Form => {
	return new Form();
};

export const useFormItem = (): FormItem => {
	return new FormItem();
};
