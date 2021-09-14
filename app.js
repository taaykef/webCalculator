import Calculator from "./calculator.js";

// Map UI to inputs
const kmap = new Map();
kmap.set("btn-0", Calculator.Keys.ZERO);
kmap.set("btn-1", Calculator.Keys.ONE);
kmap.set("btn-2", Calculator.Keys.TWO);
kmap.set("btn-3", Calculator.Keys.THREE);
kmap.set("btn-4", Calculator.Keys.FOUR);
kmap.set("btn-5", Calculator.Keys.FIVE);
kmap.set("btn-6", Calculator.Keys.SIX);
kmap.set("btn-7", Calculator.Keys.SEVEN);
kmap.set("btn-8", Calculator.Keys.EIGHT);
kmap.set("btn-9", Calculator.Keys.NINE);
kmap.set("btn-plus", Calculator.Keys.ADD);
kmap.set("btn-minus", Calculator.Keys.SUB);
kmap.set("btn-star", Calculator.Keys.MUL);
kmap.set("btn-slash", Calculator.Keys.DIV);
kmap.set("btn-equals", Calculator.Keys.EQU);
kmap.set("btn-reset", Calculator.Keys.DEL);
kmap.set("btn-dot", Calculator.Keys.DOT);
kmap.set("btn-clear", Calculator.Keys.CLR);
kmap.set("btn-random", Calculator.Keys.RND);
kmap.set("btn-swap", Calculator.Keys.SWP);
kmap.set("btn-sign", Calculator.Keys.SIG);
kmap.set("btn-power", Calculator.Keys.POW);

const calculator = new Calculator();

const scr0 = document.getElementById("scr-0").firstElementChild;
const scr1 = document.getElementById("scr-1").firstElementChild;
const buttons = document.querySelectorAll("button");

const btnHandler = function (event) {
	let presult = calculator.Enter(kmap.get(event.target.id));

	// Content
	if (presult[3] < 0) { // Power is off => Ignore outputs (garbage/undefined) and blank the screens
		scr0.innerText = scr1.innerText = "";
	}
	else { // Power is on. Update screens accordingly.
		scr0.innerText = presult[3] == 0 ? presult[0] : presult[1];
		scr1.innerText = (presult[2] == "?" ? presult[2] : parseFloat(presult[3] == 0 ? presult[1] : presult[0])) + " " + presult[2]
	}

	// CSS effects
	presult[3] >= 0 ? buttons.forEach(button => button.classList.add("powered")) : buttons.forEach(button => button.classList.remove("powered"));
	presult[3] >= 3 ? scr0.classList.add("blink") : scr0.classList.remove("blink");
}

// Add handler
buttons.forEach(button => button.addEventListener("click", btnHandler, false));
