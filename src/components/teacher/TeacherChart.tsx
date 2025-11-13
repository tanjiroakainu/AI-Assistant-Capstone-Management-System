import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyticsService, ChartDataPoint } from '../../services/analyticsService';

export const TeacherChart = () => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Refresh analytics to get latest system data
    const analyticsData = analyticsService.getTeacherAnalytics();
    setData(analyticsData);
    setLoading(false);
  }, []);

  const calculateStats = () => {
    if (data.length === 0) return { current: 0, previous: 0, change: 0, changePercent: 0 };
    
    const current = data[data.length - 1]?.value || 0;
    const previous = data.length > 1 ? data[data.length - 2]?.value || 0 : current;
    const change = current - previous;
    const changePercent = previous !== 0 ? ((change / previous) * 100) : 0;
    
    return { current, previous, change, changePercent };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard" className="text-ruby-400 hover:text-ruby-300 mb-2 inline-block text-sm sm:text-base font-medium transition-colors">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            <span className="bg-gradient-to-r from-ruby-400 to-ruby-600 bg-clip-text text-transparent">Teacher Analytics</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Track actual system data: teachers, students, and groups</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-sm sm:text-base">Loading chart data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
              <div className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
                <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-300 mb-2">Current Value</h3>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-ruby-400">{stats.current}</p>
              </div>
              <div className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
                <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-300 mb-2">Previous Value</h3>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-300">{stats.previous}</p>
              </div>
              <div className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-md hover:shadow-ruby-glow transition-all border-2 border-ruby-600/30">
                <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-300 mb-2">Change</h3>
                <p className={`text-xl sm:text-2xl lg:text-3xl font-bold ${stats.change >= 0 ? 'text-ruby-400' : 'text-red-400'}`}>
                  {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(1)} ({stats.changePercent >= 0 ? '+' : ''}{stats.changePercent.toFixed(1)}%)
                </p>
              </div>
            </div>

            <div className="bg-gray-800/90 backdrop-blur-sm p-4 sm:p-6 rounded-xl shadow-lg border-2 border-ruby-600/30">
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 md:mb-4 text-white">System Data Trend (Last 30 Days)</h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">Shows actual count of teachers, students, and groups in the system</p>
              <div className="w-full overflow-x-auto">
                <div className="w-full min-w-[300px]" style={{ height: '250px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                      <XAxis 
                        dataKey="label" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        tick={{ fontSize: 10, fill: '#d1d5db' }}
                      />
                      <YAxis tick={{ fontSize: 10, fill: '#d1d5db' }} />
                      <Tooltip contentStyle={{ fontSize: '12px', backgroundColor: '#1f2937', border: '1px solid #dc2626', borderRadius: '8px', color: '#fff' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', color: '#fff' }} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#dc2626" 
                        strokeWidth={3}
                        name="Teachers, Students & Groups"
                        dot={{ r: 5, fill: '#dc2626' }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

