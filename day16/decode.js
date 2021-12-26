const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const binaryMap = ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111"];

	let input;
	for await (const line of rl) {
		input = line;
	}

	let binary = "";
	for (let i = 0 ; i < input.length ; i++) {
		let dec = parseInt(input[i], 16);
		binary += binaryMap[dec];
	}

	let start = 0;
	let versionTotal = 0;
	let stack = [];
	let finalResult;

	function evaluate(entry) {
		let r = entry.results;
		switch(entry.id) {
			case 0:
				// sum
				return r.reduce((total, e) => {
					return total + e;
				}, 0);
			case 1:
				// multiply
				return r.reduce((total, e) => {
					return total * e;
				}, 1);
			case 2:
				// min
				return Math.min.apply(null, r);
			case 3:
				// max
				return Math.max.apply(null, r);
			case 5:
				// greater
				return r[0] > r[1] ? 1 : 0;
			case 6:
				// less than
				return r[0] < r[1] ? 1 : 0;
			case 7:
				// equal
				return r[0] === r[1] ? 1 : 0;
		}
	}

	while (start < binary.length) {
		let version = parseInt(binary.substring(start, start + 3), 2);
		versionTotal += version;
		let typeId = parseInt(binary.substring(start + 3, start + 6), 2);

		console.log(`version: ${version}, type id: ${typeId}`);
		if (typeId === 4) {
			let pos = start + 6;
			let firstBit;
			let number = "";

			do {
				let section = binary.substring(pos, pos + 5);
				firstBit = section[0];
				number += (new Number(parseInt(section.substring(1), 2)).toString(16));
				pos += 5;
			} while(firstBit === "1");

			let lastElement = stack[stack.length - 1];
			lastElement.results.push(parseInt(number, 16));

			start = pos;

			while (stack.length > 0) {
				lastElement = stack[stack.length - 1];
				if (lastElement.end) {
					if (start === lastElement.end) {
						let popped = stack.pop();
						let value = evaluate(popped);
						if (stack.length > 0) {
							stack[stack.length - 1].results.push(value)
						} else {
							finalResult = value;
						}
					} else {
						break;
					}
				} else {
					lastElement.count--;
					if (lastElement.count === 0) {
						let popped = stack.pop();
						let value = evaluate(popped);
						if (stack.length > 0) {
							stack[stack.length - 1].results.push(value)
						} else {
							finalResult = value;
						}
					} else {
						break;
					}
				}
			}
			if (stack.length === 0) {
				break;
			}
		} else {
			let lengthTypeId = binary[start + 6];
			if (lengthTypeId === "0") {
				let length = parseInt(binary.substring(start + 7, start + 7 + 15), 2);
				stack.push({
					id: typeId,
					end: start + 7 + 15 + length,
					results: []
				});
				start = start + 7 + 15;
				//next 15 bits
			} else {
				//next 11 bits
				let count = parseInt(binary.substring(start + 7, start + 7 + 11), 2);
				stack.push({
					id: typeId,
					count: count,
					results: []
				});
				start = start + 7 + 11;
			}
		}
	}

	console.log(`version total: ${versionTotal}`);
	console.log(`final result: ${finalResult}`);
}


processLineByLine();
