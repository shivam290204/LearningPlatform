const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Base temp sandbox directory
const SANDBOX_DIR = path.join(__dirname, '../temp_sandbox');

/**
 * Clean up files and directory recursively
 */
const cleanup = (dirPath) => {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  } catch (err) {
    console.error('Cleanup error:', err.message);
  }
};

/**
 * Run a command inside Docker sandbox container
 */
const runDockerCommand = (command, stdin = '', timeoutMs = 5000) => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const child = exec(command, (error, stdout, stderr) => {
      const elapsed = (Date.now() - startTime) / 1000;
      if (error && child.killed) {
        resolve({
          success: false,
          stdout: stdout.toString(),
          stderr: `Time Limit Exceeded (${timeoutMs / 1000}s timeout)`,
          time: elapsed,
          status: { id: 5, description: 'Time Limit Exceeded' }
        });
      } else if (error) {
        resolve({
          success: false,
          stdout: stdout.toString(),
          stderr: stderr.toString() || error.message,
          time: elapsed,
          status: { id: 11, description: 'Runtime Error' }
        });
      } else {
        resolve({
          success: true,
          stdout: stdout.toString(),
          stderr: stderr.toString(),
          time: elapsed,
          status: { id: 3, description: 'Accepted' }
        });
      }
    });

    if (stdin && child.stdin) {
      child.stdin.write(stdin);
      child.stdin.end();
    }

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
 * Parses the Java source code to determine the appropriate class name for compilation & execution.
 * Prioritizes a public class, then any class containing a 'main' method, and falls back to any class.
 */
const findJavaClassName = (sourceCode) => {
  const publicClassMatch = sourceCode.match(/public\s+class\s+(\w+)/);
  if (publicClassMatch) return publicClassMatch[1];

  const classes = sourceCode.split(/\bclass\s+/);
  for (let i = 1; i < classes.length; i++) {
    const classBlock = classes[i];
    const nameMatch = classBlock.match(/^(\w+)/);
    if (nameMatch) {
      const className = nameMatch[1];
      if (classBlock.includes('public static void main') || classBlock.includes('public static main')) {
        return className;
      }
    }
  }

  const anyClassMatch = sourceCode.match(/class\s+(\w+)/);
  if (anyClassMatch) return anyClassMatch[1];

  return 'Main';
};

/**
 * Compiles and executes code inside sandboxed Docker containers based on Judge0 language ID.
 * Parameters:
 * - memory: 256m for JS/Python, 384m for Java/compiled (to accommodate JVM/V8 overhead)
 * - network: none (network isolation)
 * - pids-limit: 20 (fork bomb protection)
 * - cpus: 0.5 (CPU quota cap)
 * - read-only: Mount volume :ro for runtime, --read-only for root fs
 * - user: 1000:1000 (Non-root user)
 */
const executeLocally = async (sourceCode, languageId, stdin = '') => {
  if (!fs.existsSync(SANDBOX_DIR)) {
    fs.mkdirSync(SANDBOX_DIR, { recursive: true });
  }

  const runId = `run_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const runCwd = path.join(SANDBOX_DIR, runId);
  fs.mkdirSync(runCwd, { recursive: true });

  const dockerVolumePath = runCwd.replace(/\\/g, '/');
  const langId = Number(languageId);

  try {
    if (langId === 71) {
      // ── Python ──
      const filename = 'main.py';
      fs.writeFileSync(path.join(runCwd, filename), sourceCode, 'utf8');

      const dockerCmd = `docker run --rm -i --memory=128m --cpus=0.5 --pids-limit=20 --network=none --read-only --user=1000:1000 -v "${dockerVolumePath}:/app:ro" -w /app python:3.10-alpine python -B main.py`;
      const result = await runDockerCommand(dockerCmd, stdin, 5000);
      
      cleanup(runCwd);
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

      const dockerCmd = `docker run --rm -i --memory=512m --cpus=0.5 --pids-limit=20 --network=none --read-only --tmpfs /tmp:rw,noexec,nosuid,size=32m --user=1000:1000 -v "${dockerVolumePath}:/app:ro" -w /app node:18-alpine node --max-old-space-size=64 --max-semi-space-size=8 index.js`;
      const result = await runDockerCommand(dockerCmd, stdin, 5000);

      cleanup(runCwd);
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
      const className = findJavaClassName(sourceCode);
      const filename = `${className}.java`;
      fs.writeFileSync(path.join(runCwd, filename), sourceCode, 'utf8');

      // Compile Phase (512m memory limit, dynamic write privileges needed inside mount)
      const compileCmd = `docker run --rm --memory=512m --cpus=0.5 --pids-limit=20 --network=none --tmpfs /tmp:rw,noexec,nosuid,size=32m -v "${dockerVolumePath}:/app" -w /app eclipse-temurin:17-alpine javac -J-Xmx256m ${filename}`;
      const compileResult = await runDockerCommand(compileCmd, '', 15000);

      if (!compileResult.success) {
        cleanup(runCwd);
        return {
          stdout: '',
          stderr: '',
          compile_output: compileResult.stderr,
          time: 0,
          memory: 0,
          status: { id: 6, description: 'Compilation Error' }
        };
      }

      // Execution Phase (512m memory limit, read-only code execution, JVM tuned for containers)
      const runCmd = `docker run --rm -i --memory=512m --cpus=0.5 --pids-limit=20 --network=none --read-only --tmpfs /tmp:rw,noexec,nosuid,size=32m --user=1000:1000 -v "${dockerVolumePath}:/app:ro" -w /app eclipse-temurin:17-alpine java -Xmx128m -XX:CICompilerCount=2 -XX:+UseSerialGC -XX:+TieredCompilation -XX:TieredStopAtLevel=1 ${className}`;
      const executeResult = await runDockerCommand(runCmd, stdin, 5000);

      cleanup(runCwd);
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
      fs.writeFileSync(path.join(runCwd, filename), sourceCode, 'utf8');

      // Compile Phase (using gcc:latest to match runtime environment)
      const compileCmd = `docker run --rm --memory=256m --cpus=0.5 --pids-limit=20 --network=none -v "${dockerVolumePath}:/app" -w /app gcc:latest gcc ${filename} -o main.out`;
      const compileResult = await runDockerCommand(compileCmd, '', 15000);

      if (!compileResult.success) {
        cleanup(runCwd);
        return {
          stdout: '',
          stderr: '',
          compile_output: compileResult.stderr,
          time: 0,
          memory: 0,
          status: { id: 6, description: 'Compilation Error' }
        };
      }

      // Execution Phase (runs inside gcc:latest container with read-only workspace)
      const runCmd = `docker run --rm -i --memory=128m --cpus=0.5 --pids-limit=20 --network=none --read-only --user=1000:1000 -v "${dockerVolumePath}:/app:ro" -w /app gcc:latest ./main.out`;
      const executeResult = await runDockerCommand(runCmd, stdin, 5000);

      cleanup(runCwd);
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
      fs.writeFileSync(path.join(runCwd, filename), sourceCode, 'utf8');

      // Compile Phase (using gcc:latest to compile with g++)
      const compileCmd = `docker run --rm --memory=256m --cpus=0.5 --pids-limit=20 --network=none -v "${dockerVolumePath}:/app" -w /app gcc:latest g++ ${filename} -o main.out`;
      const compileResult = await runDockerCommand(compileCmd, '', 15000);

      if (!compileResult.success) {
        cleanup(runCwd);
        return {
          stdout: '',
          stderr: '',
          compile_output: compileResult.stderr,
          time: 0,
          memory: 0,
          status: { id: 6, description: 'Compilation Error' }
        };
      }

      // Execution Phase (runs inside gcc:latest container with read-only workspace)
      const runCmd = `docker run --rm -i --memory=128m --cpus=0.5 --pids-limit=20 --network=none --read-only --user=1000:1000 -v "${dockerVolumePath}:/app:ro" -w /app gcc:latest ./main.out`;
      const executeResult = await runDockerCommand(runCmd, stdin, 5000);

      cleanup(runCwd);
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
