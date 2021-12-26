const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let registry;
	for await (const line of rl) {
		if (!registry) {
			registry = new Array(line.length).fill(0);
		}

		var index;
		for (index = 0 ; index < line.length ; index++) {
			if (line[index] === "0") {
				registry[index] -= 1;
			} else {
				registry[index] += 1;
			}
		}
	}

	let gamma = "";
	let epsilon = "";
	registry.forEach(bit => {
		if (bit > 0) {
			gamma += 1;
			epsilon += 0;
		} else {
			epsilon += 1;
			gamma += 0;
		}
	});

	console.log(`gamma = ${gamma}`);
	console.log(`epsilon = ${epsilon}`);
	console.log(parseInt(gamma, 2) * parseInt(epsilon, 2));
}

processLineByLine();
