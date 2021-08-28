import Helper from "./helper";
import fs from "fs";
import path from "path";
const fsPromises = fs.promises;

export default class IndexCreator {
  chunk = "";

  constructor(chunk) {
    this.chunk = chunk;

    return (async () => {

      return this;
    })() as any;
  }
}
