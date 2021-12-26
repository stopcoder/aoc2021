const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let crabs;
	for await (const line of rl) {
		crabs = line.split(",");
		break;
	}

	let min = 10000;
	let max = 0;
	crabs.forEach(crab => {
		min = Math.min(crab, min);
		max = Math.max(crab, max);
	});

	let minMove = Number.MAX_SAFE_INTEGER;
	for (let i = 0 ; i <= max; i++) {
		let total = 0;
		crabs.forEach(crab => {
			total += (explus(Math.abs(crab - i)));
		});

		minMove = Math.min(minMove, total);
	}

	console.log(`min: ${minMove}`);
}

function explus(end) {
	let total = 0;
	for (let i = 1 ; i <= end ; i++) {
		total += i;
	}

	return total;
};

processLineByLine();
