import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types';
import { authService } from '../../services/authService';

export const ViewStudents = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    const allUsers = authService.getAllUsers();
    const studentUsers = allUsers.filter(u => u.role === 'student');
    setStudents(studentUsers);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard" className="text-ruby-400 hover:text-ruby-300 mb-2 inline-block text-sm sm:text-base font-medium transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">All Students</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">View all registered students in the system</p>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-96 px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500 text-sm sm:text-base"
          />
        </div>

        <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border-2 border-ruby-600/30">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm sm:text-base">
                {searchTerm ? 'No students found matching your search.' : 'No students registered in the system yet.'}
              </p>
            </div>
          ) : (
            <>
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
                        Student ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-white">{student.name}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{student.email}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-lg bg-ruby-900/50 text-ruby-300 border border-ruby-600">
                            {student.role}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-xs sm:text-sm text-gray-400 font-mono break-all">{student.id}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-700">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="p-4 hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-white">{student.name}</h3>
                        <p className="text-sm text-gray-300 mt-1">{student.email}</p>
                      </div>
                      <span className="px-2 py-1 text-xs font-bold rounded-lg bg-ruby-900/50 text-ruby-300 border border-ruby-600 ml-2">
                        {student.role}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs text-gray-400 font-mono break-all">ID: {student.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-4 text-xs sm:text-sm text-gray-400">
          Total Students: <span className="font-bold text-ruby-400">{filteredStudents.length}</span>
          {searchTerm && filteredStudents.length !== students.length && (
            <span className="ml-2">
              (of {students.length} total)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

