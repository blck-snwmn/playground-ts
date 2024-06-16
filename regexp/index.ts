console.log(`pattern=\s, input=' ' =`, /\s/.test(" "));

tests(/\s+/, [" ", "  ", "g g", " g"]);
tests(/\s+/g, [" ", "  ", "g g", " g"]);
tests(/\s+/g, ["g g", " ", "  ", " g"]);

function tests(pattern: RegExp, inputs: string[]) {
	console.log(`========pattern=${pattern}========`);
	for (const input of inputs) {
		console.log(`input='${input}' =`, pattern.test(input));
	}
	console.log();
}
