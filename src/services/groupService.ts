import { Group, GroupFile, GroupStatus, GroupStatusUpdate } from '../types';
import { analyticsService } from './analyticsService';
import { authService } from './authService';

const loadGroups = (): Group[] => {
  const stored = localStorage.getItem('groups');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

const saveGroups = (groups: Group[]): void => {
  localStorage.setItem('groups', JSON.stringify(groups));
};

// Helper function to normalize groups with backward compatibility
const normalizeGroups = (groups: Group[]): Group[] => {
  return groups.map(group => ({
    ...group,
    leader: group.leader || group.createdBy,
    teachers: group.teachers || [],
    students: group.students || group.members.filter(id => id !== group.createdBy),
    files: group.files || [],
    status: group.status || (group.teachers && group.teachers.length > 0 ? 'pending' : 'approved'),
    statusHistory: group.statusHistory || []
  }));
};

export const groupService = {
  getAllGroups: (): Group[] => {
    const groups = loadGroups();
    // Add backward compatibility for old groups without new fields
    return normalizeGroups(groups);
  },

  getGroupById: (id: string): Group | undefined => {
    const groups = normalizeGroups(loadGroups());
    return groups.find(g => g.id === id);
  },

  getGroupsByUser: (userId: string): Group[] => {
    const groups = normalizeGroups(loadGroups());
    return groups.filter(g => g.members.includes(userId) || g.createdBy === userId);
  },

  createGroup: (name: string, createdBy: string, members: string[], teachers: string[], students: string[], files: GroupFile[] = []): Group => {
    const groups = loadGroups();
    const creator = authService.getUserById(createdBy);
    const isCreatorStudent = creator?.role === 'student';
    
    // Add creator to students array only if they are a student
    const finalStudents = isCreatorStudent 
      ? [...students, createdBy].filter((id, index, arr) => arr.indexOf(id) === index) // Remove duplicates
      : students;
    
    // Set initial status: pending if teachers are assigned, approved if no teachers
    const initialStatus: GroupStatus = teachers.length > 0 ? 'pending' : 'approved';
    const initialStatusUpdate: GroupStatusUpdate = {
      id: Date.now().toString(),
      status: initialStatus,
      updatedBy: createdBy,
      updatedAt: new Date().toISOString(),
      comment: 'Group created'
    };
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      createdBy,
      leader: createdBy, // Creator is automatically the leader
      members: [...members, createdBy].filter((id, index, arr) => arr.indexOf(id) === index), // Include creator in members, remove duplicates
      teachers,
      students: finalStudents,
      files: files || [],
      status: initialStatus,
      statusHistory: [initialStatusUpdate],
      createdAt: new Date().toISOString()
    };
    groups.push(newGroup);
    saveGroups(groups);
    // Update analytics when group is created
    analyticsService.updateAnalytics('student', 1);
    return newGroup;
  },

  updateGroupStatus: (groupId: string, status: GroupStatus, updatedBy: string, comment?: string): boolean => {
    const groups = loadGroups();
    const index = groups.findIndex(g => g.id === groupId);
    if (index === -1) return false;
    
    const statusUpdate = {
      id: Date.now().toString(),
      status,
      updatedBy,
      updatedAt: new Date().toISOString(),
      comment
    };
    
    groups[index] = {
      ...groups[index],
      status,
      statusHistory: [...(groups[index].statusHistory || []), statusUpdate]
    };
    saveGroups(groups);
    return true;
  },

  updateGroup: (id: string, name: string, members: string[], teachers: string[], students: string[]): boolean => {
    const groups = loadGroups();
    const index = groups.findIndex(g => g.id === id);
    if (index === -1) return false;
    
    groups[index] = {
      ...groups[index],
      name,
      members,
      teachers,
      students
    };
    saveGroups(groups);
    return true;
  },

  deleteGroup: (id: string): boolean => {
    const groups = loadGroups();
    const filtered = groups.filter(g => g.id !== id);
    if (filtered.length === groups.length) return false;
    saveGroups(filtered);
    return true;
  }
};

