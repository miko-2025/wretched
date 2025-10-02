const fs = require("fs/promises");
const pages = module.exports;
const { web } = require("game/config");


// hmm
Object.assign(pages, Object.fromEntries([
	[ "script.js",
		"moonsole.js",
		"config.js",
		"coloris.js",
		"EventSystem.js",
		"trail.js",
		"qevent.js",
		"zip.js",
		"index.js"
	],
	[ "style.css",
		"coloris.css",
		"style.css"
	],
	[ "index.html", "index.html" ],
	[ "404", "/404.html" ]
].map(op => [ op[0], new Promise(async function(res, rej){
	let [ name, ...files ] = op;
	const texts = [];

	for(const file of files){
		try {
			//console.log(`${web}/${file}`);
			texts.push(await fs.readFile(`${web}/${file}`));
		} catch(err){
			//console.log(err);
		}
	}

	//console.log("->", texts.join(""), "<-") ;
	res(texts.join(""))
}) ])));

new Promise(async function(res){
	res();
	const list = await fs.readdir(`${web}/anim/`);
	for(const f of list)
		pages[`anim_${f}`] = fs.readFile(`${web}/anim/${f}`);

});

