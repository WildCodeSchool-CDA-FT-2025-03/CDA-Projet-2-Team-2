import Logo from '@/components/Logo';

export default function Header() {
  return (
    <header className="w-full px-6 py-3">
      <div className="flex items-center justify-between">
        <Logo />

        <div className="flex items-center gap-6">
          <span className="text-blue font-medium">
            Bienvenue <span className="text-accent">Alexandre Dumout</span>
          </span>

          <div className="flex items-center gap-3">
            <button className="bg-blue text-white px-4 py-2 rounded-md hover:bg-blue/90 transition-colors">
              Gérer les services
            </button>
            <button className="border border-accent text-accent px-4 py-2 rounded-md hover:bg-accent hover:text-white transition-colors">
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
