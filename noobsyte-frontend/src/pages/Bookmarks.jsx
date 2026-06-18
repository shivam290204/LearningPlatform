import React, { useContext, useEffect } from 'react';
import { ProgressContext } from '../context/ProgressContext';

function Bookmarks({ onSelectLesson }) {
  const { bookmarks, fetchBookmarks, loading } = useContext(ProgressContext);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="catalog-wrapper">
      <div className="catalog-header">
        <h2><i className="fa-solid fa-bookmark" style={{ color: 'var(--brand-cyan)', marginRight: '0.55rem' }}></i> Your Bookmarked Modules</h2>
        <p>Quick access to all lessons you pinned for quick revision and reviews.</p>
      </div>

      {loading ? (
        <div className="loading-spinner">Hydrating bookmarks cache...</div>
      ) : bookmarks && bookmarks.length > 0 ? (
        <div className="catalog-grid">
          {bookmarks.map((lesson) => (
            <div key={lesson._id} className="catalog-card-container">
              <div className="catalog-course-card" onClick={() => onSelectLesson(lesson.slug)}>
                <div className="card-badge premium">Pinned</div>
                <h3>{lesson.title}</h3>
                <p>
                  Review structural variables declarations, pointer reference scopes, and memory diagrams in this lesson.
                </p>
                <div className="card-footer">
                  <span className="difficulty beginner">10 Min Read</span>
                  <button className="btn-explore-modules">
                    Resume Lesson →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-bookmarks-panel">
          <p className="empty-icon">
            <i className="fa-solid fa-bookmark" style={{ color: 'var(--brand-cyan)' }}></i>
          </p>
          <h4>Your Pinned Board is Empty</h4>
          <p className="empty-subtext">
            Pin hard concepts, Stack vs Heap memory layouts, or MCQs quiz widgets while reading to review them here at any time.
          </p>
        </div>
      )}
    </div>
  );
}

export default Bookmarks;
