import Helper from "./helper";
import fs from "fs";
import { createUnzip } from "zlib";
import { match } from "assert";
const fsPromises = fs.promises;

const util = require("util");

export class Hash {
  //   static async uiCreator(hashIndex: any) {
  //     let hashText = "";

  //     if (hashIndex.tags) {
  //       for (const tagObj of hashIndex.tags) {
  //         console.log(tagObj.path);
  //         hashText += `
  // [${tagObj.tag} - ${tagObj.path}](${tagObj.path})
  // `;
  //       }
  //     }

  //     const index = `
  // # Index

  // ## Hashes
  // ${hashText}
  // `;

  //     fs.writeFile(chunk.path + "/AA_INDEX.auto.md", index, () => {});
  //   }

  static async hashIndex(chunk) {
    chunk.tags = [];

    // get tags from subFiles of folder and save then in tag parameter
    for (const subItem of chunk.subItems) {
      // ignore subfolders
      if (
        !fs.lstatSync(subItem.path).isDirectory() &&
        subItem.path.includes(".md")
      ) {
        try {
          var data = fs.readFileSync(subItem.path, "utf8");
          const regex1 = RegExp("#([0-9a-zA-z_-]{2,30})", "g");
          const str = data.toString();
          const array = [...str.matchAll(regex1)];
          const availTags = [];

          // iterate over all tags and save them in chunk.tags
          for (const regExResult of array) {
            if (regExResult && regExResult[1]) {
              // prevent duplicate tags
              if (availTags.includes(regExResult[1])) continue;

              chunk.tags.push({
                tag: regExResult[1],
                path: subItem.path.replace(chunk.path + "/", ""),
              });

              availTags.push(regExResult[1]);
            }
          }
        } catch (error) {
          console.log("Error 1245f:", error);
        }
      }

      // concat tags from subItems into chunk
      if (subItem.tags) {
        chunk.tags.push.apply(chunk.tags, subItem.tags);
      }
    }

    return chunk;
  }
}

//\[(.*?)\](?!\()
