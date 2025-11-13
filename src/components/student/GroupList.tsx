import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Group, GroupFile } from '../../types';
import { groupService } from '../../services/groupService';
import { authService } from '../../services/authService';

export const GroupList = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    if (user) {
      const userGroups = groupService.getGroupsByUser(user.id);
      setGroups(userGroups);
    }
  }, [user]);

  const handleDelete = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      groupService.deleteGroup(groupId);
      if (user) {
        const userGroups = groupService.getGroupsByUser(user.id);
        setGroups(userGroups);
      }
    }
  };

  const getUserName = (userId: string) => {
    const user = authService.getUserById(userId);
    return user?.name || 'Unknown';
  };

  const handleFileDownload = (file: GroupFile) => {
    // Convert base64 back to blob
    const byteCharacters = atob(file.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { 
      type: file.type === 'image' ? 'image/jpeg' : 'application/pdf' 
    });
    
    // Create download link
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
    // Convert base64 to data URL for viewing
    const dataUrl = `data:${file.type === 'image' ? 'image/jpeg' : 'application/pdf'};base64,${file.data}`;
    
    if (file.type === 'pdf') {
      // For PDFs, create a blob URL and open in new window with proper headers
      const byteCharacters = atob(file.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);
      
      // Open PDF in new window
      const newWindow = window.open(blobUrl, '_blank');
      if (newWindow) {
        // Clean up the blob URL after a delay
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      } else {
        // If popup blocked, fallback to download
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      }
    } else {
      // For images, use simple data URL
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
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Link to="/dashboard" className="text-ruby-400 hover:text-ruby-300 mb-2 inline-block text-sm sm:text-base font-medium transition-colors">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">My Groups</span>
            </h1>
          </div>
          <Link
            to="/student/create-group"
            className="bg-gradient-to-r from-ruby-600 to-ruby-700 hover:from-ruby-700 hover:to-ruby-800 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-bold text-center shadow-md hover:shadow-ruby-glow transition-all transform hover:scale-105 active:scale-95"
          >
            Create New Group
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl p-4 sm:p-6 border-2 border-ruby-600/30 hover:border-ruby-500 hover:shadow-ruby-glow transition-all">
              <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold flex-1 min-w-0 text-white">{group.name}</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded-lg whitespace-nowrap ${getStatusColor(group.status || 'approved')}`}>
                  {(group.status || 'approved').replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-2">
                Created: {new Date(group.createdAt).toLocaleDateString()}
              </p>
              <div className="mb-3">
                <p className="text-sm sm:text-base font-medium text-gray-300 mb-1">
                  Leader: <span className="font-bold text-ruby-400">{getUserName(group.leader)}</span>
                </p>
              </div>
              {group.teachers && group.teachers.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm sm:text-base font-medium text-gray-300 mb-1">Teachers:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400">
                    {group.teachers.map((teacherId) => (
                      <li key={teacherId}>{getUserName(teacherId)}</li>
                    ))}
                  </ul>
                </div>
              )}
              {group.students && group.students.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm sm:text-base font-medium text-gray-300 mb-1">Students:</p>
                  <ul className="list-disc list-inside text-sm text-gray-400">
                    {group.students.map((studentId) => (
                      <li key={studentId}>
                        {getUserName(studentId)}
                        {studentId === group.leader && <span className="ml-1 text-ruby-400 font-bold">(Leader)</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {group.files && group.files.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-300 mb-2">Group Files (Visible to all members):</p>
                  <div className="space-y-2">
                    {group.files.map((file) => (
                      <div key={file.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-2 sm:p-2.5 bg-gray-900/50 rounded-lg border-2 border-gray-700">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          {file.type === 'image' ? (
                            <span className="text-xl sm:text-2xl flex-shrink-0">🖼️</span>
                          ) : (
                            <span className="text-xl sm:text-2xl flex-shrink-0">📄</span>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">
                              <span className="hidden sm:inline">Uploaded by {getUserName(file.uploadedBy)} • </span>
                              {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row sm:flex-row space-x-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleFileView(file)}
                            className="flex-1 sm:flex-none text-ruby-400 hover:text-ruby-300 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg hover:bg-ruby-900/30 whitespace-nowrap font-medium transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleFileDownload(file)}
                            className="flex-1 sm:flex-none text-ruby-400 hover:text-ruby-300 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-1 rounded-lg hover:bg-ruby-900/30 whitespace-nowrap font-medium transition-colors"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {group.createdBy === user?.id && (
                <button
                  onClick={() => handleDelete(group.id)}
                  className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                >
                  Delete Group
                </button>
              )}
            </div>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4 text-sm sm:text-base">You don't have any groups yet.</p>
            <Link
              to="/student/create-group"
              className="text-ruby-400 hover:text-ruby-300 font-bold transition-colors"
            >
              Create your first group
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

