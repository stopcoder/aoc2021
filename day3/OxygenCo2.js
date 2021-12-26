const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const oxygens = [];
	const co2s = [];
	for await (const line of rl) {
		oxygens.push(line);
		co2s.push(line);
	}

	const length = oxygens[0].length;

	for (let i = 0 ; i < length ; i++) {
		let sum = 0;
		let csum = 0;
		let most;
		let cmost;

		oxygens.forEach(o => {
			if (o[i] === "1") {
				sum++;
			} else {
				sum--;
			}
		});

		co2s.forEach(o => {
			if (o[i] === "1") {
				csum++;
			} else {
				csum--;
			}
		});

		if (sum >= 0) {
			most = "1";
		} else {
			most = "0";
		}

		if (csum >= 0) {
			cmost = "1";
		} else {
			cmost = "0";
		}

		if (oxygens.length > 1) {
			for (let j = oxygens.length - 1 ; j >= 0 ; j--) {
				if (oxygens[j][i] !== most) {
					oxygens.splice(j, 1);
				}
			}
		}

		if (co2s.length > 1) {
			for (let j = co2s.length - 1 ; j >= 0 ; j--) {
				if (co2s[j][i] === cmost) {
					co2s.splice(j, 1);
				}
			}
		}

		if (oxygens.length <= 1 && co2s.length <= 1) {
			break;
		}
	}

	console.log(oxygens[0]);
	console.log(co2s[0]);
	console.log(parseInt(oxygens[0], 2) * parseInt(co2s[0], 2));
}

processLineByLine();
