import { User, UserRole } from '../types';
import { analyticsService } from './analyticsService';

// Initialize default users
const defaultUsers: User[] = [
  {
    id: '1',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User'
  },
  {
    id: '2',
    email: 'student@gmail.com',
    password: 'student123',
    role: 'student',
    name: 'Student User'
  },
  {
    id: '3',
    email: 'teacher@gmail.com',
    password: 'teacher123',
    role: 'teacher',
    name: 'Teacher User'
  }
];

// Load users from localStorage or use defaults
const loadUsers = (): User[] => {
  const stored = localStorage.getItem('users');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('users', JSON.stringify(defaultUsers));
  return defaultUsers;
};

// Save users to localStorage
const saveUsers = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const authService = {
  login: (email: string, password: string): User | null => {
    const users = loadUsers();
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
  },

  register: (email: string, password: string, name: string): boolean => {
    const users = loadUsers();
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      return false;
    }
    // Only students can register
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: 'student'
    };
    users.push(newUser);
    saveUsers(users);
    // Update admin analytics when user is registered
    analyticsService.updateAnalytics('admin');
    return true;
  },

  getAllUsers: (): User[] => {
    return loadUsers();
  },

  getUserById: (id: string): User | undefined => {
    const users = loadUsers();
    return users.find(u => u.id === id);
  },

  addUser: (email: string, password: string, name: string, role: UserRole): boolean => {
    const users = loadUsers();
    if (users.some(u => u.email === email)) {
      return false;
    }
    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role
    };
    users.push(newUser);
    saveUsers(users);
    // Update admin analytics when user is added
    analyticsService.updateAnalytics('admin');
    return true;
  },

  updateUser: (id: string, email: string, password: string, name: string, role: UserRole): boolean => {
    const users = loadUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    // Check if email is taken by another user
    if (users.some(u => u.email === email && u.id !== id)) {
      return false;
    }
    
    // Preserve existing profile photo when updating
    const existingProfilePhoto = users[index].profilePhoto;
    users[index] = { id, email, password, name, role, profilePhoto: existingProfilePhoto };
    saveUsers(users);
    return true;
  },

  updateProfilePhoto: (id: string, profilePhoto: string): boolean => {
    const users = loadUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    
    users[index] = { ...users[index], profilePhoto };
    saveUsers(users);
    return true;
  },

  deleteUser: (id: string): boolean => {
    const users = loadUsers();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;
    saveUsers(filtered);
    // Update admin analytics when user is deleted
    analyticsService.updateAnalytics('admin');
    return true;
  }
};

