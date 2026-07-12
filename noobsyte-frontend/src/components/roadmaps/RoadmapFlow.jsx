// noobsyte-frontend/src/components/roadmaps/RoadmapFlow.jsx
import React, { useState, useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import CustomRoadmapNode from './CustomRoadmapNode';
import { getCurriculumRoadmap } from './roadmapData';
import './RoadmapFlow.css';

const nodeTypes = {
  custom: CustomRoadmapNode
};

const trackCards = [
  {
    id: 'java',
    title: 'Java Masterclass',
    tagline: 'JVM Architecture to Enterprise Spring',
    icon: 'fa-brands fa-java',
    modulesCount: '16 Modules',
    level: 'Core to Advanced'
  },
  {
    id: 'python',
    title: 'Python Ecosystem',
    tagline: 'Clean Scripting & Backend Automation',
    icon: 'fa-brands fa-python',
    modulesCount: '14 Modules',
    level: 'Scripting & APIs'
  },
  {
    id: 'cpp',
    title: 'C++ Systems',
    tagline: 'High-Performance Systems & Memory',
    icon: 'fa-solid fa-code',
    modulesCount: '15 Modules',
    level: 'Systems Mastery'
  },
  {
    id: 'dsa',
    title: 'DSA & Algorithms',
    tagline: 'Big-O Complexity & Problem Solving',
    icon: 'fa-solid fa-diagram-project',
    modulesCount: '18 Modules',
    level: 'Interview Prep'
  }
];

export default function RoadmapFlow({ initialLang = 'java', onStartModule }) {
  const [currentLang, setCurrentLang] = useState(initialLang);
  const [expandedNodeId, setExpandedNodeId] = useState(null);
  const [isScreenExpanded, setIsScreenExpanded] = useState(false);

  const handleTrackSelect = (langId) => {
    setCurrentLang(langId);
    setExpandedNodeId(null);
    setIsScreenExpanded(true);
  };

  const handleToggleExpand = (nodeId) => {
    setExpandedNodeId((prev) => (prev === nodeId ? null : nodeId));
  };

  const handleJumpToModule = (nodeData) => {
    if (onStartModule) {
      onStartModule(currentLang, nodeData);
    }
  };

  const activeRoadmap = useMemo(() => {
    return getCurriculumRoadmap(
      currentLang,
      expandedNodeId,
      handleToggleExpand,
      handleJumpToModule
    );
  }, [currentLang, expandedNodeId]);

  const currentTrack = trackCards.find((t) => t.id === currentLang) || trackCards[0];

  return (
    <div className="stitch-roadmap-showcase">
      {/* Stitch Hero Section Title */}
      <div className="stitch-hero-top">
        <span className="stitch-roadmap-badge">
          <span className="stitch-glow-dot"></span> INTERACTIVE LEARNING ARCHITECTURE
        </span>
        <h2 className="stitch-hero-title">Engineering Curriculum & Visual Roadmaps</h2>
        <p className="stitch-hero-subtitle">
          Explore interactive module flowcharts, inspect live subtopics, and follow structured developer paths.
        </p>
      </div>

      {/* 4 Interactive Track Selection Cards */}
      <div className="stitch-tracks-grid">
        {trackCards.map((track) => {
          const isActive = currentLang === track.id;
          return (
            <div
              key={track.id}
              className={`stitch-track-card ${isActive ? 'is-active' : ''}`}
              onClick={() => handleTrackSelect(track.id)}
            >
              <div className="stitch-track-header">
                <div className="stitch-track-icon">
                  <i className={track.icon}></i>
                </div>
                <span className="stitch-track-level">{track.level}</span>
              </div>
              <h3 className="stitch-track-title">{track.title}</h3>
              <p className="stitch-track-tagline">{track.tagline}</p>
              <div className="stitch-track-footer">
                <span className="stitch-modules-tag">
                  <i className="fa-solid fa-layer-group"></i> {track.modulesCount}
                </span>
                <span className="stitch-card-cta">
                  {isActive ? 'Active Track' : 'Select Track'} <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controller Bar */}
      <div className="stitch-controller-bar">
        <div className="stitch-controller-info">
          <div className="stitch-active-indicator">
            <i className={currentTrack.icon}></i>
            <span>{currentTrack.title} — Interactive Flowchart</span>
          </div>
          <span className="stitch-node-count-badge">
            {activeRoadmap.nodes.length} Modules Loaded
          </span>
        </div>

        <button
          type="button"
          className={`stitch-launch-btn ${isScreenExpanded ? 'is-open' : ''}`}
          onClick={() => setIsScreenExpanded(!isScreenExpanded)}
        >
          <span>{isScreenExpanded ? 'Collapse Canvas' : 'Launch Flowchart Canvas'}</span>
          <i className={`fa-solid ${isScreenExpanded ? 'fa-compress' : 'fa-diagram-project'}`}></i>
        </button>
      </div>

      {/* Expandable Flowchart Canvas Viewport */}
      <div className={`stitch-canvas-viewport ${isScreenExpanded ? 'expanded' : 'collapsed'}`}>
        {isScreenExpanded && (
          <ReactFlow
            key={`${currentLang}-${expandedNodeId || 'all-collapsed'}`}
            nodes={activeRoadmap.nodes}
            edges={activeRoadmap.edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.18 }}
            minZoom={0.2}
            maxZoom={1.5}
            nodesDraggable={true}
            nodesConnectable={false}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#1e293b" gap={24} size={1.5} />
            <Controls />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}
