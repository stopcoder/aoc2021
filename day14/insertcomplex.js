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

	let cache = {};

	let repeat = 40;
	let calcTimes = 0;
	let recursiveTimes = 0;

	function insert(pair, times) {
		recursiveTimes++;
		if (times === 1) {
			let res = {};
			res[map[pair]] = 1;
			return res;
		}
		cache[pair] = cache[pair] || [];
		let m = cache[pair][times];

		if (!m) {
			let char = map[pair];
			let left = insert(pair[0]+char, times - 1);
			let right = insert(char+pair[1], times - 1);

			m = merge(char, left, right);
			cache[pair][times] = m;
			calcTimes++;
		}

		return m;
	}

	function merge(char, left, right) {
		var res = {};
		for (let i = "A".charCodeAt(0) ; i <= "Z".charCodeAt(0) ; i++) {
			let ci = String.fromCharCode(i);
			let nl = left[ci];
			let nr = right[ci];
			if (nl || nr) {
				res[ci] = (nl || 0) + (nr || 0);
			}
		}
		if (char) {
			res[char] = res[char] || 0;
			res[char]++;
		}
		return res;
	}

	let total = {};

	for (let pos = poly.length - 2 ; pos >= 0 ; pos--) {
		let key = poly.substring(pos, pos + 2);
		total = merge("", total, insert(key, repeat));
	}

	for (let pos = 0; pos < poly.length ; pos++) {
		total[poly[pos]] = total[poly[pos]] || 0;
		total[poly[pos]]++;
	}

	let most = 0;
	let least = Number.MAX_SAFE_INTEGER;

	Object.keys(total).forEach((char) => {
		most = Math.max(most, total[char]);
		least = Math.min(least, total[char]);
	});

	console.log(most - least);
	console.log(`Calculated ${calcTimes} times`);
	console.log(`Recursive ${recursiveTimes} times`);
}


processLineByLine();
