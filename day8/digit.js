const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let uniques = [2,3,4,7];

	let inputs = [];
	let outputs = [];
	for await (const line of rl) {
		let parts = line.split(" | ");
		inputs.push(parts[0].split(" "));
		outputs.push(parts[1].split(" "));
	}

	let total = 0;
	outputs.forEach(output => {
		output.forEach(segment => {
			if (uniques.indexOf(segment.length) !==-1) {
				total++;
			}
		});
	});

	console.log(total);
}


processLineByLine();
