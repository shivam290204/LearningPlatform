import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DataWarehousingVisualizer() {
  const [etlPhase, setEtlPhase] = useState('IDLE'); // 'IDLE', 'EXTRACT', 'TRANSFORM', 'LOAD', 'DONE'
  const [sources, setSources] = useState({
    oltpDb: 'idle', // 'idle', 'extracting', 'done'
    crmApi: 'idle',
    clickLogs: 'idle'
  });
  const [transformationSteps, setTransformationSteps] = useState([]);
  const [warehouseData, setWarehouseData] = useState([]);
  const [log, setLog] = useState('Data Warehouse idle. Click Start ETL Pipeline.');

  const runEtlStep = () => {
    if (etlPhase === 'IDLE') {
      setEtlPhase('EXTRACT');
      setLog('ETL Pipeline: Extracting raw data from heterogeneous transactional sources...');
      setSources({ oltpDb: 'extracting', crmApi: 'extracting', clickLogs: 'extracting' });
      setTimeout(() => {
        setSources({ oltpDb: 'done', crmApi: 'done', clickLogs: 'done' });
        setLog('Extraction complete. Raw records buffer populated. Proceed to Transform stage.');
      }, 1000);
    } else if (etlPhase === 'EXTRACT') {
      setEtlPhase('TRANSFORM');
      setLog('ETL Pipeline: Cleaning and formatting extracted datasets...');
      
      const steps = [
        'Step 1: Parse timestamps to standard ISO-8601 format.',
        'Step 2: Filter out incomplete purchase logs with NULL keys.',
        'Step 3: Join CRM API names with Transactional DB customer IDs.',
        'Step 4: Compute total click counts grouped by User ID.'
      ];

      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setTransformationSteps(prev => [...prev, steps[currentStep]]);
          setLog(`Transforming: ${steps[currentStep]}`);
          currentStep++;
        } else {
          clearInterval(interval);
          setLog('Data transformation complete. Aggregate fact schemas prepared. Ready to LOAD.');
        }
      }, 700);
    } else if (etlPhase === 'TRANSFORM') {
      setEtlPhase('LOAD');
      setLog('ETL Pipeline: Loading transformed schema records into Data Warehouse...');
      setTimeout(() => {
        setWarehouseData([
          { user_id: 101, name: 'Alice', total_spend: 340, click_count: 12 },
          { user_id: 102, name: 'Bob', total_spend: 150, click_count: 5 },
          { user_id: 103, name: 'Charlie', total_spend: 90, click_count: 24 }
        ]);
        setEtlPhase('DONE');
        setLog('ETL Pipeline complete! Clean data persisted into Data Warehouse analytical tables.');
      }, 1200);
    } else if (etlPhase === 'DONE') {
      handleReset();
    }
  };

  const handleReset = () => {
    setEtlPhase('IDLE');
    setSources({ oltpDb: 'idle', crmApi: 'idle', clickLogs: 'idle' });
    setTransformationSteps([]);
    setWarehouseData([]);
    setLog('Pipeline and Warehouse storage reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={runEtlStep}>
        {etlPhase === 'IDLE' && 'Start ETL Pipeline'}
        {etlPhase === 'EXTRACT' && 'Run Transform Step'}
        {etlPhase === 'TRANSFORM' && 'Run Load Step'}
        {etlPhase === 'LOAD' && 'Loading...'}
        {etlPhase === 'DONE' && 'Reset ETL'}
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>ETL Staging Logs</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          height: '110px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.7rem'
        }}>
          {transformationSteps.length === 0 ? (
            <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Transform stage not active yet.</span>
          ) : (
            transformationSteps.map((step, idx) => (
              <div key={idx} style={{ color: '#1591DC' }}>{step}</div>
            ))
          )}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Warehouse Analytics Target</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          height: '110px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.68rem'
        }}>
          {warehouseData.length === 0 ? (
            <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>Warehouse is empty. Run Load step.</span>
          ) : (
            <div>
              <div style={{ fontWeight: 'bold', color: '#1591DC', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.15rem' }}>
                DW_User_Sales_Summary
              </div>
              {warehouseData.map(row => (
                <div key={row.user_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.15rem 0', color: '#FFFFFF' }}>
                  <span>{row.name} ({row.user_id})</span>
                  <span>Spend: ${row.total_spend} | Clicks: {row.click_count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Data Warehouse</strong> is a centralized repository that consolidates data from multiple disparate sources for reporting and analysis:</p>
      <ul>
        <li><strong>Extract:</strong> Reads and ingests data from multiple transactional databases, APIs, CRM platforms, and raw flat logs.</li>
        <li><strong>Transform:</strong> Sanitizes data schemas. This includes resolving data formatting differences (timestamps, currency), handling null entries, deduplicating keys, and calculating aggregates.</li>
        <li><strong>Load:</strong> Persists the structured datasets into the warehouse analytical tables (typically in a Star or Snowflake schema) to optimize business intelligence queries.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Data Warehousing as **creating a curated product catalogue**:</p>
      <ul>
        <li><strong>Extract:</strong> You gather raw items from different local farms (RDBMS), imports (APIs), and home artisans (logs).</li>
        <li><strong>Transform:</strong> You clean off the dirt, throw away rotten items, sort fruits by category, and wrap them in standardized boxes.</li>
        <li><strong>Load:</strong> You place the clean, boxed catalog items neatly onto shelves at the supermarket (Warehouse) for customers to browse.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Streaming ETL without throttling:</strong> Ingesting raw click logs directly into analytical tables without intermediate cleaning, creating dirty aggregate data cells.</li>
      <li><strong>Running ELT on transactional CPUs:</strong> Running heavy transformation queries on the same DB instance supporting live customer payments, causing transaction freezes.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Contrast ETL (Extract-Transform-Load) with ELT (Extract-Load-Transform).',
      a: 'ETL cleans and aggregates data on an external staging server *before* loading it into the warehouse (best for legacy databases or small warehouses). ELT loads raw data directly into a high-powered modern warehouse (e.g. Snowflake) and processes transformations using the warehouse\'s native computing engines (best for big data scale).'
    },
    {
      q: 'What is a staging area in data warehousing?',
      a: 'A staging area is a temporary storage buffer where raw extracted data is placed. This protects operational databases by running intensive transformations in a separate environment rather than directly querying production servers.'
    }
  ];

  const quizQuestions = [
    {
      question: 'In which ETL stage are database records formatted, unified, and joined together?',
      options: [
        'Extract',
        'Transform',
        'Load',
        'Buffer Cache Commit'
      ],
      correctIdx: 1,
      explanation: 'Transform parses data formats, removes invalid row entries, aggregates calculations, and unifies schemas.'
    },
    {
      question: 'Why should you avoid running transform processing queries directly on your primary production RDBMS server?',
      options: [
        'Because it breaks index keys permanently',
        'Because intensive analytics consume CPU/Memory and lock transactional rows, impacting customer operations',
        'Because relational databases cannot run join queries',
        'Because SQL does not support GROUP BY'
      ],
      correctIdx: 1,
      explanation: 'Relational OLTP engines are optimized for short write transactions; heavy analytical sweeps degrade production speed and degrade customer performance.'
    }
  ];

  return (
    <VisualizerShell
      title="Data Warehousing ETL"
      subtitle="Ingest heterogeneous raw databases, clean schemas, and load analytical warehouse summaries."
      timeComplexity="ETL Pipeline: O(N) linear time"
      spaceComplexity="O(N) intermediate staging space"
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
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <svg width="450" height="200" style={{ overflow: 'visible' }}>
            
            {/* STAGE 1: Extract (Show sources and progress) */}
            <g>
              {/* Source A: RDBMS */}
              <rect x="10" y="20" width="80" height="35" rx="3" fill="#000000" stroke={sources.oltpDb === 'done' ? '#1591DC' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" />
              <text x="50" y="35" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">OLTP Database</text>
              <text x="50" y="47" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">Sales Tables</text>

              {/* Source B: CRM API */}
              <rect x="10" y="75" width="80" height="35" rx="3" fill="#000000" stroke={sources.crmApi === 'done' ? '#1591DC' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" />
              <text x="50" y="90" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">CRM API</text>
              <text x="50" y="102" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">User JSON</text>

              {/* Source C: Click Logs */}
              <rect x="10" y="130" width="80" height="35" rx="3" fill="#000000" stroke={sources.clickLogs === 'done' ? '#1591DC' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" />
              <text x="50" y="145" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">WebServer Logs</text>
              <text x="50" y="157" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.38rem">Raw Clicks Text</text>
            </g>

            {/* Connecting lines to Transform Engine */}
            <g>
              <path d="M 90 38 L 170 85" stroke={sources.oltpDb === 'done' ? '#1591DC' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" strokeDasharray={sources.oltpDb === 'extracting' ? '3,3' : '0'} />
              <path d="M 90 92 L 170 92" stroke={sources.crmApi === 'done' ? '#1591DC' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" strokeDasharray={sources.crmApi === 'extracting' ? '3,3' : '0'} />
              <path d="M 90 148 L 170 100" stroke={sources.clickLogs === 'done' ? '#1591DC' : 'rgba(255,255,255,0.2)'} strokeWidth="1.5" strokeDasharray={sources.clickLogs === 'extracting' ? '3,3' : '0'} />
            </g>

            {/* Transform Engine Node */}
            <g>
              <rect 
                x="170" 
                y="65" 
                width="95" 
                height="55" 
                rx="4" 
                fill="#000000" 
                stroke={etlPhase === 'TRANSFORM' ? '#1591DC' : 'rgba(255,255,255,0.4)'} 
                strokeWidth={etlPhase === 'TRANSFORM' ? '2.5' : '1.5'} 
              />
              <text x="217.5" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem" fontWeight="bold">Transform</text>
              <text x="217.5" y="103" textAnchor="middle" fill="#1591DC" fontSize="0.45rem" fontWeight="bold">Staging Area</text>
            </g>

            {/* Loading Arrow */}
            <g>
              <line 
                x1="265" 
                y1="92" 
                x2="325" 
                y2="92" 
                stroke={etlPhase === 'LOAD' || etlPhase === 'DONE' ? '#1591DC' : 'rgba(255,255,255,0.2)'} 
                strokeWidth="2" 
                strokeDasharray={etlPhase === 'LOAD' ? '3,3' : '0'} 
              />
              <polygon 
                points="325,89 331,92 325,95" 
                fill={etlPhase === 'LOAD' || etlPhase === 'DONE' ? '#1591DC' : 'rgba(255,255,255,0.2)'} 
              />
            </g>

            {/* Target: Data Warehouse */}
            <g>
              <rect 
                x="330" 
                y="40" 
                width="110" 
                height="110" 
                rx="6" 
                fill="#000000" 
                stroke={etlPhase === 'DONE' ? '#1591DC' : 'rgba(255,255,255,0.4)'} 
                strokeWidth={etlPhase === 'DONE' ? '2.5' : '1.5'} 
              />
              <text x="385" y="65" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Data Warehouse</text>
              <text x="385" y="80" textAnchor="middle" fill="#1591DC" fontSize="0.45rem" fontWeight="bold">(OLAP storage)</text>
              
              {/* Stacked sheets icon inside warehouse */}
              <rect x="365" y="100" width="40" height="25" fill="none" stroke="rgba(255,255,255,0.5)" rx="2" />
              <line x1="370" y1="108" x2="400" y2="108" stroke="rgba(255,255,255,0.3)" />
              <line x1="370" y1="116" x2="395" y2="116" stroke="rgba(255,255,255,0.3)" />
            </g>

          </svg>
        </div>
      </div>
    </VisualizerShell>
  );
}
