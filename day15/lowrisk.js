const fs = require('fs');
const readline = require('readline');
import Heapify from "heapify";

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
		v[i] = new Array(input[i].length).fill(-1);
	}

	// coord string "x,y": true
	const visited = {
		"0,0": true
	};

	const directions = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	];

	v[0][0] = 0;

	while (true) {
		const queue = new Heapify();
		Object.keys(visited).forEach(key => {
			const c = min_node.split(",").map(e => parseInt(e, 10));
			directions.forEach(d => {
				const dx = c[0] + d[0];
				const dy = c[1] + d[1];
				if (dx >= 0 && dx < input.length && dy >=0 && dy < input[dx].length) {
					const k = dx + "," + dy;
					if (!visited[k]) {
						let value = v[c[0]][c[1]] + input[dx][dy];
						queue.push([dx, dy, c[0], c[1], value], value);
					}
				}
			});
		});

		const min_elem = queue.pop();
		min_node = min_elem[0]+","+min_elem[1];
		min = min_elem[4];
		v[min_elem[0]][min_elem[1]] = min;
		visited[min_node] = true;


		if (min_elem[0] === (input.length - 1) && min_elem[1] === (input[min_elem[0]].length - 1)) {
			console.log(min);
			break;
		}
	}
}


processLineByLine();
