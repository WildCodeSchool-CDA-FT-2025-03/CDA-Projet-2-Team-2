import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const { user } = useAuth();

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
            <button className="bg-blue text-white px-4 py-2 rounded-md hover:bg-blue/90 transition-colors">
              Gérer les services
            </button>
            <button className="border border-accent text-accent px-4 py-2 bg-white rounded-md hover:bg-accent hover:text-white transition-colors">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
