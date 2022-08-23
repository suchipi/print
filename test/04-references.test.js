const print = require("../print");

describe("Object references", () => {
	it("refers to input using a label", () => {
		const foo = { bar: "Baz" };
		expect(print(foo, "foo")).toMatchSnapshot();
	});

	it("indicates references using `->`", () => {
		const input = {};
		input.self = input;
		expect(print(input, "input")).toMatchSnapshot();

		input.foo = {};
		input.bar = [];
		input.baz = input.foo;
		expect(print(input, "input")).toMatchSnapshot();
		input.bar.push(input.baz, (input.qux = {}));
		expect(print(input, "input")).toMatchSnapshot();
		input.qux = input.bar[1].obj = [];
		expect(print(input, "input")).toMatchSnapshot();
	});

	it("defaults to the label `{root}`", () => {
		const foo = {};
		foo.bar = foo;
		expect(print(foo)).toMatchSnapshot();
	});

	it("prints symbol-type labels", () => {
		const foo = { bar: "baz" };
		const sym = Symbol("Foo");
		expect(print(foo, sym)).toMatchSnapshot();
		foo[sym] = foo;
		expect(print(foo, sym)).toMatchSnapshot();
		expect(print(foo, Symbol.iterator)).toMatchSnapshot();

		const bar = Symbol("Bar");
		const qux = Symbol("Qux");
		foo[bar] = [{}];
		foo[qux] = foo[bar][0];
		expect(print(foo, "input")).toMatchSnapshot();
		foo[bar][0].qul = { name: "Quul" };
		foo[qux] = foo[bar][0].qul;
		expect(print(foo, sym)).toMatchSnapshot();
	});
});
