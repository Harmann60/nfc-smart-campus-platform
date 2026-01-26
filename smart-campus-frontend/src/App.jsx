import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Canteen from './pages/Canteen';     // Import Canteen
import Attendance from './pages/Attendance'; // Import Attendance
import Library from './pages/Library';     // Import Library (Create file first or use Attendance code)

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/canteen" element={<Canteen />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/library" element={<Attendance />} /> {/* Reusing Attendance for Library for now */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;