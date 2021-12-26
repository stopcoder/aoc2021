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

	let finalBeacons = []

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

	let edges = [];
	for (let i = 0 ; i < scanners.length; i++) {
		for (let j = 0 ; j < scanners.length ; j++) {
			if (i == j) {
				continue;
			}
			let match = false;
			for (let l = 0 ; l < scanners[i].beacons.length ; l++) {
					for (let k = 0 ; k < scanners[j].beacons.length ; k++) {
						let beacons1 = translate(scanners[i].beacons, scanners[i].beacons[l]);
						let beacons2 = translate(scanners[j].beacons, scanners[j].beacons[k]);
						for (let t = 0 ; t < ts.length ; t++) {
							for (let r = 0 ; r < rs.length ; r++) {
								let transform2 = transform(beacons2, ts[t], rs[r]);
								let res = compare(beacons1, transform2);
								if (res.total >= 12) {


									edges[i] = edges[i] || [];
									edges[i].push(j);
									edges[j] = edges[j] || [];
									edges[j].push(i);
									console.log(JSON.stringify({
										a: i,
										b: j,
										t: t,
										r: r,
										p: [l, k]
									}));

									match = true;
									break;
								}
							}
							if (match) {
								break;
							}
						}
						if (match) {
							break;
						}
					}
				if (match) {
					break;
				}
			}
		}
	}

	//console.log(print(sum));
	//console.log(`magnitude: ${magnitude(sum)}`);

}


processLineByLine();

