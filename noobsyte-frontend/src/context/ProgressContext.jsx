import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const ProgressContext = createContext({});

export const ProgressProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeStreak, setActiveStreak] = useState(0);
  const [totalXp, setTotalXp] = useState(0);
  const [bookmarks, setBookmarks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Automatically fetch telemetry summary on user session loading
  useEffect(() => {
    if (user && token) {
      fetchProgressSummary();
      fetchBookmarks();
    } else {
      setCompletedLessons([]);
      setActiveStreak(0);
      setTotalXp(0);
      setBookmarks([]);
      setSearchResults([]);
    }
  }, [user, token]);

  const fetchProgressSummary = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/progress/summary`);
      const { totalCompletedLessons, totalXp: xp, activeStreak: streak, completedLessonIds } = response.data.data;
      setCompletedLessons(completedLessonIds);
      setActiveStreak(streak);
      setTotalXp(xp);
    } catch (error) {
      console.error('Error fetching progress telemetry:', error.message);
    }
  };

  const markComplete = async (lessonId) => {
    try {
      await axios.post(`${API_URL}/api/v1/progress/lessons/${lessonId}/complete`);
      await fetchProgressSummary();
    } catch (error) {
      console.error('Error marking lesson complete:', error.message);
    }
  };

  const submitScore = async (lessonId, selectedOptionIndex, questionIndex = 0) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/progress/lessons/${lessonId}/quiz-submit`, { selectedOptionIndex, questionIndex });
      await fetchProgressSummary();
      return {
        success: true,
        isCorrect: response.data.data.isCorrect,
        correctAnswerIndex: response.data.data.correctAnswerIndex,
        explanation: response.data.data.explanation
      };
    } catch (error) {
      console.error('Error logging quiz scores telemetry:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/users/bookmarks`);
      setBookmarks(response.data.data.bookmarks);
    } catch (error) {
      console.error('Error fetching bookmarked lessons:', error.message);
    }
  };

  const toggleBookmark = async (lessonId) => {
    try {
      await axios.post(`${API_URL}/api/v1/users/bookmarks/${lessonId}`);
      await fetchBookmarks();
    } catch (error) {
      console.error('Error toggling bookmark status:', error.message);
    }
  };

  const searchLessons = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/courses/search?q=${query}`);
      setSearchResults(response.data.data.lessons);
    } catch (error) {
      console.error('Error searching curriculum lessons index:', error.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <ProgressContext.Provider value={{
      completedLessons,
      activeStreak,
      totalXp,
      bookmarks,
      searchResults,
      searching,
      fetchProgressSummary,
      markComplete,
      submitScore,
      fetchBookmarks,
      toggleBookmark,
      searchLessons,
      setSearchResults
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
