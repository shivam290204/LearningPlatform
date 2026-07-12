// noobsyte-frontend/src/components/roadmaps/CustomRoadmapNode.jsx
import React from 'react';
import { Handle, Position } from 'reactflow';
import './CustomRoadmapNode.css';

export default function CustomRoadmapNode({ data }) {
  const isExpanded = data?.isExpanded || false;
  const lessons = data?.lessons || [];
  const moduleNumber = data?.step || '1';
  const cleanTitle = (data?.label || '').replace(/^Module \d+:\s*/i, '');

  const handleCardClick = (e) => {
    // Prevent toggle if clicking action button directly
    if (e.target.closest('.node-action-btn')) return;
    if (data?.onToggle) {
      data.onToggle(data.id);
    }
  };

  return (
    <div
      className={`custom-roadmap-node ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
      onClick={handleCardClick}
    >
      {/* Top connector handle */}
      {data?.showTopHandle !== false && (
        <Handle
          type="target"
          position={Position.Top}
          className="roadmap-handle handle-top"
        />
      )}

      <div className="node-card-inner">
        {/* Collapsed / Always Visible Header */}
        <div className="node-card-header">
          <div className="node-header-left">
            <span className="node-badge">
              MODULE {moduleNumber}
            </span>
            <span className="node-lesson-count">
              <i className="fa-solid fa-book-open"></i> {lessons.length} {lessons.length === 1 ? 'Lesson' : 'Lessons'}
            </span>
          </div>

          <button
            className="node-toggle-btn"
            aria-label={isExpanded ? 'Collapse module' : 'Expand module details'}
          >
            <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>
        </div>

        <h4 className="node-card-title">{cleanTitle}</h4>

        {/* Expanded Content Area */}
        <div className={`node-expanded-body ${isExpanded ? 'expanded' : ''}`}>
          {data?.description && (
            <p className="node-card-desc">{data.description}</p>
          )}

          <div className="node-stats-bar">
            <span className="stat-item">
              <i className="fa-regular fa-clock"></i> {data?.totalTime || '2 Hours'}
            </span>
            <span className="stat-item">
              <i className="fa-solid fa-signal"></i> {data?.difficulty || 'Core Curriculum'}
            </span>
          </div>

          {lessons.length > 0 && (
            <div className="node-syllabus-list">
              <div className="syllabus-header">
                <span>CURRICULUM LESSONS</span>
              </div>
              <ul className="lessons-list">
                {lessons.map((lesson, idx) => (
                  <li key={lesson.id || idx} className="lesson-item">
                    <span className="lesson-index">{idx + 1}.</span>
                    <span className="lesson-name">{lesson.title}</span>
                    {lesson.estTime && (
                      <span className="lesson-time">{lesson.estTime}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data?.onJump && (
            <div className="node-card-footer">
              <button
                type="button"
                className="node-action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  data.onJump(data);
                }}
              >
                <span>Explore Lessons</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom connector handle */}
      {data?.showBottomHandle !== false && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="roadmap-handle handle-bottom"
        />
      )}
    </div>
  );
}
