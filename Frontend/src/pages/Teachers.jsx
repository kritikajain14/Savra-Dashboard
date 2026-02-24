import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllTeachers, getTeacherData } from '../services/api';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'total', direction: 'desc' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const colors = {
    lessons: '#3B2621',
    quizzes: '#D97706',
    assessments: '#0F766E'
  };

  const subjects = ['all', 'Mathematics', 'Science', 'English', 'Social Studies'];
  const classes = ['all', '6', '7', '8', '9', '10'];

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    filterAndSortTeachers();
  }, [teachers, searchTerm, subjectFilter, classFilter, sortConfig]);

  const fetchTeachers = async () => {
    try {
      const data = await getAllTeachers();
      setTeachers(data);
      setFilteredTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortTeachers = () => {
    let filtered = [...teachers];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply subject filter (you'll need to add subject to teacher data)
    if (subjectFilter !== 'all') {
      // filtered = filtered.filter(t => t.subject === subjectFilter);
    }

    // Apply class filter
    if (classFilter !== 'all') {
      // filtered = filtered.filter(t => t.class === classFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredTeachers(filtered);
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleViewTeacher = (teacherId) => {
    navigate(`/?teacher=${teacherId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: '#3B262120', borderTopColor: '#3B2621' }} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: '#3B2621' }}>Teachers</h1>
        <p className="text-sm mt-1" style={{ color: '#3B262180' }}>Manage and view teacher performance</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border p-6 mb-6" style={{ borderColor: '#3B262120' }}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#3B262180' }} />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2"
              style={{ borderColor: '#3B262120', focusRingColor: colors.quizzes }}
            />
          </div>

          {/* Subject Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#3B262180' }} />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border rounded-xl appearance-none cursor-pointer"
              style={{ borderColor: '#3B262120' }}
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject}
                </option>
              ))}
            </select>
          </div>

          {/* Class Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#3B262180' }} />
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border rounded-xl appearance-none cursor-pointer"
              style={{ borderColor: '#3B262120' }}
            >
              {classes.map(cls => (
                <option key={cls} value={cls}>
                  {cls === 'all' ? 'All Classes' : `Class ${cls}`}
                </option>
              ))}
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-end">
            <p className="text-sm" style={{ color: '#3B262180' }}>
              Showing <span style={{ color: '#3B2621', fontWeight: 600 }}>{filteredTeachers.length}</span> teachers
            </p>
          </div>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor: '#3B262120' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-200">
            <thead>
              <tr className="border-b" style={{ borderColor: '#3B262120', backgroundColor: '#3B262105' }}>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#3B262180' }}>Teacher Name</th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#3B262180' }}>Subject</th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#3B262180' }}>Class</th>
                <th className="text-left py-4 px-6 text-sm font-medium cursor-pointer" onClick={() => requestSort('lessons')} style={{ color: '#3B262180' }}>
                  <div className="flex items-center gap-1">
                    Lessons
                    {sortConfig.key === 'lessons' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium cursor-pointer" onClick={() => requestSort('quizzes')} style={{ color: '#3B262180' }}>
                  <div className="flex items-center gap-1">
                    Quizzes
                    {sortConfig.key === 'quizzes' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium cursor-pointer" onClick={() => requestSort('assessments')} style={{ color: '#3B262180' }}>
                  <div className="flex items-center gap-1">
                    Assessments
                    {sortConfig.key === 'assessments' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium cursor-pointer" onClick={() => requestSort('total')} style={{ color: '#3B262180' }}>
                  <div className="flex items-center gap-1">
                    Total
                    {sortConfig.key === 'total' && (
                      sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="text-left py-4 px-6 text-sm font-medium" style={{ color: '#3B262180' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeachers.map((teacher, index) => (
                <tr key={index} className="border-b last:border-0 hover:bg-opacity-50 transition-colors" 
                    style={{ borderColor: '#3B262110', backgroundColor: index % 2 === 0 ? '#ffffff' : '#3B262102' }}>
                  <td className="py-4 px-6">
                    <span className="font-medium" style={{ color: '#3B2621' }}>{teacher.teacher_name}</span>
                  </td>
                  <td className="py-4 px-6" style={{ color: '#3B262180' }}>Multiple</td>
                  <td className="py-4 px-6" style={{ color: '#3B262180' }}>6-10</td>
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
                      onClick={() => handleViewTeacher(teacher._id)}
                      className="p-2 rounded-lg hover:bg-opacity-10 transition-colors"
                      style={{ color: colors.quizzes }}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-16">
            <p style={{ color: '#3B2621' }}>No teachers found</p>
            <p className="text-sm mt-1" style={{ color: '#3B262180' }}>Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teachers;