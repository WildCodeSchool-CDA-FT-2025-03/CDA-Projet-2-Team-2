import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';
import { LinkButton } from '@/components/layout/LinkButton';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          <span className="text-blue font-medium">
            Bienvenue{' '}
            <span className="text-accent">
              {user?.firstname} {user?.lastname}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <LinkButton />
            <button
              onClick={logout}
              className="border border-accent text-accent px-4 py-2 bg-white rounded-md hover:bg-accent hover:text-white transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
