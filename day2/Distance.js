const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let horizontal = 0;
	let vertical = 0;
	for await (const line of rl) {
		const aData = line.split(" ");
		switch (aData[0]) {
			case "forward":
				horizontal += parseInt(aData[1]);
				break;
			case "down":
				vertical += parseInt(aData[1]);
				break;
			case "up":
				vertical -= parseInt(aData[1]);
				break;
		}
	}

	console.log(horizontal * vertical);
}

processLineByLine();
