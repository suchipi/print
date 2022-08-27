const { print } = require("./helpers");

describe("Indentation", () => {
	const value = { a: { b: { c: { d: {} } } } };

	it("defaults to tab", () => {
		expect(print(value)).toMatchSnapshot();
	});

	it("can be overridden", () => {
		expect(print(value, { indent: "  " })).toMatchSnapshot();
		expect(print(value, { indent: " " })).toMatchSnapshot();
		expect(print(value, { indent: "" })).toMatchSnapshot();
		expect(print(value, { indent: "_hi" })).toMatchSnapshot();
	});
});
