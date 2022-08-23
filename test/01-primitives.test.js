const print = require("../print");

describe("Primitives", () => {
	it("prints null", () => {
		expect(print(null)).toMatchSnapshot();
	});
	it("prints undefined", () => {
		expect(print(undefined)).toMatchSnapshot();
	});

	describe("BigInts", () => {
		it("prints positive integers", () => {
			expect(print(42n)).toMatchSnapshot();
		});
		it("prints negative integers", () => {
			expect(print(-42n)).toMatchSnapshot();
		});
	});

	describe("Booleans", () => {
		it("prints true", () => {
			expect(print(true)).toMatchSnapshot();
		});
		it("prints false", () => {
			expect(print(false)).toMatchSnapshot();
		});
	});

	describe("Numbers", () => {
		it("prints positive integers", () => {
			expect(print(42)).toMatchSnapshot();
		});
		it("prints negative integers", () => {
			expect(print(-42)).toMatchSnapshot();
		});
		it("prints positive floats", () => {
			expect(print(4.2)).toMatchSnapshot();
		});
		it("prints negative floats", () => {
			expect(print(-4.2)).toMatchSnapshot();
		});
		it("prints positive infinity", () => {
			expect(print(Infinity)).toMatchSnapshot();
		});
		it("prints negative infinity", () => {
			expect(print(-Infinity)).toMatchSnapshot();
		});
		it("prints positive zero", () => {
			expect(print(0)).toMatchSnapshot();
		});
		it("prints negative zero", () => {
			expect(print(-0)).toMatchSnapshot();
		});
		it("shortens long numbers", () => {
			expect(print(1e64)).toMatchSnapshot();
		});
		it("prints NaN", () => {
			expect(print(NaN)).toMatchSnapshot();
		});

		it("identifies Math.* constants", () => {
			expect(print(Math.E)).toMatchSnapshot();
			expect(print(Math.LN10)).toMatchSnapshot();
			expect(print(Math.LN2)).toMatchSnapshot();
			expect(print(Math.LOG10E)).toMatchSnapshot();
			expect(print(Math.LOG2E)).toMatchSnapshot();
			expect(print(Math.PI)).toMatchSnapshot();
			expect(print(Math.SQRT1_2)).toMatchSnapshot();
			expect(print(Math.SQRT2)).toMatchSnapshot();
		});

		it("identifies Number.* constants", () => {
			expect(print(Number.EPSILON)).toMatchSnapshot();
			expect(print(Number.MIN_VALUE)).toMatchSnapshot();
			expect(print(Number.MAX_VALUE)).toMatchSnapshot();
			expect(print(Number.MIN_SAFE_INTEGER)).toMatchSnapshot();
			expect(print(Number.MAX_SAFE_INTEGER)).toMatchSnapshot();
		});
	});

	describe("Strings", () => {
		it("prints strings", () => {
			expect(print("Foo")).toMatchSnapshot();
		});
		it("escapes tabs", () => {
			expect(print("\t")).toMatchSnapshot();
		});
		it("escapes line-feeds", () => {
			expect(print("\n")).toMatchSnapshot();
		});
		it("escapes form-feeds", () => {
			expect(print("\f")).toMatchSnapshot();
		});
		it("escapes carriage-returns", () => {
			expect(print("\r")).toMatchSnapshot();
		});
		it("escapes vertical-tabs", () => {
			expect(print("\v")).toMatchSnapshot();
		});
		it("escapes null-bytes", () => {
			expect(print("\0")).toMatchSnapshot();
		});
		it("escapes backspaces", () => {
			expect(print("\b")).toMatchSnapshot();
		});
		it("escapes backslashes", () => {
			expect(print("\\")).toMatchSnapshot();
		});
		it("escapes bell characters", () => {
			expect(print("\x07")).toMatchSnapshot();
		});
		it("escapes ASCII escapes", () => {
			expect(print("\x1B")).toMatchSnapshot();
		});
		it("escapes other controls", () => {
			const c0 = [1, 2, 3, 4, 5, 6, 28, 29, 30, 31];
			const c1 = new Array(16).fill(0).map((x, i) => i + 128);
			for (let i = 14; i < 27; i++) {
				c0.push(i);
			}
			for (const code of [...c0, ...c1]) {
				const hex = code.toString(16).padStart(2, "0").toUpperCase();
				expect(print(String.fromCharCode(code))).toMatchSnapshot(hex);
			}
		});
	});

	describe("Symbols", () => {
		const desc = Object.getOwnPropertyDescriptor(globalThis, "String");
		afterEach(() => Object.defineProperty(globalThis, "String", desc));

		it("prints symbol values", () => {
			const foo = Symbol("Foo");
			expect(print(foo)).toMatchSnapshot();
		});

		it("identifies well-known symbols", () => {
			expect(print(Symbol.asyncIterator)).toMatchSnapshot();
			expect(print(Symbol.hasInstance)).toMatchSnapshot();
			expect(print(Symbol.isConcatSpreadable)).toMatchSnapshot();
			expect(print(Symbol.iterator)).toMatchSnapshot();
			expect(print(Symbol.match)).toMatchSnapshot();
			expect(print(Symbol.replace)).toMatchSnapshot();
			expect(print(Symbol.search)).toMatchSnapshot();
			expect(print(Symbol.species)).toMatchSnapshot();
			expect(print(Symbol.split)).toMatchSnapshot();
			expect(print(Symbol.toPrimitive)).toMatchSnapshot();
			expect(print(Symbol.toStringTag)).toMatchSnapshot();
			expect(print(Symbol.unscopables)).toMatchSnapshot();
		});

		it("doesn't identify them if `opts.noAmp` is enabled", () => {
			const { match } = Symbol;
			expect(print(match)).toMatchSnapshot();
			expect(print(match, { noAmp: false })).toMatchSnapshot();
			expect(print(match, { noAmp: true })).toMatchSnapshot();
		});

		it("doesn't confuse them with identically-named symbols", () => {
			expect(print(Symbol("Symbol.iterator"))).toMatchSnapshot();
			expect(print(Symbol("iterator"))).toMatchSnapshot();
			expect(print(Symbol.iterator)).toMatchSnapshot();
		});

		it("ensures value is always enclosed by `Symbol(…)`", () => {
			Object.defineProperty(globalThis, "String", {
				configurable: true,
				value: (input) =>
					typeof input === "symbol"
						? input.toString().replace(/^Symbol\(|\)$/g, "")
						: desc.value.call(globalThis, input),
			});
			const sym = Symbol("Foo");
			expect(String(sym)).toEqual("Foo");
			expect(print(sym)).toMatchSnapshot();
		});
	});
});
