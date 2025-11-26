import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ChatInterface from '../components/UI/ChatInterface';
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
      }
    ]
  }
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;