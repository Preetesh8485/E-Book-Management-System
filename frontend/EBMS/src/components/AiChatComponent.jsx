import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { chatWithAI, resetAiSlice } from "../store/slices/aiSlice";

const AIChatComponent = () => {
    const dispatch = useDispatch();
    
    // Extracting data exactly from your store's ai slice
    const { loading, error, reply, profile } = useSelector((state) => state.ai);

    const [message, setMessage] = useState("");
    const [conversation, setConversation] = useState([]);
    const chatEndRef = useRef(null);

    // Automatically scrolls the window container to the latest message
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [conversation, loading]);

    // Monitors the Redux store for new replies and injects them into the UI history
    useEffect(() => {
        if (reply) {
            setConversation((prev) => [...prev, { role: "assistant", text: reply }]);
        }
    }, [reply]);

    // Wipes error and message states from Redux when leaving the component
    useEffect(() => {
        return () => {
            dispatch(resetAiSlice());
        };
    }, [dispatch]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim() || loading) return;

        const userMessage = message.trim();
        
        // Push user message directly into local history array for real-time update
        setConversation((prev) => [...prev, { role: "user", text: userMessage }]);
        
        // Trigger Redux Async Thunk action
        dispatch(chatWithAI(userMessage));
        setMessage("");
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto border border-gray-200 rounded-lg bg-white shadow-sm">
            {/* Header / Meta Status */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">AI Library Assistant</h2>
                    <p className="text-xs text-gray-500">Ask for recommendations, summaries, or general research support</p>
                </div>
                {profile?.emotion && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-medium capitalize">
                        Mood: {profile.emotion}
                    </span>
                )}
            </div>

            {/* Main Chat Display Window */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50">
                {conversation.length === 0 && (
                    <div className="text-center text-gray-400 mt-20 text-sm">
                        No messages yet. Try asking: "Can you recommend a beginner book on JavaScript?"
                    </div>
                )}

                {conversation.map((chat, index) => (
                    <div
                        key={index}
                        className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-wrap leading-relaxed ${
                                chat.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                            }`}
                        >
                            {chat.text}
                        </div>
                    </div>
                ))}

                {/* Simulated Streaming Loader Bubble */}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-400 border border-gray-200 rounded-lg rounded-bl-none p-3 text-sm shadow-sm flex items-center space-x-1">
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce delay-100">.</span>
                            <span className="animate-bounce delay-200">.</span>
                        </div>
                    </div>
                )}

                {/* Error Banner Injection */}
                {error && (
                    <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-md text-center">
                        Error: {error}
                    </div>
                )}
                
                <div ref={chatEndRef} />
            </div>

            {/* Input Submission Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 bg-white rounded-b-lg flex space-x-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    disabled={loading}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                />
                <button
                    type="submit"
                    disabled={loading || !message.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default AIChatComponent;