module.exports = {
	extends: "unobtrusive",
	parser: "@babel/eslint-parser",
	parserOptions: {
		requireConfigFile: false,
	},
	env: {
		browser: false,
		node: false,
		es2020: true,
	},
	globals: {
		require: "readonly",
		module: "readonly",
		exports: "readonly",
		console: "readonly",
	},
	ignorePatterns: [".eslintrc.js"],
	overrides: [
		{
			files: ["test/**/*"],
			env: {
				jest: true,
			},
			globals: {
				__filename: "readonly",
				__dirname: "readonly",
			},
		},
	],
};
