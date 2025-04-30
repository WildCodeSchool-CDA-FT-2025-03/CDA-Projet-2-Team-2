import ModuleList from './ModuleList';

export default function NextRdv() {
  return (
    <article className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Prochains rendez-vous</h2>
      <ModuleList />
    </article>
  );
}
