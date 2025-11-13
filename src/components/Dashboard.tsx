import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { analyticsService } from '../services/analyticsService';
import { authService } from '../services/authService';
import { groupService } from '../services/groupService';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [adminData, setAdminData] = useState<any[]>([]);
  const [teacherData, setTeacherData] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        const data = analyticsService.getAdminAnalytics();
        setAdminData(data.slice(-7)); // Last 7 days
        const allUsers = authService.getAllUsers();
        const allGroups = groupService.getAllGroups();
        setStats({
          totalUsers: allUsers.length,
          totalGroups: allGroups.length,
          students: allUsers.filter(u => u.role === 'student').length,
          teachers: allUsers.filter(u => u.role === 'teacher').length
        });
      } else if (user.role === 'teacher') {
        const data = analyticsService.getTeacherAnalytics();
        setTeacherData(data.slice(-7)); // Last 7 days
        const allUsers = authService.getAllUsers();
        const allGroups = groupService.getAllGroups();
        setStats({
          totalStudents: allUsers.filter(u => u.role === 'student').length,
          totalGroups: allGroups.length,
          pendingGroups: allGroups.filter(g => g.status === 'pending').length
        });
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <nav className="bg-gray-900/95 backdrop-blur-sm shadow-lg border-b-2 border-ruby-600">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
            <div className="flex items-center min-w-0 flex-1">
              <Link to="/" className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white hover:text-ruby-400 truncate transition-all">
                <span className="hidden sm:inline">🔥 Capstone Management System</span>
                <span className="sm:hidden">🔥 CMS</span>
              </Link>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 lg:space-x-4 flex-shrink-0">
              <Link
                to="/profile"
                className="text-white hover:text-ruby-400 text-xs sm:text-sm md:text-base font-medium px-2 sm:px-3 py-1 sm:py-2 rounded-md transition-all hover:bg-ruby-900/50 whitespace-nowrap"
              >
                <span className="hidden sm:inline">My Profile</span>
                <span className="sm:hidden">Profile</span>
              </Link>
              <div className="flex items-center space-x-1 sm:space-x-2">
                {user?.profilePhoto ? (
                  <img
                    src={`data:image/jpeg;base64,${user.profilePhoto}`}
                    alt="Profile"
                    className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-ruby-500 shadow-md flex-shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-ruby-500 shadow-md flex-shrink-0">
                    <span className="text-xs sm:text-sm md:text-base text-ruby-400">👤</span>
                  </div>
                )}
                <div className="hidden md:flex items-center">
                  <span className="text-white text-xs sm:text-sm font-semibold truncate max-w-[100px] lg:max-w-none">
                    {user?.name}
                  </span>
                  <span className="hidden lg:inline text-ruby-300 text-xs ml-1 font-medium">({user?.role})</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="bg-gradient-to-r from-ruby-600 to-ruby-700 hover:from-ruby-700 hover:to-ruby-800 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap shadow-md hover:shadow-ruby-glow transition-all transform hover:scale-105 active:scale-95"
              >
                <span className="hidden sm:inline">Logout</span>
                <span className="sm:hidden">Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-4 sm:py-6 md:py-8 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="px-3 sm:px-4 py-4 sm:py-6 md:py-8 sm:px-0">
          <div className="bg-gray-800/90 backdrop-blur-sm border-4 border-dashed border-ruby-600/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-lg">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              {user?.profilePhoto ? (
                <img
                  src={`data:image/jpeg;base64,${user.profilePhoto}`}
                  alt="Profile"
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full object-cover border-4 border-ruby-500 shadow-lg flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gray-800 flex items-center justify-center border-4 border-ruby-500 shadow-lg flex-shrink-0">
                  <span className="text-2xl sm:text-3xl md:text-4xl text-ruby-400">👤</span>
                </div>
              )}
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 text-white">
                  Welcome, <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">{user?.name}</span>!
                </h2>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 font-medium">
                  You are logged in as: <span className={`font-bold px-2 py-1 rounded-md ${
                    user?.role === 'admin' ? 'bg-ruby-900/50 text-ruby-300 border border-ruby-600' :
                    user?.role === 'teacher' ? 'bg-ruby-900/50 text-ruby-300 border border-ruby-600' :
                    'bg-ruby-900/50 text-ruby-300 border border-ruby-600'
                  }`}>{user?.role}</span>
                </p>
              </div>
            </div>
            
            {/* Admin Dashboard Stats and Chart */}
            {user?.role === 'admin' && stats && (
              <div className="mb-6 md:mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="bg-gray-800/90 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-1 sm:mb-2 font-medium">Total Users</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-ruby-400">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-gray-800/90 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-1 sm:mb-2 font-medium">Total Groups</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-ruby-400">{stats.totalGroups}</p>
                  </div>
                  <div className="bg-gray-800/90 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-1 sm:mb-2 font-medium">Students</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-ruby-400">{stats.students}</p>
                  </div>
                  <div className="bg-gray-800/90 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-1 sm:mb-2 font-medium">Teachers</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-ruby-400">{stats.teachers}</p>
                  </div>
                </div>
                {adminData.length > 0 && (
                  <div className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-lg mb-6 border-2 border-ruby-600/30">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 text-white">User Growth Trend (Last 7 Days)</h3>
                    <div className="w-full" style={{ height: '250px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={adminData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                          <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#d1d5db' }} />
                          <YAxis tick={{ fontSize: 12, fill: '#d1d5db' }} />
                          <Tooltip contentStyle={{ fontSize: '12px', backgroundColor: '#1f2937', border: '1px solid #dc2626', borderRadius: '8px', color: '#fff' }} />
                          <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={3} dot={{ r: 5, fill: '#dc2626' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Teacher Dashboard Stats and Chart */}
            {user?.role === 'teacher' && stats && (
              <div className="mb-6 md:mb-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
                  <div className="bg-gray-800/90 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-1 sm:mb-2 font-medium">Total Students</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-ruby-400">{stats.totalStudents}</p>
                  </div>
                  <div className="bg-gray-800/90 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-1 sm:mb-2 font-medium">Total Groups</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-ruby-400">{stats.totalGroups}</p>
                  </div>
                  <div className="bg-gray-800/90 backdrop-blur-sm p-3 sm:p-4 md:p-5 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 mb-1 sm:mb-2 font-medium">Pending Groups</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-ruby-400">{stats.pendingGroups}</p>
                  </div>
                </div>
                {teacherData.length > 0 && (
                  <div className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-xl shadow-lg mb-6 border-2 border-ruby-600/30">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 text-white">System Activity Trend (Last 7 Days)</h3>
                    <div className="w-full" style={{ height: '250px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={teacherData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                          <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#d1d5db' }} />
                          <YAxis tick={{ fontSize: 12, fill: '#d1d5db' }} />
                          <Tooltip contentStyle={{ fontSize: '12px', backgroundColor: '#1f2937', border: '1px solid #dc2626', borderRadius: '8px', color: '#fff' }} />
                          <Line type="monotone" dataKey="value" stroke="#dc2626" strokeWidth={3} dot={{ r: 5, fill: '#dc2626' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {user?.role === 'admin' && (
                <>
                  <Link
                    to="/profile"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">My Profile</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">View and manage your profile</p>
                  </Link>
                  <Link
                    to="/admin/users"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">User Management</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">Manage students, teachers and admins</p>
                  </Link>
                  <Link
                    to="/admin/groups"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">View All Groups</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">View all student groups, leaders, and teachers</p>
                  </Link>
                  <Link
                    to="/admin/proposals"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">View Proposals</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">View all proposals with PDFs and status</p>
                  </Link>
                  <Link
                    to="/admin/chart"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Admin Analytics</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">View admin activity trends and charts</p>
                  </Link>
                </>
              )}
              
              {user?.role === 'student' && (
                <>
                  <Link
                    to="/profile"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">My Profile</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">View and manage your profile</p>
                  </Link>
                  <Link
                    to="/student/groups"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">My Groups</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">View and manage your groups</p>
                  </Link>
                  <Link
                    to="/student/create-group"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Create Group</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">Create a new capstone proposal</p>
                  </Link>
                  <Link
                    to="/student/proposal-history"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Proposal History</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">View your capstone proposals and status</p>
                  </Link>
                  <Link
                    to="/student/chart"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Student Analytics</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">View student activity trends and charts</p>
                  </Link>
                </>
              )}
              
              {user?.role === 'teacher' && (
                <>
                  <Link
                    to="/profile"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">My Profile</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">View and manage your profile</p>
                  </Link>
                  <Link
                    to="/teacher/students"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">View All Students</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">View all registered students in the system</p>
                  </Link>
                  <Link
                    to="/teacher/approve-groups"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Approve Groups</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">Approve or reject student capstone proposals</p>
                  </Link>
                  <Link
                    to="/teacher/proposals"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Student Proposals</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">View all student capstone proposals and history</p>
                  </Link>
                  <Link
                    to="/teacher/chart"
                    className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-5 md:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30 hover:border-ruby-500 transform hover:scale-105"
                  >
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-white">Teacher Analytics</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">View teacher activity trends and charts</p>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

