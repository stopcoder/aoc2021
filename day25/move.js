const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const loc = [];
	for await (const line of rl) {
		loc.push(line.split(""));
	}

	function check(char) {
		const moveable = [];
		const diff = (char === ">" ? [0, 1] : [1, 0]);
		let adj, next;
		for (let r = 0; r < loc.length; r++) {
			for (let c = 0; c < loc[r].length; c++) {
				if (loc[r][c] === char) {
					next = [(r+diff[0])%loc.length, (c+diff[1])%loc[r].length];
					adj = loc[next[0]][next[1]];
					if (adj === ".") {
						moveable.push([r, c, next[0], next[1]]);
					}
				}
			}
		}
		return moveable;
	}

	function move(moveable) {
		moveable.forEach(move => {
			loc[move[2]][move[3]] = loc[move[0]][move[1]];
			loc[move[0]][move[1]] = ".";
		});
	}

	let round = 0;
	while (true) {
		let moveable = check(">");
		let eaststop = moveable.length === 0;

		move(moveable);

		moveable = check("v");
		let southstop = moveable.length === 0;
		move(moveable);

		round++;

		if (eaststop && southstop) {
			console.log(round);
			break;
		}
	}


}


processLineByLine();
