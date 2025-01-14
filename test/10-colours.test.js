const { print } = require("./helpers");

describe("Coloured output", () => {
	it("colours primitives", () => {
		expect(print(true, { colours: true })).toMatchSnapshot();
		expect(print(false, { colours: true })).toMatchSnapshot();
		expect(print(10.25, { colours: true })).toMatchSnapshot();
		expect(print(3000n, { colours: true })).toMatchSnapshot();
		expect(print(Infinity, { colours: true })).toMatchSnapshot();
		expect(print(-Infinity, { colours: true })).toMatchSnapshot();
	});

	it("colours nullish values", () => {
		expect(print(null, { colours: true })).toMatchSnapshot();
		expect(print(undefined, { colours: true })).toMatchSnapshot();

		expect(print(null, { colours: 8 })).toMatchSnapshot();
		expect(print(undefined, { colours: 8 })).toMatchSnapshot();
	});

	it("colours strings", () => {
		const input = "Foo Bar \n Baz \t \v Qux";
		expect(print(input, { colours: {} })).toMatchSnapshot();
		expect(print(input, { colours: true })).toMatchSnapshot();
		expect(print(input, { colours: 256 })).toMatchSnapshot();
		expect(print(input, { colours: 8 })).toMatchSnapshot();
	});

	it("colours property keys", () => {
		const label = "World's loneliest number";
		expect(print(-0, label, { colours: {} })).toMatchSnapshot();
		expect(print(-0, label, { colours: true })).toMatchSnapshot();
		expect(print(-0, label, { colours: 256 })).toMatchSnapshot();
		expect(print(-0, label, { colours: 8 })).toMatchSnapshot();
	});

	it("colours punctuation", () => {
		const obj = { foo: NaN, bar: [{}, 1, []] };
		expect(print(obj, { colours: {} })).toMatchSnapshot();
		expect(print(obj, { colours: true })).toMatchSnapshot();
		expect(print(obj, { colours: 256 })).toMatchSnapshot();
		expect(print(obj, { colours: 8 })).toMatchSnapshot();
	});

	it("colours references", () => {
		const a = { b: "c" };
		const set = new Set([a]);
		set.foo = { bar: "Baz" };
		set.add(set.foo);
		set[1] = { nah: "Nope" };
		set.bar = set[1];
		const map = new Map([
			["A", {}],
			["B", {}],
		]);
		map[0] = { value: { abc: "XYZ" } };
		map["0.value"] = { value: {} };
		map.foo1 = map.get("A");
		map.foo2 = map[0].value;
		map.bar1 = map.get("B");
		map.bar2 = map["0.value"];
		const input = { set, map };

		expect(print(input, "input", { colours: {} })).toMatchSnapshot();
		expect(print(input, "input", { colours: true })).toMatchSnapshot();
		expect(print(input, "input", { colours: 256 })).toMatchSnapshot();
		expect(print(input, "input", { colours: 8 })).toMatchSnapshot();
	});

	describe("User-defined colours", () => {
		const obj = { foo: "Bar" };
		obj.bar = [{}];
		obj.baz = obj.bar[0];
		obj.qux = new Map([[obj.bar, [{ value: {} }]]]);
		obj.qux.set([], obj.qux.get(obj.bar));
		obj.qux.set({}, obj.qux.get(obj.bar)[0]);
		obj.qux.set({}, obj.qux.get(obj.bar)[0].value);

		it("accepts user-defined colour sequences", () => {
			const colours = { keys: "\x1B[38;5;200m" };
			expect(print(obj, "input", { colours })).toMatchSnapshot();

			colours.string = "\x1B[38;5;11m";
			colours.quotes = "\x1B[38;5;16m";
			colours.keys = "\x1B[7m";
			colours.punct = "\x1B[27m";
			expect(print(obj, "input", { colours })).toMatchSnapshot();
		});

		it("treats numbers as ANSI colour indexes", () => {
			const colours = { keys: 200 };
			expect(print(obj, "input", { colours })).toMatchSnapshot();
			colours.string = 11;
			colours.quotes = 16;
			delete colours.keys;
			expect(print(obj, "input", { colours })).toMatchSnapshot();
		});
	});
});
