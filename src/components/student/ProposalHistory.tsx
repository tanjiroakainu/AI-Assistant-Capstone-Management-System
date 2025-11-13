import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Group, GroupFile } from '../../types';
import { groupService } from '../../services/groupService';
import { authService } from '../../services/authService';

export const ProposalHistory = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (user) {
      loadGroups();
    }
  }, [user]);

  const loadGroups = () => {
    if (user) {
      // Get all groups created by this student
      const allGroups = groupService.getAllGroups();
      const studentGroups = allGroups.filter(g => g.createdBy === user.id);
      setGroups(studentGroups);
    }
  };

  const getUserName = (userId: string) => {
    const user = authService.getUserById(userId);
    return user?.name || 'Unknown';
  };

  const handleFileDownload = (file: GroupFile) => {
    const byteCharacters = atob(file.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { 
      type: file.type === 'image' ? 'image/jpeg' : 'application/pdf' 
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileView = (file: GroupFile) => {
    if (file.type === 'pdf') {
      const byteCharacters = atob(file.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      
      const newWindow = window.open(blobUrl, '_blank');
      if (newWindow) {
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      } else {
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      }
    } else {
      const dataUrl = `data:image/jpeg;base64,${file.data}`;
      window.open(dataUrl, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-ruby-900/50 text-ruby-300 border border-ruby-600';
      case 'rejected':
        return 'bg-red-900/50 text-red-300 border border-red-600';
      case 'pending':
        return 'bg-yellow-900/50 text-yellow-300 border border-yellow-600';
      case 'in_progress':
        return 'bg-ruby-900/50 text-ruby-300 border border-ruby-600';
      case 'completed':
        return 'bg-ruby-900/50 text-ruby-300 border border-ruby-600';
      case 'on_hold':
        return 'bg-gray-700 text-gray-300 border border-gray-600';
      default:
        return 'bg-gray-700 text-gray-300 border border-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard" className="text-ruby-400 hover:text-ruby-300 mb-2 inline-block text-sm sm:text-base font-medium transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">My Capstone Proposals</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">View the history of all your capstone proposals and their status</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl p-4 sm:p-6 border-2 border-ruby-600/30">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-2">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">{group.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Created: {new Date(group.createdAt).toLocaleDateString()} at {new Date(group.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-bold rounded-lg whitespace-nowrap ${getStatusColor(group.status)}`}>
                  {group.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm sm:text-base font-medium text-gray-300 mb-1">Leader:</p>
                  <p className="text-sm sm:text-base text-white">{getUserName(group.leader)}</p>
                </div>
                {group.teachers && group.teachers.length > 0 && (
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-300 mb-1">Teachers:</p>
                    <ul className="list-disc list-inside text-sm sm:text-base text-white">
                      {group.teachers.map((teacherId) => (
                        <li key={teacherId}>{getUserName(teacherId)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {group.students && group.students.length > 0 && (
                  <div>
                    <p className="text-sm sm:text-base font-medium text-gray-300 mb-1">Students:</p>
                    <ul className="list-disc list-inside text-sm sm:text-base text-white">
                      {group.students.map((studentId) => (
                        <li key={studentId}>{getUserName(studentId)}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {group.files && group.files.length > 0 && (
                <div className="mt-4 border-t-2 border-ruby-600/30 pt-4">
                  <h4 className="text-sm sm:text-base font-bold text-white mb-3">Group Files:</h4>
                  <div className="space-y-2">
                    {group.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-900/50 rounded-lg border-2 border-gray-700">
                        <div className="flex items-center space-x-2">
                          {file.type === 'image' ? (
                            <span className="text-2xl">🖼️</span>
                          ) : (
                            <span className="text-2xl">📄</span>
                          )}
                          <div>
                            <p className="text-sm sm:text-base font-medium text-white">{file.name}</p>
                            <p className="text-xs text-gray-400">
                              Uploaded by {getUserName(file.uploadedBy)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                          <button
                            onClick={() => handleFileView(file)}
                            className="text-ruby-400 hover:text-ruby-300 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg hover:bg-ruby-900/30 font-medium transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleFileDownload(file)}
                            className="text-ruby-400 hover:text-ruby-300 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-lg hover:bg-ruby-900/30 font-medium transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {group.statusHistory && group.statusHistory.length > 0 && (
                <div className="mt-4 border-t-2 border-ruby-600/30 pt-4">
                  <h4 className="text-sm sm:text-base font-bold text-white mb-3">Status History:</h4>
                  <div className="space-y-2">
                    {group.statusHistory.map((update) => (
                      <div key={update.id} className="flex items-start space-x-3 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`px-2 py-1 text-xs font-bold rounded-lg ${getStatusColor(update.status)}`}>
                              {update.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-400">
                              by {getUserName(update.updatedBy)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400">
                            {new Date(update.updatedAt).toLocaleString()}
                          </p>
                          {update.comment && (
                            <p className="text-sm text-gray-300 mt-1 italic">"{update.comment}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4 text-sm sm:text-base">You haven't created any capstone proposals yet.</p>
            <Link
              to="/student/create-group"
              className="text-ruby-400 hover:text-ruby-300 font-bold transition-colors"
            >
              Create your first proposal
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
