import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // SCANNER STATE
  const [scanMode, setScanMode] = useState('ATTENDANCE'); // Default mode
  const [scannedId, setScannedId] = useState('');
  const searchInputRef = useRef(null); // To keep focus on the input

  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'student', rfid_uid: ''
  });
  const [message, setMessage] = useState('');

  // Top Up State
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');

  // 1. Fetch Users AND Logs
  const fetchData = async () => {
    try {
      const usersRes = await axios.get('http://localhost:5000/api/auth/users');
      const logsRes = await axios.get('http://localhost:5000/api/nfc/logs');
      setUsers(usersRes.data);
      setLogs(logsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000); // Faster refresh for live scanning
    return () => clearInterval(interval);
  }, []);

  // 2. HANDLE USB SCANNER INPUT
  // When reader types ID + Enter, this function runs automatically
  const handleScanSubmit = async (e) => {
    e.preventDefault();
    if (!scannedId) return;

    // Send to Backend
    try {
      await axios.post('http://localhost:5000/api/nfc/scan', {
        rfid_uid: scannedId,
        type: scanMode,
        amount: scanMode === 'PAYMENT' ? 20 : 0 // Default $20 for demo payment
      });
      // Clear input for next scan
      setScannedId('');
      fetchData();
      // Keep focus so you can scan again immediately
      searchInputRef.current.focus();
    } catch (err) {
      console.error("Scan failed");
      setScannedId('');
    }
  };

  // Ensure input always has focus when you click anywhere (Optional Kiosk feel)
  const keepFocus = () => {
    if(searchInputRef.current) searchInputRef.current.focus();
  }

  // Handle Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('User registered successfully!');
      setFormData({ name: '', email: '', password: '', role: 'student', rfid_uid: '' });
      fetchData();
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.error || 'Failed'));
    }
  };

  // Handle Top Up
  const handleTopUp = async () => {
    if(!selectedUser || !amount) return;
    try {
      await axios.post('http://localhost:5000/api/nfc/topup', {
        rfid_uid: selectedUser,
        amount: parseFloat(amount)
      });
      alert('Money Added Successfully! 💰');
      setAmount('');
      setSelectedUser(null);
      fetchData();
    } catch (err) {
      alert('Top Up Failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
      <div className="min-h-screen bg-gray-100 p-8" onClick={keepFocus}>
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Smart Campus Admin</h1>
              <p className="text-gray-600">USB Reader Connected</p>
            </div>
            <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Logout
            </button>
          </div>

          {/* 🔴 NEW: USB SCANNER TERMINAL */}
          <div className="bg-blue-900 text-white p-6 rounded-lg shadow-xl border-2 border-blue-500">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              📡 ACTIVE SCANNER TERMINAL
              <span className="ml-2 text-xs bg-green-500 px-2 py-1 rounded text-white animate-pulse">LIVE</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-blue-200 mb-1">Select Scanner Mode</label>
                <div className="flex space-x-2">
                  {['ATTENDANCE', 'LIBRARY', 'PAYMENT'].map(mode => (
                      <button
                          key={mode}
                          onClick={() => { setScanMode(mode); searchInputRef.current.focus(); }}
                          className={`px-4 py-2 rounded font-bold ${scanMode === mode ? 'bg-white text-blue-900' : 'bg-blue-800 text-blue-300'}`}
                      >
                        {mode}
                      </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleScanSubmit}>
                <label className="block text-sm text-blue-200 mb-1">Scan Card Here (Auto-Detect)</label>
                <input
                    ref={searchInputRef}
                    type="text"
                    value={scannedId}
                    onChange={(e) => setScannedId(e.target.value)}
                    placeholder="Waiting for tap..."
                    className="w-full text-black px-4 py-3 text-lg rounded border-4 border-blue-400 focus:border-yellow-400 outline-none font-mono"
                    autoFocus
                />
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT COLUMN: Actions */}
            <div className="lg:col-span-1 space-y-8">

              {/* 1. Register Form */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Register User</h2>
                {message && <div className="text-sm text-green-600 mb-2">{message}</div>}
                <form onSubmit={handleRegister} className="space-y-3">
                  <input type="text" placeholder="Name" className="w-full border p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input type="email" placeholder="Email" className="w-full border p-2 rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <input type="password" placeholder="Password" className="w-full border p-2 rounded" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                  <input type="text" placeholder="RFID UID (Scan to fill)" className="w-full border p-2 rounded" value={formData.rfid_uid} onChange={e => setFormData({...formData, rfid_uid: e.target.value})} />
                  <button className="w-full bg-blue-600 text-white py-2 rounded">Register</button>
                </form>
              </div>

              {/* 2. Top Up Wallet */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">💰 Add Funds</h2>
                <div className="space-y-3">
                  <select className="w-full border p-2 rounded bg-white" onChange={e => setSelectedUser(e.target.value)}>
                    <option value="">Select Student</option>
                    {users.map(u => u.rfid_uid && <option key={u.user_id} value={u.rfid_uid}>{u.name} (${u.wallet_balance})</option>)}
                  </select>
                  <input type="number" placeholder="Amount ($)" className="w-full border p-2 rounded" value={amount} onChange={e => setAmount(e.target.value)} />
                  <button onClick={handleTopUp} className="w-full bg-green-600 text-white py-2 rounded">Add Money</button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Data Tables */}
            <div className="lg:col-span-2 space-y-8">

              {/* 3. Live Activity Logs */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">📡 Live Activity Feed</h2>
                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">Auto-refreshes</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-sm text-gray-600">Time</th>
                      <th className="px-4 py-2 text-sm text-gray-600">User</th>
                      <th className="px-4 py-2 text-sm text-gray-600">Type</th>
                      <th className="px-4 py-2 text-sm text-gray-600">Status</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-xs text-gray-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium">{log.user_name || "Unknown"}</td>
                          <td className="px-4 py-2 text-sm">
                          <span className={`px-2 py-1 text-xs rounded-full font-bold
                            ${log.scan_type === 'PAYMENT' ? 'bg-yellow-100 text-yellow-800' :
                              log.scan_type === 'LIBRARY' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                            {log.scan_type}
                          </span>
                            {log.amount > 0 && <span className="ml-2 text-xs text-red-600">(-${log.amount})</span>}
                          </td>
                          <td className="px-4 py-2 text-sm">
                          <span className={`text-xs font-bold ${log.status === 'GRANTED' ? 'text-green-600' : 'text-red-600'}`}>
                            {log.status}
                          </span>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. User List */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-800">👥 All Users</h2>
                </div>
                <table className="w-full text-left">
                  <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-sm font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-500">Wallet</th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-500">Role</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                      <tr key={user.user_id}>
                        <td className="px-6 py-4 text-sm font-medium">{user.name}</td>
                        <td className="px-6 py-4 text-sm font-mono text-green-700 font-bold">
                          ${user.wallet_balance || 0}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">{user.role}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </div>
  );
};

export default Dashboard;