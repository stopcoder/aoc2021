const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	function verify(line) {
		const stack = [];

		const valid = line.split("").every(c => {
			let il = lefts.indexOf(c);
			if (il !== -1) {
				stack.push(c);
				return true;
			} else {
				let ir = rights.indexOf(c);
				let pop = stack.pop();
				let ip = lefts.indexOf(pop);
				return ip === ir;
			}
		});

		if (valid) {
			return stack;
		}
	}

	function calc(stack) {
		return stack.reverse().reduce((sum, c) => {
			let score = lefts.indexOf(c) + 1;
			return sum * 5 + score;
		}, 0);
	}

	const lefts = ["(", "[", "{", "<"];
	const rights = [")", "]", "}", ">"];

	let results = [];

	for await (const line of rl) {
		const stack = verify(line);

		if (stack) {
			results.push(calc(stack));
		}
	}

	results.sort((a, b) => a - b);
	console.log(results[Math.floor(results.length / 2)]);
}


processLineByLine();
