import { ReactNode, useState, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useResetPasswordMutation } from '@/types/graphql-generated';

type FormValues = {
  password: string;
  confirmpassword: string;
};

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [params] = useSearchParams();

  const token = params.get('token');

  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormValues>();

  // 🔬 used to verify that the two passwords are identical
  const passwordRef = useRef({});
  passwordRef.current = watch('password', '');

  const [resetPasswordMutation] = useResetPasswordMutation();

  const onSubmit = async (input: FormValues) => {
    const { password } = input;

    setError('');
    try {
      const { data } = await resetPasswordMutation({
        variables: { input: { password: password, token: token as string } },
      });
      if (data?.resetPassword === true) {
        toast.success(`Le mot de passe à été changé avec succès`);
        setMessage(`Le mot de passe à été changé avec succès`);

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
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            {...register('password', {
              required: '⚠️ Le mot de passe est exigé',
              pattern: {
                value: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/,
                message: "⚠️ Le mot de passe n'est pas valide",
              },
            })}
            id="password"
            placeholder="********"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.password?.message && (
            <p className="text-sm text-accent">{errors.password.message as ReactNode}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            {...register('confirmpassword', {
              required: '⚠️ Le mot de passe est exigé',
              validate: value =>
                value === passwordRef.current || '⚠️ Les mots de passe ne correspondent pas',
            })}
            id="password"
            placeholder="********"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.confirmpassword?.message && (
            <p className="text-sm text-accent">{errors.confirmpassword.message as ReactNode}</p>
          )}
        </div>

        <p className="w-full text-xs px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
          Le mot de passe doit contenir entre 8 et 16 caractères, au moins une lettre majuscule, une
          lettre minuscule, un chiffre et un caractère spécial
        </p>

        <div className="mb-6 text-right">
          <Link
            to="/login"
            className="text-sm text-accent hover:text-accent-500 transition duration-200 ease-in-out"
          >
            <span>Retour a la page login</span>
          </Link>
        </div>

        <button type="submit" className="cta block mx-auto">
          Continuer
        </button>
      </form>
    </div>
  );
}
