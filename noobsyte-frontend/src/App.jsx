import React, { useState, useContext, useEffect } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { LearningProvider } from './context/LearningContext';
import { ProgressProvider, ProgressContext } from './context/ProgressContext';
import Login from './pages/Login';
import Register from './pages/Register';
import CourseCatalog from './pages/CourseCatalog';
import LessonViewer from './pages/LessonViewer';
import Bookmarks from './pages/Bookmarks';
import CertificateViewer from './pages/CertificateViewer';
import './App.css';

function AppContent() {
  const { user, logout } = useContext(AuthContext);
  const { 
    activeStreak, 
    totalXp, 
    searchResults, 
    searching, 
    searchLessons, 
    setSearchResults 
  } = useContext(ProgressContext);

  const [activeScreen, setActiveScreen] = useState('home');
  const [selectedLessonSlug, setSelectedLessonSlug] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [certificateCourseSlug, setCertificateCourseSlug] = useState(null);
  const [activeCatalogTab, setActiveCatalogTab] = useState('learning');
  const [selectedCourseSlug, setSelectedCourseSlug] = useState(null);

  // Initialize theme state: default 'dark' black and white minimalist
  const [theme, setTheme] = useState(localStorage.getItem('ns_theme') || 'dark');

  useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('ns_theme', nextTheme);
  };

  // Handle live typing query updates
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length > 1) {
        searchLessons(searchQuery);
        setActiveScreen('search');
      } else if (searchQuery.trim().length === 0 && activeScreen === 'search') {
        setSearchResults([]);
        setActiveScreen('home');
      }
    }, 400); // 400ms typing debouncing

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = () => {
    logout();
    setSelectedLessonSlug(null);
    setCertificateCourseSlug(null);
    setSearchQuery('');
    setSearchResults([]);
    setActiveCatalogTab('learning');
    setSelectedCourseSlug(null);
    setActiveScreen('home');
  };

  const handleSelectLesson = (lessonSlug) => {
    if (!user) {
      alert('Please sign in to access interactive visual lessons, SVG simulators, and quiz assessments!');
      setActiveScreen('login');
      return;
    }
    setSelectedLessonSlug(lessonSlug);
    setSearchQuery('');
    setSearchResults([]);
    setActiveScreen('lesson');
  };

  const handleCloseSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setActiveScreen('home');
  };

  const handleNavbarCoursesClick = () => {
    setSelectedLessonSlug(null);
    handleCloseSearch();
    setActiveCatalogTab('learning');
    setSelectedCourseSlug(null);
  };

  const handleClaimCertificate = (courseSlug) => {
    if (!user) {
      alert('Please sign in to claim verified credentials!');
      setActiveScreen('login');
      return;
    }
    setCertificateCourseSlug(courseSlug);
  };

  return (
    <div className={`app-container ${theme}-theme`}>
      {/* Premium Minimalist Navigation Header */}
      <header className="navbar">
        <div 
          className="logo-container" 
          onClick={handleNavbarCoursesClick} 
          style={{ cursor: 'pointer' }}
        >
          <span className="logo-glow">noob</span>
          <span className="logo-text">Syte</span>
        </div>
        
        {/* Navbar Search Input */}
        <div className="search-bar-container">
          <i className="fa-solid fa-magnifying-glass search-bar-icon"></i>
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="navbar-search-input"
          />
          {searchQuery && (
            <button className="btn-clear-search" onClick={handleCloseSearch}>×</button>
          )}
        </div>
        
        <nav className="nav-links">
          <button 
            className={`nav-btn ${(activeScreen === 'home' || activeScreen === 'lesson') ? 'active' : ''}`}
            onClick={handleNavbarCoursesClick}
          >
            Courses
          </button>
          <button 
            className={`nav-btn ${activeScreen === 'bookmarks' ? 'active' : ''}`}
            onClick={() => { setSelectedLessonSlug(null); setSearchQuery(''); setActiveScreen('bookmarks'); }}
          >
            Bookmarks
          </button>
        </nav>

        <div className="user-profile">
          {/* Light/Dark Toggle Button */}
          <button className="btn-theme-toggle" onClick={toggleTheme} title="Toggle Light/Dark Theme">
            {theme === 'dark' ? (
              <i className="fa-solid fa-sun icon-theme"></i>
            ) : (
              <i className="fa-solid fa-moon icon-theme"></i>
            )}
          </button>

          {user ? (
            <>
              <div className="xp-badge">
                <i className="fa-solid fa-award icon-badge-xp"></i>
                {totalXp} XP
              </div>
              <div className="streak-badge">
                <i className="fa-solid fa-fire icon-badge-streak"></i>
                {activeStreak} Days
              </div>
              <button className="btn-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-login-header" onClick={() => { setSelectedLessonSlug(null); setSearchQuery(''); setActiveScreen('login'); }}>
                Sign In
              </button>
              <button className="btn-register-header" onClick={() => { setSelectedLessonSlug(null); setSearchQuery(''); setActiveScreen('register'); }}>
                Register
              </button>
            </>
          )}
        </div>
      </header>

      {/* Screen Dispatcher */}
      {activeScreen === 'login' && (
        <Login 
          onSwitchScreen={setActiveScreen} 
          onLoginSuccess={() => setActiveScreen('home')} 
        />
      )}

      {activeScreen === 'register' && (
        <Register 
          onSwitchScreen={setActiveScreen} 
          onRegisterSuccess={() => setActiveScreen('home')} 
        />
      )}

      {activeScreen === 'lesson' && selectedLessonSlug && (
        <LessonViewer 
          lessonSlug={selectedLessonSlug} 
          onCloseViewer={() => { setSelectedLessonSlug(null); setActiveScreen('home'); }} 
        />
      )}

      {activeScreen === 'bookmarks' && (
        <Bookmarks onSelectLesson={handleSelectLesson} />
      )}

      {certificateCourseSlug && (
        <CertificateViewer 
          courseSlug={certificateCourseSlug} 
          onClose={() => setCertificateCourseSlug(null)} 
          theme={theme}
        />
      )}

      {activeScreen === 'search' && (
        <div className="catalog-wrapper">
          <div className="catalog-header">
            <h2>
              <i className="fa-solid fa-magnifying-glass icon-header-search"></i> Search Results for "{searchQuery}"
            </h2>
            <button className="btn-close-search-results" onClick={handleCloseSearch}>
              Clear Search & Return Home
            </button>
          </div>

          {searching ? (
            <div className="loading-spinner">Searching curriculum indexes...</div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="lessons-slugs-list" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
              {searchResults.map((lesson) => (
                <button
                  key={lesson._id}
                  className="lesson-link-row"
                  onClick={() => handleSelectLesson(lesson.slug)}
                >
                  <span className="play-icon">
                    <i className="fa-solid fa-play"></i>
                  </span>
                  <div className="search-result-details" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span className="lesson-link-title" style={{ fontSize: '1.05rem' }}>{lesson.title}</span>
                    <span className="search-result-module" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      In: {lesson.module?.title || 'Java Fundamentals'}
                    </span>
                  </div>
                  <span className="read-badge">Go to Lesson →</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="empty-bookmarks-panel">
              <p className="empty-icon">
                <i className="fa-solid fa-magnifying-glass search-empty-icon"></i>
              </p>
              <h4>No Results Found</h4>
              <p className="empty-subtext">
                We couldn't find any lessons matching "{searchQuery}". Try searching for keywords like "references", "value", or "pointers".
              </p>
            </div>
          )}
        </div>
      )}

      {activeScreen === 'home' && (
        <CourseCatalog 
          onSelectLesson={handleSelectLesson} 
          onClaimCertificate={handleClaimCertificate} 
          activeCatalogTab={activeCatalogTab}
          setActiveCatalogTab={setActiveCatalogTab}
          selectedCourseSlug={selectedCourseSlug}
          setSelectedCourseSlug={setSelectedCourseSlug}
        />
      )}

      {activeScreen !== 'lesson' && activeCatalogTab !== 'sandbox' && (
        <footer className="platform-footer">
          <p>© 2026 NoobSyte Educational Platform.</p>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LearningProvider>
        <ProgressProvider>
          <AppContent />
        </ProgressProvider>
      </LearningProvider>
    </AuthProvider>
  );
}

export default App;
