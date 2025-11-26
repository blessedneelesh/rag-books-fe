import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import axios, { Axios } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { mockBooks, mockConversations } from '../utils/mockData';

// Create the Data Context
const DataContext = createContext();

// Custom hook to use the Data Context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// API configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'https://localhost:7121/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Create axios instance
const apiClient = axios.create(API_CONFIG);

// Generate session ID using UUID
const generateSessionId = () => {
  return uuidv4();
};

// DataProvider component
export const DataProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [ragResponse, setRagResponse] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  // Initialize with mock data
  useEffect(() => {
        // Generate session ID when component mounts
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    console.log('Session ID generated:', newSessionId);
    
    setBooks(mockBooks);
    setConversations(mockConversations);
  }, []);

  // API Functions
  const askRAG = async (Prompt) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentQuery(Prompt);
      try {
     const response = await apiClient.post('/chat/stream', { 
          Prompt
        }, {
          headers: {
            'session-id': sessionId,
            'Content-Type': 'application/json'
          }
        });
        
        
        const ragResult = response.data;
        setRagResponse(ragResult);
        console.log('RAG Response:', ragResult);
        // Add to conversations
        const newConversation = {
          id: conversations.length + 1,
          user: Prompt,
          assistant: ragResult.response,
          sources: ragResult.sources?.map(s => s.id) || [],
          timestamp: new Date().toISOString()
        };
        
        setConversations(prev => [...prev, newConversation]);
        return ragResult;
        
      } catch (apiError) {
        // Mock RAG response
        const relevantBooks = mockBooks.filter(book => 
          book.content.toLowerCase().includes(Prompt.toLowerCase()) ||
          book.title.toLowerCase().includes(Prompt.toLowerCase())
        );
        
        const mockResponse = {
          query: Prompt,
          response: `Based on the available information, ${Prompt.toLowerCase().includes('machine learning') 
            ? 'machine learning is a subset of AI that enables computers to learn from data without explicit programming.'
            : 'here is what I found in the knowledge base that relates to your Prompt.'
          }`,
          sources: relevantBooks.slice(0, 3).map(book => ({
            id: book.id,
            title: book.title,
            relevance: Math.random() * 0.3 + 0.7,
            excerpt: book.content.substring(0, 100) + '...'
          })),
          confidence: Math.random() * 0.3 + 0.7
        };
        
        setRagResponse(mockResponse);
        
        const newConversation = {
          id: conversations.length + 1,
          user: Prompt,
          assistant: mockResponse.response,
          sources: mockResponse.sources.map(s => s.id),
          timestamp: new Date().toISOString()
        };
        
        setConversations(prev => [...prev, newConversation]);
        return mockResponse;
      }
    } catch (err) {
      setError('RAG query failed');
      return null;
    } finally {
      setLoading(false);
    }
  };



  const clearConversations = () => {
    setConversations([]);
    setRagResponse(null);
    // ✅ Generate new session ID when starting new chat
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    console.log('New chat started - New session ID generated:', newSessionId);
  };

  // Context value
  const value = useMemo(() => ({
    // State
    books,
    conversations,
    loading,
    error,
    currentQuery,
    ragResponse,
    
    // Actions
    askRAG,
    clearConversations,
    
    // Utilities
    setError: (error) => setError(error),
    clearError: () => setError(null)
  }), [books, conversations, loading, error, currentQuery, ragResponse]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// PropTypes validation
DataProvider.propTypes = {
  children: PropTypes.node.isRequired
};