import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Canteen from './pages/Canteen';
import Attendance from './pages/Attendance';
import Library from './pages/Library';
import LibraryLogs from './pages/LibraryLogs'; // 1. IMPORT YOUR NEW PAGE

function App() {
  return (
    <Router>
      <Routes>
        {/* LOGIN: No Sidebar here */}
        <Route path="/" element={<Login />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/*"
          element={
            <div className="flex h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/canteen" element={<Canteen />} />
                  <Route path="/attendance" element={<Attendance />} />
                  <Route path="/library" element={<Library />} />
                  
                  {/* 2. ADD THE NEW ROUTE HERE */}
                  <Route path="/library-logs" element={<LibraryLogs />} />
                  
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;