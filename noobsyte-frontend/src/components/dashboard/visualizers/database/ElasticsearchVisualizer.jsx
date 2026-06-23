import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function ElasticsearchVisualizer() {
  const [documents, setDocuments] = useState([
    { id: 1, text: 'Database indexes speed queries.' },
    { id: 2, text: 'Indexing database tables helps performance.' }
  ]);

  const [invertedIndex, setInvertedIndex] = useState({
    database: [1, 2],
    index: [1, 2],
    speed: [1],
    query: [1],
    table: [2],
    help: [2],
    performance: [2]
  });

  const [newDocText, setNewDocText] = useState('');
  const [searchQuery, setSearchQuery] = useState('index');
  const [searchResults, setSearchResults] = useState([]);
  const [activeAnalysisStep, setActiveAnalysisStep] = useState(0); // 0: Raw, 1: Tokens, 2: Lowercase, 3: Stopwords, 4: Stemming
  const [sampleText] = useState('Indexing database tables!');
  const [log, setLog] = useState('Inverted Index active. Try searching for "database" or "performance".');

  // Simple Analyzer Simulation
  const getAnalysisTokens = (step) => {
    const raw = sampleText;
    if (step === 0) return [raw];
    const tokens = raw.replace(/[!]/g, '').split(' ');
    if (step === 1) return tokens;
    const lower = tokens.map(t => t.toLowerCase());
    if (step === 2) return lower;
    const stopwords = ['the', 'is', 'at', 'on', 'and', 'for', 'with', 'a', 'an'];
    const filtered = lower.filter(t => !stopwords.includes(t));
    if (step === 3) return filtered;
    // Simple stemming rules: ing -> null, s -> null
    const stemmed = filtered.map(t => {
      if (t.endsWith('ing')) return t.substring(0, t.length - 3);
      if (t.endsWith('s')) return t.substring(0, t.length - 1);
      return t;
    });
    return stemmed;
  };

  const handleSearch = () => {
    const term = searchQuery.toLowerCase().trim();
    const hits = invertedIndex[term];

    if (hits && hits.length > 0) {
      setSearchResults(hits);
      setLog(`[Search Complete] Term "${term}" matches Document IDs: [${hits.join(', ')}]. Returned results instantly in O(1) term posting lookup!`);
    } else {
      setSearchResults([]);
      setLog(`[Search Complete] Term "${term}" not found in Inverted Index. Zero results.`);
    }
  };

  const addDocument = () => {
    if (!newDocText.trim()) return;
    const nextId = documents.length + 1;
    const cleanText = newDocText.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    const tokens = cleanText.toLowerCase().split(/\s+/);
    
    // Stopwords filter
    const stopwords = ['helps', 'and', 'the', 'a', 'is', 'on', 'at'];
    const filtered = tokens.filter(t => !stopwords.includes(t));
    
    // Stemming
    const stemmed = filtered.map(t => {
      if (t.endsWith('ing')) return t.substring(0, t.length - 3);
      if (t.endsWith('es')) return t.substring(0, t.length - 2);
      if (t.endsWith('s') && !t.endsWith('ss')) return t.substring(0, t.length - 1);
      return t;
    });

    const updatedDocs = [...documents, { id: nextId, text: newDocText }];
    setDocuments(updatedDocs);

    // Update Index
    const newIndex = { ...invertedIndex };
    stemmed.forEach(term => {
      if (term.trim().length > 0) {
        if (!newIndex[term]) {
          newIndex[term] = [];
        }
        if (!newIndex[term].includes(nextId)) {
          newIndex[term].push(nextId);
        }
      }
    });

    setInvertedIndex(newIndex);
    setNewDocText('');
    setLog(`[Index Update] Document ID ${nextId} ingested. Text analyzed, tokens mapped to Inverted Index.`);
  };

  const handleReset = () => {
    setDocuments([
      { id: 1, text: 'Database indexes speed queries.' },
      { id: 2, text: 'Indexing database tables helps performance.' }
    ]);
    setInvertedIndex({
      database: [1, 2],
      index: [1, 2],
      speed: [1],
      query: [1],
      table: [2],
      help: [2],
      performance: [2]
    });
    setNewDocText('');
    setSearchQuery('index');
    setSearchResults([]);
    setActiveAnalysisStep(0);
    setLog('Simulator reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <input
        type="text"
        placeholder="Search term (e.g. index)..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: '0.35rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem'
        }}
      />
      <button className="btn-viz-action btn-add" onClick={handleSearch}>
        Search term
      </button>

      <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>|</span>

      <input
        type="text"
        placeholder="Add raw text doc..."
        value={newDocText}
        onChange={(e) => setNewDocText(e.target.value)}
        style={{
          padding: '0.35rem',
          borderRadius: '4px',
          border: '1px solid var(--bg-tertiary)',
          backgroundColor: 'var(--bg-primary)',
          color: '#FFFFFF',
          fontSize: '0.85rem',
          minWidth: '150px'
        }}
      />
      <button className="btn-viz-action btn-add" onClick={addDocument}>
        Ingest Doc
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Text Analysis Stages (Sample: "{sampleText}")</span>
        <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
          {['1. Raw', '2. Tokenize', '3. Case', '4. Filter', '5. Stem'].map((label, idx) => (
            <button
              key={idx}
              onClick={() => setActiveAnalysisStep(idx)}
              style={{
                fontSize: '0.62rem',
                padding: '0.15rem 0.35rem',
                border: activeAnalysisStep === idx ? '1px solid #1591DC' : '1px solid var(--bg-tertiary)',
                backgroundColor: activeAnalysisStep === idx ? 'rgba(21, 145, 220, 0.1)' : 'none',
                color: activeAnalysisStep === idx ? '#1591DC' : 'var(--text-secondary)',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem',
          minHeight: '40px'
        }}>
          <div>Output: <strong style={{ color: '#1591DC' }}>{JSON.stringify(getAnalysisTokens(activeAnalysisStep))}</strong></div>
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Search Matches</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          {searchResults.length === 0 ? (
            <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>No search query executed or zero hits.</span>
          ) : (
            <div>
              <div style={{ color: '#1591DC', fontWeight: 'bold' }}>Matched Documents:</div>
              {searchResults.map(id => (
                <div key={id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.15rem 0', color: '#FFFFFF' }}>
                  • Doc ID {id}: "{documents.find(d => d.id === id)?.text}"
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
      <p>An <strong>Inverted Index</strong> is the core data structure of search engines like Elasticsearch. It maps individual words to the documents they appear in:</p>
      <ul>
        <li><strong>Document Analyzer:</strong> Before indexing, text runs through a pipeline:
          <ol>
            <li><strong>Tokenization:</strong> Splits sentences into distinct words.</li>
            <li><strong>Lowercasing:</strong> Removes case differences (e.g. `Database` to `database`).</li>
            <li><strong>Stopword Removal:</strong> Removes common words (`the`, `a`, `is`) that add no search value.</li>
            <li><strong>Stemming:</strong> Reductively unifies word suffixes (e.g. `running`, `runs` to `run`) using algorithms like Porter Stemmer.</li>
          </ol>
        </li>
        <li><strong>Inverted Index:</strong> A dictionary where terms are hash keys mapped to array lists of matched Doc IDs (postings lists), yielding O(1) query speeds.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of an Inverted Index as **the index section at the back of a textbook**:</p>
      <ul>
        <li>Instead of reading the entire book page-by-page to find where "polymorphism" is mentioned, you look at the alphabetical index page in the back. You find "polymorphism" (Term) and see page numbers `[12, 45, 87]` (Document Postings List). You flip directly to page 45.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Index Bloat:</strong> Storing un-stemmed or un-filtered raw text, forcing the dictionary index to store thousands of unique grammatical variations (`index`, `indexing`, `indexed`) separate, slowing searches.</li>
      <li><strong>No Stopword Filtering:</strong> Indexing filler words like "the" which matches every document, creating huge postings lists that consume massive RAM.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'What is an Inverted Index?',
      a: 'An Inverted Index is a database index structure that maps terms (words) to their locations of occurrence in a collection of documents (postings lists). This structure enables full-text searches in constant lookup time O(1).'
    },
    {
      q: 'Why are stemming and tokenization critical during indexing?',
      a: 'They normalize grammatical variations to their root forms, ensuring that searching for "run" matches documents containing "running", "ran", or "runs", while keeping the index vocabulary size small and performant.'
    }
  ];

  const quizQuestions = [
    {
      question: 'Which analyzer stage unifies variations of the same root word (e.g. "writing", "writes" into "write")?',
      options: [
        'Stopword filtering',
        'Stemming',
        'Tokenization',
        'Recursive Parsing'
      ],
      correctIdx: 1,
      explanation: 'Stemming trims word suffixes to map grammatical variations back to a single root term.'
    },
    {
      question: 'What is the time complexity of looking up matched document IDs for a word inside a pre-built Inverted Index hash?',
      options: [
        'O(1)',
        'O(log N)',
        'O(N)',
        'O(N log N)'
      ],
      correctIdx: 0,
      explanation: 'Because terms map to postings lists inside a hash table, looking up a key occurs in constant time O(1).'
    }
  ];

  return (
    <VisualizerShell
      title="Elasticsearch Indexing"
      subtitle="Analyze text documents through tokenization, lowercasing, stopword, and stemming pipelines."
      timeComplexity="Index Ingestion: O(Tokens); Search: O(1) lookup"
      spaceComplexity="O(Vocabulary + Postings) dictionary allocation"
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', width: '100%' }} className="visualizer-grid-layout">
          
          {/* Ingested Documents List */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
              Ingested Documents Collection
            </span>
            <div style={{
              border: '1.5px solid var(--bg-tertiary)',
              borderRadius: '6px',
              backgroundColor: '#000000',
              padding: '0.4rem',
              height: '160px',
              overflowY: 'auto'
            }}>
              {documents.map(doc => {
                const isMatched = searchResults.includes(doc.id);
                return (
                  <div key={doc.id} style={{
                    fontSize: '0.62rem',
                    padding: '0.3rem',
                    border: isMatched ? '1.5px solid #1591DC' : '1px solid var(--bg-tertiary)',
                    borderRadius: '4px',
                    marginBottom: '0.35rem',
                    backgroundColor: isMatched ? 'rgba(21, 145, 220, 0.1)' : 'none',
                    color: '#FFFFFF'
                  }}>
                    <strong>Doc ID {doc.id}</strong>
                    <div style={{ opacity: 0.85, marginTop: '0.1rem' }}>{doc.text}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inverted Index Registry */}
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#1591DC', display: 'block', marginBottom: '0.35rem' }}>
              Inverted Index Postings Registry
            </span>
            <div style={{
              border: '1.5px solid #1591DC',
              borderRadius: '6px',
              backgroundColor: '#000000',
              padding: '0.4rem',
              height: '160px',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', fontSize: '0.6rem', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--bg-tertiary)', paddingBottom: '0.2rem', marginBottom: '0.2rem' }}>
                <span>Indexed Term</span>
                <span>Document IDs List (Postings)</span>
              </div>
              
              {Object.keys(invertedIndex).map(term => {
                const isActive = searchQuery.toLowerCase().trim() === term;
                return (
                  <div key={term} style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1fr',
                    fontSize: '0.65rem',
                    padding: '0.2rem 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    color: isActive ? '#1591DC' : '#FFFFFF',
                    fontWeight: isActive ? 'bold' : 'normal'
                  }}>
                    <span>{term}</span>
                    <span style={{ color: isActive ? '#1591DC' : 'var(--text-secondary)' }}>
                      [{invertedIndex[term].join(', ')}]
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </VisualizerShell>
  );
}
