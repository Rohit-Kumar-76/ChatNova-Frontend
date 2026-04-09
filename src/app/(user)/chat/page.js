"use client";

import { useEffect, useState, useRef } from "react";
import API from "@/lib/api";
import Avatar from "@/components/Avatar";
import { Send, ArrowLeft } from "lucide-react";

export default function Chat() {
    const [friends, setFriends] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    const messagesEndRef = useRef(null);

    // ✅ FIX: localStorage safe
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setCurrentUser(user);
    }, []);

    // ⏰ time format
    const formatTime = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // fetch friends
    useEffect(() => {
        const fetchFriends = async () => {
            const { data } = await API.get("/users/profile");
            setFriends(data.friends);
        };
        fetchFriends();
    }, []);

    // scroll bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // load messages
    const loadMessages = async (user) => {
        const { data } = await API.get(`/chat/${user._id}`);
        setMessages(data);
        setSelectedUser(user);
    };

    // send message
    const sendMessage = async () => {
        if (!text.trim()) return;

        //const receiver = await User.findById(receiverId);

        // if (receiver.blockedUsers.includes(req.user._id)) {
        //     return res.status(403).json({ message: "You are blocked" });
        // }

        await API.post("/chat/send", {
            receiverId: selectedUser._id,
            message: text,
        });

        setText("");
        loadMessages(selectedUser);
    };

    // 🔥 important guard
    if (!currentUser) return null;

    return (
        <div className="h-full  flex relative text-white overflow-hidden">

            {/* 🌄 Background */}
            <div className="absolute inset-0 -z-10">
                <img src="/bg.jpg" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* LEFT - FRIEND LIST */}
            <div className={`${selectedUser ? "hidden md:block" : "block"}  w-full md:w-1/3 backdrop-blur-xl bg-white/10 border-r border-white/20`}>

                <h2 className="p-4 font-bold text-lg">💬 Chats</h2>

                <div className="space-y-2 px-2">
                    {friends.map((f) => (
                        <div
                            key={f._id}
                            onClick={() => loadMessages(f)}
                            className="flex items-center gap-3 p-3 border-2 border-gray-900 rounded-xl cursor-pointer hover:bg-white/20 transition"
                        >
                            <Avatar src={f.profilePic} />

                            <div className="flex flex-col">
                                <span className="font-medium">{f.username}</span>

                                <span className={`text-xs ${f.isOnline ? "text-green-500" : "text-gray-400"
                                    }`}>
                                    {f.isOnline ? "● Online" : "Offline"}
                                </span>
                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE */}
            {selectedUser && (
                <div className="flex flex-col flex-1 backdrop-blur-xl bg-white/5">

                    {/* HEADER */}
                    <div className="p-4 border-b border-white/20 flex items-center gap-3 sticky top-0 z-10">

                        <button
                            onClick={() => setSelectedUser(null)}
                            className="md:hidden"
                        >
                            <ArrowLeft />
                        </button>

                        <Avatar src={selectedUser.profilePic} />

                        <div>
                            <span className="font-bold">{selectedUser.username}</span>

                            <p className={`text-xs ${selectedUser.isOnline ? "text-green-500" : "text-gray-400"
                                }`}>
                                {selectedUser.isOnline ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>

                    {/* MESSAGES */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">

                        {messages.map((m) => {
                            const isMe = m.sender._id === currentUser?._id;

                            return (
                                <div
                                    key={m._id}
                                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div className="flex items-end gap-2 max-w-xs">

                                        {!isMe && (
                                            <Avatar src={m.sender?.profilePic} size={26} />


                                        )}

                                        <div
                                            className={`px-4 py-2 rounded-2xl shadow 
                      ${isMe
                                                    ? "bg-blue-500 text-white rounded-br-none"
                                                    : "bg-white/90 text-black rounded-bl-none"
                                                }`}
                                        >
                                            <p>{m.message}</p>

                                            <span className="text-[10px] opacity-70 block text-right">
                                                {formatTime(m.createdAt)}
                                            </span>
                                        </div>

                                        {isMe && (
                                            <Avatar src={m.sender?.profilePic} size={26} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* INPUT */}
                    <div className="p-3 border-t border-white/20 flex gap-2 sticky bottom-0 backdrop-blur-xl bg-white/10">

                        <input
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 px-4 py-2 rounded-full 
              bg-white/20 border border-white/30 
              placeholder-white/60 outline-none"
                        />

                        <button
                            onClick={sendMessage}
                            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
