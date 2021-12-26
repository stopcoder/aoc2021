const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let template;
	let image;
	for await (const line of rl) {
		if (!template) {
			template = line.split("");
		} else if (line === "") {
			image = [];
		} else {
			image.push(line.split(""));
		}
	}

	const range = [
		[-1, -1],
		[-1, 0],
		[-1, 1],
		[0, -1],
		[0, 0],
		[0, 1],
		[1, -1],
		[1, 0],
		[1, 1]
	];

	function print(image) {
		image.forEach(row => {
			console.log(row.join(""));
		});
		console.log("-----------------")
	}
	
	const blank = [".", "#"]

	function enhance(image, ii) {
		image.forEach(row => {
			row.splice(0, 0, blank[ii]);
			row.splice(row.length, 0, blank[ii]);
		});

		image.splice(0, 0, Array(image[0].length).fill(blank[ii]));
		image.splice(image.length, 0, Array(image[0].length).fill(blank[ii]));
		
		const output = [];
		for (let i = 0; i< image.length; i++) {
			output.push(new Array(image[i].length));
		}

		// enhance
		image.forEach((row, r) => {
			row.forEach((pixel, c) => {
				let strBinary = "";
				range.forEach(diff => {
					const nr = r + diff[0];
					const nc = c + diff[1];
					if ( nr < 0 || nr > image.length - 1 || nc < 0 || nc > row.length - 1) {
						strBinary += (blank[ii] === "#" ? 1 : 0);
					} else {
						strBinary += (image[nr][nc] === "#" ? 1 : 0);
					}
				});

				const index = parseInt(strBinary, 2);
				output[r][c] = template[index];
			});
		});

		return output;
	}

	const repeat = 50;
	//print(image);
	for (let i = 0; i < repeat; i++) {
		image = enhance(image, i % 2);
		//print(image);
	}

	let lit = 0;
	image.forEach((row, r) => {
		row.forEach((pixel, c) => {
			if (pixel === "#") {
				lit++;
			}
		});
	});


	console.log(lit);
	//console.log(`magnitude: ${magnitude(sum)}`);

}


processLineByLine();

