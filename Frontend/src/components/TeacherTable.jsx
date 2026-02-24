import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';

function TeacherTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: 'total', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');

  // Extract unique grades from data (you'll need to modify your API to include grade)
  const grades = ['all', '6', '7', '8', '9', '10'];

  const sortedData = React.useMemo(() => {
    let sortableItems = [...(data || [])];
    
    // Filter by search
    if (searchTerm) {
      sortableItems = sortableItems.filter(item =>
        item.teacher_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [data, sortConfig, searchTerm]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? 
        <ChevronUp className="w-4 h-4 text-secondary" /> : 
        <ChevronDown className="w-4 h-4 text-secondary" />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
      {/* Search and filter bar */}
      <div className="p-4 border-b border-primary/10 bg-linear-to-r from-primary/5 to-secondary/5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40" />
            <input
              type="text"
              placeholder="Search teachers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary text-primary placeholder-primary/30 transition-all"
            />
          </div>
          
          <div className="relative sm:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-primary/40" />
            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-primary/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary text-primary appearance-none cursor-pointer"
            >
              {grades.map(grade => (
                <option key={grade} value={grade}>
                  {grade === 'all' ? 'All Grades' : `Grade ${grade}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table container with horizontal scroll for mobile */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-162.5">
          <thead>
            <tr className="bg-linear-to-r from-primary/5 to-secondary/5">
              <th className="px-4 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider">
                Teacher Name
              </th>
              {['Lessons', 'Quizzes', 'Assessments', 'Total'].map((header) => (
                <th
                  key={header}
                  onClick={() => requestSort(header.toLowerCase())}
                  className="px-4 py-4 text-left text-xs font-semibold text-primary uppercase tracking-wider cursor-pointer hover:text-secondary transition-colors"
                >
                  <div className="flex items-center gap-1">
                    {header}
                    {getSortIcon(header.toLowerCase())}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10">
            {sortedData.map((teacher, index) => (
              <tr 
                key={teacher._id || index}
                className="hover:bg-linear-to-r hover:from-secondary/5 hover:to-transparent transition-all duration-200 group"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-linear-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-semibold text-sm group-hover:scale-110 transition-transform">
                      {teacher.teacher_name?.charAt(0)}
                    </div>
                    <span className="ml-3 text-sm font-medium text-primary">
                      {teacher.teacher_name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">
                    {teacher.lessons}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary/10 text-secondary-dark">
                    {teacher.quizzes}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/10 text-primary">
                    {teacher.assessments}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-linear-to-r from-primary to-secondary text-white">
                    {teacher.total}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {sortedData.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-primary/30" />
          </div>
          <p className="text-primary/60 font-medium">No teachers found</p>
          <p className="text-sm text-primary/40 mt-1">Try adjusting your search or filter</p>
        </div>
      )}

      {/* Footer with count */}
      <div className="px-4 py-3 bg-linear-to-r from-primary/5 to-secondary/5 border-t border-primary/10">
        <div className="flex items-center justify-between">
          <p className="text-xs text-primary/60">
            Showing <span className="font-semibold text-primary">{sortedData.length}</span> of {data?.length || 0} teachers
          </p>
          <div className="flex gap-2">
            <span className="text-xs text-primary/40">
              Last updated: {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherTable;