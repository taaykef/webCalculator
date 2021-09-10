const Keys = {
	ZERO: { kind: "DIGIT", value: "0" },
	ONE: { kind: "DIGIT", value: "1" },
	TWO: { kind: "DIGIT", value: "2" },
	THREE: { kind: "DIGIT", value: "3" },
	FOUR: { kind: "DIGIT", value: "4" },
	FIVE: { kind: "DIGIT", value: "5" },
	SIX: { kind: "DIGIT", value: "6" },
	SEVEN: { kind: "DIGIT", value: "7" },
	EIGHT: { kind: "DIGIT", value: "8" },
	NINE: { kind: "DIGIT", value: "9" },
	ADD: { kind: "OPERATION", value: "+" },
	SUB: { kind: "OPERATION", value: "-" },
	MUL: { kind: "OPERATION", value: "*" },
	DIV: { kind: "OPERATION", value: "/" },
	EQU: { kind: "EVAL", value: "=" },
	DEL: { kind: "RESET", value: "@" },
	NOP: { kind: "NOP", value: "" },
	DOT: { kind: "DOT", value: "." }
};

class Calculator {
	static Keys;
	static #operations; // ARITHMETIC
	static Initialize() {
		Calculator.Keys = Keys;
		Calculator.#operations = new Map();
		Calculator.#operations.set(Calculator.Keys.ADD, (op1, op2) => op1 + op2);
		Calculator.#operations.set(Calculator.Keys.SUB, (op1, op2) => op1 - op2);
		Calculator.#operations.set(Calculator.Keys.MUL, (op1, op2) => op1 * op2);
		Calculator.#operations.set(Calculator.Keys.DIV, (op1, op2) => op1 / op2);
	}
	#next;
	constructor() { this.#Reset(); }

	#Reset() {
		this.operands = [Calculator.Keys.ZERO.value, Calculator.Keys.DEL.value];
		this.operation = Calculator.Keys.DEL;
		this.#next = 0;
	}

	#BuildOperand(key, current) {
		if (key.kind == "DOT" && this.operands[current].includes(Calculator.Keys.DOT.value)) return;
		if (key.kind == "DOT" && this.operands[current] == Calculator.Keys.DEL.value) {
			this.operands[current] = Calculator.Keys.ZERO.value + Calculator.Keys.DOT.value;
			return;
		}
		if (key.kind == "DIGIT" && (this.operands[current] == Calculator.Keys.ZERO.value || this.operands[current] == Calculator.Keys.DEL.value)) {
			this.operands[current] = key.value;
			return;
		}
		this.operands[current] += key.value;
	}

	#InsertOperand(key, current) {
		this.operands[current] = key.value;
		if (key.kind == "DOT") {
			this.operands[current] = Calculator.Keys.ZERO.value + this.operands[current];
		}
	}

	#Eval() {
		this.operands[0] = (Calculator.#operations.get(this.operation))(parseFloat(this.operands[0]), parseFloat(this.operands[1]));
		this.operands[0] = "" + this.operands[0];
	}

	Enter(key) {

		if (key.kind == "RESET") { this.#Reset(); }

		switch (this.#next) {
			case 0:
				if (key.kind == "DIGIT" || key.kind == "DOT") { this.#BuildOperand(key, 0); }
				if (key.kind == "OPERATION") { this.operation = key; this.#next = 1; }
				break;
			case 1:
				if (key.kind == "DIGIT" || key.kind == "DOT") { this.#InsertOperand(key, 1); this.#next = 2; }
				if (key.kind == "OPERATION") { this.operation = key; }
				break;
			case 2:
				if (key.kind == "DIGIT" || key.kind == "DOT") { this.#BuildOperand(key, 1); }
				if (key.kind == "OPERATION") { this.#Eval(); this.operation = key; this.#next = 3; }
				if (key.kind == "EVAL") { this.#Eval(key); this.#next = 3; }
				break;
			case 3:
				if (key.kind == "DIGIT" || key.kind == "DOT") { this.#InsertOperand(key, 1); this.#next = 2; }
				if (key.kind == "OPERATION") { this.operation = key; }
				if (key.kind == "EVAL") { this.#Eval(); }
				break;
			default:
				break;
		}
		return [this.operands[0], this.operands[1], this.operation.value, this.#next];
	}
}

Calculator.Initialize();
export default Calculator;