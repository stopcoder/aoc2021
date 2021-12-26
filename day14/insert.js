const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let i = 0;
	let poly;
	let map = {};
	for await (const line of rl) {
		if (i === 0) {
			poly = line;
		} else if (i > 1) {
			let parts = line.split(" -> ");
			map[parts[0]] = parts[1];
		}
		i++;
	}

	let repeat = 10;
	for (let i = 0 ; i < repeat ; i++) {
		for (let pos = poly.length - 2 ; pos >= 0 ; pos--) {
			let key = poly.substring(pos, pos + 2);
			let char = map[key];

			if (!char) {
				console.log(`Error! ${key} cannot be found`);
			}

			poly = poly.slice(0, pos + 1) + char + poly.slice(pos + 1);
		}

	}

	let most = 0;
	let least = poly.length;
	let count = {};

	for (let i = 0; i < poly.length ; i++) {
		let char = poly[i];
		if (!count[char]) {
			count[char] = 1;
		} else {
			count[char]++;
		}
	}

	Object.keys(count).forEach((char) => {
		most = Math.max(most, count[char]);
		least = Math.min(least, count[char]);
	});

	console.log(most - least);
}


processLineByLine();
