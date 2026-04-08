"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import {
    Pencil,
    LogOut,
    Users,
    Calendar,
    MessageCircle,
    Check
} from "lucide-react";

export default function UserProfile() {
    const { username } = useParams();
    const router = useRouter();

    const [friendStatus, setFriendStatus] = useState("none");
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // 🔥 LOAD USER
    useEffect(() => {
        const load = async () => {
            const storedUser = localStorage.getItem("user");
            const me = storedUser ? JSON.parse(storedUser) : null;
            setCurrentUser(me);

            const { data } = await API.get(`/users/profile/${username}`);
            setUser(data);
        };

        load();
    }, [username]);

    // 🔥 FETCH FRIEND STATUS (FIXED)
    useEffect(() => {
        if (!user?._id) return;

        const fetchStatus = async () => {
            try {
                const { data } = await API.get(`/friends/status/${user._id}`);
                setFriendStatus(data.status || "none");
                console.log(data);
            } catch (err) {
                console.log("Status error:", err);
                setFriendStatus("none");
            }
        };

        fetchStatus();
    }, [user?._id]);

    if (!user || !currentUser) return null;

    const isMe = currentUser?._id === user?._id;

    // ➕ SEND REQUEST
    const sendRequest = async () => {
        if (friendStatus === "blocked") return;

        await API.post("/friends/send", {
            receiverId: user._id,
        });

        setFriendStatus("sent");
    };

    // ✅ ACCEPT
    const acceptRequest = async () => {
        await API.post(`/friends/accept/${user._id}`);
        setFriendStatus("friends");
    };

    // ❌ REJECT
    const rejectRequest = async () => {
        await API.post(`/friends/reject/${user._id}`);
        setFriendStatus("none");
    };

    // 💬 CHAT
    const openChat = () => {
        if (friendStatus !== "friends") return;
        router.push(`/chat?user=${user._id}`);
    };

    return (
        <div className="min-h-screen bg-black text-white flex justify-center items-center">

            <div className="w-[360px] backdrop-blur-xl bg-white/10 border border-white/20 
            rounded-3xl p-6 shadow-2xl">

                {/* PROFILE */}
                <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold overflow-hidden">
                        {user.profilePic ? (
                            <img src={user.profilePic} className="w-full h-full object-cover" />
                        ) : (
                            user.username.charAt(0).toUpperCase()
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold">{user.username}</h2>
                        <p className="text-sm text-white/60">{user.email}</p>
                    </div>
                </div>

                {/* BIO */}
                <p className="mt-4 text-sm italic text-white/80">
                    {user.bio || "No bio"}
                </p>

                {/* DOB */}
                <div className="mt-2 text-xs text-white/60">
                    {user.dob &&
                        new Date(user.dob).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                        })}
                </div>

                {/* STATS */}
                <div className="flex justify-between mt-5 text-sm text-white/80">
                    <div className="flex items-center gap-2">
                        <Users size={16} />
                        {user.friends?.length || 0}
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date(user.createdAt).toLocaleDateString("en-GB", {
                            month: "short",
                            year: "numeric",
                        })}
                    </div>
                </div>

                {/* ACTION */}
                <div className="mt-6">

                    {/* 👤 MY PROFILE */}
                    {isMe && (
                        <div className="flex gap-3">
                            <button className="flex-1 bg-white text-black py-2 rounded-xl flex justify-center gap-2">
                                <Pencil size={16} /> Edit
                            </button>

                            <button className="flex-1 bg-red-500 py-2 rounded-xl flex justify-center gap-2">
                                <LogOut size={16} /> Logout
                            </button>
                        </div>
                    )}

                    {/* 👥 OTHER USER */}
                    {!isMe && (
                        <>
                            {/* 🚫 BLOCK */}
                            {friendStatus === "blocked" && (
                                <p className="text-center text-red-400 text-sm">
                                    You blocked this user
                                </p>
                            )}

                            {/* ✅ FRIENDS */}
                            {friendStatus === "friends" && (
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-green-500 py-2 rounded-xl flex justify-center gap-2">
                                        <Check size={16} /> Friends
                                    </button>

                                    <button
                                        onClick={openChat}
                                        className="flex-1 bg-white text-black py-2 rounded-xl flex justify-center gap-2"
                                    >
                                        <MessageCircle size={16} /> Chat
                                    </button>
                                </div>
                            )}

                            {/* ⏳ SENT */}
                            {friendStatus === "sent" && (
                                <button className="w-full bg-yellow-500 py-2 rounded-xl">
                                    Requested
                                </button>
                            )}

                            {/* 📩 RECEIVED */}
                            {friendStatus === "received" && (
                                <div className="flex gap-2">
                                    <button
                                        onClick={acceptRequest}
                                        className="flex-1 bg-green-500 py-2 rounded-xl"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={rejectRequest}
                                        className="flex-1 bg-red-500 py-2 rounded-xl"
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}

                            {/* ➕ NONE */}
                            {friendStatus === "none" && (
                                <button
                                    onClick={sendRequest}
                                    className="w-full bg-blue-500 py-2 rounded-xl"
                                >
                                    Add Friend
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}