import fs from "fs";
const fsPromises = fs.promises;

export default class Helper {

  /**
   * will return the names of all files and folders of given path
   */
  static async getFileListInFolder(path: string) : Promise<string[]> {
    try {
      return fsPromises.readdir(path);
    } catch (err) {
      console.error("Error occured while reading directory!", err);
    }
  }
}