"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

export default function FriendsPage() {
    const [friends, setFriends] = useState([]);
    const router = useRouter();

    useEffect(() => {
        const fetchFriends = async () => {
            const { data } = await API.get("/friends/all");
            setFriends(data);
            console.log(data)
        };

        fetchFriends();

    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white px-4 py-6">

            {/* 🔝 HEADER */}
            <h1 className="text-2xl font-semibold mb-6 tracking-wide">
                👥 My Friends
            </h1>

            {/* ❌ EMPTY */}
            {friends.length === 0 ? (
                <div className="text-center text-white/50 mt-20">
                    No friends yet 🥲
                </div>
            ) : (
                <div className="space-y-3">

                    {friends.map((f) => (
                        <div
                            key={f._id}
                            onClick={() => router.push(`/profile/${f.username}`)}
                            className="flex items-center justify-between p-3 rounded-2xl 
                            bg-white/5 backdrop-blur-md border border-white/10
                            hover:bg-white/10 transition-all duration-200 cursor-pointer"
                        >

                            {/* LEFT */}
                            <div className="flex items-center gap-3">

                                {/* PROFILE PIC */}
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
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
                                    {/* <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full"></span> */}
                                </div>

                                {/* NAME + STATUS */}
                                <div>
                                    <p className="font-medium text-white">
                                        {f.username}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs">
                                        <span
                                            className={`w-2 h-2 rounded-full ${f.isOnline ? "bg-green-500" : "bg-gray-500"
                                                }`}
                                        ></span>

                                        <span className={f.isOnline ? "text-green-400" : "text-white/40"}>
                                            {f.isOnline ? "Online" : "Offline"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* RIGHT (optional arrow) */}
                            <div className="text-white/40 text-sm">
                                ›
                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}