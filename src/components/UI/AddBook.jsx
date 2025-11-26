import React, { useState } from 'react';
import { useData } from '../../Provider/DataProvider';
import LoadingSpinner from './LoadingSpinner';
import './AddBook.css';

const AddBook = () => {
  const { addBook, loading, error } = useData();
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    content: '',
    category: '',
    publishedYear: new Date().getFullYear(),
    tags: ''
  });

  const categories = [
    'Technology',
    'Computer Science',
    'Data Science',
    'Web Development',
    'Physics',
    'Mathematics',
    'Business',
    'Science',
    'Philosophy',
    'History',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    
    // Validate form
    if (!formData.title.trim() || !formData.author.trim() || !formData.content.trim()) {
      return;
    }

    try {
      const bookData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        publishedYear: parseInt(formData.publishedYear)
      };

      const result = await addBook(bookData);
      
      if (result) {
        setSuccess(true);
        // Reset form
        setFormData({
          title: '',
          author: '',
          description: '',
          content: '',
          category: '',
          publishedYear: new Date().getFullYear(),
          tags: ''
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error adding book:', err);
    }
  };

  const handleClearForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      content: '',
      category: '',
      publishedYear: new Date().getFullYear(),
      tags: ''
    });
    setSuccess(false);
  };

  return (
    <div className="add-book">
      <div className="add-book-header">
        <h1 className="page-title">➕ Add New Book</h1>
        <p className="page-subtitle">
          Add a new book to your knowledge base for RAG queries
        </p>
      </div>

      {success && (
        <div className="success-message">
          <span className="success-icon">✅</span>
          <p>Book added successfully! It's now available in your library.</p>
        </div>
      )}

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="add-book-form">
        <div className="form-section">
          <h2 className="section-title">📖 Basic Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter book title"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="author" className="form-label">
                Author <span className="required">*</span>
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
                className="form-input"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="publishedYear" className="form-label">
                Published Year
              </label>
              <input
                type="number"
                id="publishedYear"
                name="publishedYear"
                value={formData.publishedYear}
                onChange={handleInputChange}
                placeholder="2024"
                min="1000"
                max={new Date().getFullYear() + 5}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the book"
              className="form-textarea"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags" className="form-label">
              Tags
              <span className="field-hint">Separate multiple tags with commas</span>
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="AI, Machine Learning, Technology"
              className="form-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h2 className="section-title">📄 Content</h2>
          
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Book Content <span className="required">*</span>
              <span className="field-hint">
                This content will be used for RAG queries. Include key information and concepts.
              </span>
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Enter the main content of the book..."
              className="form-textarea content-textarea"
              rows="12"
              required
            />
            <div className="character-count">
              {formData.content.length} characters
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={handleClearForm}
            className="clear-button"
            disabled={loading}
          >
            🗑️ Clear Form
          </button>
          
          <button
            type="submit"
            className="submit-button"
            disabled={loading || !formData.title.trim() || !formData.author.trim() || !formData.content.trim()}
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" color="white" />
                Adding Book...
              </>
            ) : (
              <>
                ✨ Add Book
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;