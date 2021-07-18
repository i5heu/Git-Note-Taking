import Helper from "./helper";
import fs from "fs";
import { createUnzip } from "zlib";
import { match } from "assert";
const fsPromises = fs.promises;

const util = require("util");

export class Queuing {
  rootPath;
  itemTree;
  indexes = [];

  constructor(directoryPath) {
    this.rootPath = directoryPath;
  }

  async prepare() {
    this.itemTree = [];
    await this.iterateOverSubFolder(this.rootPath, this.itemTree);
  }

  async iterateOverSubFolder(subFolderPath, treeChunk) {
    const subFolderList = await Helper.getFileListInFolder(subFolderPath);

    for (const subItemName of subFolderList) {
      const subItemPath = subFolderPath + "/" + subItemName;
      const isFolder = fs.lstatSync(subItemPath).isDirectory();

      switch (subItemName) {
        case ".git":
        case "AA_INDEX.auto.md":
          continue;
          break;
      }

      const folder = {
        name: subItemName,
        path: subItemPath,
        directory: isFolder,
        subItems: isFolder ? [] : null,
      };
      treeChunk.push(folder);

      if (isFolder) {
        await this.iterateOverSubFolder(subItemPath, folder.subItems);
      }
    }
  }

  async crateAllIndexes() {
    await this.subFolderIterator({
      directory: true,
      subItems: this.itemTree,
    });

    for (const chunk of this.indexes) {
      chunk.tags = [...new Set(chunk.tags)];
      this.indexTextCreation(chunk);
    }
  }

  async indexTextCreation(chunk) {
    let hashText = "";

    if (chunk.tags) {
      for (const tagObj of chunk.tags) {
        console.log(tagObj.path);
        hashText += `
[${tagObj.tag} - ${tagObj.path}](${tagObj.path})
`;
      }
    }

    const index = `
# Index

## Hashes
${hashText}
`;

    fs.writeFile(chunk.path + "/AA_INDEX.auto.md", index, () => {});
  }

  async subFolderIterator(chunk) {
    if (chunk.directory) {
      for (const chunky of chunk.subItems) {
        await this.subFolderIterator(chunky);
      }

      await this.indexCreator(chunk);
    }
  }

  async indexCreator(chunk) {
    await this.hashIndex(chunk);
  }

  async hashIndex(chunk) {
    chunk.tags = [];

    // get tags from subFiles of folder and save then in tag parameter
    for (const chunky of chunk.subItems) {
      if (
        !fs.lstatSync(chunky.path).isDirectory() &&
        chunky.path.includes(".md")
      ) {
        try {
          var data = fs.readFileSync(chunky.path, "utf8");
          const regex1 = RegExp("#([0-9a-zA-z_-]{2,30})", "g");
          const str = data.toString();
          const array = [...str.matchAll(regex1)];

          for (const result of array) {
            if (result && result[1]) {
              chunk.tags.push({
                tag: result[1],
                path: chunky.path.replace(chunk.path + "/", ""),
              });
            }
          }
        } catch (error) {
          console.log("Error 1245f:", error);
        }
      }
    }
    this.indexes.push(chunk);
  }

  async globalIndex(chunk) {
    console.log("INDEX");
  }
}

//\[(.*?)\](?!\()
