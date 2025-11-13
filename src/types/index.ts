export type UserRole = 'admin' | 'student' | 'teacher';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  profilePhoto?: string; // Base64 encoded profile photo
}

export interface GroupFile {
  id: string;
  name: string;
  type: 'image' | 'pdf';
  data: string; // Base64 encoded file data
  uploadedBy: string;
  uploadedAt: string;
}

export type GroupStatus = 'pending' | 'approved' | 'rejected' | 'in_progress' | 'completed' | 'on_hold';

export interface GroupStatusUpdate {
  id: string;
  status: GroupStatus;
  updatedBy: string;
  updatedAt: string;
  comment?: string;
}

export interface Group {
  id: string;
  name: string;
  createdBy: string;
  leader: string;
  members: string[];
  teachers: string[];
  students: string[];
  files: GroupFile[];
  status: GroupStatus;
  statusHistory: GroupStatusUpdate[];
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  refreshUser: () => void;
  isAuthenticated: boolean;
}

