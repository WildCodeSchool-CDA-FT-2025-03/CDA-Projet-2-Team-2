import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <>
      <div className="relative flex flex-col items-center w-full gap-8 px-8 md:px-18 xl:px-40 md:gap-16">
        <h1 className="text-9xl md:text-[300px] w-full select-none text-center font-black text-blue-gray">
          404
        </h1>
        <p className="text-3xl font-bold">La page que vous cherchez n&apos;existe pas</p>
        <p className="text-2xl font-medium break-words text-dull">
          Malheureusement, vous avez peut-être fait une erreur de saisie ou la page a été déplacée
          vers une autre URL.
        </p>
        <span className="inline-flex items-center justify-center w-60 px-4 py-2 text-white bg-blue rounded hover:bg-white hover:text-accent border-transparent border-2 hover:border-accent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          <Link to="/">Retour a la page d&apos;accueil</Link>
        </span>
      </div>
    </>
  );
}
