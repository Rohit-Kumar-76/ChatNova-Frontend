"use client";

import { useEffect, useState, useRef } from "react";
import API from "@/lib/api";
import Avatar from "@/components/Avatar";
import { Send, ArrowLeft } from "lucide-react";
import { socket } from "@/lib/socket";
import Link from "next/link";
import Loader from "@/components/Loader";
import { toast } from "sonner";

export default function Chat() {
    const [friends, setFriends] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [typing, setTyping] = useState(false);

    const messagesEndRef = useRef(null);
    const chatRef = useRef(null);

    // =========================
    // ONLINE USERS
    // =========================
    useEffect(() => {
        socket.on("onlineUsers", (users) => {
            setFriends(prev =>
                prev.map(f => ({
                    ...f,
                    isOnline: users.includes(f._id)
                }))
            );
        });

        return () => socket.off("onlineUsers");
    }, []);

    // =========================
    // SEEN MESSAGE
    // =========================
    useEffect(() => {
        if (!selectedUser || messages.length === 0) return;

        socket.emit("seenMessages", {
            senderId: selectedUser._id,
            messageIds: messages.map(m => m._id)
        });

    }, [messages, selectedUser]);

    useEffect(() => {
        socket.on("messagesSeen", (ids) => {

            setMessages(prev =>
                prev.map(m =>
                    ids.includes(m._id)
                        ? { ...m, status: "seen" }
                        : m
                )
            );

        });

        return () => socket.off("messagesSeen");

    }, []);

    // =========================
    // TYPING
    // =========================
    useEffect(() => {

        socket.on("typing", ({ senderId }) => {

            if (senderId === selectedUser?._id) {

                setTyping(true);

                setTimeout(() => {
                    setTyping(false);
                }, 1500);
            }
        });

        return () => socket.off("typing");

    }, [selectedUser]);

    // =========================
    // RECEIVE MESSAGE
    // =========================
    useEffect(() => {

        socket.on("receiveMessage", (msg) => {

            if (msg.sender._id === selectedUser?._id) {

                setMessages(prev => {

                    const exists = prev.some(m => m._id === msg._id);

                    if (exists) return prev;

                    return [...prev, msg];
                });
            }
        });

        return () => socket.off("receiveMessage");

    }, [selectedUser]);

    // =========================
    // JOIN SOCKET
    // =========================
    useEffect(() => {

        if (currentUser) {
            socket.emit("join", currentUser._id);
        }

    }, [currentUser]);

    // =========================
    // GET CURRENT USER
    // =========================
    useEffect(() => {

        const user = JSON.parse(localStorage.getItem("user"));

        setCurrentUser(user);

    }, []);

    // =========================
    // AUTO SCROLL
    // =========================
    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });

    }, [messages]);

    // =========================
    // FETCH FRIENDS
    // =========================
    useEffect(() => {

        const fetchFriends = async () => {

            setLoading(true);

            try {

                const { data } = await API.get("/users/profile");

                setFriends(data.friends);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);
            }
        };

        fetchFriends();

    }, []);

    // =========================
    // LOAD MESSAGES
    // =========================
    const loadMessages = async (user, pageNum = 1) => {

        if (pageNum === 1) {
            setPage(1);
        }

        try {

            const { data } = await API.get(
                `/chat/${user._id}?page=${pageNum}&limit=20`
            );

            if (pageNum === 1) {

                setMessages(data);

            } else {

                setMessages(prev => {

                    const merged = [...data, ...prev];

                    return merged.filter(
                        (item, index, self) =>
                            index === self.findIndex(
                                t => t._id === item._id
                            )
                    );
                });
            }

            setHasMore(data.length > 0);

            setSelectedUser(user);

        } catch (err) {

            console.log(err);
        }
    };

    // =========================
    // LOAD MORE
    // =========================
    const handleScroll = async () => {

        if (
            chatRef.current &&
            chatRef.current.scrollTop === 0 &&
            hasMore &&
            !loadingMore
        ) {

            setLoadingMore(true);

            const nextPage = page + 1;

            setPage(nextPage);

            if (!selectedUser) {
                setLoadingMore(false);
                return;
            }

            await loadMessages(selectedUser, nextPage);

            setLoadingMore(false);
        }
    };

    // =========================
    // FORMAT TIME
    // =========================
    const formatTime = (date) => {

        const d = new Date(date);

        return d.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // =========================
    // FORMAT DAY
    // =========================
    const formatDay = (date) => {

        const d = new Date(date);

        const today = new Date();

        const yesterday = new Date();

        yesterday.setDate(today.getDate() - 1);

        if (d.toDateString() === today.toDateString()) {
            return "Today";
        }

        if (d.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }

        return d.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short"
        });
    };

    // =========================
    // SEND MESSAGE
    // =========================
    const sendMessage = async () => {

        if (!text.trim() || !selectedUser) return;

        const tempId = Date.now().toString();

        const tempMsg = {
            _id: tempId,
            sender: currentUser,
            receiver: selectedUser,
            message: text,
            createdAt: new Date(),
            status: "sending"
        };

        setMessages(prev => [...prev, tempMsg]);

        try {

            const { data } = await API.post("/chat/send", {
                receiverId: selectedUser._id,
                message: text
            });

            setMessages(prev =>
                prev.map(m => (
                    m._id === tempId ? data : m
                ))
            );

            socket.emit("sendMessage", {
                senderId: currentUser._id,
                receiverId: selectedUser._id,
                message: data.message,
                _id: data._id
            });

        } catch (err) {

            setMessages(prev =>
                prev.filter(m => m._id !== tempId)
            );

            toast.error(
                err.response?.data?.message || "Message failed"
            );
        }

        setText("");
    };

    if (!currentUser) return null;

    const canMessage =
        selectedUser &&
        friends.some(
            f => f._id.toString() === selectedUser._id.toString()
        );

    return (
        <div className="h-screen flex relative text-white overflow-hidden">

            {/* LOADER */}
            {loading && <Loader />}

            {/* BACKGROUND */}
            <div className="absolute inset-0 -z-10">
                <img
                    src="/bg.jpg"
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* LEFT SIDEBAR */}
            <div
                className={`${selectedUser
                    ? "hidden md:block"
                    : "block"
                    } 
                w-full md:w-[340px]
                backdrop-blur-xl
                bg-white/10
                border-r border-white/20`}
            >

                <div className="p-4 border-b border-white/10">
                    <h1 className="text-2xl font-bold">
                        Nova Chat
                    </h1>

                    <p className="text-sm text-white/60">
                        Your friends
                    </p>
                </div>

                <div className="space-y-2 p-2 overflow-y-auto h-[calc(100vh-80px)] scrollbar-hide">

                    {friends.map((f) => (

                        <div
                            key={f._id}
                            onClick={() => loadMessages(f)}
                            className={`
                            flex items-center gap-3 p-3 rounded-2xl
                            cursor-pointer transition-all duration-200
                            border border-transparent

                            ${selectedUser?._id === f._id
                                    ? "bg-white/20 border-blue-500"
                                    : "hover:bg-white/10"
                                }
                            `}
                        >

                            <div className="relative">

                                <Avatar src={f.profilePic} />

                                <span
                                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black
                                    ${f.isOnline
                                            ? "bg-green-500"
                                            : "bg-gray-500"
                                        }`}
                                />
                            </div>

                            <div className="flex flex-col overflow-hidden">

                                <span className="font-medium truncate">
                                    {f.username}
                                </span>

                                <span
                                    className={`text-xs
                                    ${f.isOnline
                                            ? "text-green-400"
                                            : "text-white/40"
                                        }`}
                                >
                                    {f.isOnline
                                        ? "Online"
                                        : "Offline"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* EMPTY STATE */}
            {!selectedUser && (
                <div className="hidden md:flex flex-1 items-center justify-center">

                    <div className="text-center">

                        <h2 className="text-4xl font-bold mb-3">
                            Nova Chat
                        </h2>

                        <p className="text-white/60">
                            Select a friend to start chatting
                        </p>
                    </div>
                </div>
            )}

            {/* CHAT AREA */}
            {selectedUser && (

                <div className="flex flex-col flex-1 backdrop-blur-xl bg-white/5">

                    {/* HEADER */}
                    <div className="p-4 border-b border-white/20 flex items-center gap-3 sticky top-0 z-10 backdrop-blur-xl bg-black/20">

                        <button
                            onClick={() => setSelectedUser(null)}
                            className="md:hidden"
                        >
                            <ArrowLeft />
                        </button>

                        <Link
                            href={`/profile/${selectedUser.username}`}
                        >
                            <Avatar src={selectedUser.profilePic} />
                        </Link>

                        <div>

                            <h2 className="font-semibold">
                                {selectedUser.username}
                            </h2>

                            <p
                                className={`text-xs
                                ${selectedUser.isOnline
                                        ? "text-green-400"
                                        : "text-white/40"
                                    }`}
                            >
                                {selectedUser.isOnline
                                    ? "Online"
                                    : "Offline"}
                            </p>
                        </div>
                    </div>

                    {/* MESSAGES */}
                    <div
                        ref={chatRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide"
                    >

                        {loadingMore && (
                            <p className="text-center text-sm text-white/50">
                                Loading messages...
                            </p>
                        )}

                        {messages.map((m, i) => {

                            const isMe =
                                m.sender?._id === currentUser?._id;

                            const showDate =
                                i === 0 ||
                                new Date(
                                    messages[i - 1].createdAt
                                ).toDateString() !==
                                new Date(
                                    m.createdAt
                                ).toDateString();

                            return (

                                <div key={`${m._id}-${i}`}>

                                    {/* DATE */}
                                    {showDate && (
                                        <div className="text-center my-4">

                                            <span className="bg-white/10 text-white/70 text-xs px-4 py-1 rounded-full">
                                                {formatDay(m.createdAt)}
                                            </span>
                                        </div>
                                    )}

                                    {/* MESSAGE */}
                                    <div
                                        className={`flex
                                        ${isMe
                                                ? "justify-end"
                                                : "justify-start"
                                            }`}
                                    >

                                        <div className="flex items-end gap-2 max-w-[75%] md:max-w-[60%]">

                                            {!isMe && (
                                                <Avatar
                                                    src={m.sender?.profilePic}
                                                    size={28}
                                                />
                                            )}

                                            <div
                                                className={`
                                                px-4 py-2 rounded-2xl shadow-lg break-words

                                                ${isMe
                                                        ? "bg-blue-500 text-white rounded-br-none"
                                                        : "bg-white/90 text-black rounded-bl-none"
                                                    }
                                                `}
                                            >

                                                <p className="text-sm leading-relaxed">
                                                    {m.message}
                                                </p>

                                                <div className="flex items-center justify-end gap-1 mt-1">

                                                    <span className="text-[10px] opacity-70">
                                                        {formatTime(m.createdAt)}
                                                    </span>

                                                    {isMe && (
                                                        <span className="text-[10px] opacity-70">

                                                            {m.status === "seen"
                                                                ? "Seen"
                                                                : m.status === "delivered"
                                                                    ? "Delivered"
                                                                    : "Sending"}

                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* TYPING */}
                        {typing && (
                            <div className="text-sm text-white/60 px-2">
                                {selectedUser.username} is typing...
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* INPUT */}
                    <div className="p-3 border-t border-white/20 flex gap-2 backdrop-blur-xl bg-black/20">

                        <input
                            value={text}
                            disabled={!canMessage}
                            placeholder={
                                canMessage
                                    ? "Type a message..."
                                    : "You are blocked or not friends"
                            }

                            onChange={(e) => {

                                setText(e.target.value);

                                socket.emit("typing", {
                                    senderId: currentUser._id,
                                    receiverId: selectedUser._id
                                });
                            }}

                            onKeyDown={(e) => {

                                if (
                                    e.key === "Enter" &&
                                    !e.shiftKey
                                ) {

                                    e.preventDefault();

                                    sendMessage();
                                }
                            }}

                            className="
                            flex-1 px-4 py-3 rounded-full
                            bg-white/10 border border-white/20
                            placeholder-white/50
                            outline-none
                            focus:ring-2 focus:ring-blue-500
                            "
                        />

                        <button
                            disabled={!text.trim()}
                            onClick={sendMessage}
                            className={`
                            p-3 rounded-full transition-all

                            ${text.trim()
                                    ? "bg-blue-500 hover:bg-blue-600"
                                    : "bg-gray-500 cursor-not-allowed"
                                }
                            `}
                        >

                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}