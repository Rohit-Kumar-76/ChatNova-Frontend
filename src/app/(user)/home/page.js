"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";
import { PlusSquare } from "lucide-react";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [open, setOpen] = useState(false);

    // 🔥 get current user
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setCurrentUser(JSON.parse(stored));
    }, []);

    // 🔥 fetch posts
    const fetchPosts = async () => {
        const { data } = await API.get("/posts");
        setPosts(data);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // 🔥 delete UI update
    const handleDelete = (id) => {
        setPosts((prev) => prev.filter((p) => p._id !== id));
    };


    const onUpdate = (id, updatedPost) => {
        setPosts(prev =>
            prev.map(p => (p._id === id ? updatedPost : p))
        );
    };


    return (
        <div className="lg:w-1/2 mx-auto p-3 space-y-4 text-white h-full overflow-y-auto scrollbar-hide pb-5">

            {/* CREATE POST */}
            <div
                onClick={() => setOpen(true)}
                className="bg-white/10 p-3 rounded-xl cursor-pointer flex gap-2 items-center"
            >
                <PlusSquare size={20} />
                Create Post
            </div>

            {/* POSTS */}
            {posts.map((p) => (
                <PostCard
                    key={p._id}
                    post={p}
                    isOwner={p.user?._id === currentUser?._id}
                    refresh={handleDelete} // 🔥 IMPORTANT
                    onUpdate={onUpdate}

                />
            ))}

            {/* MODAL */}
            <CreatePostModal open={open} setOpen={setOpen} refresh={fetchPosts} />
        </div>
    );
}