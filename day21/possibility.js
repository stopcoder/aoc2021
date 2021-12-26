const start = [1-1, 3-1];
//const start = [4-1, 8-1];

let combinations = [
]

for (let i = 0; i < 3; i++) {
	for (let j = 0; j < 3; j++) {
		for (let k = 0; k < 3; k++) {
			combinations.push([i+1, j+1, k+1]);
		}
	}
}


let m = {};
function roll(pos, score, who) {
	let next = (who + 1) % 2;
	let key = ""+pos[who]+pos[next]+","+score[who]+","+score[next];
	if (m[key]) {
		return m[key];
	}

	let result = [0, 0];
	combinations.forEach(v => {
		let newp = [];
		let news = [];

		newp[who] = (pos[who] + v[0] + v[1] + v[2]) % 10;
		newp[next] = pos[next];

		news[who] = score[who] + newp[who] + 1;
		news[next] = score[next];

		let r;
		if (news[who] >= 21) {
			result[0]++;
		} else {
			r = roll(newp, news, next);
			result[0] += r[1];
			result[1] += r[0];
		}
	});
	m[key] = result;
	return result;
}

let ans = roll(start, [0,0], 0);

console.log(ans);
