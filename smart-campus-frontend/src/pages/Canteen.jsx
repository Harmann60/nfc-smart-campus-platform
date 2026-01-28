import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { ShoppingBag, Coffee, Utensils, Sandwich, Pizza, Trash2, CreditCard, Plus } from 'lucide-react';

const Canteen = () => {
    // Menu with Icons
    const [menu, setMenu] = useState(() => {
        const saved = localStorage.getItem('canteenMenu');
        return saved ? JSON.parse(saved) : [
            { id: 1, name: 'Masala Chai', price: 15, icon: 'coffee' },
            { id: 2, name: 'Veg Burger', price: 60, icon: 'burger' },
            { id: 3, name: 'Grilled Sandwich', price: 50, icon: 'sandwich' },
            { id: 4, name: 'Farm Pizza', price: 120, icon: 'pizza' },
        ];
    });

    const [cart, setCart] = useState([]);
    const [scannedId, setScannedId] = useState('');
    const [newItem, setNewItem] = useState({ name: '', price: '', icon: 'coffee' });
    const searchInputRef = useRef(null);

    useEffect(() => { localStorage.setItem('canteenMenu', JSON.stringify(menu)); }, [menu]);

    const addToCart = (item) => setCart([...cart, item]);
    const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

    // Helper to get icons with dynamic sizing
    const getIcon = (type, size = 32) => {
        const className = "text-campus-text"; // Ensure icons adapt to theme text color
        if (type === 'coffee') return <Coffee size={size} className={className} />;
        if (type === 'burger') return <Utensils size={size} className={className} />;
        if (type === 'sandwich') return <Sandwich size={size} className={className} />;
        if (type === 'pizza') return <Pizza size={size} className={className} />;
        return <Utensils size={size} className={className} />;
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!scannedId || cart.length === 0) return;
        try {
            await axios.post('http://localhost:5000/api/nfc/scan', {
                rfid_uid: scannedId,
                type: 'CANTEEN_PAYMENT',
                amount: totalAmount
            });
            alert(`Payment Successful!`);
            setCart([]);
            setScannedId('');
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Transaction Failed';
            alert(msg);
        }
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) return;
        setMenu([...menu, { ...newItem, id: Date.now(), price: parseInt(newItem.price) }]);
        setNewItem({ name: '', price: '', icon: 'coffee' });
    };

    // Standardized Input Style using Theme Variables
    const inputClass = "w-full p-3 rounded-xl border border-campus-border bg-campus-bg text-campus-text outline-none focus:border-campus-primary transition-all placeholder-campus-secondary";

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text transition-colors duration-300">
            <Sidebar />
            <div className="ml-64 flex-1 p-8">

                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold text-campus-text">Smart Canteen</h1>
                    <p className="text-campus-secondary">Point of Sale System</p>
                </header>

                <div className="grid grid-cols-12 gap-8">

                    {/* LEFT: Menu (8 Cols) */}
                    <div className="col-span-8 space-y-6">
                        <div className="grid grid-cols-3 gap-5">
                            {menu.map((item) => (
                                <div key={item.id} onClick={() => addToCart(item)}
                                    // CHANGED: bg-white -> bg-campus-card
                                     className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border hover:border-campus-primary hover:shadow-md cursor-pointer transition flex flex-col items-center justify-center gap-3 group">
                                    <div className="bg-campus-bg p-4 rounded-full group-hover:bg-campus-primary/20 transition-colors">
                                        {getIcon(item.icon)}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-lg text-campus-text">{item.name}</h3>
                                        <p className="text-campus-secondary font-bold opacity-70">₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Item Form */}
                        {/* CHANGED: bg-white -> bg-campus-card */}
                        <div className="bg-campus-card p-6 rounded-2xl shadow-sm border border-campus-border">
                            <h3 className="font-bold mb-4 flex items-center gap-2 text-campus-text">
                                <Plus size={20} className="text-campus-primary"/> Add New Menu Item
                            </h3>
                            <form onSubmit={handleAddItem} className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Item Name"
                                    className={inputClass}
                                    value={newItem.name}
                                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    className={`${inputClass} w-32`}
                                    value={newItem.price}
                                    onChange={e => setNewItem({...newItem, price: e.target.value})}
                                />
                                <select
                                    className={`${inputClass} w-40 cursor-pointer`}
                                    value={newItem.icon}
                                    onChange={e => setNewItem({...newItem, icon: e.target.value})}
                                >
                                    <option value="coffee">Drink</option>
                                    <option value="burger">Burger</option>
                                    <option value="sandwich">Sandwich</option>
                                    <option value="pizza">Pizza</option>
                                </select>
                                <button className="bg-campus-primary text-campus-bg px-6 rounded-xl font-bold hover:opacity-90 transition-opacity">
                                    Add
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: Cart (4 Cols) */}
                    <div className="col-span-4">
                        {/* CHANGED: bg-white -> bg-campus-card */}
                        <div className="bg-campus-card rounded-2xl shadow-lg border border-campus-border h-[600px] flex flex-col sticky top-8">

                            {/* Header: Used bg-campus-primary (Accent) so it stands out in both themes */}
                            <div className="bg-campus-primary p-5 text-campus-bg rounded-t-2xl">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <ShoppingBag size={20} className="text-campus-bg"/> Current Order
                                </h2>
                            </div>

                            <div className="flex-1 p-5 overflow-y-auto space-y-3">
                                {cart.length === 0 ? (
                                    <div className="text-center text-campus-secondary mt-20">Select items to add to order</div>
                                ) : (
                                    cart.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-campus-bg p-3 rounded-xl border border-campus-border">
                                            <div className="flex items-center gap-3">
                                                {/* CHANGED: bg-white -> bg-campus-card to avoid stark white blocks */}
                                                <div className="p-2 bg-campus-card rounded-full">
                                                    {getIcon(item.icon, 16)}
                                                </div>
                                                <span className="font-medium text-campus-text">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-campus-text">₹{item.price}</span>
                                                <button onClick={() => removeFromCart(index)} className="text-red-400 hover:text-red-600">
                                                    <Trash2 size={16}/>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Payment Section */}
                            <div className="bg-campus-bg/50 p-6 border-t border-campus-border rounded-b-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-campus-secondary font-bold uppercase">Total</span>
                                    <span className="text-3xl font-bold text-campus-text">₹{totalAmount}</span>
                                </div>

                                <form onSubmit={handlePayment}>
                                    <div className="relative">
                                        <input
                                            ref={searchInputRef}
                                            type="text"
                                            value={scannedId}
                                            onChange={(e) => setScannedId(e.target.value)}
                                            placeholder="Tap Card to Pay..."
                                            autoFocus
                                            // CHANGED: Fixed input colors so they aren't invisible in London mode
                                            className="w-full bg-campus-card text-campus-text border-2 border-campus-primary py-4 text-center rounded-xl font-bold outline-none placeholder-campus-secondary transition-all"
                                        />
                                        <CreditCard className="absolute right-4 top-4 text-campus-secondary opacity-50" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Canteen;