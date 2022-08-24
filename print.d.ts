/**
 * Options for {@link print}.
 */
export interface PrintOptions {
	/** Whether to display non-enumerable properties. Defaults to false. */
	all?: boolean;

	/** Whether to invoke getter functions. Defaults to false. */
	followGetters?: boolean;

	/** Whether to display the indexes of iterable entries. Defaults to false. */
	indexes?: boolean;

	/** Hide object details after 𝑁 recursions. Defaults to Infinity. */
	maxDepth?: number;

	/** If true, don't identify well-known symbols as `@@…`. Defaults to false. */
	noAmp?: boolean;

	/** If true, don't format byte-arrays as hexadecimal. Defaults to false. */
	noHex?: boolean;

	/** If true, don't display function source code. Defaults to false. */
	noSource?: boolean;

	/** Whether to show `__proto__` properties if possible. Defaults to false. */
	proto?: boolean;

	/** Whether to sort properties alphabetically. When false, properties are sorted by creation order. Defaults to false. */
	sort?: boolean;

	/** Options that control whether and how ANSI terminal escape sequences for colours should be added to the output. Defaults to false, meaning no colours. */
	colours?: boolean | 256 | 8 | Colours;
}

export interface Colours {
	off?: string;
	red?: string;
	grey?: string;
	green?: string;
	darkGreen?: string;
	punct?: string;
	keys?: string;
	keyEscape?: string;
	typeColour?: string;
	primitive?: string;
	escape?: string;
	date?: string;
	hexBorder?: string;
	hexValue?: string;
	hexOffset?: string;
	reference?: string;
	srcBorder?: string;
	srcRowNum?: string;
	srcRowText?: string;
	nul?: string;
	nulProt?: string;
	undef?: string;
	noExts?: string;
	frozen?: string;
	sealed?: string;
	regex?: string;
	string?: string;
	symbol?: string;
	symbolFade?: string;
	braces?: string;
	quotes?: string;
	empty?: string;
	dot?: string;
}

export interface PrintFunction {
	/**
	 * Generate a human-readable representation of a value.
	 *
	 * @param value - Value to inspect
	 * @param options - Additional settings for refining output
	 * @returns A string representation of `value`.
	 */
	(value: any, options?: PrintOptions): string;

	/**
	 * Generate a human-readable representation of a value.
	 *
	 * @param value - Value to inspect
	 * @param key - The value's corresponding member name
	 * @param options - Additional settings for refining output
	 * @returns A string representation of `value`.
	 */
	(value: any, key?: string | symbol, options?: PrintOptions): string;
}

/**
 * Generate a human-readable representation of a value.
 *
 * @param value - Value to inspect
 * @param key - The value's corresponding member name
 * @param options - Additional settings for refining output
 * @returns A string representation of `value`.
 */
declare var print: PrintFunction;

export = print;
