const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let sequence;
	let boards = [];
	let board;
	for await (const line of rl) {
		if (!sequence) {
			sequence = line.split(",");
		} else if (line === "") {
			if (board) {
				boards.push(board);
			}
			board = [];
		} else {
			;
			board.push(line.replace(/^ /, "").replace(/  /g, " ").split(" "));
		}
	}

	boards.push(board);

	// build a map for the sequence
	let smap = {};
	sequence.forEach((e, i) => {
		smap[e] = i;
	});


	let boardMins = [];

	boards.forEach(board => {
		let columnIndexMaxes = new Array(5).fill(0);
		let rowIndexMin = 100;
		board.forEach(row => {
			let rowIndexMax = 0;
			row.forEach((element, column) => {
				let index = (smap[element] === "undefined") ? 100 : smap[element];
				if (index > rowIndexMax) {
					rowIndexMax = index;
				}

				if (index > columnIndexMaxes[column]) {
					columnIndexMaxes[column] = index;
				}
			});
			if (rowIndexMax < rowIndexMin) {
				rowIndexMin = rowIndexMax;
			}
		});
		boardMins.push(Math.min(rowIndexMin, Math.min.apply(null, columnIndexMaxes)));
	});

	let sequenceIndex = Math.max.apply(null, boardMins);
	let chosenBoardIndex = boardMins.indexOf(sequenceIndex);

	console.log(`board chosen: ${chosenBoardIndex}`);

	board = boards[chosenBoardIndex];

	let sum = 0;
	board.forEach(row => {
		row.forEach(element => {
			let index = (smap[element] === "undefined") ? 100 : smap[element];
			if (index > sequenceIndex) {
				sum += parseInt(element);
			}
		});
	});
	console.log(sum*parseInt(sequence[sequenceIndex]));
}

processLineByLine();
