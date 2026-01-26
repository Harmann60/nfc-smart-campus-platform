import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { BookOpen, RotateCcw, AlertCircle, Save, Search, CheckCircle, XCircle } from 'lucide-react';

const Library = () => {
    const [logs, setLogs] = useState([]);
    const [rfid, setRfid] = useState('');
    const [bookTitle, setBookTitle] = useState('');
    const [mode, setMode] = useState('ISSUE'); // ISSUE | RETURN | FINE
    const rfidInputRef = useRef(null);

    // Fetch only Library related logs
    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/nfc/logs');
            // Filter strictly for Library events
            setLogs(res.data.filter(log => log.scan_type === 'LIBRARY'));
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchLogs(); const i = setInterval(fetchLogs, 2000); return () => clearInterval(i); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!rfid) return alert("Please scan a Student ID");

        // If issuing, a book name is required
        if (mode === 'ISSUE' && !bookTitle) return alert("Please enter a Book Name");

        try {
            await axios.post('http://localhost:5000/api/nfc/scan', {
                rfid_uid: rfid,
                type: 'LIBRARY',
                amount: mode === 'FINE' ? 50 : 0
                // Note: In a real app, we would send 'bookTitle' to backend here too
            });

            alert(mode === 'ISSUE' ? `Issued "${bookTitle}" successfully!` : `${mode} Successful!`);

            // Reset Form
            setRfid('');
            setBookTitle('');
            fetchLogs();

            // Refocus for next scan
            rfidInputRef.current?.focus();
        } catch(err) { alert('Transaction Failed'); }
    };

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text">
            <Sidebar />
            <div className="ml-64 flex-1 p-8 h-screen flex flex-col">

                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-campus-text">Library Desk</h1>
                    <p className="text-gray-400 text-sm">Book Circulation & Management</p>
                </header>

                <div className="grid grid-cols-12 gap-8 h-full">

                    {/* LEFT: Transaction Form (No longer looks like attendance) */}
                    <div className="col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-campus-secondary flex flex-col h-fit">

                        {/* 1. Mode Selection Tabs */}
                        <div className="flex bg-campus-bg p-1 rounded-xl mb-8">
                            <button onClick={() => setMode('ISSUE')} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${mode === 'ISSUE' ? 'bg-white shadow-sm text-campus-text' : 'text-gray-400'}`}>
                                Issue Book
                            </button>
                            <button onClick={() => setMode('RETURN')} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${mode === 'RETURN' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}>
                                Return Book
                            </button>
                            <button onClick={() => setMode('FINE')} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${mode === 'FINE' ? 'bg-white shadow-sm text-red-500' : 'text-gray-400'}`}>
                                Collect Fine
                            </button>
                        </div>

                        {/* 2. The Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Book Title Input (Only for Issue mode) */}
                            {mode === 'ISSUE' && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Book Title / ISBN</label>
                                    <div className="relative">
                                        <BookOpen className="absolute left-4 top-3.5 text-gray-400" size={20}/>
                                        <input
                                            type="text"
                                            value={bookTitle}
                                            onChange={e => setBookTitle(e.target.value)}
                                            placeholder="Enter Book Name..."
                                            className="w-full pl-12 pr-4 py-3 bg-campus-bg rounded-xl border-2 border-transparent focus:border-campus-primary outline-none transition font-medium"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Student ID Scan Field */}
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Student ID Card</label>
                                <div className="relative">
                                    <Search className="absolute left-4 top-3.5 text-gray-400" size={20}/>
                                    <input
                                        ref={rfidInputRef}
                                        type="text"
                                        value={rfid}
                                        onChange={e => setRfid(e.target.value)}
                                        placeholder="Scan Card Here..."
                                        autoFocus
                                        className="w-full pl-12 pr-4 py-3 bg-campus-bg rounded-xl border-2 border-transparent focus:border-campus-text outline-none transition font-mono"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Reader Active
                                </p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95
                        ${mode === 'ISSUE' ? 'bg-campus-text hover:bg-gray-700' :
                                    mode === 'RETURN' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-red-500 hover:bg-red-600'}`}
                            >
                                {mode === 'ISSUE' && <><Save size={20}/> Confirm Issue</>}
                                {mode === 'RETURN' && <><RotateCcw size={20}/> Confirm Return</>}
                                {mode === 'FINE' && <><AlertCircle size={20}/> Charge ₹50 Fine</>}
                            </button>

                        </form>
                    </div>

                    {/* RIGHT: Circulation Log (Table) */}
                    <div className="col-span-5 bg-white rounded-3xl shadow-sm border border-campus-secondary flex flex-col overflow-hidden h-fit max-h-[600px]">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider">Circulation History</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {logs.length === 0 ? (
                                <div className="text-center text-gray-300 py-10">No records found</div>
                            ) : (
                                logs.map(log => (
                                    <div key={log.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-campus-bg transition">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${log.amount > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                                                {log.amount > 0 ? <XCircle size={18}/> : <CheckCircle size={18}/>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-campus-text">{log.user_name}</p>
                                                <p className="text-xs text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {log.amount > 0 ? (
                                                <span className="text-red-500 font-bold text-xs">-₹{log.amount}</span>
                                            ) : (
                                                <span className="text-gray-400 font-bold text-xs">ISSUED</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Library;