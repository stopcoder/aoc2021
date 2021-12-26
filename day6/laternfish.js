const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let fishes;
	let day = 80;
	for await (const line of rl) {
		fishes = line.split(",");
		break;
	}

	for (let i = 0 ; i < day ; i++) {
		let count = 0;
		fishes.forEach(function(fish, j) {
			fishes[j] = fish - 1;

			if (fishes[j] < 0) {
				fishes[j] = 6;
				count++;
			}
		});

		console.log(`after ${i+1} days, there are ${count} new fishes`);
		for (let k = 0 ; k < count ; k++) {
			fishes.push(8);
		}
	}

	console.log(fishes.join(","));
	console.log(fishes.length);
}

processLineByLine();
