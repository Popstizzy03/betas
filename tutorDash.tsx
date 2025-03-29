// client/src/components/dashboard/TutorSidebar.tsx
import React, { useRef } from 'react';
import { 
  BookOpen, 
  Users,
  Calendar,
  MessageSquare,
  Clipboard,
  BarChart2,
  Settings,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { motion } from 'framer-motion';

type TabType = 'courses' | 'students' | 'calendar' | 'messages' | 'assignments' | 'analytics';

interface TutorSidebarProps {
  tutor: any;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onClose: () => void;
  isOpen: boolean;
  isMobile: boolean;
}

const TutorSidebar: React.FC<TutorSidebarProps> = ({ 
  tutor, 
  activeTab, 
  onTabChange, 
  onClose, 
  isOpen,
  isMobile
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  useClickOutside(sidebarRef, () => isMobile && isOpen && onClose());

  const navItems = [
    { id: 'courses', label: 'My Courses', icon: <BookOpen size={20} /> },
    { id: 'students', label: 'Students', icon: <Users size={20} /> },
    { id: 'calendar', label: 'Schedule', icon: <Calendar size={20} /> },
    { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    { id: 'assignments', label: 'Assignments', icon: <Clipboard size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart2 size={20} /> },
  ];

  return (
    <motion.div
      ref={sidebarRef}
      initial={isMobile ? { x: -300 } : {}}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`${isMobile ? 'fixed z-50 h-full shadow-xl' : 'relative'} w-72 bg-white border-r border-gray-100`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center shadow-sm">
              <Users size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">TutorHub</h1>
          </div>
          {isMobile && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Tutor Profile */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-purple-400 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              {tutor.username[0].toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{tutor.username}</p>
              <p className="text-sm text-gray-500 truncate">
                {tutor.email || 'tutor@example.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-5">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id as TabType)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? 'bg-purple-50 text-purple-600 font-semibold shadow-inner'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`mr-3 ${activeTab === item.id ? 'text-purple-500' : 'text-gray-400'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              </li>
            ))}
          </ul>

          {/* Secondary Navigation */}
          <div className="mt-8 px-3">
            <h3 className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Account
            </h3>
            <ul className="mt-3 space-y-1">
              <li>
                <a
                  href="/tutor-profile"
                  className="flex items-center px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Settings size={18} className="mr-3 text-gray-400" />
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100">
          <button className="w-full flex items-center px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors">
            <LogOut size={18} className="mr-3 text-gray-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TutorSidebar;
