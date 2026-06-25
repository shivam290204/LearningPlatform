import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { runCodeAPI } from '../../services/compilerService';
import './CodeEditor.css';

const LANGUAGES = [
  { id: 'python',     label: 'Python',     monacoId: 'python',     filename: 'main.py',   judge0Id: 71 },
  { id: 'javascript', label: 'JavaScript', monacoId: 'javascript', filename: 'index.js',  judge0Id: 63 },
  { id: 'java',       label: 'Java',       monacoId: 'java',       filename: 'Main.java', judge0Id: 62 },
  { id: 'c',          label: 'C',          monacoId: 'c',          filename: 'main.c',    judge0Id: 50 },
  { id: 'cpp',        label: 'C++',        monacoId: 'cpp',        filename: 'main.cpp',  judge0Id: 54 },
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
  const [selectedLang, setSelectedLang] = useState('python');
  const [code, setCode]                 = useState(DEFAULT_CODE.python);
  const [output, setOutput]             = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [stdin, setStdin]               = useState('');
  const [inputOpen, setInputOpen]       = useState(false);

  const dropdownRef = useRef(null);
  const currentLang = LANGUAGES.find((l) => l.id === selectedLang);

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

  const handleLangSelect = (langId) => {
    setSelectedLang(langId);
    setCode(DEFAULT_CODE[langId]);
    setOutput(null);
    setStdin('');
    setDropdownOpen(false);
  };

  const handleRunCode = async () => {
    try {
      setOutput({ type: 'pending' });

      const response = await runCodeAPI(code, currentLang.judge0Id, stdin);

      console.log("Compiler Response:", response);

      if (response.success) {
        if (response.compile_output) {
          setOutput({ type: 'error', text: response.compile_output });
        } else if (response.stderr) {
          setOutput({ type: 'error', text: response.stderr });
        } else if (response.output) {
          setOutput({ type: 'result', text: response.output });
        } else {
          setOutput({ type: 'result', text: 'Program finished with no output' });
        }
      } else {
        setOutput({ type: 'error', text: response.message || 'Execution failed' });
      }
    } catch (error) {
      setOutput({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Execution failed',
      });
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleResetCode = () => {
    setCode('');
    setStdin('');
    setOutput(null);
  };

  const handleClearOutput = () => setOutput(null);

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

        {/* Right: action buttons */}
        <div className="ce-topbar-right">
          <button className="ce-action-btn" onClick={handleCopyCode} title="Copy code">
            <i className={`fa-solid ${copyFeedback ? 'fa-check' : 'fa-copy'}`}></i>
            {copyFeedback ? 'Copied' : 'Copy'}
          </button>
          <button className="ce-action-btn" onClick={handleResetCode} title="Reset to default">
            <i className="fa-solid fa-rotate-left"></i>
            Reset
          </button>
          <button className="ce-run-btn" id="ce-run-btn" onClick={handleRunCode}>
            <i className="fa-solid fa-play"></i>
            Run
          </button>
        </div>

      </div>

      {/* ── Workspace (editor | output) ── */}
      <div className="ce-workspace">

        {/* Editor */}
        <div className="ce-editor-pane">
          <Editor
            height="100%"
            language={currentLang.monacoId}
            value={code}
            onChange={(val) => setCode(val || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
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
            }}
          />
        </div>

        {/* Output */}
        <div className="ce-output-pane">
          <div className="ce-output-topbar">
            <div className="ce-output-label">
              <i className="fa-solid fa-terminal"></i>
              <span>Console</span>
            </div>
            <div className="ce-output-topbar-actions">
              <button
                className={`ce-input-toggle ${inputOpen ? 'active' : ''}`}
                onClick={() => setInputOpen((o) => !o)}
                title="Toggle custom input"
              >
                <i className="fa-solid fa-keyboard"></i>
                <span>Input</span>
              </button>
              {output !== null && (
                <button className="ce-clear-btn" onClick={handleClearOutput} title="Clear">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>
          </div>

          {/* Custom Input Collapsible */}
          {inputOpen && (
            <div className="ce-stdin-section">
              <div className="ce-stdin-header">
                <span className="ce-stdin-label">Custom Input</span>
              </div>
              <textarea
                className="ce-stdin-textarea"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter input values here (one per line)..."
                spellCheck={false}
              />
            </div>
          )}

          <div className="ce-output-body">
            {output === null && (
              <div className="ce-output-idle">
                <div className="ce-output-idle-prompt">
                  <span className="ce-prompt-symbol">&gt;_</span>
                </div>
                <p className="ce-output-idle-text">Click <strong>Run</strong> to start</p>
              </div>
            )}
            {output?.type === 'pending' && (
              <div className="ce-output-running">
                <div className="ce-spinner"></div>
                <span>Running…</span>
              </div>
            )}
            {output?.type === 'result' && (
              <pre className="ce-output-result">{output.text}</pre>
            )}
            {output?.type === 'error' && (
              <pre className="ce-output-error">{output.text}</pre>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
