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

	/** Prefix string to use for indentation. Defaults to '\t'. */
	indent?: string;
}

export interface Colours {
	off?: string | number;
	red?: string | number;
	grey?: string | number;
	green?: string | number;
	darkGreen?: string | number;
	punct?: string | number;
	keys?: string | number;
	keyEscape?: string | number;
	typeColour?: string | number;
	primitive?: string | number;
	escape?: string | number;
	date?: string | number;
	hexBorder?: string | number;
	hexValue?: string | number;
	hexOffset?: string | number;
	reference?: string | number;
	srcBorder?: string | number;
	srcRowNum?: string | number;
	srcRowText?: string | number;
	nul?: string | number;
	nulProt?: string | number;
	undef?: string | number;
	noExts?: string | number;
	frozen?: string | number;
	sealed?: string | number;
	regex?: string | number;
	string?: string | number;
	symbol?: string | number;
	symbolFade?: string | number;
	braces?: string | number;
	quotes?: string | number;
	empty?: string | number;
	dot?: string | number;
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
