import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { runCodeAPI } from '../../services/compilerService';
import './CodeEditor.css';

const LANGUAGES = [
  { id: 'python', label: 'Python', monacoId: 'python', filename: 'main.py', judge0Id: 71 },
  { id: 'javascript', label: 'JavaScript', monacoId: 'javascript', filename: 'index.js', judge0Id: 63 },
  { id: 'java', label: 'Java', monacoId: 'java', filename: 'Main.java', judge0Id: 62 },
  { id: 'c', label: 'C', monacoId: 'c', filename: 'main.c', judge0Id: 50 },
  { id: 'cpp', label: 'C++', monacoId: 'cpp', filename: 'main.cpp', judge0Id: 54 },
];

const DEFAULT_CODE = {
  python: `# Write your Python code here
print("Hello, World!")`,
  javascript: `// Write your JavaScript code here
console.log("Hello, World!");`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
};

export default function CodeEditor() {
  // 1. Language Selection (Autosaved)
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem('noobsyte_selected_lang') || 'python';
  });

  // 2. Language-Specific Code (Autosaved separately)
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem(`noobsyte_code_${selectedLang}`);
    return saved !== null ? saved : DEFAULT_CODE[selectedLang];
  });

  // 3. Stdin / Program Input (Autosaved)
  const [stdin, setStdin] = useState(() => {
    return localStorage.getItem('noobsyte_program_input') || '';
  });

  // 4. Font Size (Autosaved, default 14px)
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('noobsyte_font_size');
    return saved ? parseInt(saved, 10) : 14;
  });

  // 5. Panel widths/heights (Autosaved resizers)
  const [panelWidth, setPanelWidth] = useState(() => {
    const saved = localStorage.getItem('noobsyte_panel_width');
    return saved ? parseInt(saved, 10) : 400; // Console width
  });
  const [inputHeight, setInputHeight] = useState(() => {
    const saved = localStorage.getItem('noobsyte_panel_height');
    return saved ? parseInt(saved, 10) : 220; // Default height for 50/50 split
  });
  const [isResized, setIsResized] = useState(() => {
    return localStorage.getItem('noobsyte_panel_resized') === 'true';
  });

  const [output, setOutput] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [copyOutputFeedback, setCopyOutputFeedback] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [lastRunStdin, setLastRunStdin] = useState(() => {
    return localStorage.getItem('noobsyte_last_run_stdin') || '';
  });

  const dropdownRef = useRef(null);
  const outputBodyRef = useRef(null);
  const stdinInputRef = useRef(null);
  const promptsColumnRef = useRef(null);
  const currentLang = LANGUAGES.find((l) => l.id === selectedLang);

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem('noobsyte_selected_lang', selectedLang);
    // Switch active code to the selected language's saved code
    const saved = localStorage.getItem(`noobsyte_code_${selectedLang}`);
    setCode(saved !== null ? saved : DEFAULT_CODE[selectedLang]);
  }, [selectedLang]);

  useEffect(() => {
    localStorage.setItem(`noobsyte_code_${selectedLang}`, code);
  }, [code, selectedLang]);

  useEffect(() => {
    localStorage.setItem('noobsyte_program_input', stdin);
  }, [stdin]);

  useEffect(() => {
    localStorage.setItem('noobsyte_font_size', fontSize.toString());
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('noobsyte_panel_width', panelWidth.toString());
  }, [panelWidth]);

  useEffect(() => {
    localStorage.setItem('noobsyte_panel_height', inputHeight.toString());
  }, [inputHeight]);

  useEffect(() => {
    localStorage.setItem('noobsyte_panel_resized', isResized.toString());
  }, [isResized]);

  useEffect(() => {
    localStorage.setItem('noobsyte_last_run_stdin', lastRunStdin);
  }, [lastRunStdin]);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      }
      if (e.key === 'Escape' && showModal) {
        e.preventDefault();
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, stdin, showModal, selectedLang]);

  // Automatically scroll console body to the bottom of the outputs on run completion to make Program Output visible
  useEffect(() => {
    if (output && output.type !== 'pending') {
      if (outputBodyRef.current) {
        outputBodyRef.current.scrollTo({
          top: outputBodyRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [output]);

  const getStatusBadge = () => {
    if (output?.type === 'pending') {
      return <span className="ce-badge ce-badge--running">Running...</span>;
    }
    if (!output || !output.status) return null;

    const { id, description } = output.status;
    if (id === 3) {
      return <span className="ce-badge ce-badge--accepted">🟢 Accepted</span>;
    } else if (id === 6) {
      return <span className="ce-badge ce-badge--compile-err">🔴 Compilation Error</span>;
    } else {
      return <span className="ce-badge ce-badge--runtime-err">🟠 {description || 'Runtime Error'}</span>;
    }
  };

  const handleLangSelect = (langId) => {
    setSelectedLang(langId);
    setOutput(null);
    setDropdownOpen(false);
  };

  const isInputRuntimeError = (text) => {
    if (!text) return false;
    const lower = text.toLowerCase();
    return (
      lower.includes('eoferror') ||
      lower.includes('nosuchelementexception') ||
      lower.includes('eof when reading a line') ||
      lower.includes('eof') ||
      lower.includes('stdin') ||
      lower.includes('no more lines') ||
      lower.includes('reader.readline') ||
      lower.includes('bufferedreader.readline')
    );
  };

  const detectsInputRequirement = (sourceCode) => {
    if (!sourceCode) return false;

    // Regex to match and strip comments and string literals to prevent false positives
    const cleanRegex = /"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\*[\s\S]*?\*\/|\/\/.*|#.*/g;
    const cleanedCode = sourceCode.replace(cleanRegex, ' ');

    // Patterns covering C++, C, Python, Java, and JavaScript input methods
    const inputPatterns = [
      // C++
      /cin\s*>>/,
      /getline\s*\(\s*cin\b/,
      /\bistream\b/,

      // C
      /scanf\s*\(/,
      /fgets\s*\(/,
      /getchar\s*\(/,
      /getc\s*\(/,
      /\bfscanf\s*\(/,
      /\bgets\s*\(/,

      // Python
      /input\s*\(/,
      /sys\.stdin\.readline\b/,
      /sys\.stdin\.read\b/,
      /sys\.stdin\.readlines\b/,
      /fileinput\s*\.\s*input\b/,

      // Java
      /\bScanner\b/,
      /\bnext(Int|Long|Float|Double|Line)?\s*\(/,
      /\bBufferedReader\b/,
      /\bInputStreamReader\b/,
      /\breadLine\s*\(/,

      // JavaScript
      /prompt\s*\(/,
      /\breadline\b/,
      /process\.stdin\b/,
      /readFileSync\s*\(\s*0\b/
    ];

    return inputPatterns.some(pattern => pattern.test(cleanedCode));
  };

  const executeProgram = async () => {
    try {
      setOutput({ type: 'pending' });
      setLastRunStdin(stdin);

      const response = await runCodeAPI(code, currentLang.judge0Id, stdin);

      console.log("Compiler Response:", response);

      if (response.success) {
        const errorText = (response.compile_output || '') + '\n' + (response.stderr || '') + '\n' + (response.output || '');
        if (stdin.trim() === '' && isInputRuntimeError(errorText)) {
          setShowModal(true);
          setOutput(null);
          return;
        }

        if (response.compile_output) {
          setOutput({
            type: 'error',
            text: response.compile_output,
            status: response.status,
            time: response.executionTime,
            memory: response.memory
          });
        } else if (response.stderr) {
          setOutput({
            type: 'error',
            text: response.stderr,
            status: response.status,
            time: response.executionTime,
            memory: response.memory
          });
        } else if (response.output) {
          setOutput({
            type: 'result',
            text: response.output,
            status: response.status,
            time: response.executionTime,
            memory: response.memory
          });
        } else {
          setOutput({
            type: 'result',
            text: 'Program finished with no output',
            status: response.status,
            time: response.executionTime,
            memory: response.memory
          });
        }
      } else {
        const errorText = response.message || '';
        if (stdin.trim() === '' && isInputRuntimeError(errorText)) {
          setShowModal(true);
          setOutput(null);
          return;
        }

        setOutput({
          type: 'error',
          text: response.message || 'Execution failed',
          status: response.status,
          time: response.executionTime,
          memory: response.memory
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || '';
      if (stdin.trim() === '' && isInputRuntimeError(errorMsg)) {
        setShowModal(true);
        setOutput(null);
        return;
      }
      setOutput({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Execution failed',
      });
    }
  };

  const handleRunCode = async () => {
    if (detectsInputRequirement(code) && stdin.trim() === '') {
      setShowModal(true);
      return;
    }
    await executeProgram();
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const numTime = parseFloat(time);
    if (isNaN(numTime)) return time;
    if (numTime < 1) {
      return Math.round(numTime * 1000) + ' ms';
    }
    return numTime.toFixed(2) + ' s';
  };

  const formatMemory = (kb) => {
    if (!kb) return '';
    const numKb = parseFloat(kb);
    if (isNaN(numKb)) return kb;
    return (numKb / 1024).toFixed(1) + ' MB';
  };

  const handleCopyOutput = async () => {
    if (!output || !output.text) return;
    try {
      await navigator.clipboard.writeText(output.text);
      setCopyOutputFeedback(true);
      setTimeout(() => setCopyOutputFeedback(false), 1500);
    } catch (err) {
      console.error('Failed to copy output:', err);
    }
  };

  const handleResetCode = () => {
    const defaultCode = DEFAULT_CODE[selectedLang] || '';
    setCode(defaultCode); // Restore template
    setStdin(''); // Clear Custom Input
    setLastRunStdin(''); // Clear Execution Input
    setOutput(null); // Clear Console Output
    setIsResized(false); // Reset default 50% split
    localStorage.setItem(`noobsyte_code_${selectedLang}`, defaultCode);
    localStorage.setItem('noobsyte_program_input', '');
    localStorage.setItem('noobsyte_last_run_stdin', '');
    localStorage.setItem('noobsyte_panel_resized', 'false');
  };

  const handleClearOutput = () => {
    setOutput(null);
    setLastRunStdin('');
    localStorage.setItem('noobsyte_last_run_stdin', '');
  };

  // Horizontal pane resizing (Monaco ↔ Console)
  const handleWorkspaceResizeStart = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = panelWidth;

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(280, Math.min(650, startWidth - deltaX));
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Vertical pane resizing (Console output ↔ Program input)
  const handleConsoleResizeStart = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = inputHeight;
    setIsResized(true);

    // Calculate maximum allowable custom input height dynamically to avoid vertical overflow stretching
    const paneElement = document.querySelector('.ce-output-pane');
    const paneHeight = paneElement ? paneElement.getBoundingClientRect().height : 500;
    const maxInputHeight = Math.max(100, paneHeight - 36 - 90 - 8 - 80);

    const handleMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(80, Math.min(maxInputHeight, startHeight - deltaY));
      setInputHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleEditorDidMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const runBtn = document.getElementById('ce-run-btn');
      if (runBtn && !runBtn.disabled) {
        runBtn.click();
      }
    });
  };

  const handleGoToInput = () => {
    // 1. Close the modal
    setShowModal(false);

    // 2. Smoothly scroll only the console container until the Custom Input section becomes visible
    if (stdinInputRef.current) {
      let parent = stdinInputRef.current.parentElement;
      while (parent && parent !== document.body && parent !== document.documentElement) {
        const style = window.getComputedStyle(parent);
        const isScrollable = parent.scrollHeight > parent.clientHeight &&
          (style.overflowY === 'auto' || style.overflowY === 'scroll');
        if (isScrollable) {
          const targetTop = stdinInputRef.current.getBoundingClientRect().top;
          const parentTop = parent.getBoundingClientRect().top;
          parent.scrollTo({
            top: parent.scrollTop + (targetTop - parentTop) - 20,
            behavior: 'smooth'
          });
          break;
        }
        parent = parent.parentElement;
      }

      // 3. Focus the textarea & 4. Move the text cursor inside the textarea
      setTimeout(() => {
        stdinInputRef.current.focus();
        const length = stdinInputRef.current.value.length;
        stdinInputRef.current.setSelectionRange(length, length);
      }, 100);
    }

    // 5. Play the existing cyan highlight animation (reset state to trigger replay)
    setIsHighlighting(false);
    setTimeout(() => {
      setIsHighlighting(true);
    }, 50);
  };

  const handleStdinScroll = (e) => {
    if (promptsColumnRef.current) {
      promptsColumnRef.current.scrollTop = e.target.scrollTop;
    }
  };

  return (
    <div className="ce-root">

      {/* ── IDE Top Bar ── */}
      <div className="ce-topbar">

        {/* Left: window dots + filename */}
        <div className="ce-topbar-left">
          <div className="ce-window-dots">
            <span className="ce-dot ce-dot--red"></span>
            <span className="ce-dot ce-dot--yellow"></span>
            <span className="ce-dot ce-dot--green"></span>
          </div>
          <div className="ce-file-tab">
            <i className="fa-solid fa-file-code ce-file-icon"></i>
            <span>{currentLang.filename}</span>
          </div>
        </div>

        {/* Center: custom language dropdown */}
        <div className="ce-lang-wrapper" ref={dropdownRef}>
          <button
            className={`ce-lang-trigger ${dropdownOpen ? 'open' : ''}`}
            onClick={() => setDropdownOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            <span className="ce-lang-trigger-label">{currentLang.label}</span>
            <i className={`fa-solid fa-chevron-down ce-lang-caret ${dropdownOpen ? 'rotated' : ''}`}></i>
          </button>

          {dropdownOpen && (
            <ul className="ce-lang-menu" role="listbox">
              {LANGUAGES.map((lang) => (
                <li
                  key={lang.id}
                  role="option"
                  aria-selected={lang.id === selectedLang}
                  className={`ce-lang-option ${lang.id === selectedLang ? 'selected' : ''}`}
                  onClick={() => handleLangSelect(lang.id)}
                >
                  <span className="ce-lang-option-label">{lang.label}</span>
                  {lang.id === selectedLang && (
                    <i className="fa-solid fa-check ce-lang-check"></i>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: action buttons & font selector */}
        <div className="ce-topbar-right">
          {/* Compact Font Size Control */}
          <div className="ce-font-size-control">
            <span className="ce-font-label" title="Editor Font Size">Font Size</span>
            <select
              id="ce-font-select"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
              className="ce-font-select"
            >
              {[12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((sz) => (
                <option key={sz} value={sz}>{sz}px</option>
              ))}
            </select>
          </div>

          <button className="ce-action-btn" onClick={handleCopyCode} title="Copy code">
            <i className={`fa-solid ${copyFeedback ? 'fa-check' : 'fa-copy'}`}></i>
            {copyFeedback ? 'Copied' : 'Copy code'}
          </button>
          <button className="ce-action-btn" onClick={handleResetCode} title="Reset to default">
            <i className="fa-solid fa-rotate-left"></i>
            Clear
          </button>
          <button
            className="ce-run-btn"
            id="ce-run-btn"
            onClick={handleRunCode}
            disabled={output?.type === 'pending'}
          >
            {output?.type === 'pending' ? (
              <>
                <div className="ce-btn-spinner"></div>
                <span>Running...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-play"></i>
                <span>Run</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* ── Workspace (editor | resizer splitter | output) ── */}
      <div className="ce-workspace" style={{ gridTemplateColumns: `1fr 8px ${panelWidth}px` }}>

        {/* Editor */}
        <div className="ce-editor-pane">
          <Editor
            height="100%"
            language={currentLang.monacoId}
            value={code}
            onChange={(val) => setCode(val || '')}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              fontSize: fontSize,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              lineNumbersMinChars: 3,
              renderLineHighlight: 'line',
              automaticLayout: true,
              tabSize: 4,
              wordWrap: 'off',
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible',
                verticalScrollbarSize: 6,
                horizontalScrollbarSize: 6,
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false
              }
            }}
          />
        </div>

        {/* Editor ↔ Console Splitter resizer */}
        <div className="ce-workspace-splitter" onMouseDown={handleWorkspaceResizeStart}></div>

        {/* Output Console Pane */}
        <div className="ce-output-pane">
          <div className="ce-console-header-container">
            <div className="ce-output-topbar">
              <div className="ce-output-label">
                <i className="fa-solid fa-terminal"></i>
                <span>Console</span>
              </div>
              <div className="ce-output-topbar-actions">
                {output !== null && output.type !== 'pending' && (
                  <>
                    <button className="ce-action-btn ce-copy-output-btn" onClick={handleCopyOutput} title="Copy output">
                      <i className={`fa-solid ${copyOutputFeedback ? 'fa-check' : 'fa-copy'}`}></i>
                      <span>{copyOutputFeedback ? 'Copied' : 'Copy output'}</span>
                    </button>
                    <button className="ce-clear-btn" onClick={handleClearOutput} title="Clear output">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Redesigned Metadata Chips Row - Always visible after run */}
            {output !== null && (
              <div className="ce-console-meta-row">
                {getStatusBadge()}
                {output.type !== 'pending' && (output.time || output.memory) && (
                  <div className="ce-meta-chip">
                    {output.time && <span>{formatTime(output.time)}</span>}
                    {output.time && output.memory && <span className="ce-meta-dot">•</span>}
                    {output.memory && <span>{formatMemory(output.memory)}</span>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Console Output Body */}
          <div className={`ce-output-body ${isResized ? 'resized' : ''}`} ref={outputBodyRef}>
            {output === null && (
              <div className="ce-output-idle">
                <div className="ce-output-idle-prompt">
                  <span className="ce-prompt-symbol">&gt;_</span>
                </div>
                <p className="ce-output-idle-text">Click <strong>Run</strong> to execute</p>
              </div>
            )}
            {output?.type === 'pending' && (
              <div className="ce-output-running">
                <div className="ce-spinner"></div>
                <span>Running…</span>
              </div>
            )}
            {output !== null && output.type !== 'pending' && (
              <div className="ce-console-sections">
                {/* Section 1: Execution Input (Read Only) */}
                {lastRunStdin.trim() !== '' && (
                  <>
                    <div className="ce-console-section">
                      <div className="ce-console-section-title">Execution Input</div>
                      <pre className="ce-console-input-preview">
                        {lastRunStdin}
                      </pre>
                    </div>
                    <div className="ce-console-section-divider"></div>
                  </>
                )}

                {/* Section 2: Program Output */}
                <div className="ce-console-section">
                  <div className="ce-console-section-title">Program Output</div>
                  {output.type === 'result' ? (
                    <pre className="ce-output-result">{output.text}</pre>
                  ) : (
                    <pre className="ce-output-error">{output.text}</pre>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Output ↔ Input panel splitter resizer */}
          <div className="ce-console-splitter" onMouseDown={handleConsoleResizeStart}></div>

          {/* Section 3: Custom Input (Editable textarea) */}
          <div
            className={`ce-terminal-stdin-wrapper ${isResized ? 'resized' : ''}`}
            style={isResized ? { height: `${inputHeight}px` } : {}}
          >
            <div className="ce-stdin-header-inline">
              <i className="fa-solid fa-keyboard"></i>
              <span>Custom Input</span>
            </div>
            <div className="ce-stdin-helper-text">
              Enter values exactly as you would type them in a terminal.
            </div>
            <div
              className={`ce-terminal-input-row ${isHighlighting ? 'ce-highlight-active' : ''}`}
              onAnimationEnd={() => setIsHighlighting(false)}
            >
              <div className="ce-terminal-prompts-column" ref={promptsColumnRef}>
                {stdin.split('\n').map((_, index) => (
                  <div key={index} className="ce-line-prompt">&gt;</div>
                ))}
              </div>
              <textarea
                ref={stdinInputRef}
                className="ce-terminal-stdin"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                onScroll={handleStdinScroll}
                placeholder={"Type your input here...\n\nOne value per line.\n\nExample:\n10\n20"}
                spellCheck={false}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Program Input Required Alert Modal */}
      {showModal && (
        <div className="ce-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="ce-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="ce-modal-title">Program Input Required</h3>
            <p className="ce-modal-message">
              This program requires user input before execution.
              <br /><br />
              Please enter the required values in the Custom Input section and then run the program again.
            </p>
            <div className="ce-modal-actions">
              <button className="ce-modal-btn ce-modal-btn--secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="ce-modal-btn ce-modal-btn--primary" onClick={handleGoToInput}>
                Go to Custom Input
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
