import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
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
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Create axios instance
const apiClient = axios.create(API_CONFIG);

// DataProvider component
export const DataProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [ragResponse, setRagResponse] = useState(null);

  // Initialize with mock data
  useEffect(() => {
    setBooks(mockBooks);
    setConversations(mockConversations);
  }, []);

  // API Functions
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API, fallback to mock data
      try {
        const response = await apiClient.get('/books');
        setBooks(response.data);
      } catch (apiError) {
        console.log('API not available, using mock data');
        setBooks(mockBooks);
      }
    } catch (err) {
      setError('Failed to fetch books');
      setBooks(mockBooks); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = async (query) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.post('/search', { query });
        return response.data;
      } catch (apiError) {
        // Mock search functionality
        const filtered = mockBooks.filter(book => 
          book.title.toLowerCase().includes(query.toLowerCase()) ||
          book.content.toLowerCase().includes(query.toLowerCase()) ||
          book.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        );
        return filtered;
      }
    } catch (err) {
      setError('Search failed');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const askRAG = async (question) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentQuery(question);

      try {
        const response = await apiClient.post('/rag/query', { 
          question,
          context: books.map(book => ({ id: book.id, content: book.content }))
        });
        
        const ragResult = response.data;
        setRagResponse(ragResult);
        
        // Add to conversations
        const newConversation = {
          id: conversations.length + 1,
          user: question,
          assistant: ragResult.response,
          sources: ragResult.sources?.map(s => s.id) || [],
          timestamp: new Date().toISOString()
        };
        
        setConversations(prev => [...prev, newConversation]);
        return ragResult;
        
      } catch (apiError) {
        // Mock RAG response
        const relevantBooks = mockBooks.filter(book => 
          book.content.toLowerCase().includes(question.toLowerCase()) ||
          book.title.toLowerCase().includes(question.toLowerCase())
        );
        
        const mockResponse = {
          query: question,
          response: `Based on the available information, ${question.toLowerCase().includes('machine learning') 
            ? 'machine learning is a subset of AI that enables computers to learn from data without explicit programming.'
            : 'here is what I found in the knowledge base that relates to your question.'
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
          user: question,
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

  const addBook = async (bookData) => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const response = await apiClient.post('/books', bookData);
        setBooks(prev => [...prev, response.data]);
        return response.data;
      } catch (apiError) {
        // Mock add book
        const newBook = {
          ...bookData,
          id: books.length + 1,
          embedding: Array.from({length: 5}, () => Math.random())
        };
        setBooks(prev => [...prev, newBook]);
        return newBook;
      }
    } catch (err) {
      setError('Failed to add book');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearConversations = () => {
    setConversations([]);
    setRagResponse(null);
  };

  // Context value
  const value = {
    // State
    books,
    conversations,
    loading,
    error,
    currentQuery,
    ragResponse,
    
    // Actions
    fetchBooks,
    searchBooks,
    askRAG,
    addBook,
    clearConversations,
    
    // Utilities
    setError: (error) => setError(error),
    clearError: () => setError(null)
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};