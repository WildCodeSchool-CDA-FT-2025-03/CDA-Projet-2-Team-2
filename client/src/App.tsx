import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from '@/contexts/auth.context';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/Home';
import Login from '@/pages/Login';
import PageNotFound from '@/pages/PageNotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import Department from './pages/Department';

import PatientFileSecretary from './pages/PatientFileSecretary';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <Layout />,
        children: [
          {
            path: '/',
            element: <HomePage />,
          },
          {
            path: "/department",
            element: <Department />
          },
          {
            path: '/patient-secretary',
            element: <PatientFileSecretary />,
          },
        ],
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
