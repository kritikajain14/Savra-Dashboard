import React from 'react';

function PeriodToggle({ selected, onChange }) {
  const periods = ['Week', 'Month', 'Year'];
  
  return (
    <div className="flex rounded-xl p-1" style={{ backgroundColor: '#3B262108' }}>
      {periods.map((period) => (
        <button
          key={period}
          onClick={() => onChange(period.toLowerCase())}
          className="px-4 py-2 text-xs font-medium rounded-lg capitalize transition-all duration-200"
          style={{
            backgroundColor: selected === period.toLowerCase() ? '#ffffff' : 'transparent',
            color: selected === period.toLowerCase() ? '#3B2621' : '#3B262180',
            boxShadow: selected === period.toLowerCase() ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
          }}
        >
          {period}
        </button>
      ))}
    </div>
  );
}

export default PeriodToggle;