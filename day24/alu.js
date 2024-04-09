const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	const steps = [];
	const vars = {
		w: 0,
		x: 0,
		y: 0,
		z: 0
	};

	for await (const line of rl) {
		const parts = line.split(" ");
		const elem = {};
		elem.op = parts[0];
		elem.params = parts.slice(1);
		steps.push(elem);
	}


	let inp_c = 0;
	const operations = {
		inp: () => {
			return "d" + (inp_c++);
		},
		mul: (a, b) => {
			if (typeof a === "number" && typeof b === "number") {
				return a * b;
			} else if (typeof a === "number") {
				if (a === 0) {
					return 0;
				}
				if (a === 1) {
					return b;
				}
				return `${a} * (${b})`
			} else if (typeof b === "number") {
				if (b === 0) {
					return 0;
				}
				if (b === 1) {
					return a;
				}
				return `(${a}) * ${b}`
			} else {
				return `(${a}) * (${b})`
			}
		},
		add: (a, b) => {
			if (typeof a === "number" && typeof b === "number") {
				return a + b;
			} else if (typeof a === "number") {
				if (a === 0) {
					return b;
				}
				return `${a} + (${b})`
			} else if (typeof b === "number") {
				if (b === 0) {
					return a;
				}
				return `(${a}) + ${b}`
			} else {
				return `(${a}) + (${b})`
			}
		},
		mod: (a, b) => {
			if (typeof a === "number" && typeof b === "number") {
				return a % b;
			} else if (typeof a === "number") {
				return `${a} % (${b})`
			} else if (typeof b === "number") {
				return `(${a}) % ${b}`
			} else {
				return `(${a}) % (${b})`
			}
		},
		div: (a, b) => {
			if (typeof a === "number" && typeof b === "number") {
				return a * b;
			} else if (typeof a === "number") {
				return `${a} * (${b})`
			} else if (typeof b === "number") {
				if (b === 1) {
					return a;
				}
				return `(${a}) * ${b}`
			} else {
				return `(${a}) * (${b})`
			}
		},
		eql: (a, b) => {
			if (typeof a === "number" && typeof b === "number") {
				return a === b ? 1 : 0;
			} else if (typeof a === "number") {
				if (b.length === 2 && a >= 10) {
					return 0;
				}
				return `${a} === (${b}) ? 1 : 0`
			} else if (typeof b === "number") {
				if (a.length === 2 && b >= 10) {
					return 0;
				}
				return `(${a}) === ${b} ? 1 : 0`
			} else {
				return a === b ? 1 : `(${a}) === (${b}) ? 1 : 0`;
			}
		}
	};

	function convert(variable) {
		if (vars.hasOwnProperty(variable)) {
			return vars[variable];
		} else {
			return parseInt(variable, 10);
		}
	}

	steps.forEach(step => {
		let v = operations[step.op].apply(null, step.params.map(convert));
		vars[step.params[0]] = v;
	});

	console.log(vars.z);
}


processLineByLine();
