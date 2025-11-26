// Mock data for RAG application
export const mockBooks = [
  {
    id: 1,
    title: "The Art of Machine Learning",
    author: "Dr. Sarah Chen",
    description: "A comprehensive guide to understanding and implementing machine learning algorithms in modern applications.",
    content: "This book covers fundamental concepts of machine learning, including supervised and unsupervised learning, neural networks, and deep learning architectures. It provides practical examples and real-world applications that demonstrate how AI can be leveraged to solve complex problems.",
    category: "Technology",
    publishedYear: 2023,
    tags: ["AI", "Machine Learning", "Technology"],
    embedding: [0.1, 0.2, 0.3, 0.4, 0.5] // Mock embedding vector
  },
  {
    id: 2,
    title: "Natural Language Processing Fundamentals",
    author: "Prof. Michael Rodriguez",
    description: "Understanding how computers process and understand human language.",
    content: "This comprehensive guide explores the foundations of natural language processing, covering tokenization, part-of-speech tagging, named entity recognition, and advanced topics like transformer models and attention mechanisms. The book includes practical examples using Python and popular NLP libraries.",
    category: "Computer Science",
    publishedYear: 2022,
    tags: ["NLP", "Language", "AI"],
    embedding: [0.2, 0.3, 0.4, 0.1, 0.6]
  },
  {
    id: 3,
    title: "Data Science in Practice",
    author: "Dr. Emily Watson",
    description: "Practical approaches to data analysis and visualization.",
    content: "This book provides hands-on experience with data science workflows, from data collection and cleaning to advanced analytics and machine learning. It covers statistical analysis, data visualization techniques, and how to communicate insights effectively to stakeholders.",
    category: "Data Science",
    publishedYear: 2023,
    tags: ["Data Science", "Analytics", "Statistics"],
    embedding: [0.3, 0.1, 0.2, 0.5, 0.4]
  },
  {
    id: 4,
    title: "Modern Web Development",
    author: "Alex Thompson",
    description: "Building scalable web applications with modern frameworks.",
    content: "A complete guide to modern web development practices, covering frontend frameworks like React and Vue.js, backend technologies including Node.js and Python, database design, and deployment strategies. The book emphasizes best practices for building maintainable and scalable applications.",
    category: "Web Development",
    publishedYear: 2024,
    tags: ["Web Development", "JavaScript", "React"],
    embedding: [0.4, 0.5, 0.1, 0.3, 0.2]
  },
  {
    id: 5,
    title: "Quantum Computing Explained",
    author: "Dr. James Liu",
    description: "An introduction to quantum computing concepts and applications.",
    content: "This book demystifies quantum computing, explaining complex concepts in accessible terms. It covers quantum bits, superposition, entanglement, and quantum algorithms. The text includes examples of how quantum computing might revolutionize fields like cryptography, optimization, and drug discovery.",
    category: "Physics",
    publishedYear: 2023,
    tags: ["Quantum", "Computing", "Physics"],
    embedding: [0.5, 0.2, 0.4, 0.1, 0.3]
  }
];

export const mockConversations = [
  {
    id: 1,
    user: "What is machine learning?",
    assistant: "Machine learning is a subset of artificial intelligence (AI) that enables computers to learn and improve from experience without being explicitly programmed. It involves algorithms that can identify patterns in data and make predictions or decisions based on that data.",
    sources: [1, 2],
    timestamp: "2024-11-25T10:30:00Z"
  },
  {
    id: 2,
    user: "How does natural language processing work?",
    assistant: "Natural Language Processing (NLP) works by breaking down human language into components that computers can understand. It involves several steps including tokenization (breaking text into words), part-of-speech tagging, syntax analysis, and semantic understanding. Modern NLP uses neural networks and transformer models to achieve human-like language understanding.",
    sources: [2],
    timestamp: "2024-11-25T11:15:00Z"
  }
];

export const mockApiResponse = {
  query: "What is machine learning?",
  response: "Machine learning is a method of data analysis that automates analytical model building. It's based on the idea that systems can learn from data, identify patterns and make decisions with minimal human intervention.",
  sources: [
    {
      id: 1,
      title: "The Art of Machine Learning",
      relevance: 0.95,
      excerpt: "Machine learning algorithms can identify patterns in data and make predictions..."
    }
  ],
  confidence: 0.92
};