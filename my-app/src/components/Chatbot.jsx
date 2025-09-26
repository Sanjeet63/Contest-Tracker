import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "");

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const { userId } = useAuth();

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');

        try {
            const response = await axios.post(`${API_BASE}/api/chatbot`, {
                query: input,
                userId,
            });
            const botMessage = { role: 'bot', content: response.data.reply };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { role: 'bot', content: 'Sorry, something went wrong.' };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition z-50"
            >
                💬
            </button>

            {/* Chat Modal */}
            {isOpen && (
                <div className="fixed bottom-16 right-4 w-80 h-96 bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl border border-white/10 flex flex-col z-50">
                    <div className="flex justify-between items-center p-4 border-b border-white/10">
                        <h3 className="font-semibold text-pink-400">Contest & AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)} className="text-gray-300">✕</button>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                <div className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-pink-500 text-white' : 'bg-[#1f2937] text-gray-300'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-white/10 flex">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                            className="flex-1 bg-[#1f2937] text-white border border-gray-600 rounded-l px-2 py-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="Ask about contests or submit your AI project link..."
                        />
                        <button onClick={sendMessage} className="bg-pink-500 text-white px-4 py-1 rounded-r hover:bg-pink-600">
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;