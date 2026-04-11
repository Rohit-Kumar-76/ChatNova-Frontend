"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import {
    UserCheck,
    Users,
    UserPlus,
    Check
} from "lucide-react";
import Avatar from "@/components/Avatar";

export default function FriendsPage() {
    const [friends, setFriends] = useState([]);
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res1 = await API.get("/friends/requests");
            const res2 = await API.get("/users/search");

            setRequests(res1.data);
            setUsers(res2.data);
        };

        fetchData();
    }, []);

    const topRequests = requests.slice(0, 3);
    const suggested = users.filter(u => !u.isRequested).slice(0, 5);
    const requestedUsers = users.filter(u => u.isRequested).slice(0, 5);

    useEffect(() => {
        const fetchFriends = async () => {
            const { data } = await API.get("/friends/all");
            setFriends(data);
        };

        fetchFriends();
    }, []);

    return (
        <div className=" lg:w-1/2 mx-auto min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-4 py-6">

            {/* 🔝 HEADER */}


            {/* 🔥 HORIZONTAL FRIENDS */}
            {friends.length > 0 && (
                <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide">

                    {friends.map((f) => (
                        <div
                            key={f._id}
                            onClick={() => router.push(`/profile/${f.username}`)}
                            className="flex flex-col items-center cursor-pointer min-w-[60px]"
                        >

                            {/* DP */}
                            <div className="relative">
                                <div className="w-14 h-14 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border border-white/10">
                                    {f.profilePic ? (
                                        <img
                                            src={f.profilePic}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="font-bold">
                                            {f.username.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>

                                {/* 🟢 ONLINE DOT */}
                                <span
                                    className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-black rounded-full ${f.isOnline ? "bg-green-500" : "bg-gray-500"
                                        }`}
                                ></span>
                            </div>

                            {/* NAME (truncate) */}
                            <p className="text-xs mt-1 text-center w-14 truncate">
                                {f.username}
                            </p>
                        </div>
                    ))}

                </div>
            )}

            {/* 👇 SPACE FOR NEXT UI */}
            <div className="mt-6 space-y-6">

                {/* 🔔 REQUESTS */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4">

                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <UserCheck size={18} />
                            <h2 className="font-semibold">Requests</h2>
                        </div>

                        {requests.length > 3 && (
                            <button
                                onClick={() => router.push("/requests")}
                                className="text-sm text-blue-400 hover:underline"
                            >
                                See more
                            </button>
                        )}
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

                                <button className="bg-green-500 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                                    <Check size={14} />
                                    Accept
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🌟 SUGGESTED */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 scrollbar-hide">

                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Users size={18} />
                            <h2 className="font-semibold">Suggested</h2>
                        </div>

                        {users.length > 3 && (
                            <button
                                onClick={() => router.push("/explore")}
                                className="text-sm text-blue-400 hover:underline"
                            >
                                Explore more
                            </button>
                        )}
                    </div>

                    {/* 📱 height responsive */}
                    <div className="space-y-3 max-h-[40vh] overflow-y-auto scrollbar-hide">

                        {users
                            .filter((u) => !u.isRequested)
                            .slice(0, 6)
                            .map((u) => (
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

                                    <button className="bg-blue-500 px-3 py-1 rounded-lg text-sm flex items-center gap-1">
                                        <UserPlus size={14} />
                                        Add
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>


            </div>

        </div>
    );
}