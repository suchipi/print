"use strict";

module.exports = [
	/^[a-zA-Z0-9.!#$%&\'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
	/((\/\*)[^\x00]*?(\*\/))|[\t\n]/gm,
	/\\b(https?:\/\/([-\\w\\.]+)|www\\.|([-\\w\\.]+)\/)\\S+|$/i,
	/^(?:(?:^|\s+)\S+){8}(\s+\S+)/,
	/(<(\w+)\b[^>]*class\s*=\s*("[^">]*pre-line[^">]*"|\'[^\'>]*pre-line[^\'>]*\')[^>]*>)(.*?)(<\/\2>)/im,
	/[^\w-_'\u2019]+|['\u2019]{2,}/g,
	/[^\w_'\u2019]+|['\u2019]{2,}/g,
	/"([^\\"]|\\.)*"|'([^\\']|\\.)*'/,
	/((\/\*)[^\x00]*?(\*\/))/gm,
	/(?:^[\x20\t]+)|(?:\n\s*)(?=\n)|\s+$|\n\n/,
	/^[\x20\t]*\n|\n[\x20\t]*(?=\n|$)/gm,
	/^([^\/#\?]*:?\/\/)?(\/?(?:[^\/#\?]+\/)*)?([^\/#\?]+)?(?:\/(?=$))?(\?[^#]*)?(#.*)?$/,
	/^\s*(https?:)?\/\/([^:]+:[^@]+@)?([\w-]+)(\.[\w-]+)*(:\d+)?(\/\S+)?\s*$/,
	/\b(\d*1[1-3]th|\d*0th|(?:(?!11st)\d)*1st|\d*2nd|(?:(?!13rd)\d*)3rd|\d*[4-9]th)\b/
];