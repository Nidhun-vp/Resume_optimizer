const technicalKeywords = [
  "javascript",
  "typescript",
  "react",
  "reactjs",
  "angular",
  "vue",
  "html",
  "css",
  "bootstrap",
  "tailwind",
  "node.js",
  "nodejs",
  "express",
  "express.js",
  "mongodb",
  "mysql",
  "postgresql",
  "sql",
  "git",
  "github",
  "rest api",
  "restful api",
  "redux",
  "next.js",
  "nextjs",
  "python",
  "java",
  "c",
  "c++",
  "docker",
  "aws",
  "azure",
  "figma",
  "api",
  "jwt",
  "graphql"
];

function containsKeyword(text, keyword) {
  const escapedKeyword = keyword.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );

  const regex = new RegExp(
    `(^|[^a-zA-Z0-9+#])${escapedKeyword}([^a-zA-Z0-9+#]|$)`,
    "i"
  );

  return regex.test(text);
}

function analyzeKeywords(resumeText, jobDescription) {

  const jdKeywords = technicalKeywords.filter(
    (keyword) =>
      containsKeyword(jobDescription, keyword)
  );

  const matchedKeywords = jdKeywords.filter(
    (keyword) =>
      containsKeyword(resumeText, keyword)
  );

  const missingKeywords = jdKeywords.filter(
    (keyword) =>
      !containsKeyword(resumeText, keyword)
  );

  return {
    jdKeywords,
    matchedKeywords,
    missingKeywords
  };
}

module.exports = analyzeKeywords;