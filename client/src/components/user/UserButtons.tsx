type UserButtonProps = {
  id: string | null;
  isDisable: boolean
}
import { useNavigate } from 'react-router-dom';

export default function UserButtons({id, isDisable} : UserButtonProps) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-end p-2 mt-4">
      <button
        onClick={() => navigate('/users')}
        type="button"
        className="inline-flex items-center mr-2 p-3 rounded-md bg-white border border-red-600 px-4 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Annuler
      </button>
      <button
        type="submit"
        disabled={isDisable}
        className={`inline-flex items-center p-3 rounded-md px-4 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isDisable
            ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
            : 'bg-blue text-white hover:bg-blue focus:ring-blue-500'
        }`}
      >
        {id ? 'Mettre à jour' : 'Enregistrer'}
      </button>
    </div>
  );
}
