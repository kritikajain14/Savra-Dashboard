import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

function TrendChart({ data, type = 'line' }) {
  const colors = {
    lessons: '#3B2621',
    quizzes: '#3BC262',
    assessments: '#5C3D35',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-lg border" style={{ borderColor: '#3B262120' }}>
          <p className="text-sm font-semibold mb-3" style={{ color: '#3B2621' }}>{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between text-xs mb-2 last:mb-0">
              <div className="flex items-center">
                <div 
                  className="w-2 h-2 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                />
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

  if (type === 'area') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorLessons" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.lessons} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={colors.lessons} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.quizzes} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={colors.quizzes} stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAssessments" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.assessments} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={colors.assessments} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="week" 
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#3B2621', strokeWidth: 1 }}
            style={{ fill: '#3B2621' }}
          />
          <YAxis 
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#3B2621', strokeWidth: 1 }}
            style={{ fill: '#3B2621' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => <span style={{ color: '#3B2621' }}>{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="lessons"
            name="Lessons"
            stroke={colors.lessons}
            fill="url(#colorLessons)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="quizzes"
            name="Quizzes"
            stroke={colors.quizzes}
            fill="url(#colorQuizzes)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="assessments"
            name="Assessments"
            stroke={colors.assessments}
            fill="url(#colorAssessments)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        <XAxis 
          dataKey="week" 
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: '#3B2621', strokeWidth: 1 }}
          style={{ fill: '#3B2621' }}
        />
        <YAxis 
          fontSize={12}
          tickLine={false}
          axisLine={{ stroke: '#3B2621', strokeWidth: 1 }}
          style={{ fill: '#3B2621' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend 
          formatter={(value) => <span style={{ color: '#3B2621' }}>{value}</span>}
        />
        <Bar 
          dataKey="lessons" 
          name="Lessons"
          fill={colors.lessons} 
          radius={[4, 4, 0, 0]} 
          barSize={20}
        />
        <Bar 
          dataKey="quizzes" 
          name="Quizzes"
          fill={colors.quizzes} 
          radius={[4, 4, 0, 0]} 
          barSize={20}
        />
        <Bar 
          dataKey="assessments" 
          name="Assessments"
          fill={colors.assessments} 
          radius={[4, 4, 0, 0]} 
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TrendChart;