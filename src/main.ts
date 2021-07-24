import path from "path";
import IndexCreator from "./basic_setup.js";
import { Hash } from "./hash.js";
import { Tree } from "./tree.js";
const util = require("util");

const directoryPath = path.join(__dirname, "../../Git-Note-Taking-Test");

async function main() {
  const tree = new Tree(directoryPath);
  await tree.prepare();

  await tree.iterateOverTree(async (chunk) => {
    // await Hash.hashIndex(chunk);
    console.log(
      util.inspect(await Hash.hashIndex(chunk), {
        showHidden: false,
        depth: null,
      })
    );
  });

  // console.log(util.inspect(queue, {showHidden: false, depth: null}))
}

main();
