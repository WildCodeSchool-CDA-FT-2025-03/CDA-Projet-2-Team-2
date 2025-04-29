import { Outlet } from 'react-router-dom';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Layout() {
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-auth-gradient">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
