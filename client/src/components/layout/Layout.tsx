import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <header>
        <h1>Cool Layout 😎</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>Footer</p>
      </footer>
    </div>
  );
}
