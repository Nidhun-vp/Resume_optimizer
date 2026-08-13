const express = require("express");
const multer = require("multer");

const extractResumeText = require("../services/resumeParser");
const analyzeKeywords = require("../services/keywordAnalyzer");
const generateResume = require("../services/resumeGenerator");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});


// ==========================================
// ANALYZE RESUME
// ==========================================

router.post(
  "/analyze",
  upload.single("resume"),
  async (req, res) => {

    try {

      if (!req.file) {
        return res.status(400).json({
          message: "No resume file uploaded"
        });
      }

      console.log("Resume:", req.file.originalname);

      console.log(
        "Job Description:",
        req.body.jobDescription
      );

      // Extract resume text
      const resumeText =
        await extractResumeText(req.file);

      console.log("Resume Text:");
      console.log(resumeText);

      // Analyze keywords
      const keywordResult =
        analyzeKeywords(
          resumeText,
          req.body.jobDescription
        );

      console.log("Keywords:");
      console.log(keywordResult);

      res.json({
        message: "Resume analyzed successfully",

        resumeText: resumeText,

        keywords: keywordResult
      });

    } catch (error) {

      console.error("ERROR:", error);

      res.status(500).json({
        message: "Failed to analyze resume",
        error: error.message
      });

    }
  }
);


// ==========================================
// GENERATE MODIFIED RESUME
// ==========================================

router.post(
  "/generate",
  async (req, res) => {

    try {

      const {
        resumeText,
        selectedKeywords
      } = req.body;

      if (!resumeText) {
        return res.status(400).json({
          message: "Resume text is required"
        });
      }

      if (
        !selectedKeywords ||
        selectedKeywords.length === 0
      ) {
        return res.status(400).json({
          message: "Please select at least one keyword"
        });
      }

      console.log(
        "Selected Keywords:",
        selectedKeywords
      );

      // Generate DOCX
      const fileBuffer =
        await generateResume(
          resumeText,
          selectedKeywords
        );

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );

      res.setHeader(
        "Content-Disposition",
        'attachment; filename="modified-resume.docx"'
      );

      res.send(fileBuffer);

    } catch (error) {

      console.error(
        "GENERATE ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to generate resume",
        error: error.message
      });

    }
  }
);


module.exports = router;