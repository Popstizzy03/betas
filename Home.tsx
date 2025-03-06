import { useState, useEffect, useRef } from 'react';
import BlogPost from '../components/BlogPost';
import ReactSVG from '../assets/react.svg';
import WebDevLogo from '../assets/5.png';
import UiUxLogo from '../assets/3.jpg';
import DataScienceLogo from '../assets/4.jpg';
import ViteSVG from '../assets/vite.svg';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Star, 
  ChevronRight, 
  Users, 
  BookOpen, 
  Trophy, 
  ChevronDown,
  Clock,
  CheckCircle,
  ArrowRight,
  Award,
  Code,
  PenTool,
  Database,
  Heart,
  ExternalLink
} from 'lucide-react';

const Home = () => {
  // Smooth scroll function
  const scrollToRef = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Refs for scrolling
  const faqRef = useRef(null);
  const coursesRef = useRef(null);
  const testimonialsRef = useRef(null);
  const blogRef = useRef(null);

  const featuredCourses = [
    {
      id: 1,
      title: "Web Development Bootcamp",
      instructor: "John Smith",
      rating: 4.8,
      students: 15000,
      price: 99.99,
      image: WebDevLogo,
      duration: "10 weeks",
      level: "Beginner to Advanced",
      tags: ["HTML", "CSS", "JavaScript", "React"],
      icon: <Code className="w-6 h-6" />
    },
    {
      id: 2,
      title: "Data Science Fundamentals",
      instructor: "Sarah Johnson",
      rating: 4.9,
      students: 12000,
      price: 89.99,
      image: DataScienceLogo,
      duration: "8 weeks",
      level: "Intermediate",
      tags: ["Python", "Pandas", "Machine Learning"],
      icon: <Database className="w-6 h-6" />
    },
    {
      id: 3,
      title: "UX/UI Design Mastery",
      instructor: "Mike Wilson",
      rating: 4.7,
      students: 8000,
      price: 79.99,
      image: UiUxLogo,
      duration: "6 weeks",
      level: "All Levels",
      tags: ["Figma", "Design Thinking", "Prototyping"],
      icon: <PenTool className="w-6 h-6" />
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Alex Morgan",
      role: "Software Engineer",
      company: "TechCorp",
      image: ViteSVG,
      content: "CareerTrain completely transformed my career path. The courses are comprehensive and practical. I landed my dream job within 2 months of completing the bootcamp.",
      highlight: "Landed my dream job within 2 months"
    },
    {
      id: 2,
      name: "Jamie Chen",
      role: "Graphic Designer",
      company: "CreativeStudio",
      image: ReactSVG,
      content: "The quality of instruction is outstanding. I learned more in 3 months than I did in a year of self-study. The mentorship program was particularly valuable.",
      highlight: "Outstanding instruction quality"
    },
    {
      id: 3,
      name: "Taylor Reed",
      role: "Electronic Engineer",
      company: "InnovateTech",
      image: ReactSVG,
      content: "CareerTrain completely transformed my approach to problem-solving. The courses are challenging in all the right ways and the community support is incredible.",
      highlight: "Incredible community support"
    },
    {
      id: 4,
      name: "Jordan Patel",
      role: "Animator",
      company: "VisualWorks",
      image: ViteSVG,
      content: "The quality of instruction is outstanding. I learned more in 3 months than I did in 2 years of self-study. The portfolio projects helped me showcase my skills to employers.",
      highlight: "Portfolio projects impressed employers"
    }
  ];

  const faqs = [
    {
      id: 1,
      question: "How do I get started with CareerTrain?",
      answer: "Simply create an account, browse our course catalog, and enroll in any course that interests you. You can start learning immediately after enrollment."
    },
    {
      id: 2,
      question: "Are there any prerequisites for the courses?",
      answer: "Most beginner courses have no prerequisites. For intermediate and advanced courses, recommended prerequisites are clearly listed on the course page."
    },
    {
      id: 3,
      question: "Do I get a certificate after completing a course?",
      answer: "Yes, you'll receive a digital certificate of completion for every course you finish. This can be shared on your LinkedIn profile or with potential employers."
    },
    {
      id: 4,
      question: "What is the refund policy?",
      answer: "We offer a 30-day money-back guarantee for most courses. If you're not satisfied with your purchase, you can request a full refund within 30 days of enrollment."
    },
    {
      id: 5,
      question: "Can I access the courses on mobile devices?",
      answer: "Yes, our platform is fully responsive. You can access all courses and materials on smartphones, tablets, or desktop computers."
    }
  ];

  const blogs = [
    {
      id: 1,
      title: "The Future of Web Development",
      author: "Jane Doe",
      date: "October 1, 2023",
      excerpt: "Explore upcoming trends in web development and how they will shape the industry.",
      image: "https://via.placeholder.com/600x400",
      category: "Web Development",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Mastering Data Science: A Beginner's Guide",
      author: "John Smith",
      date: "September 25, 2023",
      excerpt: "Learn the fundamentals of data science and how to get started in this exciting field.",
      image: "https://via.placeholder.com/600x400",
      category: "Data Science",
      readTime: "8 min read"
    },
    {
      id: 3,
      title: "UX/UI Design Trends for 2024",
      author: "Emily Johnson",
      date: "September 15, 2023",
      excerpt: "Stay ahead of the curve with the latest design trends and best practices.",
      image: "https://via.placeholder.com/600x400",
      category: "Design",
      readTime: "6 min read"
    },
  ];

  const [openFaqId, setOpenFaqId] = useState(null);
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  // Auto scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section with Animated Gradient */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cmVjdCBmaWxsPSIjNTAwNEZGIiB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiLz48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjUiIGZpbGw9IiNFMDU2RkYiIGN4PSI3MjAiIGN5PSIyNDAiIHI9IjI0MCIvPjxjaXJjbGUgZmlsbC1vcGFjaXR5PSIuNSIgZmlsbD0iI0UwNTZGRiIgY3g9IjU1MCIgY3k9IjU1MCIgcj0iMTcwIi8+PGNpcmNsZSBmaWxsLW9wYWNpdHk9Ii41IiBmaWxsPSIjRTA1NkZGIiBjeD0iMTEwMCIgY3k9IjQ1MCIgcj0iMTkwIi8+PGNpcmNsZSBmaWxsLW9wYWNpdHk9Ii41IiBmaWxsPSIjRTA1NkZGIiBjeD0iMTIwMCIgY3k9IjY1MCIgcj0iMTkwIi8+PC9nPjwvc3ZnPg==')] opacity-10 mix-blend-soft-light"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-24 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fadeIn">
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-800 bg-opacity-70 text-indigo-200 mb-2">
                  Unlock Your Potential
                </span>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight animate-gradientText bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-white">
                  Transform Your Career With <span className="text-rose-300">Expert-Led</span> Training
                </h1>
                <p className="text-xl text-blue-100 leading-relaxed">
                  Access over 1000+ courses from industry experts and transform your career today. 
                  Join thousands of successful graduates already thriving in their new roles.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => scrollToRef(coursesRef)}
                    className="inline-flex items-center px-8 py-4 rounded-full bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Explore Courses
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </button>
                  <button className="inline-flex items-center px-8 py-4 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-all duration-300 ease-in-out">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                <img
                  src={ViteSVG}
                  alt="Learning"
                  className="relative rounded-2xl shadow-2xl animate-float w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave SVG divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,165.3C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white shadow-md rounded-3xl mx-4 md:mx-8 lg:mx-auto max-w-7xl -mt-10 relative z-10 transform hover:shadow-xl transition-shadow duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-4 hover:bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex justify-center mb-4">
                <Users className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">100K+</div>
              <div className="text-gray-600 font-medium">Active Students</div>
            </div>
            <div className="text-center p-4 hover:bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex justify-center mb-4">
                <BookOpen className="h-10 w-10 text-rose-500" />
              </div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">1000+</div>
              <div className="text-gray-600 font-medium">Total Courses</div>
            </div>
            <div className="text-center p-4 hover:bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex justify-center mb-4">
                <Trophy className="h-10 w-10 text-amber-500" />
              </div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">89%</div>
              <div className="text-gray-600 font-medium">Success Rate</div>
            </div>
            <div className="text-center p-4 hover:bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex justify-center mb-4">
                <Star className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">4.8/5</div>
              <div className="text-gray-600 font-medium">Student Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div ref={coursesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-2">
            Featured Courses
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Advance Your Skills</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Master in-demand skills with industry experts and build a portfolio that gets you hired</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-3xl blur opacity-0 group-hover:opacity-75 transition duration-500"></div>
              <div className="relative bg-white rounded-3xl overflow-hidden">
                <div className="relative h-60 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-700/80 to-indigo-700/80 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center z-10">
                    <Link
                      to={`/course/${course.id}`}
                      className="inline-flex items-center px-6 py-3 rounded-full bg-white text-indigo-600 font-semibold transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      View Course <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    Bestseller
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                      {course.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-gray-600">By {course.instructor}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {course.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-4 w-4 mr-2 text-indigo-500" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      <span className="text-sm">{course.level}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(course.rating) ? 'fill-current' : 'stroke-current fill-none'}`} 
                        />
                      ))}
                      <span className="ml-2 text-gray-700 text-sm">{course.rating} ({course.students.toLocaleString()})</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">${course.price}</span>
                    <Link
                      to={`/course/${course.id}`}
                      className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/courses" className="inline-flex items-center px-6 py-3 rounded-full border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors">
            View All Courses <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Testimonials */}
      <div ref={testimonialsRef} className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-2">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Join thousands of learners who have transformed their careers</p>
          </div>
          
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out" 
                style={{ transform: `translateX(-${activeTestimonialIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                  <div 
                    key={testimonial.id} 
                    className="min-w-full px-4"
                  >
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 max-w-4xl mx-auto relative">
                      <div className="absolute top-0 right-0 -mt-4 -mr-4">
                        <div className="bg-purple-600 rounded-full p-3 text-white shadow-lg">
                          <Heart className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="flex-shrink-0">
                          <div className="h-24 w-24 rounded-full p-1 bg-gradient-to-r from-purple-400 to-pink-500">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name} 
                              className="rounded-full w-full h-full object-cover bg-white p-1" 
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="mb-6">
                            <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 mb-4">
                              {testimonial.highlight}
                            </span>
                            <p className="text-gray-700 text-lg italic leading-relaxed">"{testimonial.content}"</p>
                          </div>
                          <div className="border-t border-gray-200 pt-4">
                            <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                            <div className="text-purple-600">{testimonial.role}</div>
                            <div className="text-gray-500 text-sm">{testimonial.company}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-10 space-x-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonialIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    activeTestimonialIndex === idx ? 'bg-purple-600' : 'bg-purple-200'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800 mb-2">
            Why Choose Us
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Learning Experience Designed for Success</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Our platform combines expert instruction with hands-on practice for optimal results</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              icon: <Award className="h-8 w-8 text-teal-500" />,
              title: "Industry-Recognized Certificates",
              description: "Earn certificates that are valued by top employers worldwide and showcase your skills."
            },
            {
              icon: <Users className="h-8 w-8 text-indigo-500" />,
              title: "Expert Instructors",
              description: "Learn from industry professionals with years of real-world experience and teaching expertise."
            },
            {
              icon: <Code className="h-8 w-8 text-purple-500" />,
              title: "Hands-On Projects",
              description: "Apply your knowledge with real-world projects that build your portfolio and confidence."
            },
            {
              icon: <Clock className="h-8 w-8 text-amber-500" />,
              title: "Flexible Learning",
              description: "Study at your own pace with lifetime access to course materials and updates."
            },
            {
              icon: <Heart className="h-8 w-8 text-rose-500" />,
              title: "Community Support",
              description: "Connect with fellow learners, share insights, and grow your professional network."
            },
            {
              icon: <Trophy className="h-8 w-8 text-emerald-500" />,
              title: "Career Services",
              description: "Get resume reviews, interview preparation, and job placement assistance to land your dream role."
            }
          ].map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-2"
            >
              <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-3 inline-block mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* FAQ Section */}
      <div ref={faqRef} className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white mb-2">
              Got Questions?
            </span>
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-indigo-100">Find answers to common questions about our platform</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 transition-all duration-300 hover:bg-white/15"
              >
                <button
                  className="flex justify-between items-center w-full p-6 text-left font-medium focus:outline-none"
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span className="text-lg font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-300 ${openFaqId === faq.id ? 'transform rotate-180' : ''}`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaqId === faq.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 text-indigo-100 border-t border-white/10">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>  
            ))}
          </div>
        </div>
      </div>
      
      {/* Blog Section */}
      <section ref={blogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-rose-100 text-rose-800 mb-2">
            Latest Insights
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">From Our Blog</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Stay updated with our latest insights and articles on technology and learning</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog) => (
            <div key={blog.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                  {blog.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                  <span>{blog.date}</span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {blog.readTime}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">By {blog.author}</div>
                  <Link to={`/blog/${blog.id}`} className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors">
                    Read More
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/blog" className="inline-flex items-center px-6 py-3 rounded-full border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors">
            View All Articles <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
      
      {/* CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cmVjdCBmaWxsPSIjNTAwNEZGIiB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI3NjAiLz48Y2lyY2xlIGZpbGwtb3BhY2l0eT0iLjUiIGZpbGw9IiNFMDU2RkYiIGN4PSI3MjAiIGN5PSIyNDAiIHI9IjI0MCIvPjxjaXJjbGUgZmlsbC1vcGFjaXR5PSIuNSIgZmlsbD0iI0UwNTZGRiIgY3g9IjU1MCIgY3k9IjU1MCIgcj0iMTcwIi8+PGNpcmNsZSBmaWxsLW9wYWNpdHk9Ii41IiBmaWxsPSIjRTA1NkZGIiBjeD0iMTEwMCIgY3k9IjQ1MCIgcj0iMTkwIi8+PGNpcmNsZSBmaWxsLW9wYWNpdHk9Ii41IiBmaWxsPSIjRTA1NkZGIiBjeD0iMTIwMCIgY3k9IjY1MCIgcj0iMTkwIi8+PC9nPjwvc3ZnPg==')] opacity-10 mix-blend-soft-light"></div>
        </div>
        <div className="relative py-20 text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white mb-4">
              Limited Time Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Career?</h2>
            <p className="text-xl text-indigo-100 mb-10 leading-relaxed">
              Join our community of 100,000+ learners today and get 20% off your first course!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <Link 
                to="/signup" 
                className="px-8 py-4 rounded-full bg-white text-indigo-600 font-semibold hover:bg-blue-50 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Start Learning Today
              </Link>
              <Link 
                to="/courses" 
                className="px-8 py-4 rounded-full border-2 border-white text-white hover:bg-white/10 transition-all duration-300 ease-in-out flex items-center justify-center"
              >
                Browse Courses
              </Link>
            </div>
            <p className="text-indigo-200 mt-6 text-sm">No credit card required. 7-day free trial available.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
