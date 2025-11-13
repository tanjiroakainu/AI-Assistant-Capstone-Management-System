import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Group, GroupStatus, GroupFile } from '../../types';
import { groupService } from '../../services/groupService';
import { authService } from '../../services/authService';

export const ApproveGroups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [status, setStatus] = useState<GroupStatus>('approved');
  const [comment, setComment] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadGroups();
  }, [user]);

  const loadGroups = () => {
    if (user) {
      const allGroups = groupService.getAllGroups();
      // Show groups where current teacher is assigned
      const teacherGroups = allGroups.filter(g => 
        g.teachers && g.teachers.includes(user.id)
      );
      setGroups(teacherGroups);
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

  const handleOpenModal = (group: Group) => {
    setSelectedGroup(group);
    setStatus(group.status);
    setComment('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGroup(null);
    setComment('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !user) return;

    const success = groupService.updateGroupStatus(
      selectedGroup.id,
      status,
      user.id,
      comment || undefined
    );

    if (success) {
      loadGroups();
      handleCloseModal();
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
            <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">Approve Capstone Groups</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Review and approve/reject student capstone proposals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {groups.map((group) => (
            <div key={group.id} className="bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-xl p-4 sm:p-6 border-2 border-ruby-600/30 hover:border-ruby-500 hover:shadow-ruby-glow transition-all">
              <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex-1 min-w-0">{group.name}</h3>
                <span className={`px-2 py-1 text-xs font-bold rounded-lg whitespace-nowrap ${getStatusColor(group.status)}`}>
                  {group.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <div className="mb-3">
                <p className="text-sm sm:text-base text-gray-300 mb-1">
                  <strong className="text-white">Created by:</strong> <span className="text-ruby-400">{getUserName(group.createdBy)}</span>
                </p>
                <p className="text-sm sm:text-base text-gray-300 mb-1">
                  <strong className="text-white">Leader:</strong> <span className="text-ruby-400">{getUserName(group.leader)}</span>
                </p>
                <p className="text-sm sm:text-base text-gray-300 mb-1">
                  <strong className="text-white">Created:</strong> {new Date(group.createdAt).toLocaleDateString()}
                </p>
              </div>

              {group.teachers && group.teachers.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm sm:text-base font-medium text-gray-300 mb-1">Teachers:</p>
                  <ul className="list-disc list-inside text-sm sm:text-base text-white">
                    {group.teachers.map((teacherId) => (
                      <li key={teacherId}>{getUserName(teacherId)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {group.students && group.students.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm sm:text-base font-medium text-gray-300 mb-1">Students:</p>
                  <ul className="list-disc list-inside text-sm sm:text-base text-white">
                    {group.students.map((studentId) => (
                      <li key={studentId}>{getUserName(studentId)}</li>
                    ))}
                  </ul>
                </div>
              )}

              {group.files && group.files.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm sm:text-base font-medium text-white mb-2">Group Files:</p>
                  <div className="space-y-2">
                    {group.files.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg border-2 border-gray-700">
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

              <button
                onClick={() => handleOpenModal(group)}
                className="w-full bg-gradient-to-r from-ruby-600 to-ruby-700 hover:from-ruby-700 hover:to-ruby-800 text-white px-4 py-2 rounded-lg text-sm sm:text-base font-bold shadow-md hover:shadow-ruby-glow transition-all transform hover:scale-105 active:scale-95"
              >
                Update Status
              </button>
            </div>
          ))}
        </div>

        {groups.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm sm:text-base">No groups assigned to you for approval.</p>
          </div>
        )}

        {showModal && selectedGroup && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm overflow-y-auto h-full w-full z-50 p-3 sm:p-4">
            <div className="relative top-4 sm:top-10 md:top-20 mx-auto p-4 sm:p-5 md:p-6 border-2 border-ruby-600/50 w-full max-w-md sm:w-96 shadow-ruby-glow rounded-xl bg-gray-800">
              <div className="mt-1 sm:mt-3">
                <h3 className="text-base sm:text-lg md:text-xl font-bold leading-6 text-white mb-3 sm:mb-4">
                  <span className="hidden sm:inline">Update Group Status: </span>
                  <span className="truncate block">{selectedGroup.name}</span>
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as GroupStatus)}
                      className="w-full px-3 py-2 text-sm sm:text-base border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500"
                      required
                    >
                      <option value="pending" className="bg-gray-900">Pending</option>
                      <option value="approved" className="bg-gray-900">Approved</option>
                      <option value="rejected" className="bg-gray-900">Rejected</option>
                      <option value="in_progress" className="bg-gray-900">In Progress</option>
                      <option value="completed" className="bg-gray-900">Completed</option>
                      <option value="on_hold" className="bg-gray-900">On Hold</option>
                    </select>
                  </div>
                  <div className="mb-4 sm:mb-5">
                    <label className="block text-xs sm:text-sm font-medium text-white mb-1">
                      Comment (Optional)
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 text-sm sm:text-base border-2 border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-ruby-500 focus:border-ruby-500 placeholder-gray-500"
                      rows={3}
                      placeholder="Add a comment about this status change..."
                    />
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
                      Update Status
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
