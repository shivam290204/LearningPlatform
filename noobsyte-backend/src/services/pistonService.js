const axios = require('axios');

// Piston API language → runtime mapping
// Each entry maps a frontend language key to the Piston runtime name and version.
const LANGUAGE_MAPPING = {
  python:     { language: 'python',     version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  java:       { language: 'java',       version: '15.0.2' },
  c:          { language: 'c',          version: '10.2.0' },
  cpp:        { language: 'c++',        version: '10.2.0' },
};

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

/**
 * Executes source code via the Piston API.
 * @param {string} language  - Frontend language identifier (python, javascript, java, c, cpp)
 * @param {string} code      - Source code to execute
 * @param {string} stdin     - Standard input for the program
 * @returns {Promise<Object>} Standardized execution result
 */
const executeCode = async (language, code, stdin = '') => {
  const mapping = LANGUAGE_MAPPING[language.toLowerCase()];

  if (!mapping) {
    return {
      success: false,
      message: `Unsupported language: '${language}'. Supported: python, javascript, java, c, cpp.`,
    };
  }

  // Determine the correct filename extension for compiled languages
  const fileExtensions = {
    python: 'main.py',
    javascript: 'main.js',
    java: 'Main.java',
    c: 'main.c',
    cpp: 'main.cpp',
  };

  const payload = {
    language: mapping.language,
    version: mapping.version,
    files: [
      {
        name: fileExtensions[language.toLowerCase()],
        content: code,
      },
    ],
    stdin: stdin,
    compile_timeout: 10000,  // 10 s compile timeout
    run_timeout: 10000,      // 10 s run timeout
  };

  try {
    const response = await axios.post(PISTON_API_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 30000, // 30 s axios timeout
    });

    const { run, compile } = response.data;

    // --- Compilation error (compiled languages only) ---
    if (compile && compile.code !== 0) {
      return {
        success: false,
        message: compile.stderr || compile.output || 'Compilation Error',
      };
    }

    // --- Runtime error ---
    if (run.stderr) {
      return {
        success: false,
        message: run.stderr,
      };
    }

    // --- Successful execution ---
    return {
      success: true,
      output: run.stdout || run.output || '',
    };

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Piston API timeout:', error.message);
      throw new Error('Execution timed out. The server took too long to respond.');
    }

    console.error('Piston API error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || error.message || 'Failed connecting to the Piston execution API.'
    );
  }
};

module.exports = {
  executeCode,
};
