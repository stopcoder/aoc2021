const fs = require('fs');
const readline = require('readline');
const hash = require('object-hash');
const assert = require('assert').strict;

// [hallway, house, pos]
// hallway: -1 means that it's in a house
// house: -1 means that it's in hallway

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});


	let ln = 0;
	let rows = 2;
	const amps = [];
	for await (const line of rl) {
		if (ln >= 2 && ln < 2 + rows )  {
			let s = line.replace(/[ #]/g, "");
			s.split("").forEach((c, index) => {
				amps.push([c, -1 , 2 * (index + 1), ln - 2]);
			});
		}
		ln++;
	}

	console.log(amps);

	function getState(amipods) {
		const hallway = new Array(11).fill(".");
		const rooms = new Array(4);

		for (let i = 0; i < rooms.length; i++) {
			rooms[i] = new Array(rows).fill(".");
		}

		amipods.forEach(amp => {
			if (amp[1] === -1) {
				assert.notEqual(amp[2], -1, "house amp should have correct house number");
				rooms[amp[2] / 2 - 1][amp[3]] = amp[0];
			} else {
				hallway[amp[1]] = amp[0];
			}
		});

		return {
			h: hallway,
			r: rooms
		};
	}
}

processLineByLine();
