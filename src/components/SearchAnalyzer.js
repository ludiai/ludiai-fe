import React, { useState } from "react";
import useQueryAnalysis from "../hooks/useQueryAnalysis";
import {
  extractKeywords,
  extractRelatedQueries,
  formatSearchQuery,
} from "../utils/searchUtils";
import "./SearchAnalyzer.css";

/**
 * Component that demonstrates search query analysis using OpenAI API
 */
function SearchAnalyzer() {
  const [query, setQuery] = useState("");
  const { analyzeQuery, isAnalyzing, analysisResults, error } =
    useQueryAnalysis();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    await analyzeQuery(query);
  };

  const keywords = analysisResults ? extractKeywords(analysisResults) : [];
  const relatedQueries = analysisResults
    ? extractRelatedQueries(analysisResults)
    : [];

  return (
    <div className="search-analyzer">
      <h2>Search Query Analyzer</h2>
      <p>Enter a search query to analyze it and extract relevant keywords</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query..."
            className="search-input"
            aria-label="Search query"
          />
          <button
            type="submit"
            disabled={isAnalyzing || !query.trim()}
            aria-label="Analyze search query"
          >
            {isAnalyzing ? "Analyzing..." : "Analyze Query"}
          </button>
        </div>
      </form>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {isAnalyzing && (
        <div className="loading" aria-live="polite">
          Analyzing your query...
        </div>
      )}

      {analysisResults && (
        <div className="analysis-results">
          <h3>Analysis Results</h3>

          {/* Display extracted keywords first for better UX */}
          <div className="extracted-keywords">
            <h4>Extracted Keywords:</h4>
            {keywords.length > 0 ? (
              <div className="keyword-list">
                {keywords.map((keyword, index) => (
                  <span key={index} className="keyword-tag">
                    {keyword}
                  </span>
                ))}
              </div>
            ) : (
              <p>No keywords were extracted from this query.</p>
            )}

            {keywords.length > 0 && (
              <div className="formatted-query">
                <h4>Formatted Search Query:</h4>
                <div className="query-box">{formatSearchQuery(keywords)}</div>
              </div>
            )}
          </div>

          {/* Display related queries */}
          {relatedQueries.length > 0 && (
            <div className="related-queries">
              <h4>Related Queries:</h4>
              <div className="query-list">
                {relatedQueries.map((relatedQuery, index) => (
                  <div key={index} className="related-query-item">
                    <span>{relatedQuery}</span>
                    <button
                      className="use-query-btn"
                      onClick={() => {
                        setQuery(relatedQuery);
                        analyzeQuery(relatedQuery);
                      }}
                      aria-label={`Use query: ${relatedQuery}`}
                    >
                      Use This Query
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collapsible raw JSON section */}
          <details className="raw-json">
            <summary>View Raw JSON Response</summary>
            <pre>{JSON.stringify(analysisResults, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default SearchAnalyzer;
