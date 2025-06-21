const fs = require("fs");
const path = require("path");
const axios = require("axios");

async function fetchWhitepaper(url) {
  const outputPath = path.join(__dirname, "..", "tmp", "whitepaper.pdf");

  const response = await axios.get(url, {
    responseType: "stream",
  });

  const writer = fs.createWriteStream(outputPath);

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    writer.on("finish", () => resolve(outputPath));
    writer.on("error", reject);
  });
}

module.exports = fetchWhitepaper;
