const axios = require("axios");

const JUDGE0_API_URL =
  "http://localhost:2358/submissions/?base64_encoded=true&wait=true";

const submitCode = async (sourceCode, languageId, stdin = "") => {
  try {
    const encodedSource = Buffer.from(sourceCode, "utf8").toString("base64");
    const encodedInput = Buffer.from(stdin, "utf8").toString("base64");

    const response = await axios.post(JUDGE0_API_URL, {
      source_code: encodedSource,
      language_id: languageId,
      stdin: encodedInput,
    });

    if (response.data.stdout) {
      response.data.stdout = Buffer.from(
        response.data.stdout,
        "base64"
      ).toString("utf8");
    }

    if (response.data.stderr) {
      response.data.stderr = Buffer.from(
        response.data.stderr,
        "base64"
      ).toString("utf8");
    }

    if (response.data.compile_output) {
      response.data.compile_output = Buffer.from(
        response.data.compile_output,
        "base64"
      ).toString("utf8");
    }

    return response.data;
  } catch (error) {
    console.error(
      "Judge0 submission error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

module.exports = { submitCode };
