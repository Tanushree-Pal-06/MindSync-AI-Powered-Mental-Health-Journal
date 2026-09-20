import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, BookOpen, BarChart3, Clock, Sparkles,LogOut} from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from "sonner";
import logo from '@/assets/mindsync-logo.png';

const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/diary', label: 'Diary', icon: BookOpen },
  { path: '/insights', label: 'Insights', icon: BarChart3 },
  { path: '/suggestions', label: 'Suggestions', icon: Sparkles },
  { path: '/history', label: 'History', icon: Clock },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const handleLogout = () => {
  localStorage.clear();

  toast.success("Logged out 👋", {
  description: "See you again soon 💜",
  className: "text-gray-900",
  descriptionClassName: "text-gray-600",
});

  setTimeout(() => {
    navigate("/login");
  }, 500);
};

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="MindSync AI"
            width={64}
            height={64}
            className="h-12 w-12 object-contain drop-shadow-[0_0_12px_hsl(var(--primary)/0.4)] transition-transform hover:scale-105 md:h-16 md:w-16"
          />
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">MindSync AI</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative px-4 py-2 text-sm font-medium transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 flex items-center gap-2 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">

      

      <button
        onClick={handleLogout}
        className="
          flex items-center gap-2
          rounded-xl
          bg-gradient-to-r
          from-sky-500
          via-violet-500
          to-purple-600
          px-4
          py-2
          text-sm
          font-medium
          text-white
          shadow-lg
          transition-all
          hover:scale-105
          hover:shadow-xl
        "
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>

    </div>
        
      </div>

      {/* Mobile Nav */}
      <div className="flex justify-around border-t border-border pb-1 pt-1 md:hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
