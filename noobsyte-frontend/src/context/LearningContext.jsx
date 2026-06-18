import React, { createContext, useState } from 'react';
import axios from 'axios';

export const LearningContext = createContext({});

export const LearningProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/courses`);
      setCourses(response.data.data.courses);
    } catch (error) {
      console.error('Error fetching courses list:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseModules = async (courseSlug) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/v1/courses/${courseSlug}/modules`);
      setModules(response.data.data.modules);
    } catch (error) {
      console.error('Error fetching modules list:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLesson = async (lessonSlug) => {
    setLoading(true);
    try {
      // Passes header token (handled by Axios default headers configured in AuthContext)
      const response = await axios.get(`${API_URL}/api/v1/courses/lessons/${lessonSlug}`);
      setCurrentLesson(response.data.data.lesson);
      setCurrentQuiz(response.data.data.quiz);
    } catch (error) {
      console.error('Error retrieving lesson content details:', error.message);
      setCurrentLesson(null);
      setCurrentQuiz(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LearningContext.Provider value={{
      courses,
      modules,
      currentLesson,
      currentQuiz,
      loading,
      fetchCourses,
      fetchCourseModules,
      fetchLesson,
      setCourses,
      setModules,
      setCurrentLesson
    }}>
      {children}
    </LearningContext.Provider>
  );
};
