const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure unique folder generation to handle concurrent runs
const SANDBOX_DIR = path.join(__dirname, '../temp_sandbox');

/**
 * Clean up files and directory recursively
 */
const cleanup = (dirPath, files = []) => {
  try {
    files.forEach(f => {
      const filePath = path.join(dirPath, f);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    if (fs.existsSync(dirPath)) {
      fs.rmdirSync(dirPath);
    }
  } catch (err) {
    console.error('Cleanup error:', err.message);
  }
};

/**
 * Run a command with stdin and a timeout
 */
const runCommand = (command, cwd, stdin = '', timeoutMs = 5000) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const child = exec(command, { cwd }, (error, stdout, stderr) => {
      const elapsed = (Date.now() - startTime) / 1000; // in seconds
      if (error && child.killed) {
        resolve({
          success: false,
          stdout,
          stderr: `Time Limit Exceeded (${timeoutMs / 1000}s timeout)`,
          time: elapsed,
          status: { id: 5, description: 'Time Limit Exceeded' }
        });
      } else if (error) {
        resolve({
          success: false,
          stdout,
          stderr: stderr || error.message,
          time: elapsed,
          status: { id: 11, description: 'Runtime Error' }
        });
      } else {
        resolve({
          success: true,
          stdout,
          stderr,
          time: elapsed,
          status: { id: 3, description: 'Accepted' }
        });
      }
    });

    // Write input to stdin if provided
    if (stdin) {
      child.stdin.write(stdin);
      child.stdin.end();
    }

    // Set timeout to kill process
    const timeout = setTimeout(() => {
      child.killed = true;
      child.kill('SIGKILL');
    }, timeoutMs);

    child.on('exit', () => {
      clearTimeout(timeout);
    });
  });
};

/**
 * Compiles and executes code locally based on Judge0 language ID.
 * Mappings:
 * - 71: Python
 * - 63: JavaScript
 * - 62: Java
 * - 50: C
 * - 54: C++
 */
const executeLocally = async (sourceCode, languageId, stdin = '') => {
  // Ensure base sandbox directory exists
  if (!fs.existsSync(SANDBOX_DIR)) {
    fs.mkdirSync(SANDBOX_DIR, { recursive: true });
  }

  // Create unique folder for this execution run
  const runId = `run_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const runCwd = path.join(SANDBOX_DIR, runId);
  fs.mkdirSync(runCwd, { recursive: true });

  const langId = Number(languageId);

  try {
    if (langId === 71) {
      // ── Python ──
      const filename = 'main.py';
      fs.writeFileSync(path.join(runCwd, filename), sourceCode, 'utf8');
      
      const result = await runCommand('python main.py', runCwd, stdin);
      cleanup(runCwd, [filename]);
      
      return {
        stdout: result.stdout,
        stderr: result.stderr,
        compile_output: '',
        time: result.time,
        memory: 0,
        status: result.status
      };

    } else if (langId === 63) {
      // ── JavaScript ──
      const filename = 'index.js';
      fs.writeFileSync(path.join(runCwd, filename), sourceCode, 'utf8');
      
      const result = await runCommand('node index.js', runCwd, stdin);
      cleanup(runCwd, [filename]);
      
      return {
        stdout: result.stdout,
        stderr: result.stderr,
        compile_output: '',
        time: result.time,
        memory: 0,
        status: result.status
      };

    } else if (langId === 62) {
      // ── Java ──
      // Parse the public class name from code; default to 'Main'
      const match = sourceCode.match(/public\s+class\s+(\w+)/);
      const className = match ? match[1] : 'Main';
      const filename = `${className}.java`;
      
      fs.writeFileSync(path.join(runCwd, filename), sourceCode, 'utf8');

      // Phase 1: Compile the Java Class (15s limit)
      const compileResult = await runCommand(`javac ${filename}`, runCwd, '', 15000);
      
      if (!compileResult.success) {
        cleanup(runCwd, [filename]);
        return {
          stdout: '',
          stderr: '',
          compile_output: compileResult.stderr,
          time: 0,
          memory: 0,
          status: { id: 6, description: 'Compilation Error' }
        };
      }

      // Phase 2: Execute bytecode (5s limit)
      const executeResult = await runCommand(`java ${className}`, runCwd, stdin, 5000);
      
      cleanup(runCwd, [filename, `${className}.class`]);
      return {
        stdout: executeResult.stdout,
        stderr: executeResult.stderr,
        compile_output: '',
        time: executeResult.time,
        memory: 0,
        status: executeResult.status
      };

    } else if (langId === 50) {
      // ── C ──
      const filename = 'main.c';
      const binaryName = 'main.exe';
      fs.writeFileSync(path.join(runCwd, filename), sourceCode, 'utf8');

      // Compile using GCC (15s limit)
      const compileResult = await runCommand(`gcc ${filename} -o ${binaryName}`, runCwd, '', 15000);
      if (!compileResult.success) {
        cleanup(runCwd, [filename]);
        return {
          stdout: '',
          stderr: '',
          compile_output: compileResult.stderr,
          time: 0,
          memory: 0,
          status: { id: 6, description: 'Compilation Error' }
        };
      }

      // Execute binary (5s limit)
      const executeResult = await runCommand(binaryName, runCwd, stdin, 5000);
      cleanup(runCwd, [filename, binaryName]);
      
      return {
        stdout: executeResult.stdout,
        stderr: executeResult.stderr,
        compile_output: '',
        time: executeResult.time,
        memory: 0,
        status: executeResult.status
      };

    } else if (langId === 54) {
      // ── C++ ──
      const filename = 'main.cpp';
      const binaryName = 'main.exe';
      fs.writeFileSync(path.join(runCwd, filename), sourceCode, 'utf8');

      // Compile using G++ (15s limit)
      const compileResult = await runCommand(`g++ ${filename} -o ${binaryName}`, runCwd, '', 15000);
      if (!compileResult.success) {
        cleanup(runCwd, [filename]);
        return {
          stdout: '',
          stderr: '',
          compile_output: compileResult.stderr,
          time: 0,
          memory: 0,
          status: { id: 6, description: 'Compilation Error' }
        };
      }

      // Execute binary (5s limit)
      const executeResult = await runCommand(binaryName, runCwd, stdin, 5000);
      cleanup(runCwd, [filename, binaryName]);
      
      return {
        stdout: executeResult.stdout,
        stderr: executeResult.stderr,
        compile_output: '',
        time: executeResult.time,
        memory: 0,
        status: executeResult.status
      };

    } else {
      cleanup(runCwd);
      return {
        stdout: '',
        stderr: `Unsupported language ID: ${languageId}`,
        compile_output: '',
        time: 0,
        memory: 0,
        status: { id: 11, description: 'Runtime Error' }
      };
    }
  } catch (err) {
    cleanup(runCwd);
    return {
      stdout: '',
      stderr: err.message,
      compile_output: '',
      time: 0,
      memory: 0,
      status: { id: 11, description: 'Runtime Error' }
    };
  }
};

module.exports = {
  executeLocally
};
