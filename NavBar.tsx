// Navbar.tsx
import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Search,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
  AlertTriangle,
  Moon,
  Sun
} from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import SearchBar from "../components/navbar/SearchBar";
import NavLinks from "../components/navbar/NavLinks";
import UserMenu from "../components/navbar/UserMenu";
import MobileMenu from "../components/navbar/MobileMenu";
import DeletionBanner from "../components/navbar/DeletionBanner";

interface User {
  id?: string;
  name?: string;
  email?: string;
  scheduledDeletionAt?: string | Date | null;
}

interface NavItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  submenu?: { name: string; path: string }[];
}

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart } = useCart();
  const { user, setUser } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [accountScheduledForDeletion, setAccountScheduledForDeletion] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Handle user data from localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        
        // Check if account is scheduled for deletion
        if (userData.scheduledDeletionAt) {
          setAccountScheduledForDeletion(true);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
      }
    }
    
    // Initialize dark mode from localStorage
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, [setUser]);

  // Check for account deletion status
  useEffect(() => {
    if (user?.scheduledDeletionAt) {
      setAccountScheduledForDeletion(true);
    } else {
      setAccountScheduledForDeletion(false);
    }
  }, [user]);

  // Add responsive breakpoint detection
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
      
      // Close mobile menu if screen becomes large
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileMenuOpen]);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveSubmenu(null);
    setShowUserMenu(false);
    setIsSearchOpen(false);
  }, [location]);

  // Handle clicks outside the mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        event.target instanceof Element &&
        !event.target.closest("button")?.getAttribute("aria-label")?.includes("menu")
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleSubmenuToggle = (name: string) => {
    setActiveSubmenu(activeSubmenu === name ? null : name);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navItems: NavItem[] = [
    { name: "Home", path: "/" },
    {
      name: "Courses",
      path: "/courses",
      icon: <BookOpen className="h-5 w-5" />,
      submenu: [
        { name: "All Categories", path: "/courses/"},
        { name: "Development", path: "/courses/development" },
        { name: "Business", path: "/courses/business" },
        { name: "Design", path: "/courses/design" },
        { name: "Marketing", path: "/courses/marketing" },
        { name: "Public Speaking", path: "/courses/public" },
        { name: "CAD", path: "/courses/cad" },
        { name: "Office Suite", path: "/courses/office" }
      ],
    },
    {
      name: "Corporate",
      path: "/corporate",
      icon: <Briefcase className="h-4 w-4" />,
    },
    {
      name: "Enterprise",
      path: "/enterprise",
      icon: <Building2 className="h-4 w-4" />,
      submenu: [
        { name: "Solutions", path: "/enterprise/solutions" },
        { name: "Case Studies", path: "/enterprise/case-studies" },
        { name: "Partnerships", path: "/enterprise/partnerships" },
      ],
    },
  ];

  const CartButton = () => {
    const { cart } = useCart();
    
    return (
      <button
        onClick={() => navigate('/cart')}
        className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative flex items-center justify-center transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingCart className="h-4 w-4 md:h-5 md:w-5 dark:text-gray-200"/>
        {cart.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
            {cart.length}
          </span>
        )}
      </button>
    );
  };

  const DashboardButton = () => (
    <button
      onClick={() => navigate('/dashboard')}
      className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center"
      aria-label="Dashboard"
    >
      <User className="h-4 w-4 md:h-5 md:w-5 dark:text-gray-200" />
    </button>
  );

  const RightSideControls = () => (
    <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2 md:gap-3">
      <button
        onClick={toggleDarkMode}
        className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <Sun className="h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
        ) : (
          <Moon className="h-4 w-4 md:h-5 md:w-5" />
        )}
      </button>
      
      <button
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        aria-label="Search"
      >
        <Search className="h-4 w-4 md:h-5 md:w-5 dark:text-gray-200" />
      </button>

      {user && <DashboardButton />}
      <CartButton />

      {user ? (
        <UserMenu 
          user={user} 
          showUserMenu={showUserMenu} 
          setShowUserMenu={setShowUserMenu} 
          accountScheduledForDeletion={accountScheduledForDeletion} 
          handleLogout={handleLogout}
          darkMode={darkMode}
        />
      ) : (
        <div className="hidden sm:flex gap-1 lg:gap-2">
          <Link to="/login">
            <button className="px-2 py-1 sm:px-3 md:px-4 md:py-2 text-xs sm:text-sm md:text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors whitespace-nowrap">
              Log in
            </button>
          </Link>
          <Link to="/signup">
            <button className="px-2 py-1 sm:px-3 md:px-4 md:py-2 text-xs sm:text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap">
              Sign up
            </button>
          </Link>
        </div>
      )}

      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="sm:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors z-50 flex items-center justify-center"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
        )}
      </button>
    </div>
  );

  return (
    <>
      {accountScheduledForDeletion && <DeletionBanner />}

      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50
           ${scrolled ? "bg-white/90 dark:bg-gray-900/90 shadow-lg" : "bg-white/10 dark:bg-gray-900/10"}
           backdrop-blur-lg border-b border-gray-300 dark:border-gray-700 transition-all duration-300
           ${accountScheduledForDeletion ? 'mt-10' : ''}`}
      >
        <div className="container mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-12 sm:h-14 md:h-16 gap-1 sm:gap-2 lg:gap-4 relative">
            {/* Logo - More responsive with text variations */}
            <Link
              to="/"
              className="relative z-[70] text-lg sm:text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1 sm:gap-2 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-blue-700 dark:bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm md:text-base shrink-0">
                CT
              </div>
              {/* Different text versions based on screen size */}
              <span className="hidden xs:inline sm:hidden">CT</span>
              <span className="hidden sm:inline">CareerTrain</span>
            </Link>
            
            {/* Desktop Nav Links - Hidden on mobile */}
            <div className="hidden sm:block flex-grow mx-1 md:mx-4">
              <NavLinks 
                navItems={navItems} 
                activeSubmenu={activeSubmenu} 
                location={location} 
                handleSubmenuToggle={handleSubmenuToggle} 
                isSmallScreen={isSmallScreen}
                darkMode={darkMode}
              />
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-0.5 sm:gap-1 lg:gap-3 ml-auto">
              <RightSideControls />
            </div>
          </div>

          <SearchBar 
            isSearchOpen={isSearchOpen} 
            searchInputRef={searchInputRef}
            darkMode={darkMode}
          />
        </div>
      </nav>

      {/* Mobile Menu with backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div
          ref={mobileMenuRef}
          className={`fixed right-0 top-0 h-full w-4/5 max-w-xs bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <MobileMenu 
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            navItems={navItems}
            location={location}
            activeSubmenu={activeSubmenu}
            handleSubmenuToggle={handleSubmenuToggle}
            user={user}
            accountScheduledForDeletion={accountScheduledForDeletion}
            handleLogout={handleLogout}
            darkMode={darkMode}
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;
