const input = "testisblack";
const check = "is";
const index = input.indexOf(check);
console.log(index);

const before = input[index - 1];
console.log(before);

const after = input[index + check.length];
console.log(after);
