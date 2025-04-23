import { Outlet } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-gradient-to-r from-cyan-50 to-blue-50">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
