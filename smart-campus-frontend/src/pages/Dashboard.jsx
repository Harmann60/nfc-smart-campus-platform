import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Users, Wallet, Activity, UserPlus, CreditCard, ScanLine } from 'lucide-react';

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
    } catch (err) { console.error("Error fetching data", err); }
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
    if (!selectedUser || !amount) return;
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
  const inputClass = "w-full p-3 rounded-xl border-2 border-campus-bg bg-campus-bg text-campus-text outline-none focus:border-campus-primary focus:bg-campus-card transition-all placeholder-campus-secondary";

  return (
    <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text transition-colors duration-300">
      <Sidebar />

      <div className="ml-64 flex-1 p-10">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-campus-text">Dashboard</h1>
            <p className="text-campus-secondary mt-1">Real-time campus overview</p>
          </div>
          <div className="bg-campus-card px-5 py-2 rounded-full shadow-sm border border-campus-border flex items-center gap-2">
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
            <div key={idx} className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border flex items-center hover:shadow-md transition-colors">
              <div className="w-14 h-14 rounded-full bg-campus-bg flex items-center justify-center text-campus-text mr-4 border border-campus-border">
                {stat.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-campus-secondary uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-campus-text">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Forms */}
          <div className="lg:col-span-4 space-y-8">
            {/* Register Student */}
            <div className="bg-campus-card rounded-2xl shadow-sm p-8 border border-campus-border">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-campus-text">
                <UserPlus size={20} className="text-campus-primary" /> New Student
              </h2>
              {message && <div className="text-sm text-green-500 mb-2 font-bold">{message}</div>}
              <form onSubmit={handleRegister} className="space-y-4">
                <input type="text" placeholder="Full Name" className={inputClass} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                <input type="email" placeholder="Email" className={inputClass} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                <input type="password" placeholder="Password" className={inputClass} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                <div className="relative">
                  <input type="text" placeholder="Scan Card for UID..." className={`${inputClass} pl-10 font-mono text-sm`} value={formData.rfid_uid} onChange={e => setFormData({ ...formData, rfid_uid: e.target.value })} />
                  <ScanLine size={16} className="absolute left-3 top-4 text-campus-secondary" />
                </div>
                <button className="w-full bg-campus-text text-campus-bg font-bold py-3 rounded-xl hover:opacity-90 transition shadow-lg">
                  Create Account
                </button>
              </form>
            </div>

            {/* Quick Recharge */}
            <div className="bg-campus-card rounded-2xl shadow-sm p-8 border border-campus-border">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-campus-text">
                <CreditCard size={20} className="text-campus-primary" /> Quick Recharge
              </h2>
              <form onSubmit={handleTopUp} className="space-y-4">
                <select className={inputClass} onChange={e => setSelectedUser(e.target.value)}>
                  <option value="">Select Student</option>
                  {users.map(u => <option key={u.user_id} value={u.rfid_uid}>{u.name} (₹{u.wallet_balance})</option>)}
                </select>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-campus-secondary font-bold">₹</span>
                  <input type="number" placeholder="Amount" className={`${inputClass} pl-8`} value={amount} onChange={e => setAmount(e.target.value)} />
                </div>
                <button className="w-full bg-campus-primary text-campus-text font-bold py-3 rounded-xl hover:brightness-105 transition shadow-lg">
                  Add Money
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT: Live Activity Table */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-campus-card rounded-2xl shadow-sm overflow-hidden border border-campus-border">
              <div className="px-8 py-5 border-b border-campus-border bg-campus-bg/50 flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2 text-campus-text">
                  <Activity size={18} /> Live Activity
                </h2>
                <span className="text-xs bg-campus-primary text-campus-text px-2 py-1 rounded font-bold">LIVE</span>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse table-fixed">
                  <thead className="bg-campus-bg text-campus-secondary font-bold text-xs uppercase sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 w-[20%]">Time</th>
                      <th className="px-6 py-4 w-[30%]">User</th>
                      <th className="px-6 py-4 w-[30%]">Type</th>
                      <th className="px-6 py-4 w-[20%] text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-campus-border text-sm">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-campus-bg transition-colors">
                        <td className="px-6 py-4 font-mono text-campus-secondary truncate">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-6 py-4 font-bold text-campus-text truncate">
                          {log.user_name || "Unknown"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-tighter ${
                            log.scan_type === 'LIBRARY_SCAN'
                              ? 'bg-blue-100 text-blue-600 border-blue-200'
                              : log.scan_type === 'CANTEEN_PAYMENT'
                                ? 'bg-red-100 text-red-600 border-red-200'
                                : 'bg-green-100 text-green-600 border-green-200'
                          }`}>
                            {log.scan_type.replace('_', ' ')}
                          </span>
                        </td>
                        <td className={`px-6 py-4 text-right font-bold ${
                          log.scan_type === 'CANTEEN_PAYMENT' ? 'text-red-500' : 'text-campus-secondary'
                        }`}>
                          {log.scan_type === 'CANTEEN_PAYMENT' ? `-₹${log.amount}` : '-'}
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
    </div>
  );
};

export default Dashboard;