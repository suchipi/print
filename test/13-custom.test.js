const { print } = require("./helpers");

describe("print.custom", () => {
	it("can be used to modify print output", () => {
		const value = {
			something: {
				is: "my custom thing",
				[print.custom]: (inputs) => {
					inputs.type = "My custom thing!!!";
					inputs.linesAfter.push("yeah :)");
				},
			},
		};

		expect(print(value)).toMatchSnapshot();
	});

	it("receives a lot of stuff", () => {
		let inputs;

		const value = {
			something: {
				is: "my custom thing",
				[print.custom]: (inputs_) => {
					inputs = inputs_;
				},
			},
		};

		print(value, { someOpt: true });
		expect(inputs).toMatchSnapshot();
	});
});
