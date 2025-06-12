import OpenAI from "openai";

/**
 * Service for interacting with OpenAI's API to analyze user queries
 */
class OpenAIService {
  constructor() {
    // Initialize the OpenAI client with API key from environment variable
    // IMPORTANT: In production, always use environment variables for API keys
    this.openai = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // Enable browser usage with proper API key security
    });
  }

  /**
   * Analyzes a user query to extract relevant search keywords and intent
   * @param {string} query - The user's search query
   * @returns {Promise<Object>} - Object containing analyzed keywords, intent, and related queries
   */
  async analyzeUserQuery(query) {
    try {
      // Define the system prompt for consistent analysis behavior
      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use gpt-4 for more advanced reasoning if needed
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant that analyzes user search queries for a craft search engine. " +
              "Your task is to identify the key concepts, entities, and intentions behind the query. " +
              "Extract relevant keywords that would be useful for a search engine. " +
              "Also generate a list of alternative related queries that the user might be interested in. " +
              "These related queries should capture different aspects or interpretations of the original query. " +
              "Respond with a JSON object that includes 'keywords' (array of strings), 'intent' (string), " +
              "'relevance' (object with keyword relevance scores), and 'related_queries' (array of 5-8 related search queries).",
          },
          {
            role: "user",
            content: `Analyze this craft search query and extract the most relevant search keywords, the user's intent, and generate related queries: "${query}"`,
          },
        ],
        temperature: 0.5, // Slightly higher temperature for more creative related queries
        max_tokens: 300, // Increased to accommodate the additional related queries
        response_format: { type: "json_object" },
      });

      // Parse the response content
      const content = response.choices[0].message.content;
      return JSON.parse(content);
    } catch (error) {
      console.error("Error analyzing query with OpenAI:", error);
      throw new Error("Failed to analyze search query");
    }
  }

  /**
   * Answers questions about a specific craft item using its description as context
   * @param {string} query - The user's question about the craft
   * @param {Object} craft - The craft object containing details like name, description, etc.
   * @returns {Promise<string>} - AI generated response about the craft
   */
  async answerCraftQuestion(query, craft) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Use gpt-4 for more detailed responses if needed
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant with expertise in traditional crafts and artisanal work. " +
              "Your task is to answer questions about specific craft items, using the provided item details as context. " +
              "Provide informative, engaging responses that help users appreciate the craft's cultural significance, " +
              "materials, techniques, and aesthetic qualities. If you don't know something specific that isn't in the " +
              "provided context, acknowledge this and offer general information about similar crafts instead.",
          },
          {
            role: "user",
            content: `Here's information about a craft item:\n\nName: ${craft.name}\nCreator: ${craft.creator}\nLocation: ${craft.location}\nDescription: ${craft.description}\n\nQuestion: ${query}`,
          },
        ],
        temperature: 0.7, // Slightly higher temperature for more natural, conversational responses
        max_tokens: 500, // Allow for more detailed responses
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error answering craft question with OpenAI:", error);
      throw new Error("Failed to answer question about this craft");
    }
  }
}

// Export a singleton instance
const openAIService = new OpenAIService();
export default openAIService;
