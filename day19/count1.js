const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

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

	function sub(arr1, arr2) {
		return arr1.map((e, i) => {
			return e - arr2[i];
		});
	}

	function align(bs, diff) {
		return bs.map((b) => {
			return b.map((e, i) => {
				return e + diff[i];
			});
		});
	}

	function compare(beacons1, beacons2) {
		let total = 0;

		function same(arr1, arr2) {
			return arr1.every((e, i) => {
				return e === arr2[i];
			});
		}

		let equals = [];
		beacons1.forEach((b, i) => {
			let pos;
			let found = beacons2.some((b1, j) => {
				pos = j;
				return same(b, b1);
			});
			if (found) {
				equals.push([i, pos]);
				total++;
			}
		});

		return {
			total: total,
			equals: equals
		};
	}

	function translate(beacons, diff) {
		return beacons.map((beacon) => {
			return beacon.map((n, i) => {
				return n - diff[i];
			});
		});
	}

	let finalBeacons = [];

	function insert(beacon) {
		let exist = finalBeacons.some(b => {
			return [0, 1, 2].every((index) => {
				return b[index] === beacon[index];
			});
		});

		if (!exist) {
			finalBeacons.push(beacon);
		}
	}

	let visited = [0];
	let left = Array(scanners.length - 1).fill().map((_, i) => i+1);
	let starts = [[0, 0, 0]];

	scanners[0].beacons.forEach(beacon => {
		finalBeacons.push(beacon);
	});

	while(left.length > 0) {
		let cont = left.some((bi, position) => {
			let match = visited.some(gi => {
				for (let l = 0 ; l < scanners[gi].beacons.length ; l++) {
					for (let k = 0 ; k < scanners[bi].beacons.length ; k++) {
						let beacons1 = translate(scanners[gi].beacons, scanners[gi].beacons[l]);
						let beacons2 = translate(scanners[bi].beacons, scanners[bi].beacons[k]);
						for (let t = 0 ; t < ts.length ; t++) {
							for (let r = 0 ; r < rs.length ; r++) {
								let transform2 = transform(beacons2, ts[t], rs[r]);
								let res = compare(beacons1, transform2);
								if (res.total >= 12) {

									console.log(`Match found: ${gi}, ${bi} with node ${l} and node ${k} aligned after transform ${t} and rotate ${r}`);

									scanners[bi].beacons = transform(scanners[bi].beacons, ts[t], rs[r]);
									let start = [0, 1, 2].map(index => {
										return scanners[gi].beacons[l][index] - scanners[bi].beacons[k][index];
									});
									
									scanners[bi].beacons.forEach(beacon => {
										[0, 1, 2].forEach(index => {
											beacon[index] += start[index];
										});
										finalBeacons.push(beacon);
									});


									starts[bi] = start;
									return true;
								}
							}
						}
					}
				}
			});
			if (match) {
				visited.push(bi);
				left.splice(position, 1);
				return true;
			}
		});

		if (!cont) {
			console.error("can't continue");
		}
	}

	let map = {};

	finalBeacons.forEach(beacon => {
		let key = [0, 1, 2].reduce((col, index) => {
			return col + beacon[index] + ",";
		}, "");
		map[key] = true;
	});

	console.log(Object.keys(map).length);

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

