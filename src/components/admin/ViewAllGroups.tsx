import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Group, GroupFile } from '../../types';
import { groupService } from '../../services/groupService';
import { authService } from '../../services/authService';

export const ViewAllGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showFilesModal, setShowFilesModal] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = () => {
    const allGroups = groupService.getAllGroups();
    setGroups(allGroups);
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

  const handleViewFiles = (group: Group) => {
    setSelectedGroup(group);
    setShowFilesModal(true);
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

  const filteredGroups = filterStatus === 'all' 
    ? groups 
    : groups.filter(g => g.status === filterStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <Link to="/dashboard" className="text-ruby-400 hover:text-ruby-300 mb-2 inline-block text-sm sm:text-base font-medium transition-colors">
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">All Groups</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">View all capstone groups created by students</p>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border-2 border-gray-700 bg-gray-800 text-white rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>

        <div className="bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden border-2 border-ruby-600/30">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm sm:text-base">No groups found.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Group Name
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Created By
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Leader
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Teachers
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Students
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Files
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">
                        Created Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800/50 divide-y divide-gray-700">
                    {filteredGroups.map((group) => (
                      <tr key={group.id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-white">{group.name}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{getUserName(group.createdBy)}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">{getUserName(group.leader)}</div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="text-sm text-white">
                            {group.teachers && group.teachers.length > 0 ? (
                              <ul className="list-disc list-inside">
                                {group.teachers.map(teacherId => (
                                  <li key={teacherId}>{getUserName(teacherId)}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-gray-400">No teachers</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="text-sm text-white">
                            {group.students && group.students.length > 0 ? (
                              <ul className="list-disc list-inside">
                                {group.students.map(studentId => (
                                  <li key={studentId}>{getUserName(studentId)}</li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-gray-400">No students</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-bold rounded-lg ${getStatusColor(group.status)}`}>
                            {group.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                          {group.files && group.files.length > 0 ? (
                            <button
                              onClick={() => handleViewFiles(group)}
                              className="text-ruby-400 hover:text-ruby-300 text-sm font-medium transition-colors"
                            >
                              {group.files.length} file(s)
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">No files</span>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {new Date(group.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-gray-700">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="p-4 hover:bg-gray-700/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-base font-bold text-white flex-1">{group.name}</h3>
                      <span className={`px-2 py-1 text-xs font-bold rounded-lg ml-2 ${getStatusColor(group.status)}`}>
                        {group.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-300">Created by:</span> <span className="text-white">{getUserName(group.createdBy)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">Leader:</span> <span className="text-white">{getUserName(group.leader)}</span>
                      </div>
                      {group.teachers && group.teachers.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-300">Teachers:</span>
                          <ul className="list-disc list-inside ml-2 text-white">
                            {group.teachers.map(teacherId => (
                              <li key={teacherId}>{getUserName(teacherId)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {group.students && group.students.length > 0 && (
                        <div>
                          <span className="font-medium text-gray-300">Students:</span>
                          <ul className="list-disc list-inside ml-2 text-white">
                            {group.students.map(studentId => (
                              <li key={studentId}>{getUserName(studentId)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {group.files && group.files.length > 0 && (
                        <div>
                          <button
                            onClick={() => handleViewFiles(group)}
                            className="text-ruby-400 hover:text-ruby-300 text-sm font-medium transition-colors"
                          >
                            {group.files.length} file(s) - Click to view
                          </button>
                        </div>
                      )}
                      <div className="text-gray-400 text-sm">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Files Modal */}
        {showFilesModal && selectedGroup && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-3 sm:p-4">
            <div className="relative top-4 sm:top-10 md:top-20 mx-auto p-4 sm:p-5 md:p-6 border-2 border-ruby-600/50 w-full max-w-2xl shadow-ruby-glow rounded-xl bg-gray-800">
              <div className="flex justify-between items-start sm:items-center mb-4 gap-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white flex-1 min-w-0">
                  <span className="hidden sm:inline">Files for: </span>
                  <span className="truncate block">{selectedGroup.name}</span>
                </h3>
                <button
                  onClick={() => {
                    setShowFilesModal(false);
                    setSelectedGroup(null);
                  }}
                  className="text-gray-400 hover:text-ruby-300 text-xl sm:text-2xl flex-shrink-0 transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              {selectedGroup.files && selectedGroup.files.length > 0 ? (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {selectedGroup.files.map((file) => (
                    <div key={file.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 p-2 sm:p-3 bg-gray-900/50 rounded-lg border-2 border-gray-700">
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
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
                      <div className="flex flex-row space-x-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleFileView(file)}
                            className="flex-1 sm:flex-none text-ruby-400 hover:text-ruby-300 text-xs sm:text-sm px-3 py-1.5 sm:py-1 rounded-lg hover:bg-ruby-900/30 whitespace-nowrap font-medium transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleFileDownload(file)}
                            className="flex-1 sm:flex-none text-ruby-400 hover:text-ruby-300 text-xs sm:text-sm px-3 py-1.5 sm:py-1 rounded-lg hover:bg-ruby-900/30 whitespace-nowrap font-medium transition-colors"
                          >
                            Download
                          </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-4 text-sm sm:text-base">No files uploaded for this group.</p>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 text-xs sm:text-sm text-gray-400">
          Total Groups: <span className="font-bold text-ruby-400">{filteredGroups.length}</span>
          {filterStatus !== 'all' && filteredGroups.length !== groups.length && (
            <span className="ml-2">
              (of {groups.length} total)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

