import {useState } from "react";
import React from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // ==========================================
  // HANDLE RESUME UPLOAD
  // ==========================================

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  // ==========================================
  // ANALYZE RESUME
  // ==========================================

  const handleAnalyze = async () => {
    if (!resume) {
      alert("Please upload your resume");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter the job description");
      return;
    }

    const formData = new FormData();

    formData.append("resume", resume);
    formData.append("jobDescription", jobDescription);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/analyze",
        formData
      );

      console.log("SUCCESS:", response.data);

      setAnalysis(response.data);

      // Clear previously selected keywords
      setSelectedKeywords([]);

      alert("Resume analyzed successfully!");

    } catch (error) {
      console.error("FULL ERROR:", error);

      if (error.response) {
        console.error(
          "STATUS:",
          error.response.status
        );

        console.error(
          "DATA:",
          error.response.data
        );

        alert(
          "Backend Error: " +
            JSON.stringify(error.response.data)
        );

      } else if (error.request) {
        console.error(
          "REQUEST:",
          error.request
        );

        alert(
          "Cannot connect to backend. Is server running?"
        );

      } else {
        alert(
          "Error: " + error.message
        );
      }
    }
  };

  // ==========================================
  // SELECT / UNSELECT KEYWORD
  // ==========================================

  const handleKeywordClick = (keyword) => {
    setSelectedKeywords((previous) => {
      if (previous.includes(keyword)) {
        return previous.filter(
          (item) => item !== keyword
        );
      }

      return [...previous, keyword];
    });
  };

  // ==========================================
  // GENERATE MODIFIED RESUME
  // ==========================================

  const handleGenerateResume = async () => {
    if (selectedKeywords.length === 0) {
      alert("Please select at least one keyword");
      return;
    }

    if (!analysis || !analysis.resumeText) {
      alert("Please analyze your resume first");
      return;
    }

    try {
      setIsGenerating(true);

      const response = await axios.post(
        "http://localhost:5000/api/generate",
        {
          resumeText: analysis.resumeText,
          selectedKeywords: selectedKeywords
        },
        {
          responseType: "blob"
        }
      );

      // Create downloadable file
      const blob = new Blob(
        [response.data],
        {
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        "modified-resume.docx";

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      alert(
        "Modified resume generated successfully!"
      );

    } catch (error) {
      console.error(
        "GENERATE ERROR:",
        error
      );

      alert(
        "Failed to generate resume"
      );

    } finally {
      setIsGenerating(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="app">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="header">

        <div className="header-content">

          <h2>
            📄 Resume Optimizer
          </h2>

          <p>
            Optimize your resume with relevant
            keywords
          </p>

        </div>

      </header>


      {/* ======================================
          MAIN
      ====================================== */}

      <main className="main-container">


        {/* ====================================
            HERO
        ==================================== */}

        <div className="hero">

          <h1>
            Optimize Your Resume
          </h1>

          <p>
            Upload your resume and paste the
            job description to find relevant
            keywords.
          </p>

        </div>


        {/* ====================================
            INPUT CARDS
        ==================================== */}

        <div className="cards">


          {/* ==================================
              RESUME UPLOAD
          ================================== */}

          <div className="card">

            <h2>
              1. Upload Resume
            </h2>

            <p className="description">
              Upload your PDF or DOCX resume.
            </p>


            <label className="upload-box">

              <div className="upload-icon">
                📄
              </div>

              <strong>
                Choose your resume
              </strong>

              <span>
                PDF or DOCX
              </span>


              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleResumeChange}
              />


              

            </label>


            {/* Selected file */}

            {resume && (

              <div className="selected-file">

                <span className="file-icon">
                  📎
                </span>

                <div>

                  <strong>
                    {resume.name}
                  </strong>

                  <small>
                    {(
                      resume.size / 1024
                    ).toFixed(1)}{" "}
                    KB
                  </small>

                </div>

              </div>

            )}

          </div>


          {/* ==================================
              JOB DESCRIPTION
          ================================== */}

          <div className="card">

            <h2>
              2. Job Description
            </h2>

            <p className="description">
              Copy and paste the job description
              here.
            </p>


            <textarea
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) =>
                setJobDescription(
                  e.target.value
                )
              }
            />


            <div className="character-count">

              {jobDescription.length} characters

            </div>

          </div>

        </div>


        {/* ====================================
            ANALYZE BUTTON
        ==================================== */}

        <div className="analyze-container">

          <button
            className="analyze-button"
            onClick={handleAnalyze}
          >
            🔍 Analyze Resume
          </button>

        </div>


        {/* ====================================
            ANALYSIS RESULTS
        ==================================== */}

        {analysis && (

          <div className="results">

            <h2>
              Resume Analysis
            </h2>

            <p className="results-description">
              We compared your resume with the
              job description.
            </p>


            <div className="result-cards">


              {/* ==============================
                  MATCHED KEYWORDS
              ============================== */}

              <div className="result-card matched">

                <h3>
                  ✅ Keywords Found
                </h3>

                <p>
                  These keywords are already
                  present in your resume.
                </p>


                <div className="keyword-list">

                  {analysis.keywords
                    .matchedKeywords
                    .length > 0 ? (

                    analysis.keywords
                      .matchedKeywords
                      .map(
                        (
                          keyword,
                          index
                        ) => (

                          <span
                            key={index}
                          >
                            {keyword}
                          </span>

                        )
                      )

                  ) : (

                    <span>
                      No matching keywords found
                    </span>

                  )}

                </div>

              </div>


              {/* ==============================
                  MISSING KEYWORDS
              ============================== */}

              <div className="result-card missing">

                <h3>
                  ⚠️ Missing Keywords
                </h3>

                <p>
                  Click the keywords you want
                  to add to your new resume.
                </p>


                <div className="keyword-list">

                  {analysis.keywords
                    .missingKeywords
                    .length > 0 ? (

                    analysis.keywords
                      .missingKeywords
                      .map(
                        (
                          keyword,
                          index
                        ) => (

                          <button
                            key={index}
                            type="button"
                            className={
                              selectedKeywords.includes(
                                keyword
                              )
                                ? "keyword selected"
                                : "keyword"
                            }
                            onClick={() =>
                              handleKeywordClick(
                                keyword
                              )
                            }
                          >

                            {selectedKeywords.includes(
                              keyword
                            )
                              ? "✓ "
                              : ""}

                            {keyword}

                          </button>

                        )
                      )

                  ) : (

                    <span>
                      No missing keywords 🎉
                    </span>

                  )}

                </div>


                {/* ============================
                    SELECTED KEYWORDS
                ============================ */}

                {selectedKeywords.length > 0 && (

                  <div className="generate-section">

                    <p>

                      Selected keywords:{" "}

                      <strong>
                        {selectedKeywords.length}
                      </strong>

                    </p>


                    <button
                      className="generate-button"
                      onClick={
                        handleGenerateResume
                      }
                      disabled={isGenerating}
                    >

                      {isGenerating
                        ? "Generating..."
                        : "📄 Generate Modified Resume"}

                    </button>

                  </div>

                )}

              </div>

            </div>

          </div>

        )}


        {/* ====================================
            STEPS
        ==================================== */}

        <div className="steps">


          {/* Step 1 */}

          <div className="step">

            <span>
              1
            </span>

            <div>

              <strong>
                Upload Resume
              </strong>

              <p>
                Upload your PDF or DOCX resume.
              </p>

            </div>

          </div>


          {/* Step 2 */}

          <div className="step">

            <span>
              2
            </span>

            <div>

              <strong>
                Paste Job Description
              </strong>

              <p>
                Add the job description for the
                role.
              </p>

            </div>

          </div>


          {/* Step 3 */}

          <div className="step">

            <span>
              3
            </span>

            <div>

              <strong>
                Add Keywords
              </strong>

              <p>
                Select relevant keywords and
                generate your modified resume.
              </p>

            </div>

          </div>


        </div>

      </main>

    </div>
  );
}

export default App;