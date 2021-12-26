const start = [1-1, 3-1];
// const start = [4-1, 8-1];

let dice = 1;

let score = [0, 0];
let who = 0;

while(score[0] < 1000 && score[1] < 1000) {

	[0,1,2].forEach(time => {
		start[who] = start[who] + dice;
		dice++;
	});

	let result = start[who] % 10;
	start[who] = result;
	score[who] = score[who] + result + 1;

	who = (who + 1) % 2;
}

console.log(dice - 1);
console.log(Math.min(score[0], score[1]));
console.log((dice - 1) * Math.min(score[0], score[1]));
