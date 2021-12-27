import fs from "fs";
import readline from "readline";
import Queues from '@datastructures-js/priority-queue';
const { MinPriorityQueue } = Queues;

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const memo = [];
	const input = [];

	for await (const line of rl) {
		input.push(line.split("").map(e => parseInt(e, 10)));
	}

	function risk(x, y) {
		const tx = Math.floor(x / input.length);
		const ix = x % input.length;

		const ty = Math.floor(y / input[ix].length);
		const iy = y % input[ix].length;

		return (input[ix][iy] + tx + ty - 1) % 9 + 1;
	}

	const v = new Array(input.length * 5);
	for (let i = 0; i < v.length; i++) {
		v[i] = new Array(input[i % input.length].length * 5).fill(Number.MAX_SAFE_INTEGER);
	}


	const queue = new MinPriorityQueue({
		priority: (elem) => elem.v
	});

	queue.enqueue({
		c: [0,0],
		v: 0
	});

	const directions = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	];

	v[0][0] = 0;

	while (true) {
		const elem = queue.dequeue();
		const c = elem.element.c;

		if (c[0] === (input.length * 5 - 1) && c[1] === (input[c[0] % input.length].length * 5 - 1)) {
			console.log(elem.priority);
			break;
		}

		directions.forEach(d => {
			const dx = c[0] + d[0];
			const dy = c[1] + d[1];
			if (dx >= 0 && dx < input.length * 5 && dy >=0 && dy < input[dx % input.length].length * 5) {
				const value = v[c[0]][c[1]] + risk(dx, dy);
				if (value < v[dx][dy]) {
					v[dx][dy] = value;
					queue.enqueue({
						c: [dx, dy],
						v: value
					});
				}
			}
		});

	}
}


processLineByLine();
