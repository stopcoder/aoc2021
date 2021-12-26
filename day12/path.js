const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const edges = [];
	for await (const line of rl) {
		let parts = line.split("-");

		[0, 1].forEach(index => {
			edges[parts[index]] = edges[parts[index]] || [];
			edges[parts[index]].push(parts[1 - index]);
		});
	}

	let total = 0;

	function forward(path, station) {
		if (station.toLowerCase() === station) {
			if (path.indexOf(station) !== -1) {
				return;
			}
		}

		path.push(station);
		if (station === "end") {
			total++;
			console.log(path.join("->"));
		} else {
			let vertices = edges[station] || [];
			vertices.forEach(v => {
				forward(path.map(e => e), v);
			});
		}
	}

	let startFollows = edges["start"];
	startFollows.forEach(v => {
		forward(["start"], v);
	});

	console.log(total);
}


processLineByLine();
