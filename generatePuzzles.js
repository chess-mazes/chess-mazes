import { generatePuzzleRandom } from "./generator.js";

console.log("Generating puzzles...");

for (let i = 0; i < 5; i++) {
    console.log(generatePuzzleRandom(5));
}
