"use client";

import { useEffect, useState, useRef } from "react";
import API from "@/lib/api";
import { Search, UserPlus } from "lucide-react";
import Avatar from "@/components/Avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Explore = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [visibleUsers, setVisibleUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const loaderRef = useRef(null);
    const router = useRouter();

    const LIMIT = 15;

    // 🔥 FETCH USERS (your API)
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await API.get(`/users/search?search=${search}`);
            setAllUsers(data);
            setVisibleUsers(data.slice(0, LIMIT));
            setPage(1);
        } catch {
            toast.error("Failed to fetch users");
        }
        setLoading(false);
    };

    // 🔁 Debounce search
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchUsers();
        }, 400);

        return () => clearTimeout(delay);
    }, [search]);

    // 🔽 LOAD MORE (scroll)
    const loadMore = () => {
        const nextPage = page + 1;
        const nextUsers = allUsers.slice(0, nextPage * LIMIT);

        setVisibleUsers(nextUsers);
        setPage(nextPage);
    };

    // 👇 Infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        });

        if (loaderRef.current) observer.observe(loaderRef.current);

        return () => observer.disconnect();
    }, [visibleUsers]);

    // 🧠 SORT
    const sortedUsers = [...visibleUsers].sort((a, b) => {
        if (search) return 0;

        if (!a.isFriend && !a.isRequested && (b.isFriend || b.isRequested)) return -1;
        if (!b.isFriend && !b.isRequested && (a.isFriend || a.isRequested)) return 1;

        return 0;
    });

    // ➕ SEND REQUEST (instant UI update)
    const sendRequest = async (id) => {
        try {
            await API.post("/friends/send", { receiverId: id });

            // 🔥 instant update
            const updated = allUsers.map((u) =>
                u._id === id ? { ...u, isRequested: true } : u
            );

            setAllUsers(updated);
            setVisibleUsers(updated.slice(0, page * LIMIT));

            toast.success("Request sent ✅");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed");
        }
    };

    return (
        <div className="lg:w-1/3 mx-auto min-h-screen text-white p-4">

            {/* 🔍 SEARCH */}
            <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/40 p-3 rounded-xl mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 text-white/50" size={16} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/10 border border-white/20 outline-none"
                    />
                </div>
            </div>

            {/* 👥 USERS */}
            <div className="space-y-3">

                {sortedUsers.map((u) => (
                    <div
                        key={u._id}
                        className="flex justify-between items-center bg-white/10 backdrop-blur-xl p-3 rounded-xl border border-white/10"
                    >

                        {/* LEFT */}
                        <div
                            onClick={() => router.push(`/profile/${u.username}`)}
                            className="flex items-center gap-3 cursor-pointer"
                        >
                            <Avatar src={u.profilePic} size={45} />
                            <div>
                                <p>{u.username}</p>
                                <p className="text-xs text-white/50">
                                    {u.isFriend
                                        ? "Friend"
                                        : u.isRequested
                                            ? "Requested"
                                            : "New User"}
                                </p>
                            </div>
                        </div>

                        {/* RIGHT */}
                        {!u.isFriend && !u.isRequested && (
                            <button
                                onClick={() => sendRequest(u._id)}
                                className="bg-blue-500 px-3 py-1 rounded-lg flex items-center gap-1 text-sm"
                            >
                                <UserPlus size={14} />
                                Add
                            </button>
                        )}

                        {u.isRequested && (
                            <button className="bg-gray-500 px-3 py-1 rounded-lg text-sm">
                                Requested
                            </button>
                        )}

                        {u.isFriend && (
                            <button className="bg-green-500 px-3 py-1 rounded-lg text-sm">
                                Friend
                            </button>
                        )}
                    </div>
                ))}

                {/* 🔄 Loader */}
                {loading && (
                    <p className="text-center text-white/50">Loading...</p>
                )}

                {/* 👇 Scroll trigger */}
                <div ref={loaderRef}></div>

            </div>
        </div>
    );
};

export default Explore;