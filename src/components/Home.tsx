import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Chatbot } from './Chatbot';

export const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      <nav className="bg-gray-900/95 backdrop-blur-sm shadow-lg border-b-2 border-ruby-600">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between h-14 sm:h-16 lg:h-20 items-center">
            <div className="flex items-center min-w-0 flex-1">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white">
                <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">🔥 Capstone Management System</span>
              </h1>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-ruby-400 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:bg-ruby-900/50 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Dashboard</span>
                    <span className="sm:hidden">Dash</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="text-white hover:text-ruby-400 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:bg-ruby-900/50 whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Profile</span>
                    <span className="sm:hidden">Pro</span>
                  </Link>
                  <div className="hidden sm:flex items-center space-x-2 px-2 sm:px-3">
                    <span className="text-xs sm:text-sm text-white truncate max-w-[100px] lg:max-w-none font-medium">
                      {user?.name}
                    </span>
                    <span className="hidden lg:inline text-xs text-ruby-300">({user?.role})</span>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white hover:text-ruby-400 px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-medium transition-all hover:bg-ruby-900/50 whitespace-nowrap"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-ruby-600 to-ruby-700 hover:from-ruby-700 hover:to-ruby-800 text-white px-3 sm:px-4 md:px-5 py-1 sm:py-2 rounded-md text-xs sm:text-sm md:text-base font-bold transition-all shadow-md hover:shadow-ruby-glow whitespace-nowrap"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold text-white leading-tight">
            <span className="block bg-gradient-to-r from-ruby-400 via-ruby-500 to-ruby-600 bg-clip-text text-transparent">
              Manage Your
            </span>
            <span className="block bg-gradient-to-r from-ruby-500 via-ruby-600 to-ruby-700 bg-clip-text text-transparent mt-2">
              Capstone Projects
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 px-3 sm:px-4 leading-relaxed">
            A comprehensive platform for students, teachers, and administrators to collaborate,
            track progress, and manage capstone projects efficiently.
          </p>
          {!isAuthenticated && (
            <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-3 sm:px-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-gradient-to-r from-ruby-600 to-ruby-700 hover:from-ruby-700 hover:to-ruby-800 text-white px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base md:text-lg font-bold shadow-lg hover:shadow-ruby-glow transition-all text-center transform hover:scale-105 active:scale-95"
              >
                Get Started as Student
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white border-2 border-ruby-600 px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base md:text-lg font-bold shadow-lg hover:shadow-md transition-all text-center transform hover:scale-105 active:scale-95"
              >
                Sign In
              </Link>
            </div>
          )}
          {isAuthenticated && (
            <div className="mt-6 sm:mt-8 md:mt-10 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-3 sm:px-4">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto bg-gradient-to-r from-ruby-600 to-ruby-700 hover:from-ruby-700 hover:to-ruby-800 text-white px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base md:text-lg font-bold shadow-lg hover:shadow-ruby-glow transition-all text-center transform hover:scale-105 active:scale-95"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
          {!isAuthenticated && (
            <div className="mt-6 sm:mt-8 text-center">
              <p className="text-xs sm:text-sm md:text-base text-gray-400">
                Developed by <span className="font-bold text-ruby-400 hover:text-ruby-300 transition-colors">Raminder Jangao</span>
              </p>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <div className="bg-gray-800/90 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">👨‍🎓</div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2">For Students</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
              Create and manage project groups, collaborate with peers, and track your progress
              with detailed analytics and charts.
            </p>
          </div>

          <div className="bg-gray-800/90 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">👨‍🏫</div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2">For Teachers</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
              View all students, monitor their progress, and access comprehensive analytics
              to better guide and support your students.
            </p>
          </div>

          <div className="bg-gray-800/90 backdrop-blur-sm p-5 sm:p-6 md:p-8 rounded-xl shadow-lg hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105 md:col-span-2 lg:col-span-1">
            <div className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">👨‍💼</div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2">For Administrators</h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
              Manage all users, track system-wide analytics, and maintain complete control
              over the platform with powerful management tools.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white mb-6 sm:mb-8 md:mb-12">
            <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">
              Key Features
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border border-ruby-600/30">
              <div className="bg-gradient-to-br from-ruby-900/50 to-ruby-800/50 rounded-full w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md border-2 border-ruby-600/50">
                <span className="text-xl sm:text-2xl md:text-3xl">📊</span>
              </div>
              <h4 className="font-bold text-sm sm:text-base md:text-lg text-white mb-2">Analytics & Charts</h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Track ups and downs with detailed visualizations</p>
            </div>
            <div className="text-center bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border border-ruby-600/30">
              <div className="bg-gradient-to-br from-ruby-900/50 to-ruby-800/50 rounded-full w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md border-2 border-ruby-600/50">
                <span className="text-xl sm:text-2xl md:text-3xl">👥</span>
              </div>
              <h4 className="font-bold text-sm sm:text-base md:text-lg text-white mb-2">Group Management</h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Create and manage project groups easily</p>
            </div>
            <div className="text-center bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border border-ruby-600/30">
              <div className="bg-gradient-to-br from-ruby-900/50 to-ruby-800/50 rounded-full w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md border-2 border-ruby-600/50">
                <span className="text-xl sm:text-2xl md:text-3xl">🔐</span>
              </div>
              <h4 className="font-bold text-sm sm:text-base md:text-lg text-white mb-2">Secure Access</h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Role-based authentication and authorization</p>
            </div>
            <div className="text-center bg-gray-800/80 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border border-ruby-600/30">
              <div className="bg-gradient-to-br from-ruby-900/50 to-ruby-800/50 rounded-full w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md border-2 border-ruby-600/50">
                <span className="text-xl sm:text-2xl md:text-3xl">📈</span>
              </div>
              <h4 className="font-bold text-sm sm:text-base md:text-lg text-white mb-2">Progress Tracking</h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">Monitor performance and activity trends</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24 bg-gradient-to-r from-ruby-600 via-ruby-700 to-ruby-800 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 lg:p-12 text-center border-2 border-ruby-500/50">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Ready to Get Started?
            </h2>
            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 leading-relaxed">
              Join our platform and start managing your capstone projects today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-white hover:bg-gray-100 text-ruby-600 px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                Register Now
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white border-2 border-white/50 px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-lg text-sm sm:text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
        
        {/* Developer Credit for Non-Users */}
        {!isAuthenticated && (
          <div className="mt-8 sm:mt-10 md:mt-12 text-center pb-8 sm:pb-10">
            <p className="text-xs sm:text-sm md:text-base text-gray-400">
              🔥 Developed with passion by <span className="font-bold text-ruby-400 hover:text-ruby-300 transition-colors">Raminder Jangao</span>
            </p>
          </div>
        )}
      </div>

      {/* Chatbot Component */}
      <Chatbot />
    </div>
  );
};

