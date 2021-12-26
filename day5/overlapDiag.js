const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const lines = [];
	let xmax = ymax = 0;
	for await (const line of rl) {
		let parts = line.split(" -> ");
		
		parts[0] = parts[0].split(",").map(element => parseInt(element, 10));
		parts[1] = parts[1].split(",").map(element => parseInt(element, 10));

		xmax = Math.max(xmax, parts[0][0], parts[1][0]);
		ymax = Math.max(ymax, parts[0][1], parts[1][1]);

		lines.push(parts);
	}

	const result = new Array(xmax + 1).fill(0);

	result.forEach((a, i) => {
		result[i] = new Array(ymax + 1).fill(0);
	});

	lines.forEach(line => {
		let xdiff = line[1][0] - line[0][0];
		let ydiff = line[1][1] - line[0][1];

		let xstep = xdiff === 0 ? 0 : (xdiff / Math.abs(xdiff));
		let ystep = ydiff === 0 ? 0 : (ydiff / Math.abs(ydiff));

		let x = line[0][0];
		let y = line[0][1];

		while (x !== line[1][0] || y !== line[1][1]) {
			result[x][y] += 1;
			x += xstep;
			y += ystep;
		}

		result[x][y] += 1;
	});

	let count = 0;

	result.forEach(row => {
		row.forEach(element => {
			if (element > 1) {
				count++;
			}
		});
	});
	console.log(`count: ${count}`);

}

processLineByLine();
