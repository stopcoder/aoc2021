const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const m = [];
	for await (const line of rl) {
		m.push(line.split("").map(e => parseInt(e, 10)));
	}

	const directions = [
		[-1, -1],
		[0, -1],
		[1, -1],
		[1, 0],
		[1, 1],
		[0, 1],
		[-1, 1],
		[-1, 0]
	];

	let total = 0;

	function flash(ri, ci) {
		total++;
		m[ri][ci] = 0;
		directions.forEach(direction => {
			let x = ri + direction[0];
			let y = ci + direction[1];
			if (x >= 0 && x < m.length && y >= 0 && y < m[x].length && m[x][y] !== 0) {
				m[x][y] += 1;
				if (m[x][y] > 9) {
					flash(x, y);
				}
			}
		});
	}

	for (let i = 0 ; i < 10000 ; i++) {
		m.forEach((row, ri) => {
			row.forEach((o, ci) => {
				m[ri][ci] = o + 1;
			});
		});

		m.forEach((row, ri) => {
			row.forEach((o, ci) => {
				if (o > 9) {
					flash(ri, ci);
				}
			});
		});

		let allzero = m.every(row => {
			return row.every(e => e === 0)
		});

		if (allzero) {
			console.log(`step found: ${i+1}`);
			break;
		}
	}


	console.log(total);
}


processLineByLine();
