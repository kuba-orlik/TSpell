// **************************************************
// Generates the spellcheck.ts file from a dictionary
// **************************************************

import { readFileSync, writeFileSync } from "fs";

// Converts ['cat', 'dog'] into `cat${infer Rest}` | `dog${infer Rest}`
const buildConditions = (strings) =>
  strings.map((symbol) => "`" + symbol + "${infer Rest}`").join(" | ");

// Read in a file of ~100k of the most common words in english (from
// http://norvig.com/google-books-common-words.txt).
let dictionary = readFileSync("common_words.txt", "utf8")
  .split("\n")
  .map((word) => word.split("\t")[0].toLowerCase());

// All the punctuation that exists.
const joiners = [" ", ".", ",", "!"];

// Rather than generate the whole spell-checking script, we'll just read a
// template and replace a few placeholder strings with the important bits.
let result = readFileSync("./spellcheck-template.ts", "utf8");
result = result.replace(
  "COMMENTHERE",
  "// This file is generated by generate_spellcheck.ts - don't bother editing."
);
result = result.replace("WORDSHERE", buildConditions(dictionary));
result = result.replace("JOINERSHERE", buildConditions(joiners));

// Write out the final spell-checker script. Don't open that file in VS Code -
// it gets *very* confused trying to parse it, format it, and organize its
// imports.
writeFileSync("./spellcheck.ts", result);
