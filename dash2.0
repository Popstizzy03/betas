// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, TrendingUp, Clock, Award, Play, List, BarChart2,
  Search, ChevronRight, Settings, Calendar, Zap, Star, Bookmark,
  Bell, Target, Trophy, Video, Users, FileText, HelpCircle, Rocket,
  Layout, Book, Grid, Flag, Medal, BadgeCheck, Lightbulb, CalendarCheck
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDatePicker from 'react-datepicker';
import { Tooltip } from 'react-tooltip';
import 'react-datepicker/dist/react-datepicker.css';

// Sample Data
const activityData = [
  { day: 'Mon', minutes: 45 }, { day: 'Tue', minutes: 80 }, 
  { day: 'Wed', minutes: 65 }, { day: 'Thu', minutes: 90 },
  { day: 'Fri', minutes: 50 }, { day: 'Sat', minutes: 75 },
  { day: 'Sun', minutes: 40 }
];

interface Course {
  id: number;
  title: string;
  progress: number;
  instructor: string;
  difficulty: string;
  thumbnail?: string;
  category: string;
  lastAccessed: Date;
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
  const [isLoading, setIsLoading] = useState(true);
  
  const [courses] = useState<Course[]>([]);
  const [skills] = useState<Skill[]>([
    { name: 'React', level: 80, icon: <Zap size={16} /> },
    { name: 'Python', level: 75, icon: <Bookmark size={16} /> },
    { name: 'UI/UX', level: 65, icon: <Star size={16} /> },
  ]);

  const [stats] = useState({
    totalCourses: 5,
    completedCourses: 2,
    learningHours: 42,
    certificates: 1,
    streakDays: 3,
    weeklyGoal: 10
  });

  useEffect(() => {
    const loadData = async () => {
      const userStr = localStorage.getItem('user');
      if (userStr) setUser(JSON.parse(userStr));
      setDarkMode(localStorage.getItem('darkMode') === 'true');
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', String(!darkMode));
  };

  const renderProgressBar = (progress: number) => (
    <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}
         data-tooltip-id="main-tooltip"
         data-tooltip-content={`${progress}% Complete`}>
      <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
           style={{ width: `${progress}%` }} />
    </div>
  );

  const SkeletonLoader = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Sidebar Skeleton */}
        <div className="lg:col-span-1 space-y-6">
          <div className="animate-pulse h-48 rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="animate-pulse h-96 rounded-xl bg-gray-200 dark:bg-gray-800" />
        </div>
        
        {/* Main Content Skeleton */}
        <div className="lg:col-span-4 space-y-6">
          <div className="animate-pulse h-96 rounded-xl bg-gray-200 dark:bg-gray-800" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="animate-pulse h-80 rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="animate-pulse h-80 rounded-xl bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${darkMode ? '#1F2937' : '#F3F4F6'}; }
        ::-webkit-scrollbar-thumb { background: ${darkMode ? '#4B5563' : '#D1D5DB'}; border-radius: 4px; }
      `}</style>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-2xl font-bold flex items-center gap-2">
              <CalendarCheck className="text-blue-500" /> Welcome back, {user.username}
            </motion.h1>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {stats.learningHours}h learned this week • {stats.streakDays} day streak
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                    data-tooltip-id="main-tooltip" data-tooltip-content="Notifications">
              <Bell className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-0 right-0 bg-red-500 text-xs text-white w-4 h-4 rounded-full flex items-center justify-center">
                2
              </span>
            </button>
            
            <button onClick={toggleDarkMode} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                    data-tooltip-id="main-tooltip" data-tooltip-content="Toggle Theme">
              {darkMode ? <Lightbulb className="text-yellow-400" /> : <Layout className="text-gray-600" />}
            </button>

            <div className="relative w-48">
              <input type="text" placeholder="Search..." 
                     className={`w-full pl-10 pr-4 py-2 rounded-lg transition-all ${
                       darkMode ? 'bg-gray-800 border-gray-700 focus:ring-blue-400' 
                       : 'bg-white border-gray-200 focus:ring-blue-500'}`} />
              <Search className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isLoading ? <SkeletonLoader /> : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Left Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <motion.div whileHover={{ scale: 1.02 }} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <Rocket className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Daily Goal</h3>
                      <p className="text-sm text-gray-500">{stats.weeklyGoal}h / week</p>
                    </div>
                  </div>
                  {renderProgressBar((stats.learningHours / stats.weeklyGoal) * 100)}
                </motion.div>

                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Medal className="text-yellow-500" /> Achievements
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <BadgeCheck className="text-green-500" />
                      <div>
                        <p className="font-medium">Fast Learner</p>
                        <p className="text-sm text-gray-500">Complete 5 courses</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Flag className="text-purple-500" />
                      <div>
                        <p className="font-medium">Streak Starter</p>
                        <p className="text-sm text-gray-500">3-day learning streak</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3 space-y-6">
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Book className="text-blue-500" /> Your Courses
                    </h3>
                    <button className="flex items-center text-blue-500 hover:text-blue-600 gap-1">
                      View All <ChevronRight size={16} />
                    </button>
                  </div>

                  {courses.length === 0 ? (
                    <div className="text-center py-12">
                      <Grid className="mx-auto text-gray-400 mb-4" size={40} />
                      <p className="text-gray-500">No active courses found</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">{
                      courses.map(course => (
                        <motion.div key={course.id} whileHover={{ y: -2 }}
                          className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-semibold">{course.title}</h4>
                              <p className="text-sm text-gray-500">{course.instructor}</p>
                            </div>
                            <button className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 gap-2">
                              <Play size={14} /> Continue
                            </button>
                          </div>
                          {renderProgressBar(course.progress)}
                        </motion.div>
                      ))
                    }</div>
                  )}
                </div>

                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                  <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <TrendingUp className="text-green-500" /> Learning Activity
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={activityData}>
                        <Line type="monotone" dataKey="minutes" stroke="#3B82F6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Users className="text-purple-500" /> Community
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <HelpCircle className="text-blue-500" size={16} />
                      </div>
                      <div>
                        <p className="font-medium">New Questions</p>
                        <p className="text-sm text-gray-500">15+ discussions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <FileText className="text-green-500" size={16} />
                      </div>
                      <div>
                        <p className="font-medium">Study Groups</p>
                        <p className="text-sm text-gray-500">Join 3 groups</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm`}>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Video className="text-red-500" /> Resources
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <FileText className="text-gray-500" size={16} />
                      <span>Course Handbook</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                      <Video className="text-gray-500" size={16} />
                      <span>Video Library</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Tooltip id="main-tooltip" className={`!px-3 !py-2 !rounded-lg !text-sm ${
          darkMode ? '!bg-gray-700 !text-white' : '!bg-white !text-gray-900 !shadow-md'}`} />
      </div>
    </div>
  );
};

export default Dashboard;
