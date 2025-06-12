/**
 * Extracts keywords from OpenAI analysis results in various expected formats
 * @param {Object} analysisResult - The analysis result from OpenAI
 * @returns {string[]} Array of extracted keywords
 */
export function extractKeywords(analysisResult) {
  if (!analysisResult) return [];

  // Handle various possible response formats from the API

  // If the result contains a 'keywords' array
  if (Array.isArray(analysisResult.keywords)) {
    return analysisResult.keywords;
  }

  // If the result contains a 'keywords' string (comma-separated)
  if (typeof analysisResult.keywords === "string") {
    return analysisResult.keywords.split(",").map((kw) => kw.trim());
  }

  // If the result contains a 'key_terms' or 'keyTerms' array
  if (Array.isArray(analysisResult.key_terms)) {
    return analysisResult.key_terms;
  }

  if (Array.isArray(analysisResult.keyTerms)) {
    return analysisResult.keyTerms;
  }

  // If the model returned a search_terms array
  if (Array.isArray(analysisResult.search_terms)) {
    return analysisResult.search_terms;
  }

  if (Array.isArray(analysisResult.searchTerms)) {
    return analysisResult.searchTerms;
  }

  // Return empty array if no recognizable format is found
  return [];
}

/**
 * Extracts related queries from OpenAI analysis results
 * @param {Object} analysisResult - The analysis result from OpenAI
 * @returns {string[]} Array of related queries
 */
export function extractRelatedQueries(analysisResult) {
  if (!analysisResult) return [];

  // Handle various possible response formats from the API

  // If the result contains a 'related_queries' array
  if (Array.isArray(analysisResult.related_queries)) {
    return analysisResult.related_queries;
  }

  // If the result contains a 'relatedQueries' array
  if (Array.isArray(analysisResult.relatedQueries)) {
    return analysisResult.relatedQueries;
  }

  // If the result contains related_searches or similar
  if (Array.isArray(analysisResult.related_searches)) {
    return analysisResult.related_searches;
  }

  if (Array.isArray(analysisResult.relatedSearches)) {
    return analysisResult.relatedSearches;
  }

  // If the result contains a string of related queries (comma-separated)
  if (typeof analysisResult.related_queries === "string") {
    return analysisResult.related_queries
      .split(",")
      .map((query) => query.trim());
  }

  // Return empty array if no recognizable format is found
  return [];
}

/**
 * Creates a formatted search query from a set of keywords
 * @param {string[]} keywords - Array of keywords
 * @param {string} operator - The logical operator to use ('AND' or 'OR')
 * @returns {string} The formatted search query
 */
export function formatSearchQuery(keywords, operator = "OR") {
  if (!keywords || keywords.length === 0) {
    return "";
  }

  // Filter out any empty strings
  const validKeywords = keywords.filter((kw) => kw && kw.trim() !== "");

  // Return a formatted search query
  return validKeywords.join(` ${operator.toUpperCase()} `);
}

/**
 * Estimates the relevance of a keyword based on its frequency and position
 * @param {string} keyword - The keyword to evaluate
 * @param {Object} analysisResult - The full analysis result
 * @returns {number} A relevance score between 0-1
 */
export function estimateKeywordRelevance(keyword, analysisResult) {
  if (!keyword || !analysisResult) {
    return 0;
  }

  // This is a simple example - in a real application, you would use more sophisticated
  // relevance determination based on the analysis result

  // If the keyword is explicitly marked as important
  if (
    analysisResult.important_keywords?.includes(keyword) ||
    analysisResult.importantKeywords?.includes(keyword)
  ) {
    return 1;
  }

  // If relevance scores are provided
  if (
    analysisResult.keyword_scores?.[keyword] ||
    analysisResult.keywordScores?.[keyword]
  ) {
    const score =
      analysisResult.keyword_scores?.[keyword] ||
      analysisResult.keywordScores?.[keyword] ||
      0;
    return score;
  }

  // Default relevance score
  return 0.5;
}
