import React, { useState, useEffect } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function MongoAggregationVisualizer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1200);

  const initialDocs = [
    { id: 1, item: 'A', qty: 10, status: 'A' },
    { id: 2, item: 'B', qty: 5, status: 'B' },
    { id: 3, item: 'A', qty: 20, status: 'A' },
    { id: 4, item: 'C', qty: 15, status: 'A' }
  ];

  const steps = [
    {
      log: 'Stage 0: Input Collection loaded. 4 raw document records ready.',
      stage: 'INPUT',
      docs: initialDocs,
      details: 'Click Run Pipeline to trace document transformation stages.'
    },
    {
      log: 'Stage 1 [$match]: Filtering documents where status == "A". Wiped out record ID 2.',
      stage: '$match',
      docs: [
        { id: 1, item: 'A', qty: 10, status: 'A' },
        { id: 3, item: 'A', qty: 20, status: 'A' },
        { id: 4, item: 'C', qty: 15, status: 'A' }
      ],
      details: 'Query condition: { status: "A" }. Remaining: 3 documents.'
    },
    {
      log: 'Stage 2 [$group]: Grouping by item field and accumulating sum of qty.',
      stage: '$group',
      docs: [
        { id: 'A', totalQty: 30 },
        { id: 'C', totalQty: 15 }
      ],
      details: 'Accumulator query: { _id: "$item", totalQty: { $sum: "$qty" } }. Remaining: 2 documents.'
    },
    {
      log: 'Stage 3 [$sort]: Sorting documents in descending order of totalQty.',
      stage: '$sort',
      docs: [
        { id: 'A', totalQty: 30 },
        { id: 'C', totalQty: 15 }
      ],
      details: 'Sort query: { totalQty: -1 } (highest totalQty first).'
    },
    {
      log: 'Stage 4 [$project]: Reshaping key schemas to output capitalized fields.',
      stage: '$project',
      docs: [
        { ITEM: 'A', TOTAL: 30 },
        { ITEM: 'C', TOTAL: 15 }
      ],
      details: 'Project configuration: { ITEM: "$_id", TOTAL: "$totalQty", _id: 0 }.'
    }
  ];

  const handleStartPipeline = () => {
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
      <button className="btn-viz-action btn-add" onClick={handleStartPipeline} disabled={isPlaying}>
        Run Aggregation Pipeline
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Pipeline Step Information</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.75rem'
        }}>
          <div>Active Stage: <strong style={{ color: '#1591DC' }}>{activeStep.stage}</strong></div>
          <div style={{ marginTop: '0.25rem', color: '#FFFFFF' }}>{activeStep.details}</div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Active Document Stream List</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.7rem',
          maxHeight: '90px',
          overflowY: 'auto'
        }}>
          {activeStep.docs.map((doc, idx) => (
            <div key={idx} style={{ marginBottom: '0.2rem' }}>
              {JSON.stringify(doc)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>The <strong>MongoDB Aggregation Pipeline</strong> is a framework for data aggregation modeled on the concept of data processing pipelines:</p>
      <ul>
        <li><strong>Pipeline Stages:</strong> Documents enter a multi-stage pipeline that transforms the documents into aggregated results.</li>
        <li><strong>Common Operators:</strong>
          <ul>
            <li><code>$match</code>: Filters documents to reduce payload early in the stream.</li>
            <li><code>$group</code>: Groups input documents by a specified identifier key and performs accumulative mathematics (sum, average, count).</li>
            <li><code>$sort</code>: Reorders the document stream sequence.</li>
            <li><code>$project</code>: Reshapes columns by adding, renaming, or excluding keys.</li>
          </ul>
        </li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of the Aggregation Pipeline as **a dynamic assembly line in a juice factory**:</p>
      <ul>
        <li><strong>Input:</strong> Crate of raw mixed fruits (apples, oranges, bad fruit).</li>
        <li><strong>$match (Sorter):</strong> Throw away any bad fruit or leaves.</li>
        <li><strong>$group (Juicer):</strong> Squeeze all oranges together and all apples together into separate jugs.</li>
        <li><strong>$sort (Packer):</strong> Arrange jugs by volume size (largest first).</li>
        <li><strong>$project (Labeler):</strong> Apply a custom sticker tag to each jug.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Poor Stage Ordering:</strong> Placing `$group` or `$project` before `$match`. This forces the database to group/reshape millions of documents that are subsequently filtered out. Always filter early!</li>
      <li><strong>Missing Indexing Support:</strong> If `$match` is not placed at the very start of the pipeline, MongoDB cannot utilize indexes to optimize the document fetch.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Explain the optimization benefit of placing $match at the beginning of an aggregation pipeline.',
      a: 'Placing `$match` at the start allows MongoDB to utilize indexes on query filters to restrict the dataset size early, preventing expensive memory heap scans in later stages (like `$group` or `$sort`).'
    },
    {
      q: 'What is the memory limit for pipeline stages in MongoDB and how can it be bypassed?',
      a: 'By default, pipeline stages have a memory limit of 100MB. If a stage (like `$sort` or `$group`) exceeds this, MongoDB throws an error. It can be bypassed by setting `{ allowDiskUse: true }` in the query configuration.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which aggregation pipeline stage is used to restrict the document stream to matching criteria?',
      options: [
        '$project',
        '$match',
        '$group',
        '$limit'
      ],
      correctIdx: 1,
      explanation: '`$match` filters documents early in the pipeline, acting like an SQL WHERE clause.'
    },
    {
      question: 'Which stage should ideally be placed first in a pipeline to optimize index traversal?',
      options: [
        '$sort',
        '$project',
        '$match',
        '$group'
      ],
      correctIdx: 2,
      explanation: 'Placing `$match` first allows MongoDB to use indexes to select documents, drastically reducing execution time.'
    }
  ];

  return (
    <VisualizerShell
      title="MongoDB Aggregation Pipeline"
      subtitle="Watch document streams traverse match, group, sort, and project pipeline stages sequentially."
      timeComplexity="O(N) document scan"
      spaceComplexity="Max 100MB RAM limit"
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
              cx={30 + (currentStep - 1) * 98}
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
            { name: '$match', x: 30 },
            { name: '$group', x: 128 },
            { name: '$sort', x: 226 },
            { name: '$project', x: 324 },
            { name: 'OUTPUT', x: 422 }
          ].map((stage, idx) => {
            const isActive = activeStep.stage === stage.name || (stage.name === 'OUTPUT' && currentStep === 4);
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
                <text x={stage.x} y="56" textAnchor="middle" fill={isActive ? '#1591DC' : '#FFFFFF'} fontSize="0.35rem" fontWeight="bold">
                  {stage.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </VisualizerShell>
  );
}
