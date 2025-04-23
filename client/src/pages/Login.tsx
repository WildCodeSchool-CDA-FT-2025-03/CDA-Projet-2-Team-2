import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.info('Credentials submitted:', { email, password });
  };

  return (
    <div className="w-full max-w-md px-8 py-10 mx-auto bg-white rounded-lg shadow-sm">
      <h2 className="mb-6 text-xl font-medium text-center text-gray-700">
        Connect on your account
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="example@email.com"
            required
          />
        </div>

        <div className="mb-2">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="********"
            required
          />
        </div>

        <div className="mb-6 text-right">
          <Link to="/forgot-password" className="text-sm text-pink-400 hover:text-pink-500">
            Forgot Password ?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-900 rounded hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
