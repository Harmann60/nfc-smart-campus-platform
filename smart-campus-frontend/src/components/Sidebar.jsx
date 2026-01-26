import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, BookOpen, Coffee, User, Radio } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const menu = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Attendance', path: '/attendance', icon: <CalendarDays size={20} /> },
        { name: 'Library', path: '/library', icon: <BookOpen size={20} /> },
        { name: 'Smart Canteen', path: '/canteen', icon: <Coffee size={20} /> },
    ];

    return (
        <div className="w-64 bg-campus-text min-h-screen text-white flex flex-col p-5 fixed left-0 top-0 shadow-2xl z-50">

            {/* Brand Header */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-wider text-white flex justify-center items-center gap-2">
                    SIT <span className="text-campus-primary">CAMPUS</span>
                </h1>
                <p className="text-xs text-campus-secondary opacity-70 mt-1 uppercase tracking-widest">Admin Portal</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-3 flex-1">
                {menu.map((item) => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center space-x-3 px-5 py-3 rounded-2xl transition-all duration-300 font-medium
              ${location.pathname === item.path
                            ? 'bg-campus-primary text-campus-text shadow-lg transform scale-105'
                            : 'text-campus-secondary hover:bg-white/10 hover:text-white'}`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.name}</span>
                    </Link>
                ))}
            </nav>

            {/* User Profile Footer */}
            <div className="mt-auto pt-6 border-t border-white/10">
                <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-full bg-campus-primary flex items-center justify-center text-campus-text font-bold">
                        <User size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">Jalaj M.</p>
                        <div className="flex items-center gap-1 text-xs text-campus-primary">
                            <Radio size={10} className="animate-pulse" /> Online
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;