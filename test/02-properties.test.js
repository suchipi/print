const { print } = require("./helpers");

describe("Property fields", () => {
	it("prints string-valued properties", () => {
		expect(print({ foo: "bar" })).toMatchSnapshot();
		expect(print({ 123: "baz" })).toMatchSnapshot();
		expect(print({ baz: 123.4 })).toMatchSnapshot();
	});

	it("prints symbol-valued properties", () => {
		expect(print({ [Symbol("foo")]: "bar" })).toMatchSnapshot();
		expect(print({ [Symbol.toStringTag]: "foo" })).toMatchSnapshot();
		expect(
			print({ [Symbol.toStringTag]: "foo" }, { noAmp: true })
		).toMatchSnapshot();
		expect(print({ [Symbol.iterator]: Symbol.iterator })).toMatchSnapshot();
		expect(
			print({ [Symbol.iterator]: Symbol.iterator }, { noAmp: true })
		).toMatchSnapshot();
	});

	it("prints nested properties", () => {
		expect(print({ foo: { bar: "baz" } })).toMatchSnapshot();
		expect(print({ foo: { bar: { baz: "qux" } } })).toMatchSnapshot();
	});

	it("prints empty objects on one line", () => {
		expect(print({})).toMatchSnapshot();
		expect(print({ foo: {} })).toMatchSnapshot();
	});

	describe("Extensibility", () => {
		it("identifies non-extensible objects", () => {
			expect(print(Object.preventExtensions({ foo: 1 }))).toMatchSnapshot();
		});

		it("identifies sealed objects", () => {
			expect(print(Object.seal({ foo: 1 }))).toMatchSnapshot();
		});

		it("identifies frozen objects", () => {
			expect(print(Object.freeze({}))).toMatchSnapshot();
			expect(print(Object.freeze({ foo: 1 }))).toMatchSnapshot();
		});
	});

	describe("Prototypes", () => {
		it("identifies null prototypes", () => {
			const obj = { __proto__: null };
			expect(print(obj)).toMatchSnapshot();
			obj.foo = "Foo";
			expect(print(obj)).toMatchSnapshot();
			obj.bar = "Bar";
			expect(print(obj)).toMatchSnapshot();
			expect(print(Object.freeze(obj))).toMatchSnapshot();
		});

		it("prints `__proto__` if `opts.proto` is enabled", () => {
			const foo = { name: "Foo" };
			const bar = { name: "Bar" };
			bar.__proto__ = foo;
			expect(print({ foo, bar }, { proto: true })).toMatchSnapshot();
		});

		it("recovers gracefully if `__proto__` access throws", () => {
			const foo = { name: "Foo" };
			Object.defineProperty(foo, "__proto__", {
				get() {
					const error = new Error("Don't.");
					error.no = "Really";
					throw error;
				},
			});
			expect(print({ foo }, { proto: true })).toMatchSnapshot();
		});
	});

	describe("“Magic” numbers", () => {
		it("identifies Math.* constants", () => {
			expect(
				print({
					euler: Math.E,
					obj: {
						pi: Math.PI,
					},
				})
			).toMatchSnapshot();
		});

		it("identifies Number.* constants", () => {
			expect(
				print({
					epsilon: Number.EPSILON,
					range: {
						min: Number.MIN_VALUE,
						max: Number.MAX_VALUE,
					},
				})
			).toMatchSnapshot();
		});

		it("doesn't identify them when printing their owners", () => {
			let lines = print(Math, { all: true }).split("\n");
			expect(lines.some((line) => "PI: " + Math.PI === line.trim())).toBe(true);
			expect(lines.some((line) => line.trim() === "PI: Math.PI")).toBe(false);

			lines = print(Number, { all: true }).split("\n");
			expect(
				lines.some((line) => "MAX_VALUE: " + Number.MAX_VALUE === line.trim())
			).toBe(true);
			expect(
				lines.some((line) => line.trim() === "MAX_VALUE: Number.MAX_VALUE")
			).toBe(false);

			const name = "REFERENCE_TO_MAGICAL_NUMBER_THING";
			Math[name] = Number.MAX_VALUE;
			lines = print(Math, { all: true }).split("\n");
			expect(
				lines.some((line) => line.trim() === name + ": Number.MAX_VALUE")
			).toBe(true);

			delete Math[name];
			Number[name] = Math.PI;
			lines = print(Number, { all: true }).split("\n");
			expect(lines.some((line) => line.trim() === name + ": Math.PI")).toBe(
				true
			);
			delete Number[name];
		});
	});

	describe("Ordering", () => {
		const Γ = Symbol("gamma");
		const Ζ = Symbol("zeta");
		const Β = Symbol("beta");
		const Τ = Symbol("tau");
		const Α = Symbol("alpha");

		describe("Default", () => {
			it("sorts names in creation order", () => {
				expect(
					print({
						G: "gamma",
						Z: "zeta",
						B: "beta",
						T: "tau",
						A: "alpha",
					})
				).toMatchSnapshot();
				const obj = { foo: "Foo" };
				obj.bar = "Bar";
				expect(print(obj)).toMatchSnapshot();
				delete obj.foo;
				obj.xyz = "XYZ";
				obj.abc = "ABC";
				obj.foo = "Foo";
				expect(print(obj)).toMatchSnapshot();
			});

			it("sorts symbols in creation order", () => {
				expect(
					print({
						[Γ]: "G",
						[Ζ]: "Z",
						[Β]: "B",
						[Τ]: "T",
						[Α]: "A",
					})
				).toMatchSnapshot();
				const foo = Symbol("foo");
				const obj = { [foo]: "Foo" };
				obj[Symbol("bar")] = "Bar";
				expect(print(obj)).toMatchSnapshot();
				delete obj[foo];
				obj[Symbol("xyz")] = "XYZ";
				obj[Symbol("abc")] = "ABC";
				obj[foo] = "Foo";
				expect(print(obj)).toMatchSnapshot();
			});

			it("sorts names and symbols separately", () => {
				const foo = Symbol("foo");
				const bar = Symbol("bar");
				const qux = Symbol("qux");
				const obj = {
					xyz: "XYZ",
					[foo]: "Foo",
					abc: "ABC",
					[bar]: "Bar",
				};
				expect(print(obj)).toMatchSnapshot();
				obj.foo = "Foo";
				obj[qux] = "Qux";
				expect(print(obj)).toMatchSnapshot();
				delete obj.xyz;
				obj.xyz = "XYZ";
				expect(print(obj)).toMatchSnapshot();
			});
		});

		describe("When `sort` is enabled", () => {
			it("sorts names alphabetically", () => {
				const obj = {
					G: "gamma",
					D: "delta",
					A: "alpha",
					B: "beta",
					P: "pi",
					__FB: "FooBar",
				};
				expect(print(obj, { sort: true })).toMatchSnapshot();
				obj.Z = "zeta";
				obj.E = "epsilon";
				expect(print(obj, { sort: true })).toMatchSnapshot();
			});

			it("sorts symbols alphabetically", () => {
				const obj = {
					[Γ]: "G",
					[Β]: "B",
					[Τ]: "T",
				};
				expect(print(obj, { sort: true })).toMatchSnapshot();
				obj[Ζ] = "Z";
				obj[Α] = "A";
				expect(print(obj, { sort: true })).toMatchSnapshot();
			});

			it("sorts symbols and names together", () => {
				const obj = {
					xyz: "XYZ",
					[Symbol("uvw")]: "UVW",
					abc: "ABC",
					[Symbol("def")]: "DEF",
				};
				expect(print(obj, { sort: true })).toMatchSnapshot();
			});

			it("sorts case-insensitively", () => {
				expect(
					print(
						{
							D: 0,
							c: 3,
							a: 1,
							B: 2,
						},

						{ sort: true }
					)
				).toMatchSnapshot();
				expect(
					print(
						{
							[Symbol("D")]: 0,
							[Symbol("c")]: 3,
							[Symbol("a")]: 1,
							[Symbol("B")]: 2,
						},

						{ sort: true }
					)
				).toMatchSnapshot();
			});
		});
	});

	describe("Visibility", () => {
		it("hides non-enumerable properties", () => {
			const obj = {
				c: "C",
				b: "B",
				a: "A",
			};
			Object.defineProperty(obj, "b", { enumerable: false });
			expect(print(obj)).toMatchSnapshot();
			expect(print(obj, { sort: true })).toMatchSnapshot();
		});

		it("shows them if `opts.all` is enabled", () => {
			const obj = Object.defineProperties(
				{},
				{
					abc: { enumerable: false, value: "ABC" },
					xyz: { enumerable: true, value: "XYZ" },
				}
			);
			expect(print(obj)).toMatchSnapshot();
			expect(print(obj, { all: true })).toMatchSnapshot();
		});

		it("never shows inherited properties", () => {
			const descriptors = {
				foo: { value: "Foo", writable: true, enumerable: true },
				bar: { value: "Bar", writable: true, enumerable: false },
			};
			class Thing {
				method() {}
			}
			Object.defineProperties(Thing.prototype, descriptors);
			const value = new Thing();
			expect(print(value)).toMatchSnapshot();
			expect(print(value, { all: true })).toMatchSnapshot();
			Object.defineProperties(value, descriptors);
			expect(print(value)).toMatchSnapshot();
			expect(print(value, { all: true })).toMatchSnapshot();
		});
	});

	describe("Accessors", () => {
		it("doesn't invoke getter functions", () => {
			let called = false;
			const obj = {
				get bar() {
					called = true;
					return "Bar";
				},
			};
			print(obj);
			expect(called).toBe(false);
			expect(obj.bar).toEqual("Bar");
			expect(called).toBe(true);
		});

		it("invokes them if `followGetters` is enabled", () => {
			let callCount = 0;
			expect(
				print(
					{
						foo: "Foo",
						get bar() {
							return ++callCount;
						},
						baz: "Baz",
					},

					{ followGetters: true }
				)
			).toMatchSnapshot();
			expect(callCount).toEqual(1);
		});

		it("invokes non-enumerable getters only if `all` is enabled", () => {
			let abc = 0;
			let xyz = 0;
			const obj = Object.defineProperties(
				{},
				{
					abc: {
						enumerable: false,
						get() {
							return ++abc;
						},
					},
					xyz: {
						enumerable: true,
						get() {
							return ++xyz;
						},
					},
				}
			);
			expect(print(obj, { followGetters: true })).toMatchSnapshot();
			expect(abc).toEqual(0);
			expect(xyz).toEqual(1);
			expect(print(obj, { followGetters: true, all: true })).toMatchSnapshot();
			expect(abc).toEqual(1);
			expect(xyz).toEqual(2);
		});

		it("catches and prints any error that's thrown", () => {
			const obj = {
				abc: "ABC",
				get foo() {
					const error = new Error("Don't touch me");
					error.y = "tho";
					throw error;
				},
				xyz: "XYZ",
			};
			expect(print(obj, { followGetters: true })).toMatchSnapshot();
		});
	});

	describe("When `maxDepth` is exceeded", () => {
		it("elides property lists", () => {
			const obj = { foo: { bar: { baz: { qux: { qul: 1 } } } } };
			expect(print(obj, { maxDepth: 0 })).toMatchSnapshot();
			expect(print(obj, { maxDepth: -1 })).toMatchSnapshot();
			expect(print(obj, { maxDepth: 1 })).toMatchSnapshot();
			expect(print(obj, { maxDepth: 2 })).toMatchSnapshot();
			expect(print(obj, { maxDepth: 3 })).toMatchSnapshot();
			expect(print(obj, { maxDepth: 4 })).toMatchSnapshot();
			expect(print(obj, { maxDepth: 5 })).toMatchSnapshot();
			expect(print(obj, { maxDepth: NaN })).toMatchSnapshot();
			expect(print(obj, { maxDepth: Infinity })).toMatchSnapshot();
		});

		it("elides details about null prototypes", () => {
			expect(print({ __proto__: null }, { maxDepth: 0 })).toMatchSnapshot();
			expect(print({ __proto__: null }, { maxDepth: 1 })).toMatchSnapshot();
			expect(
				print({ foo: { __proto__: null } }, { maxDepth: 1 })
			).toMatchSnapshot();
			expect(
				print({ foo: { __proto__: null } }, { maxDepth: 2 })
			).toMatchSnapshot();
		});

		it("elides details about extensibility", () => {
			expect(print(Object.freeze({}), { maxDepth: 0 })).toMatchSnapshot();
			expect(print(Object.freeze({}), { maxDepth: 1 })).toMatchSnapshot();
			expect(
				print({ foo: Object.freeze({}) }, { maxDepth: 1 })
			).toMatchSnapshot();
			expect(
				print({ foo: Object.freeze({}) }, { maxDepth: 2 })
			).toMatchSnapshot();
			expect(
				print(Object.freeze({ __proto__: null }), {
					maxDepth: 0,
				})
			).toMatchSnapshot();
			expect(
				print(Object.freeze({ __proto__: null }), { maxDepth: 1 })
			).toMatchSnapshot();
			expect(
				print({ foo: Object.freeze({ __proto__: null }) }, { maxDepth: 1 })
			).toMatchSnapshot();
			expect(
				print({ foo: Object.freeze({ __proto__: null }) }, { maxDepth: 2 })
			).toMatchSnapshot();

			expect(
				print({ __proto__: null, foo: Object.freeze({}) }, { maxDepth: 1 })
			).toMatchSnapshot();
			expect(
				print({ __proto__: null, foo: Object.freeze({}) }, { maxDepth: 2 })
			).toMatchSnapshot();
		});

		it("doesn't needlessly invoke getters", () => {
			let callCount = 0;
			const foo = {
				get bar() {
					return ++callCount;
				},
			};
			expect(
				print({ foo }, { followGetters: true, maxDepth: 1 })
			).toMatchSnapshot();
			expect(callCount).toEqual(0);
			expect(
				print({ foo }, { followGetters: true, maxDepth: 2 })
			).toMatchSnapshot();
			expect(callCount).toEqual(1);
			expect(
				print(
					{
						get foo() {
							return foo;
						},
					},

					{ followGetters: true, maxDepth: 2 }
				)
			).toMatchSnapshot();
			expect(callCount).toEqual(2);
		});

		it("still prints the object's class", () => {
			class Thing {
				constructor(name) {
					this.name = name;
				}
			}
			expect(print(new Thing("Foo"), { maxDepth: 0 })).toMatchSnapshot();
			expect(print(new Thing("Foo"), { maxDepth: 1 })).toMatchSnapshot();
			expect(
				print({ foo: new Thing("Bar") }, { maxDepth: 1 })
			).toMatchSnapshot();
			expect(
				print({ foo: new Thing("Bar") }, { maxDepth: 2 })
			).toMatchSnapshot();
		});

		it("still prints primitive values", () => {
			expect(print("Foo", { maxDepth: 0 })).toMatchSnapshot();
			expect(print(3.525, { maxDepth: 0 })).toMatchSnapshot();
			expect(print(false, { maxDepth: 0 })).toMatchSnapshot();
			expect(print(Symbol("Foo"), { maxDepth: 0 })).toMatchSnapshot();
			expect(
				print({ foo: "Foo", bar: 1, baz: false }, { maxDepth: 1 })
			).toMatchSnapshot();
			expect(
				print({ [Symbol("Foo")]: "Bar" }, { maxDepth: 1 })
			).toMatchSnapshot();
			expect(print({ [Symbol("Foo")]: {} }, { maxDepth: 1 })).toMatchSnapshot();
		});
	});
});
