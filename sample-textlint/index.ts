import { loadTextlintrc, createLinter } from "textlint";
import { TextlintKernelDescriptor } from "@textlint/kernel";
import { moduleInterop } from "@textlint/module-interop";

const ldescriptor = new TextlintKernelDescriptor({
    rules: [
        {
            ruleId: "no-todo",
            rule: moduleInterop((await import("textlint-rule-no-todo")).default),
            options: true
        },
    ],
    filterRules: [],
    plugins: [],
});

const rdescriptor = await loadTextlintrc()
const linter = createLinter({
    descriptor: rdescriptor.concat(ldescriptor),

})
const txt = `
TODO: this is TODO

- [ ] TODO
`
const result = await linter.lintText(txt, "sample.txt")
console.log(result)