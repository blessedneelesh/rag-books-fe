import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ChatInterface from '../components/UI/ChatInterface';
import BookLibrary from '../components/UI/BookLibrary';
import AddBook from '../components/UI/AddBook';
import ErrorBoundary from '../components/UI/ErrorBoundary';

// Define routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <ChatInterface />
      },
      {
        path: 'chat',
        element: <ChatInterface />
      },
      {
        path: 'library',
        element: <BookLibrary />
      },
      {
        path: 'add-book',
        element: <AddBook />
      }
    ]
  }
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;