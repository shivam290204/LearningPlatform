import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function QueryOptimizerVisualizer() {
  const [activeStep, setActiveStep] = useState(0); // 0: SQL, 1: Parse AST, 2: Logical, 3: Cost, 4: Physical
  const [pushdownEnabled, setPushdownEnabled] = useState(true);
  const [joinStrategy, setJoinStrategy] = useState('HASH_JOIN'); // 'HASH_JOIN' or 'NESTED_LOOP'
  const [log, setLog] = useState('Optimizer ready. Walk through execution phases.');

  const stepsInfo = [
    { label: '1. SQL Query', desc: 'Raw SQL query string input from client.' },
    { label: '2. Parser & AST', desc: 'Generates abstract syntax parse tree.' },
    { label: '3. Logical Plan', desc: 'Applies rewrite rules like Predicate Pushdown.' },
    { label: '4. Cost Estimator', desc: 'Calculates IO/CPU costs across join paths.' },
    { label: '5. Physical Plan', desc: 'Selects the cheapest join operation.' }
  ];

  const handleNextStep = () => {
    setActiveStep(prev => {
      const next = (prev + 1) % 5;
      if (next === 0) setLog('Query Optimizer reset. Raw SQL input.');
      if (next === 1) setLog('Parser: Validating query syntax. Building AST parse tree nodes.');
      if (next === 2) {
        setLog(pushdownEnabled 
          ? 'Logical Optimizer: Rule applied! Pushed filter "age > 30" down beneath the JOIN node to reduce scanned rows.' 
          : 'Logical Optimizer: Pushing filters disabled. SCAN will read entire tables into JOIN block (less efficient).'
        );
      }
      if (next === 3) {
        setLog(`Cost Estimator: Calculating costs. Hash Join Cost: 150 IOs. Nested Loop Cost: ${joinStrategy === 'HASH_JOIN' ? '450' : '150'} IOs (no index).`);
      }
      if (next === 4) {
        setLog(`Physical Execution: Selected ${joinStrategy === 'HASH_JOIN' ? 'Hash Match Join' : 'Nested Loop Join'} as the physical scan plan.`);
      }
      return next;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
    setLog('Optimizer reset to SQL stage.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={handleNextStep}>
        {activeStep === 4 ? 'Restart Pipeline' : 'Next Optimizer Step'}
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem' }}>
        <input 
          type="checkbox" 
          id="pushdown" 
          checked={pushdownEnabled} 
          onChange={(e) => {
            setPushdownEnabled(e.target.checked);
            setLog(`Logical rule predicate pushdown: ${e.target.checked ? 'Enabled' : 'Disabled'}`);
          }}
        />
        <label htmlFor="pushdown" style={{ color: 'var(--text-secondary)' }}>Predicate Pushdown</label>
      </div>

      <select
        value={joinStrategy}
        onChange={(e) => {
          setJoinStrategy(e.target.value);
          setLog(`Forced Join Option: ${e.target.value === 'HASH_JOIN' ? 'Hash Join' : 'Nested Loop'}`);
        }}
        style={{
          padding: '0.4rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      >
        <option value="HASH_JOIN">Prefer Hash Join</option>
        <option value="NESTED_LOOP">Prefer Nested Loop</option>
      </select>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Logical Optimization Rules</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Predicate Pushdown: <strong style={{ color: '#1591DC' }}>{pushdownEnabled ? 'APPLIED' : 'SKIPPED'}</strong></div>
          <div>Filter Target: <strong style={{ color: '#1591DC' }}>{"Users.age > 30"}</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Estimated Cost Statistics</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Hash Join Cost: <strong style={{ color: '#1591DC' }}>150 IO units</strong></div>
          <div>Nested Loop Cost: <strong style={{ color: '#1591DC' }}>{pushdownEnabled ? '300' : '900'} IO units</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Query Optimizer</strong> translates a declarative SQL query into the most efficient physical execution plan:</p>
      <ul>
        <li><strong>Parser:</strong> Validates SQL syntax and converts the string into an Abstract Syntax Tree (AST).</li>
        <li><strong>Logical Optimizer:</strong> Applies algebraic rewrite rules. For instance, <strong>Predicate Pushdown</strong> pushes filters like <code>age &gt; 30</code> down the tree, scanning fewer rows prior to performing expensive joins.</li>
        <li><strong>Cost Estimator:</strong> Consults catalog database statistics (histograms) to evaluate table size and choose CPU/IO indexes.</li>
        <li><strong>Physical Plan:</strong> Emits physical strategies (e.g. Hash Join, Merge Join, Index Scan).</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Imagine query optimization as **planning a road trip logistics checklist**:</p>
      <ul>
        <li><strong>Unoptimized:</strong> You drive all the way to a distant warehouse, load up 100 packages, bring them back, and then discard 90 packages because they weren't needed.</li>
        <li><strong>Optimized (Predicate Pushdown):</strong> You filter your catalog checklist *before* loading, carrying only the 10 necessary packages across the join pathway.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Outdated Statistics:</strong> Optimizer costs rely on catalog statistics. If statistics are stale, the engine might select an expensive nested loop scan instead of a hash match seek.</li>
      <li><strong>Overriding with Forced Hints:</strong> Forcing specific indexes manually using hints often backfires when table sizes scale or schemas adjust over time.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is Predicate Pushdown?',
      a: 'Predicate Pushdown is a logical query optimization that moves filtering operations (predicates, e.g., WHERE conditions) closer to the data sources. This minimizes disk I/O and intermediate tuple processing before join operations.'
    },
    {
      q: 'Contrast Nested Loop Joins with Hash Joins.',
      a: 'Nested Loop Join compares each row of one table against all rows of the other table (efficient for small datasets or indexed columns). Hash Join builds an in-memory hash table from the smaller table and probes it using the larger table (highly efficient for large, unindexed datasets).'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which optimizer phase is responsible for translating logical operators into physical join algorithms?',
      options: [
        'Lexer Parser',
        'Cost Estimator / Code Generator',
        'Logical Plan Rewriter',
        'Syntax Schema Validator'
      ],
      correctIdx: 1,
      explanation: 'The Cost Estimator calculates resource costs to select the cheapest physical join methods (e.g., Hash Match vs. Index Loop).'
    },
    {
      question: 'How does Predicate Pushdown optimize a JOIN query?',
      options: [
        'It disables secondary indexes to speed up table scans',
        'It filters row records early before they reach the join operator, reducing memory load',
        'It converts inner joins into cross joins',
        'It bypasses the query buffer pool'
      ],
      correctIdx: 1,
      explanation: 'By filtering early, the number of records sent to the join operator is minimized, yielding massive savings in memory and latency.'
    }
  ];

  return (
    <VisualizerShell
      title="Query Optimizer"
      subtitle="Examine parser ASTs, logical predicate re-writes, cost calculations, and physical plans."
      timeComplexity="Logical Rewrite: O(Rules); Join: O(M + N)"
      spaceComplexity="O(AST) heap allocation"
      theoryContent={theory}
      analogyContent={analogy}
      mistakesContent={mistakes}
      interviewQuestions={interviewQuestions}
      quizQuestions={quizQuestions}
      controls={controls}
      logs={[log]}
      stateInspector={stateInspector}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', width: '100%', minHeight: '235px', padding: '1rem 0' }}>
        
        {/* Pipeline Progress Indicator */}
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', padding: '0 0.5rem', maxWidth: '440px', gap: '0.25rem' }}>
          {stepsInfo.map((s, idx) => {
            const isActive = activeStep === idx;
            return (
              <div key={idx} style={{ textAlign: 'center', flex: 1 }}>
                <div style={{
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  padding: '0.25rem 0',
                  color: isActive ? '#1591DC' : 'var(--text-tertiary)',
                  borderBottom: isActive ? '3px solid #1591DC' : '1px solid var(--bg-tertiary)',
                  transition: 'all 0.2s'
                }}>
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Display Canvas Area */}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <svg width="450" height="180" style={{ overflow: 'visible' }}>
            
            {/* STAGE 0: Raw SQL */}
            {activeStep === 0 && (
              <g>
                <rect x="25" y="45" width="400" height="70" fill="#000000" stroke="#1591DC" strokeWidth="2" rx="3" />
                <text x="225" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontFamily="monospace">
                  SELECT * FROM Users JOIN Orders
                </text>
                <text x="225" y="95" textAnchor="middle" fill="#1591DC" fontSize="0.55rem" fontFamily="monospace">
                  ON Users.id = Orders.user_id WHERE Users.age &gt; 30
                </text>
                <text x="225" y="140" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.5rem">
                  Declarative query specifies WHAT data to get, not HOW to retrieve it.
                </text>
              </g>
            )}

            {/* STAGE 1: Parser & AST */}
            {activeStep === 1 && (
              <g>
                {/* Tree Root node */}
                <circle cx="225" cy="30" r="14" fill="#000000" stroke="#FFFFFF" strokeWidth="2" />
                <text x="225" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Select</text>

                <line x1="225" y1="44" x2="165" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <line x1="225" y1="44" x2="285" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

                {/* Left Branch: Join */}
                <circle cx="165" cy="80" r="14" fill="#000000" stroke="#1591DC" strokeWidth="2" />
                <text x="165" y="84" textAnchor="middle" fill="#1591DC" fontSize="0.5rem">Join</text>

                <line x1="165" y1="94" x2="125" y2="120" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <line x1="165" y1="94" x2="205" y2="120" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

                <circle cx="125" cy="130" r="12" fill="#000000" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="125" y="133.5" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Users</text>

                <circle cx="205" cy="130" r="12" fill="#000000" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="205" y="133.5" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Orders</text>

                {/* Right Branch: Filter */}
                <circle cx="285" cy="80" r="14" fill="#000000" stroke="#1591DC" strokeWidth="2" />
                <text x="285" y="84" textAnchor="middle" fill="#1591DC" fontSize="0.5rem">Filter</text>

                <line x1="285" y1="94" x2="285" y2="118" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <circle cx="285" cy="130" r="12" fill="#000000" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x="285" y="133.5" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">age &gt; 30</text>
              </g>
            )}

            {/* STAGE 2: Logical Optimizer */}
            {activeStep === 2 && (
              <g>
                <text x="225" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">
                  Logical Query Plan Representation
                </text>
                
                {pushdownEnabled ? (
                  // Optimized Tree: Filter pushed under join
                  <g>
                    <rect x="180" y="30" width="90" height="20" fill="#000000" stroke="#1591DC" strokeWidth="2" rx="2" />
                    <text x="225" y="43" textAnchor="middle" fill="#1591DC" fontSize="0.45rem">JOIN (id = user_id)</text>

                    <line x1="210" y1="50" x2="160" y2="80" stroke="#FFFFFF" strokeWidth="1.5" />
                    <line x1="240" y1="50" x2="290" y2="80" stroke="#FFFFFF" strokeWidth="1.5" />

                    {/* Filter pushed down to Users side */}
                    <rect x="110" y="80" width="80" height="20" fill="#000000" stroke="#1591DC" strokeWidth="1.5" rx="2" />
                    <text x="150" y="93" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">Filter (age &gt; 30)</text>

                    <line x1="150" y1="100" x2="150" y2="125" stroke="#FFFFFF" strokeWidth="1.2" />
                    <rect x="120" y="125" width="60" height="18" fill="#000000" stroke="#FFFFFF" strokeWidth="1" rx="2" />
                    <text x="150" y="137" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Scan: Users</text>

                    {/* Right side has no filter, direct scan */}
                    <rect x="260" y="80" width="70" height="20" fill="#000000" stroke="#FFFFFF" strokeWidth="1" rx="2" />
                    <text x="295" y="93" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Scan: Orders</text>

                    <text x="225" y="165" textAnchor="middle" fill="#1591DC" fontSize="0.48rem">
                      Filter applied BEFORE join: reduces tuples fed to join operator.
                    </text>
                  </g>
                ) : (
                  // Unoptimized Tree: Filter above Join
                  <g>
                    <rect x="180" y="30" width="90" height="20" fill="#000000" stroke="#FFFFFF" strokeWidth="1.5" rx="2" />
                    <text x="225" y="43" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Filter (age &gt; 30)</text>

                    <line x1="225" y1="50" x2="225" y2="75" stroke="#FFFFFF" strokeWidth="1.5" />

                    <rect x="180" y="75" width="90" height="20" fill="#000000" stroke="#1591DC" strokeWidth="2" rx="2" />
                    <text x="225" y="88" textAnchor="middle" fill="#1591DC" fontSize="0.45rem">JOIN (id = user_id)</text>

                    <line x1="210" y1="95" x2="150" y2="125" stroke="#FFFFFF" strokeWidth="1.5" />
                    <line x1="240" y1="95" x2="300" y2="125" stroke="#FFFFFF" strokeWidth="1.5" />

                    <rect x="120" y="125" width="60" height="18" fill="#000000" stroke="#FFFFFF" strokeWidth="1" rx="2" />
                    <text x="150" y="137" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Scan: Users</text>

                    <rect x="270" y="125" width="60" height="18" fill="#000000" stroke="#FFFFFF" strokeWidth="1" rx="2" />
                    <text x="300" y="137" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Scan: Orders</text>

                    <text x="225" y="165" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="0.48rem">
                      Join operates on raw tables first, then filters output (wasteful).
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* STAGE 3: Cost Estimator */}
            {activeStep === 3 && (
              <g>
                <text x="225" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">
                  Evaluating CPU / IO Plan Costs
                </text>

                {/* Strategy A: Hash Join */}
                <rect x="40" y="35" width="150" height="85" fill="#000000" stroke="#1591DC" strokeWidth="2" rx="3" />
                <text x="115" y="52" textAnchor="middle" fill="#1591DC" fontSize="0.5rem" fontWeight="bold">Strategy A: Hash Join</text>
                <text x="115" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="0.42rem">Memory build: Users</text>
                <text x="115" y="85" textAnchor="middle" fill="#FFFFFF" fontSize="0.42rem">Probe: Orders table</text>
                <text x="115" y="105" textAnchor="middle" fill="#1591DC" fontSize="0.5rem" fontWeight="bold">Est. Cost: 150 IOs</text>

                {/* Strategy B: Nested Loop */}
                <rect x="260" y="35" width="150" height="85" fill="#000000" stroke="rgba(255,255,255,0.4)" strokeWidth="1" rx="3" />
                <text x="335" y="52" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.5rem" fontWeight="bold">Strategy B: Nested Loop</text>
                <text x="335" y="70" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.42rem">For each outer row Users</text>
                <text x="335" y="85" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.42rem">Scan inner rows Orders</text>
                <text x="335" y="105" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">
                  Cost: {pushdownEnabled ? '300' : '900'} IOs
                </text>

                <text x="225" y="155" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.48rem">
                  Optimizer selects the plan with the lowest estimated execution cost.
                </text>
              </g>
            )}

            {/* STAGE 4: Physical Execution Plan */}
            {activeStep === 4 && (
              <g>
                <text x="225" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">
                  Final Selected Plan: {joinStrategy === 'HASH_JOIN' ? 'Hash Join' : 'Nested Loop'}
                </text>

                {joinStrategy === 'HASH_JOIN' ? (
                  // Hash Join Simulation
                  <g>
                    <rect x="30" y="35" width="100" height="75" fill="#000000" stroke="#1591DC" strokeWidth="1.5" rx="3" />
                    <text x="80" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem" fontWeight="bold">Build Phase</text>
                    <text x="80" y="70" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.4rem">Build Hash Table</text>
                    <text x="80" y="85" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.4rem">of filtered Users</text>

                    <line x1="130" y1="72" x2="185" y2="72" stroke="#1591DC" strokeWidth="1.5" strokeDasharray="3,3" />
                    <polygon points="185,69 191,72 185,75" fill="#1591DC" />

                    <rect x="185" y="35" width="80" height="75" fill="#000000" stroke="#FFFFFF" strokeWidth="1.5" rx="3" />
                    <text x="225" y="55" textAnchor="middle" fill="#1591DC" fontSize="0.5rem" fontWeight="bold">Hash Match</text>
                    <text x="225" y="75" textAnchor="middle" fill="#FFFFFF" fontSize="0.42rem">Probe bucket</text>
                    <text x="225" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="0.42rem">with Orders</text>

                    <rect x="310" y="35" width="110" height="75" fill="#000000" stroke="#1591DC" strokeWidth="1.5" rx="3" />
                    <text x="365" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">Probe stream</text>
                    <text x="365" y="70" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.4rem">Direct key scans</text>
                    <text x="365" y="85" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.4rem">O(M+N) complexity</text>
                  </g>
                ) : (
                  // Nested Loop Simulation
                  <g>
                    <rect x="40" y="35" width="130" height="75" fill="#000000" stroke="#FFFFFF" strokeWidth="1.5" rx="3" />
                    <text x="105" y="50" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">Outer Table: Users</text>
                    <text x="105" y="70" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.4rem">Scan each row (i)</text>
                    <text x="105" y="85" textAnchor="middle" fill="#1591DC" fontSize="0.4rem">Row age &gt; 30</text>

                    <line x1="170" y1="72" x2="250" y2="72" stroke="#FFFFFF" strokeWidth="1.5" />
                    <polygon points="250,69 256,72 250,75" fill="#FFFFFF" />

                    <rect x="250" y="35" width="130" height="75" fill="#000000" stroke="#1591DC" strokeWidth="1.5" rx="3" />
                    <text x="315" y="50" textAnchor="middle" fill="#1591DC" fontSize="0.45rem" fontWeight="bold">Inner Table: Orders</text>
                    <text x="315" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">Full match search (j)</text>
                    <text x="315" y="85" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.4rem">O(M * N) iterations</text>
                  </g>
                )}
                
                <text x="225" y="150" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.48rem">
                  The plan compiler generates actual executor bytecode based on these nodes.
                </text>
              </g>
            )}

          </svg>
        </div>
      </div>
    </VisualizerShell>
  );
}
