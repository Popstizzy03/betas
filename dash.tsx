// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, TrendingUp, Clock, Award, Play, List, 
  BarChart2, Search, ChevronRight, Settings, X,
  Calendar, Target, Zap, Star, Trophy, Bookmark
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Sample data for line chart
const activityData = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 80 },
  { day: 'Wed', minutes: 65 },
  { day: 'Thu', minutes: 90 },
  { day: 'Fri', minutes: 50 },
  { day: 'Sat', minutes: 75 },
  { day: 'Sun', minutes: 40 },
];

interface Course {
  id: number;
  title: string;
  progress: number;
  instructor: string;
  difficulty: string;
  thumbnail?: string;
  category: string;
}

interface Skill {
  name: string;
  level: number;
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [activeCategory, setActiveCategory] = useState('all');
  
  const [courses] = useState<Course[]>([
    {
      id: 1,
      title: 'Introduction to React',
      progress: 45,
      instructor: 'John Doe',
      difficulty: 'Beginner',
      thumbnail: '/react-bg.jpg',
      category: 'frontend'
    },
    {
      id: 2,
      title: 'Advanced Python Programming',
      progress: 70,
      instructor: 'Jane Smith',
      difficulty: 'Advanced',
      thumbnail: '/python-bg.jpg',
      category: 'backend'
    }
  ]);

  const [skills] = useState<Skill[]>([
    { name: 'React', level: 80, icon: <Zap size={16} /> },
    { name: 'Python', level: 75, icon: <Bookmark size={16} /> },
    { name: 'UI/UX', level: 65, icon: <Star size={16} /> },
  ]);

  const [stats] = useState({
    totalCourses: 5,
    completedCourses: 2,
    learningHours: 42,
    certificates: 1
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) setUser(JSON.parse(userStr));
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', String(!darkMode));
  };

  const renderProgressBar = (progress: number) => (
    <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
      <div 
        className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );

  if (!user) return null;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold mb-1"
            >
              Welcome back, {user.username} 👋
            </motion.h1>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              {courses.length} active courses • {stats.learningHours}h this week
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
            <div className="relative w-48">
              <input
                type="text"
                placeholder="Search courses..."
                className={`w-full pl-10 pr-4 py-2 rounded-lg transition-all ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 focus:ring-blue-400' 
                    : 'bg-white border-gray-200 focus:ring-blue-500'
                }`}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl shadow-lg ${
                darkMode ? 'bg-gray-800' : 'bg-gradient-to-br from-blue-600 to-blue-500 text-white'
              }`}
            >
              <div className="flex items-center mb-6">
                <div className={`w-14 h-14 ${darkMode ? 'bg-gray-700' : 'bg-white/20'} rounded-full flex items-center justify-center mr-4`}>
                  <span className="text-2xl font-bold">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{user.username}</h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'opacity-90'}`}>
                    {user.email}
                  </p>
                </div>
                <Settings className="ml-auto cursor-pointer opacity-70 hover:opacity-100" />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Daily Goal</span>
                  <span className="text-sm font-semibold">2h</span>
                </div>
                {renderProgressBar(60)}
              </div>
            </motion.div>

            {/* Calendar Section */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <h3 className="font-semibold mb-4 flex items-center">
                <Calendar size={18} className="mr-2" /> Study Plan
              </h3>
              <ReactDatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                inline
                className="border-0"
                wrapperClassName="w-full"
                dayClassName={(date) => 
                  `rounded-full ${darkMode ? 'text-white hover:bg-gray-700' : 'hover:bg-gray-100'}`
                }
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            {/* Courses Section */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="flex items-center mb-4 sm:mb-0">
                  <List size={20} className="mr-2 text-blue-500" />
                  <h3 className="text-lg font-semibold">Active Courses</h3>
                  <div className="ml-4 flex gap-2">
                    {['all', 'frontend', 'backend'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          activeCategory === cat 
                            ? 'bg-blue-500 text-white' 
                            : darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="flex items-center text-blue-500 hover:text-blue-600">
                  View All <ChevronRight size={16} className="ml-1" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <motion.div 
                    key={course.id}
                    whileHover={{ y: -5 }}
                    className={`group relative overflow-hidden rounded-xl border ${
                      darkMode ? 'border-gray-700' : 'border-gray-100'
                    }`}
                  >
                    {course.thumbnail && (
                      <div 
                        className="h-32 bg-cover bg-center relative"
                        style={{ backgroundImage: `url(${course.thumbnail})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold mb-1">{course.title}</h4>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {course.instructor} • {course.difficulty}
                          </p>
                        </div>
                        <button className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors">
                          <Play size={14} className="mr-1" /> Continue
                        </button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                            {course.progress}% Complete
                          </span>
                        </div>
                        {renderProgressBar(course.progress)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stats & Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Chart */}
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  <TrendingUp size={20} className="mr-2 text-green-500" />
                  Weekly Activity
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                      <Line
                        type="monotone"
                        dataKey="minutes"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skills Overview */}
              <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                <h3 className="text-lg font-semibold mb-6 flex items-center">
                  <Trophy size={20} className="mr-2 text-purple-500" />
                  Skills Progress
                </h3>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name} className="flex items-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        {skill.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{skill.name}</span>
                          <span className="text-sm">{skill.level}%</span>
                        </div>
                        {renderProgressBar(skill.level)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
