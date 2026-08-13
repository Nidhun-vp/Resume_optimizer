const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

async function extractResumeText(file) {
  const extension = file.originalname
    .split(".")
    .pop()
    .toLowerCase();

  // PDF
  if (extension === "pdf") {
    const parser = new PDFParse({
      data: file.buffer
    });

    const result = await parser.getText();

    await parser.destroy();

    return result.text;
  }

  // DOCX
  if (extension === "docx") {
    const result = await mammoth.extractRawText({
      buffer: file.buffer
    });

    return result.value;
  }

  throw new Error("Only PDF and DOCX files are supported");
}

module.exports = extractResumeText;