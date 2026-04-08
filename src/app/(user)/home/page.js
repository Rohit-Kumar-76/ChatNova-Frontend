"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Image from "next/image";
import {
    Search,
    UserPlus,
    Check,
    Users,
    UserCheck,
} from "lucide-react";

import Avatar from "@/components/Avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const fetchUsers = async () => {
        try {
            const { data } = await API.get(`/users/search?search=${search}`);
            setUsers(data);
        } catch {
            toast.error("Failed to fetch users");
        }
    };

    const fetchRequests = async () => {
        try {
            const { data } = await API.get("/friends/requests");
            setRequests(data);
        } catch {
            toast.error("Failed to fetch requests");
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRequests();
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [search]);

    // ➕ SEND REQUEST
    const sendRequest = async (id) => {
        try {
            await API.post("/friends/send", { receiverId: id });

            toast.success("Friend request sent ✅");

            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Request failed");
        }
    };

    // ✅ ACCEPT REQUEST
    const acceptRequest = async (id) => {
        try {
            await API.put(`/friends/accept/${id}`);

            setRequests((prev) => prev.filter((r) => r._id !== id));

            toast.success("Request accepted 🎉");
        } catch {
            toast.error("Failed to accept request");
        }
    };

    return (
        <div className="relative text-white p-4">

            {/* 🌄 Background */}
            <div className="absolute inset-0 -z-10">
                <Image src="/bg.jpg" alt="bg" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* GRID */}
            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">

                {/* 🤝 REQUESTS */}
                <div className="backdrop-blur-2xl min-h-[120px] max-h-[400px] overflow-hidden bg-white/10 border border-white/20 rounded-2xl p-5 shadow-xl">

                    <div className="flex items-center gap-2 mb-4">
                        <UserCheck size={20} />
                        <h2 className="text-xl font-semibold">
                            Friend Requests
                        </h2>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto">

                        {requests.length === 0 && (
                            <p className="text-white/60 text-sm">
                                No pending requests
                            </p>
                        )}

                        {requests.map((r) => (
                            <div key={r._id} className="flex justify-between items-center bg-white/10 p-3 rounded-xl">

                                <div className="flex items-center gap-3">
                                    <div
                                        onClick={() => router.push(`/profile/${r.sender.username}`)}
                                        className="cursor-pointer"
                                    >
                                        <Avatar src={r.sender.profilePic} size={40} />
                                    </div>

                                    <span
                                        onClick={() => router.push(`/profile/${r.sender.username}`)}
                                        className="cursor-pointer"
                                    >
                                        {r.sender.username}
                                    </span>
                                </div>

                                <button
                                    onClick={() => acceptRequest(r._id)}
                                    className="flex items-center gap-1 bg-green-500 px-3 py-1 rounded-lg"
                                >
                                    <Check size={14} />
                                    Accept
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🔍 USERS */}
                <div className="backdrop-blur-2xl min-h-[150px] max-h-[400px] overflow-hidden bg-white/10 border border-white/20 rounded-2xl p-5 shadow-xl">

                    <div className="flex items-center gap-2 mb-4">
                        <Users size={20} />
                        <h2 className="text-xl font-semibold">
                            Find Users
                        </h2>
                    </div>

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-3 text-white/60" size={16} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/20 border border-white/30"
                        />
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto">

                        {users.length === 0 && (
                            <p className="text-white/60 text-sm">
                                No users found
                            </p>
                        )}

                        {users.map((u) => (
                            <div key={u._id} className="flex justify-between items-center bg-white/10 p-3 rounded-xl">

                                <div className="flex items-center gap-3">
                                    <div
                                        onClick={() => router.push(`/profile/${u.username}`)}
                                        className="cursor-pointer"
                                    >
                                        <Avatar src={u.profilePic} size={40} />
                                    </div>

                                    <span
                                        onClick={() => router.push(`/profile/${u.username}`)}
                                        className="cursor-pointer"
                                    >
                                        {u.username}
                                    </span>
                                </div>

                                <button
                                    onClick={() => sendRequest(u._id)}
                                    className="flex items-center gap-1 bg-blue-500 px-3 py-1 rounded-lg"
                                >
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