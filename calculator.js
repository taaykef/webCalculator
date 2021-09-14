// Inputs
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
	DEL: { kind: "RESET", value: "?" },
	NOP: { kind: "NOP", value: "" },
	DOT: { kind: "DOT", value: "." },
	CLR: { kind: "CLEAR", value: "0" },
	RND: { kind: "RANDOM", value: "0" },
	SWP: { kind: "SWAP", value: "0" },
	SIG: { kind: "SIGN", value: "-" },
	POW: { kind: "POWER", value: "" }
};

class Calculator {
	static Keys;
	static #operations; // Arithmetic ops
	static Initialize() {
		Calculator.Keys = Keys;
		Calculator.#operations = new Map();
		Calculator.#operations.set(Calculator.Keys.ADD, (op1, op2) => op1 + op2);
		Calculator.#operations.set(Calculator.Keys.SUB, (op1, op2) => op1 - op2);
		Calculator.#operations.set(Calculator.Keys.MUL, (op1, op2) => op1 * op2);
		Calculator.#operations.set(Calculator.Keys.DIV, (op1, op2) => op1 / op2);
	}
	#next;
	constructor() { 
		this.#Reset(); 

		// Initially off
		this.#next = -1;	
	 }

	// Resets the operations state
	#Reset() {
		this.operands = [Calculator.Keys.ZERO.value, Calculator.Keys.DEL.value];
		this.operation = Calculator.Keys.DEL;
	}

	#BuildOperand(key, current) {

		if (key.kind == "DIGIT") {
			if (this.operands[current] == Calculator.Keys.ZERO.value || this.operands[current] == Calculator.Keys.DEL.value) {
				this.operands[current] = "";
			}
			this.operands[current] += key.value;
		}

		if (key.kind == "DOT" && !this.operands[current].includes(Calculator.Keys.DOT.value)) {
			if (this.operands[current] == Calculator.Keys.DEL.value) {
				this.operands[current] = Calculator.Keys.ZERO.value;
			}
			this.operands[current] += key.value;
		};

		if (key.kind == "SIGN" && !isNaN(this.operands[current]) && Number(this.operands[current]) != 0) {
			if (this.operands[current].startsWith(key.value)) {
				this.operands[current] = this.operands[current].slice(1);
			}
			else {
				this.operands[current] = key.value + this.operands[current];
			}
		}
	}

	// Helper methods
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

	// Simulates external random digit (0 - 9) key press selection 
	#EnterRandomDigit() {
		this.Enter(Keys[Object.keys(Keys)[Math.floor(Math.random() * 10)]]);
	}

	// Key Press
	Enter(key) {
		switch (this.#next) {
			case -1: // Power is Off
				if (key.kind == "POWER") { this.#Reset(); this.#next = 0; }
				break;
			case 0:	// 1st operand 
				if (key.kind == "RESET" || key.kind == "POWER") { this.#Reset(); }
				if (key.kind == "DIGIT" || key.kind == "DOT" || key.kind == "SIGN") { this.#BuildOperand(key, 0); }
				if (key.kind == "RANDOM") { this.#EnterRandomDigit(); }
				if (key.kind == "OPERATION") { this.operation = key; this.#next = 1; }
				if (key.kind == "CLEAR") { this.operands[0] = Calculator.Keys.ZERO.value; };
				if (key.kind == "POWER") { this.#next = -1; }
				break;
			case 1:	// Operation
				if (key.kind == "RESET") { this.#Reset(); this.#next = 0; }
				if (key.kind == "DIGIT" || key.kind == "DOT") { this.#InsertOperand(key, 1); this.#next = 2; }
				if (key.kind == "RANDOM") { this.#EnterRandomDigit(); }
				if (key.kind == "OPERATION") { this.operation = key; }
				if (key.kind == "CLEAR") { this.operands[1] = Calculator.Keys.ZERO.value; };
				if (key.kind == "POWER") { this.#next = -1; }
				break;
			case 2:	// Last operand
				if (key.kind == "RESET") { this.#Reset(); this.#next = 0; }
				if (key.kind == "DIGIT" || key.kind == "DOT" || key.kind == "SIGN") { this.#BuildOperand(key, 1); }
				if (key.kind == "RANDOM") { this.#EnterRandomDigit(); }
				if (key.kind == "OPERATION") { this.#Eval(); this.operation = key; this.#next = 3; }
				if (key.kind == "EVAL") { this.#Eval(key); this.#next = 3; }
				if (key.kind == "CLEAR") { this.operands[1] = Calculator.Keys.ZERO.value; }
				if (key.kind == "SWAP") { this.operands = [this.operands[1], this.operands[0]]; this.#next = 3; }
				if (key.kind == "POWER") { this.#next = -1; }
				break;
			case 3:	// Evaluation
				if (key.kind == "RESET") { this.#Reset(); this.#next = 0; }
				if (key.kind == "DIGIT" || key.kind == "DOT") { this.#InsertOperand(key, 1); this.#next = 2; }
				if (key.kind == "RANDOM") { this.#EnterRandomDigit(); }
				if (key.kind == "OPERATION") { this.operation = key; }
				if (key.kind == "EVAL") { this.#Eval(); }
				if (key.kind == "CLEAR") { this.operands[1] = Calculator.Keys.ZERO.value; this.#next = 2; };
				if (key.kind == "SWAP") { this.operands = [this.operands[1], this.operands[0]]; }
				if (key.kind == "POWER") { this.#next = -1; }
				break;
			default:
				break;
		}
		return [this.operands[0], this.operands[1], this.operation.value, this.#next];
	}
}

Calculator.Initialize();
export default Calculator;