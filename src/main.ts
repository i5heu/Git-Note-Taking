import path from "path";
import PutBasicSetup from "./basic_setup.js";

const directoryPath = path.join(__dirname, "../../Git-Note-Taking-Test");

async function main() {
  await new PutBasicSetup(directoryPath);
}

main();
