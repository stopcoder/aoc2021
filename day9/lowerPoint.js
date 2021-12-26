const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const heatMap = [];

	for await (const line of rl) {
		heatMap.push(line.split(""));
	}

	let sum = 0;

	heatMap.forEach((row, rIndex) => {
		row.forEach((element, cIndex) => {
			const left = (cIndex - 1) < 0 || element < heatMap[rIndex][cIndex - 1];
			const right = (cIndex + 1) === row.length || element < heatMap[rIndex][cIndex + 1];
			const up = (rIndex - 1) < 0 || element < heatMap[rIndex - 1][cIndex];
			const down = (rIndex + 1) === heatMap.length || element < heatMap[rIndex + 1][cIndex];

			if (left && right && up && down) {
				sum += (parseInt(element, 10) + 1);
			}
		});
	});

	console.log(sum);

}


processLineByLine();
