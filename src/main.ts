import path from "path";
import PutBasicSetup from "./basic_setup.js";
import { Queuing } from "./queuing.js";

const directoryPath = path.join(__dirname, "../../Git-Note-Taking-Test");

async function main() {

  const queue = new Queuing(directoryPath);
  await queue.prepare();
  await queue.crateAllIndexes();

  // await new PutBasicSetup(directoryPath);
}

main();
