// client/src/pages/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, CheckCircle, Award, Target, ArrowRight, Search } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import { Course } from '../types';

// Mock data for enrolled courses (normally would come from API)
const mockEnrolledCourses: Course[] = [
  {
    id: 1,
    title: "Web Development Bootcamp",
    category: "development",
    instructor: "John Smith",
    difficulty: "Intermediate",
    duration: "12 weeks",
    rating: 4.8,
    students: 15000,
    price: 99.99,
    thumbnail: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
    description: "A comprehensive bootcamp covering full-stack web development with modern technologies.",
    progress: 45
  },
  {
    id: 3,
    title: "UX/UI Design Mastery",
    category: "design",
    instructor: "Mike Wilson",
    difficulty: "Intermediate",
    duration: "10 weeks",
    rating: 4.7,
    students: 8000,
    price: 79.99,
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2864&auto=format&fit=crop",
    description: "Master the principles of effective UX/UI design and create stunning interfaces.",
    progress: 65
  },
  {
    id: 5,
    title: "Business Management",
    category: "business",
    instructor: "David Brown",
    difficulty: "Advanced",
    duration: "16 weeks",
    rating: 4.5,
    students: 11000,
    price: 89.99,
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2940&auto=format&fit=crop",
    description: "Comprehensive business management course covering strategy, operations, and leadership.",
    progress: 30
  }
];

// Recommended courses based on enrolled courses
const recommendedCourses: Course[] = [
  {
    id: 2,
    title: "Data Science Fundamentals",
    category: "development",
    instructor: "Sarah Johnson",
    difficulty: "Beginner",
    duration: "8 weeks",
    rating: 4.9,
    students: 12000,
    price: 89.99,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop",
    description: "Learn the fundamentals of data science including statistics, Python, and visualization.",
    progress: 0
  },
  {
    id: 4,
    title: "Digital Marketing",
    category: "marketing",
    instructor: "Emily Davis",
    difficulty: "Beginner",
    duration: "6 weeks",
    rating: 4.6,
    students: 9500,
    price: 69.99,
    thumbnail: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=2874&auto=format&fit=crop",
    description: "Learn how to create effective digital marketing campaigns across multiple platforms.",
    progress: 0
  }
];

const Dashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  
  // Fetch user's enrolled courses
  useEffect(() => {
    // In a real app, this would be an API call
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Check if user has any enrolled courses (for demo purposes)
      const hasEnrolledCourses = Math.random() > 0.3; // 70% chance of having courses
      setEnrolledCourses(hasEnrolledCourses ? mockEnrolledCourses : []);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Filter courses based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCourses(enrolledCourses);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = enrolledCourses.filter(course => 
        course.title.toLowerCase().includes(term) || 
        course.instructor.toLowerCase().includes(term) ||
        course.category.toLowerCase().includes(term)
      );
      setFilteredCourses(filtered);
    }
  }, [searchTerm, enrolledCourses]);

  const handleContinue = (courseId: number) => {
    console.log(`Continuing course ${courseId}`);
    // In a real app, navigate to the appropriate module/lesson
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning Dashboard</h1>
            <p className="text-gray-600">Track your progress and continue learning</p>
          </div>
          
          {enrolledCourses.length > 0 && (
            <div className="mt-4 md:mt-0 relative max-w-xs w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search your courses"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No courses yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              You haven't enrolled in any courses yet. Browse our catalog to find courses that match your interests.
            </p>
            <Link 
              to="/courses" 
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Browse Courses
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses ({enrolledCourses.length})</h2>
              
              {searchTerm && filteredCourses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-8 text-center">
                  <p className="text-gray-600 mb-4">
                    No courses found matching "{searchTerm}"
                  </p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map(course => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onContinue={() => handleContinue(course.id)}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
                <Link 
                  to="/courses" 
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  View all courses <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendedCourses.map(course => (
                  <div 
                    key={course.id} 
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <Link to={`/course/${course.id}`}>
                      <img 
                        src={course.thumbnail} 
                        alt={course.title} 
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                    
                    <div className="p-6">
                      <Link to={`/course/${course.id}`}>
                        <h3 className="font-bold text-lg text-gray-900 hover:text-blue-600 mb-2">
                          {course.title}
                        </h3>
                      </Link>
                      
                      <p className="text-gray-600 text-sm mb-4">
                        {course.instructor} • {course.difficulty} • {course.duration}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex text-yellow-400 mr-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(course.rating) ? 'fill-current' : 'stroke-current fill-none'}`} 
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({course.students.toLocaleString()})
                          </span>
                        </div>
                        
                        <span className="font-bold text-gray-900">
                          ${course.price}
                        </span>
                      </div>
                      
                      <Link
                        to={`/course/${course.id}`}
                        className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                      >
                        View Course
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-md p-8 mt-16">
              <div className="md:flex md:items-center md:justify-between">
                <div className="mb-6 md:mb-0 md:mr-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to advance your skills?</h2>
                  <p className="text-gray-700 mb-4">
                    Explore our catalog of expert-led courses and start learning today.
                  </p>
                  <div className="flex space-x-8">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Expert instructors</span>
                    </div>
                    <div className="flex items-center">
                      <Award className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Certificates</span>
                    </div>
                    <div className="flex items-center">
                      <Target className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Practical projects</span>
                    </div>
                  </div>
                </div>
                
                <Link 
                  to="/courses" 
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse All Courses
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
