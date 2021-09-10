import Calculator from "./calculator.js";

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
kmap.set("btn-delete", Calculator.Keys.DEL);
kmap.set("btn-dot", Calculator.Keys.DOT);

const calculator = new Calculator();

const scr0 = document.getElementById("scr-0");
const scr1 = document.getElementById("scr-1");

const btnHandler = function (event) {
	let presult = calculator.Enter(kmap.get(event.target.id));

	scr0.innerText = presult[3] == 0 ? presult[0] : presult[1];  
	scr1.innerText = (presult[3] == 0 ? presult[1] : presult[0]) + " " + presult[2];  
}

document.querySelectorAll("button").forEach(button => button.addEventListener("click", btnHandler, false));
