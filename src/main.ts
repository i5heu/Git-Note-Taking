import path from "path";
import PutBasicSetup from "./basic_setup.js";
import { Tree } from "./tree.js";
const util = require('util')

const directoryPath = path.join(__dirname, "../../Git-Note-Taking-Test");

async function main() {
  const queue = new Tree(directoryPath);
  await queue.prepare();

  console.log(util.inspect(queue, {showHidden: false, depth: null}))

  // await new PutBasicSetup(directoryPath);
}

main();
