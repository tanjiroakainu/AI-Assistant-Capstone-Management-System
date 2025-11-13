import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { UserManagement } from './components/admin/UserManagement';
import { AdminChart } from './components/admin/AdminChart';
import { ViewAllGroups } from './components/admin/ViewAllGroups';
import { AdminProposals } from './components/admin/AdminProposals';
import { GroupList } from './components/student/GroupList';
import { CreateGroup } from './components/student/CreateGroup';
import { StudentChart } from './components/student/StudentChart';
import { ProposalHistory } from './components/student/ProposalHistory';
import { ViewStudents } from './components/teacher/ViewStudents';
import { TeacherChart } from './components/teacher/TeacherChart';
import { ApproveGroups } from './components/teacher/ApproveGroups';
import { StudentProposals } from './components/teacher/StudentProposals';
import { Profile } from './components/Profile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/chart"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminChart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/groups"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ViewAllGroups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/proposals"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProposals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/groups"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <GroupList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/create-group"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <CreateGroup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/chart"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentChart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/proposal-history"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <ProposalHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/students"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <ViewStudents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/chart"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherChart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/approve-groups"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <ApproveGroups />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/proposals"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <StudentProposals />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

