import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, UserRole } from '../../types';
import { authService } from '../../services/authService';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'teacher' as UserRole
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (filterRole === 'all') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(u => u.role === filterRole));
    }
  }, [users, filterRole]);

  const loadUsers = () => {
    const allUsers = authService.getAllUsers();
    setUsers(allUsers);
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: '',
        password: '',
        name: '',
        role: 'teacher'
      });
    }
    setError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({
      email: '',
      password: '',
      name: '',
      role: 'teacher'
    });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (editingUser) {
      const success = authService.updateUser(
        editingUser.id,
        formData.email,
        formData.password,
        formData.name,
        formData.role
      );
      if (success) {
        loadUsers();
        handleCloseModal();
      } else {
        setError('Failed to update user. Email may already be taken.');
      }
    } else {
      const success = authService.addUser(
        formData.email,
        formData.password,
        formData.name,
        formData.role
      );
      if (success) {
        loadUsers();
        handleCloseModal();
      } else {
        setError('Failed to add user. Email may already be taken.');
      }
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const success = authService.deleteUser(id);
      if (success) {
        loadUsers();
      }
    }
  };

  // Calculate user statistics for charts
  const getUserStats = () => {
    const stats = {
      students: users.filter(u => u.role === 'student').length,
      teachers: users.filter(u => u.role === 'teacher').length,
      admins: users.filter(u => u.role === 'admin').length,
      total: users.length
    };
    return stats;
  };

  const userStats = getUserStats();
  
  const pieData = [
    { name: 'Students', value: userStats.students, color: '#dc2626' },
    { name: 'Teachers', value: userStats.teachers, color: '#ef4444' },
    { name: 'Admins', value: userStats.admins, color: '#b91c1c' }
  ].filter(item => item.value > 0);

  const barData = [
    { role: 'Students', count: userStats.students },
    { role: 'Teachers', count: userStats.teachers },
    { role: 'Admins', count: userStats.admins }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Link to="/dashboard" className="text-ruby-400 hover:text-ruby-300 mb-2 inline-block text-sm sm:text-base font-medium transition-colors">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">User Management</span>
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
              className="border-2 border-gray-700 bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500"
            >
              <option value="all" className="bg-gray-800">All Users</option>
              <option value="student" className="bg-gray-800">Students</option>
              <option value="teacher" className="bg-gray-800">Teachers</option>
              <option value="admin" className="bg-gray-800">Admins</option>
            </select>
            <button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-ruby-600 to-ruby-700 hover:from-ruby-700 hover:to-ruby-800 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-bold shadow-md hover:shadow-ruby-glow transition-all transform hover:scale-105 active:scale-95"
            >
              Add User
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
            <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-300 mb-2">Total Users</h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-ruby-400">{userStats.total}</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">All registered users</p>
          </div>
          <div className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
            <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-300 mb-2">Students</h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-ruby-400">{userStats.students}</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Student accounts</p>
          </div>
          <div className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
            <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-300 mb-2">Teachers</h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-ruby-400">{userStats.teachers}</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Teacher accounts</p>
          </div>
          <div className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
            <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-300 mb-2">Admins</h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-ruby-400">{userStats.admins}</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">Admin accounts</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border-2 border-ruby-600/30">
            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 text-white">Users by Role (Pie Chart)</h2>
            {pieData.length > 0 ? (
              <div className="w-full" style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name?: string; percent?: number }) => `${name || 'Unknown'}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8 text-sm sm:text-base">No user data available</p>
            )}
          </div>

          <div className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border-2 border-ruby-600/30">
            <h2 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 text-white">Users by Role (Bar Chart)</h2>
            <div className="w-full" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="role" tick={{ fontSize: 12, fill: '#d1d5db' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#d1d5db' }} />
                  <Tooltip contentStyle={{ fontSize: '12px', backgroundColor: '#1f2937', border: '1px solid #dc2626', borderRadius: '8px', color: '#fff' }} />
                  <Bar dataKey="count" fill="#dc2626" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border-2 border-ruby-600/30">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {user.name}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-lg ${
                        user.role === 'admin' ? 'bg-ruby-900/50 text-ruby-300 border border-ruby-600' :
                        user.role === 'teacher' ? 'bg-ruby-900/50 text-ruby-300 border border-ruby-600' :
                        'bg-ruby-900/50 text-ruby-300 border border-ruby-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenModal(user)}
                        className="text-ruby-400 hover:text-ruby-300 mr-4 transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-400 hover:text-red-300 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-700">
            {filteredUsers.map((user) => (
              <div key={user.id} className="p-4 hover:bg-gray-700/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-white">{user.name}</h3>
                    <p className="text-sm text-gray-300 mt-1">{user.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-lg ml-2 ${
                    user.role === 'admin' ? 'bg-ruby-900/50 text-ruby-300 border border-ruby-600' :
                    user.role === 'teacher' ? 'bg-ruby-900/50 text-ruby-300 border border-ruby-600' :
                    'bg-ruby-900/50 text-ruby-300 border border-ruby-600'
                  }`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex space-x-4 mt-3">
                  <button
                    onClick={() => handleOpenModal(user)}
                    className="text-ruby-400 hover:text-ruby-300 text-sm font-medium transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-3 sm:p-4">
            <div className="relative top-4 sm:top-10 md:top-20 mx-auto p-4 sm:p-5 md:p-6 border-2 border-ruby-600/50 w-full max-w-md sm:w-96 shadow-ruby-glow rounded-xl bg-gray-800">
              <div className="mt-1 sm:mt-3">
                <h3 className="text-base sm:text-lg md:text-xl font-bold leading-6 text-white mb-3 sm:mb-4">
                  {editingUser ? 'Edit User' : 'Add User'}
                </h3>
                {error && (
                  <div className="bg-ruby-900/50 border-2 border-ruby-600 text-ruby-200 px-3 sm:px-4 py-2 sm:py-3 rounded-lg mb-3 sm:mb-4 text-xs sm:text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm sm:text-base border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500"
                    />
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm sm:text-base border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500"
                    />
                  </div>
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 text-sm sm:text-base border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500"
                    />
                  </div>
                  <div className="mb-4 sm:mb-5">
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                      Role
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                      className="w-full px-3 py-2 text-sm sm:text-base border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500"
                    >
                      <option value="student" className="bg-gray-900">Student</option>
                      <option value="teacher" className="bg-gray-900">Teacher</option>
                      <option value="admin" className="bg-gray-900">Admin</option>
                    </select>
                  </div>
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-gradient-to-r from-ruby-600 to-ruby-700 text-white rounded-lg hover:from-ruby-700 hover:to-ruby-800 shadow-md hover:shadow-ruby-glow transition-all font-bold transform hover:scale-105 active:scale-95"
                    >
                      {editingUser ? 'Update' : 'Add'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

