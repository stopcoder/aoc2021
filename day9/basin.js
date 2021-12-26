const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const heatMap = [];

	for await (const line of rl) {
		heatMap.push(line.split("").map(e => parseInt(e, 10)));
	}

	const lows = [];

	heatMap.forEach((row, rIndex) => {
		row.forEach((element, cIndex) => {
			const left = (cIndex - 1) < 0 || element < heatMap[rIndex][cIndex - 1];
			const right = (cIndex + 1) === row.length || element < heatMap[rIndex][cIndex + 1];
			const up = (rIndex - 1) < 0 || element < heatMap[rIndex - 1][cIndex];
			const down = (rIndex + 1) === heatMap.length || element < heatMap[rIndex + 1][cIndex];

			if (left && right && up && down) {
				lows.push([rIndex, cIndex]);
			}
		});
	});



	const x_range = heatMap.length;
	const y_range = heatMap[0].length;
	const directions = [
		[0, 1],
		[0, -1],
		[1, 0],
		[-1, 0]
	];

	function basin(p, visited) {
		let sum = 1;
		visited[p[0]][p[1]] = true;

		directions.forEach(d => {
			let aj = [p[0] + d[0], p[1] + d[1]];

			if (!(aj[0] < 0 || aj[0] >= x_range || aj[1] < 0 || aj[1] >= y_range)) {
				if (!visited[aj[0]][aj[1]]) {
					if (heatMap[p[0]][p[1]] < heatMap[aj[0]][aj[1]] && heatMap[aj[0]][aj[1]] !== 9) {
						sum += basin(aj, visited);
					}
				}
			}

		});
		return sum;
	}

	let size = [];
	lows.forEach(p => {
		let visited = new Array(x_range);
		for (let i = 0; i < visited.length; i++) {
			visited[i] = new Array(y_range).fill(false);
		}
		size.push(basin(p, visited));
	});

	size.sort(function(a, b) {
		return b - a;
	})

	console.log(size);
	console.log(size[0] * size[1] * size[2]);
}


processLineByLine();
