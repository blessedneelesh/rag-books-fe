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
    books 
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const questionToAsk = query.trim();
    setQuery('');
    
    try {
      const response = await askRAG(questionToAsk);
      setCurrentResponse(response);
    } catch (err) {
      console.error('Error asking RAG:', err);
    }
  };

  const handleClearChat = () => {
    clearConversations();
    setCurrentResponse(null);
  };

  const getSourceBook = (sourceId) => {
    return books.find(book => book.id === sourceId);
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="header-info">
          <h2 className="chat-title">💬 Ask Questions About Your Books</h2>
          <p className="chat-subtitle">
            Get AI-powered answers based on your book collection
          </p>
        </div>
        <button 
          onClick={handleClearChat}
          className="clear-button"
          disabled={conversations.length === 0}
        >
          🗑️ Clear Chat
        </button>
      </div>

      <div className="chat-messages">
        {conversations.length === 0 && !currentResponse && (
          <div className="welcome-message">
            <div className="welcome-content">
              <h3>👋 Welcome to RAG Books Assistant!</h3>
              <p>Ask me anything about the books in your library. I'll search through the content and provide detailed answers with sources.</p>
              <div className="example-queries">
                <p><strong>Try asking:</strong></p>
                <ul>
                  <li>"What is machine learning?"</li>
                  <li>"How does natural language processing work?"</li>
                  <li>"Tell me about quantum computing"</li>
                  <li>"What are the fundamentals of data science?"</li>
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
                <p>{conversation.assistant}</p>
                {conversation.sources && conversation.sources.length > 0 && (
                  <div className="sources">
                    <h4>📚 Sources:</h4>
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