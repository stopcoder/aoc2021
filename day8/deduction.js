const fs = require('fs');
const readline = require('readline');

const numbers = [
	[1,1,1,0,1,1,1],
	[0,0,1,0,0,1,0],
	[1,0,1,1,1,0,1],
	[1,0,1,1,0,1,1],
	[0,1,1,1,0,1,0],
	[1,1,0,1,0,1,1],
	[1,1,0,1,1,1,1],
	[1,0,1,0,0,1,0],
	[1,1,1,1,1,1,1],
	[1,1,1,1,0,1,1]
];

let bigSum = 0;

const sums = numbers.map(bits => {
	return bits.reduce((sum, bit) => {
		return sum + bit;
	}, 0);
});

const stringReps = numbers.map(number => {
	return number.join("");
});

const candidates = ["a", "b", "c", "d", "e", "f", "g"];
const uniques = [undefined, 2, undefined, undefined, 4, undefined, undefined, 3, undefined, undefined];

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});


	for await (const line of rl) {
		console.log(line);
		let parts = line.split(" | ");
		const input = parts[0].split(" ");
		const output = parts[1].split(" ");

		solve(input, output);
	}

	console.log(`sum = ${bigSum}`);

}

function solve(input, output) {
	const combined = input.concat(output);
	const choose = [];
	function verify(result) {
		return combined.every(sequence => {
			return numbers.some((number, index) => {
				if (sums[index] === sequence.length) {
					return sequence.split("").every(bit => {
						let pos = result.indexOf(bit);
						return number[pos] === 1;
					});
				}
			});
		});
	}
	function construct(result) {
		if (result.length === 7) {
			if (verify(result)) {
				console.log(`found: ${result}`);
				let numString = "";
				output.forEach(sequence => {
					let bits = new Array(7).fill(0);
					sequence.split("").forEach(bit => {
						bits[result.indexOf(bit)] = 1;
					});

					numString += (stringReps.indexOf(bits.join("")));
				});
				bigSum += parseInt(numString, 10);
				return true;
			}
		} else {
			let next = result.length;
			let possible = choose[next] || candidates;
			return possible.some(bit => {
				if (result.indexOf(bit) === -1) {
					return construct(result + bit);
				}
			});
		}
	}

	combined.forEach(segment => {
		let pos = uniques.indexOf(segment.length);
		if (pos !== -1) {
			let number = numbers[pos];

			number.forEach((part, i) => {
				if (part === 1 && (!choose[i] || choose[i].length > segment.length)) {
					choose[i] = segment.split("").sort();
				}
			});
		}
	});

	construct("");
}


processLineByLine();
