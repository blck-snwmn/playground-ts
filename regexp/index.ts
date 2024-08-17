console.log(`pattern=\s, input=' ' =`, /\s/.test(" "));

tests(/\s+/, [" ", "  ", "g g", " g"]);
tests(/\s+/g, [" ", "  ", "g g", " g"]);
tests(/\s+/g, ["g g", " ", "  ", " g"]);

function tests(pattern: RegExp, inputs: string[]) {
	console.log(`========pattern=${pattern}========`);
	for (const input of inputs) {
		const beforeIndex = pattern.lastIndex;
		const result = pattern.test(input);
		const resultPad = `${result}`.padEnd(5, " ");
		const afterIndex = pattern.lastIndex;
		console.log(
			`lastIndex=${beforeIndex}->${afterIndex}, result=${resultPad}, input='${input}'`,
		);
	}
	console.log();
}
