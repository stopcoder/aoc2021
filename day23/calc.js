const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const values = {
		A: 1,
		B: 10,
		C: 100,
		D: 1000
	};

	let moves;

	for await (const line of rl) {
		const parts = line.split(" ");

		moves = parts.map(part => {
			let type = part.charAt(0);
			let value = parseInt(part.substring(1), 10);
			console.log(`type: ${type}, value: ${value}`);
			return {
				type: type,
				value: value
			};
		});

		break;
	}

	let sum = moves.reduce((s, move) => {
		return s + values[move.type] * move.value;
	}, 0);

	console.log(sum);

}

processLineByLine();
