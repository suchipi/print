const print = require("../print");

describe("Functions", () => {
	it("prints source code", () => {
		function func(i) {
			return i + 2;
		}
		expect(print(func)).toMatchSnapshot();
		expect(print(() => "A")).toMatchSnapshot();
		const obj = {
			func: function fn(value) {
				return value;
			},
			arrow: (a, b) => a + b,
		};
		expect(print(obj)).toMatchSnapshot();
	});

	it("identifies generator functions", () => {
		function* foo() {
			yield 20;
		}
		expect(print(foo)).toMatchSnapshot();
		expect(print({ method: foo })).toMatchSnapshot();
	});

	it("identifies asynchronous functions", () => {
		async function foo() {
			return 20;
		}
		expect(print(foo)).toMatchSnapshot();
		expect(print({ method: foo })).toMatchSnapshot();
	});

	it("identifies asynchronous generators", () => {
		async function* foo() {
			yield 20;
		}
		expect(print(foo)).toMatchSnapshot();
		expect(print({ method: foo })).toMatchSnapshot();
	});

	it("prints properties", () => {
		function foo(a, b) {
			return a + b;
		}
		expect(print(foo, { all: true })).toMatchSnapshot();
		foo.bar = "Bar";
		expect(print(foo, { all: true })).toMatchSnapshot();
	});

	it("doesn't print source code if `noSource` is set", () => {
		function foo(i) {
			return i + 1;
		}
		function* bar() {
			yield true;
		}
		async function baz(i) {
			return i + 2;
		}
		async function* qux() {
			yield true;
		}
		const opts = { noSource: true };
		expect(print(foo, opts)).toMatchSnapshot();
		expect(print(bar, opts)).toMatchSnapshot();
		expect(print(baz, opts)).toMatchSnapshot();
		expect(print(qux, opts)).toMatchSnapshot();

		opts.all = true;
		expect(print(foo, opts)).toMatchSnapshot();
		expect(print(bar, opts)).toMatchSnapshot();
		expect(print(baz, opts)).toMatchSnapshot();
		expect(print(qux, opts)).toMatchSnapshot();
	});

	describe("Accessors", () => {
		it("prints getter/setter pairs", () => {
			let calls = 0;
			expect(
				print({
					abc: "ABC",
					get foo() {
						return "Foo";
					},
					set foo(to) {
						calls += 1 ** +!!to;
					},
					xyz: "XYZ",
				})
			).toMatchSnapshot();
			expect(calls).toEqual(0);

			calls = 0;
			expect(
				print({
					abc: "ABC",
					get [Symbol.toStringTag]() {
						++calls;
						return "Bar";
					},
					set [Symbol.toStringTag](to) {
						calls += 1 ** +!!to;
					},
					xyz: "XYZ",
				})
			).toMatchSnapshot();
			expect(calls).toEqual(0);
		});

		it("doesn't print them when invoking getters", () => {
			let getterCalls = 0;
			let setterCalls = 0;
			expect(
				print(
					{
						abc: "ABC",
						get foo() {
							return ++getterCalls;
						},
						set foo(to) {
							setterCalls += 1 ** +!!to;
						},
						xyz: "XYZ",
					},
					{ followGetters: true }
				)
			).toMatchSnapshot();
			expect(getterCalls).toEqual(1);
			expect(setterCalls).toEqual(0);
		});

		it("always prints write-only accessors", () => {
			const obj = {
				foo: "Foo",
				set name(to) {
					obj.foo = to;
				},
				bar: "Bar",
			};
			expect(print(obj, { followGetters: true })).toMatchSnapshot();
		});

		it("identifies references", () => {
			function bar(a, b) {
				return a + b;
			}
			const obj = Object.defineProperty({ a: 1, b: 2 }, "foo", {
				enumerable: true,
				get: bar,
				set: bar,
			});
			expect(print(obj)).toMatchSnapshot();
			bar.baz = "Qux";
			obj.c = 3;
			expect(print(obj)).toMatchSnapshot();
		});
	});

	describe("Line terminators", () => {
		const lines = [
			"function foo(c){",
			"\tlet a = 1;",
			"\tlet b = 2;",
			"\tif(a + b < c)",
			"\t\treturn a + b;",
			"}",
		];
		const fn = (eol) =>
			expect(print(Function("return " + lines.join(eol))())).toMatchSnapshot();
		it("prints source code that uses LF endings", () => {
			fn("\n");
		});
		it("prints source code that uses CR endings", () => {
			fn("\r");
		});
		it("prints source code that uses CRLF endings", () => {
			fn("\r\n");
		});
		it("prints source code that uses LS endings", () => {
			fn("\u2028");
		});
		it("prints source code that uses PS endings", () => {
			fn("\u2029");
		});
		it("prints source code with mixed endings", () => {
			const eol = ["\n", "\r", "\r\n", "\u2028", "\u2029"];
			for (let i = 0; i < 5; ++i) {
				const src = lines
					.map((line, index) => line + eol[(i + index) % 5])
					.join("");
				expect(print(Function("return " + src)())).toMatchSnapshot();
			}
		});
	});
});
