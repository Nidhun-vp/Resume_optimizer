const {
  Document,
  Packer,
  Paragraph,
  HeadingLevel
} = require("docx");

async function generateResume(
  resumeText,
  selectedKeywords
) {
  // Split extracted resume text into lines
  const lines = resumeText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const paragraphs = [];

  let insideSkillsSection = false;
  let skillsAdded = false;

  // Section headings we want to recognize
  const sectionHeadings = [
    "professional summary",
    "summary",
    "education",
    "experience",
    "work experience",
    "projects",
    "skills",
    "technical skills",
    "languages known",
    "certifications",
    "achievements",
    "interests"
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const normalizedLine = line
      .toLowerCase()
      .replace(/[:\-]/g, "")
      .trim();

    // Check whether current line is a section heading
    const isHeading =
      sectionHeadings.includes(normalizedLine);

    // ------------------------------------------
    // SKILLS SECTION
    // ------------------------------------------

    if (
      normalizedLine === "skills" ||
      normalizedLine === "technical skills"
    ) {
      insideSkillsSection = true;

      paragraphs.push(
        new Paragraph({
          text: "SKILLS",
          heading: HeadingLevel.HEADING_2
        })
      );

      continue;
    }

    // ------------------------------------------
    // NEXT SECTION AFTER SKILLS
    // ------------------------------------------

    if (
      insideSkillsSection &&
      isHeading
    ) {
      // Add selected keywords before leaving
      // the Skills section
      if (!skillsAdded) {
        addSelectedKeywords(
          paragraphs,
          selectedKeywords,
          lines
        );

        skillsAdded = true;
      }

      insideSkillsSection = false;
    }

    // ------------------------------------------
    // NORMAL SECTION HEADINGS
    // ------------------------------------------

    if (isHeading) {
      paragraphs.push(
        new Paragraph({
          text: line.toUpperCase(),
          heading: HeadingLevel.HEADING_2
        })
      );

      continue;
    }

    // ------------------------------------------
    // SKILLS CONTENT
    // ------------------------------------------

    if (insideSkillsSection) {
      paragraphs.push(
        new Paragraph({
          text: line,
          bullet: {
            level: 0
          }
        })
      );

      continue;
    }

    // ------------------------------------------
    // NORMAL CONTENT
    // ------------------------------------------

    paragraphs.push(
      new Paragraph({
        text: line
      })
    );
  }

  // ------------------------------------------
  // IF SKILLS WAS THE LAST SECTION
  // ------------------------------------------

  if (
    insideSkillsSection &&
    !skillsAdded
  ) {
    addSelectedKeywords(
      paragraphs,
      selectedKeywords,
      lines
    );
  }

  // ------------------------------------------
  // CREATE DOCX
  // ------------------------------------------

  const document = new Document({
    sections: [
      {
        children: paragraphs
      }
    ]
  });

  const buffer =
    await Packer.toBuffer(document);

  return buffer;
}


// ==========================================
// ADD SELECTED KEYWORDS
// ==========================================

function addSelectedKeywords(
  paragraphs,
  selectedKeywords,
  existingLines
) {
  selectedKeywords.forEach((keyword) => {

    // Check if keyword already exists
    const alreadyExists =
      existingLines.some((line) =>
        line
          .toLowerCase()
          .includes(keyword.toLowerCase())
      );

    // Don't add duplicate keyword
    if (!alreadyExists) {
      paragraphs.push(
        new Paragraph({
          text: formatKeyword(keyword),
          bullet: {
            level: 0
          }
        })
      );
    }
  });
}


// ==========================================
// FORMAT KEYWORD
// ==========================================

function formatKeyword(keyword) {

  const keywordMap = {
    "javascript": "JavaScript",
    "react": "React",
    "reactjs": "React.js",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "git": "Git",
    "github": "GitHub",
    "rest api": "REST API",
    "restful api": "RESTful API",
    "redux": "Redux",
    "html": "HTML",
    "css": "CSS",
    "mongodb": "MongoDB",
    "mysql": "MySQL",
    "typescript": "TypeScript",
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "express": "Express.js",
    "express.js": "Express.js",
    "tailwind": "Tailwind CSS",
    "bootstrap": "Bootstrap",
    "jwt": "JWT",
    "api": "API"
  };

  const lowerKeyword =
    keyword.toLowerCase();

  return (
    keywordMap[lowerKeyword] ||
    keyword
  );
}


module.exports = generateResume;