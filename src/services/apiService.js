import openAIService from "./openaiService";
import { BACKEND_DOMAIN_LOCALHOST, BACKEND_DOMAIN_PROD } from "./constants";

/**
 * API service for application-wide functionality
 */
class ApiService {
  /**
   * Analyzes a user query to extract search keywords and intent
   *
   * @param {string} userQuery - The user's search query
   * @returns {Promise<Object>} - Analysis results with keywords and intent
   */
  async analyzeSearchQuery(userQuery) {
    try {
      const result = await openAIService.analyzeUserQuery(userQuery);
      return {
        success: true,
        data: result,
        message: "Query analysis completed successfully",
      };
    } catch (error) {
      console.error("Error in API service while analyzing query:", error);
      return {
        success: false,
        error: error.message || "Failed to analyze query",
        message: "An error occurred while analyzing your search query",
      };
    }
  }

  /**
   * Example method to enhance search with the analyzed keywords
   *
   * @param {string} originalQuery - Original user query
   * @param {Array} keywords - Keywords extracted from analysis
   * @returns {Promise<Object>} - Enhanced search results
   */
  async enhancedSearch(originalQuery, keywords = []) {
    // This would typically call your actual search API with the enhanced keywords
    // For now it just returns a mock response

    try {
      // Simulate API call
      return {
        success: true,
        data: {
          originalQuery,
          enhancedQuery: [...new Set([originalQuery, ...keywords])].join(
            " OR "
          ),
          results: [],
        },
        message: "Search completed with AI-enhanced keywords",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Failed to perform enhanced search",
      };
    }
  }

  /**
   * Answers questions about a specific craft using backend endpoint
   *
   * @param {string} combinedContext - The user's question plus craft and artisan info as a single string
   * @returns {Promise<Object>} - Backend response about the craft
   */
  async answerCraftQuestion(combinedContext) {
    try {
      const isLocalhost = window?.location?.hostname === "localhost";
      const backendDomain = isLocalhost
        ? BACKEND_DOMAIN_LOCALHOST
        : BACKEND_DOMAIN_PROD;
      const response = await fetch(`${backendDomain}/ludi/answer-craft`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: combinedContext }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const answer = await response.json();
      return {
        success: true,
        data: answer?.answer,
        message: "Craft question answered successfully",
      };
    } catch (error) {
      console.error(
        "Error in API service while answering craft question:",
        error
      );
      return {
        success: false,
        error: error.message || "Failed to answer craft question",
        message:
          "An error occurred while answering your question about this craft",
      };
    }
  }

  /**
   * Searches artisans using the backend /ludi/search-artisans endpoint
   *
   * @param {string} searchQuery - The user's search query
   * @returns {Promise<Object>} - Backend response with artisan search results
   */
  async searchArtisans(searchQuery) {
    try {
      const isLocalhost = window?.location?.hostname === "localhost";
      const backendDomain = isLocalhost
        ? BACKEND_DOMAIN_LOCALHOST
        : BACKEND_DOMAIN_PROD;
      const response = await fetch(`${backendDomain}/ludi/search-artisans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: searchQuery }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return {
        success: true,
        data: result,
        message: "Artisan search completed successfully",
      };
    } catch (error) {
      console.error("Error in API service while searching artisans:", error);
      return {
        success: false,
        error: error.message || "Failed to search artisans",
        message: "An error occurred while searching for artisans",
      };
    }
  }
}

// Export a singleton instance
const apiService = new ApiService();
export default apiService;
