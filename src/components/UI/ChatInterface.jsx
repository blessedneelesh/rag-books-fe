import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../../Provider/DataProvider';
import LoadingSpinner from './LoadingSpinner';
import './ChatInterface.css';

const ChatInterface = () => {
  const { 
    conversations, 
    askRAG, 
    loading, 
    error, 
    clearConversations,
    books,
    ragResponse,
    setError
  } = useData();
  
  const [query, setQuery] = useState('');
  const [currentResponse, setCurrentResponse] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations, currentResponse]);

  useEffect(() => {
    // Reset currentResponse when conversations are cleared
    if (conversations.length === 0) {
      setCurrentResponse(null);
    }
  }, [conversations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const questionToAsk = query.trim();
    setQuery('');
    
    // Clear any existing errors
    if (error) {
      setError(null);
    }
    
    try {
      const response = await askRAG(questionToAsk);
      setCurrentResponse(response);
    } catch (err) {
      console.error('Error asking RAG:', err);
      setError('Failed to get response. Please try again.');
    }
  };

  const getSourceBook = (sourceId) => {
    return books.find(book => book.id === sourceId);
  };

  const handleExampleClick = (exampleText) => {
    // Remove quotes from the example text and set it in the input
    const cleanText = exampleText.replace(/"/g, '');
    setQuery(cleanText);
    // Focus the input field after setting the text
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

   // Function to format text with paragraphs and bullet points
  const formatText = (text) => {
    if (!text) return null;
    
    // Split text into lines
    const lines = text.split('\n').filter(line => line.trim());
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if line starts with bullet point indicators
      if (trimmedLine.match(/^[-*•]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
        return (
          <li key={index} className="formatted-list-item">
            {trimmedLine.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '')}
          </li>
        );
      }
      // Check if it's a header (starts with # or is all caps)
      else if (trimmedLine.match(/^#+\s+/) || (trimmedLine.length < 50 && trimmedLine === trimmedLine.toUpperCase())) {
        return (
          <h4 key={index} className="formatted-header">
            {trimmedLine.replace(/^#+\s+/, '')}
          </h4>
        );
      }
      // Regular paragraph
      else {
        return (
          <p key={index} className="formatted-paragraph">
            {trimmedLine}
          </p>
        );
      }
    });
  };

  // Function to wrap consecutive list items in <ul>
  const formatTextWithLists = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n').filter(line => line.trim());
    const elements = [];
    let currentList = [];
    let isInList = false;
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Check if line is a bullet point
      if (trimmedLine.match(/^[-*•]\s+/) || trimmedLine.match(/^\d+\.\s+/)) {
        currentList.push(
          <li key={`li-${index}`}>
            {trimmedLine.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '')}
          </li>
        );
        isInList = true;
      } else {
        // If we were in a list and now we're not, close the list
        if (isInList) {
          elements.push(
            <ul key={`ul-${elements.length}`} className="formatted-list">
              {currentList}
            </ul>
          );
          currentList = [];
          isInList = false;
        }
        
        // Handle headers and paragraphs
        if (trimmedLine.match(/^#+\s+/) || (trimmedLine.length < 50 && trimmedLine === trimmedLine.toUpperCase())) {
          elements.push(
            <h4 key={`h4-${index}`} className="formatted-header">
              {trimmedLine.replace(/^#+\s+/, '')}
            </h4>
          );
        } else if (trimmedLine) {
          elements.push(
            <p key={`p-${index}`} className="formatted-paragraph">
              {trimmedLine}
            </p>
          );
        }
      }
    });
    
    // Close any remaining list
    if (isInList) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="formatted-list">
          {currentList}
        </ul>
      );
    }
    
    return elements;
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {conversations.length === 0 && !currentResponse && (
          <div className="welcome-message">
            <div className="welcome-content">
              <h3>👋 Welcome to RAG Books Assistant!</h3>
              <p>Ask me anything about the books in your library. I'll search through the content and provide detailed answers with sources.</p>
              <div className="example-queries">
                <p><strong>Try asking:</strong></p>
                <ul>
                  <li onClick={() => handleExampleClick('"Summarize this book."')}>"Summarize this book."</li>
                  <li onClick={() => handleExampleClick('"How to achieve deep work?"')}>"How to achieve deep work?"</li>
                  <li onClick={() => handleExampleClick('"What is deep work?"')}>"What is deep work?"</li>
                  <li onClick={() => handleExampleClick('"Importance of deep work?"')}>"Importance of deep work?"</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {conversations.map((conversation) => (
          <div key={conversation.id} className="conversation">
            <div className="message user-message">
              <div className="message-avatar">👤</div>
              <div className="message-content">
                <p>{conversation.user}</p>
                <span className="message-time">
                  {new Date(conversation.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <div className="message assistant-message">
              <div className="message-avatar">🤖</div>
              <div className="message-content">
                <p>{formatTextWithLists(ragResponse)}</p>
                {conversation.sources && conversation.sources.length > 0 && (
                  <div className="sources">
                    <h4>📚 Sources: {ragResponse}</h4>
                    <div className="source-list">
                      {conversation.sources.map((sourceId) => {
                        const book = getSourceBook(sourceId);
                        return book ? (
                          <div key={sourceId} className="source-item">
                            <span className="source-title">{book.title}</span>
                            <span className="source-author">by {book.author}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )} 
                
                <span className="message-time">
                  {new Date(conversation.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message assistant-message">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <LoadingSpinner />
              <p className="typing-indicator">Thinking...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your books..."
            className="chat-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !query.trim()}
            className="send-button"
          >
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <span className="send-icon">📤</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;