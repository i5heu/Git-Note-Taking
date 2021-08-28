import Helper from "./helper";
import fs from "fs";
import { createUnzip } from "zlib";
import { match } from "assert";
const fsPromises = fs.promises;
import util from "util";

export class Hash {
  static async uiCreator(chunk: any) {
    let hashText = "";

    if (chunk.tags) {
      for (const tagObj of chunk.tags) {
        hashText += `[${tagObj.tag} - ${tagObj.path}](${tagObj.path})\n`;
      }
    }

    if (!Array.isArray(chunk.indexString)) {
      chunk.indexString = [];
    }

    if (hashText !== "") {
      const index = `
## Hashes
${hashText}
`;

      chunk.indexString.push(index);
      fs.writeFile(chunk.path + "/AA_INDEX.auto.md", index, () => {});
    }
  }

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
        // TODO fix problem with relative paths
        chunk.tags.push.apply(chunk.tags , subItem.tags);
      }

      chunk.tags.sort((a, b) => {
        if (a.tag < b.tag) return -1;
        if (a.tag > b.tag) return 1;
        return 0;
      });
    }

    return chunk;
  }
}

//\[(.*?)\](?!\()
