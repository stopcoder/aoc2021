const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const ts = [
		[
			[1, 0, 0],
			[0 ,1, 0],
			[0, 0, 1]
		],
		[
			[1, 0, 0],
			[0, 0, 1],
			[0 ,1, 0]
		],
		[
			[0 ,1, 0],
			[1, 0, 0],
			[0, 0, 1]
		],
		[
			[0, 0, 1],
			[1, 0, 0],
			[0 ,1, 0]
		],
		[
			[0 ,1, 0],
			[0, 0, 1],
			[1, 0, 0]
		],
		[
			[0, 0, 1],
			[0 ,1, 0],
			[1, 0, 0]
		],
	];

	const rs = [
		[1, 1, 1],
		[-1, 1, 1],
		[1, -1, -1],
		[1, -1, 1],
		[-1, 1, -1],
		[1, 1, -1],
		[-1, -1, 1],
		[-1, -1, -1]
	];

	const scanners = [];

	let scanner = {};

	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});
	for await (const line of rl) {
		if (line === "") {
			scanners.push(scanner);
			scanner = {};
		} else if (!line.startsWith("---")) {
			scanner.beacons = scanner.beacons || [];
			scanner.beacons.push(line.split(",").map(e => parseInt(e, 10)));
		}
	}
	scanners.push(scanner);

	const fileStream1 = fs.createReadStream('result');

	const rl1 = readline.createInterface({
		input: fileStream1,
		crlfDelay: Infinity
	});
	const result = [];
	for await (const line of rl1) {
		result.push(line.split(", ").map(e => parseInt(e, 10)));
	}

	function multiply(a, m) {
		let result = [];
		for (let i = 0; i < m[0].length; i++) {
			let total = 0;
			a.forEach((e, j) => {
				total += e * m[j][i];
			});
			result.push(total);
		}

		return result;
	}

	function transform(beacons, t, r) {
		return beacons.map(b => {
			let result = multiply(b, t);
			if (r) {
				result = result.map((e, i) => {
					return e * r[i];
				});
			}
			return result;
		});
	}

	function translate(beacons, diff) {
		return beacons.map((beacon) => {
			return beacon.map((n, i) => {
				return n - diff[i];
			});
		});
	}


	let starts = [[0, 0, 0]];

	result.forEach(data => {
		const gi = data[0];
		const bi = data[1];
		const t = data[2];
		const r = data[3];

		scanners[bi].beacons = transform(scanners[bi].beacons, ts[t], rs[r]);
		let start = [0, 1, 2].map(index => {
			return scanners[gi].beacons[l][index] - scanners[bi].beacons[k][index];
		});

		scanners[bi].beacons.forEach(beacon => {
			[0, 1, 2].forEach(index => {
				beacon[index] += start[index];
			});
		});

		starts[bi] = start;
	});

	let max = 0;
	for (let i = 0; i < starts.length - 1; i++) {
		for (let j = i + 1; j < starts.length; j++) {
			let m = [0, 1, 2].reduce((acc, index) => {
				return acc + Math.abs(starts[i][index] - starts[j][index]);
			}, 0);
			max = Math.max(max, m);
		}
	}
	console.log(max);
	//console.log(`magnitude: ${magnitude(sum)}`);

}


processLineByLine();

