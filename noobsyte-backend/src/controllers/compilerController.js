const { submitCode } = require('../services/judge0Service');

/**
 * Validates request parameters and coordinates code execution via Judge0.
 * @route POST /api/v1/compiler/run
 */
const runCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin } = req.body;

    // Validate required fields
    if (!source_code) {
      return res.status(400).json({
        success: false,
        message: 'Missing source code content.',
      });
    }

    if (!language_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing language_id field.',
      });
    }

    // Call Judge0 execution service
    const result = await submitCode(source_code, language_id, stdin || '');

    console.log("Judge0 Raw Response:");
    console.dir(result, { depth: null });

    return res.status(200).json({
      success: true,
      output: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      executionTime: result.time,
      memory: result.memory,
      status: result.status,
    });
  } catch (error) {
    console.error('Compiler controller exception:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal compilation server error.',
    });
  }
};

module.exports = {
  runCode,
};
