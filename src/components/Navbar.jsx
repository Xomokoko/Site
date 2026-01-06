import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, BarChart3, ExternalLink, List, Moon, Sun, Binary } from 'lucide-react';
import useTheme from "../hooks/useTheme";
import { Settings as SettingsIcon } from 'lucide-react';


const Navbar = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/planning', icon: Calendar, label: 'Planning' },
    { path: '/analytics', icon: BarChart3, label: 'Analyses' },
    { path: '/cours', icon: List, label: 'Cours' },
    { path: '/link', icon: ExternalLink, label: 'Liens' },
    { path: '/settings', icon: SettingsIcon, label: 'Paramètres' },

  ];

  return (
    <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Binary className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-display bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Blocus
            </span>
          </Link>

          {/* Navigation links + Theme Toggle */}
          <div className="flex items-center gap-2">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;