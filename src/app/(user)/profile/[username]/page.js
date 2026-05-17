"use client";

import { useEffect, useState, useRef } from "react";
import API from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import {

    Calendar,

    MoreVertical,
    Cake
} from "lucide-react";

import { toast } from "sonner";
import PostCard from "@/components/PostCard";
import Loader from "@/components/Loader";
import Link from "next/link";

export default function UserProfile() {
    const { username } = useParams();
    const router = useRouter();

    const [friendStatus, setFriendStatus] = useState("none");
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [posts, setPosts] = useState([]); // ✅ FIX
    const [loading, setLoading] = useState(false);

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const [isBlocked, setIsBlocked] = useState(false);
    //Block status
    useEffect(() => {
        if (!user?._id) return;

        const checkBlock = async () => {
            try {
                const { data } = await API.get(`/users/block-status/${user._id}`);
                setIsBlocked(data.isBlocked);
                console.log(isBlocked);
            } catch (err) {
                console.log(err);
            }
        };

        checkBlock();
    }, [user?._id]);

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
            setLoading(true);

            try {
                const storedUser = localStorage.getItem("user");
                const me = storedUser ? JSON.parse(storedUser) : null;
                setCurrentUser(me);

                const { data } = await API.get(`/users/profile/${username}`);
                setUser(data);
            }
            catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [username]);

    // 🔥 FETCH POSTS
    useEffect(() => {
        if (!user?._id) return;

        const fetchPosts = async () => {
            setLoading(true);
            try {
                const { data } = await API.get(`/posts/user/${user._id}`);
                setPosts(data);
            } catch {
                toast.error("Failed to load posts");
            } finally {
                setLoading(false);
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

    // const isMe = currentUser?._id === user?._id;

    const onUpdate = (id, updatedPost) => {
        setPosts(prev =>
            prev.map(p => (p._id === id ? updatedPost : p))
        );
    };



    // ✅ SEND REQUEST (same as FriendsPage)
    const sendRequest = async () => {
        try {
            const { data } = await API.post("/friends/send", {
                receiverId: user._id
            });

            setFriendStatus("sent");
            toast.success(data.message);

        } catch (err) {
            console.log(err.response?.data);

            const msg = err.response?.data?.message;

            if (err.response?.status === 403) {
                toast.error(msg); // 🔥 "User is blocked"
            } else {
                toast.error(msg || "Something went wrong");
            }
        }
    };

    // ❌ CANCEL REQUEST
    const cancelRequest = async () => {

        try {
            await API.post("/friends/cancel", {
                receiverId: user._id
            });

            setFriendStatus("none");
        } catch (err) {
            console.log(err);
        }
    };

    // ❌ REMOVE FRIEND
    const removeFriend = async () => {
        const conf = window.confirm("Are you sure to Unfriend");
        if (!conf) return;
        try {
            await API.post("/friends/unfriend", {
                userId: user._id,
            });
            setFriendStatus("none");
        } catch (err) {
            console.log(err);
        }
    };

    const handleBlock = async () => {
        try {
            await API.post("/users/block", { userId: user._id });
            setIsBlocked(true); // 🔥 add this
            toast.success("User Blocked!");
        } catch (error) {
            toast.error("Error");
        }
    };

    const handleUnblock = async () => {
        try {
            await API.post("/users/unblock", { userId: user._id });
            setIsBlocked(false); // 🔥 add this
            toast.success("User Unblocked!");
        } catch (error) {
            toast.error("Error");
        }
    };


    return (
        <div className="h-screen overflow-y-auto scrollbar-hide bg-black text-white lg:w-1/3 lg:mx-auto">

            {loading && <Loader />}



            {/* 🔝 COVER */}
            <div className="h-40 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 relative">

                {menuOpen && (
                    <div className="absolute right-0 mt-2 bg-black border border-white/10 rounded-xl p-2 w-40" ref={menuRef}>
                        {!isBlocked ? (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleBlock();
                                }}
                                className="w-full text-left px-3 py-2 hover:bg-white/10 rounded"
                            >
                                Block User
                            </button>
                        ) : (

                            <button
                                onClick={() => handleUnblock()}
                                className="w-full text-left px-3 py-2 hover:bg-white/10 rounded"
                            >
                                Unblock User
                            </button>
                        )
                        }

                    </div>
                )}

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

                <div className="mt-6 space-y-3 p-6">

                    {friendStatus === "friends" && (
                        <div className="flex gap-3">
                            <button
                                onClick={removeFriend}
                                className="flex-1 py-3 rounded-xl bg-red-500 cursor-pointer"
                            >
                                Friend
                            </button>

                            <button
                                onClick={() => router.push("/chat")}
                                className="flex-1 py-3 rounded-xl bg-white text-black cursor-pointer"
                            >
                                Chat
                            </button>
                        </div>
                    )}

                    {friendStatus === "none" && (
                        <button
                            onClick={sendRequest}
                            className="w-full py-3 rounded-xl bg-blue-500 cursor-pointer"
                        >
                            Add Friend
                        </button>
                    )}

                    {friendStatus === "sent" && (
                        <button
                            onClick={() => cancelRequest()}
                            className="w-full py-3 rounded-xl bg-gray-500 cursor-pointer"
                        >
                            Requested
                        </button>
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