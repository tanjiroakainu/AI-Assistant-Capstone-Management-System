import { UserRole } from '../types';
import { authService } from './authService';
import { groupService } from './groupService';

export interface ChartDataPoint {
  date: string;
  value: number;
  label: string;
}

// Record user count for a specific date
const recordUserCount = (date: string, userCount: number): void => {
  const key = `userCount_${date}`;
  localStorage.setItem(key, userCount.toString());
};

// Get recorded user count for a specific date
const getRecordedUserCount = (date: string): number | null => {
  const key = `userCount_${date}`;
  const stored = localStorage.getItem(key);
  return stored ? parseInt(stored, 10) : null;
};

// Get actual total user count in the system
const getTotalUserCount = (): number => {
  const allUsers = authService.getAllUsers();
  return allUsers.length;
};

// Get actual system data for analytics
const getActualSystemData = (role: UserRole): ChartDataPoint[] => {
  const data: ChartDataPoint[] = [];
  const today = new Date();
  const currentUserCount = getTotalUserCount();
  
  // For admin: track total user count
  if (role === 'admin') {
    // Get historical data or generate from current state
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Try to get recorded count for this date
      let userCount = getRecordedUserCount(dateStr);
      
      // If no record exists, estimate based on current count and days ago
      if (userCount === null) {
        // Estimate: assume gradual growth/decline from past to present
        const daysAgo = i;
        // Start with a base estimate (current count minus some for growth)
        const estimatedBase = Math.max(1, currentUserCount - Math.floor(daysAgo * 0.1));
        userCount = estimatedBase;
      }
      
      data.push({
        date: dateStr,
        value: userCount,
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }
    
    // Record today's count
    recordUserCount(today.toISOString().split('T')[0], currentUserCount);
    return data;
  }
  
  // For student and teacher: use existing logic
  const allUsers = authService.getAllUsers();
  const allGroups = groupService.getAllGroups();
  
  let baseValue = 0;
  
  if (role === 'student') {
    const students = allUsers.filter(u => u.role === 'student');
    const studentGroups = allGroups.filter(g => 
      g.students && g.students.length > 0
    );
    baseValue = students.length + studentGroups.length;
  } else if (role === 'teacher') {
    const teachers = allUsers.filter(u => u.role === 'teacher');
    const students = allUsers.filter(u => u.role === 'student');
    const teacherGroups = allGroups.filter(g => 
      g.teachers && g.teachers.length > 0
    );
    // Teachers chart shows teachers + students
    baseValue = teachers.length + students.length + teacherGroups.length;
  }
  
  // Generate 30 days of data with variations based on actual system state
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Use actual data with some daily variation to show trends
    const dayVariation = Math.sin(i / 5) * (baseValue * 0.1); // 10% variation
    const randomVariation = (Math.random() - 0.5) * (baseValue * 0.05); // 5% random
    const value = Math.max(1, Math.round(baseValue + dayVariation + randomVariation));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value,
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

// Get real-time analytics data
const getRealTimeData = (role: UserRole): number => {
  if (role === 'admin') {
    // Admin: return total user count
    return getTotalUserCount();
  }
  
  const allUsers = authService.getAllUsers();
  const allGroups = groupService.getAllGroups();
  
  if (role === 'student') {
    const students = allUsers.filter(u => u.role === 'student');
    const studentGroups = allGroups.filter(g => 
      g.students && g.students.length > 0
    );
    return students.length + studentGroups.length;
  } else if (role === 'teacher') {
    const teachers = allUsers.filter(u => u.role === 'teacher');
    const students = allUsers.filter(u => u.role === 'student');
    const teacherGroups = allGroups.filter(g => 
      g.teachers && g.teachers.length > 0
    );
    // Teachers chart shows teachers + students
    return teachers.length + students.length + teacherGroups.length;
  }
  
  return 0;
};

export const analyticsService = {
  getStudentAnalytics: (): ChartDataPoint[] => {
    const stored = localStorage.getItem('studentAnalytics');
    if (stored) {
      const storedData: ChartDataPoint[] = JSON.parse(stored);
      // Update today's value with real data
      const today = new Date().toISOString().split('T')[0];
      const todayIndex = storedData.findIndex(d => d.date === today);
      const realValue = getRealTimeData('student');
      
      if (todayIndex >= 0) {
        storedData[todayIndex].value = realValue;
      } else {
        storedData.push({
          date: today,
          value: realValue,
          label: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
        // Keep only last 30 days
        if (storedData.length > 30) {
          storedData.shift();
        }
      }
      localStorage.setItem('studentAnalytics', JSON.stringify(storedData));
      return storedData;
    }
    const data = getActualSystemData('student');
    localStorage.setItem('studentAnalytics', JSON.stringify(data));
    return data;
  },

  getTeacherAnalytics: (): ChartDataPoint[] => {
    const stored = localStorage.getItem('teacherAnalytics');
    if (stored) {
      const storedData: ChartDataPoint[] = JSON.parse(stored);
      // Update today's value with real data
      const today = new Date().toISOString().split('T')[0];
      const todayIndex = storedData.findIndex(d => d.date === today);
      const realValue = getRealTimeData('teacher');
      
      if (todayIndex >= 0) {
        storedData[todayIndex].value = realValue;
      } else {
        storedData.push({
          date: today,
          value: realValue,
          label: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
        // Keep only last 30 days
        if (storedData.length > 30) {
          storedData.shift();
        }
      }
      localStorage.setItem('teacherAnalytics', JSON.stringify(storedData));
      return storedData;
    }
    const data = getActualSystemData('teacher');
    localStorage.setItem('teacherAnalytics', JSON.stringify(data));
    return data;
  },

  getAdminAnalytics: (): ChartDataPoint[] => {
    const stored = localStorage.getItem('adminAnalytics');
    const today = new Date().toISOString().split('T')[0];
    const currentUserCount = getTotalUserCount();
    
    // Record today's user count
    recordUserCount(today, currentUserCount);
    
    if (stored) {
      const storedData: ChartDataPoint[] = JSON.parse(stored);
      const todayIndex = storedData.findIndex(d => d.date === today);
      
      if (todayIndex >= 0) {
        // Update today's value with actual user count
        storedData[todayIndex].value = currentUserCount;
      } else {
        // Add today's data point
        storedData.push({
          date: today,
          value: currentUserCount,
          label: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
        // Keep only last 30 days
        if (storedData.length > 30) {
          storedData.shift();
        }
      }
      localStorage.setItem('adminAnalytics', JSON.stringify(storedData));
      return storedData;
    }
    
    // Generate initial data based on current system state
    const data = getActualSystemData('admin');
    localStorage.setItem('adminAnalytics', JSON.stringify(data));
    return data;
  },

  updateAnalytics: (role: UserRole, increment: number = 1): void => {
    let data: ChartDataPoint[];
    if (role === 'student') {
      data = analyticsService.getStudentAnalytics();
    } else if (role === 'teacher') {
      data = analyticsService.getTeacherAnalytics();
    } else {
      data = analyticsService.getAdminAnalytics();
    }
    
    const today = new Date().toISOString().split('T')[0];
    const lastDataPoint = data[data.length - 1];
    
    if (role === 'admin') {
      // For admin, use actual user count
      const currentUserCount = getTotalUserCount();
      recordUserCount(today, currentUserCount);
      
      if (lastDataPoint.date === today) {
        lastDataPoint.value = currentUserCount;
      } else {
        data.push({
          date: today,
          value: currentUserCount,
          label: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
        
        // Keep only last 30 days
        if (data.length > 30) {
          data.shift();
        }
      }
    } else {
      // For student and teacher, use increment logic
      if (lastDataPoint.date === today) {
        lastDataPoint.value += increment;
      } else {
        const realValue = getRealTimeData(role);
        data.push({
          date: today,
          value: realValue + increment,
          label: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
        
        // Keep only last 30 days
        if (data.length > 30) {
          data.shift();
        }
      }
    }
    
    if (role === 'student') {
      localStorage.setItem('studentAnalytics', JSON.stringify(data));
    } else if (role === 'teacher') {
      localStorage.setItem('teacherAnalytics', JSON.stringify(data));
    } else {
      localStorage.setItem('adminAnalytics', JSON.stringify(data));
    }
  },

  // Refresh analytics with current system data
  refreshAnalytics: (): void => {
    // Force refresh by clearing and regenerating
    localStorage.removeItem('studentAnalytics');
    localStorage.removeItem('teacherAnalytics');
    localStorage.removeItem('adminAnalytics');
  }
};
