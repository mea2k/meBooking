import { ToNumberOptions } from "../interfaces/types";

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
	let newValue: number = Number.parseInt(value || String(opts.default), 10);

	if (Number.isNaN(newValue)) {
		newValue = opts.default;
	}
	if (opts.min) {
		if (newValue < opts.min) {
			newValue = opts.min;
		}

		if (newValue > opts.max) {
			newValue = opts.max;
		}
	}
	return newValue;
}

export function toLowerCase(value: string): string {
	return value.toLowerCase();
}