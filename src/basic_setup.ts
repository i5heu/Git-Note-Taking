import Helper from "./helper.js";
import fs from "fs";
import path from "path";
const fsPromises = fs.promises;

export default class PutBasicSetup {
  rootPath = "";

  constructor(rootPath) {
    this.rootPath = rootPath;

    return (async () => {
      await this.putHashIndexFolder();

      return this;
    })() as any;
  }

  /**
   * will put the hash folder in rootPath
   */
  async putHashIndexFolder() {
    const rootFolderList = await Helper.getFileListInFolder(this.rootPath);

    if (rootFolderList.includes("hashes")) return;

    const directoryPath = path.join(this.rootPath, "/hashes");
    await fs.promises.mkdir(directoryPath, { recursive: true });
  }
}
