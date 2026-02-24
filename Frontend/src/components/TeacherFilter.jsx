import React from 'react';
import { ChevronDown, X } from 'lucide-react';

function TeacherFilter({ teachers, selectedTeacher, onSelect }) {
  return (
    <div className="relative min-w-50">
      <select
        value={selectedTeacher || ''}
        onChange={(e) => onSelect(e.target.value || null)}
        className="w-full appearance-none px-4 py-2.5 pr-8 bg-white border rounded-xl focus:outline-none focus:ring-2 text-sm cursor-pointer"
        style={{ borderColor: '#3B262120', focusRingColor: '#D97706' }}
      >
        <option value="">All Teachers</option>
        {teachers.map((teacher) => (
  <option
    key={teacher.teacher_id}
    value={teacher.teacher_id}
  >
    {teacher.teacher_name}
  </option>
))}
          
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#3B262180' }} />
      
      {selectedTeacher && (
        <button
          onClick={() => onSelect(null)}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-3 h-3" style={{ color: '#3B262180' }} />
        </button>
      )}
    </div>
  );
}

export default TeacherFilter;