import openAIService from "./openaiService";

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
   * Answers questions about a specific craft using OpenAI
   *
   * @param {string} question - The user's question about the craft
   * @param {Object} craft - The craft item data including description as context
   * @returns {Promise<Object>} - AI response about the craft
   */
  async answerCraftQuestion(question, craft) {
    try {
      const answer = await openAIService.answerCraftQuestion(question, craft);
      return {
        success: true,
        data: answer,
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
}

// Export a singleton instance
const apiService = new ApiService();
export default apiService;
