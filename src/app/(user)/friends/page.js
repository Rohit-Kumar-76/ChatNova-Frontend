"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import {
    UserCheck,
    Users,
    UserPlus
} from "lucide-react";
import Avatar from "@/components/Avatar";
import Loader from "@/components/Loader";

export default function FriendsPage() {
    const [friends, setFriends] = useState([]);
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const [reqRes, userRes, friendRes] = await Promise.all([
                    API.get("/friends/requests"),
                    API.get("/users/search"),
                    API.get("/friends/all")
                ]);

                setRequests(reqRes.data);
                setUsers(userRes.data);
                setFriends(friendRes.data);

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    // ================= FUNCTIONS =================

    const sendRequest = async (userId) => {
        try {
            await API.post("/friends/send", {
                receiverId: userId
            });

            setUsers(prev =>
                prev.map(u =>
                    u._id === userId ? { ...u, isRequested: true } : u
                )
            );
        } catch (err) {
            console.log(err);
        }
    };

    const acceptRequest = async (requestId) => {
        try {
            await API.put(`/friends/accept/${requestId}`);

            setRequests(prev => prev.filter(r => r._id !== requestId));

            const acceptedUser = requests.find(r => r._id === requestId);
            if (acceptedUser) {
                setFriends(prev => [...prev, acceptedUser.sender]);
            }

        } catch (err) {
            console.log(err);
        }
    };

    const rejectRequest = async (requestId) => {
        try {
            await API.delete(`/friends/reject/${requestId}`);

            setRequests(prev => prev.filter(r => r._id !== requestId));

        } catch (err) {
            console.log(err);
        }
    };

    const cancelRequest = async (userId) => {
        try {
            await API.post("/friends/cancel", {
                receiverId: userId
            });

            setUsers(prev =>
                prev.map(u =>
                    u._id === userId
                        ? { ...u, isRequested: false }
                        : u
                )
            );

        } catch (err) {
            console.log(err);
        }
    };

    // =================================================

    return (
        <div className="lg:w-1/2 mx-auto min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-4 py-6">

            {loading && <Loader />}

            {/* 🔥 FRIENDS */}
            {friends.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">
                    {friends.map((f) => (
                        <div
                            key={f._id}
                            onClick={() => router.push(`/profile/${f.username}`)}
                            className="flex flex-col items-center cursor-pointer min-w-[60px]"
                        >
                            <div className="relative">
                                <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border border-white/10">
                                    {f.profilePic ? (
                                        <img src={f.profilePic} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="font-bold">
                                            {f.username.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                <span className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-black rounded-full ${f.isOnline ? "bg-green-500" : "bg-gray-500"}`} />
                            </div>

                            <p className="text-xs mt-1 text-center w-14 truncate">
                                {f.username}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* 🔔 REQUESTS */}
            <div className="mt-6 space-y-6">
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4">

                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <UserCheck size={18} />
                            <h2 className="font-semibold">Requests</h2>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {requests.slice(0, 3).map((r) => (
                            <div
                                key={r._id}
                                className="flex justify-between items-center bg-white/10 p-3 rounded-xl"
                            >
                                <div
                                    onClick={() => router.push(`/profile/${r.sender.username}`)}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <Avatar src={r.sender.profilePic} size={40} />
                                    <span>{r.sender.username}</span>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => acceptRequest(r._id)}
                                        className="bg-green-500 px-3 py-1 rounded-lg text-sm"
                                    >
                                        Accept
                                    </button>

                                    <button
                                        onClick={() => rejectRequest(r._id)}
                                        className="bg-red-500 px-3 py-1 rounded-lg text-sm"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🌟 SUGGESTED */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4">

                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Users size={18} />
                            <h2 className="font-semibold">Suggested</h2>
                        </div>

                        {users.length > 5 && (
                            <button
                                onClick={() => router.push("/friends/explore")}
                                className="text-sm text-blue-400 hover:underline"
                            >
                                Explore more
                            </button>
                        )}
                    </div>

                    <div className="space-y-3 max-h-[40vh] overflow-y-auto scrollbar-hide">
                        {users.slice(0, 5).map((u) => (
                            <div
                                key={u._id}
                                className="flex justify-between items-center bg-white/10 p-3 rounded-xl"
                            >
                                <div
                                    onClick={() => router.push(`/profile/${u.username}`)}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <Avatar src={u.profilePic} size={40} />
                                    <span>{u.username}</span>
                                </div>

                                {u.isRequested ? (
                                    <button
                                        onClick={() => cancelRequest(u._id)}
                                        className="bg-gray-500 px-3 py-1 rounded-lg text-sm"
                                    >
                                        Requested
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => sendRequest(u._id)}
                                        className="bg-blue-500 px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                                    >
                                        <UserPlus size={14} />
                                        Add
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}