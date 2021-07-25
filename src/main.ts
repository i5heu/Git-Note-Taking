import path from "path";
import IndexCreator from "./basic_setup.js";
import { Hash } from "./hash.js";
import { Tree } from "./tree.js";
import fs from "fs";
const fsPromises = fs.promises;
const util = require("util");

const directoryPath = path.join(__dirname, "../../Git-Note-Taking-Test");

async function main() {
  const tree = new Tree(directoryPath);
  await tree.prepare();

  await tree.iterateOverTree(async (chunk) => {
    await Hash.hashIndex(chunk);
    await Hash.uiCreator(chunk);

    if (chunk.indexString.length > 0) {
      fs.writeFile(
        chunk.path + "/AA_INDEX.auto.md",
        chunk.indexString.join(),
        () => {}
      );
    }
  });

  // console.log(util.inspect(queue, {showHidden: false, depth: null}))
}

main();
