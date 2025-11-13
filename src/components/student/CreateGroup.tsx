import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, GroupFile } from '../../types';
import { groupService } from '../../services/groupService';
import { authService } from '../../services/authService';

export const CreateGroup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [availableTeachers, setAvailableTeachers] = useState<User[]>([]);
  const [availableStudents, setAvailableStudents] = useState<User[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get all users except the current user
    const allUsers = authService.getAllUsers();
    const teachers = allUsers.filter(u => u.id !== user?.id && u.role === 'teacher');
    const students = allUsers.filter(u => u.id !== user?.id && u.role === 'student');
    setAvailableTeachers(teachers);
    setAvailableStudents(students);
  }, [user]);

  const handleTeacherToggle = (userId: string) => {
    setSelectedTeachers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleStudentToggle = (userId: string) => {
    setSelectedStudents(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setError('');
      } else {
        setError('Please select a PDF file');
        e.target.value = '';
        setPdfFile(null);
      }
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!groupName.trim()) {
      setError('Group name is required');
      return;
    }

    if (!user) {
      setError('You must be logged in to create a group');
      return;
    }

    try {
      // Convert file to base64
      const files: GroupFile[] = [];
      
      if (pdfFile) {
        const pdfData = await convertFileToBase64(pdfFile);
        files.push({
          id: Date.now().toString() + '_pdf',
          name: pdfFile.name,
          type: 'pdf',
          data: pdfData,
          uploadedBy: user.id,
          uploadedAt: new Date().toISOString()
        });
      }

      // Creator is automatically the leader
      const allMembers = [...selectedTeachers, ...selectedStudents];
      groupService.createGroup(groupName, user.id, allMembers, selectedTeachers, selectedStudents, files);
      navigate('/student/groups');
    } catch (err) {
      setError('Failed to create group. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/student/groups" className="text-ruby-400 hover:text-ruby-300 mb-2 inline-block text-sm sm:text-base font-medium transition-colors">
          ← Back to Groups
        </Link>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-white">
          <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">Create New Group</span>
        </h1>

        <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl p-4 sm:p-6 border-2 border-ruby-600/30">
          {error && (
            <div className="bg-ruby-900/50 border-2 border-ruby-600 text-ruby-200 px-4 py-3 rounded-lg mb-4 text-sm sm:text-base">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                Group Name
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-700 bg-gray-900 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500 text-sm sm:text-base"
                placeholder="Enter group name"
                required
              />
            </div>

            <div className="mb-6">
              <div className="mb-4 p-3 sm:p-4 bg-ruby-900/30 border-2 border-ruby-600/50 rounded-lg">
                <p className="text-sm sm:text-base text-ruby-200">
                  <strong className="text-ruby-300">Note:</strong> You are automatically set as the group leader. The PDF file uploaded here will be visible to all group members.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                Upload PDF File - Visible to all group members
              </label>
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500 text-sm sm:text-base"
              />
              {pdfFile && (
                <p className="mt-2 text-sm sm:text-base text-gray-300">
                  Selected: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                Select Teachers
              </label>
              <div className="border-2 border-gray-700 bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto">
                {availableTeachers.length === 0 ? (
                  <p className="text-gray-400 text-sm sm:text-base">No teachers available</p>
                ) : (
                  <div className="space-y-2">
                    {availableTeachers.map((teacher) => (
                      <label
                        key={teacher.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTeachers.includes(teacher.id)}
                          onChange={() => handleTeacherToggle(teacher.id)}
                          className="rounded border-gray-600 bg-gray-800 text-ruby-600 focus:ring-ruby-500 focus:ring-2"
                        />
                        <span className="text-sm sm:text-base text-white">
                          {teacher.name} ({teacher.email})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {selectedTeachers.length > 0 && (
                <p className="mt-2 text-sm sm:text-base text-gray-300">
                  {selectedTeachers.length} teacher(s) selected
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm sm:text-base font-medium text-white mb-2">
                Select Students
              </label>
              <div className="border-2 border-gray-700 bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto">
                {availableStudents.length === 0 ? (
                  <p className="text-gray-400 text-sm sm:text-base">No other students available</p>
                ) : (
                  <div className="space-y-2">
                    {availableStudents.map((student) => (
                      <label
                        key={student.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id)}
                          onChange={() => handleStudentToggle(student.id)}
                          className="rounded border-gray-600 bg-gray-800 text-ruby-600 focus:ring-ruby-500 focus:ring-2"
                        />
                        <span className="text-sm sm:text-base text-white">
                          {student.name} ({student.email})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {selectedStudents.length > 0 && (
                <p className="mt-2 text-sm sm:text-base text-gray-300">
                  {selectedStudents.length} student(s) selected
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={() => navigate('/student/groups')}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-sm sm:text-base font-medium transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-ruby-600 to-ruby-700 text-white rounded-lg hover:from-ruby-700 hover:to-ruby-800 text-sm sm:text-base font-bold shadow-md hover:shadow-ruby-glow transition-all transform hover:scale-105 active:scale-95"
              >
                Create Group
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
