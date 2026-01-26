import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Users, Wallet, Activity, UserPlus, CreditCard, ScanLine, Search } from 'lucide-react';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', rfid_uid: '' });
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');

  const fetchData = async () => {
    try {
      const usersRes = await axios.get('http://localhost:5000/api/auth/users');
      const logsRes = await axios.get('http://localhost:5000/api/nfc/logs');
      setUsers(usersRes.data);
      setLogs(logsRes.data);
    } catch (err) { console.error("Error", err); }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage('User registered successfully');
      setFormData({ name: '', email: '', password: '', role: 'student', rfid_uid: '' });
      fetchData();
    } catch (err) { setMessage('Error registering user'); }
  };

  const handleTopUp = async (e) => {
    e.preventDefault();
    if(!selectedUser || !amount) return;
    try {
      await axios.post('http://localhost:5000/api/nfc/topup', {
        rfid_uid: selectedUser,
        amount: parseFloat(amount)
      });
      alert(`₹${amount} Added!`);
      setAmount('');
      fetchData();
    } catch (err) { alert('Failed'); }
  };

  const totalMoney = users.reduce((acc, user) => acc + (user.wallet_balance || 0), 0);

  return (
      <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text">
        <Sidebar />

        <div className="ml-64 flex-1 p-10">

          {/* Header */}
          <header className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-campus-text">Dashboard</h1>
              <p className="text-gray-400 mt-1">Real-time campus overview</p>
            </div>
            <div className="bg-white px-5 py-2 rounded-full shadow-sm border border-campus-secondary flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-campus-text">System Active</span>
            </div>
          </header>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: 'Total Students', val: users.length, icon: <Users size={24} /> },
              { label: 'Wallet Value', val: `₹${totalMoney}`, icon: <Wallet size={24} /> },
              { label: 'Transactions', val: logs.length, icon: <Activity size={24} /> }
            ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-campus-secondary flex items-center hover:shadow-md transition">
                  <div className="w-14 h-14 rounded-full bg-campus-secondary flex items-center justify-center text-campus-text mr-4">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-2xl font-bold text-campus-text">{stat.val}</p>
                  </div>
                </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* LEFT: Forms (4 Cols) */}
            <div className="lg:col-span-4 space-y-8">

              {/* Register */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-campus-secondary">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <UserPlus size={20} className="text-campus-primary" /> New Student
                </h2>
                {message && <div className="text-sm text-green-600 mb-2 font-bold">{message}</div>}
                <form onSubmit={handleRegister} className="space-y-4">
                  <input type="text" placeholder="Full Name" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <input type="email" placeholder="Email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  <input type="password" placeholder="Password" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />

                  <div className="relative">
                    <input type="text" placeholder="Scan Card for UID..." className="input-field pl-10 bg-campus-bg font-mono text-sm" value={formData.rfid_uid} onChange={e => setFormData({...formData, rfid_uid: e.target.value})} />
                    <ScanLine size={16} className="absolute left-3 top-4 text-gray-400" />
                  </div>

                  <button className="w-full bg-campus-text text-white font-bold py-3 rounded-xl hover:opacity-90 transition shadow-lg">
                    Create Account
                  </button>
                </form>
              </div>

              {/* Top Up */}
              <div className="bg-white rounded-2xl shadow-sm p-8 border border-campus-secondary">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <CreditCard size={20} className="text-campus-primary" /> Quick Recharge
                </h2>
                <form onSubmit={handleTopUp} className="space-y-4">
                  <select className="input-field bg-white" onChange={e => setSelectedUser(e.target.value)}>
                    <option value="">Select Student</option>
                    {users.map(u => <option key={u.user_id} value={u.rfid_uid}>{u.name} (₹{u.wallet_balance})</option>)}
                  </select>
                  <div className="relative">
                    <span className="absolute left-4 top-3.5 text-gray-400 font-bold">₹</span>
                    <input type="number" placeholder="Amount" className="input-field pl-8" value={amount} onChange={e => setAmount(e.target.value)} />
                  </div>

                  <button className="w-full bg-campus-primary text-campus-text font-bold py-3 rounded-xl hover:brightness-105 transition shadow-lg">
                    Add Money
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT: Data (8 Cols) */}
            <div className="lg:col-span-8 space-y-8">

              {/* Live Logs */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-campus-secondary">
                <div className="px-8 py-5 border-b border-gray-100 bg-campus-secondary/30 flex justify-between items-center">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Activity size={18} /> Live Activity
                  </h2>
                  <span className="text-xs bg-campus-primary text-campus-text px-2 py-1 rounded font-bold">LIVE</span>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 font-bold text-xs uppercase sticky top-0">
                    <tr>
                      <th className="px-6 py-3">Time</th>
                      <th className="px-6 py-3">User</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3 text-right">Amount</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm">
                    {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-mono text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                          <td className="px-6 py-4 font-bold text-campus-text">{log.user_name}</td>
                          <td className="px-6 py-4">
                            <span className="bg-campus-secondary text-campus-text px-3 py-1 rounded-full text-xs font-bold">
                                {log.scan_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-red-400">
                            {log.amount > 0 ? `-₹${log.amount}` : '-'}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Styles */}
        <style>{`
        .input-field {
            width: 100%;
            padding: 12px;
            border-radius: 12px;
            border: 2px solid #F6F6F6;
            outline: none;
            transition: all 0.2s;
            color: #8785A2;
        }
        .input-field:focus {
            border-color: #FFC7C7;
            background-color: #fff;
        }
      `}</style>
      </div>
  );
};

export default Dashboard;