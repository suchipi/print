const realPrint = require("../print");

const rootDir = require("path").resolve(__dirname, "..");

const printSanitized = (...args) => {
	return realPrint(...args)
		.replaceAll(rootDir, "<rootDir>")
		.replace(/:\d+:\d+\)/g, ":LINE:COL)");
};

printSanitized.custom = realPrint.custom;

module.exports = { print: printSanitized };
