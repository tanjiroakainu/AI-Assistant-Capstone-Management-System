import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await register(email, password, name);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Email already exists or registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <div className="text-center mb-4">
            <Link
              to="/"
              className="text-ruby-400 hover:text-ruby-300 text-sm sm:text-base font-medium inline-flex items-center transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">
              Register as Student
            </span>
          </h2>
          <p className="mt-2 sm:mt-3 text-center text-xs sm:text-sm md:text-base text-gray-400 px-3 sm:px-4">
            Only students can register. Admin and Teacher accounts are managed by administrators.
          </p>
        </div>
        <form className="mt-6 sm:mt-8 space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-ruby-900/50 border-2 border-ruby-600 text-ruby-200 px-4 py-3 rounded-lg text-sm sm:text-base">
              {error}
            </div>
          )}
          <div className="rounded-lg shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm sm:text-base font-medium text-white mb-1 sm:mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500 text-sm sm:text-base"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm sm:text-base font-medium text-white mb-1 sm:mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500 text-sm sm:text-base"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm sm:text-base font-medium text-white mb-1 sm:mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500 text-sm sm:text-base"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-bold rounded-lg text-white bg-gradient-to-r from-ruby-600 to-ruby-700 hover:from-ruby-700 hover:to-ruby-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ruby-500 shadow-lg hover:shadow-ruby-glow transition-all transform hover:scale-105 active:scale-95"
            >
              Register
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="font-medium text-ruby-400 hover:text-ruby-300 text-sm sm:text-base transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

