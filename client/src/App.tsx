import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth.context';
import Layout from '@/components/layout/Layout';
import Login from '@/pages/Login';
import PageNotFound from '@/pages/PageNotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import Department from '@/pages/Department';

import PatientFileSecretary from '@/pages/PatientFileSecretary';
import SecretaryDashboard from '@/pages/secretaryDashboard/SecretaryDashboard';
import ForgotPassword from '@/pages/ForgotPassword';
import User from '@/pages/User';
import Logs from '@/pages/Logs';
import CreateUser from '@/pages/CreateUser';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPassword />,
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
            path: '/admin/users',
            element: <User />,
          },
          {
            path: '/admin/users/create',
            element: <CreateUser />,
          },
          {
            path: '/admin/logs',
            element: <Logs />,
          },
          {
            path: '/admin/department',
            element: <Department />,
          },
          {
            path: '/secretary',
            element: <SecretaryDashboard />,
          },
          {
            path: '/secretary/patient/:id',
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
