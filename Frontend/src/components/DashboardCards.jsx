import React from 'react';
import { BookOpen, ClipboardList, GraduationCap, Users } from 'lucide-react';

function DashboardCards({ data }) {
  const cards = [
    {
      title: 'Total Lessons',
      value: data?.lessons || 0,
      icon: BookOpen,
      iconBg: '#3BC26220',
      iconColor: '#3BC262',
      borderColor: '#3BC26230'
    },
    {
      title: 'Total Quizzes',
      value: data?.quizzes || 0,
      icon: ClipboardList,
      iconBg: '#3BC26220',
      iconColor: '#3BC262',
      borderColor: '#3BC26230'
    },
    {
      title: 'Total Assessments',
      value: data?.assessments || 0,
      icon: GraduationCap,
      iconBg: '#3BC26220',
      iconColor: '#3BC262',
      borderColor: '#3BC26230'
    },
    {
      title: 'Total Teachers',
      value: data?.totalTeachers || 0,
      icon: Users,
      iconBg: '#3BC26220',
      iconColor: '#3BC262',
      borderColor: '#3BC26230'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <div
            key={index}
            className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in border"
            style={{ 
              borderColor: card.borderColor,
              animationDelay: `${index * 100}ms` 
            }}
          >
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: '#3B262180' }}>{card.title}</p>
                  <p className="text-3xl font-bold" style={{ color: '#3B2621' }}>{card.value.toLocaleString()}</p>
                </div>
                <div 
                  className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <Icon className="w-6 h-6" style={{ color: card.iconColor }} />
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-4">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#3B262110' }}>
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(100, (card.value / 50) * 100)}%`,
                      backgroundColor: '#3BC262'
                    }}
                  />
                </div>
                <p className="text-xs mt-2" style={{ color: '#3B262180' }}>
                  {card.value > 0 ? `${Math.round((card.value / 50) * 100)}% of monthly target` : 'No activities yet'}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardCards;