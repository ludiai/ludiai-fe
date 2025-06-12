import { useState, useCallback } from "react";
import apiService from "../services/apiService";

/**
 * Hook for analyzing search queries and extracting keywords
 * @returns {Object} - State and functions for query analysis
 */
function useQueryAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [error, setError] = useState(null);

  /**
   * Analyze a user query and extract keywords and intent
   * @param {string} query - The user's search query to analyze
   * @returns {Promise<Object|null>} - The analysis results or null on error
   */
  const analyzeQuery = useCallback(async (query) => {
    if (!query || !query.trim()) {
      setError("Please provide a valid search query");
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await apiService.analyzeSearchQuery(query);

      if (response.success) {
        setAnalysisResults(response.data);
        return response.data;
      } else {
        setError(response.message);
        return null;
      }
    } catch (err) {
      setError("Failed to analyze query: " + (err.message || "Unknown error"));
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  /**
   * Clear analysis results and errors
   */
  const resetAnalysis = useCallback(() => {
    setAnalysisResults(null);
    setError(null);
  }, []);

  return {
    analyzeQuery,
    resetAnalysis,
    isAnalyzing,
    analysisResults,
    error,
  };
}

export default useQueryAnalysis;
