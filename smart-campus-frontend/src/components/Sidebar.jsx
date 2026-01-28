import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Coffee, BookOpen, CalendarDays,
    LogOut, Moon, Sun
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();

    const menu = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        // Removed Users page
        { name: 'Attendance', path: '/attendance', icon: <CalendarDays size={20} /> },
        { name: 'Library', path: '/library', icon: <BookOpen size={20} /> },
        { name: 'Smart Canteen', path: '/canteen', icon: <Coffee size={20} /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    return (
        <div className="h-screen w-64 bg-campus-card border-r border-campus-border flex flex-col fixed left-0 top-0 transition-colors duration-300">

            <div className="p-8 flex items-center gap-3">
                <div className="w-8 h-8 bg-campus-primary rounded-lg"></div>
                <h1 className="text-2xl font-extrabold text-campus-text tracking-tight">Campus<span className="text-campus-secondary">ID</span></h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {menu.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${isActive
                                ? 'bg-campus-text text-campus-bg shadow-lg'
                                : 'text-campus-secondary hover:bg-campus-bg hover:text-campus-text'
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-campus-border space-y-2">
                <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-campus-secondary hover:bg-campus-bg hover:text-campus-text transition-all"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;