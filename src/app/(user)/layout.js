"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Home,
    MessageCircle,
    User,
    LogOut,
    Bell,
    Users,
} from "lucide-react";
import API from "@/lib/api";

export default function UserLayout({ children }) {
    const router = useRouter();

    const [user, setUser] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showNoti, setShowNoti] = useState(false);
    const [visibleCount, setVisibleCount] = useState(15);

    // ✅ Load user
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser) router.push("/login");
        else setUser(storedUser);
    }, []);

    // 🔔 Load notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            const { data } = await API.get("/notifications");
            setNotifications(data);
        };
        fetchNotifications();
    }, []);

    const unread = notifications.filter((n) => !n.isRead).length;



    const markAsRead = async (id) => {
        try {
            // 🔥 backend ko call
            await API.put(`/notifications/read/${id}`);

            // UI update
            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === id ? { ...n, isRead: true } : n
                )
            );
        } catch (err) {
            console.log(err);
        }
    };
    const markAllAsRead = async () => {
        try {
            await API.put("/notifications/read-all");

            // UI update (sab read)
            setNotifications((prev) =>
                prev.map((n) => ({ ...n, isRead: true }))
            );
        } catch (err) {
            console.log(err);
        }
    };
    const openNotifications = async () => {
        try {
            setShowNoti(true);

            const { data } = await API.get("/notifications");
            setNotifications(data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleScroll = (e) => {
        const bottom =
            e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

        if (bottom) {
            setVisibleCount((prev) => prev + 15);
        }
    };

    const visibleNotifications = notifications.slice(0, visibleCount);

    if (!user) return null;

    return (
        <div className=" overflow-hidden relative text-white pb-16 md:pb-0">

            {/* 🌄 BACKGROUND FIXED */}
            <div className="fixed inset-0 -z-10">
                <img src="/bg.jpg" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* 💎 NAVBAR */}
            <nav className="backdrop-blur-xl bg-white/10 border-b border-white/20 
            px-6 py-3 flex items-center justify-between  top-0 z-50">

                <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                    💬 ChatNova
                </h1>

                <div className="flex items-center gap-5">
                    {/* 💻 DESKTOP NAV ICONS */}
                    <div className="hidden md:flex items-center gap-5">

                        <Link href="/home" className="hover:text-gray-300">
                            <Home size={20} />
                        </Link>

                        <Link href="/chat" className="hover:text-gray-300">
                            <MessageCircle size={20} />
                        </Link>

                        <Link href="/friends" className="hover:text-gray-300">
                            <Users size={20} />
                        </Link>

                        {/* <button onClick={logout} className="text-red-400 hover:text-red-500">
                            <LogOut size={20} />
                        </button> */}
                    </div>

                    {/* 🔔 Notification */}
                    <div className="relative z-50">
                        <Bell
                            size={20}
                            className="cursor-pointer"
                            onClick={openNotifications}
                        />

                        {unread > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] px-1 rounded-full">
                                {unread}
                            </span>
                        )}
                    </div>


                    {/* Avatar */}
                    <Link href="/profile">
                        <div className="w-9 h-9 rounded-full bg-white/20 overflow-hidden flex items-center justify-center font-bold">

                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt="profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                user.username?.charAt(0).toUpperCase()
                            )}

                        </div>
                    </Link>
                </div>
            </nav>

            {/* 📄 CONTENT (SCROLL FIX HERE) */}
            <div className="h-[calc(100vh-115px)] lg:h-[calc(100vh-60px)] ">
                {children}
            </div>

            {/* 📱 BOTTOM NAV (same as before) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 
            backdrop-blur-xl bg-white/10 border-t border-white/20 
            flex justify-around items-center py-3 z-50">

                <Link href="/home">
                    <Home size={22} />
                </Link>

                <Link href="/chat">
                    <MessageCircle size={24} />
                </Link>
                <Link href="/friends">
                    <Users size={24} />
                </Link>

                {/* <Link href="/profile">
                    <User size={22} />
                </Link> */}
            </div>

            {/* 🔔 NOTIFICATION SIDEBAR */}
            <div className={`fixed inset-0 z-50 ${showNoti ? "visible" : "invisible"}`}>

                {/* overlay */}
                <div
                    onClick={() => setShowNoti(false)}
                    className="absolute inset-0 bg-black/50"
                />

                {/* panel */}
                <div className={`absolute right-0 top-0 h-full w-80 
                backdrop-blur-xl bg-white/10 border-l border-white/20 
                p-4 transition-transform duration-300
                ${showNoti ? "translate-x-0" : "translate-x-full"}`}>

                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold">🔔 Notifications</h2>

                        <button
                            onClick={markAllAsRead}
                            className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition"
                        >
                            Mark all
                        </button>
                    </div>

                    <div
                        onScroll={handleScroll}
                        className="space-y-2 max-h-[80vh] overflow-y-auto pr-1"
                    >
                        {visibleNotifications.length === 0 ? (
                            <p className="text-white/60 text-sm">
                                No notifications
                            </p>
                        ) : (
                            visibleNotifications.map((n) => (
                                <div
                                    key={n._id}
                                    onClick={() => markAsRead(n._id)}
                                    className={`p-3 rounded-lg cursor-pointer 
                                    ${!n.isRead ? "bg-white/20" : "bg-white/10"}`}
                                >
                                    {n.text}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}