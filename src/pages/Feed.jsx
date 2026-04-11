"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import PostCard from "@/components/PostCard";
import CreatePostModal from "@/components/CreatePostModal";
import { PlusSquare } from "lucide-react";

export default function Feed() {
    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);

    const fetchPosts = async () => {
        const { data } = await API.get("/posts");
        setPosts(data);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <div className="p-3 space-y-4 text-white">

            {/* 🔥 CREATE POST */}
            <div
                onClick={() => setOpen(true)}
                className="bg-white/10 backdrop-blur-xl p-3 rounded-xl 
                    cursor-pointer border border-white/10 flex items-center gap-2"
            >
                <PlusSquare size={20} />
                <span>Create Post</span>
            </div>

            {/* POSTS */}
            {posts.map((p) => (
                <PostCard key={p._id} post={p} refresh={fetchPosts} />
            ))}

            <CreatePostModal open={open} setOpen={setOpen} refresh={fetchPosts} />
        </div>
    );
}