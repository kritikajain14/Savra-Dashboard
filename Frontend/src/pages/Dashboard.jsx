import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, Calendar, Award, BookOpen, ClipboardList, GraduationCap, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PeriodToggle from '../components/PeriodToggle';
import TeacherFilter from '../components/TeacherFilter';
import { getOverview, getAllTeachers, getTrends, getTeacherDistribution, getTeacherData } from '../services/api';

function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [trends, setTrends] = useState([]);
  const [teacherDistribution, setTeacherDistribution] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTeacherData, setSelectedTeacherData] = useState(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const colors = {
    lessons: '#3B2621',
    quizzes: '#D97706',
    assessments: '#0F766E',
    activeTeachers: '#A8A29E'
  };

  const fetchData = async () => {
    try {
      setError(null);

      // Always fetch overview for total stats
      const overviewData = await getOverview(period);
      setOverview(overviewData);

      // Fetch teachers list
      const teachersData = await getAllTeachers();
      setTeachers(teachersData);

      // Fetch distribution data
      const distributionData = await getTeacherDistribution(period);
      setTeacherDistribution(distributionData);

      // If a teacher is selected, fetch their specific data
      if (selectedTeacher) {
        const teacherSpecificData = await getTeacherData(selectedTeacher);
        setSelectedTeacherData(teacherSpecificData);

        // Fetch trends for selected teacher
        const trendsData = await getTrends(selectedTeacher, period);
        setTrends(trendsData);
      } else {
        setSelectedTeacherData(null);
        // Fetch overall trends
        const trendsData = await getTrends(null, period);
        setTrends(trendsData);
      }

    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTeacher, period]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeacher(teacherId);
  };

  const handleClearTeacher = () => {
    setSelectedTeacher(null);
    setSelectedTeacherData(null);
  };

  // Calculate insights
  const getTopPerformer = () => {
    if (!teacherDistribution.length) return null;
    return teacherDistribution.reduce((max, teacher) =>
      teacher.total > max.total ? teacher : max
    );
  };

  const getWeeklyGrowth = () => {
    if (trends.length < 2) return 0;
    const lastWeek = trends[trends.length - 1]?.total || 0;
    const prevWeek = trends[trends.length - 2]?.total || 0;
    if (prevWeek === 0) return 100;
    return Math.round(((lastWeek - prevWeek) / prevWeek) * 100);
  };

  const getSelectedTeacherName = () => {
    if (!selectedTeacher) return 'All Teachers';
    const teacher = teachers.find(t => t._id === selectedTeacher);
    return teacher ? teacher.teacher_name : 'All Teachers';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-2xl shadow-lg border" style={{ borderColor: '#3B262120' }}>
          <p className="text-sm font-semibold mb-2" style={{ color: '#3B2621' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
                <span style={{ color: '#3B262180' }}>{entry.name}:</span>
              </div>
              <span className="font-medium ml-4" style={{ color: '#3B2621' }}>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 rounded-full animate-spin mx-auto mb-4"
            style={{ borderColor: '#3B262120', borderTopColor: '#3B2621' }} />
          <p style={{ color: '#3B2621' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p style={{ color: '#3B2621' }} className="mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-2 rounded-xl text-white"
            style={{ backgroundColor: '#3B2621' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Determine what data to show in cards
  const cardData = selectedTeacher && selectedTeacherData ? {
    lessons: selectedTeacherData.overview?.lessons || 0,
    quizzes: selectedTeacherData.overview?.quizzes || 0,
    assessments: selectedTeacherData.overview?.assessments || 0,
    totalTeachers: 1
  } : overview;

  const summaryCards = [
    {
      title: 'Total Lessons',
      value: cardData?.lessons || 0,
      icon: BookOpen,
      color: colors.lessons,
      bgColor: `${colors.lessons}20`
    },
    {
      title: 'Total Quizzes',
      value: cardData?.quizzes || 0,
      icon: ClipboardList,
      color: colors.quizzes,
      bgColor: `${colors.quizzes}20`
    },
    {
      title: 'Total Assessments',
      value: cardData?.assessments || 0,
      icon: GraduationCap,
      color: colors.assessments,
      bgColor: `${colors.assessments}20`
    },
    {
      title: selectedTeacher ? 'Selected Teacher' : 'Active Teachers',
      value: cardData?.totalTeachers || 0,
      icon: Users,
      color: colors.activeTeachers,
      bgColor: `${colors.activeTeachers}20`
    }
  ];

  const topPerformer = getTopPerformer();
  const weeklyGrowth = getWeeklyGrowth();

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#3B2621' }}>
              Teacher Insights Dashboard
            </h1>
            {selectedTeacher && (
              <button
                onClick={handleClearTeacher}
                className="px-3 py-1 text-xs rounded-full flex items-center gap-1"
                style={{ backgroundColor: `${colors.quizzes}20`, color: colors.quizzes }}
              >
                {getSelectedTeacherName()} <span className="text-lg">×</span>
              </button>
            )}
          </div>
          <p className="text-sm flex items-center gap-2 mt-1" style={{ color: '#3B262180' }}>
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <PeriodToggle selected={period} onChange={setPeriod} />

          <TeacherFilter
            teachers={teachers}
            selectedTeacher={selectedTeacher}
            onSelect={handleTeacherSelect}
          />

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 bg-white border rounded-xl hover:shadow-md transition-all"
            style={{ borderColor: '#3B262120' }}
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
              style={{ color: '#3B262180' }} />
          </button>
        </div>
      </div>

      {/* Summary Cards - Show individual teacher data when selected */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border p-6"
              style={{ borderColor: '#3B262120' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: '#3B262180' }}>{card.title}</p>
                  <p className="text-3xl font-bold" style={{ color: card.color }}>{card.value}</p>
                </div>
                <div className="p-3 rounded-xl group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: card.bgColor }}>
                  <Icon className="w-6 h-6" style={{ color: card.color }} />
                </div>
              </div>
              <div className="mt-4">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#3B262110' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (card.value / 50) * 100)}%`,
                      backgroundColor: card.color
                    }}
                  />
                </div>
                <p className="text-xs mt-2" style={{ color: '#3B262180' }}>
                  {selectedTeacher
                    ? `Individual teacher stats for ${getSelectedTeacherName()}`
                    : 'All teachers combined'
                  }
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats when teacher is selected */}
      {selectedTeacher && selectedTeacherData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border p-4" style={{ borderColor: '#3B262120' }}>
            <p className="text-xs" style={{ color: '#3B262180' }}>Teacher Since</p>
            <p className="text-sm font-semibold mt-1" style={{ color: '#3B2621' }}>February 2026</p>
          </div>
          <div className="bg-white rounded-2xl border p-4" style={{ borderColor: '#3B262120' }}>
            <p className="text-xs" style={{ color: '#3B262180' }}>Activity Rate</p>
            <p className="text-sm font-semibold mt-1" style={{ color: colors.quizzes }}>
              {Math.round((selectedTeacherData.total / 30) * 100)}% active
            </p>
          </div>
          <div className="bg-white rounded-2xl border p-4" style={{ borderColor: '#3B262120' }}>
            <p className="text-xs" style={{ color: '#3B262180' }}>Primary Focus</p>
            <p className="text-sm font-semibold mt-1" style={{ color: colors.lessons }}>
              {selectedTeacherData.lessons > selectedTeacherData.quizzes ?
                (selectedTeacherData.lessons > selectedTeacherData.assessments ? 'Lessons' : 'Assessments') :
                (selectedTeacherData.quizzes > selectedTeacherData.assessments ? 'Quizzes' : 'Assessments')}
            </p>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Activity Trends - Bar Chart */}
        <div className="bg-white rounded-3xl shadow-sm border p-6" style={{ borderColor: '#3B262120' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: '#3B2621' }}>
              {selectedTeacher ? `${getSelectedTeacherName()}'s Activity Trends` : 'Weekly Activity Trends'}
            </h2>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: '#3B262110', color: '#3B2621' }}>
              {period}
            </span>
          </div>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="period" stroke="#3B262180" fontSize={12} />
                <YAxis stroke="#3B262180" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="lessons" name="Lessons" fill={colors.lessons} radius={[4, 4, 0, 0]} />
                <Bar dataKey="quizzes" name="Quizzes" fill={colors.quizzes} radius={[4, 4, 0, 0]} />
                <Bar dataKey="assessments" name="Assessments" fill={colors.assessments} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Teacher/Individual Distribution - Bar Chart */}
        <div className="bg-white rounded-3xl shadow-sm border p-6" style={{ borderColor: '#3B262120' }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#3B2621' }}>
            {selectedTeacher ? `${getSelectedTeacherName()}'s Activity Breakdown` : 'Top 5 Teachers Performance'}
          </h2>
          <div className="h-75">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={selectedTeacher ?
                  [teacherDistribution.find(t => t._id === selectedTeacher)] :
                  teacherDistribution.slice(0, 5)
                }
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="teacher_name"
                  stroke="#3B262180"
                  fontSize={12}
                />
                <YAxis stroke="#3B262180" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="lessons" name="Lessons" fill={colors.lessons} radius={[4, 4, 0, 0]} />
                <Bar dataKey="quizzes" name="Quizzes" fill={colors.quizzes} radius={[4, 4, 0, 0]} />
                <Bar dataKey="assessments" name="Assessments" fill={colors.assessments} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Teacher List with their data - Click to select */}
      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden mb-6" style={{ borderColor: '#3B262120' }}>
        <div className="p-6 border-b" style={{ borderColor: '#3B262120', backgroundColor: '#3B262105' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold" style={{ color: '#3B2621' }}>Teacher Performance Overview</h2>
              <p className="text-sm mt-1" style={{ color: '#3B262180' }}>
                Click on any teacher row to see their individual stats in cards above
              </p>
            </div>
            {selectedTeacher && (
              <button
                onClick={handleClearTeacher}
                className="text-sm px-3 py-1.5 rounded-lg flex items-center gap-1"
                style={{ backgroundColor: '#3B262110', color: '#3B2621' }}
              >
                Clear Selection
              </button>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: '#3B262120' }}>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#3B262180' }}>Teacher Name</th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#3B262180' }}>Lessons</th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#3B262180' }}>Quizzes</th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#3B262180' }}>Assessments</th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#3B262180' }}>Total</th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#3B262180' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {teacherDistribution.map((teacher, index) => (
                <tr
                  key={index}
                  className="border-b last:border-0 hover:bg-opacity-50 transition-colors"
                  style={{
                    borderColor: '#3B262110',
                    backgroundColor: selectedTeacher === teacher._id ? '#3B262105' : 'transparent'
                  }}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                        style={{ background: `linear-gradient(135deg, ${colors.lessons}, ${colors.quizzes})` }}>
                        {teacher.teacher_name?.charAt(0)}
                      </div>
                      <span style={{ color: '#3B2621', fontWeight: selectedTeacher === teacher._id ? 600 : 400 }}>
                        {teacher.teacher_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: `${colors.lessons}20`, color: colors.lessons }}>
                      {teacher.lessons}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: `${colors.quizzes}20`, color: colors.quizzes }}>
                      {teacher.quizzes}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: `${colors.assessments}20`, color: colors.assessments }}>
                      {teacher.assessments}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold" style={{ color: '#3B2621' }}>{teacher.total}</span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleTeacherSelect(teacher._id)}
                      className="px-3 py-1.5 text-xs rounded-lg transition-all hover:shadow-md"
                      style={{
                        backgroundColor: selectedTeacher === teacher._id ? colors.quizzes : '#3B262110',
                        color: selectedTeacher === teacher._id ? 'white' : '#3B2621'
                      }}
                    >
                      {selectedTeacher === teacher._id ? 'Selected' : 'View Stats'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insight Summary */}
      {trends.length > 0 && (
        <div className="group relative">
          <div className="absolute inset-0 rounded-3xl opacity-10 group-hover:opacity-15 transition-opacity"
            style={{ background: `linear-gradient(135deg, ${colors.lessons}, ${colors.quizzes})` }} />
          <div className="relative bg-white rounded-3xl p-6 border" style={{ borderColor: '#3B262120' }}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                style={{ background: `linear-gradient(135deg, ${colors.lessons}, ${colors.quizzes})` }}>
                ✨
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1" style={{ color: '#3B262180' }}>AI Insight</p>
                <p style={{ color: '#3B2621' }}>
                  {selectedTeacher
                    ? `${getSelectedTeacherName()} has created ${selectedTeacherData?.overview?.total || 0} total activities. `
                    : `Across all teachers, there are ${overview?.totalTeachers || 0} active teachers with ${(overview?.lessons || 0) +
                    (overview?.quizzes || 0) +
                    (overview?.assessments || 0)
                    } total activities. `
                  }
                  {selectedTeacher ? (
                    <>
                      They excel in {' '}
                      {selectedTeacherData?.overview?.lessons > selectedTeacherData?.overview?.quizzes
                        ? (selectedTeacherData?.overview?.lessons > selectedTeacherData?.overview?.assessments ? 'creating lesson plans' : 'making assessments')
                        : (selectedTeacherData?.overview?.quizzes > selectedTeacherData?.overview?.assessments ? 'conducting quizzes' : 'making assessments')
                      }.
                    </>
                  ) : (
                    topPerformer && (
                      <>Top performer is <span style={{ color: colors.quizzes, fontWeight: 600 }}>{topPerformer.teacher_name}</span> with {topPerformer.total} total activities.</>
                    )
                  )}
                </p>
                <div className="flex gap-2 mt-3">
                  <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: `${colors.lessons}20`, color: colors.lessons }}>
                    Lessons: {selectedTeacher ? selectedTeacherData?.lessons : overview?.lessons}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: `${colors.quizzes}20`, color: colors.quizzes }}>
                    Quizzes: {selectedTeacher ? selectedTeacherData?.quizzes : overview?.quizzes}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: `${colors.assessments}20`, color: colors.assessments }}>
                    Assessments: {selectedTeacher ? selectedTeacherData?.assessments : overview?.assessments}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;