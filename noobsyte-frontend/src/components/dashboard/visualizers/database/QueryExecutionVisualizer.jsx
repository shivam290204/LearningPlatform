import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function QueryExecutionVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const steps = [
    {
      log: 'Step 0: Ready to execute query: SELECT * FROM Users WHERE age > 18.',
      activeStage: null,
      details: 'Click Execute Query to trace the SQL engines execution phases.'
    },
    {
      log: 'Step 1 [Parser]: Analyzing query syntax, validating tokens, and building Abstract Syntax Tree (AST).',
      activeStage: 'Parser',
      details: 'Checking system catalog schemas: Does table "Users" exist? Does column "age" exist? Type check verified.'
    },
    {
      log: 'Step 2 [Optimizer]: Query optimization. Analyzing statistical histograms, rewriting query, and evaluating scan costs.',
      activeStage: 'Optimizer',
      details: 'Comparing cost metrics: Seq Scan vs Index Scan. Decided to utilize Index on "age" because selective range is narrow.'
    },
    {
      log: 'Step 3 [Plan Compiler]: Generating physical and logical Execution Plan tree structures.',
      activeStage: 'ExecutionPlan',
      details: 'Plan: [Index Scan ON idx_users_age] -> [Filter: age > 18] -> [Project].'
    },
    {
      log: 'Step 4 [Index Selection]: Accessing B+ Tree index idx_users_age to collect page address references.',
      activeStage: 'IndexSelection',
      details: 'Traversing tree levels to locate first key satisfying condition: age > 18. Collected physical record pointers.'
    },
    {
      log: 'Step 5 [Result Retrieval]: Reading data blocks from heap pages. Filtering records and returning result sets.',
      activeStage: 'ResultRetrieval',
      details: 'Loaded target heap pages from disk to memory buffer pool. Returned JSON matching tuples (HTTP 200 OK).'
    }
  ];

  const handleStartQuery = () => {
    setIsPlaying(true);
    setCurrentStep(1);
  };

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, speed]);

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const activeStep = steps[currentStep] || steps[0];

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={handleStartQuery} disabled={isPlaying}>
        Execute Query
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Stage Inspector Details</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Active Phase: <strong style={{ color: '#1591DC' }}>{activeStep.activeStage || 'IDLE'}</strong></div>
          <div style={{ marginTop: '0.35rem', color: '#FFFFFF' }}>{activeStep.details}</div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>When you submit an SQL query, the database execution engine executes a series of pipeline stages to return data:</p>
      <ul>
        <li><strong>Parser:</strong> Converts raw text query string into a structured Abstract Syntax Tree (AST). It performs lexical, syntactic, and semantic validation checks.</li>
        <li><strong>Optimizer:</strong> The "brain" of the database. It rewritten queries, estimates execution costs (I/O, CPU) using data statistics/histograms, and selects the fastest access path (Index Seek vs Seq Scan).</li>
        <li><strong>Execution Plan:</strong> Generates a tree of execution nodes (physical operators like Hash Joins, Index Scans).</li>
        <li><strong>Result Retrieval:</strong> The storage engine fetches physical database blocks from disk/buffer pool, filters records, and streams results to the client.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Query Execution as **ordering a meal at a restaurant**:</p>
      <ul>
        <li><strong>Parser (Waiter):</strong> Reads your order. Makes sure the menu items exist and writes them down on a ticket (AST).</li>
        <li><strong>Optimizer (Head Chef):</strong> Reviews the ticket. Decides the fastest way to prepare the dish (e.g. should they bake the potato or microwave it?).</li>
        <li><strong>Execution Plan (Recipe Steps):</strong> Chopping vegetables, grilling steak, plating.</li>
        <li><strong>Result Retrieval (Serving):</strong> Placing the finished food on a plate and delivering it to your table.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Outdated Stats:</strong> If you perform massive writes without rebuilding column statistics, the Query Optimizer will think a table is tiny and choose a full table scan instead of using a fast index.</li>
      <li><strong>SQL Injection:</strong> Executing raw concatenated query strings, bypassing the Parser validation and allowing malicious users to execute arbitrary SQL commands. Use parameterized queries instead.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Detail the role of the Query Optimizer in databases.',
      a: 'The Query Optimizer takes the parsed AST, evaluates multiple equivalent execution plans, calculates the estimated disk I/O and CPU cost of each using statistical histograms, and selects the plan with the lowest estimated cost.'
    },
    {
      q: 'What is the N+1 query problem and how does it relate to query engines?',
      a: 'The N+1 query problem occurs when code executes one query to fetch parent records, and then issues a separate query for each child record. It is highly inefficient because it bypasses optimizer batching and incurs significant database roundtrip network overhead.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which component translates raw SQL string text into an Abstract Syntax Tree?',
      options: [
        'Optimizer',
        'Parser / Lexer',
        'Storage Engine',
        'Buffer Pool Manager'
      ],
      correctIdx: 1,
      explanation: 'The Parser validates syntactic tokens and converts raw SQL strings into structured AST trees.'
    },
    {
      question: 'What statistical data does a query optimizer use to estimate access costs?',
      options: [
        'CPU temperature log',
        'Table row counts and data distribution histograms',
        'File extension types',
        'Database connections pool size'
      ],
      correctIdx: 1,
      explanation: 'The optimizer utilizes database histograms to estimate how many rows satisfy conditions, determining whether using an index is cost-effective.'
    }
  ];

  return (
    <VisualizerShell
      title="SQL Query Execution Pipeline"
      subtitle="Trace how SQL queries flow through Parsing, Optimization, and physical Execution Plan retrieval stages."
      timeComplexity="O(P + O) optimization overhead"
      spaceComplexity="O(AST) compile space"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[activeStep.log]}
      stateInspector={stateInspector}
      playbackProps={{
        play: () => setIsPlaying(true),
        pause: () => setIsPlaying(false),
        stepForward: handleStepForward,
        stepBackward: handleStepBackward,
        reset: handleReset,
        isPlaying,
        speed,
        setSpeed,
        currentStep,
        totalSteps: steps.length
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '235px', padding: '1rem 0' }}>
        <svg width="450" height="150" style={{ overflow: 'visible' }}>
          {/* Connector Pipeline line */}
          <line x1="30" y1="75" x2="420" y2="75" stroke="var(--bg-tertiary)" strokeWidth="4" />
          
          {/* Step Packet Marker */}
          {currentStep > 0 && (
            <circle
              cx={30 + (currentStep - 1) * 78}
              cy="75"
              r="8"
              fill="#FFFFFF"
              stroke="#1591DC"
              strokeWidth="3"
              style={{ transition: 'all 0.35s ease' }}
            />
          )}

          {/* Stage Blocks */}
          {[
            { name: 'Parser', x: 30 },
            { name: 'Optimizer', x: 108 },
            { name: 'Execution Plan', x: 186 },
            { name: 'Index Selection', x: 264 },
            { name: 'Result Retrieval', x: 342 }
          ].map((stage, idx) => {
            const isActive = activeStep.activeStage === stage.name;
            return (
              <g key={stage.name}>
                <rect
                  x={stage.x - 28}
                  y="45"
                  width="56"
                  height="18"
                  fill="#000000"
                  stroke={isActive ? '#1591DC' : 'var(--bg-tertiary)'}
                  strokeWidth={isActive ? '2.5' : '1.5'}
                  rx="2"
                />
                <text x={stage.x} y="56" textAnchor="middle" fill={isActive ? '#1591DC' : '#FFFFFF'} fontSize="0.32rem" fontWeight="bold">
                  {stage.name}
                </text>
              </g>
            );
          })}

          {/* Input SQL Query Box */}
          <g>
            <rect x="30" y="105" width="180" height="30" fill="#000000" stroke="#1591DC" strokeWidth="1.5" rx="3" />
            <text x="120" y="123" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontFamily="monospace">
              SELECT * FROM Users WHERE age &gt; 18
            </text>
          </g>

          {/* Output Result Box */}
          <g>
            <rect x="240" y="105" width="180" height="30" fill="#000000" stroke={currentStep === 5 ? '#FFFFFF' : 'var(--bg-tertiary)'} strokeWidth="1.5" rx="3" />
            <text x="330" y="123" textAnchor="middle" fill={currentStep === 5 ? '#1591DC' : 'var(--text-tertiary)'} fontSize="0.45rem" fontFamily="monospace">
              {currentStep === 5 ? 'Result Set: [ {id: 2, name: "Bob"...} ]' : 'Output Result Pending'}
            </text>
          </g>
        </svg>
      </div>
    </VisualizerShell>
  );
}
