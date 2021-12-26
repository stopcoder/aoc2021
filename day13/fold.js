const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const points = [];
	let max_x = 0;
	let max_y = 0;
	let ba;
	const actions = [];

	for await (const line of rl) {
		if (line === "") {
			ba = true;
			continue;
		}
		if (ba) {
			const parts = line.substring(11).split("=");
			parts[1] = parseInt(parts[1], 10);
			actions.push(parts);
		} else {
			const parts = line.split(",").map((_) => parseInt(_, 10));
			points.push(parts);

			max_x = Math.max(max_x, parts[0]);
			max_y = Math.max(max_y, parts[1]);
		}
	}

	let range = [max_x + 1, max_y + 1];

	actions.forEach(action => {
		const f = action[1];

		for (let i = points.length - 1; i >= 0; i--) {
			let p = points[i];

			if (action[0] === "x") {
				if (p[0] > f) {
					p[0] = 2 * f - p[0];
				}
			} else {
				if (p[1] > f) {
					p[1] = 2 * f - p[1];
				}
			}
		}


		if (action[0] === "x") {
			range[0] = f;
		} else {
			range[1] = f;
		}
	});


	const map = new Array(range[0]);

	for (let i = 0; i < map.length; i++) {
		map[i] = new Array(range[1]).fill(false);
	}

	points.forEach(p => {
		map[p[0]][p[1]] = true;
	});

	for (let i = range[0] - 1; i >= 0; i--) {
		let row = map[i];
		let s = "";
		for (let j = 0; j < range[1]; j++) {
			if (map[i][j]) {
				s += "#";
			} else {
				s += ".";
			}
		}
		console.log(s);
	}
}

processLineByLine();
