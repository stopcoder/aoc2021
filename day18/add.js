const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
	const fileStream = fs.createReadStream('input');

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity
	});

	function parse(number) {
		let level = 0;
		let stack = [];
		let tmp;
		for (let i = 0 ; i < number.length ; i++) {
			if (number[i] === "[") {
				stack.push({});
				tmp = "";
			} else if (number[i] === "]") {
				stack[stack.length - 1].right = (typeof tmp === "string" ? parseInt(tmp, 10) : tmp);
				let popped = stack.pop();
				tmp = popped;
			} else if (number[i] === ",") {
				stack[stack.length - 1].left = (typeof tmp === "string" ? parseInt(tmp, 10) : tmp);
				tmp = "";
			} else {
				tmp += number[i];
			}
		}
		return tmp;
	}

	const numbers = [];
	for await (const line of rl) {
		numbers.push(parse(line));
	}


	function reduce(sum) {
		let pn;
		let found = {};

		function traverse(node, level, parent, from, rest) {
			if (typeof rest === "number") {
				if (typeof node === "object") {
					return traverse(node.left, level + 1, node, "left", rest);
				} else {
					parent[from] = parent[from] + rest;
					return false;
				}
			} else {
				if (typeof node === "object") {
					if (level >= 4 && typeof node.left === "number" && typeof node.right === "number") {
						found.explode = true;
						parent[from] = 0;
						if (pn) {
							pn.parent[pn.position] = pn.parent[pn.position] + node.left;
						}
						return node.right;
					} else {
						let result = traverse(node.left, level + 1, node, "left") 
						if (result === false) {
							return false;
						} else {
							return traverse(node.right, level + 1, node, "right", result);
						}
					}
				} else {
					if (node >= 10) {
						if (!found.split) {
							found.split = {
								parent: parent,
								position: from
							};
						}
					}
					pn = {
						parent: parent,
						position: from
					};
					
				}
			}
		}

		let result = traverse(sum, 0);

		if (!found.explode && found.split) {
			let node = found.split.parent[found.split.position];
			found.split.parent[found.split.position] = {
				left: Math.floor(node / 2),
				right: Math.ceil(node / 2)
			};

			return false;
		} else {
			return result;
		}
	}


	function add(n1, n2) {
		let sum = {
			left: n1,
			right: n2
		};

		console.log("add: " + print(sum));

		let result;

		do {
			result = reduce(sum);
			console.log("reduce: " + print(sum));
		} while(result !== undefined);

		return sum;
	}

	function print(number) {
		if (typeof number === "number") {
			return number;
		} else {
			return "[" + print(number.left) + "," + print(number.right) + "]";
		}
	}

	function magnitude(number) {
		if (typeof number === "number") {
			return number;
		} else {
			return 3 * magnitude(number.left) + 2 * magnitude(number.right);
		}
	}


	const sum = numbers.reduce((sum, number) => {
		if (!sum) {
			return number;
		} else {
			return add(sum, number);
		}
	});

	console.log(print(sum));
	console.log(`magnitude: ${magnitude(sum)}`);

}


processLineByLine();
