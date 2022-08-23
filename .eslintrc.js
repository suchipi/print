module.exports = {
	extends: "unobtrusive",
	parser: "@babel/eslint-parser",
	parserOptions: {
		requireConfigFile: false,
	},
	env: {
		browser: false,
		mocha: false,
		node: false,
		es2020: true,
	},
	globals: {
		require: "readonly",
		module: "readonly",
		exports: "readonly",
		console: "readonly",
	},
	rules: {
		curly: ["warn", "all"],
		yoda: ["warn", "never"],
	},
	ignorePatterns: [".eslintrc.js"],
	overrides: [
		{
			files: ["test/**/*"],
			env: {
				mocha: true,
			},
			globals: {
				__filename: "readonly",
				__dirname: "readonly",
			},
		},
	],
};
