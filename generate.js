const fs = require("fs");
const path = require("path");

const plainTemplate = (i) => `export default "Asset " + ${i};`;
const reactTemplate = (i) => `import * as React from "react";
function Component${i}(){
	const [v] = React.useState(Math.random())
	return <span>Component${i}: {v}</span>;
}

export {Component${i} as default};`;

const templates = {
	plain: plainTemplate,
	react: reactTemplate,
};

const [, , depth0, count0, asyncFraction0, template0] = process.argv;
let depth = Number(depth0);
let count = Number(count0);
let asyncFraction = Number(asyncFraction0);
let template = templates[template0];
if (
	count0 == null ||
	depth0 == null ||
	asyncFraction0 == null ||
	!count ||
	!depth ||
	Number.isNaN(asyncFraction) ||
	template == null
) {
	console.error(
		"Usage: node generate.js <depth> <count> <asyncFraction> <plain|react>"
	);
	process.exit(1);
}

console.log(
	`depth=${depth}, count=${count}, asyncFraction=${asyncFraction}, template=${template0}, count=${
		// sum count^i, i=0 to depth
		(Math.pow(count, depth + 1) - 1) / (count - 1)
	}`
);

let globalCounter = 1;
let asyncCounter = 0;
function fillDirectory(dir, d) {
	fs.mkdirSync(dir, { recursive: true });

	let barrel = "";
	if (d <= 1) {
		for (let i = 1; i <= count; i++) {
			let index = globalCounter++;
			fs.writeFileSync(path.join(dir, i + ".js"), template(index));
			if (asyncCounter++ == asyncFraction) {
				asyncCounter = 0;
				barrel += `export const v${index} = () => import("./${i}.js");\n`;
			} else {
				barrel += `export {default as v${index}} from "./${i}.js";\n`;
			}
		}
	} else {
		for (let i = 1; i <= count; i++) {
			let subdir = path.join(dir, String(i));
			fillDirectory(subdir, d - 1);
			barrel += `export * from "./${i}/index.js";\n`;
		}
	}
	fs.writeFileSync(path.join(dir, "index.js"), barrel);
}

fillDirectory("src", depth);
fs.writeFileSync(path.join("src", ".metadata_never_index"), "");
