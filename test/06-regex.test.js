const print = require("../print");

describe("Regular expressions", () => {
	it("prints simple regex", () => {
		expect(print(/a/)).toMatchSnapshot();
		expect(print(/b|c/)).toMatchSnapshot();
		expect(print(/\v/)).toMatchSnapshot();
		expect(print(/a/i)).toMatchSnapshot();
		expect(print(/a/gim)).toMatchSnapshot();
	});

	it("prints hairy regex", async () => {
		const fn = () => [
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
			/((\/\*)[^\x00]*?(\*\/))|[\t\n]/gm,
			/\\b(https?:\/\/([-\\w\\.]+)|www\\.|([-\\w\\.]+)\/)\\S+|$/i,
			/^(?:(?:^|\s+)\S+){8}(\s+\S+)/,
			/(<(\w+)\b[^>]*class\s*=\s*("[^">]*pre-line[^">]*"|'[^'>]*pre-line[^'>]*')[^>]*>)(.*?)(<\/\2>)/im,
			/[^\w-_'\u2019]+|['\u2019]{2,}/g,
			/[^\w_'\u2019]+|['\u2019]{2,}/g,
			/"([^\\"]|\\.)*"|'([^\\']|\\.)*'/,
			/((\/\*)[^\x00]*?(\*\/))/gm,
			/(?:^[\x20\t]+)|(?:\n\s*)(?=\n)|\s+$|\n\n/,
			/^[\x20\t]*\n|\n[\x20\t]*(?=\n|$)/gm,
			/^([^/#?]*:?\/\/)?(\/?(?:[^/#?]+\/)*)?([^/#?]+)?(?:\/(?=$))?(\?[^#]*)?(#.*)?$/,
			/^\s*(https?:)?\/\/([^:]+:[^@]+@)?([\w-]+)(\.[\w-]+)*(:\d+)?(\/\S+)?\s*$/,
			/\b(\d*1[1-3]th|\d*0th|(?:(?!11st)\d)*1st|\d*2nd|(?:(?!13rd)\d*)3rd|\d*[4-9]th)\b/,
		];
		const regex = fn();
		const lines = fn
			.toString()
			.replace(/^.+?\[\s*|\s*\]$/gs, "")
			.split(/\r?\n/);
		lines.forEach((line, index) =>
			expect(print(regex[index])).toMatchSnapshot()
		);
	});

	it("displays named properties", () => {
		const value = /abc|xyz/gi;
		value.foo = "Foo";
		expect(print(value)).toMatchSnapshot();
		value.bar = "Bar";
		expect(print(value)).toMatchSnapshot();
	});

	it("identifies subclasses", () => {
		class PCRE extends RegExp {}
		const regex = new PCRE("ABC|XYZ", "gi");
		expect(print(regex)).toMatchSnapshot();
		regex.foo = "Foo";
		expect(print(regex)).toMatchSnapshot();
		regex.exec("ABC");
		expect(print(regex, { all: true })).toMatchSnapshot();
	});
});
