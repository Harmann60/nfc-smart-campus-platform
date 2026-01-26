import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Search, ShoppingBag, Coffee, Utensils, Sandwich, Pizza, Trash2, CreditCard } from 'lucide-react';

const Canteen = () => {
    // Menu with Icons instead of Emojis
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

    const getIcon = (type) => {
        if (type === 'coffee') return <Coffee size={32} className="text-campus-text" />;
        if (type === 'burger') return <Utensils size={32} className="text-campus-text" />;
        if (type === 'sandwich') return <Sandwich size={32} className="text-campus-text" />;
        if (type === 'pizza') return <Pizza size={32} className="text-campus-text" />;
        return <Utensils size={32} />;
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
    const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Transaction Failed';

    alert(msg);
}

    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.price) return;
        setMenu([...menu, { ...newItem, id: Date.now(), price: parseInt(newItem.price) }]);
        setNewItem({ name: '', price: '', icon: 'coffee' });
    };

    return (
        <div className="flex bg-campus-bg min-h-screen font-sans text-campus-text">
            <Sidebar />
            <div className="ml-64 flex-1 p-8">

                <header className="mb-8">
                    <h1 className="text-3xl font-extrabold">Smart Canteen</h1>
                    <p className="text-gray-400">Point of Sale System</p>
                </header>

                <div className="grid grid-cols-12 gap-8">

                    {/* LEFT: Menu (8 Cols) */}
                    <div className="col-span-8 space-y-6">
                        <div className="grid grid-cols-3 gap-5">
                            {menu.map((item) => (
                                <div key={item.id} onClick={() => addToCart(item)}
                                     className="bg-white p-6 rounded-2xl shadow-sm border border-campus-secondary hover:border-campus-primary hover:shadow-md cursor-pointer transition flex flex-col items-center justify-center gap-3">
                                    <div className="bg-campus-bg p-4 rounded-full">
                                        {getIcon(item.icon)}
                                    </div>
                                    <div className="text-center">
                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                        <p className="text-campus-text font-bold opacity-70">₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Add Item Form */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-campus-secondary">
                            <h3 className="font-bold mb-4 flex items-center gap-2"><Utensils size={18}/> Add New Menu Item</h3>
                            <form onSubmit={handleAddItem} className="flex gap-4">
                                <input type="text" placeholder="Item Name" className="input-field" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
                                <input type="number" placeholder="Price" className="input-field w-32" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
                                <select className="input-field w-40 bg-white" value={newItem.icon} onChange={e => setNewItem({...newItem, icon: e.target.value})}>
                                    <option value="coffee">Drink</option>
                                    <option value="burger">Burger</option>
                                    <option value="sandwich">Sandwich</option>
                                    <option value="pizza">Pizza</option>
                                    <option value="vadapav">Vada Pav</option>
                                </select>
                                <button className="bg-campus-text text-white px-6 rounded-xl font-bold hover:opacity-90">Add</button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: Cart (4 Cols) */}
                    <div className="col-span-4">
                        <div className="bg-white rounded-2xl shadow-lg border border-campus-secondary h-[600px] flex flex-col">
                            <div className="bg-campus-text p-5 text-white rounded-t-2xl">
                                <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingBag size={20}/> Current Order</h2>
                            </div>

                            <div className="flex-1 p-5 overflow-y-auto space-y-3">
                                {cart.length === 0 ? (
                                    <div className="text-center text-gray-300 mt-20">Select items to add to order</div>
                                ) : (
                                    cart.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center bg-campus-bg p-3 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-full text-campus-text">{getIcon(item.icon)}</div>
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold">₹{item.price}</span>
                                                <button onClick={() => removeFromCart(index)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="bg-gray-50 p-6 border-t border-gray-100 rounded-b-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-400 font-bold uppercase">Total</span>
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
                                            className="w-full bg-campus-text text-white py-4 text-center rounded-xl font-bold outline-none placeholder-gray-400"
                                        />
                                        <CreditCard className="absolute right-4 top-4 text-gray-400 opacity-50" />
                                    </div>
                                    
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.input-field { padding: 10px; border-radius: 10px; border: 2px solid #F6F6F6; outline: none; }`}</style>
        </div>
    );
};
export default Canteen;