import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Book, Clock, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';

const Library = () => {
    const [activeStudent, setActiveStudent] = useState(null);
    const [status, setStatus] = useState('idle');
    const [message, setMessage] = useState('Scan Student ID');
    const [scannedId, setScannedId] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [logs, setLogs] = useState([]);
    const searchInputRef = useRef(null);

    // Fetch library-specific logs
    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/library/logs');
            setLogs(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchLogs();
        const i = setInterval(fetchLogs, 5000);
        return () => clearInterval(i);
    }, []);

    const handleScan = async (e) => {
        e.preventDefault();
        const inputUid = scannedId;
        setScannedId(''); // Clear immediately for next scan

        try {
            if (!activeStudent) {
                // STEP 1: Identify Student
                setStatus('loading');
                const res = await axios.post('http://localhost:5000/api/nfc/identify', { rfid_uid: inputUid });
                setActiveStudent(res.data);
                setMessage("Student Found! Now Scan Book.");
                setStatus('idle');
            } else {
                // STEP 2: Issue/Return Book
                setStatus('loading');
                const res = await axios.post('http://localhost:5000/api/library/scan', {
                    rfid_uid: inputUid,
                    user_uid: activeStudent.rfid_uid
                });
                setMessage(res.data.message);
                setStatus('success');
                fetchLogs();

                setTimeout(() => {
                    setActiveStudent(null);
                    setMessage('Scan Student ID');
                    setStatus('idle');
                }, 3000);
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "Error occurred");
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text transition-colors duration-300" onClick={() => searchInputRef.current.focus()}>
            <Sidebar />

            <div className="ml-64 flex-1 p-8">

                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-campus-text">Library Desk</h1>
                        <p className="text-campus-secondary">Dual-Scan Issue & Return System</p>
                    </div>
                    {/* Stat Box */}
                    <div className="bg-campus-card px-8 py-4 rounded-2xl shadow-sm border border-campus-border flex items-center gap-4 transition-colors">
                        <div className="bg-campus-bg p-3 rounded-full text-campus-text"><TrendingUp size={24} /></div>
                        <div>
                            <p className="text-xs uppercase font-bold text-campus-secondary">Active Sessions</p>
                            <p className="text-3xl font-bold text-campus-text">{activeStudent ? '1' : '0'}</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-8 h-[600px]">

                    {/* 1/3 COLUMN: SCANNER (FIXED VISIBILITY) */}
                    <div className="w-1/3 flex flex-col">
                        <div className="bg-campus-card rounded-3xl p-8 shadow-xl border border-campus-border flex-1 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors">

                            {/* Icon Circle */}
                            <div className="mb-8 p-6 rounded-full border-4 border-dashed border-campus-border bg-campus-bg animate-pulse">
                                {activeStudent ?
                                    <Book size={64} className="text-campus-primary" /> :
                                    <ShieldCheck size={64} className="text-campus-primary" />
                                }
                            </div>

                            {/* Text - Now uses campus-text so it adapts to dark/light mode automatically */}
                            <h2 className="text-2xl font-bold mb-2 text-campus-text">
                                {activeStudent ? "Scan Book ID" : "Scan Student ID"}
                            </h2>
                            <p className="text-campus-secondary mb-4">{message}</p>

                            {/* Active Student Badge */}
                            {activeStudent && (
                                <div className="flex items-center gap-2 mb-6 bg-campus-bg px-4 py-2 rounded-lg border border-campus-primary/30 shadow-sm">
                                    <span className="font-bold text-campus-text text-sm">{activeStudent.name}</span>
                                    <ArrowRight size={14} className="text-campus-primary" />
                                    <span className="text-xs text-campus-secondary">Student Loaded</span>
                                </div>
                            )}

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

                            {activeStudent && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveStudent(null); setMessage('Scan Student ID'); }}
                                    className="mt-6 text-red-400 text-xs hover:text-red-500 font-bold hover:underline transition-colors"
                                >
                                    Cancel Transaction
                                </button>
                            )}
                        </div>
                    </div>

                    {/* 2/3 COLUMN: FINE POLICY */}
                    <div className="w-2/3 bg-campus-card rounded-3xl shadow-sm border border-campus-border flex flex-col overflow-hidden transition-colors">
                        <div className="p-6 border-b border-campus-border bg-campus-bg/50 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2 text-campus-text"><Clock size={18}/> Fine Policy & Rules</h3>
                            <span className="text-xs font-bold bg-campus-primary text-campus-bg px-3 py-1 rounded-full">Active</span>
                        </div>

                        <div className="flex-1 p-8 space-y-6">
                            {/* Green Card - Text colors are hardcoded to dark green so they are readable even in dark mode */}
                            <div className="flex justify-between items-center p-6 bg-green-100 rounded-2xl border border-green-200">
                                <div>
                                    <p className="font-bold text-green-800">Standard Period</p>
                                    <p className="text-sm text-green-700 font-medium">No charges apply for early returns</p>
                                </div>
                                <span className="text-2xl font-black text-green-800">7 Days</span>
                            </div>

                            {/* Yellow Card */}
                            <div className="flex justify-between items-center p-6 bg-yellow-100 rounded-2xl border border-yellow-200">
                                <div>
                                    <p className="font-bold text-yellow-800">Late Return</p>
                                    <p className="text-sm text-yellow-700 font-medium">Applied from day 8 to 15</p>
                                </div>
                                <span className="text-2xl font-black text-yellow-800">₹5 / day</span>
                            </div>

                            {/* Red Card */}
                            <div className="flex justify-between items-center p-6 bg-red-100 rounded-2xl border border-red-200">
                                <div>
                                    <p className="font-bold text-red-800">Severe Overdue</p>
                                    <p className="text-sm text-red-700 font-medium">Flat rate + daily charge after 15 days</p>
                                </div>
                                <span className="text-2xl font-black text-red-800">₹10 / day</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Library;