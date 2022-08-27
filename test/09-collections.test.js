const { print } = require("./helpers");

describe("Collections", () => {
	const A = {
		colour: 0x00ff00,
		width: 28.52,
		height: 10.2,
		range: [-20, 12],
	};
	const B = {
		name: "John",
		age: "Older than I look",
		occupation: "Larrikin",
		country: "Australia",
		city: "Melbourne",
	};

	describe("Maps", () => {
		it("prints string-type entries", () => {
			expect(
				print(
					new Map([
						["alpha", "A"],
						["beta", "B"],
						["gamma", "G"],
						["delta", "D"],
					])
				)
			).toMatchSnapshot();
		});

		it("prints symbol-type entries", () => {
			const a = Symbol("Alpha");
			expect(print(new Map([["A", a]]))).toMatchSnapshot();
			expect(print(new Map([[a, null]]))).toMatchSnapshot();
			expect(print(new Map([[a, "A"]]))).toMatchSnapshot();
			expect(print(new Map([[null, a]]))).toMatchSnapshot();
			expect(print(new Map([[Symbol.iterator, a]]))).toMatchSnapshot();
			expect(print(new Map([[a, Symbol.iterator]]))).toMatchSnapshot();
		});

		it("prints object-type keys", () => {
			expect(
				print(
					new Map([
						[{ a: "a", A: "A" }, "alpha"],
						[{ b: "b", B: "B" }, "beta"],
						[{ g: "g", G: "G" }, "gamma"],
						[{ d: "d", D: "D" }, "delta"],
					])
				)
			).toMatchSnapshot();
			expect(
				print(
					new Map([
						[A, "A"],
						[B, "B"],
					])
				)
			).toMatchSnapshot();
			expect(print(new Map([[{ A, B }, "AB"]]))).toMatchSnapshot();
		});

		it("prints object-type values", () => {
			expect(
				print(
					new Map([
						["alpha", { a: "a", A: "A" }],
						["beta", { b: "b", B: "B" }],
						["gamma", { g: "g", G: "G" }],
						["delta", { d: "d", D: "D" }],
					])
				)
			).toMatchSnapshot();
			expect(
				print(
					new Map([
						[
							"alphabeta",
							{
								alpha: { a: "a", A: "A" },
								beta: { b: "b", B: "B" },
							},
						],
					])
				)
			).toMatchSnapshot();
		});

		it("prints properties", () => {
			const map = new Map([
				["A", "a"],
				["B", "b"],
				["C", "c"],
			]);
			map.name = "Quxabaz";
			map.customProperty = {
				foo: "Bar",
				baz: "Quux",
			};
			expect(print(map)).toMatchSnapshot();
		});

		it("indicates references using `->`", () => {
			const list = [1];
			const mappedKey = new Map([[list, "list"]]);
			const mappedValue = new Map([["list", list]]);
			expect(print([list, mappedKey], "input")).toMatchSnapshot();
			expect(print([list, mappedValue], "input")).toMatchSnapshot();
			list.pop();
			expect(print([list, mappedKey, mappedValue])).toMatchSnapshot();
		});

		it("prints empty maps on one line", () => {
			const map = new Map();
			expect(print(map)).toMatchSnapshot();
			map.foo = "Bar";
			expect(print(map)).toMatchSnapshot();
		});

		it("catches errors thrown by faulty iterators", () => {
			class BadMap extends Map {
				[Symbol.iterator]() {
					let count = 0;
					return {
						next() {
							if (++count >= 3) {
								const error = new RangeError("You're out");
								error.strikes = 3;
								throw error;
							}
							return { value: [count, count] };
						},
					};
				}
			}
			expect(print(new BadMap())).toMatchSnapshot();
		});
	});

	describe("Sets", () => {
		it("prints basic entries", () => {
			const set = new Set(["A", "B", 0xcc]);
			expect(print(set)).toMatchSnapshot();
		});

		it("prints symbol-type entries", () => {
			const set = new Set([Symbol.iterator, Symbol("Foo")]);
			expect(print(set)).toMatchSnapshot();
		});

		it("prints object-type entries", () => {
			const set = new Set(["0", A, B, "C"]);
			expect(print(set)).toMatchSnapshot();
		});

		it("prints nested sets", () => {
			const nest = new Set([1, A, "3", new Set([2, B, "4"])]);
			expect(print(nest)).toMatchSnapshot();
		});

		it("prints properties", () => {
			const input = new Set(["A", "B", "C"]);
			input.name = "Quxabaz";
			input.customProperty = {
				foo: "Bar",
				baz: "Quux",
			};
			expect(print(input)).toMatchSnapshot();
		});

		it("indicates references using `->`", () => {
			const bar = { name: "Bar" };
			const input = { foo: "Foo", bar, baz: new Set([bar]) };
			expect(print(input)).toMatchSnapshot();
		});

		it("disambiguates entries and numeric properties", () => {
			const a = { b: "c" };
			const set = new Set([a]);
			set.foo = { bar: "Baz" };
			set.add(set.foo);
			set[1] = { nah: "Nope" };
			set.bar = set[1];
			expect(print({ set }, "input")).toMatchSnapshot();
		});

		it("prints empty sets on one line", () => {
			const set = new Set();
			expect(print(set)).toMatchSnapshot();
			set.foo = "Bar";
			expect(print(set)).toMatchSnapshot();
		});

		it("catches errors thrown by faulty iterators", () => {
			class BadSet extends Set {
				[Symbol.iterator]() {
					let count = 0;
					return {
						next() {
							if (++count >= 3) {
								const error = new RangeError("You're out");
								error.strikes = 3;
								throw error;
							}
							return { value: count };
						},
					};
				}
			}
			expect(print(new BadSet())).toMatchSnapshot();
		});
	});

	describe("WeakMaps", () => {
		it("prints properties", () => {
			const input = new WeakMap();
			input.a = "ABC";
			expect(print(input)).toMatchSnapshot();
			input.b = "XYZ";
			expect(print(input)).toMatchSnapshot();
		});

		it("prints empty maps on one line", () => {
			expect(print(new WeakMap())).toMatchSnapshot();
		});
	});

	describe("WeakSets", () => {
		it("prints properties", () => {
			const input = new WeakSet();
			input.a = "ABC";
			expect(print(input)).toMatchSnapshot();
			input.b = "XYZ";
			expect(print(input)).toMatchSnapshot();
		});

		it("prints empty sets on one line", () => {
			expect(print(new WeakSet())).toMatchSnapshot();
		});
	});
});
