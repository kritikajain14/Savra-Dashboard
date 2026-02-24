import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings,
  X 
} from 'lucide-react';

function Sidebar({ isOpen, onClose, isMobile }) {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/teachers', icon: Users, label: 'Teachers' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-[#3B2621]/10">
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#3B2621]/10">
        <h1 className="text-xl font-bold" style={{ color: '#3B2621' }}>Savra Insights</h1>
        {isMobile && (
          <button onClick={onClose} className="p-1 hover:bg-[#3B2621]/5 rounded-lg">
            <X className="w-5 h-5" style={{ color: '#3B2621' }} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={() => isMobile && onClose()}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'text-white' 
                    : 'hover:bg-[#3B2621]/5'
                  }
                `}
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#3B2621' : 'transparent',
                  color: isActive ? '#ffffff' : '#3B2621'
                })}
              >
                <item.icon className="w-5 h-5 mr-3" style={{ color: 'inherit' }} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-[#3B2621]/10">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#3BC26220' }}>
            <span style={{ color: '#3BC262', fontWeight: 600 }}>A</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium" style={{ color: '#3B2621' }}>Admin User</p>
            <p className="text-xs" style={{ color: '#3B262180' }}>admin@savra.com</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40 transition-opacity"
            style={{ backgroundColor: '#3B262180' }}
            onClick={onClose}
          />
        )}
        
        {/* Sidebar drawer */}
        <div className={`
          fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {sidebarContent}
        </div>
      </>
    );
  }

  return (
    <div className="fixed top-0 left-0 h-full w-64">
      {sidebarContent}
    </div>
  );
}

export default Sidebar;