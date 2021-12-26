let ybig = 0;
let count = 0;

for (let x = 1 ; x < 175 ; x++) {
	for (let y = -123 ; y < 124 ; y++) {
		let posx = 0;
		let posy = 0;

		let xc = x;
		let yc = y;

		let landed = false;
		let ymax = 0;
		while (posx <= 174 && posy >= -123) {
			posx += xc;
			posy += yc;

			ymax = Math.max(ymax, posy);

			if (xc > 0) {
				xc--;
			}

			yc--;

			if (posx >= 124 && posx <= 174 && posy <= -86 && posy >= -123) {
				landed = true;
				break;
			}
		}

		if (landed) {
			ybig = Math.max(ybig, ymax);
			count++;
		}
	}
}

console.log(ybig);
console.log(count);
