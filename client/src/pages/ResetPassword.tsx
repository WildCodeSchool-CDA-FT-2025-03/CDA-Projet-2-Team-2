import { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useSendResetPasswordMutation } from '@/types/graphql-generated';

type FormValues = {
  email: string;
};

/*
 * Cette page est utilisée lorsque l'utilisateur clique sur le lien de réinitialisation de son mot de passe
 * Un nouveau mot de passe doit être saisi et confirmé, puis validé par le serveur Apollo avec le token
 */

export default function ResetPassword() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [sendResetPasswordMutation] = useSendResetPasswordMutation();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FormValues>();

  const onSubmit = async (input: FormValues) => {
    setError('');
    try {
      // nouvelle methode de mutation à cérer dans le schma
      const { data } = await sendResetPasswordMutation({ variables: { email: input.email } });
      if (data) {
        toast.success(`Un mail à été envoyé à l'adresse ${input.email}`);
        setMessage(`Un mail à été envoyé à l'adresse ${input.email}`);

        // ⏳ Pause to display the message before redirecting to the login page
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError('Erreur lors de la réinitialisation');
      }
    } catch (error) {
      // an error is sent and we remain on the page
      toast.warning('Impossible de réinitialiser le mot de passe');
      setError(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la réinitialisation du mot de passe.',
      );
    }
  };

  return (
    <div className="w-full max-w-md px-8 py-10 mx-auto bg-white rounded-lg shadow-sm">
      <h2 className="mb-6 text-center">Réinitialisation de mot de passe</h2>

      {/* 📜 information block or error (error & message)*/}
      {error && (
        <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">
          {error}
        </div>
      )}

      {message && (
        <p className="p-2 mb-4 text-sm text-lime-600" role="alert">
          ✅{message}
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            {...register('email', {
              required: "⚠️ L'email est obligatoire",
              pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                message: "⚠️ L'email n'est pas valide",
              },
            })}
            id="email"
            placeholder="example@email.com"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.email?.message && (
            <p className="text-sm text-accent">{errors.email.message as ReactNode}</p>
          )}
        </div>

        <div className="mb-6 text-right">
          <Link
            to="/login"
            className="text-sm text-accent hover:text-accent-500 transition duration-200 ease-in-out"
          >
            Retour a la page login
          </Link>
        </div>

        <button type="submit" className="cta block mx-auto">
          Continuer
        </button>
      </form>
    </div>
  );
}
