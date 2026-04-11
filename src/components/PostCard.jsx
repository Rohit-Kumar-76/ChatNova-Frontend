"use client";

import { useState } from "react";
import API from "@/lib/api";
import Link from "next/link";
import {
    Heart,
    MessageCircle,
    MoreVertical,
    Trash2,
    Pencil
} from "lucide-react";
import { toast } from "sonner";
import Avatar from "./Avatar";

export default function PostCard({ post, refresh, isOwner, onUpdate }) {
    const [menu, setMenu] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editText, setEditText] = useState(post.text || "");
    // const [posts, setPosts] = useState([]);

    // 🔥 current user check (for routing)
    const stored =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user"))
            : null;

    const isMyPost = stored?._id === post.user?._id;

    const profileLink = isMyPost
        ? "/profile"
        : `/profile/${post.user?.username}`;

    // 🗑 DELETE
    const deletePost = async () => {
        try {
            const confirm = window.confirm("Are you sure");

            if (!confirm) return;

            await API.delete(`/posts/${post._id}`);
            refresh?.(post._id); // 🔥 instant UI update
            toast.success("Deleted");
        } catch {
            toast.error("Delete failed");
        }
    };

    // ✏ EDIT (ONLY TEXT)
    const updatePost = async () => {
        try {
            await API.put(`/posts/${post._id}`, {
                text: editText,
            });

            post.text = editText; // 🔥 instant UI update
            setEditOpen(false);

            toast.success("Updated");
        } catch {
            toast.error("Update failed");
        }
    };

    const likePost = async () => {
        await API.put(`/posts/like/${post._id}`);

        const { data } = await API.get(`/posts/${post._id}`);
        onUpdate(post._id, data); // parent me update
    };

    return (
        <>
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-xl border border-white/10">

                {/* TOP */}
                <div className="flex justify-between items-center">

                    <Link href={profileLink} className="flex items-center gap-2 cursor-pointer">
                        <Avatar src={post.user?.profilePic} className="w-8 h-8 rounded-full" />

                        <div>
                            <p>{post.user?.username}</p>
                            <p className="text-xs text-gray-400">
                                {new Date(post.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </Link>

                    {/* MENU */}
                    {isOwner && (
                        <div className="relative">

                            <div className="flex mt-2 rounded-xl text-sm">

                                <button
                                    onClick={() => setEditOpen(true)}
                                    className=" p-2 cursor-pointer rounded-full hover:bg-white/10"
                                >
                                    <Pencil size={14} />
                                </button>

                                <button
                                    onClick={deletePost}
                                    className="p-2 cursor-pointer rounded-full text-red-400 hover:bg-white/10"
                                >
                                    <Trash2 size={14} />
                                </button>

                            </div>

                        </div>
                    )}
                </div>

                {/* TEXT */}
                <p className="mt-2 text-sm leading-relaxed">
                    {post.text?.length > 120
                        ? post.text.slice(0, 120) + "..."
                        : post.text}
                </p>
                {post.text?.length > 120 && (
                    <Link
                        href={`/home/${post._id}`}
                        className="text-blue-400 text-sm cursor-pointer"
                    >
                        View more
                    </Link>
                )}

                {/* IMAGE */}
                {post.image && (
                    <div className="mt-2 bg-black flex justify-center max-h-[400px]">
                        <img src={post.image} className="object-contain max-h-full" />
                    </div>
                )}

                {/* ACTION */}
                <div className="flex gap-5 mt-3">
                    <button className="flex gap-1 cursor-pointer hover:text-red-400 transition" onClick={likePost}>
                        <Heart size={18} /> {post.likes?.length || 0}
                    </button>

                    <button className="flex gap-1 cursor-pointer">
                        <MessageCircle size={18} /> <Link href={`/home/${post?._id}`}>Comment</Link>
                    </button>
                </div>
            </div>

            {/* ✏ EDIT MODAL */}
            {editOpen && (
                <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">

                    <div className="w-[90%] max-w-md p-5 rounded-2xl bg-white/10 backdrop-blur-xl text-white">

                        <h2 className="mb-3">Edit Post</h2>

                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 rounded-xl bg-white/20"
                            rows="4"
                        />

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setEditOpen(false)}
                                className="flex-1 bg-gray-500 py-2 rounded-xl cursor-pointer"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={updatePost}
                                className="flex-1 bg-blue-500 py-2 rounded-xl cursor-pointer"
                            >
                                Update
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}