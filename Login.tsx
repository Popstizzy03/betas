// src/pages/Login.tsx
import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

// Import the User type from your auth context
import { User } from '../contexts/AuthContext';

interface LoginResponse {
  error: string;
  token: string;
  user: User;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  // Email validation helper
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation checks
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();
      
      if (data.error) {
        setError(data.error);
        setIsLoading(false);
      } else {
        // Update local storage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update global auth state
        setUser(data.user);
        
        // Redirect based on role or default dashboard
        navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left side - Branding/Image for larger screens */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-yellow-400 flex-col justify-center items-center p-12">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-black mb-6">Welcome to Our Platform</h1>
          <p className="text-lg lg:text-xl text-black mb-8">
            Access all your tools and resources in one place. Log in to continue your journey.
          </p>
          <div className="w-full max-w-md mx-auto">
            {/* You could add an illustration or brand image here */}
            <div className="aspect-video bg-yellow-300 rounded-2xl flex items-center justify-center">
              <span className="text-xl font-semibold">Your Brand Logo/Image</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 md:p-8 lg:p-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-500 text-sm mb-8">Enter your email and password to log in to your account.</p>
          
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-yellow-500 hover:text-yellow-600 text-xs"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className={`w-full py-3 rounded-xl text-black font-medium transition-colors
                ${isLoading || !email || !password
                  ? 'bg-yellow-200 cursor-not-allowed'
                  : 'bg-yellow-400 hover:bg-yellow-500'
                }`}
            >
              {isLoading ? 'Logging in...' : 'Log in'}
            </button>
            
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-gray-200 w-full"></div>
              <div className="bg-white px-3 text-gray-500 text-sm absolute">or</div>
            </div>
            
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-3 lg:gap-4">
              <button
                type="button"
                className="w-full py-3 px-4 border border-gray-300 rounded-xl bg-white text-gray-800 font-medium flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
              >
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="hidden lg:inline">Continue with Google</span>
                <span className="lg:hidden">Google</span>
              </button>
              
              <button
                type="button"
                className="w-full py-3 px-4 border border-gray-300 rounded-xl bg-white text-gray-800 font-medium flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
              >
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" fill="#1877F2"/>
                </svg>
                <span className="hidden lg:inline">Continue with Facebook</span>
                <span className="lg:hidden">Facebook</span>
              </button>
            </div>
            
            <button
              type="button"
              className="w-full py-3 px-4 border border-gray-300 rounded-xl bg-white text-gray-800 font-medium flex items-center justify-center space-x-2 hover:bg-gray-50 transition-colors"
            >
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.64-2.09 1.04-3.36 1.12-1.2.08-2.4-.08-3.49-.56-1.1-.48-2.08-1.28-2.83-2.32-.6-.8-1.04-1.76-1.23-2.82-.19-1.06-.11-2.14.24-3.12.43-1.2 1.18-2.2 2.17-2.91.99-.71 2.17-1.11 3.39-1.12 1.2-.01 2.4.35 3.41 1.08-.31.36-.65.7-1 1.03-.98-.74-2.34-1.02-3.47-.55-1.21.51-2.16 1.78-2.43 3.06-.28 1.28-.03 2.77.96 3.67.91.83 2.31 1.13 3.49.71 1.18-.42 2.04-1.56 2.22-2.77h-2.9v-1.42h4.46c.06.95-.15 1.97-.63 2.82s-1.21 1.5-2.1 1.9v1.1zm3.19-12.38V5.71H18.6v2.19h-2.19v1.64H18.6v2.19h1.64v-2.19h2.19V7.9h-2.19z" fill="#000000"/>
              </svg>
              <span>Continue with Apple</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-yellow-500 hover:text-yellow-600 font-medium"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
