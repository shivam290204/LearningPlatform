import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/compiler/run';

/**
 * Sends code to the backend compiler API for execution via Judge0.
 * @param {string} sourceCode - The source code to run.
 * @param {number} languageId - The Judge0 language ID.
 * @param {string} [stdin=""] - Optional standard input for the program.
 * @returns {Promise<Object>} API response with success status and output/message.
 */
export const runCodeAPI = async (sourceCode, languageId, stdin = "") => {
  try {
    const response = await axios.post(API_URL, {
      source_code: sourceCode,
      language_id: languageId,
      stdin,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error;
    }
    throw new Error(error.message || 'Network connection failed. Make sure backend is running.');
  }
};
