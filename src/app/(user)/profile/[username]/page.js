"use client";

import { useEffect, useState, useRef } from "react";
import API from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import {
    Pencil,
    LogOut,
    Users,
    Calendar,
    MessageCircle,
    Check,
    MoreVertical,
    Cake
} from "lucide-react";

import { toast } from "sonner";
import PostCard from "@/components/PostCard";

export default function UserProfile() {
    const { username } = useParams();
    const router = useRouter();

    const [friendStatus, setFriendStatus] = useState("none");
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [posts, setPosts] = useState([]); // ✅ FIX

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // 🔥 CLICK OUTSIDE
    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

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

    // 🔥 FETCH POSTS
    useEffect(() => {
        if (!user?._id) return;

        const fetchPosts = async () => {
            try {
                const { data } = await API.get(`/posts/user/${user._id}`);
                setPosts(data);
            } catch {
                toast.error("Failed to load posts");
            }
        };

        fetchPosts();
    }, [user?._id]);

    // 🔥 FRIEND STATUS
    useEffect(() => {
        if (!user?._id) return;

        const fetchStatus = async () => {
            try {
                const { data } = await API.get(`/friends/status/${user._id}`);
                setFriendStatus(data.status || "none");
            } catch {
                setFriendStatus("none");
            }
        };

        fetchStatus();
    }, [user?._id]);

    if (!user || !currentUser) return null;

    const isMe = currentUser?._id === user?._id;

    const onUpdate = (id, updatedPost) => {
        setPosts(prev =>
            prev.map(p => (p._id === id ? updatedPost : p))
        );
    };

    return (
        <div className="h-screen overflow-y-auto scrollbar-hide bg-black text-white lg:w-1/3 lg:mx-auto">

            {/* 🔝 COVER */}
            <div className="h-40 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 relative">

                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 px-4 bg-black/40 p-2 rounded-full backdrop-blur cursor-pointer"
                >
                    ←
                </button>

                <div className="absolute top-4 right-4" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="bg-black/40 p-2 rounded-full backdrop-blur cursor-pointer"
                    >
                        <MoreVertical size={20} />
                    </button>
                </div>
            </div>

            {/* PROFILE */}
            <div className="px-4 -mt-12">

                <div className="flex justify-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-blue-500 p-[3px] z-50">
                        <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center text-2xl font-bold ">
                            {user.profilePic ? (
                                <img src={user.profilePic} className="w-full h-full object-cover" />
                            ) : (
                                user.username[0].toUpperCase()
                            )}
                        </div>
                    </div>
                </div>

                <div className="text-center mt-3">
                    <h2 className="text-xl font-semibold">{user.username}</h2>
                </div>

                <p className="text-center mt-3 text-sm text-white/80 px-4">
                    {user.bio || "No bio added"}
                </p>

                <div className="flex justify-center gap-8 mt-4 text-sm text-white/70">


                    {user.dob && (
                        <div className="flex items-center gap-2">
                            <Cake size={16} />
                            <span>
                                {new Date(user.dob).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "short",
                                })}
                            </span>
                        </div>
                    )}


                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>
                            {new Date(user.createdAt).toLocaleDateString("en-GB", {
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                    </div>

                </div>

                {/* ACTION */}
                <div className="mt-6 space-y-3">
                    {isMe ? (
                        <>
                            <button className="w-full py-3 rounded-xl bg-white text-black flex items-center justify-center gap-2 cursor-pointer">
                                <Pencil size={18} /> Edit Profile
                            </button>

                            <button className="w-full py-3 rounded-xl bg-red-500 flex items-center justify-center gap-2 cursor-pointer">
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            {friendStatus === "friends" && (
                                <div className="flex gap-3">
                                    <button className="flex-1 py-3 rounded-xl bg-green-500 flex items-center justify-center gap-2">
                                        <Check size={18} /> Friends
                                    </button>

                                    <button
                                        className="flex-1 py-3 rounded-xl bg-white text-black flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <MessageCircle size={18} /> Chat
                                    </button>
                                </div>
                            )}

                            {friendStatus === "none" && (
                                <button className="w-full py-3 rounded-xl bg-blue-500 cursor-pointer">
                                    Add Friend
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* POSTS */}
                <div className="mt-6 space-y-4">
                    {posts.map((p) => (
                        <PostCard
                            key={p._id}
                            post={p}
                            isOwner={p.user?._id === currentUser?._id} // ✅ FIX
                            onUpdate={onUpdate}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}