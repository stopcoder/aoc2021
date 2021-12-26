const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	let actions = [];
	let number = 0;
	for await (const line of rl) {
		if (number < 20) {
			let parts = line.split(" ");
			let action = {
				on: parts[0] === "on"
			};
			let d = parts[1].split(",");
			d.forEach(axis => {
				let p = axis.split("=");
				action[p[0]] = p[1].split("..").map(e => parseInt(e, 10));
			});
			actions.push(action);
		}
	}

	let cubes = [];
	function removeIntersect(cube) {
		function asc(a, b) {
			return a - b;
		}

		const length = cubes.length;

		for (let i = 0; i < length; i++) {
			let exist = cubes[i];

			let x_overlap = !(cube.x[1] < exist.x[0] || exist.x[1] < cube.x[0]);
			let y_overlap = !(cube.y[1] < exist.y[0] || exist.y[1] < cube.y[0]);
			let z_overlap = !(cube.z[1] < exist.z[0] || exist.z[1] < cube.z[0]);

			if (x_overlap && y_overlap && z_overlap) {
				let intersect = {};
				intersect.x = [exist.x[0], exist.x[1], cube.x[0], cube.x[1]].sort(asc).slice(1, 3);
				intersect.y = [exist.y[0], exist.y[1], cube.y[0], cube.y[1]].sort(asc).slice(1, 3);
				intersect.z = [exist.z[0], exist.z[1], cube.z[0], cube.z[1]].sort(asc).slice(1, 3);
				intersect.on = !exist.on;

				cubes.push(intersect);
			}
		}
		if (cube.on) {
			cubes.push(cube);
		}
	}

	function count() {
		let sum = 0;
		cubes.forEach(cube => {
			sum += ((cube.x[1] - cube.x[0] + 1)
				* (cube.y[1] - cube.y[0] + 1)
				* (cube.z[1] - cube.z[0] + 1)
				* (cube.on ? 1 : -1));
		});
		return sum;
	}

	actions.forEach(action => {
		removeIntersect(action);
	});

	console.log(count());
}

processLineByLine();
