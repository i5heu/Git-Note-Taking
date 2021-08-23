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

  await tree.iterateOverTree(async (mainChunk) => {
    await Hash.hashIndex(mainChunk);
    await Hash.uiCreator(mainChunk);

    if (mainChunk.indexString.length > 0) {
      fs.writeFile(
        mainChunk.path + "/AA_INDEX.auto.md",
        mainChunk.indexString.join(),
        () => { }
      );
    }

    if (mainChunk.name == ".scripts") {
      mainChunk.subItems.forEach(script => {
        if (!script.name.includes(".js")) return;
        var data = fs.readFileSync(script.path, "utf8");
        const str = data.toString();
        try {
          eval(str);
        } catch (error) {
          console.error("script.path:", script.path, "\n", error);
        }
      });
    }
  });

  // console.log(util.inspect(queue, {showHidden: false, depth: null}))
}

main();
