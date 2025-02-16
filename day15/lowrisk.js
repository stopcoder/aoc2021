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

	const v = new Array(input.length);
	for (let i = 0; i < v.length; i++) {
		v[i] = new Array(input[i].length).fill(Number.MAX_SAFE_INTEGER);
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

		if (c[0] === (input.length - 1) && c[1] === (input[c[0]].length - 1)) {
			console.log(elem.priority);
			break;
		}

		directions.forEach(d => {
			const dx = c[0] + d[0];
			const dy = c[1] + d[1];
			if (dx >= 0 && dx < input.length && dy >=0 && dy < input[dx].length) {
				const value = v[c[0]][c[1]] + input[dx][dy];
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
