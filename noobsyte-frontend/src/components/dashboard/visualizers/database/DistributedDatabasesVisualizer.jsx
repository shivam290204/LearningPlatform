import React, { useState } from 'react';
import VisualizerShell from '../../VisualizerShell';

export default function DistributedDatabasesVisualizer() {
  const [nodes, setNodes] = useState([
    { id: 1, role: 'LEADER', status: 'HEALTHY', term: 1, logIndex: 2 },
    { id: 2, role: 'FOLLOWER', status: 'HEALTHY', term: 1, logIndex: 2 },
    { id: 3, role: 'FOLLOWER', status: 'HEALTHY', term: 1, logIndex: 2 }
  ]);

  const [txState, setTxState] = useState('IDLE'); // 'IDLE', 'REPLICATING', 'COMMITTED'
  const [log, setLog] = useState('Consensus ring operational. Leader is sending heartbeats.');
  const [isElecting, setIsElecting] = useState(false);

  const sendWrite = () => {
    const leaderNode = nodes.find(n => n.role === 'LEADER' && n.status === 'HEALTHY');
    if (!leaderNode) {
      setLog('[Write Error] No active healthy Leader available. Transaction aborted.');
      return;
    }

    setTxState('REPLICATING');
    setLog(`[Raft Write] Transaction received by Leader (Node ${leaderNode.id}). Broadcasting Log Entries to followers...`);

    setTimeout(() => {
      // Check for quorum confirmation (majority of nodes must be healthy)
      const healthyNodes = nodes.filter(n => n.status === 'HEALTHY');
      const quorumReached = healthyNodes.length >= 2;

      if (quorumReached) {
        setNodes(prev => prev.map(n => n.status === 'HEALTHY' ? { ...n, logIndex: n.logIndex + 1 } : n));
        setTxState('COMMITTED');
        setLog(`[Raft Consensus] Quorum reached (majority of nodes confirmed write). Transaction COMMITTED on index ${leaderNode.logIndex + 1}!`);
      } else {
        setTxState('IDLE');
        setLog('[Raft Consensus] Failed. Split-brain or lack of quorum: majority of nodes are offline.');
      }
    }, 1500);
  };

  const crashLeader = () => {
    const leader = nodes.find(n => n.role === 'LEADER');
    if (!leader) return;

    setNodes(prev => prev.map(n => n.role === 'LEADER' ? { ...n, status: 'CRASHED' } : n));
    setTxState('IDLE');
    setLog(`[Node Failure] Leader (Node ${leader.id}) has crashed! Heartbeats have stopped.`);

    // Trigger auto election timeout
    setIsElecting(true);
    setTimeout(() => {
      triggerElection();
    }, 2000);
  };

  const triggerElection = () => {
    setLog('Election Timeout! Follower Nodes detected loss of leader heartbeat. Starting election...');
    
    setNodes(prev => {
      // Find a healthy follower to become Candidate
      const candidateIndex = prev.findIndex(n => n.role === 'FOLLOWER' && n.status === 'HEALTHY');
      if (candidateIndex === -1) {
        setLog('Election failed: No healthy nodes available to run for leader.');
        setIsElecting(false);
        return prev.map(n => n.role === 'LEADER' ? { ...n, role: 'FOLLOWER' } : n);
      }

      const nextTerm = prev[candidateIndex].term + 1;
      
      const newNodes = prev.map((n, idx) => {
        if (idx === candidateIndex) {
          return { ...n, role: 'LEADER', term: nextTerm, logIndex: n.logIndex };
        }
        if (n.role === 'LEADER') {
          return { ...n, role: 'FOLLOWER', term: nextTerm };
        }
        return { ...n, term: nextTerm };
      });

      const newLeader = newNodes.find(n => n.role === 'LEADER');
      setLog(`[Raft Election] Candidate Node ${newLeader.id} requested votes. Quorum granted. Node ${newLeader.id} is promoted to Leader for Term ${nextTerm}!`);
      setIsElecting(false);
      return newNodes;
    });
  };

  const restoreCrashed = () => {
    setNodes(prev => prev.map(n => n.status === 'CRASHED' ? { ...n, status: 'HEALTHY', role: 'FOLLOWER', logIndex: prev.find(l => l.role === 'LEADER')?.logIndex || n.logIndex } : n));
    setLog('Node restored. Re-joining consensus ring as a Follower. Syncing log indexes...');
  };

  const handleReset = () => {
    setNodes([
      { id: 1, role: 'LEADER', status: 'HEALTHY', term: 1, logIndex: 2 },
      { id: 2, role: 'FOLLOWER', status: 'HEALTHY', term: 1, logIndex: 2 },
      { id: 3, role: 'FOLLOWER', status: 'HEALTHY', term: 1, logIndex: 2 }
    ]);
    setTxState('IDLE');
    setIsElecting(false);
    setLog('Distributed consensus ring reset.');
  };

  const controls = (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', width: '100%' }}>
      <button className="btn-viz-action btn-add" onClick={sendWrite} disabled={txState === 'REPLICATING' || isElecting}>
        Send Write Query
      </button>

      <button className="btn-viz-action" onClick={crashLeader} disabled={!nodes.some(n => n.role === 'LEADER' && n.status === 'HEALTHY') || isElecting}>
        Crash Active Leader
      </button>

      <button className="btn-viz-action" onClick={restoreCrashed} disabled={!nodes.some(n => n.status === 'CRASHED')}>
        Restore Crashed Node
      </button>

      <button className="btn-viz-action" onClick={handleReset}>
        Reset
      </button>
    </div>
  );

  const stateInspector = (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Node Consensus Registry</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          {nodes.map(n => (
            <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', color: n.status === 'CRASHED' ? 'rgba(255,255,255,0.4)' : '#FFFFFF' }}>
              <span>Node {n.id} ({n.role})</span>
              <span>Term: {n.term} | LogIdx: {n.logIndex} | {n.status}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span style={{ fontWeight: '700', color: 'var(--text-primary)', display: 'block', marginBottom: '0.35rem' }}>Quorum & Write Status</span>
        <div style={{
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--bg-tertiary)',
          borderRadius: '4px',
          padding: '0.5rem',
          fontFamily: 'monospace',
          fontSize: '0.72rem'
        }}>
          <div>Active Leader ID: <strong style={{ color: '#1591DC' }}>{nodes.find(n => n.role === 'LEADER' && n.status === 'HEALTHY')?.id || 'None'}</strong></div>
          <div>Healthy Nodes (Quorum): <strong style={{ color: '#1591DC' }}>{nodes.filter(n => n.status === 'HEALTHY').length} / 3</strong></div>
          <div>Sync Transaction State: <strong style={{ color: '#1591DC' }}>{txState}</strong></div>
        </div>
      </div>
    </div>
  );

  const theory = (
    <div>
      <p>A <strong>Distributed Database</strong> distributes data across multiple independent database nodes. To avoid data divergence, they rely on Consensus Algorithms (e.g. Raft or Paxos):</p>
      <ul>
        <li><strong>Leader Node:</strong> Receives all incoming write transactions, logs them locally, and coordinates replication.</li>
        <li><strong>Log Replication:</strong> The Leader broadcasts append-log transactions to all Follower nodes.</li>
        <li><strong>Quorum Write:</strong> A transaction is committed only when a strict majority (Quorum, e.g. `(N/2)+1` nodes) successfully persists the log entry on disk.</li>
        <li><strong>Leader Election:</strong> If heartbeats stop, remaining healthy followers campaign as Candidates, vote, and select a new Leader to resume service.</li>
      </ul>
    </div>
  );

  const analogy = (
    <div>
      <p>Think of Raft Consensus as a **corporate board meeting rules checklist**:</p>
      <ul>
        <li>There is one Chairman (Leader) who proposes resolutions. The board members (Followers) listen and vote. A resolution is only approved if a majority (Quorum) raise their hands. If the Chairman exits the room, a new Chairman is elected to take over.</li>
      </ul>
    </div>
  );

  const mistakes = (
    <ul>
      <li><strong>Split-Brain Syndrome:</strong> A network partition splits a cluster into two isolated halves, and both elect a Leader, allowing contradicting writes. Solved by requiring a strict Quorum to commit.</li>
      <li><strong>Deploying Even-Numbered Clusters:</strong> Deploying a 4-node cluster instead of 5. Both have a Quorum threshold of 3, meaning a 4-node cluster tolerates only 1 failure, whereas 5 tolerates 2.</li>
    </ul>
  );

  const interviewQuestions = [
    {
      q: 'Why are distributed consensus groups typically odd-numbered (3, 5, or 7)?',
      a: 'To guarantee that a strict majority (Quorum) can always be achieved and to prevent tie-votes or split-brain partitions where two isolated sub-clusters each claim to have achieved quorum.'
    },
    {
      q: 'What is Split-Brain in distributed databases?',
      a: 'Split-Brain occurs when a network partition separates database nodes, causing each sub-group to assume the other crashed. If both groups elect a Leader, clients will write conflicting data to both halves, corrupting state consistency.'
    }
  ];

  const quizQuestions = [
    {
      question: 'What is the minimum number of healthy nodes required to commit a write in a 5-node distributed cluster?',
      options: [
        '2 nodes',
        '3 nodes',
        '4 nodes',
        '5 nodes'
      ],
      correctIdx: 1,
      explanation: 'Quorum requires a strict majority of nodes: (5 / 2) + 1 = 3 healthy nodes.'
    },
    {
      question: 'What happens when a Raft Leader Node enters a crashed state?',
      options: [
        'All database data is deleted',
        'Follower nodes detect the lack of heartbeat and run an election to select a new Leader',
        'Clients write directly to followers in write-through mode',
        'The database switches to single-node MySQL mode'
      ],
      correctIdx: 1,
      explanation: 'Heartbeat loss triggers an election timeout, prompting healthy followers to elect a new Leader.'
    }
  ];

  return (
    <VisualizerShell
      title="Distributed Databases"
      subtitle="Interact with leader heartbeats, replication consensus logs, node crashes, and election voting loops."
      timeComplexity="Consensus Roundtrip: O(Ping)"
      spaceComplexity="O(N) node log allocations"
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
        <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', width: '100%', flexWrap: 'wrap' }}>
          
          {nodes.map(n => {
            const isCrashed = n.status === 'CRASHED';
            const isLeader = n.role === 'LEADER';
            
            let borderCol = 'var(--bg-tertiary)';
            let labelCol = 'var(--text-secondary)';
            
            if (isLeader && !isCrashed) {
              borderCol = '#1591DC';
              labelCol = '#1591DC';
            } else if (isCrashed) {
              borderCol = 'rgba(255,255,255,0.15)';
              labelCol = 'rgba(255,255,255,0.4)';
            }

            return (
              <div key={n.id} style={{
                border: isCrashed ? '1.5px dashed rgba(255,255,255,0.2)' : `2px solid ${borderCol}`,
                borderRadius: '8px',
                padding: '0.75rem',
                backgroundColor: '#000000',
                width: '110px',
                textAlign: 'center',
                transition: 'all 0.3s'
              }}>
                <i className={isLeader ? "fa-solid fa-crown" : "fa-solid fa-server"} style={{ fontSize: '1.2rem', color: labelCol, marginBottom: '0.4rem' }}></i>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#FFFFFF' }}>Node {n.id}</div>
                <div style={{ fontSize: '0.6rem', color: labelCol, fontWeight: '700', textTransform: 'uppercase', marginTop: '0.15rem' }}>{n.role}</div>
                <div style={{
                  fontSize: '0.55rem',
                  padding: '0.1rem 0.25rem',
                  borderRadius: '3px',
                  backgroundColor: isCrashed ? 'rgba(255,255,255,0.05)' : 'rgba(21, 145, 220, 0.05)',
                  border: isCrashed ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(21, 145, 220, 0.3)',
                  color: isCrashed ? 'rgba(255,255,255,0.4)' : '#1591DC',
                  marginTop: '0.4rem'
                }}>
                  {isCrashed ? 'CRASHED' : 'ONLINE'}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </VisualizerShell>
  );
}
