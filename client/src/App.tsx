import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/Home';
import Login from '@/pages/Login';
import { AuthProvider } from '@/contexts/auth.context';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
]);

const App = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
