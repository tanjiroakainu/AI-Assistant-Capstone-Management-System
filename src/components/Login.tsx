import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
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
              Sign in to your account
            </span>
          </h2>
        </div>
        <form className="mt-6 sm:mt-8 space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-ruby-900/50 border-2 border-ruby-600 text-ruby-200 px-4 py-3 rounded-lg text-sm sm:text-base">
              {error}
            </div>
          )}
          <div className="rounded-lg shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-t-lg relative block w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500 focus:z-10 text-sm sm:text-base"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-b-lg relative block w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500 focus:z-10 text-sm sm:text-base"
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
              Sign in
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/register"
              className="font-medium text-ruby-400 hover:text-ruby-300 text-sm sm:text-base transition-colors"
            >
              Don't have an account? Register as Student
            </Link>
          </div>
        </form>

        {/* Role-Based Login Guide */}
        <div className="mt-6 sm:mt-8 bg-gray-800/90 backdrop-blur-sm border-2 border-ruby-600/30 rounded-xl p-4 sm:p-5">
          <h3 className="text-sm sm:text-base font-bold text-white mb-3">Role-Based Login Guide</h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="bg-gray-900/50 rounded-lg p-2 sm:p-3 border border-ruby-600/30">
              <div className="font-bold text-ruby-400 mb-1">👨‍💼 Admin</div>
              <div className="text-gray-300">Email: <span className="font-mono text-ruby-300">admin@gmail.com</span></div>
              <div className="text-gray-300">Password: <span className="font-mono text-ruby-300">admin123</span></div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2 sm:p-3 border border-ruby-600/30">
              <div className="font-bold text-ruby-400 mb-1">👨‍🎓 Student</div>
              <div className="text-gray-300">Email: <span className="font-mono text-ruby-300">student@gmail.com</span></div>
              <div className="text-gray-300">Password: <span className="font-mono text-ruby-300">student123</span></div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-2 sm:p-3 border border-ruby-600/30">
              <div className="font-bold text-ruby-400 mb-1">👨‍🏫 Teacher</div>
              <div className="text-gray-300">Email: <span className="font-mono text-ruby-300">teacher@gmail.com</span></div>
              <div className="text-gray-300">Password: <span className="font-mono text-ruby-300">teacher123</span></div>
            </div>
          </div>
          <p className="mt-3 text-xs sm:text-sm text-gray-400">
            💡 <strong className="text-ruby-400">Note:</strong> Only students can register new accounts. Admin and Teacher accounts are managed by administrators.
          </p>
        </div>
      </div>
    </div>
  );
};

