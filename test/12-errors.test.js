const { print } = require("./helpers");

describe("Errors", () => {
	Object.entries({
		// tests run in node, so errors are already v8-style
		"V8-style": () => new Error("hello there"),

		"quickjs-style": () => {
			const error = new Error("hello there");
			error.stack = [
				`    at <eval> (<evalScript>)`,
				`    at evalScript (native)`,
				`    at eval_and_print`,
				`    at handle_cmd`,
				`    at readline_handle_cmd`,
				`    at handle_key`,
				`    at handle_char`,
				`    at handle_byte`,
				`    at term_read_handler`,
			].join("\n");
			return error;
		},

		"spidermonkey-style": () => {
			const error = new Error("hello there");
			error.stack = [
				`trace@file:///C:/example.html:9:17`,
				`b@file:///C:/example.html:16:13`,
				`a@file:///C:/example.html:19:13`,
				`@file:///C:/example.html:21:9`,
			].join("\n");
			return error;
		},

		"spidermonkey eval-style": () => {
			const error = new Error("hello there");
			error.stack = [
				`@file:///C:/example.html line 7 > eval line 1 > eval:1:1`,
				`@file:///C:/example.html line 7 > eval:1:1`,
				`@file:///C:/example.html:7:6`,
			].join("\n");
			return error;
		},
	}).forEach(([descr, makeError]) => {
		describe(descr, () => {
			it("prints normal errors as expected", () => {
				const error = makeError();
				expect(print(error)).toMatchSnapshot();
			});

			it("reformats stack with requested indentation", () => {
				const error = makeError();
				expect(print(error, { indent: "__" })).toMatchSnapshot();
			});

			it("prints error properties", () => {
				const error = makeError();
				error.path = "/some/where/idk";
				error.code = 45;
				expect(print(error)).toMatchSnapshot();
			});

			it("prints message and stack if `opts.all` is enabled", () => {
				const error = makeError();
				error.path = "/some/where/idk";
				error.code = 45;
				expect(print(error, { all: true })).toMatchSnapshot();
			});
		});
	});
});
