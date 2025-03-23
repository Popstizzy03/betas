// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockCourses } from '../mock/mockCourse';
import { getProgressData, calculateCourseProgress } from '../utils/progressUtils';
import { format } from 'date-fns';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Award, 
  Play, 
  List, 
  BarChart2,
  Search,
  ChevronRight,
  Calendar,
  CheckSquare,
  Download,
  X,
  Plus,
  FileText,
  User,
  Settings,
  Bell,
  Menu
} from 'lucide-react';

// Types
import { Course, UserStats, Task, Certificate, CalendarEvent } from '../types';

// Components
import CourseCard from '../components/CourseCard';
import StatCard from '../components/StatCard';
import TaskItem from '../components/TaskItem';
import Modal from '../components/Modal';
import CertificateCard from '../components/CertificateCard';
import Sidebar from '../components/Sidebar';
import TaskForm from '../components/TaskForm';
import EventForm from '../components/EventForm';

// Hooks
import useWindowSize from '../hooks/useWindowSize';
import useLocalStorage from '../hooks/useLocalStorage';

// Services
import { generateCertificate } from '../services/certificateService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  
  // State
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'courses' | 'certificates' | 'calendar' | 'tasks'>('courses');
  
  // Local storage for tasks and events
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [events, setEvents] = useLocalStorage<CalendarEvent[]>('events', []);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  
  const [stats, setStats] = useState<UserStats>({
    totalCourses: 0,
    completedCourses: 0,
    learningHours: 0,
    certificates: 0,
    tasksCompleted: 0,
    totalTasks: 0
  });

  // Calculate user stats based on actual progress
  const calculateUserStats = (courses: Course[], taskList: Task[]): UserStats => {
    const completedTasks = taskList.filter(task => task.completed).length;
    
    return {
      totalCourses: courses.length,
      completedCourses: courses.filter(course => course.progress === 100).length,
      learningHours: 42, // This could be calculated based on video lengths if available
      certificates: courses.filter(course => course.progress === 100).length,
      tasksCompleted: completedTasks,
      totalTasks: taskList.length
    };
  };

  // Effect to handle search filtering
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, courses]);

  // Effect to handle window resize
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    const loadCourseData = () => {
        // Load user data
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const currentUser = JSON.parse(userStr);
            setUser(currentUser);

            // Load course progress for this specific user
            const progressData = getProgressData(currentUser.id);
            
            // Map courses with actual progress
            const coursesWithProgress = mockCourses.map(course => {
                const totalVideos = course.chapters.reduce(
                    (sum, chapter) => sum + chapter.videos.length,
                    0
                );
                
                const courseProgress = progressData[course.id];
                
                const progress = courseProgress 
                    ? calculateCourseProgress(courseProgress.completedVideos.length, totalVideos)
                    : 0;

                return {
                    id: course.id,
                    title: course.title,
                    progress,
                    instructor: course.instructor,
                    difficulty: course.difficulty,
                    thumbnail: course.thumbnail,
                    description: course.description || 'No description available',
                    duration: course.duration || '0h',
                    chapters: course.chapters
                };
            });

            setCourses(coursesWithProgress);
            setFilteredCourses(coursesWithProgress);

            // Generate certificates for completed courses
            const completedCertificates = coursesWithProgress
                .filter(course => course.progress === 100)
                .map(course => ({
                    id: `cert-${course.id}`,
                    courseId: course.id,
                    courseTitle: course.title,
                    completionDate: new Date().toISOString(),
                    userName: currentUser.username,
                    downloadable: true,
                    imageUrl: `/certificates/${course.id}.jpg` // Mock URL
                }));
                
            // Generate pending certificates for incomplete courses
            const pendingCertificates = coursesWithProgress
                .filter(course => course.progress < 100)
                .map(course => ({
                    id: `cert-pending-${course.id}`,
                    courseId: course.id,
                    courseTitle: course.title,
                    completionDate: '',
                    userName: currentUser.username,
                    downloadable: false,
                    imageUrl: '/certificates/pending.jpg' // Mock URL for pending certificate
                }));
                
            setCertificates([...completedCertificates, ...pendingCertificates]);
            setStats(calculateUserStats(coursesWithProgress, tasks));
        }
    };

    // Load initial data
    loadCourseData();

    // Listen for progress updates
    const handleProgressUpdate = (event: CustomEvent) => {
        if (event.detail.userId === user?.id) {
            loadCourseData();
        }
    };

    window.addEventListener('courseProgressUpdated', handleProgressUpdate as EventListener);

    return () => {
        window.removeEventListener('courseProgressUpdated', handleProgressUpdate as EventListener);
    };
  }, []);

  // Add an effect to update stats when courses or tasks change
  useEffect(() => {
    setStats(calculateUserStats(courses, tasks));
  }, [courses, tasks]);

  const handleAddTask = (task: Task) => {
    setTasks([...tasks, task]);
    setShowTaskModal(false);
  };

  const handleToggleTask = (id: string) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleAddEvent = (event: CalendarEvent) => {
    setEvents([...events, event]);
    setShowEventModal(false);
  };

  const handleDownloadCertificate = (certificate: Certificate) => {
    if (certificate.downloadable) {
      // In a real app, this would trigger the certificate download
      generateCertificate({
        userName: certificate.userName,
        courseTitle: certificate.courseTitle,
        completionDate: certificate.completionDate
      });
      alert(`Downloading certificate for ${certificate.courseTitle}`);
    }
  };

  // Filter tasks for today
  const todayTasks = tasks.filter(task => {
    const taskDate = new Date(task.dueDate);
    const today = new Date();
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });

  // Calculate task completion percentage
  const taskCompletionPercentage = stats.totalTasks > 0 
    ? Math.round((stats.tasksCompleted / stats.totalTasks) * 100) 
    : 0;
    // then get the task completion data and update it in 

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className={`${isMobile ? 'fixed z-50 h-full' : 'relative'} w-64 bg-white shadow-md transition-all duration-300`}>
          <Sidebar 
            user={user} 
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-h-screen overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="p-2 mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none">
                <Settings size={20} />
              </button>
              <div className="ml-2 flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.username[0].toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="p-2 bg-white md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section with Summary */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.username}</h2>
              <p className="text-gray-600">
                Today is {format(new Date(), 'EEEE, MMMM do')}. You have {todayTasks.length} tasks for today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard 
                title="Enrolled Courses" 
                value={stats.totalCourses.toString()} 
                icon={<BookOpen size={18} />}
                color="blue"
              />
              <StatCard 
                title="Completed" 
                value={`${stats.completedCourses}/${stats.totalCourses}`} 
                icon={<CheckSquare size={18} />}
                color="green"
              />
              <StatCard 
                title="Learning Hours" 
                value={`${stats.learningHours}h`} 
                icon={<Clock size={18} />}
                color="purple"
              />
              <StatCard 
                title="Certificates" 
                value={stats.certificates.toString()} 
                icon={<Award size={18} />}
                color="orange"
              />
            </div>

            {/* Main Content Tabs */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Tab Content */}
              {activeTab === 'courses' && (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center mb-3 sm:mb-0">
                      <BookOpen size={20} className="mr-2 text-blue-500" />
                      {showAllCourses ? "All Courses" : "In Progress Courses"}
                    </h3>
                    <button 
                      onClick={() => setShowAllCourses(!showAllCourses)}
                      className="flex items-center text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      {showAllCourses ? "Show Active Courses" : "View All Courses"} 
                      <ChevronRight size={16} className="ml-1" />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(showAllCourses ? filteredCourses : filteredCourses.filter(course => course.progress > 0 && course.progress < 100)).map((course) => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        onContinue={() => navigate(`/learn/${course.id}`)} 
                      />
                    ))}

                    {/* Empty state */}
                    {filteredCourses.length === 0 && (
                      <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-500">
                        <BookOpen size={48} className="mb-2 opacity-40" />
                        <p className="text-lg font-medium">No courses found</p>
                        <p className="text-sm">Try adjusting your search or browse all courses</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'certificates' && (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center mb-3 sm:mb-0">
                      <Award size={20} className="mr-2 text-orange-500" />
                      Your Certificates
                    </h3>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {certificates.map((certificate) => (
                      <CertificateCard 
                        key={certificate.id} 
                        certificate={certificate} 
                        onDownload={() => handleDownloadCertificate(certificate)} 
                      />
                    ))}

                    {/* Empty state */}
                    {certificates.length === 0 && (
                      <div className="col-span-full flex flex-col items-center justify-center py-8 text-gray-500">
                        <Award size={48} className="mb-2 opacity-40" />
                        <p className="text-lg font-medium">No certificates yet</p>
                        <p className="text-sm">Complete courses to earn certificates</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center mb-3 sm:mb-0">
                      <Calendar size={20} className="mr-2 text-blue-500" />
                      Learning Calendar
                    </h3>
                    <button 
                      onClick={() => {
                        setSelectedDate(new Date());
                        setShowEventModal(true);
                      }}
                      className="flex items-center bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Plus size={16} className="mr-1.5" /> Add Event
                    </button>
                  </div>

                  <div className="bg-white rounded-lg overflow-hidden">
                    {/* Simple calendar grid (in a real app, use a proper calendar component) */}
                    <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded overflow-hidden">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 bg-gray-100 text-center font-medium">
                          {day}
                        </div>
                      ))}
                      
                      {/* Placeholder calendar cells - would be dynamically generated in a real app */}
                      {Array.from({ length: 35 }).map((_, i) => {
                        const hasEvent = events.some(event => {
                          const eventDate = new Date(event.date);
                          return eventDate.getDate() === (i % 31) + 1;
                        });
                        
                        return (
                          <div 
                            key={i} 
                            className={`p-2 bg-white hover:bg-blue-50 text-center cursor-pointer h-24 ${
                              hasEvent ? 'font-semibold' : ''
                            }`}
                            onClick={() => {
                              // Set selected date (in a real app, calculate the actual date)
                              const newDate = new Date();
                              newDate.setDate((i % 31) + 1);
                              setSelectedDate(newDate);
                              setShowEventModal(true);
                            }}
                          >
                            <span className="inline-block">{(i % 31) + 1}</span>
                            {hasEvent && (
                              <div className="mt-1 mx-auto w-2 h-2 rounded-full bg-blue-500"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Event list (simplified) */}
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Upcoming Events</h4>
                      {events.length > 0 ? (
                        <div className="divide-y">
                          {events.map(event => (
                            <div key={event.id} className="py-2 flex justify-between items-center">
                              <div>
                                <p className="font-medium">{event.title}</p>
                                <p className="text-sm text-gray-500">
                                  {format(new Date(event.date), 'MMM dd, yyyy')} • {event.time}
                                </p>
                              </div>
                              <div className="flex space-x-2">
                                <button 
                                  className="p-1 text-gray-400 hover:text-red-500"
                                  onClick={() => setEvents(events.filter(e => e.id !== event.id))}
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm italic">No upcoming events</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h3 className="text-lg font-semibold flex items-center mb-3 sm:mb-0">
                      <CheckSquare size={20} className="mr-2 text-green-500" />
                      Learning Tasks
                    </h3>
                    <button 
                      onClick={() => setShowTaskModal(true)}
                      className="flex items-center bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <Plus size={16} className="mr-1.5" /> Add Task
                    </button>
                  </div>

                  {/* Task Progress */}
                  <div className="mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Task Progress</span>
                      <span className="text-sm font-medium text-gray-700">{taskCompletionPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-400 h-2.5 rounded-full transition-all duration-500" 
                        style={{ width: `${taskCompletionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Task List */}
                  <div className="bg-white rounded-lg overflow-hidden">
                    <div className="divide-y">
                      {tasks.length > 0 ? (
                        tasks.map(task => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={handleToggleTask}
                            onDelete={handleDeleteTask}
                          />
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          <CheckSquare size={32} className="mx-auto mb-2 opacity-40" />
                          <p>No tasks yet. Create your first learning task!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Learning Analytics Section */}
            <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold flex items-center mb-6">
                <BarChart2 size={20} className="mr-2 text-blue-500" />
                Learning Analytics
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <TrendingUp size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg. Score</p>
                    <p className="text-xl font-bold text-gray-900">85%</p>
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <BookOpen size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Completion</p>
                    <p className="text-xl font-bold text-gray-900">72%</p>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4">
                    <Clock size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hours</p>
                    <p className="text-xl font-bold text-gray-900">{stats.learningHours}h</p>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg flex items-center">
                  <div className="bg-orange-100 p-2 rounded-lg mr-4">
                    <Award size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Level</p>
                    <p className="text-xl font-bold text-gray-900">Advanced</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Add New Task"
      >
        <TaskForm onSubmit={handleAddTask} onCancel={() => setShowTaskModal(false)} />
      </Modal>

      {/* Add Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title="Add Calendar Event"
      >
        <EventForm 
          initialDate={selectedDate} 
          onSubmit={handleAddEvent} 
          onCancel={() => setShowEventModal(false)} 
        />
      </Modal>
    </div>
  );
};

export default Dashboard;
