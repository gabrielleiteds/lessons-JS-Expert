const { readFile } = require("fs/promises");
const { join } = require("path");
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

    return content;
  }

  static async getFileContent(filePath) {
    const fileName = join(__dirname, filePath);
    return (await readFile(fileName)).toString("utf-8");
  }

  static isValid(csvString, options = DEFAULT_OPTION) {
    const [header, ...fileWithoutHeader] = csvString.split("\n");
    const isHeaderValid = header === options.fields.join(",");

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
  }
}

(async () => {
  const result = await File.csvToJson("./../mocks/fourItems-invalid.csv");
  console.log(result);
})();
