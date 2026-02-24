import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Award, Calendar, Percent } from 'lucide-react';
import PeriodToggle from '../components/PeriodToggle';
import { getTrends, getSubjectDistribution, getMonthlyGrowth, getTeacherDistribution } from '../services/api';

function Analytics() {
  const [trends, setTrends] = useState([]);
  const [subjectDistribution, setSubjectDistribution] = useState([]);
  const [monthlyGrowth, setMonthlyGrowth] = useState([]);
  const [teacherDistribution, setTeacherDistribution] = useState([]);
  const [period, setPeriod] = useState('month');
  const [loading, setLoading] = useState(true);

  const colors = {
    lessons: '#3B2621',
    quizzes: '#D97706',
    assessments: '#0F766E',
    pieColors: ['#3B2621', '#D97706', '#0F766E', '#A8A29E', '#5B8C8A']
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [trendsData, subjectData, monthlyData, teacherData] = await Promise.all([
        getTrends(null, period),
        getSubjectDistribution(),
        getMonthlyGrowth(),
        getTeacherDistribution('year')
      ]);
      setTrends(trendsData);
      setSubjectDistribution(subjectData);
      setMonthlyGrowth(monthlyData);
      setTeacherDistribution(teacherData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateGrowth = () => {
    if (monthlyGrowth.length < 2) return 0;
    const last = monthlyGrowth[monthlyGrowth.length - 1]?.total || 0;
    const prev = monthlyGrowth[monthlyGrowth.length - 2]?.total || 0;
    if (prev === 0) return 100;
    return ((last - prev) / prev * 100).toFixed(1);
  };

  const getTopTeacher = () => {
    if (!teacherDistribution.length) return null;
    return teacherDistribution.reduce((max, teacher) => 
      teacher.total > max.total ? teacher : max
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-lg border" style={{ borderColor: '#3B262120' }}>
          <p className="text-sm font-medium" style={{ color: '#3B2621' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs mt-1" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: '#3B262120', borderTopColor: '#3B2621' }} />
      </div>
    );
  }

  const topTeacher = getTopTeacher();
  const growth = calculateGrowth();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#3B2621' }}>Advanced Analytics</h1>
          <p className="text-sm mt-1" style={{ color: '#3B262180' }}>Deep dive into teacher performance metrics</p>
        </div>
        <PeriodToggle selected={period} onChange={setPeriod} />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-3xl border p-6" style={{ borderColor: '#3B262120' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.quizzes}20` }}>
              <TrendingUp className="w-6 h-6" style={{ color: colors.quizzes }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#3B262180' }}>Growth Rate</p>
              <p className="text-2xl font-bold" style={{ color: colors.quizzes }}>{growth}%</p>
              <p className="text-xs" style={{ color: '#3B262180' }}>vs previous period</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border p-6" style={{ borderColor: '#3B262120' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.lessons}20` }}>
              <Award className="w-6 h-6" style={{ color: colors.lessons }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#3B262180' }}>Top Teacher</p>
              <p className="text-xl font-bold truncate" style={{ color: colors.lessons }}>{topTeacher?.teacher_name || 'N/A'}</p>
              <p className="text-xs" style={{ color: '#3B262180' }}>{topTeacher?.total} activities</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border p-6" style={{ borderColor: '#3B262120' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.assessments}20` }}>
              <Percent className="w-6 h-6" style={{ color: colors.assessments }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: '#3B262180' }} >Avg per Teacher</p>
              <p className="text-2xl font-bold" style={{ color: colors.assessments }}>
                {Math.round((trends.reduce((acc, curr) => acc + curr.total, 0) / (teacherDistribution.length || 1)) * 10) / 10}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Distribution - Pie Chart */}
        <div className="bg-white rounded-3xl border p-6" style={{ borderColor: '#3B262120' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#3B2621' }}>Subject Distribution</h2>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {subjectDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors.pieColors[index % colors.pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Growth - Area Chart */}
        <div className="bg-white rounded-3xl border p-6" style={{ borderColor: '#3B262120' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#3B2621' }}>Monthly Activity Growth</h2>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D9A58B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D9A58B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#3B262180" fontSize={12} />
                <YAxis stroke="#3B262180" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" stroke="#D9A58B" fill="url(#colorTotal)" strokeWidth={2} />
                <Area type="monotone" dataKey="lessons" stroke={colors.lessons} fill="none" strokeWidth={2} />
                <Area type="monotone" dataKey="quizzes" stroke={colors.quizzes} fill="none" strokeWidth={2} />
                <Area type="monotone" dataKey="assessments" stroke={colors.assessments} fill="none" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Trends */}
        <div className="lg:col-span-2 bg-white rounded-3xl border p-6" style={{ borderColor: '#3B262120' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#3B2621' }}>Performance Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: '#3B262120' }}>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: '#3B262180' }}>Teacher</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: '#3B262180' }}>Lessons</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: '#3B262180' }}>Quizzes</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: '#3B262180' }}>Assessments</th>
                  <th className="text-left py-3 px-4 text-sm font-medium" style={{ color: '#3B262180' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {teacherDistribution.slice(0, 5).map((teacher, index) => (
                  <tr key={index} className="border-b last:border-0" style={{ borderColor: '#3B262110' }}>
                    <td className="py-3 px-4">
                      <span className="font-medium" style={{ color: '#3B2621' }}>{teacher.teacher_name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: `${colors.lessons}20`, color: colors.lessons }}>
                        {teacher.lessons}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: `${colors.quizzes}20`, color: colors.quizzes }}>
                        {teacher.quizzes}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: `${colors.assessments}20`, color: colors.assessments }}>
                        {teacher.assessments}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold" style={{ color: '#3B2621' }}>{teacher.total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;