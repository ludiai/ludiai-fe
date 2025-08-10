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

  // Extract artisans from analysis results if they exist
  const artisans = analysisResults?.artisans || [];

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

          {/* Display artisans if they exist */}
          {artisans.length > 0 && (
            <div className="artisans-section">
              <h4>Found Artisans ({artisans.length})</h4>
              <div className="artisans-grid">
                {artisans.map((artisan, index) => (
                  <ArtisanCard key={index} artisan={artisan} />
                ))}
              </div>
            </div>
          )}

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

// Utility function to convert Google Drive sharing links to direct image URLs
function getDirectImageUrl(url) {
  if (url.includes("drive.google.com")) {
    // Extract file ID from Google Drive sharing URL
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }
  return url;
}

// Artisan Card Component
function ArtisanCard({ artisan }) {
  const profile = artisan.artisan_profile || {};
  const craft = artisan.craft_details || {};
  const photos = craft.product_photos || [];

  return (
    <div
      className="artisan-card"
      role="article"
      aria-label={`Artisan profile for ${profile.name || "Unknown Artisan"}`}
    >
      {/* Product Photos */}
      {photos.length > 0 ? (
        <div className="artisan-photos">
          {photos.slice(0, 3).map((photo, index) => (
            <div key={index} className="photo-container">
              <img
                src={getDirectImageUrl(photo)}
                alt={`Product ${index + 1}`}
                className="product-photo"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
                onLoad={(e) => {
                  e.target.style.opacity = "1";
                }}
              />
            </div>
          ))}
          {photos.length > 3 && (
            <div className="photo-overlay">
              <span>+{photos.length - 3} more</span>
            </div>
          )}
        </div>
      ) : (
        <div className="artisan-photos no-photos">
          <div className="no-photos-placeholder">
            <span>📷</span>
            <p>No photos available</p>
          </div>
        </div>
      )}

      {/* Artisan Info */}
      <div className="artisan-info">
        <h5 className="artisan-name">{profile.name || "Unknown Artisan"}</h5>
        <p className="artisan-location">
          {[
            profile.location?.city,
            profile.location?.state,
            profile.location?.country,
          ]
            .filter(Boolean)
            .join(", ") || "Location not specified"}
        </p>

        <div className="craft-details">
          <div className="detail-item">
            <strong>Category:</strong> {craft.craft_category || "-"}
          </div>
          {craft.subcategory && (
            <div className="detail-item">
              <strong>Subcategory:</strong> {craft.subcategory}
            </div>
          )}
          {craft.cultural_heritage && (
            <div className="detail-item">
              <strong>Cultural Heritage:</strong> {craft.cultural_heritage}
            </div>
          )}

          {craft.primary_materials && craft.primary_materials.length > 0 && (
            <div className="detail-item">
              <strong>Materials:</strong> {craft.primary_materials.join(", ")}
            </div>
          )}

          {craft.techniques_used && craft.techniques_used.length > 0 && (
            <div className="detail-item">
              <strong>Techniques:</strong> {craft.techniques_used.join(", ")}
            </div>
          )}

          {craft.tools_used && craft.tools_used.length > 0 && (
            <div className="detail-item">
              <strong>Tools:</strong> {craft.tools_used.join(", ")}
            </div>
          )}
        </div>

        {/* Contact Info */}
        {(profile.contact?.email || profile.contact?.phone) && (
          <div className="contact-info">
            {profile.contact?.email && (
              <div className="contact-item">
                <strong>Email:</strong> {profile.contact.email}
              </div>
            )}
            {profile.contact?.phone && (
              <div className="contact-item">
                <strong>Phone:</strong> {profile.contact.phone}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchAnalyzer;
