const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	function find(line) {
		const stack = [];

		return line.split("").find(c => {
			let il = lefts.indexOf(c);
			if (il !== -1) {
				stack.push(c);
			} else {
				let ir = rights.indexOf(c);
				let pop = stack.pop();
				let ip = lefts.indexOf(pop);
				if (ip !== ir) {
					return true;
				}
			}
		});
	}

	const lefts = ["(", "[", "{", "<"];
	const rights = [")", "]", "}", ">"];
	const scores = {
		")": 3,
		"]": 57,
		"}": 1197,
		">": 25137
	};

	let total = 0;

	for await (const line of rl) {
		const corrupt = find(line);

		if (corrupt) {
			total += scores[corrupt];
		}
	}

	console.log(total);
}


processLineByLine();
