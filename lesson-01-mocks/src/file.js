const { readFile } = require("fs/promises");
const User = require("./user");
const { error } = require("./constants");

const DEFAULT_OPTION = {
  maxLines: 3, //not include header
  fields: ["id", "name", "profession", "age"],
};

class File {
  static async csvToJson(filePath) {
    const content = await this.getFileContent(filePath);
    const validation = this.isValid(content);

    if (!validation.valid) throw new Error(validation.error);

    const users = this.parseCSVToJSON(content);

    return users;
  }

  static async getFileContent(filePath) {
    return (await readFile(filePath)).toString("utf-8");
  }

  static isValid(csvString, options = DEFAULT_OPTION) {
    const [header, ...fileWithoutHeader] = csvString.split("\n");
    const isHeaderValid = header.trim() === options.fields.join(",");

    if (!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR,
        valid: false,
      };
    }
    const isContentLengthAccepted =
      fileWithoutHeader.length > 0 &&
      fileWithoutHeader.length <= options.maxLines;

    if (!isContentLengthAccepted) {
      return {
        error: error.FILE_LENGTH_ERROR,
        valid: false,
      };
    }

    return { valid: true };
  }

  static parseCSVToJSON(csvString) {
    const lines = csvString.split("\n");
    const firstLine = lines.shift(); // remove first line
    const header = firstLine.split(",");
    const users = lines.map((line) => {
      const columns = line.split(",");
      let user = {};
      for (const index in columns) {
        user[header[index]] = columns[index];
      }

      return new User(user);
    });

    return users;
  }
}

module.exports = File;
