import React, { useState } from 'react';
import { VISUALIZER_REGISTRY } from './visualizers/visualizerRegistry';
import './InteractiveVisualizer.css';

// SVG Schematics for Roadmaps
function PreviewDiagram({ type }) {
  switch (type) {
    case 'avl':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="110" cy="25" r="14" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="110" y="29" textAnchor="middle" fill="#FFFFFF" fontSize="0.7rem">50</text>
          
          <line x1="100" y1="35" x2="70" y2="65" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <circle cx="65" cy="75" r="14" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="65" y="79" textAnchor="middle" fill="#FFFFFF" fontSize="0.7rem">30</text>
          
          <line x1="120" y1="35" x2="150" y2="65" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <circle cx="155" cy="75" r="14" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="155" y="79" textAnchor="middle" fill="#FFFFFF" fontSize="0.7rem">70</text>
          
          <path d="M 175 75 A 30 30 0 0 1 125 15" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x="165" y="40" fill="#f59e0b" fontSize="0.55rem">Rotate</text>
        </svg>
      );
    case 'heap':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="110" cy="20" r="12" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="110" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">10</text>
          
          <line x1="102" y1="28" x2="73" y2="52" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <circle cx="65" cy="60" r="12" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="65" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">15</text>
          
          <line x1="118" y1="28" x2="147" y2="52" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <circle cx="155" cy="60" r="12" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="155" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">30</text>
          
          <line x1="58" y1="68" x2="37" y2="92" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <circle cx="30" cy="100" r="12" fill="none" stroke="#10b981" strokeWidth="2" />
          <text x="30" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">40</text>
          
          <path d="M 38 95 A 15 15 0 0 1 57 68" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="50" y="85" fill="#f59e0b" fontSize="0.55rem">Heapify</text>
        </svg>
      );
    case 'trie':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="110" cy="15" r="10" fill="none" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <text x="110" y="19" textAnchor="middle" fill="#FFFFFF" fontSize="0.6rem">root</text>
          
          <line x1="104" y1="23" x2="76" y2="47" stroke="#1591DC" strokeWidth="2" />
          <circle cx="70" cy="55" r="10" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="70" y="59" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">c</text>
          
          <line x1="70" y1="65" x2="70" y2="85" stroke="#1591DC" strokeWidth="2" />
          <circle cx="70" cy="95" r="10" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="70" y="99" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">a</text>
          
          <line x1="70" y1="105" x2="90" y2="105" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="102" y="108" fill="#10b981" fontSize="0.55rem">t (word)</text>
        </svg>
      );
    case 'dijkstra':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="50" cy="60" r="12" fill="none" stroke="#10b981" strokeWidth="2" />
          <text x="50" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">A</text>
          
          <line x1="62" y1="55" x2="138" y2="25" stroke="#10b981" strokeWidth="2" />
          <text x="100" y="32" fill="#10b981" fontSize="0.6rem">2</text>
          <circle cx="150" cy="20" r="12" fill="none" stroke="#10b981" strokeWidth="2" />
          <text x="150" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">B</text>
          
          <line x1="62" y1="65" x2="138" y2="95" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <text x="100" y="90" fill="var(--text-secondary)" fontSize="0.6rem">6</text>
          <circle cx="150" cy="100" r="12" fill="none" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <text x="150" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">C</text>
        </svg>
      );
    case 'topo':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="20" y="45" width="40" height="24" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="40" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">Task A</text>
          
          <line x1="60" y1="57" x2="95" y2="57" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <polygon points="95,54 101,57 95,60" fill="var(--bg-tertiary)" />
          
          <rect x="105" y="45" width="40" height="24" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="125" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">Task B</text>
          
          <line x1="145" y1="57" x2="180" y2="57" stroke="var(--bg-tertiary)" strokeWidth="2" />
          <polygon points="180,54 186,57 180,60" fill="var(--bg-tertiary)" />
          
          <rect x="190" y="45" width="40" height="24" fill="none" stroke="#10b981" strokeWidth="1.5" rx="3" />
          <text x="210" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">Task C</text>
        </svg>
      );
    case 'horiz-scale':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="15" y="55" width="42" height="24" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="36" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem">Server 1</text>
          <rect x="89" y="55" width="42" height="24" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="110" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem">Server 2</text>
          <rect x="163" y="55" width="42" height="24" fill="none" stroke="#10b981" strokeWidth="1.5" rx="3" />
          <text x="184" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem">Server 3</text>
          <line x1="110" y1="10" x2="110" y2="28" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          <text x="110" y="5" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.55rem">Load Balancer</text>
          <path d="M 110 28 L 36 55 M 110 28 L 110 55 M 110 28 L 184 55" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
      );
    case 'vert-scale':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="30" y="55" width="30" height="20" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1" rx="2" />
          <text x="45" y="67" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">Small</text>
          <rect x="130" y="35" width="60" height="50" fill="none" stroke="#1591DC" strokeWidth="2" rx="4" />
          <text x="160" y="57" textAnchor="middle" fill="#FFFFFF" fontSize="0.65rem">Upgraded</text>
          <text x="160" y="71" textAnchor="middle" fill="var(--text-tertiary)" fontSize="0.45rem">128GB RAM</text>
          <path d="M 75 65 L 115 65" stroke="#f59e0b" strokeWidth="1.5" />
          <polygon points="115,62 121,65 115,68" fill="#f59e0b" />
        </svg>
      );
    case 'sharding':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="85" y="5" width="50" height="22" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="110" y="19" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem">Router Key</text>
          <line x1="85" y1="27" x2="45" y2="60" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          <line x1="135" y1="27" x2="175" y2="60" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          <rect x="15" y="62" width="60" height="28" fill="none" stroke="#10b981" strokeWidth="1.5" rx="3" />
          <text x="45" y="79" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Shard A (A-M)</text>
          <rect x="145" y="62" width="60" height="28" fill="none" stroke="#10b981" strokeWidth="1.5" rx="3" />
          <text x="175" y="79" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Shard B (N-Z)</text>
        </svg>
      );
    case 'failover':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="15" y="45" width="60" height="30" fill="none" stroke="#ef4444" strokeWidth="1.5" rx="3" />
          <text x="45" y="60" textAnchor="middle" fill="#ef4444" fontSize="0.5rem">Primary (Dead)</text>
          <rect x="145" y="45" width="60" height="30" fill="none" stroke="#10b981" strokeWidth="1.5" rx="3" />
          <text x="175" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Standby</text>
          <text x="175" y="71" textAnchor="middle" fill="#10b981" fontSize="0.45rem">Promoted</text>
          <path d="M 90 60 L 130 60" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="110" y="53" textAnchor="middle" fill="#f59e0b" fontSize="0.45rem">Failover</text>
        </svg>
      );
    case 'rate-lim':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <path d="M 80 20 L 80 80 L 140 80 L 140 20" fill="none" stroke="#1591DC" strokeWidth="2" />
          <circle cx="110" cy="40" r="6" fill="#f59e0b" />
          <circle cx="100" cy="65" r="6" fill="#f59e0b" />
          <circle cx="120" cy="65" r="6" fill="#f59e0b" />
          <text x="110" y="93" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.5rem">Token Bucket</text>
          <path d="M 110 5 L 110 20" stroke="#10b981" strokeWidth="1.5" />
          <text x="110" y="1" textAnchor="middle" fill="#10b981" fontSize="0.5rem">Requests</text>
          <path d="M 110 80 L 110 110" stroke="#ef4444" strokeWidth="1.5" />
          <text x="110" y="118" textAnchor="middle" fill="#ef4444" fontSize="0.5rem">Rejected if empty</text>
        </svg>
      );
    case 'circuit-break':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="45" cy="60" r="16" fill="none" stroke="#10b981" strokeWidth="1.5" />
          <text x="45" y="64" textAnchor="middle" fill="#10b981" fontSize="0.45rem">CLOSED</text>
          <circle cx="110" cy="25" r="16" fill="none" stroke="#ef4444" strokeWidth="1.5" />
          <text x="110" y="29" textAnchor="middle" fill="#ef4444" fontSize="0.45rem">OPEN</text>
          <circle cx="175" cy="60" r="16" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="175" y="64" textAnchor="middle" fill="#f59e0b" fontSize="0.45rem">HALF-OPEN</text>
          <path d="M 60 48 L 95 32" stroke="var(--bg-tertiary)" strokeWidth="1" />
          <path d="M 125 32 L 160 48" stroke="var(--bg-tertiary)" strokeWidth="1" />
          <path d="M 159 65 L 61 65" stroke="var(--bg-tertiary)" strokeWidth="1" />
        </svg>
      );
    case 'load-level':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <text x="25" y="30" textAnchor="middle" fill="#ef4444" fontSize="0.55rem">Spike (10K rps)</text>
          <line x1="25" y1="35" x2="65" y2="55" stroke="#ef4444" strokeWidth="1.5" />
          <rect x="75" y="45" width="70" height="30" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="110" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem">Queue Buffer</text>
          <line x1="145" y1="60" x2="185" y2="60" stroke="#10b981" strokeWidth="1.5" />
          <rect x="190" y="45" width="25" height="30" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="3" />
          <text x="202" y="62" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.55rem">DB</text>
          <text x="165" y="52" fill="#10b981" fontSize="0.45rem">Steady Write</text>
        </svg>
      );
    case 'microservice':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="10" y="45" width="45" height="26" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="3" />
          <text x="32" y="61" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.5rem">Gateway</text>
          <line x1="55" y1="58" x2="105" y2="28" stroke="#1591DC" strokeWidth="1.5" />
          <line x1="55" y1="58" x2="105" y2="58" stroke="#1591DC" strokeWidth="1.5" />
          <line x1="55" y1="58" x2="105" y2="88" stroke="#1591DC" strokeWidth="1.5" />
          <rect x="110" y="15" width="55" height="22" fill="none" stroke="#10b981" strokeWidth="1.5" rx="2" />
          <text x="137" y="29" textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem">User Svc</text>
          <rect x="110" y="47" width="55" height="22" fill="none" stroke="#10b981" strokeWidth="1.5" rx="2" />
          <text x="137" y="61" textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem">Order Svc</text>
          <rect x="110" y="79" width="55" height="22" fill="none" stroke="#10b981" strokeWidth="1.5" rx="2" />
          <text x="137" y="93" textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem">Pay Svc</text>
        </svg>
      );
    case 'event-drive':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="10" y="45" width="45" height="26" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="3" />
          <text x="32" y="61" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.5rem">Producer</text>
          <line x1="55" y1="58" x2="95" y2="58" stroke="#f59e0b" strokeWidth="1.5" />
          <rect x="100" y="35" width="40" height="46" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="120" y="61" textAnchor="middle" fill="#1591DC" fontSize="0.55rem">Event Bus</text>
          <line x1="140" y1="58" x2="180" y2="58" stroke="#10b981" strokeWidth="1.5" />
          <rect x="185" y="45" width="45" height="26" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="3" />
          <text x="207" y="61" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.5rem">Consumer</text>
        </svg>
      );
    case 'cap':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="95" cy="45" r="28" fill="none" stroke="#1591DC" strokeWidth="1.5" />
          <text x="80" y="38" fill="#1591DC" fontSize="0.55rem" fontWeight="700">C</text>
          <circle cx="125" cy="45" r="28" fill="none" stroke="#10b981" strokeWidth="1.5" />
          <text x="140" y="38" fill="#10b981" fontSize="0.55rem" fontWeight="700">A</text>
          <circle cx="110" cy="72" r="28" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          <text x="110" y="93" fill="#f59e0b" fontSize="0.55rem" fontWeight="700" textAnchor="middle">P</text>
          <text x="110" y="58" fill="#FFFFFF" fontSize="0.45rem" textAnchor="middle" fontWeight="bold">RDBMS</text>
        </svg>
      );
    case 'discovery':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="15" y="65" width="55" height="24" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="42" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Service</text>
          <line x1="42" y1="65" x2="110" y2="40" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2,2" />
          <text x="80" y="47" fill="#10b981" fontSize="0.45rem" transform="rotate(-20, 80, 47)">Register</text>
          <rect x="85" y="10" width="55" height="28" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="3" />
          <text x="112" y="27" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.5rem">Registry DB</text>
        </svg>
      );
    case 'dist-cache':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="50" cy="60" r="16" fill="none" stroke="#1591DC" strokeWidth="1.5" />
          <text x="50" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Cache A</text>
          <circle cx="110" cy="60" r="16" fill="none" stroke="#1591DC" strokeWidth="1.5" />
          <text x="110" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Cache B</text>
          <circle cx="170" cy="60" r="16" fill="none" stroke="#1591DC" strokeWidth="1.5" />
          <text x="170" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Cache C</text>
          <path d="M 66 60 L 94 60" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
          <path d="M 126 60 L 154 60" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
      );
    case 'consistent-hash':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="110" cy="60" r="32" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          <circle cx="110" cy="28" r="5" fill="#1591DC" />
          <text x="110" y="21" textAnchor="middle" fill="#1591DC" fontSize="0.45rem">Node A</text>
          <circle cx="142" cy="60" r="5" fill="#10b981" />
          <text x="156" y="63" textAnchor="middle" fill="#10b981" fontSize="0.45rem">Node B</text>
          <circle cx="80" cy="75" r="4" fill="#f59e0b" />
          <text x="66" y="85" textAnchor="middle" fill="#f59e0b" fontSize="0.45rem">Key 1</text>
          <path d="M 80 75 A 32 32 0 0 1 110 28" fill="none" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
        </svg>
      );
    case 'dist-lock':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="85" y="45" width="50" height="30" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="4" />
          <text x="110" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem">Resource</text>
          <circle cx="110" cy="20" r="8" fill="none" stroke="#ef4444" strokeWidth="1.5" />
          <path d="M 106 20 L 114 20" stroke="#ef4444" strokeWidth="1.5" />
          <text x="135" y="23" fill="#ef4444" fontSize="0.45rem">Locked</text>
          <rect x="15" y="45" width="45" height="26" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="3" />
          <text x="37" y="61" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.5rem">Client 1</text>
          <rect x="160" y="45" width="45" height="26" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="3" />
          <text x="182" y="61" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.5rem">Client 2</text>
          <line x1="60" y1="58" x2="85" y2="58" stroke="#10b981" strokeWidth="1.5" />
          <line x1="160" y1="58" x2="135" y2="58" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="2,2" />
        </svg>
      );
    case 'pubsub':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="10" y="45" width="45" height="26" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="3" />
          <text x="32" y="61" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.5rem">Publisher</text>
          <line x1="55" y1="58" x2="95" y2="58" stroke="#f59e0b" strokeWidth="1.5" />
          <rect x="100" y="40" width="40" height="30" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="120" y="58" textAnchor="middle" fill="#1591DC" fontSize="0.55rem">Topic</text>
          <line x1="140" y1="50" x2="175" y2="28" stroke="#10b981" strokeWidth="1.5" />
          <line x1="140" y1="65" x2="175" y2="88" stroke="#10b981" strokeWidth="1.5" />
          <rect x="180" y="10" width="35" height="20" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="2" />
          <text x="197" y="22" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">Sub 1</text>
          <rect x="180" y="80" width="35" height="20" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="2" />
          <text x="197" y="92" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">Sub 2</text>
        </svg>
      );
    case 'websocket':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="15" y="45" width="45" height="30" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="4" />
          <text x="37" y="64" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.55rem">Client</text>
          <line x1="60" y1="55" x2="160" y2="55" stroke="#1591DC" strokeWidth="1.5" />
          <polygon points="160,52 166,55 160,58" fill="#1591DC" transform="translate(-10, 0)" />
          <line x1="160" y1="65" x2="60" y2="65" stroke="#10b981" strokeWidth="1.5" />
          <polygon points="60,62 54,65 60,68" fill="#10b981" transform="translate(10, 0)" />
          <text x="110" y="48" textAnchor="middle" fill="#1591DC" fontSize="0.45rem">TCP Tunnel</text>
          <rect x="165" y="45" width="45" height="30" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="4" />
          <text x="187" y="64" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.55rem">Server</text>
        </svg>
      );
    case 'dns':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="10" y="50" width="35" height="20" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1" rx="2" />
          <text x="27" y="62" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">Client</text>
          <rect x="75" y="50" width="45" height="20" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="2" />
          <text x="97" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Resolver</text>
          <line x1="45" y1="60" x2="75" y2="60" stroke="#1591DC" strokeWidth="1" />
          <circle cx="165" cy="20" r="10" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1" />
          <text x="165" y="24" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">Root</text>
          <circle cx="165" cy="60" r="10" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1" />
          <text x="165" y="64" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">TLD</text>
          <circle cx="165" cy="100" r="10" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1" />
          <text x="165" y="104" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">NS</text>
          <path d="M 120 55 L 155 25 M 120 60 L 155 60 M 120 65 L 155 95" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="1,1" />
        </svg>
      );
    case 'graphql':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="15" y="45" width="45" height="24" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="3" />
          <text x="37" y="60" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.5rem">/graphql</text>
          <line x1="60" y1="57" x2="100" y2="57" stroke="#1591DC" strokeWidth="1.5" />
          <rect x="105" y="30" width="100" height="58" fill="none" stroke="#10b981" strokeWidth="1.5" rx="3" />
          <text x="155" y="45" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">User &#123;</text>
          <text x="155" y="57" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">  name</text>
          <text x="155" y="69" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.45rem">  posts &#123; title &#125;</text>
          <text x="155" y="81" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">&#125;</text>
        </svg>
      );
    case 'pacelc':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="20" y="30" width="70" height="26" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="55" y="46" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem">Partition (P)</text>
          <rect x="130" y="30" width="70" height="26" fill="none" stroke="#10b981" strokeWidth="1.5" rx="3" />
          <text x="165" y="46" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem">Else (E)</text>
          <path d="M 55 56 L 55 90" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          <text x="55" y="103" textAnchor="middle" fill="#1591DC" fontSize="0.5rem">A vs C</text>
          <path d="M 165 56 L 165 90" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          <text x="165" y="103" textAnchor="middle" fill="#10b981" fontSize="0.5rem">L vs C</text>
        </svg>
      );
    case 'optimizer':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="10" y="45" width="45" height="26" fill="none" stroke="#FFFFFF" strokeWidth="1.5" rx="3" />
          <text x="32" y="61" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">SQL Query</text>
          
          <line x1="55" y1="58" x2="75" y2="58" stroke="#1591DC" strokeWidth="1.5" />
          <polygon points="75,55 81,58 75,61" fill="#1591DC" />
          
          <circle cx="95" cy="58" r="16" fill="none" stroke="#1591DC" strokeWidth="1.5" />
          <text x="95" y="61" textAnchor="middle" fill="#1591DC" fontSize="0.45rem" fontWeight="bold">Optimizer</text>
          
          <line x1="111" y1="58" x2="135" y2="58" stroke="#1591DC" strokeWidth="1.5" />
          <polygon points="135,55 141,58 135,61" fill="#1591DC" />
          
          <rect x="145" y="45" width="60" height="26" fill="none" stroke="#FFFFFF" strokeWidth="1.5" rx="3" />
          <text x="175" y="61" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Optimal Plan</text>
          
          <text x="95" y="90" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="0.45rem">Cost Evaluation</text>
        </svg>
      );
    case 'views':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="15" y="20" width="55" height="24" fill="none" stroke="#FFFFFF" strokeWidth="1.5" rx="3" />
          <text x="42.5" y="35" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Base Table</text>
          
          <path d="M 42.5 44 L 42.5 75" stroke="#1591DC" strokeWidth="1" strokeDasharray="2,2" />
          
          <rect x="15" y="75" width="55" height="24" fill="none" stroke="#1591DC" strokeWidth="1.5" rx="3" />
          <text x="42.5" y="90" textAnchor="middle" fill="#1591DC" fontSize="0.45rem" fontWeight="bold">Mat. View</text>
          
          <circle cx="150" cy="50" r="14" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="150" y="54" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Client</text>
          
          <line x1="136" y1="55" x2="70" y2="82" stroke="#1591DC" strokeWidth="1.5" />
          <polygon points="70,78 65,85 73,84" fill="#1591DC" />
          <text x="115" y="77" fill="#1591DC" fontSize="0.45rem" transform="rotate(18, 115, 77)">Fast seek</text>
        </svg>
      );
    case 'oltp-olap':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <g>
            <text x="40" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Row-Store (OLTP)</text>
            <rect x="10" y="25" width="65" height="10" fill="none" stroke="#1591DC" strokeWidth="1" />
            <text x="42.5" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">Row 1: ID, Name...</text>
            <rect x="10" y="38" width="65" height="10" fill="none" stroke="#1591DC" strokeWidth="1" />
            <rect x="10" y="51" width="65" height="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          </g>
          
          <line x1="110" y1="15" x2="110" y2="105" stroke="var(--bg-tertiary)" strokeWidth="1.5" />
          
          <g>
            <text x="165" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="0.55rem" fontWeight="bold">Col-Store (OLAP)</text>
            <rect x="125" y="25" width="15" height="60" fill="none" stroke="#1591DC" strokeWidth="1" />
            <text x="132.5" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="0.38rem" transform="rotate(-90, 132.5, 55)">IDs</text>
            
            <rect x="145" y="25" width="15" height="60" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            <text x="152.5" y="55" textAnchor="middle" fill="#FFFFFF" fontSize="0.38rem" transform="rotate(-90, 152.5, 55)">Names</text>
            
            <rect x="165" y="25" width="15" height="60" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <text x="172.5" y="55" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="0.38rem" transform="rotate(-90, 172.5, 55)">Salaries</text>
          </g>
        </svg>
      );
    case 'warehouse':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="10" y="15" width="30" height="18" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="25" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">DB 1</text>
          <rect x="10" y="45" width="30" height="18" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="25" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">DB 2</text>
          <rect x="10" y="75" width="30" height="18" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="25" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">API</text>
          
          <path d="M 40 24 L 85 54" stroke="#1591DC" strokeWidth="1" />
          <path d="M 40 54 L 85 54" stroke="#1591DC" strokeWidth="1" />
          <path d="M 40 84 L 85 54" stroke="#1591DC" strokeWidth="1" />
          
          <rect x="85" y="42" width="40" height="24" rx="2" fill="none" stroke="#1591DC" strokeWidth="1.5" />
          <text x="105" y="56" textAnchor="middle" fill="#1591DC" fontSize="0.42rem" fontWeight="bold">ETL Pipeline</text>
          
          <line x1="125" y1="54" x2="160" y2="54" stroke="#1591DC" strokeWidth="1.5" />
          <polygon points="160,51 166,54 160,57" fill="#1591DC" />
          
          <rect x="165" y="32" width="45" height="44" rx="4" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="187.5" y="52" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Data</text>
          <text x="187.5" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Warehouse</text>
        </svg>
      );
    case 'snowflake':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="80" y="45" width="60" height="30" rx="3" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="110" y="63" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Fact_Sales</text>
          
          <line x1="110" y1="45" x2="110" y2="25" stroke="#FFFFFF" strokeWidth="1.2" />
          <rect x="85" y="5" width="50" height="20" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="110" y="17" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Dim_Product</text>
          
          <line x1="135" y1="15" x2="165" y2="15" stroke="#1591DC" strokeWidth="1" strokeDasharray="2,2" />
          <rect x="165" y="5" width="50" height="20" rx="2" fill="none" stroke="#1591DC" strokeWidth="1" />
          <text x="190" y="17" textAnchor="middle" fill="#1591DC" fontSize="0.4rem">Dim_Category</text>
          
          <line x1="80" y1="60" x2="50" y2="60" stroke="#FFFFFF" strokeWidth="1.2" />
          <rect x="2" y="50" width="48" height="20" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="26" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Dim_Store</text>
          
          <line x1="26" y1="70" x2="26" y2="90" stroke="#1591DC" strokeWidth="1" strokeDasharray="2,2" />
          <rect x="2" y="90" width="48" height="20" rx="2" fill="none" stroke="#1591DC" strokeWidth="1" />
          <text x="26" y="102" textAnchor="middle" fill="#1591DC" fontSize="0.4rem">Dim_Region</text>
        </svg>
      );
    case 'star':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="85" y="48" width="50" height="24" rx="3" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="110" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem" fontWeight="bold">Fact_Sales</text>
          
          <line x1="85" y1="48" x2="45" y2="28" stroke="#FFFFFF" strokeWidth="1" />
          <rect x="5" y="10" width="40" height="18" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="25" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Dim_Date</text>
          
          <line x1="135" y1="48" x2="175" y2="28" stroke="#FFFFFF" strokeWidth="1" />
          <rect x="175" y="10" width="40" height="18" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="195" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Dim_Item</text>
          
          <line x1="85" y1="72" x2="45" y2="92" stroke="#FFFFFF" strokeWidth="1" />
          <rect x="5" y="90" width="40" height="18" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="25" y="101" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Dim_Store</text>
          
          <line x1="135" y1="72" x2="175" y2="92" stroke="#FFFFFF" strokeWidth="1" />
          <rect x="175" y="90" width="40" height="18" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="195" y="101" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Dim_Cust</text>
        </svg>
      );
    case 'dist-db':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="110" cy="60" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          
          <circle cx="110" cy="30" r="10" fill="none" stroke="#1591DC" strokeWidth="2.5" />
          <text x="110" y="33" textAnchor="middle" fill="#1591DC" fontSize="0.42rem" fontWeight="bold">Leader</text>
          
          <circle cx="80" cy="75" r="9" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="80" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="0.38rem">Follower</text>
          
          <circle cx="140" cy="75" r="9" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="140" y="78" textAnchor="middle" fill="#FFFFFF" fontSize="0.38rem">Follower</text>
          
          <path d="M 103 37 A 30 30 0 0 1 80 66" fill="none" stroke="#1591DC" strokeWidth="1" strokeDasharray="2,2" />
          <path d="M 117 37 A 30 30 0 0 0 140 66" fill="none" stroke="#1591DC" strokeWidth="1" strokeDasharray="2,2" />
          <text x="110" y="93" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="0.45rem">Raft Consensus</text>
        </svg>
      );
    case 'eventsourcing':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <line x1="15" y1="60" x2="205" y2="60" stroke="#FFFFFF" strokeWidth="1.5" />
          <polygon points="205,57 211,60 205,63" fill="#FFFFFF" />
          
          <rect x="25" y="45" width="45" height="30" rx="2" fill="none" stroke="#1591DC" strokeWidth="1.5" />
          <text x="47.5" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">Event 1</text>
          <text x="47.5" y="68" textAnchor="middle" fill="#1591DC" fontSize="0.4rem" fontWeight="bold">Created</text>
          
          <rect x="85" y="45" width="45" height="30" rx="2" fill="none" stroke="#1591DC" strokeWidth="1.5" />
          <text x="107.5" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">Event 2</text>
          <text x="107.5" y="68" textAnchor="middle" fill="#1591DC" fontSize="0.4rem" fontWeight="bold">Updated</text>
          
          <rect x="145" y="45" width="45" height="30" rx="2" fill="none" stroke="#1591DC" strokeWidth="1.5" />
          <text x="167.5" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="0.4rem">Event 3</text>
          <text x="167.5" y="68" textAnchor="middle" fill="#1591DC" fontSize="0.4rem" fontWeight="bold">Committed</text>
          
          <text x="110" y="25" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="0.5rem">Immutable Append-Only Ledger</text>
        </svg>
      );
    case 'cqrs':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <circle cx="25" cy="60" r="12" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="25" y="64" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Client</text>
          
          <path d="M 37 54 L 85 30" stroke="#1591DC" strokeWidth="1.2" />
          <rect x="85" y="15" width="55" height="22" rx="2" fill="none" stroke="#1591DC" strokeWidth="1.5" />
          <text x="112.5" y="29" textAnchor="middle" fill="#1591DC" fontSize="0.45rem" fontWeight="bold">Write DB</text>
          
          <path d="M 112.5 37 L 112.5 83" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="3,3" />
          <text x="125" y="62" fill="rgba(255,255,255,0.6)" fontSize="0.45rem">Async sync</text>
          
          <rect x="85" y="83" width="55" height="22" rx="2" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="112.5" y="97" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">Read Cache</text>
          <path d="M 85 94 L 37 66" stroke="#FFFFFF" strokeWidth="1.2" />
        </svg>
      );
    case 'cdc':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="15" y="38" width="45" height="44" rx="3" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="37.5" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">Primary</text>
          <text x="37.5" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">RDBMS</text>
          
          <rect x="75" y="48" width="30" height="24" fill="none" stroke="#1591DC" strokeWidth="1.2" />
          <text x="90" y="62" textAnchor="middle" fill="#1591DC" fontSize="0.45rem">WAL</text>
          
          <line x1="60" y1="60" x2="75" y2="60" stroke="#1591DC" strokeWidth="1" />
          
          <line x1="105" y1="60" x2="125" y2="60" stroke="#1591DC" strokeWidth="1.5" />
          <polygon points="125,57 131,60 125,63" fill="#1591DC" />
          
          <rect x="131" y="45" width="40" height="30" rx="2" fill="none" stroke="#1591DC" strokeWidth="1.5" />
          <text x="151" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="0.48rem" fontWeight="bold">CDC Engine</text>
          <text x="151" y="68" textAnchor="middle" fill="#1591DC" fontSize="0.4rem">(Debezium)</text>
          
          <line x1="171" y1="60" x2="195" y2="60" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2,2" />
          <text x="110" y="96" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="0.45rem">Realtime Event Stream</text>
        </svg>
      );
    case 'elastic':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <text x="50" y="18" textAnchor="middle" fill="#FFFFFF" fontSize="0.5rem">Inverted Index</text>
          
          <rect x="10" y="28" width="60" height="16" fill="none" stroke="#1591DC" strokeWidth="1" />
          <text x="40" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">"database"</text>
          <line x1="70" y1="36" x2="110" y2="36" stroke="#1591DC" strokeWidth="1.2" />
          <rect x="110" y="28" width="90" height="16" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="155" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Doc 1, Doc 3</text>
          
          <rect x="10" y="52" width="60" height="16" fill="none" stroke="#1591DC" strokeWidth="1" />
          <text x="40" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">"indexes"</text>
          <line x1="70" y1="60" x2="110" y2="60" stroke="#1591DC" strokeWidth="1.2" />
          <rect x="110" y="52" width="90" height="16" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="155" y="62" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem">Doc 2, Doc 3</text>
          
          <rect x="10" y="76" width="60" height="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <text x="40" y="86" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="0.45rem">"sharding"</text>
          <line x1="70" y1="84" x2="110" y2="84" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" />
          <rect x="110" y="76" width="90" height="16" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <text x="155" y="86" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="0.45rem">Doc 3</text>
        </svg>
      );
    case 'vector':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <line x1="20" y1="100" x2="190" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <line x1="20" y1="10" x2="20" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          
          <circle cx="50" cy="40" r="4" fill="#FFFFFF" />
          <circle cx="55" cy="35" r="4" fill="#FFFFFF" />
          <circle cx="160" cy="70" r="4" fill="#FFFFFF" />
          <circle cx="155" cy="80" r="4" fill="#FFFFFF" />
          
          <line x1="20" y1="100" x2="140" y2="40" stroke="#1591DC" strokeWidth="2.5" />
          <polygon points="140,36 144,43 137,45" fill="#1591DC" />
          <circle cx="140" cy="40" r="5" fill="none" stroke="#1591DC" strokeWidth="1.5" />
          
          <circle cx="140" cy="40" r="24" fill="none" stroke="#1591DC" strokeWidth="1" strokeDasharray="3,3" />
          <text x="140" y="18" textAnchor="middle" fill="#1591DC" fontSize="0.45rem">Cosine Search Range</text>
        </svg>
      );
    case 'postgres':
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="15" y="20" width="85" height="35" rx="3" fill="none" stroke="#1591DC" strokeWidth="2" />
          <text x="57.5" y="32" textAnchor="middle" fill="#1591DC" fontSize="0.45rem" fontWeight="bold">Shared Buffers</text>
          
          <rect x="25" y="38" width="12" height="12" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="31" y="46" textAnchor="middle" fill="#FFFFFF" fontSize="0.35rem">P1</text>
          <rect x="42" y="38" width="12" height="12" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          <text x="48" y="46" textAnchor="middle" fill="#FFFFFF" fontSize="0.35rem">P2</text>
          <rect x="59" y="38" width="12" height="12" fill="none" stroke="#1591DC" strokeWidth="1" />
          <text x="65" y="46" textAnchor="middle" fill="#1591DC" fontSize="0.35rem">P3</text>
          <rect x="76" y="38" width="12" height="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          
          <rect x="120" y="20" width="85" height="35" rx="3" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="162.5" y="40" textAnchor="middle" fill="#FFFFFF" fontSize="0.45rem" fontWeight="bold">Disk Storage</text>
          
          <path d="M 100 37 L 120 37" stroke="#1591DC" strokeWidth="1.2" />
          <path d="M 120 43 L 100 43" stroke="#1591DC" strokeWidth="1.2" />
          
          <circle cx="110" cy="85" r="16" fill="none" stroke="#FFFFFF" strokeWidth="1.5" />
          <text x="110" y="88.5" textAnchor="middle" fill="#FFFFFF" fontSize="0.42rem">VACUUM</text>
          <path d="M 110 69 L 110 55" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2,2" />
          <text x="110" y="109" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="0.45rem">MVCC Garbage Sweeper</text>
        </svg>
      );
    default:
      return (
        <svg width="220" height="120" style={{ overflow: 'visible' }}>
          <rect x="10" y="45" width="50" height="30" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="4" />
          <text x="35" y="64" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.65rem">Client</text>
          
          <line x1="60" y1="55" x2="155" y2="55" stroke="#1591DC" strokeWidth="1.5" strokeDasharray="3,3" />
          <text x="110" y="47" fill="#1591DC" fontSize="0.55rem">Request</text>
          
          <line x1="155" y1="65" x2="60" y2="65" stroke="#10b981" strokeWidth="1.5" />
          <text x="110" y="80" fill="#10b981" fontSize="0.55rem">Response</text>
          
          <rect x="160" y="45" width="50" height="30" fill="none" stroke="var(--bg-tertiary)" strokeWidth="1.5" rx="4" />
          <text x="185" y="64" textAnchor="middle" fill="var(--text-secondary)" fontSize="0.65rem">Server</text>
        </svg>
      );
  }
}

const TOPIC_GROUPS = {
  // JAVA
  'jvm-memory': 'JVM & Runtime',
  'garbage-collection': 'JVM & Runtime',
  'thread-lifecycle': 'JVM & Runtime',
  'jvm-architecture': 'JVM & Runtime',
  'string-pool': 'JVM & Runtime',
  'wrapper-classes': 'Language Core',
  'oop-concepts': 'OOP & Dispatch',
  'exception-hierarchy': 'Language Core',
  'concurrency-sync': 'Concurrency & Safety',

  // DSA
  'arraylist': 'Linear Structures',
  'linkedlist': 'Linear Structures',
  'stack': 'Linear Structures',
  'queue': 'Linear Structures',
  'hashmap': 'Linear Structures',
  'binary-search': 'Searching & Sorting',
  'merge-sort': 'Searching & Sorting',
  'quick-sort': 'Searching & Sorting',
  'bst-tree': 'Trees & Tries',
  'avl-tree': 'Trees & Tries',
  'heap-dsa': 'Trees & Tries',
  'trie-visual': 'Trees & Tries',
  'graph-traversal': 'Graphs & Routing',
  'dijkstra-graph': 'Graphs & Routing',
  'topo-sort': 'Graphs & Routing',

  // SYSTEM DESIGN
  'client-server': 'Foundations & APIs',
  'rest-api': 'Foundations & APIs',
  'jwt-auth': 'Foundations & APIs',
  'session-auth': 'Foundations & APIs',
  'api-gateway': 'Foundations & APIs',
  'websocket-system': 'Foundations & APIs',
  'dns-system': 'Foundations & APIs',
  'graphql-api': 'Foundations & APIs',
  
  'load-balancer': 'Traffic & Access',
  'rate-limiting': 'Traffic & Access',
  'consistent-hashing': 'Traffic & Access',
  
  'redis-cache': 'Data & Messaging',
  'cdn-system': 'Data & Messaging',
  'message-queue': 'Data & Messaging',
  'queue-load-leveling': 'Data & Messaging',
  'distributed-cache': 'Data & Messaging',
  'pub-sub': 'Data & Messaging',
  
  'db-replication': 'Scaling & Reliability',
  'horizontal-scaling': 'Scaling & Reliability',
  'vertical-scaling': 'Scaling & Reliability',
  'db-sharding': 'Scaling & Reliability',
  'failover-system': 'Scaling & Reliability',
  'circuit-breaker': 'Scaling & Reliability',
  'microservices': 'Scaling & Reliability',
  'event-driven': 'Scaling & Reliability',
  'cap-theorem': 'Scaling & Reliability',
  'service-discovery': 'Scaling & Reliability',
  'distributed-locks': 'Scaling & Reliability',
  'pacelc-theorem': 'Scaling & Reliability',

  // DATABASE
  'db-table-sim': 'SQL Fundamentals',
  'primary-key-viz': 'SQL Fundamentals',
  'foreign-key-viz': 'SQL Fundamentals',
  'sql-joins': 'Querying & Indexing',
  'db-indexing': 'Querying & Indexing',
  'b-plus-tree': 'Querying & Indexing',
  'query-execution-engine': 'Engine & Schema Design',
  'normalization-lab': 'Engine & Schema Design',
  'acid-transactions': 'Transactions & Concurrency',
  'concurrency-control': 'Transactions & Concurrency',
  'mongodb-document': 'NoSQL & Caching',
  'mongodb-aggregation': 'NoSQL & Caching',
  'cache-visualizer': 'NoSQL & Caching',
  'db-sharding-viz': 'Distributed Scaling',
  'db-replication-viz': 'Distributed Scaling',
  'cap-theorem-viz': 'Distributed Scaling',
  
  // DATABASE ROADMAP
  'query-optimizer': 'Engine & Schema Design',
  'materialized-views': 'Engine & Schema Design',
  'oltp-olap': 'OLAP & Warehousing',
  'data-warehousing': 'OLAP & Warehousing',
  'snowflake-schema': 'OLAP & Warehousing',
  'star-schema': 'OLAP & Warehousing',
  'distributed-databases': 'Distributed Scaling',
  'event-sourcing': 'Distributed Patterns',
  'cqrs': 'Distributed Patterns',
  'cdc-pattern': 'Distributed Patterns',
  'elasticsearch': 'Specialized Indexes',
  'vector-databases': 'Specialized Indexes',
  'postgresql-internals': 'Engine & Schema Design'
};

export default function InteractiveVisualizer() {
  const [activeCategory, setActiveCategory] = useState('DSA');
  const [activeTopicId, setActiveTopicId] = useState('arraylist');

  // Find active topic object
  const categoryTopics = VISUALIZER_REGISTRY[activeCategory] || [];
  let activeTopic = categoryTopics.find(t => t.id === activeTopicId);
  
  // Fallback if activeTopicId is not in the current category
  if (!activeTopic && categoryTopics.length > 0) {
    activeTopic = categoryTopics[0];
  }

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    const firstTopic = VISUALIZER_REGISTRY[cat]?.[0];
    if (firstTopic) {
      setActiveTopicId(firstTopic.id);
    }
  };

  // Group topics for current category
  const groupedTopics = [];
  categoryTopics.forEach(topic => {
    const groupName = TOPIC_GROUPS[topic.id] || 'General';
    let group = groupedTopics.find(g => g[0] === groupName);
    if (!group) {
      group = [groupName, []];
      groupedTopics.push(group);
    }
    group[1].push(topic);
  });

  const isDatabase = activeCategory === 'DATABASE';

  return (
    <div className="visualizer-tab-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* Category Tabs Header (JAVA, DSA, SYSTEM DESIGN, DATABASE) */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--bg-tertiary)',
        paddingBottom: '0.5rem',
        gap: '1rem',
        overflowX: 'auto'
      }}>
        {Object.keys(VISUALIZER_REGISTRY).map(catKey => {
          const isActive = activeCategory === catKey;
          return (
            <button
              key={catKey}
              onClick={() => handleCategoryChange(catKey)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? '#1591DC' : 'var(--text-secondary)',
                borderBottom: isActive ? '2.5px solid #1591DC' : '2.5px solid transparent',
                padding: '0.6rem 1.25rem',
                fontSize: '0.95rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {catKey.replace('_', ' ')}
            </button>
          );
        })}
      </div>

      {/* Main split layout: Sidebar + Workspace */}
      <div className="visualizer-split-layout">
        
        {/* Left Column: Navigation Sidebar */}
        <div className="visualizer-sidebar">
          {groupedTopics.map(([groupName, topics]) => (
            <div key={groupName} className="sidebar-group">
              <div className="sidebar-group-title">{groupName}</div>
              <div className="sidebar-group-items">
                {topics.map(topic => {
                  const isActive = activeTopicId === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => setActiveTopicId(topic.id)}
                      className={`sidebar-item-btn ${isActive ? 'active' : ''}`}
                    >
                      <i className={topic.icon}></i>
                      <span className="topic-name-text">{topic.name}</span>
                      {topic.isPlaceholder && <span className="coming-soon-badge">Soon</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Display Board Workspace */}
        <div className="visualizer-display-board" style={{ margin: 0 }}>
        {activeTopic ? (
          activeTopic.isPlaceholder ? (
            /* Render Dynamic Roadmap Card Blueprint */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                borderBottom: '1px solid var(--bg-tertiary)',
                paddingBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem'
              }}>
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#FFFFFF', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className={activeTopic.icon} style={{ color: '#1591DC' }}></i> {activeTopic.name}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem', margin: 0 }}>
                    {activeTopic.description}
                  </p>
                </div>
                {/* Roadmap Badges */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '3px',
                    border: isDatabase ? '1px solid #1591DC' : '1px solid #f59e0b',
                    color: isDatabase ? '#1591DC' : '#f59e0b',
                    backgroundColor: isDatabase ? 'rgba(21, 145, 220, 0.05)' : 'rgba(245, 158, 11, 0.05)'
                  }}>
                    Diff: {activeTopic.difficulty || 'Intermediate'}
                  </span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '3px',
                    border: isDatabase ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid #ef4444',
                    color: isDatabase ? '#FFFFFF' : '#ef4444',
                    backgroundColor: isDatabase ? 'rgba(255, 255, 255, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                  }}>
                    Freq: {activeTopic.frequency || 'High'}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '1.5rem',
                alignItems: 'start'
              }} className="visualizer-grid-layout">
                
                {/* Left side: Interactive mockup diagram */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div className="viz-simulator-canvas" style={{
                    minHeight: '230px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'var(--bg-primary)',
                    border: '1px dashed var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.5rem'
                  }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>
                      Visual Blueprint Mockup
                    </span>
                    <PreviewDiagram type={activeTopic.previewType} />
                  </div>

                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.25rem'
                  }}>
                    <h5 style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fa-solid fa-map" style={{ color: '#1591DC' }}></i> Learning Objective
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                      {activeTopic.objective}
                    </p>
                  </div>
                </div>

                {/* Right side: Planned features checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--bg-tertiary)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1.25rem'
                  }}>
                    <h5 style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fa-solid fa-list-check" style={{ color: isDatabase ? '#1591DC' : '#10b981' }}></i> Planned Simulation Features
                    </h5>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {(activeTopic.features || []).map((feat, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <span style={{ color: isDatabase ? '#1591DC' : '#10b981', fontWeight: '700' }}>✓</span>
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeTopic.companies && activeTopic.companies.length > 0 && (
                    <div style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--bg-tertiary)',
                      borderRadius: 'var(--border-radius-md)',
                      padding: '1.25rem'
                    }}>
                      <h5 style={{ color: '#FFFFFF', fontWeight: '700', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fa-solid fa-building" style={{ color: isDatabase ? '#1591DC' : '#f59e0b' }}></i> Industry Adoption
                      </h5>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {activeTopic.companies.map((company, cIdx) => (
                          <span key={cIdx} style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '0.2rem 0.5rem',
                            backgroundColor: isDatabase ? 'rgba(21, 145, 220, 0.05)' : 'rgba(245, 158, 11, 0.05)',
                            border: isDatabase ? '1px solid rgba(21, 145, 220, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '3px',
                            color: isDatabase ? '#1591DC' : '#f59e0b'
                          }}>
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{
                    backgroundColor: 'rgba(21, 145, 220, 0.02)',
                    border: '1px dashed rgba(21, 145, 220, 0.3)',
                    borderRadius: 'var(--border-radius-md)',
                    padding: '1rem 1.25rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.4'
                  }}>
                    <strong>Release Roadmap:</strong> This simulation is scheduled for final integration. Clicking its selector highlights its planned controls, allowing you to preview the curriculum scope.
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Render fully implemented visualizer component */
            <activeTopic.component />
          )
        ) : (
          <div style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', textAlign: 'center', padding: '2rem 0' }}>
            No visualizer selected. Select a category and sub-topic above to begin.
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
