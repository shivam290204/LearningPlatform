import React, { useState, useEffect, useRef } from 'react';
import './JavaSandbox.css';

const TEMPLATES = {
  helloWorld: {
    name: 'Hello World',
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, NoobSyte!");
        System.out.println("Welcome to Java Visual Learning.");
    }
}`
  },
  variables: {
    name: 'Variables & Scope',
    code: `public class Main {
    public static void main(String[] args) {
        int a = 15;
        int b = 30;
        int sum = a + b;
        System.out.println("Variable a = " + a);
        System.out.println("Variable b = " + b);
        System.out.println("Sum of variables = " + sum);
    }
}`
  },
  controlFlow: {
    name: 'Odd or Even (Loop)',
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Evaluating loops from 1 to 5:");
        for (int i = 1; i <= 5; i++) {
            if (i % 2 == 0) {
                System.out.println("Number " + i + " is Even");
            } else {
                System.out.println("Number " + i + " is Odd");
            }
        }
    }
}`
  },
  arrays: {
    name: 'Arrays & Average',
    code: `public class Main {
    public static void main(String[] args) {
        int[] scores = {85, 92, 78, 95, 88};
        int total = 0;
        System.out.println("Analyzing score array elements:");
        for (int i = 0; i < scores.length; i++) {
            System.out.println("Score at index " + i + " = " + scores[i]);
            total += scores[i];
        }
        double average = (double) total / scores.length;
        System.out.println("Average Score = " + average);
    }
}`
  },
  jvmAllocation: {
    name: 'JVM Heap Allocation (Visual)',
    code: `public class Main {
    public static void main(String[] args) {
        // Step 1: Declare reference variable on Stack
        Car myCar;
        System.out.println("myCar reference declared on Stack.");

        // Step 2: Instantiate object on Heap
        myCar = new Car("RoyalBlue");
        System.out.println("Instantiated new Car object in Heap.");

        // Step 3: Modify attributes
        myCar.speed = 120;
        System.out.println("Car color: " + myCar.color);
        System.out.println("Car speed: " + myCar.speed + " km/h");
    }
}`
  }
};

export default function JavaSandbox() {
  const [selectedPreset, setSelectedPreset] = useState('helloWorld');
  const [code, setCode] = useState(TEMPLATES.helloWorld.code);
  const [consoleLogs, setConsoleLogs] = useState([
    'System ready. Choose a preset or write Java code and click "Run Code".'
  ]);
  const [running, setRunning] = useState(false);
  const [compiling, setCompiling] = useState(false);
  const [stack, setStack] = useState([]);
  const [heap, setHeap] = useState([]);
  const [lineCount, setLineCount] = useState(1);

  const textareaRef = useRef(null);
  const lineGutterRef = useRef(null);

  // Sync line numbers count
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

  // Sync scroll of gutter and textarea
  const handleScroll = () => {
    if (textareaRef.current && lineGutterRef.current) {
      lineGutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handlePresetChange = (e) => {
    const presetKey = e.target.value;
    setSelectedPreset(presetKey);
    setCode(TEMPLATES[presetKey].code);
  };

  // Compile and run engine
  const executeCode = () => {
    setCompiling(true);
    setRunning(true);
    setConsoleLogs(['[COMPILER] Starting javac compiler...', '[COMPILER] Compiling Main.java...']);
    setStack([]);
    setHeap([]);

    setTimeout(() => {
      // Basic syntax check
      const openBraces = (code.match(/\{/g) || []).length;
      const closeBraces = (code.match(/\}/g) || []).length;
      const missingSemicolonLines = [];

      // Check semicolons on statements (excluding comments, blocks, annotations)
      const lines = code.split('\n');
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (
          trimmed &&
          !trimmed.endsWith(';') &&
          !trimmed.endsWith('{') &&
          !trimmed.endsWith('}') &&
          !trimmed.startsWith('//') &&
          !trimmed.startsWith('public class') &&
          !trimmed.startsWith('public static void main') &&
          !trimmed.startsWith('import')
        ) {
          missingSemicolonLines.push(index + 1);
        }
      });

      if (openBraces !== closeBraces) {
        setConsoleLogs((prev) => [
          ...prev,
          `Main.java: error: reached end of file while parsing`,
          `Main.java: Check matching curly braces '{ }' (Found {:${openBraces}, }:${closeBraces})`,
          `[COMPILER] Compilation failed with 1 error.`
        ]);
        setCompiling(false);
        setRunning(false);
        return;
      }

      if (missingSemicolonLines.length > 0) {
        const errorLogs = missingSemicolonLines.map(
          (num) => `Main.java:${num}: error: ';' expected\n    ${lines[num - 1].trim()}`
        );
        setConsoleLogs((prev) => [
          ...prev,
          ...errorLogs,
          `[COMPILER] Compilation failed with ${missingSemicolonLines.length} error(s).`
        ]);
        setCompiling(false);
        setRunning(false);
        return;
      }

      setConsoleLogs((prev) => [
        ...prev,
        '[COMPILER] Compilation successful.',
        '[JVM] Loading bytecode...',
        '[JVM] Initializing JVM Stack frame and Heap space...',
        '---------------- OUTPUT ----------------'
      ]);

      // Start execution step
      setTimeout(() => {
        const outputLogs = [];
        const print = (val) => {
          outputLogs.push(String(val));
        };

        try {
          // Parse dynamic variable declarations for JVM Memory Visualizer
          const stackList = [];
          const heapList = [];

          // Pre-populate mock visualizer classes/objects if we match code structures
          // Scan line by line to build Stack/Heap structures
          const variableMatches = [
            ...code.matchAll(/\b(int|double|float|boolean|String)\s+(\w+)\s*=\s*([^;]+);/g)
          ];
          variableMatches.forEach((m) => {
            const [, type, name, val] = m;
            stackList.push({ variable: name, value: val.trim() });
          });

          // Check for array declarations
          const arrayMatches = [
            ...code.matchAll(/\b(int|double|String)\[\]\s+(\w+)\s*=\s*\{(.*?)\}\s*;/g)
          ];
          arrayMatches.forEach((m) => {
            const [, type, name, elements] = m;
            const address = `0x${Math.floor(Math.random() * 8000 + 4000).toString(16).toUpperCase()}`;
            stackList.push({ variable: name, value: address });
            heapList.push({
              address,
              objectType: `${type}[]`,
              fields: elements.split(',').map((el) => el.trim()).join(', ')
            });
          });

          // Check for object declarations and instantiations
          const carDeclare = code.match(/\bCar\s+(\w+)\s*;/);
          if (carDeclare) {
            const name = carDeclare[1];
            stackList.push({ variable: name, value: 'null' });
          }

          const carAlloc = code.match(/(\w+)\s*=\s*new\s+Car\((.*?)\);/);
          if (carAlloc) {
            const name = carAlloc[1];
            const color = carAlloc[2].replace(/"/g, '').trim();
            const address = '0x7A3F';

            // Find existing null variable on Stack and allocate address
            const idx = stackList.findIndex((item) => item.variable === name);
            if (idx !== -1) {
              stackList[idx].value = address;
            } else {
              stackList.push({ variable: name, value: address });
            }

            // Check if speed is set
            const speedMatch = code.match(/\.speed\s*=\s*(\d+);/);
            const speed = speedMatch ? speedMatch[1] : '0';

            heapList.push({
              address,
              objectType: 'Car',
              fields: { color, speed: `${speed} km/h` }
            });
          }

          // Evaluate print statements inside code using a sandboxed execution block
          let codeToRun = '';
          const mainMatch = code.match(
            /public\s+static\s+void\s+main\s*\(\s*String\s*\[\s*\]\s+\w+\s*\)\s*\{([\s\S]*)\}/
          );
          if (mainMatch) {
            codeToRun = mainMatch[1];
          } else {
            codeToRun = code;
          }

          // Transpile simple print statements, let declaration mapping
          codeToRun = codeToRun.replace(/System\.out\.println\s*\((.*?)\);/g, 'print($1);');
          codeToRun = codeToRun.replace(/System\.out\.print\s*\((.*?)\);/g, 'print($1);');
          codeToRun = codeToRun.replace(
            /\b(int|double|float|boolean|String|char|var)\s+(\w+)\b/g,
            'let $2'
          );

          // Support Array length
          codeToRun = codeToRun.replace(/\b(\w+)\.length\b/g, '$1.length');

          // Class/Object simulator mock properties
          const executionContext = `
            class Car {
              constructor(c) {
                this.color = c || "RoyalBlue";
                this.speed = 0;
              }
            }
            ${codeToRun}
          `;

          // Execute transpiled Javascript safely
          const runFn = new Function('print', executionContext);
          runFn(print);

          setConsoleLogs((prev) => [
            ...prev,
            ...outputLogs,
            '----------------------------------------',
            '[JVM] Program finished with exit code 0.',
            `[JVM] JVM memory allocation state updated successfully.`
          ]);

          setStack(stackList);
          setHeap(heapList);

        } catch (e) {
          setConsoleLogs((prev) => [
            ...prev,
            `Runtime Exception: java.lang.NullPointerException: ${e.message}`,
            '----------------------------------------',
            '[JVM] Program exited abnormally with code 1.'
          ]);
        } finally {
          setCompiling(false);
          setRunning(false);
        }
      }, 600);
    }, 800);
  };

  return (
    <div className="sandbox-panel-container">
      {/* Sandbox Toolbar */}
      <div className="sandbox-toolbar">
        <div className="sandbox-tool-group">
          <i className="fa-solid fa-terminal text-cyan" style={{ marginRight: '0.5rem' }}></i>
          <h4>Interactive Java Sandbox</h4>
        </div>
        <div className="sandbox-preset-selection">
          <label htmlFor="preset-select">Select Template:</label>
          <select
            id="preset-select"
            value={selectedPreset}
            onChange={handlePresetChange}
            disabled={running}
            className="preset-select-dropdown"
          >
            {Object.keys(TEMPLATES).map((key) => (
              <option key={key} value={key}>
                {TEMPLATES[key].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Editor & Terminal */}
      <div className="sandbox-workspace-grid">
        {/* Code Editor Panel */}
        <div className="sandbox-editor-card">
          <div className="panel-sub-header">
            <span>Main.java</span>
            <span className="file-lang">Java 17</span>
          </div>

          <div className="editor-input-area">
            {/* Gutter Line Numbers */}
            <div className="gutter-line-numbers" ref={lineGutterRef}>
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i} className="gutter-line-item">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Code Input Textarea */}
            <textarea
              ref={textareaRef}
              className="sandbox-code-textarea"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              disabled={running}
              spellCheck="false"
              autoComplete="off"
            />
          </div>

          {/* Action Row */}
          <div className="editor-action-row">
            <button
              className={`btn-run-code ${running ? 'btn-running' : ''}`}
              onClick={executeCode}
              disabled={running}
            >
              {running ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                  Running...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-play" style={{ marginRight: '0.5rem' }}></i>
                  Run Code
                </>
              )}
            </button>
          </div>
        </div>

        {/* Terminal Console Panel */}
        <div className="sandbox-console-card">
          <div className="panel-sub-header">
            <span>JVM Output Terminal</span>
            <span className="console-indicator">Live Logs</span>
          </div>
          <div className="terminal-stdout-logs">
            {consoleLogs.map((log, index) => {
              let logClass = '';
              if (log.startsWith('[COMPILER]')) logClass = 'compiler-log';
              else if (log.startsWith('[JVM]')) logClass = 'jvm-log';
              else if (log.includes('error:') || log.includes('Exception:')) logClass = 'error-log';
              else if (log.startsWith('---') || log.startsWith('===')) logClass = 'divider-log';

              return (
                <div key={index} className={`terminal-log-line ${logClass}`}>
                  {log}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* JVM Memory Visualizer Sub-panel */}
      {(stack.length > 0 || heap.length > 0) && (
        <div className="sandbox-jvm-visualization-panel">
          <div className="visual-header">
            <i className="fa-solid fa-brain text-cyan" style={{ marginRight: '0.5rem' }}></i>
            <h5>Current Stack vs Heap Memory Frame State</h5>
          </div>

          <div className="visualizer-canvas" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-primary)' }}>
            {/* Stack frame */}
            <div className="canvas-column stack-column">
              <div className="column-label">JVM STACK FRAME</div>
              <div className="stack-frame-box">
                {stack.map((v, i) => (
                  <div key={i} className="stack-variable-card">
                    <span className="var-name">{v.variable}</span>
                    <span className="var-separator">→</span>
                    <span className={`var-val ${v.value.startsWith('0x') ? 'pointer-address' : ''}`}>
                      {v.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pointers-connector">
              <span>⇄</span>
            </div>

            {/* Heap memory */}
            <div className="canvas-column heap-column">
              <div className="column-label">JVM HEAP SPACE</div>
              <div className="heap-frame-box">
                {heap.length > 0 ? (
                  heap.map((h, i) => (
                    <div key={i} className="heap-object-card">
                      <div className="object-address">{h.address}</div>
                      <div className="object-details">
                        <div className="object-type">{h.objectType} Object</div>
                        <div className="object-fields">
                          {typeof h.fields === 'object' ? (
                            Object.entries(h.fields).map(([k, v]) => (
                              <div key={k} className="field-row">
                                <span className="field-key">{k}:</span>
                                <span className="field-val">"{v}"</span>
                              </div>
                            ))
                          ) : (
                            <span className="field-val">{h.fields}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-frame-msg">Heap is empty.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
