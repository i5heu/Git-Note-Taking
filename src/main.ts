import path from "path";
import IndexCreator from "./basic_setup.js";
import { Hash } from "./hash.js";
import { Tree } from "./tree.js";
import fs from "fs";
import { GitManager } from "./gitManager.js";
import Helper from "./helper";
import { createMarkdownArrayTable, createMarkdownObjectTable } from 'parse-markdown-table';
const fsPromises = fs.promises;
const util = require("util");
const http = require("http");
const tablemark = require('tablemark');

const devMode = true;

const directoryPath = path.join(__dirname, "../../Git-Note-Taking-Test");
console.log("directoryPath", directoryPath);

async function main() {
  if (!devMode)
    try {
      await new GitManager(directoryPath, true);
    } catch (error) {
      console.error(error);
    }

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
          const findMarkdownTable = Helper.findMarkdownTable;
          const getContentOfFile = Helper.getContentOfFile;
          
          const md = { tablemark , createMarkdownArrayTable, createMarkdownObjectTable };

          eval(str);
        } catch (error) {
          console.error("script.path:", script.path, "\n", error);
        }
      });
    }
  });

  // console.log(util.inspect(queue, {showHidden: false, depth: null}))
  if (!devMode)
    setTimeout(async () => {
      await new GitManager(directoryPath);
    }, 10000);
}

main();

global.running = false;

function loop() {
  setTimeout(async () => {
    if (global.running == false) {
      global.running = true;
      try {
        await main();
      } catch (error) {
        global.running = false;
        console.error(error);
      }
    }
    loop();
  }, 300000);
}

function Start() {
  loop();
}

if (!devMode) Start();

// for webhook
const host = '0.0.0.0';
const port = 80;

const requestListener = async function (req, res) {

  if (global.running == false) {
    global.running = true;
    try {
      await main();
    } catch (error) {
      global.running = false;
      console.error(error);
    }

    res.writeHead(200);
    res.end("OK");
  } else {
    res.writeHead(492);
    res.end("Too Many Requests");
  }

};

if (!devMode) {
  const server = http.createServer(requestListener);
  server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
  });
}