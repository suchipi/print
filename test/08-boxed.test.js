const print = require("../print");

describe("Boxed primitives", () => {
	describe("Booleans", () => {
		it("prints internal values", () => {
			expect(print(new Boolean("Yes"))).toMatchSnapshot();
			expect(print(new Boolean(false))).toMatchSnapshot();
			expect(print(new Boolean())).toMatchSnapshot();
		});

		it("prints properties", () => {
			let value = new Boolean("Yes");
			expect(print(value)).toMatchSnapshot();
			value.foo = "Foo";
			expect(print(value)).toMatchSnapshot();

			value = new Boolean(false);
			expect(print(value)).toMatchSnapshot();
			value.bar = "Bar";
			expect(print(value)).toMatchSnapshot();
		});

		it("identifies subclasses", () => {
			class ExtendedBoolean extends Boolean {}
			const value = new ExtendedBoolean("Yes");
			expect(print(value)).toMatchSnapshot();
			value.foo = "Foo";
			expect(print(value)).toMatchSnapshot();
		});

		it("resolves internal values with `Boolean#valueOf()`", () => {
			const value = new Boolean("Yes");
			Object.defineProperties(value, {
				valueOf: {
					value() {
						return false;
					},
				},
				toString: {
					value() {
						return "Nah";
					},
				},
			});
			expect(print(value)).toMatchSnapshot();
			value.foo = "Foo";
			expect(print(value)).toMatchSnapshot();

			class WeirdBoolean extends Boolean {
				toString() {
					return "Nah";
				}
				valueOf() {
					return !super.valueOf();
				}
			}
			expect(print(new WeirdBoolean(true))).toMatchSnapshot();
			expect(print(new WeirdBoolean(false))).toMatchSnapshot();
		});
	});

	describe("Numbers", () => {
		it("prints internal values", () => {
			expect(print(new Number(64))).toMatchSnapshot();
			expect(print(new Number(-326.2))).toMatchSnapshot();
		});

		it("prints properties", () => {
			const value = new Number(48);
			value.foo = "Foo";
			expect(print(value)).toMatchSnapshot();
			value.bar = "Bar";
			expect(print(value)).toMatchSnapshot();
		});

		it("identifies subclasses", () => {
			class Double extends Number {
				constructor(n) {
					super(n * 2);
				}
			}
			class Quadruple extends Double {
				constructor(n) {
					super(n * 2);
				}
			}

			let value = new Double(150);
			expect(print(value)).toMatchSnapshot();
			value.foo = "Foo";
			expect(print(value)).toMatchSnapshot();

			value = new Quadruple(150);
			expect(print(value)).toMatchSnapshot();
			value.bar = "Bar";
			expect(print(value)).toMatchSnapshot();
		});

		it("identifies Math.* constants", () => {
			class MathConstant extends Number {}
			for (const constant of "E LN10 LN2 LOG10E LOG2E PI SQRT1_2 SQRT2".split(
				" "
			)) {
				let value = new Number(Math[constant]);
				expect(print(value)).toMatchSnapshot();
				value.foo = "Foo";
				expect(print(value)).toMatchSnapshot();

				value = new MathConstant(Math[constant]);
				expect(print(value)).toMatchSnapshot();
				value.bar = "Bar";
				expect(print(value)).toMatchSnapshot();
			}
		});

		it("identifies Number.* constants", () => {
			class MagicNumber extends Number {}
			const ants =
				"EPSILON MIN_VALUE MAX_VALUE MIN_SAFE_INTEGER MAX_SAFE_INTEGER".split(
					" "
				);
			for (const constant of ants) {
				let value = new Number(Number[constant]);
				expect(print(value)).toMatchSnapshot();
				value.foo = "Foo";
				expect(print(value)).toMatchSnapshot();

				value = new MagicNumber(Number[constant]);
				expect(print(value)).toMatchSnapshot();
				value.foo = "Foo";
				expect(print(value)).toMatchSnapshot();
			}
		});

		it("resolves internal values with `Number#valueOf()`", () => {
			let value = new Number(258);
			value.valueOf = function () {
				return 30;
			};
			expect(print(value)).toMatchSnapshot();
			value.toString = function () {
				return "982";
			};
			expect(print(value)).toMatchSnapshot();

			class LyingNumber extends Number {
				toString() {
					return "Nah";
				}
				valueOf() {
					return -752;
				}
			}
			value = new LyingNumber(32);
			expect(print(value)).toMatchSnapshot();
			value.foo = "Foo";
			expect(print(value)).toMatchSnapshot();
		});
	});

	describe("Strings", () => {
		it("prints internal values", () => {
			const value = new String("ABC");
			expect(print(value)).toMatchSnapshot();
		});

		it("prints properties", () => {
			const value = new String("XYZ");
			value.foo = "Foo";
			expect(print(value)).toMatchSnapshot();
		});

		it("identifies subclasses", () => {
			class ExtendedString extends String {}
			const value = new ExtendedString("XYZ");
			expect(print(value)).toMatchSnapshot();
			value.foo = "Foo";
			expect(print(value)).toMatchSnapshot();
		});

		it("escapes whitespace characters", () => {
			const escapeTests = [
				['"\\t"', new String("\t")],
				['"\\n"', new String("\n")],
				['"\\f"', new String("\f")],
			];
			class Whitespace extends String {}
			for (const [char, object] of escapeTests) {
				expect(print(object)).toMatchSnapshot(char);
				object.foo = "Foo";
				expect(print(object)).toMatchSnapshot(char);

				const ws = new Whitespace(object + "");
				expect(print(ws)).toMatchSnapshot(char);
				ws.bar = "Bar";
				expect(print(ws)).toMatchSnapshot(char);
			}
		});

		it("resolves internal values with `String#valueOf()`", () => {
			let value = new String("ABC");
			value.toString = function () {
				return "XYZ";
			};
			value.valueOf = function () {
				return "Nah";
			};
			expect(print(value)).toMatchSnapshot();

			class WeirdString extends String {
				toString() {
					return "XYZ";
				}
				valueOf() {
					return "XYZ";
				}
			}
			value = new WeirdString("ABC");
			expect(print(value)).toMatchSnapshot();
		});
	});
});
