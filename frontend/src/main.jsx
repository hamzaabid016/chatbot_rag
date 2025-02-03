import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashBoard from './routes/dashBoard/dashBoard.jsx';
import ChatPage from './routes/chatPage/ChatPage.jsx';
import RootLayout from './layouts/rootLayout/rootLayout.jsx';
import DashboardLayout from './layouts/dashboardLayout/dashboardLayout.jsx';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path:"/",
        element:<DashBoard />
      },
      {
        path:"/chats/:id",
        element:<ChatPage />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
