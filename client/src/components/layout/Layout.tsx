import { Outlet } from 'react-router-dom';
import { Bounce, ToastContainer } from 'react-toastify';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Layout() {
  return (
    <div className="flex flex-col items-center justify-between lg:h-screen bg-auth-gradient">
      <Header />
      <Outlet />
      <Footer />
      {/* to display personalized messages */}
      <ToastContainer
        position="top-center"
        autoClose={6000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
}
