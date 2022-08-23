const print = require("../print");

describe("Lists", () => {
	describe("Arrays", () => {
		it("prints array entries", () => {
			expect(print(["Foo"])).toMatchSnapshot();
			expect(print([1, 2])).toMatchSnapshot();
			expect(print([{ foo: "bar" }])).toMatchSnapshot();
			expect(print(["A", { abc: "ABC" }, "Z"])).toMatchSnapshot();
		});

		it("prints assigned properties", () => {
			const array = ["Foo"];
			array.xyz = "XYZ";
			array.abc = "ABC";
			expect(print(array)).toMatchSnapshot();
			array.push("Bar");
			expect(print(array)).toMatchSnapshot();
			array[Symbol("XYZ")] = "xyz";
			expect(print(array)).toMatchSnapshot();
			array[Symbol("ABC")] = "abc";
			array[2] = 3;
			expect(print(array)).toMatchSnapshot();
		});

		it("prints empty arrays on one line", () => {
			expect(print([])).toMatchSnapshot();
			expect(print([[]])).toMatchSnapshot();
			expect(print([{ foo: [] }])).toMatchSnapshot();
			const array = [];
			array.foo = "Bar";
			expect(print(array)).toMatchSnapshot();
		});

		it("prints holes in sparse arrays", () => {
			expect(print([1, , 3])).toMatchSnapshot();
			expect(print([1, , , 4])).toMatchSnapshot();
			expect(print([1, , , , 5])).toMatchSnapshot();
			expect(print([1, , , 4, , 6])).toMatchSnapshot();
			expect(print([1, , , , 5, , , 8])).toMatchSnapshot();
			expect(print([1, , , , 5, , , 8, ,])).toMatchSnapshot();
			expect(print([, , , , 5, , , 8, ,])).toMatchSnapshot();
			expect(print([,])).toMatchSnapshot();
			expect(print([, ,])).toMatchSnapshot();
			expect(print([, , ,])).toMatchSnapshot();
			expect(print([, 2])).toMatchSnapshot();
			expect(print([, , 3])).toMatchSnapshot();
			expect(print([, , , 4])).toMatchSnapshot();
			expect(print([1, ,])).toMatchSnapshot();
			expect(print([1, , ,])).toMatchSnapshot();
			expect(print([1, , , ,])).toMatchSnapshot();
			expect(print([1, , undefined, , 5])).toMatchSnapshot();
			let array = [1, ,];
			array.foo = "Foo";
			expect(print(array)).toMatchSnapshot();
			array = [,];
			array.bar = "Bar";
			expect(print(array)).toMatchSnapshot();
			array.length = 2;
			expect(print(array)).toMatchSnapshot();
			array[1] = 2;
			expect(print(array)).toMatchSnapshot();
			array = new Array(40);
			expect(print(array)).toMatchSnapshot();
			array[55] = 0;
			expect(print(array)).toMatchSnapshot();
		});

		it("numbers each element if `opts.indexes` is set", () => {
			expect(print([1, 2, 3], { indexes: true })).toMatchSnapshot();
			expect(
				print(["1", "Foo", { bar: "Baz" }, []], { indexes: true })
			).toMatchSnapshot();
			expect(
				print(
					[
						[1, 2],
						[3, 4, 5],
					],

					{ indexes: true }
				)
			).toMatchSnapshot();
			expect(print([, , , true], { indexes: true })).toMatchSnapshot();
			const array = [false, , , undefined];
			array.foo = "Bar";
			expect(print(array, { indexes: true })).toMatchSnapshot();
		});

		it("identifies subclasses", () => {
			class Point extends Array {
				constructor(x, y, z) {
					super(x, y, z);
					this.x = x;
					this.y = y;
					this.z = z;
				}
			}
			const pt = new Point(10, 40, 0);
			expect(print(pt)).toMatchSnapshot();
			class Void extends Array {}
			class Supervoid extends Void {
				constructor(size, name = "") {
					super(size * size);
					this.name = name;
				}
			}
			expect(print(new Supervoid(40, "Boötes"))).toMatchSnapshot();
		});

		describe("When `maxDepth` is exceeded", () => {
			it("elides entries", () => {
				expect(print([1, 2, 3], { maxDepth: 0 })).toMatchSnapshot();
				expect(print([1, 2, 3], { maxDepth: 1 })).toMatchSnapshot();
				expect(print({ foo: [1, 2, 3] }, { maxDepth: 1 })).toMatchSnapshot();
			});

			it("elides nested entries", () => {
				expect(print([[1, 2, 3]], { maxDepth: 1 })).toMatchSnapshot();
				expect(print([1, [2], 3], { maxDepth: 1 })).toMatchSnapshot();
				expect(print([1, [2, [2.5]], 3], { maxDepth: 2 })).toMatchSnapshot();
			});

			it("still identifies subclasses", () => {
				class CustomArray extends Array {
					constructor(...args) {
						super(...args);
						this.text = "It's very custom";
					}
				}
				const foo = new CustomArray();
				expect(print(foo, { maxDepth: 0 })).toMatchSnapshot();
				expect(print(foo, { maxDepth: 1 })).toMatchSnapshot();
				expect(print({ foo }, { maxDepth: 1 })).toMatchSnapshot();
				expect(print({ foo }, { maxDepth: 2 })).toMatchSnapshot();
				foo.push("Foo", ["Bar"]);
				expect(print(foo, { maxDepth: 0 })).toMatchSnapshot();
				expect(print(foo, { maxDepth: 0, indexes: true })).toMatchSnapshot();
				expect(print(foo, { maxDepth: 1 })).toMatchSnapshot();
				expect(print(foo, { maxDepth: 1, indexes: true })).toMatchSnapshot();
				expect(print(foo, { maxDepth: 2, indexes: true })).toMatchSnapshot();
			});
		});
	});

	describe("Typed arrays", () => {
		const bytes = [0xc3, 0x84, 0x00, 0xcb, 0x87, 0x21, 0x0a];
		const range = new Array(255).fill(0).map((x, index) => index);

		// NB: This technically isn't a typed array, but we format it like one.
		describe("ArrayBuffers", () => {
			const haveShared = typeof SharedArrayBuffer === "function";
			const share = (array) => {
				const buffer = new SharedArrayBuffer(array.length);
				const view = new DataView(buffer);
				array.forEach((byte, i) => view.setUint8(i, byte));
				return buffer;
			};

			it("prints the buffer's contents in hexadecimal", () => {
				expect(print(Uint8Array.from(range).buffer)).toMatchSnapshot();
				expect(print(Uint8Array.from(bytes).buffer)).toMatchSnapshot();
				haveShared && expect(print(share(bytes))).toMatchSnapshot();
			});

			it("doesn't print hexadecimal if `noHex` is enabled", () => {
				expect(
					print(Uint8Array.from(bytes).buffer, { noHex: true })
				).toMatchSnapshot();
				haveShared &&
					expect(print(share(bytes), { noHex: true })).toMatchSnapshot();
			});

			it("prints assigned properties", () => {
				const { buffer } = Uint8Array.from(bytes);
				buffer.foo = "Foo";
				expect(print(buffer)).toMatchSnapshot();
				expect(print(buffer, { noHex: true })).toMatchSnapshot();
				buffer[0] = 1;
				buffer.bar = "Bar";
				buffer[Symbol.split] = "Bytes";
				expect(print(buffer)).toMatchSnapshot();
				expect(print(buffer, { noHex: true })).toMatchSnapshot();
				buffer[1] = "2";
				buffer[Symbol("ABC")] = "abc";
				expect(print(buffer)).toMatchSnapshot();
				expect(print(buffer, { noHex: true })).toMatchSnapshot();
			});

			it("ignores the `indexes` option", () => {
				const { buffer } = Uint8Array.from(bytes);
				const opts = { indexes: true, noHex: true };
				expect(print(buffer, opts)).toMatchSnapshot();
				buffer[0] = 1;
				buffer.foo = "Foo";
				expect(print(buffer, opts)).toMatchSnapshot();
				opts.noHex = false;
				expect(print(buffer, opts)).toMatchSnapshot();
			});

			it("prints empty buffers on one line", () => {
				const buffer = new ArrayBuffer(0);
				expect(print(buffer)).toMatchSnapshot();
				expect(print(buffer, { noHex: true })).toMatchSnapshot();
				buffer.foo = "Foo";
				expect(print(buffer)).toMatchSnapshot();
				expect(print(buffer, { noHex: true })).toMatchSnapshot();
			});
		});

		describe("Uint8Arrays", () => {
			it("prints entries in hexadecimal", () => {
				expect(print(Uint8Array.from(range))).toMatchSnapshot();
				expect(print(Uint8Array.from(bytes))).toMatchSnapshot();
			});

			it("doesn't print hexadecimal if `noHex` is enabled", () => {
				expect(
					print(Uint8Array.from(bytes), { noHex: true })
				).toMatchSnapshot();
			});

			it("prints assigned properties", () => {
				const array = Uint8Array.from(bytes);
				array.foo = "Foo";
				expect(print(array)).toMatchSnapshot();
				array[0] = 0;
				array.bar = "Bar";
				array[Symbol.split] = "Bytes";
				expect(print(array)).toMatchSnapshot();
				array[Symbol("ABC")] = "abc";
				expect(print(array)).toMatchSnapshot();
			});

			it("prints empty arrays on one line", () => {
				const array = new Uint8Array(0);
				expect(print(array)).toMatchSnapshot();
				expect(print(array, { noHex: true })).toMatchSnapshot();
				array.foo = "Foo";
				expect(print(array)).toMatchSnapshot();
				expect(print(array, { noHex: true })).toMatchSnapshot();
			});
		});

		describe("Others", () => {
			it("prints other typed arrays normally", () => {
				expect(print(new Float64Array(5))).toMatchSnapshot();
				expect(
					print(Float64Array.from([1.2, 3.4, 5.6, -64, -1.5]))
				).toMatchSnapshot();
				expect(print(new Uint16Array(5))).toMatchSnapshot();
				expect(print(Uint16Array.from([1, 2, 3, 4, 5]))).toMatchSnapshot();
				expect(print(new BigUint64Array(5))).toMatchSnapshot();
				expect(
					print(BigUint64Array.from([1n, 2n, 3n, 4n, 8n]))
				).toMatchSnapshot();
				expect(
					print(BigInt64Array.from([1n, 2n, 3n, 4n, -6n]))
				).toMatchSnapshot();
			});

			it("prints assigned properties", () => {
				const floats = Float64Array.from([1.2, 3.4, 5.6]);
				const uint16 = Uint16Array.from([1, 20, 30]);
				const uint64 = BigUint64Array.from([1n, 2n, 3n]);
				floats.baz = "Baz";
				uint16.foo = "Foo";
				uint64.bar = "Bar";
				expect(print(floats)).toMatchSnapshot();
				expect(print(floats, { noHex: true })).toMatchSnapshot();
				expect(print(uint16)).toMatchSnapshot();
				expect(print(uint16, { noHex: true })).toMatchSnapshot();
				expect(print(uint64)).toMatchSnapshot();
				expect(print(uint64, { noHex: true })).toMatchSnapshot();
			});

			it("prints empty arrays on one line", () => {
				const floats = new Float64Array(0);
				const uint16 = new Uint16Array(0);
				const uint64 = new BigUint64Array(0);
				expect(print(floats)).toMatchSnapshot();
				expect(print(floats, { noHex: true })).toMatchSnapshot();
				expect(print(uint16)).toMatchSnapshot();
				expect(print(uint16, { noHex: true })).toMatchSnapshot();
				expect(print(uint64)).toMatchSnapshot();
				expect(print(uint64, { noHex: true })).toMatchSnapshot();
				floats.baz = "Baz";
				uint16.foo = "Foo";
				uint64.bar = "Bar";
				expect(print(floats)).toMatchSnapshot();
				expect(print(floats, { noHex: true })).toMatchSnapshot();
				expect(print(uint16)).toMatchSnapshot();
				expect(print(uint16, { noHex: true })).toMatchSnapshot();
				expect(print(uint64)).toMatchSnapshot();
				expect(print(uint64, { noHex: true })).toMatchSnapshot();
			});

			it("doesn't break when printing `TypedArray.prototype`", () => {
				const output = print(Uint8Array.prototype, { all: true });
				expect(output.split("\n").shift()).toEqual("TypedArray {");
			});
		});
	});

	describe("Argument lists", () => {
		it("identifies argument lists", () => {
			const args = (function () {
				return arguments;
			})("A", "B", { a: "C" });
			expect(print(args)).toMatchSnapshot();
		});

		it("only identifies lists with an obvious [[ParameterMap]]", () => {
			function call() {
				throw new TypeError(0xbaaaaaaaad);
			}
			const args = Object.defineProperties(
				{ 0: "A", 1: "B", 2: "C" },
				{
					callee: { get: call, set: call },
					length: { configurable: true, writable: true, value: 3 },
					[Symbol.iterator]: {
						configurable: true,
						writable: true,
						value: Symbol.iterator,
					},
				}
			);
			expect(print(args)).toMatchSnapshot();
			Object.defineProperty(args, Symbol.toStringTag, { value: "Arguments" });
			expect(print(args)).toMatchSnapshot();
		});

		it("prints empty argument lists on one line", () => {
			const args = (function () {
				return arguments;
			})();
			expect(print(args)).toMatchSnapshot();
		});

		it("prints assigned properties", () => {
			let args = (function () {
				return arguments;
			})(1, 2);
			args.foo = "Foo";
			expect(print(args)).toMatchSnapshot();
			args[2] = 3;
			args.bar = "Bar";
			expect(print(args)).toMatchSnapshot();

			args = (function () {
				return arguments;
			})("A", "B", { a: "C" });
			args.string = "ABC XYZ";
			expect(print(args)).toMatchSnapshot();
		});

		it("prints holes in sparsely-populated argument lists", () => {
			const args = (function () {
				return arguments;
			})();
			args.length = 6;
			expect(print(args)).toMatchSnapshot();
			args[2] = true;
			expect(print(args)).toMatchSnapshot();
		});
	});
});
