import { Link } from 'react-router-dom';

import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { LinkButton } from '@/components/layout/LinkButton';

import { getPathFromRole } from '@/utils/getPathFromRole';

export default function Header() {
  const { user, logout } = useAuth();

  const rolePath = getPathFromRole(user?.role || '');

  return (
    <header className="w-full px-6 py-3" role="banner">
      <div className="flex items-center justify-between">
        <Link to={rolePath === '/' ? '/login' : rolePath} className="flex items-center gap-4">
          <Logo />
          <p className="text-blue font-medium">
            Bienvenue{' '}
            <span className="text-accent" aria-label={`${user?.firstname} ${user?.lastname}`}>
              {user?.firstname} {user?.lastname}
            </span>
          </p>
        </Link>

        <nav
          className="flex items-center gap-6"
          role="navigation"
          aria-label="Navigation principale"
        >
          <div className="flex items-center gap-3">
            <LinkButton />
            <button
              onClick={logout}
              className="border border-accent text-accent px-4 py-2 bg-white rounded-md hover:bg-accent hover:text-white transition-colors"
              aria-label="Se déconnecter"
            >
              Déconnexion
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
