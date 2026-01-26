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

    // Get unique students count
    const uniqueStudents = [...new Set(logs.map(log => log.user_name))].length;

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text" onClick={() => searchInputRef.current.focus()}>
            <Sidebar />
            <div className="ml-64 flex-1 p-8">

                {/* TOP STATS ROW */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-campus-text">Daily Attendance</h1>
                        <p className="text-gray-400">Gate Entry System</p>
                    </div>
                    <div className="bg-white px-8 py-4 rounded-2xl shadow-sm border border-campus-secondary flex items-center gap-4">
                        <div className="bg-campus-secondary p-3 rounded-full text-campus-text">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-xs uppercase font-bold text-gray-400">Total Present</p>
                            <p className="text-3xl font-bold text-campus-text">{uniqueStudents}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 h-[600px]">

                    {/* LEFT: VISUAL SCANNER (Dark Mode Aesthetics for Contrast) */}
                    <div className="w-1/3 flex flex-col">
                        <div className="bg-campus-text rounded-3xl p-8 shadow-2xl text-white flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            {/* Background Effect */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-campus-primary"></div>

                            <div className="mb-8 p-6 rounded-full border-4 border-dashed border-campus-secondary/30 animate-pulse">
                                <ShieldCheck size={64} className="text-campus-primary" />
                            </div>

                            <h2 className="text-2xl font-bold mb-2">Scan ID Card</h2>
                            <p className="text-campus-secondary opacity-70 mb-8">Tap card on the reader to mark entry.</p>

                            <form onSubmit={handleScan} className="w-full">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={scannedId}
                                    onChange={e => setScannedId(e.target.value)}
                                    placeholder="Waiting..."
                                    autoFocus
                                    className="w-full bg-white/10 text-white text-xl py-4 text-center rounded-xl border border-white/20 outline-none focus:border-campus-primary transition"
                                />
                            </form>

                            <div className="mt-8 text-xs text-white/40 uppercase tracking-widest font-bold">
                                Secure Gate Access
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: LIST VIEW (Clean Table) */}
                    <div className="w-2/3 bg-white rounded-3xl shadow-sm border border-campus-secondary flex flex-col overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2"><Clock size={18}/> Real-time Logs</h3>
                            <span className="text-xs font-bold bg-campus-primary text-campus-text px-3 py-1 rounded-full">Today</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2">
                            {logs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                                    <Clock size={48} className="mb-4 opacity-20"/>
                                    <p>No entries yet today</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <tbody className="divide-y divide-gray-100">
                                    {logs.map(log => (
                                        <tr key={log.id} className="hover:bg-campus-bg transition group">
                                            <td className="px-6 py-4 font-mono text-gray-400 text-sm">
                                                {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-campus-secondary flex items-center justify-center text-xs font-bold text-campus-text">
                                                        {log.user_name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-campus-text">{log.user_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                                                <UserCheck size={12}/> Entered
                                            </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
export default Attendance;