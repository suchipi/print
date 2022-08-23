const print = require("../print");

describe("Dates", () => {
	it("prints dates", () => {
		const date = "2000-12-31T18:02:16.555Z";
		expect(print(new Date(date))).toMatchSnapshot();
	});

	it("prints properties", () => {
		const date = new Date("2000-10-10T10:02:02.000Z");
		date.foo = "bar";
		date.list = ["Alpha", "Beta", "Delta"];
		expect(print(date)).toMatchSnapshot();
	});

	it("identifies malformed dates", () => {
		const date = new Date(NaN);
		expect(print(date)).toMatchSnapshot();
		date.foo = "bar";
		expect(print(date)).toMatchSnapshot();
	});

	it("identifies subclasses", () => {
		class Timestamp extends Date {}
		const date = "2000-12-31T18:02:16.555Z";
		expect(print(new Timestamp(date))).toMatchSnapshot();

		class BadDate extends Date {
			constructor() {
				super(NaN);
			}
		}
		const bad8 = new BadDate();
		expect(print(bad8)).toMatchSnapshot();
		const value = "Yeah, that's bad";
		Object.defineProperty(bad8, "text", { value });
		expect(print(bad8)).toMatchSnapshot();
		expect(print(bad8, { all: true })).toMatchSnapshot();
	});
});
