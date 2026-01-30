import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { UserCheck, Clock, ShieldCheck, TrendingUp } from 'lucide-react';

const Attendance = () => {
    const [logs, setLogs] = useState([]);
    const [scannedId, setScannedId] = useState('');
    const searchInputRef = useRef(null);

    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/nfc/logs');
            setLogs(res.data.filter(log => log.scan_type === 'ATTENDANCE'));
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchLogs(); const i = setInterval(fetchLogs, 2000); return () => clearInterval(i); }, []);

    const handleScan = async (e) => {
        e.preventDefault();
        if(!scannedId) return;
        try {
            await axios.post('http://localhost:5000/api/nfc/scan', { rfid_uid: scannedId, type: 'ATTENDANCE', amount: 0 });
            setScannedId(''); fetchLogs();
        } catch(err) { console.error(err); }
    };

    const uniqueStudents = [...new Set(logs.map(log => log.user_name))].length;

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text transition-colors duration-300" onClick={() => searchInputRef.current.focus()}>
            <Sidebar />
            <div className="ml-64 flex-1 p-8">

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-campus-text">Daily Attendance</h1>
                        <p className="text-campus-secondary">Gate Entry System</p>
                    </div>
                    {/* Stats Card */}
                    <div className="bg-campus-card px-8 py-4 rounded-2xl shadow-sm border border-campus-border flex items-center gap-4 transition-colors">
                        <div className="bg-campus-bg p-3 rounded-full text-campus-text"><TrendingUp size={24} /></div>
                        <div>
                            <p className="text-xs uppercase font-bold text-campus-secondary">Total Present</p>
                            <p className="text-3xl font-bold text-campus-text">{uniqueStudents}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 h-[600px]">

                    {/* SCANNER - FIXED: Changed bg-campus-text to bg-campus-card so it matches the theme */}
                    <div className="w-1/3 flex flex-col">
                        <div className="bg-campus-card rounded-3xl p-8 shadow-xl border border-campus-border flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors">

                            <div className="mb-8 p-6 rounded-full border-4 border-dashed border-campus-border animate-pulse bg-campus-bg">
                                <ShieldCheck size={64} className="text-campus-primary" />
                            </div>

                            {/* Text colors are now automatic (campus-text) instead of hardcoded white */}
                            <h2 className="text-2xl font-bold mb-2 text-campus-text">Scan ID Card</h2>
                            <p className="text-campus-secondary mb-8">Tap card on the reader to mark entry.</p>

                            <form onSubmit={handleScan} className="w-full">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={scannedId}
                                    onChange={e => setScannedId(e.target.value)}
                                    placeholder="Waiting..."
                                    autoFocus
                                    className="w-full bg-campus-bg text-campus-text text-xl py-4 text-center rounded-xl border border-campus-border outline-none focus:border-campus-primary transition placeholder-campus-secondary"
                                />
                            </form>
                        </div>
                    </div>

                    {/* LIST */}
                    <div className="w-2/3 bg-campus-card rounded-3xl shadow-sm border border-campus-border flex flex-col overflow-hidden transition-colors">
                        <div className="p-6 border-b border-campus-border bg-campus-bg/50 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2 text-campus-text"><Clock size={18}/> Real-time Logs</h3>
                            <span className="text-xs font-bold bg-campus-primary text-campus-bg px-3 py-1 rounded-full">Today</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2">
                            <table className="w-full text-left border-collapse">
                                <tbody className="divide-y divide-campus-border">
                                {logs.map(log => (
                                    <tr key={log.id} className="hover:bg-campus-bg transition">
                                        <td className="px-6 py-4 font-mono text-campus-secondary text-sm">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-campus-bg flex items-center justify-center text-xs font-bold text-campus-text border border-campus-border">{log.user_name.charAt(0)}</div>
                                                <span className="font-bold text-campus-text">{log.user_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-lg border border-green-200"><UserCheck size={12}/> Entered</span>
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
    );
};
export default Attendance;