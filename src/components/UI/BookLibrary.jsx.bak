import React, { useState, useEffect } from 'react';
import { useData } from '../../Provider/DataProvider';
import LoadingSpinner from './LoadingSpinner';
import './BookLibrary.css';

const BookLibrary = () => {
  const { books, searchBooks, loading, error } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  const categories = ['All', ...new Set(books.map(book => book.category))];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
      return;
    }

    try {
      const results = await searchBooks(searchQuery);
      setFilteredBooks(results);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter(book => book.category === category));
    }
    setSearchQuery(''); // Clear search when filtering by category
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setFilteredBooks(books);
  };

  return (
    <div className="book-library">
      <div className="library-header">
        <div className="header-content">
          <h1 className="library-title">📚 Book Library</h1>
          <p className="library-subtitle">
            Browse and search through your knowledge base
          </p>
        </div>
        
        <div className="library-stats">
          <div className="stat-item">
            <span className="stat-number">{books.length}</span>
            <span className="stat-label">Total Books</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{categories.length - 1}</span>
            <span className="stat-label">Categories</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{filteredBooks.length}</span>
            <span className="stat-label">Showing</span>
          </div>
        </div>
      </div>

      <div className="library-controls">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title, author, or content..."
              className="search-input"
            />
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? <LoadingSpinner size="small" /> : '🔍'}
            </button>
          </div>
        </form>

        <div className="filter-controls">
          <div className="category-filters">
            <span className="filter-label">Category:</span>
            <div className="category-buttons">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilter(category)}
                  className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          {(searchQuery || selectedCategory !== 'All') && (
            <button onClick={handleClearFilters} className="clear-filters-button">
              ✖️ Clear Filters
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <div className="books-grid">
        {loading ? (
          <div className="loading-container">
            <LoadingSpinner size="large" />
            <p>Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-content">
              <span className="empty-icon">📖</span>
              <h3>No books found</h3>
              <p>
                {searchQuery ? 
                  `No books match "${searchQuery}". Try a different search term.` :
                  'No books available in this category.'
                }
              </p>
            </div>
          </div>
        ) : (
          filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-header">
                <h3 className="book-title">{book.title}</h3>
                <span className="book-category">{book.category}</span>
              </div>
              
              <div className="book-meta">
                <p className="book-author">✍️ {book.author}</p>
                <p className="book-year">📅 {book.publishedYear}</p>
              </div>
              
              <p className="book-description">{book.description}</p>
              
              <div className="book-tags">
                {book.tags.map((tag, index) => (
                  <span key={index} className="book-tag">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="book-content-preview">
                <h4>📄 Content Preview:</h4>
                <p className="content-excerpt">
                  {book.content.substring(0, 200)}
                  {book.content.length > 200 && '...'}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookLibrary;